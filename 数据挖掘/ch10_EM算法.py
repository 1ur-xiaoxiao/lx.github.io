"""
==============================================================================
第10章 EM算法 — 期望最大化 / 高斯混合模型 (GMM)
==============================================================================
统计思想：
  EM 算法专门处理**含有隐变量 (latent variables) 的统计模型**的参数估计问题。
  当数据"不完整"（某些变量未被观测到），直接做极大似然估计很困难。
  EM 通过交替执行 E步（期望）和 M步（最大化），迭代逼近极大似然解。

  核心思想：
    假设我们观测到 X，但还有未观测的隐变量 Z。
    目标是最大化观测数据的对数似然: ℓ(θ) = log P(X|θ) = log Σ_z P(X,Z|θ)

    直接优化很难（log 里面有求和）。
    EM 将问题转化为迭代优化 Q 函数（完全数据的期望对数似然）。

  E步 (Expectation)：
    基于当前参数 θ^(t)，计算隐变量的条件期望，构造 Q 函数：
      Q(θ|θ^(t)) = E_{Z|X,θ^(t)}[log P(X,Z|θ)]

  M步 (Maximization)：
    最大化 Q 函数，更新参数：
      θ^(t+1) = argmax_θ Q(θ|θ^(t))

  关键性质（单调性保证）：
    ℓ(θ^(t+1)) ≥ ℓ(θ^(t))
    即每次迭代，观测数据的对数似然单调不减。
    因此 EM 虽然不能保证找到全局最优，但至少不会变差。

  典型应用 — 高斯混合模型 (GMM)：
    假设数据来自 K 个高斯分布的混合：
    P(x) = Σ_k π_k · N(x|μ_k, Σ_k),  Σ_k π_k = 1

    隐变量：每个样本属于哪个高斯成分（未知）。
    参数: π_k (混合系数), μ_k (均值), Σ_k (协方差)

  EM 在 GMM 中的具体形式：
    E步：计算每个样本属于每个成分的后验概率 γ_{ik}（"责任"）
      γ_{ik} = π_k · N(x_i|μ_k,Σ_k) / Σ_j π_j · N(x_i|μ_j,Σ_j)

    M步：用加权样本更新参数
      μ_k = Σ_i γ_{ik} x_i / Σ_i γ_{ik}
      Σ_k = Σ_i γ_{ik} (x_i-μ_k)(x_i-μ_k)ᵀ / Σ_i γ_{ik}
      π_k = Σ_i γ_{ik} / n
==============================================================================
"""

import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import multivariate_normal
from sklearn.datasets import make_blobs
from sklearn.preprocessing import StandardScaler


class GaussianMixture:
    """
    高斯混合模型 (GMM)，用 EM 算法训练。

    K 个高斯成分的混合:
      P(x) = Σ_{k=1}^K π_k · N(x|μ_k, Σ_k)
    """

    def __init__(self, n_components: int = 2, max_iter: int = 100,
                 tol: float = 1e-4, covariance_type: str = 'full',
                 reg_covar: float = 1e-6):
        """
        Parameters
        ----------
        n_components : 高斯成分数 K
        max_iter : EM 最大迭代次数
        tol : 收敛容忍度（对数似然变化 < tol 时停止）
        covariance_type : 'full' (全协方差), 'diag' (对角), 'spherical' (球面)
        reg_covar : 协方差矩阵的正则化项（防止奇异）
        """
        self.n_components = n_components
        self.max_iter = max_iter
        self.tol = tol
        self.covariance_type = covariance_type
        self.reg_covar = reg_covar
        self.weights_ = None   # π_k 混合系数
        self.means_ = None     # μ_k 均值
        self.covars_ = None    # Σ_k 协方差
        self.converged_ = False
        self.n_iter_ = 0
        self.log_likelihood_history_ = []

    def fit(self, X: np.ndarray):
        n_samples, n_features = X.shape

        # ---- 初始化 ----
        # 用 K-Means 类似的方法随机初始化（实际中可用 KMeans++）
        rng = np.random.RandomState(42)
        # 随机选 K 个样本作为初始均值
        idx = rng.choice(n_samples, self.n_components, replace=False)
        self.means_ = X[idx].copy()

        # 初始协方差：用数据整体协方差
        self.covars_ = np.array([np.cov(X.T) + self.reg_covar * np.eye(n_features)
                                  for _ in range(self.n_components)])

        # 初始混合系数：均匀
        self.weights_ = np.ones(self.n_components) / self.n_components

        # ---- EM 迭代 ----
        prev_log_likelihood = -np.inf
        self.log_likelihood_history_ = []

        for iteration in range(self.max_iter):
            # ========== E 步：计算后验概率（责任） γ_{ik} ==========
            # γ_{ik} = P(z_i=k | x_i)
            #        = π_k · N(x_i|μ_k,Σ_k) / Σ_j π_j · N(x_i|μ_j,Σ_j)

            responsibilities = self._e_step(X)

            # 计算观测数据的对数似然
            # ℓ(θ) = Σ_i log(Σ_k π_k · N(x_i|μ_k,Σ_k))
            log_likelihood = self._log_likelihood(X)

            self.log_likelihood_history_.append(log_likelihood)

            # 检查收敛
            if abs(log_likelihood - prev_log_likelihood) < self.tol:
                self.converged_ = True
                break

            prev_log_likelihood = log_likelihood

            # ========== M 步：最大化 Q 函数 ==========
            self._m_step(X, responsibilities)

        self.n_iter_ = iteration + 1
        return self

    def _e_step(self, X):
        """
        E步：计算每个样本属于每个成分的后验概率（责任值）

        统计解释：
          γ_{ik} = 在给定观测 x_i 下，隐变量 z_i=k 的后验概率
          γ_{ik} 可以理解为"成分 k 对样本 i 的生成责任"。
        """
        n_samples = X.shape[0]
        responsibilities = np.zeros((n_samples, self.n_components))

        for k in range(self.n_components):
            # 对每个成分，计算 N(x_i|μ_k, Σ_k)（概率密度）
            try:
                rv = multivariate_normal(mean=self.means_[k],
                                         cov=self.covars_[k],
                                         allow_singular=True)
                responsibilities[:, k] = rv.pdf(X)
            except Exception:
                responsibilities[:, k] = 1e-300

        # 乘以混合系数 π_k
        responsibilities *= self.weights_

        # 归一化：除以 Σ_j π_j N(x_i|μ_j,Σ_j)
        row_sums = responsibilities.sum(axis=1, keepdims=True)
        row_sums = np.where(row_sums == 0, 1, row_sums)  # 防除零
        responsibilities /= row_sums

        return responsibilities

    def _m_step(self, X, responsibilities):
        """
        M步：最大化 Q 函数，更新参数。

        Q(θ|θ^(t)) = Σ_i Σ_k γ_{ik}[log π_k + log N(x_i|μ_k,Σ_k)]

        对 μ_k, Σ_k, π_k 分别求导并令为零即得更新公式：
          N_k = Σ_i γ_{ik}     （成分 k 的有效样本数）
          μ_k = (1/N_k) Σ_i γ_{ik} x_i
          Σ_k = (1/N_k) Σ_i γ_{ik} (x_i-μ_k)(x_i-μ_k)ᵀ
          π_k = N_k / n
        """
        n_samples, n_features = X.shape
        resp = responsibilities

        # 每个成分的有效样本数
        N_k = resp.sum(axis=0) + 1e-15  # 防除零

        # 更新均值
        self.means_ = (resp.T @ X) / N_k[:, np.newaxis]  # (K, d)

        # 更新混合系数
        self.weights_ = N_k / n_samples

        # 更新协方差
        for k in range(self.n_components):
            diff = X - self.means_[k]  # (n, d)
            # 加权协方差: Σ_i γ_{ik} (x_i-μ_k)(x_i-μ_k)ᵀ / N_k
            weighted_diff = resp[:, k][:, np.newaxis] * diff  # (n, d)
            cov = (weighted_diff.T @ diff) / N_k[k]

            if self.covariance_type == 'diag':
                cov = np.diag(np.diag(cov))
            elif self.covariance_type == 'spherical':
                cov = np.eye(n_features) * np.trace(cov) / n_features

            # 正则化
            cov += self.reg_covar * np.eye(n_features)
            self.covars_[k] = cov

    def _log_likelihood(self, X):
        """计算观测数据的对数似然 ℓ(θ) = Σ_i log(Σ_k π_k N(x_i|μ_k,Σ_k))"""
        n_samples = X.shape[0]
        log_prob = np.zeros((n_samples, self.n_components))

        for k in range(self.n_components):
            try:
                rv = multivariate_normal(mean=self.means_[k],
                                         cov=self.covars_[k],
                                         allow_singular=True)
                log_prob[:, k] = np.log(self.weights_[k] + 1e-15) + rv.logpdf(X)
            except Exception:
                log_prob[:, k] = -np.inf

        # log-sum-exp 技巧做稳定求和
        max_log = np.max(log_prob, axis=1)
        return np.sum(max_log + np.log(np.sum(np.exp(log_prob - max_log[:, np.newaxis]),
                                              axis=1)))

    def predict(self, X: np.ndarray) -> np.ndarray:
        """返回每个样本最可能的成分（硬分配）"""
        resp = self._e_step(X)
        return np.argmax(resp, axis=1)

    def predict_proba(self, X: np.ndarray) -> np.ndarray:
        """返回每个样本属于各成分的概率"""
        return self._e_step(X)

    def score_samples(self, X: np.ndarray) -> np.ndarray:
        """返回每个样本的对数概率密度 log P(x)"""
        n_samples = X.shape[0]
        prob = np.zeros((n_samples, self.n_components))
        for k in range(self.n_components):
            rv = multivariate_normal(mean=self.means_[k], cov=self.covars_[k],
                                     allow_singular=True)
            prob[:, k] = self.weights_[k] * rv.pdf(X)
        return np.log(np.sum(prob, axis=1) + 1e-15)


# ============================================================================
# 示例
# ============================================================================
if __name__ == "__main__":
    print("=" * 60)
    print("第10章 EM算法 — 期望最大化 / GMM")
    print("=" * 60)

    # 生成多簇高斯数据
    X, y_true = make_blobs(n_samples=300, centers=3, n_features=2,
                            cluster_std=[0.6, 0.8, 1.0], random_state=42)

    scaler = StandardScaler()
    X = scaler.fit_transform(X)

    # ---- GMM 聚类 ----
    print(f"\n--- GMM 聚类 (K=3) ---")
    gmm = GaussianMixture(n_components=3, max_iter=100)
    gmm.fit(X)

    print(f"  迭代次数: {gmm.n_iter_}")
    print(f"  收敛: {'是' if gmm.converged_ else '否'}")
    print(f"  最终对数似然: {gmm.log_likelihood_history_[-1]:.2f}")
    print(f"  混合系数 π: {gmm.weights_.round(3)}")
    print(f"  均值:\n{gmm.means_}")

    y_pred = gmm.predict(X)

    # ---- 对数似然随迭代的变化（验证单调性） ----
    print(f"\n--- 对数似然历史（验证 EM 的单调性）---")
    for i, ll in enumerate(gmm.log_likelihood_history_[:10]):
        print(f"  迭代{i+1:2d}: ℓ = {ll:.4f}")

    if len(gmm.log_likelihood_history_) > 1:
        is_monotonic = all(
            gmm.log_likelihood_history_[i] >= gmm.log_likelihood_history_[i-1]
            for i in range(1, len(gmm.log_likelihood_history_))
        )
        print(f"  对数似然单调不减: {'是 ✓' if is_monotonic else '否 ✗'}")

    # ---- 不同 K 值下的对数似然 ----
    print(f"\n--- 不同 K 值下的最大对数似然 ---")
    for K in [1, 2, 3, 4, 5]:
        gmm_k = GaussianMixture(n_components=K, max_iter=100)
        gmm_k.fit(X)
        print(f"  K={K}: 对数似然 = {gmm_k.log_likelihood_history_[-1]:.2f}")

    # ---- 可视化 ----
    print("\n--- 可视化 ---")
    try:
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

        # 左：聚类结果
        colors = ['#FF6B6B', '#4ECDC4', '#45B7D1']
        for k in range(3):
            mask = y_pred == k
            ax1.scatter(X[mask, 0], X[mask, 1], c=colors[k], label=f'成分 {k}',
                       alpha=0.6, edgecolors='k', s=40)
        ax1.scatter(gmm.means_[:, 0], gmm.means_[:, 1], c='black', marker='X',
                   s=200, linewidths=2, label='均值')
        ax1.set_title('GMM 聚类结果')
        ax1.legend()
        ax1.set_xlabel('特征 1')
        ax1.set_ylabel('特征 2')

        # 右：EM 收敛曲线
        ax2.plot(range(1, len(gmm.log_likelihood_history_) + 1),
                 gmm.log_likelihood_history_, 'b-o', markersize=4, linewidth=1.5)
        ax2.set_xlabel('迭代次数')
        ax2.set_ylabel('对数似然 ℓ')
        ax2.set_title('EM 收敛曲线（单调不减）')
        ax2.grid(True, alpha=0.3)

        plt.tight_layout()
        plt.savefig('ch10_em_algorithm.png', dpi=100)
        print("  图像已保存至 ch10_em_algorithm.png")
        plt.close()
    except Exception as e:
        print(f"  可视化失败（无 GUI 环境）: {e}")

    print("\n" + "=" * 60)
    print("关键观察")
    print("-" * 60)
    print("1. EM 保证对数似然单调不减（这是它的核心理论保证）")
    print("2. EM 只能保证局部最优，结果依赖初始化")
    print("3. K 越大对数似然越高，但有过度拟合风险")
    print("4. EM 广泛用于：GMM、HMM、缺失数据、因子分析等")
    print("5. 若似然曲面是凸的，EM 收敛到全局最优（如高斯混合）")
    print("=" * 60)
