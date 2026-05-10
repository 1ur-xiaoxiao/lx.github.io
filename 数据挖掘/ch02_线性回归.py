"""
==============================================================================
第2章 线性回归模型 — 最小二乘法 / 岭回归 / 套索回归
==============================================================================
统计思想：
  假设目标变量 y 服从以 Xw 为均值、σ² 为方差的正态分布。
  在此假设下，极大似然估计等价于最小化残差平方和（最小二乘）。
  岭回归和 Lasso 分别从贝叶斯视角引入高斯先验和拉普拉斯先验，
  等价于对参数施加 L2 / L1 正则化。

核心公式推导（最小二乘的解析解）：
  损失函数: L(w) = ||y - Xw||² = (y - Xw)ᵀ(y - Xw)
  梯度:     ∂L/∂w = -2Xᵀ(y - Xw)
  令梯度为零:  XᵀX w = Xᵀy
  若 XᵀX 可逆: w* = (XᵀX)⁻¹Xᵀy

岭回归 (L2 正则化):
  损失: L(w) = ||y - Xw||² + λ||w||²
  解析解: w* = (XᵀX + λI)⁻¹Xᵀy

套索回归 (L1 正则化):
  损失: L(w) = ||y - Xw||² + λ||w||₁
  L1 范数在零点不可导，无解析解，需用坐标下降法等迭代求解。
==============================================================================
"""

import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_diabetes
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler


# ============================================================================
# 1. 最小二乘线性回归 (Ordinary Least Squares)
# ============================================================================
class LinearRegression:
    """
    最小二乘线性回归。

    统计思想：
      假设 y|X ~ N(Xw, σ²I)，即误差项 ε ~ N(0, σ²) 且独立同分布。
      在此正态假设下，似然函数 L(w) ∝ exp(-||y-Xw||²/(2σ²))，
      最大化似然 ⇔ 最小化残差平方和 ||y-Xw||²。
    """

    def __init__(self, fit_intercept: bool = True):
        """
        Parameters
        ----------
        fit_intercept : bool, 是否拟合截距项 b。True 时模型为 y = Xw + b
        """
        self.fit_intercept = fit_intercept
        self.w_ = None   # 权重系数
        self.b_ = None   # 截距

    def fit(self, X: np.ndarray, y: np.ndarray):
        """
        使用正规方程求解: w* = (XᵀX)⁻¹Xᵀy

        Parameters
        ----------
        X : (n_samples, n_features) 设计矩阵
        y : (n_samples,) 目标值
        """
        if self.fit_intercept:
            # 在设计矩阵左侧添加一列全 1，对应截距项
            X = np.column_stack([np.ones(X.shape[0]), X])

        # 正规方程 (Normal Equation)
        # XᵀX 的逆可能因数值不稳定或 XᵀX 不可逆而失败
        # 实践中用 np.linalg.pinv (伪逆) 或 np.linalg.solve (更稳定)
        XtX = X.T @ X
        Xty = X.T @ y

        # 使用 solve 而非求逆，数值更稳定
        # 若 XᵀX 接近奇异，求解将不稳定 —— 这正是岭回归要解决的问题
        try:
            theta = np.linalg.solve(XtX, Xty)
        except np.linalg.LinAlgError:
            # 降级到伪逆
            theta = np.linalg.pinv(XtX) @ Xty

        if self.fit_intercept:
            self.b_ = theta[0]
            self.w_ = theta[1:]
        else:
            self.w_ = theta
            self.b_ = 0.0

    def predict(self, X: np.ndarray) -> np.ndarray:
        """返回预测值 y_hat = Xw + b"""
        return X @ self.w_ + self.b_

    def score(self, X: np.ndarray, y: np.ndarray) -> float:
        """
        计算 R² (决定系数)。

        统计意义：
          R² = 1 - SS_res / SS_tot
          其中 SS_res = Σ(yᵢ - ŷᵢ)², SS_tot = Σ(yᵢ - ȳ)²
          R² 衡量模型解释的方差比例，取值范围 (-∞, 1]，
          越接近 1 表示拟合越好。
        """
        y_pred = self.predict(X)
        ss_res = np.sum((y - y_pred) ** 2)
        ss_tot = np.sum((y - np.mean(y)) ** 2)
        return 1 - ss_res / ss_tot


# ============================================================================
# 2. 岭回归 (Ridge Regression — L2 正则化)
# ============================================================================
class RidgeRegression:
    """
    岭回归：在最小二乘基础上加入 L2 惩罚项 λ||w||²。

    统计思想（贝叶斯视角）：
      L2 正则化等价于假设参数 w 服从先验分布 w ~ N(0, τ²I)，其中 λ ∝ 1/τ²。
      后验最大化 ⇒ 损失函数 = 负对数似然 - 对数先验 ⇒ 最小二乘 + λ||w||²。

    为什么要用岭回归：
      - 当特征高度相关时，XᵀX 接近奇异，(XᵀX)⁻¹ 极不稳定
      - 加入 λI 后，(XᵀX + λI) 始终可逆（即使 XᵀX 不可逆）
      - λ 越大，系数收缩越强，方差越低但偏差越高（方差-偏差折中）
    """

    def __init__(self, alpha: float = 1.0, fit_intercept: bool = True):
        """
        Parameters
        ----------
        alpha : float, 正则化强度 λ（越大则系数收缩越强）
        fit_intercept : bool
        """
        self.alpha = alpha
        self.fit_intercept = fit_intercept
        self.w_ = None
        self.b_ = None

    def fit(self, X: np.ndarray, y: np.ndarray):
        """
        岭回归解析解: w* = (XᵀX + λI)⁻¹Xᵀy

        注意：通常不对截距项做正则化。
        """
        n_features = X.shape[1]

        if self.fit_intercept:
            X = np.column_stack([np.ones(X.shape[0]), X])

        # 构造正则化矩阵
        # 对截距项（第 0 列）不做正则化，对应 λ 位置设为 0
        penalty = self.alpha * np.eye(X.shape[1])
        if self.fit_intercept:
            penalty[0, 0] = 0.0  # 截距项不做惩罚

        XtX_reg = X.T @ X + penalty
        Xty = X.T @ y

        theta = np.linalg.solve(XtX_reg, Xty)

        if self.fit_intercept:
            self.b_ = theta[0]
            self.w_ = theta[1:]
        else:
            self.w_ = theta
            self.b_ = 0.0

    def predict(self, X: np.ndarray) -> np.ndarray:
        return X @ self.w_ + self.b_

    def score(self, X: np.ndarray, y: np.ndarray) -> float:
        y_pred = self.predict(X)
        ss_res = np.sum((y - y_pred) ** 2)
        ss_tot = np.sum((y - np.mean(y)) ** 2)
        return 1 - ss_res / ss_tot


# ============================================================================
# 3. 套索回归 (Lasso Regression — L1 正则化)
# ============================================================================
class LassoRegression:
    """
    套索回归：使用 L1 惩罚项 λ||w||₁。

    统计思想（贝叶斯视角）：
      L1 正则化等价于参数 w 服从拉普拉斯先验 p(w) ∝ exp(-λ|w|)。
      拉普拉斯分布在零点有尖峰，这使得后验最大化倾向于让部分系数
      恰好为零 → 自动特征选择 (sparsity)。

    L1 与 L2 的关键区别：
      - L2 收缩系数但不归零（适合所有特征都有贡献的场景）
      - L1 可以将部分系数精确收缩到零（适合有冗余特征的场景）
      - 由于 L1 在零点不可导，没有解析解，需使用迭代优化方法

    这里使用坐标下降法 (Coordinate Descent) 求解。
    坐标下降的思想：每次只优化一个坐标（一个特征），其他坐标固定，
    将多维优化问题分解为一系列一维优化问题。

    对第 j 个系数的更新公式（软阈值规则）：
      ρⱼ = Xⱼᵀ(y - X_{-j}w_{-j})      ← 第 j 个特征的偏残差
      wⱼ = S(ρⱼ, λ) / ||Xⱼ||²

      其中 S(z, γ) = sign(z) · max(|z| - γ, 0)  是软阈值 (soft-thresholding) 函数
    """

    def __init__(self, alpha: float = 1.0, fit_intercept: bool = True,
                 max_iter: int = 1000, tol: float = 1e-4):
        self.alpha = alpha
        self.fit_intercept = fit_intercept
        self.max_iter = max_iter
        self.tol = tol
        self.w_ = None
        self.b_ = None

    @staticmethod
    def _soft_threshold(z: float, gamma: float) -> float:
        """软阈值函数 S(z, γ) = sign(z) · max(|z| - γ, 0)"""
        if z > gamma:
            return z - gamma
        elif z < -gamma:
            return z + gamma
        else:
            return 0.0

    def fit(self, X: np.ndarray, y: np.ndarray):
        n_samples, n_features = X.shape

        # 初始化系数
        if self.w_ is None:
            self.w_ = np.zeros(n_features)
        if self.b_ is None:
            self.b_ = 0.0

        # 预计算每列的 L2 范数平方（用于归一化步长）
        col_norms = np.sum(X ** 2, axis=0)

        for iteration in range(self.max_iter):
            w_old = self.w_.copy()

            # --- 更新截距 ---
            if self.fit_intercept:
                residual = y - X @ self.w_
                self.b_ = np.mean(residual)

            # --- 坐标下降：依次更新每个 wⱼ ---
            for j in range(n_features):
                if col_norms[j] == 0:
                    continue

                # 计算偏残差 r_{(-j)} = y - b - Σ_{k≠j} x_k w_k
                # 等效于完整残差 + xⱼwⱼ（因为要扣掉 wⱼ 的贡献）
                residual = y - X @ self.w_ - self.b_
                rho_j = X[:, j] @ residual + col_norms[j] * self.w_[j]

                # 软阈值更新
                self.w_[j] = self._soft_threshold(rho_j, self.alpha) / col_norms[j]

            # 检查收敛
            if np.max(np.abs(self.w_ - w_old)) < self.tol:
                break

    def predict(self, X: np.ndarray) -> np.ndarray:
        return X @ self.w_ + self.b_

    def score(self, X: np.ndarray, y: np.ndarray) -> float:
        y_pred = self.predict(X)
        ss_res = np.sum((y - y_pred) ** 2)
        ss_tot = np.sum((y - np.mean(y)) ** 2)
        return 1 - ss_res / ss_tot


# ============================================================================
# 示例与对比
# ============================================================================
if __name__ == "__main__":
    print("=" * 60)
    print("第2章 线性回归模型 — 最小二乘 / 岭回归 / 套索回归")
    print("=" * 60)

    # 加载糖尿病数据集（442 个样本, 10 个特征）
    X, y = load_diabetes(return_X_y=True)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # 标准化——让各特征量纲一致，也便于对比正则化效果
    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test = scaler.transform(X_test)

    # ---- 1. 最小二乘 ----
    ols = LinearRegression(fit_intercept=True)
    ols.fit(X_train, y_train)
    r2_ols = ols.score(X_test, y_test)
    print(f"\n[最小二乘] 测试集 R² = {r2_ols:.4f}")
    print(f"  系数 (前5个): {ols.w_[:5]}")
    print(f"  非零系数个数: {np.sum(np.abs(ols.w_) > 1e-6)} / {len(ols.w_)}")

    # ---- 2. 岭回归 ----
    ridge = RidgeRegression(alpha=1.0, fit_intercept=True)
    ridge.fit(X_train, y_train)
    r2_ridge = ridge.score(X_test, y_test)
    print(f"\n[岭回归]   测试集 R² = {r2_ridge:.4f}")
    print(f"  系数 (前5个): {ridge.w_[:5]}")
    print(f"  非零系数个数: {np.sum(np.abs(ridge.w_) > 1e-6)} / {len(ridge.w_)}")

    # ---- 3. 套索回归 ----
    lasso = LassoRegression(alpha=1.0, fit_intercept=True)
    lasso.fit(X_train, y_train)
    r2_lasso = lasso.score(X_test, y_test)
    print(f"\n[套索回归] 测试集 R² = {r2_lasso:.4f}")
    print(f"  系数 (前5个): {lasso.w_[:5]}")
    print(f"  非零系数个数: {np.sum(np.abs(lasso.w_) > 1e-6)} / {len(lasso.w_)}")

    # ---- 对比不同 λ 下的岭回归系数轨迹 ----
    print("\n--- 不同正则化强度下的岭回归系数 ---")
    alphas = [0.01, 0.1, 1.0, 10.0, 100.0]
    for a in alphas:
        r = RidgeRegression(alpha=a)
        r.fit(X_train, y_train)
        print(f"  λ={a:6.2f}: ||w||² = {np.sum(r.w_**2):.2f}, "
              f"R² = {r.score(X_test, y_test):.4f}")

    # ---- 对比不同 λ 下的 Lasso 系数轨迹 ----
    print("\n--- 不同正则化强度下的套索回归系数 ---")
    for a in alphas:
        l = LassoRegression(alpha=a)
        l.fit(X_train, y_train)
        n_nonzero = np.sum(np.abs(l.w_) > 1e-6)
        print(f"  λ={a:6.2f}: 非零系数 = {n_nonzero}/10, "
              f"R² = {l.score(X_test, y_test):.4f}")

    print("\n" + "=" * 60)
    print("关键观察")
    print("-" * 60)
    print("1. 岭回归系数较小但整体非零（L2 只收缩不归零）")
    print("2. 套索将部分系数压缩到恰好为零（L1 实现特征选择）")
    print("3. λ 越大 → 正则化越强 → 系数越小 → 偏差↑ 方差↓")
    print("4. 正交设计下，最小二乘等价于逐个单变量回归")
    print("=" * 60)
