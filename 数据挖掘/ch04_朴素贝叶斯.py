"""
==============================================================================
第4章 贝叶斯推断 — 朴素贝叶斯分类器
==============================================================================
统计思想：
  贝叶斯分类器的核心是贝叶斯定理——将先验知识与观测数据结合，得出后验概率。

  贝叶斯公式：
           P(x|C_k) · P(C_k)
  P(C_k|x) = ──────────────
                P(x)

  决策规则（贝叶斯最优分类器）：
    h*(x) = argmax_k P(C_k|x) = argmax_k P(x|C_k)P(C_k)
    （分母 P(x) 对所有类别相同，可省略）

  "朴素"假设（关键简化）：
    假设给定类别后，各特征相互条件独立：
    P(x|C_k) = Π_i P(x_i|C_k)
    这个假设虽然"朴素"（现实中几乎不成立），但实践中效果出奇地好，
    且极大简化了计算——从估计联合分布变成估计每个特征的边缘分布。

  三种常见朴素贝叶斯变体：
    1. Gaussian NB  — 特征为连续值，假设每类内特征服从高斯分布
    2. Multinomial NB — 特征为离散计数（如词频），假设服从多项式分布
    3. Bernoulli NB   — 特征为二值（0/1），假设服从伯努利分布

  判别模型 vs 生成模型：
    逻辑回归、SVM 等是判别模型，直接学习 P(y|x) 的决策边界
    朴素贝叶斯是生成模型，先学习 P(x|y) 和 P(y)，再用贝叶斯公式求 P(y|x)
==============================================================================
"""

import numpy as np
from sklearn.datasets import load_iris, fetch_20newsgroups
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.preprocessing import StandardScaler


# ============================================================================
# 1. 高斯朴素贝叶斯 (GaussianNB)
# ============================================================================
class GaussianNB:
    """
    高斯朴素贝叶斯分类器。

    假设：对于每个类别 c，特征 x_i 在该类别下服从正态分布：
      P(x_i | c) = N(μ_{c,i}, σ²_{c,i})

    参数估计（极大似然）：
      μ_{c,i} = mean of x_i in class c
      σ²_{c,i} = variance of x_i in class c

    预测：
      log P(c|x) ∝ log P(c) + Σ_i log P(x_i|c)
      取对数是为了数值稳定（防止多个小概率相乘导致下溢）
    """

    def __init__(self):
        self.classes_ = None       # 所有类别
        self.priors_ = None        # 先验概率 P(c)
        self.means_ = None         # 每类每个特征的均值 μ
        self.vars_ = None          # 每类每个特征的方差 σ²

    def fit(self, X: np.ndarray, y: np.ndarray):
        """估计先验概率和每类的均值/方差"""
        self.classes_ = np.unique(y)
        n_classes = len(self.classes_)
        n_features = X.shape[1]

        self.priors_ = np.zeros(n_classes)
        self.means_ = np.zeros((n_classes, n_features))
        self.vars_ = np.zeros((n_classes, n_features))

        for i, c in enumerate(self.classes_):
            X_c = X[y == c]
            self.priors_[i] = len(X_c) / len(X)
            self.means_[i] = np.mean(X_c, axis=0)
            # 使用 ddof=0 的总体方差（极大似然估计）
            # 加上一个小常数 epsilon 防止方差为零
            self.vars_[i] = np.var(X_c, axis=0) + 1e-9

    def predict(self, X: np.ndarray) -> np.ndarray:
        """返回预测类别"""
        log_probs = self._log_posterior(X)
        return self.classes_[np.argmax(log_probs, axis=1)]

    def predict_proba(self, X: np.ndarray) -> np.ndarray:
        """返回后验概率 P(c|x)"""
        log_probs = self._log_posterior(X)
        # 用 log-sum-exp 技巧做数值稳定的 softmax
        log_probs -= np.max(log_probs, axis=1, keepdims=True)
        probs = np.exp(log_probs)
        return probs / np.sum(probs, axis=1, keepdims=True)

    def _log_posterior(self, X: np.ndarray) -> np.ndarray:
        """
        计算对数后验概率：

          log P(c|x) ∝ log P(c) + Σ_i log P(x_i|c)

        其中高斯分布的对数概率密度：
          log P(x_i|c) = -½ log(2πσ²) - (x_i - μ)² / (2σ²)
        """
        n_samples = X.shape[0]
        n_classes = len(self.classes_)
        log_probs = np.zeros((n_samples, n_classes))

        for i in range(n_classes):
            # 先验的对数
            log_prior = np.log(self.priors_[i])

            # 似然的对数（高斯分布）
            # log N(x|μ,σ²) = -½ log(2πσ²) - (x-μ)²/(2σ²)
            var = self.vars_[i]
            mean = self.means_[i]
            log_likelihood = (
                -0.5 * np.log(2 * np.pi * var)
                - 0.5 * (X - mean) ** 2 / var
            ).sum(axis=1)

            log_probs[:, i] = log_prior + log_likelihood

        return log_probs


# ============================================================================
# 2. 多项式朴素贝叶斯 (MultinomialNB) — 适用于文本分类
# ============================================================================
class MultinomialNB:
    """
    多项式朴素贝叶斯分类器。

    假设：在给定类别 c 下，特征（如词频）服从多项式分布。
    令 x_i 为第 i 个特征的出现次数，N_c = Σ_i x_i（c类下所有特征计数之和）

    参数估计（极大似然 + 拉普拉斯平滑）：
      P(x_i|c) = (count(x_i, c) + α) / (Σ_i count(x_i, c) + α·n_features)

    其中 α 是拉普拉斯平滑参数：
      α = 0 → 极大似然估计（可能为零概率）
      α = 1 → 拉普拉斯平滑（最常用）
      α → ∞ → 均匀分布

    为什么需要平滑：
      若训练集中某特征在某类别从未出现，极大似然估计会给它零概率，
      则测试时只要该特征非零，整个后验概率相乘为 0 → 分类完全失效！
    """

    def __init__(self, alpha: float = 1.0):
        self.alpha = alpha  # 拉普拉斯平滑参数
        self.classes_ = None
        self.priors_ = None
        self.feature_log_probs_ = None  # log P(x_i|c)

    def fit(self, X: np.ndarray, y: np.ndarray):
        self.classes_ = np.unique(y)
        n_classes = len(self.classes_)
        n_features = X.shape[1]

        self.priors_ = np.zeros(n_classes)
        # 存储每类每个特征的对数概率
        self.feature_log_probs_ = np.zeros((n_classes, n_features))

        for i, c in enumerate(self.classes_):
            X_c = X[y == c]
            self.priors_[i] = len(X_c) / len(y)

            # 各类特征计数 + 拉普拉斯平滑
            count_c = X_c.sum(axis=0) + self.alpha
            total_count = count_c.sum()

            # P(x_i|c) = smoothed_count_i / smoothed_total
            self.feature_log_probs_[i] = np.log(count_c / total_count)

    def predict(self, X: np.ndarray) -> np.ndarray:
        """
        预测时计算对数后验概率：
          log P(c|x) ∝ log P(c) + Σ_i x_i · log P(x_i|c)

        注意这里乘以 x_i 是因为多项式分布下：
          log P(x|c) ∝ Σ_i x_i · log θ_{c,i}
        """
        # 计算 Σ_i x_i log θ_{c,i}（稀疏数据的 log 概率加权求和）
        log_likelihood = X @ self.feature_log_probs_.T
        log_priors = np.log(self.priors_)
        log_posterior = log_likelihood + log_priors

        return self.classes_[np.argmax(log_posterior, axis=1)]


# ============================================================================
# 示例
# ============================================================================
if __name__ == "__main__":
    print("=" * 60)
    print("第4章 贝叶斯推断 — 朴素贝叶斯分类器")
    print("=" * 60)

    # ---- 1. 高斯朴素贝叶斯（连续特征）----
    print("\n--- 高斯朴素贝叶斯（鸢尾花数据集）---")
    X, y = load_iris(return_X_y=True)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.3, random_state=42
    )
    scaler = StandardScaler()
    X_train_s = scaler.fit_transform(X_train)
    X_test_s = scaler.transform(X_test)

    gnb = GaussianNB()
    gnb.fit(X_train_s, y_train)
    y_pred = gnb.predict(X_test_s)
    acc = np.mean(y_pred == y_test)
    print(f"  准确率: {acc:.4f}")

    # 展示后验概率
    proba = gnb.predict_proba(X_test_s[:3])
    print("  前3个测试样本的后验概率:")
    for i, p in enumerate(proba):
        print(f"    样本{i}: {dict(zip(gnb.classes_, p.round(4)))}")

    # ---- 2. 多项式朴素贝叶斯（文本分类）----
    print("\n--- 多项式朴素贝叶斯（文本分类）---")
    # 用新闻组数据集的一个子集演示
    try:
        cats = ['sci.space', 'rec.sport.baseball', 'talk.politics.guns']
        newsgroups = fetch_20newsgroups(
            subset='train', categories=cats, remove=('headers', 'footers', 'quotes'),
            random_state=42
        )
        # 将文本转为词频矩阵
        vectorizer = CountVectorizer(max_features=1000)
        X_text = vectorizer.fit_transform(newsgroups.data).toarray()
        y_text = newsgroups.target

        Xt_train, Xt_test, yt_train, yt_test = train_test_split(
            X_text, y_text, test_size=0.3, random_state=42
        )

        mnb = MultinomialNB(alpha=1.0)
        mnb.fit(Xt_train, yt_train)
        yt_pred = mnb.predict(Xt_test)
        acc_t = np.mean(yt_pred == yt_test)
        print(f"  准确率: {acc_t:.4f} (α=1.0, 拉普拉斯平滑)")
    except Exception as e:
        print(f"  数据集下载失败: {e}")
        print("  （首次运行可能需要下载，请确保网络正常）")

    print("\n" + "=" * 60)
    print("关键观察")
    print("-" * 60)
    print("1. '朴素'假设特征独立在现实中几乎不成立，但朴素贝叶斯仍表现良好")
    print("2. 拉普拉斯平滑（α>0）防止零概率问题，是必须的工程技巧")
    print("3. 用对数计算而非连乘是为了数值稳定（log 将乘法转为加法）")
    print("4. 朴素贝叶斯是生成模型：先学 P(x|y) 和 P(y)，再推 P(y|x)")
    print("5. 当特征确实接近独立时，朴素贝叶斯是最优分类器")
    print("=" * 60)
