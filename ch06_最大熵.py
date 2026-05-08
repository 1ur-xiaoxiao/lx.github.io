"""
==============================================================================
第6章 最大熵模型
==============================================================================
统计思想：
  最大熵原理是奥卡姆剃刀的数学化表达：
  **在满足已知约束的前提下，选择熵最大的概率分布。**

  这意味着除了已知信息外，不做任何主观假设——"知之为知之，不知为不知"。

  为什么最大熵？
    熵 H(P) = -Σ P log P 衡量不确定性。
    在满足约束的条件下，熵最大的分布是"最均匀/最不武断"的分布。
    熵最大的分布在某种意义上是最"安全"的——引入最少的人为先验。

  数学形式和拉格朗日对偶求解：
    原始问题（primal，约束优化）：
      max H(P) = -Σ_{x,y} P̃(x)P(y|x) log P(y|x)
      s.t.  Σ_y P(y|x) = 1          （概率归一化）
            E_P[f_i] = E_P̃[f_i]     （特征的经验期望 = 模型期望）

    对偶问题（dual，无约束优化）：
      通过拉格朗日乘子法，求得最优解为指数族形式：
      P_w(y|x) = (1/Z_w(x)) · exp(Σ_i w_i f_i(x,y))

      其中 Z_w(x) = Σ_y exp(Σ_i w_i f_i(x,y)) 是归一化因子（配分函数）。

    最终只需优化对偶函数 Ψ(w)，它是一个凹函数（最大化→凸优化）：
      max_w -Σ_{x,y} P̃(x,y) Σ_i w_i f_i(x,y) + Σ_x P̃(x) log Z_w(x)

  关键联系：
    逻辑回归是最大熵模型在二分类 + 特征为 x_i 时的特例。
==============================================================================
"""

import numpy as np
from scipy.optimize import minimize


class MaxEntClassifier:
    """
    最大熵分类器。

    实现了完整的最大熵模型训练：
      1. 定义特征函数 f_i(x, y)
      2. 通过 IIS (Improved Iterative Scaling) 或 L-BFGS 优化对偶函数
      3. 预测时计算 P(y|x) 选择最大概率的类别

    这里使用 L-BFGS（拟牛顿法），因为它在实践中比 IIS 更快。

    对于二分类/多分类，使用最简单的特征：f_{c,j}(x, y) = x_j · I(y=c)
    即"特征 x_j 出现时，对应类别 c 的权重"。
    """

    def __init__(self, max_iter: int = 100):
        self.max_iter = max_iter
        self.classes_ = None       # 所有类别
        self.w_ = None             # 权重矩阵 (n_classes, n_features)
        self.n_classes_ = None
        self.n_features_ = None

    def fit(self, X: np.ndarray, y: np.ndarray):
        """
        训练最大熵模型。

        对于多分类，最大熵模型等价于 softmax 回归（多类逻辑回归）。
        优化目标是最大化条件似然（等价于最小化负对数似然）。
        """
        self.classes_ = np.unique(y)
        self.n_classes_ = len(self.classes_)
        n_samples, self.n_features_ = X.shape

        # 将标签映射到整数索引 0..K-1
        y_idx = np.array([np.where(self.classes_ == y_i)[0][0] for y_i in y])

        # 初始化权重矩阵
        w_init = np.zeros(self.n_classes_ * self.n_features_)

        # 使用 L-BFGS 优化（高效的无约束优化方法）
        result = minimize(
            fun=self._neg_log_likelihood,
            x0=w_init,
            args=(X, y_idx),
            method='L-BFGS-B',
            jac=True,
            options={'maxiter': self.max_iter, 'disp': False}
        )

        self.w_ = result.x.reshape(self.n_classes_, self.n_features_)

    def _neg_log_likelihood(self, w_flat, X, y_idx):
        """
        负对数似然及其梯度。

        类比于 softmax 回归：
          P(y=k|x) = exp(w_kᵀx) / Σ_j exp(w_jᵀx)

        损失（负对数似然）：
          L = -(1/n) Σ_i log P(y_i|x_i)

        梯度（关键推导！）：
          ∂L/∂w_k = (1/n) Σ_i [P(y=k|x_i) - I(y_i=k)] · x_i
        即梯度 = 模型期望 - 经验期望（正是最大熵的约束残差！）
        """
        n_samples = X.shape[0]
        w = w_flat.reshape(self.n_classes_, self.n_features_)

        # 计算分数矩阵 (n_samples, n_classes)
        scores = X @ w.T  # (n, K)

        # Softmax 得到 P(y=k|x) = exp(s_k) / Σ_j exp(s_j)
        # log-sum-exp 稳定计算
        scores_max = np.max(scores, axis=1, keepdims=True)
        scores_shifted = scores - scores_max
        exp_scores = np.exp(scores_shifted)
        sum_exp = np.sum(exp_scores, axis=1, keepdims=True)
        proba = exp_scores / sum_exp  # (n, K)

        # 负对数似然
        # L(w) = -(1/n) Σ_i log P(y_i|x_i)
        # 添加小 epsilon 防止 log(0)
        epsilon = 1e-15
        probs_correct = proba[np.arange(n_samples), y_idx]
        loss = -np.mean(np.log(probs_correct + epsilon))

        # --- 梯度 ---
        # ∂L/∂w_k = (1/n) Σ_i [P(y=k|x_i) - I(y_i=k)] · x_i
        # 构造 indicator 矩阵
        indicator = np.zeros((n_samples, self.n_classes_))
        indicator[np.arange(n_samples), y_idx] = 1

        # proba - indicator: (n, K)
        diff = proba - indicator

        # 梯度：对每个类 k: grad_k = Xᵀ(p_k - y_k_indicator) / n
        # 即 grad = Xᵀ @ diff / n
        grad = X.T @ diff / n_samples  # (n_features, K)
        grad = grad.T  # (K, n_features)

        return loss, grad.ravel()

    def predict_proba(self, X: np.ndarray) -> np.ndarray:
        """返回每个类别的概率"""
        scores = X @ self.w_.T
        scores_max = np.max(scores, axis=1, keepdims=True)
        scores_shifted = scores - scores_max
        exp_scores = np.exp(scores_shifted)
        return exp_scores / np.sum(exp_scores, axis=1, keepdims=True)

    def predict(self, X: np.ndarray) -> np.ndarray:
        """预测类别"""
        proba = self.predict_proba(X)
        idx = np.argmax(proba, axis=1)
        return self.classes_[idx]


# ============================================================================
# 熵的计算函数（展示用）
# ============================================================================
def entropy(p: np.ndarray) -> float:
    """
    计算离散概率分布的熵。

    熵 H(P) = -Σ p_i log p_i

    性质：
      - 均匀分布时熵最大（H = log n）
      - 退化分布（某个 p_i = 1，其余为 0）时熵最小（H = 0）
      - 熵衡量的是不确定性/信息量
    """
    p = np.asarray(p)
    p = p[p > 0]  # 0·log(0) = 0（取极限）
    return -np.sum(p * np.log(p))


# ============================================================================
# 示例
# ============================================================================
if __name__ == "__main__":
    print("=" * 60)
    print("第6章 最大熵模型")
    print("=" * 60)

    # ---- 1. 演示熵的性质 ----
    print("\n--- 熵的性质演示 ---")
    # 二值分布
    for p1 in [0.0, 0.1, 0.25, 0.5, 0.75, 0.9, 1.0]:
        if 0 < p1 < 1:
            h = entropy([p1, 1 - p1])
            print(f"  P = [{p1:.2f}, {1-p1:.2f}], 熵 = {h:.4f}")

    # 均匀分布（熵最大）
    p_uniform = np.ones(4) / 4
    print(f"  4类均匀分布熵 = {entropy(p_uniform):.4f} (理论最大值 = {np.log(4):.4f})")

    # ---- 2. 最大熵模型分类 ----
    print("\n--- 最大熵分类器（鸢尾花数据集）---")
    from sklearn.datasets import load_iris
    from sklearn.model_selection import train_test_split
    from sklearn.preprocessing import StandardScaler

    X, y = load_iris(return_X_y=True)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.3, random_state=42
    )
    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test = scaler.transform(X_test)

    model = MaxEntClassifier(max_iter=100)
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    acc = np.mean(y_pred == y_test)

    print(f"  测试准确率: {acc:.4f}")
    print(f"  类别数: {model.n_classes_}")
    print(f"  特征数: {model.n_features_}")

    # 展示前3个样本的后验概率
    proba = model.predict_proba(X_test[:3])
    print("  前3个测试样本的后验概率:")
    for i, p in enumerate(proba):
        print(f"    样本{i}: P(y=0)={p[0]:.4f}, P(y=1)={p[1]:.4f}, P(y=2)={p[2]:.4f}")

    print("\n" + "=" * 60)
    print("关键观察")
    print("-" * 60)
    print("1. 均匀分布是所有分布中熵最大的（满足约束时选最均匀的）")
    print("2. 最大熵 = '不说不知道的事'（如有不等式约束→先验知识）")
    print("3. 对偶函数是凹(concave)函数，可用任意凸优化方法求解")
    print("4. 最大熵模型的多分类形式等价于 softmax 回归")
    print("5. 梯度 = 模型期望 - 经验期望，直观反映了约束满足程度")
    print("=" * 60)
