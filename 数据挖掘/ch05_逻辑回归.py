"""
==============================================================================
第5章 逻辑回归模型 — 牛顿法 / 梯度下降
==============================================================================
统计思想：
  逻辑回归通过 Sigmoid 函数将线性模型的输出映射到 (0,1) 区间，
  解释为类别概率，从而将回归问题转化为分类问题。

  核心映射（Sigmoid / 逻辑函数）：
                   1
    σ(z) = ────────────── ,  z = wᵀx
              1 + exp(-z)

  为什么用 Sigmoid 而不是直接线性分类：
    1. 输出天然在 (0,1)，可解释为概率
    2. 从广义线性模型 (GLM) 视角，Sigmoid 是伯努利分布的典型连接函数
    3. 交叉熵损失是凸函数，保证梯度下降找到全局最优

  损失函数（交叉熵 / 负对数似然）：
    L(w) = - Σ [yᵢ log(σ(wᵀxᵢ)) + (1-yᵢ) log(1-σ(wᵀxᵢ))]

  这与"假设 y|x 服从伯努利分布，做极大似然估计"完全等价。

  两种优化方法：
    1. 梯度下降 (Gradient Descent) — 一阶方法，求一阶导数
    2. 牛顿法 (Newton's Method)    — 二阶方法，还需求 Hessian 矩阵的逆
       牛顿法收敛更快（二次收敛），但每次迭代的 Hessian 求逆代价高
==============================================================================
"""

import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler


class LogisticRegression:
    """
    逻辑回归分类器。

    支持两种优化方法：
      - 'gradient_descent': 批量梯度下降（一阶方法）
      - 'newton': 牛顿法（二阶方法，收敛更快）

    统计公式推导：

    1. 模型：
       P(y=1|x) = σ(wᵀx) = 1 / (1 + e^{-wᵀx})

    2. 似然函数（伯努利分布）：
       L(w) = Π_i [σ(wᵀxᵢ)]^{yᵢ} · [1-σ(wᵀxᵢ)]^{1-yᵢ}

    3. 对数似然（交叉熵的负值）：
       ℓ(w) = Σ_i [yᵢ·log σ(wᵀxᵢ) + (1-yᵢ)·log(1-σ(wᵀxᵢ))]
       损失: J(w) = -ℓ(w) / n

    4. 梯度（一阶导数）：
       ∇J = (1/n) · Xᵀ(σ(Xw) - y)

    5. Hessian 矩阵（二阶导数）：
       H = (1/n) · Xᵀ · diag(σ(Xw)(1-σ(Xw))) · X
    """

    def __init__(self, method: str = 'newton', lr: float = 0.1,
                 max_iter: int = 100, tol: float = 1e-4,
                 fit_intercept: bool = True):
        """
        Parameters
        ----------
        method : 'gradient_descent' 或 'newton'
        lr : 梯度下降的学习率
        max_iter : 最大迭代次数
        tol : 收敛容忍度
        fit_intercept : 是否拟合截距
        """
        self.method = method
        self.lr = lr
        self.max_iter = max_iter
        self.tol = tol
        self.fit_intercept = fit_intercept
        self.w_ = None
        self.b_ = None
        self.loss_history_ = []

    @staticmethod
    def _sigmoid(z: np.ndarray) -> np.ndarray:
        """Sigmoid 函数 σ(z) = 1/(1+e^{-z})"""
        # 裁剪防止溢出
        z = np.clip(z, -500, 500)
        return 1 / (1 + np.exp(-z))

    def _add_intercept(self, X: np.ndarray) -> np.ndarray:
        if self.fit_intercept:
            return np.column_stack([np.ones(X.shape[0]), X])
        return X

    def fit(self, X: np.ndarray, y: np.ndarray):
        X_aug = self._add_intercept(X)
        n_samples, n_features = X_aug.shape

        # 初始化权重
        self.w_ = np.zeros(n_features)
        self.loss_history_ = []

        for iteration in range(self.max_iter):
            # --- 计算当前预测和损失 ---
            z = X_aug @ self.w_
            p = self._sigmoid(z)

            # 交叉熵损失: J(w) = -(1/n) Σ [y log(p) + (1-y) log(1-p)]
            # 加一个小 epsilon 防止 log(0)
            eps = 1e-15
            loss = -np.mean(
                y * np.log(p + eps) + (1 - y) * np.log(1 - p + eps)
            )
            self.loss_history_.append(loss)

            # --- 计算梯度 ---
            # ∇J = (1/n) · Xᵀ(p - y)
            grad = X_aug.T @ (p - y) / n_samples

            if self.method == 'gradient_descent':
                # 梯度下降: w ← w - η·∇J
                update = self.lr * grad

            elif self.method == 'newton':
                # 牛顿法: w ← w - H⁻¹·∇J
                # Hessian H = (1/n)·Xᵀ·D·X, 其中 D = diag(p(1-p))
                # 实际用加权最小二乘形式，等价于:
                #   w_new = w - (XᵀDX)⁻¹·Xᵀ(p-y)
                #         = (XᵀDX)⁻¹·XᵀD·(Xw - D⁻¹(p-y))
                # 更稳定：直接解线性系统
                D = p * (1 - p)  # (n,)
                # 构造 Hessian: H = Xᵀ·diag(D)·X
                X_weighted = X_aug * np.sqrt(D[:, np.newaxis])
                H = X_weighted.T @ X_weighted / n_samples

                # 解 H·Δw = -grad
                try:
                    update = np.linalg.solve(H, grad)
                except np.linalg.LinAlgError:
                    # 若 Hessian 奇异，降级到梯度下降
                    update = self.lr * grad
            else:
                raise ValueError(f"Unknown method: {self.method}")

            # 更新参数
            self.w_ -= update

            # 检查收敛：梯度范数足够小
            if np.linalg.norm(update) < self.tol:
                break

        # 分离截距和权重
        if self.fit_intercept:
            self.b_ = self.w_[0]
            self.w_ = self.w_[1:]
        else:
            self.b_ = 0.0

        return self

    def predict_proba(self, X: np.ndarray) -> np.ndarray:
        """返回 P(y=1|x)"""
        z = X @ self.w_ + self.b_
        return self._sigmoid(z)

    def predict(self, X: np.ndarray, threshold: float = 0.5) -> np.ndarray:
        """返回类别预测"""
        return (self.predict_proba(X) >= threshold).astype(int)

    def score(self, X: np.ndarray, y: np.ndarray) -> float:
        return np.mean(self.predict(X) == y)


# ============================================================================
# 示例
# ============================================================================
if __name__ == "__main__":
    print("=" * 60)
    print("第5章 逻辑回归模型 — 牛顿法 / 梯度下降")
    print("=" * 60)

    # 加载乳腺癌数据集（二分类）
    X, y = load_breast_cancer(return_X_y=True)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.3, random_state=42
    )
    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test = scaler.transform(X_test)

    # ---- 对比两种优化方法 ----
    for method in ['newton', 'gradient_descent']:
        print(f"\n--- 优化方法: {method} ---")
        lr = 0.5 if method == 'gradient_descent' else 0.1  # GD 用更大学习率
        model = LogisticRegression(method=method, lr=lr, max_iter=100)
        model.fit(X_train, y_train)

        acc = model.score(X_test, y_test)
        n_iter = len(model.loss_history_)
        final_loss = model.loss_history_[-1]
        print(f"  迭代次数: {n_iter}")
        print(f"  最终损失: {final_loss:.6f}")
        print(f"  测试准确率: {acc:.4f}")

        # 前5个样本的预测概率
        proba = model.predict_proba(X_test[:5])
        print(f"  前5个样本 P(y=1|x): {proba.round(4)}")

    # ---- 牛顿法 vs 梯度下降收敛速度对比 ----
    print("\n--- 收敛速度对比 ---")
    for method in ['newton', 'gradient_descent']:
        lr = 0.5 if method == 'gradient_descent' else 0.1
        model = LogisticRegression(method=method, lr=lr, max_iter=50)
        model.fit(X_train, y_train)
        losses = model.loss_history_
        print(f"  {method:20s}: 第1次损失={losses[0]:.4f}, "
              f"第{len(losses)}次损失={losses[-1]:.4f}, "
              f"下降幅度={losses[0] - losses[-1]:.4f}")

    print("\n" + "=" * 60)
    print("关键观察")
    print("-" * 60)
    print("1. 牛顿法通常 5-10 次迭代就收敛（二次收敛速度）")
    print("2. 梯度下降需要更多迭代，且对学习率敏感（一阶收敛）")
    print("3. 但牛顿法每步需计算并求逆 Hessian，维度高时代价大")
    print("4. 逻辑回归的 Hessian 矩阵始终半正定，损失函数是凸的")
    print("5. 交叉熵损失 + Sigmoid 的组合保证了凸性（全局最优存在）")
    print("=" * 60)
