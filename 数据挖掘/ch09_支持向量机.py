"""
==============================================================================
第9章 支持向量机 (SVM) — 线性可分 / 软间隔 / 核方法 / SMO
==============================================================================
统计思想：
  SVM 的核心思想是**最大化间隔（margin）**——不仅要找一个超平面把两类分开，
  还要让超平面离最近的样本尽可能远。最大间隔的解只由少数"支持向量"决定，
  其他样本对最终模型没有影响——这是一种天然的稀疏性。

  三种形式对比：

  |          | 线性可分 SVM        | 线性 SVM (软间隔)    | 非线性 SVM         |
  |----------|--------------------|--------------------|--------------------|
  | 条件     | 完全线性可分        | 近似线性可分        | 非线性             |
  | 处理     | 硬间隔最大化        | 引入松弛变量 ξᵢ    | 核技巧 K(x,x')    |
  | 参数     | 无额外参数          | 惩罚参数 C          | C + 核函数参数    |

  核心推导（线性可分 SVM）：

    原始问题（Primal, 凸二次规划）：
      min  ½||w||²
      s.t. yᵢ(wᵀxᵢ + b) ≥ 1, ∀i

    间隔 = 2/||w||, 最大化间隔 ⇔ 最小化 ||w||²/2

    拉格朗日函数：
      L(w,b,α) = ½||w||² - Σᵢ αᵢ[yᵢ(wᵀxᵢ+b) - 1]
      αᵢ ≥ 0 是拉格朗日乘子

    KKT 条件 → w = Σᵢ αᵢ yᵢ xᵢ

    对偶问题（Dual）：
      max  Σᵢ αᵢ - ½ Σᵢⱼ αᵢαⱼ yᵢyⱼ (xᵢᵀxⱼ)
      s.t. Σᵢ αᵢyᵢ = 0, αᵢ ≥ 0

    软间隔（引入 ξᵢ）：
      min  ½||w||² + C·Σᵢ ξᵢ
      s.t. yᵢ(wᵀxᵢ+b) ≥ 1 - ξᵢ, ξᵢ ≥ 0

    对偶形式仅约束变为 0 ≤ αᵢ ≤ C

  核技巧：
    将对偶问题中的内积 xᵢᵀxⱼ 替换为核函数 K(xᵢ, xⱼ)，
    隐式地在高维特征空间中做线性分类，而无需显式计算特征映射。

  常用核函数：
    - 线性核:    K(x,x') = xᵀx'
    - 多项式核:  K(x,x') = (γ·xᵀx' + r)^d
    - RBF/高斯核: K(x,x') = exp(-γ·||x-x'||²)
==============================================================================
"""

import numpy as np
from sklearn.datasets import load_iris, make_circles
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler


class SVM:
    """
    支持向量机分类器。

    使用简化版 SMO (Sequential Minimal Optimization) 算法求解对偶问题。

    SMO 核心思想：
      每次只优化两个拉格朗日乘子 αᵢ 和 αⱼ，
      因为约束 Σ αᵢyᵢ = 0 意味着可以解析地求解 αⱼ 给定 αᵢ。
      这样把一个大的二次规划问题分解成一系列小的子问题。

    算法步骤：
      1. 选一对违反 KKT 条件的 αᵢ, αⱼ
      2. 解析求解这两个 α 的最优值
      3. 更新偏置 b
      4. 重复直到满足收敛条件
    """

    def __init__(self, C: float = 1.0, kernel: str = 'linear',
                 gamma: float = 1.0, degree: int = 3, tol: float = 1e-3,
                 max_iter: int = 1000):
        """
        Parameters
        ----------
        C : 惩罚参数（C 越大 → 对误分类容忍越低 → 更易过拟合）
            C 在统计上等价于 1/λ（正则化强度的倒数）
        kernel : 'linear', 'poly', 'rbf'
        gamma : RBF/多项式核的 γ 参数（RBF 中 γ 越大 → 决策边界越复杂）
        degree : 多项式核的阶数 d
        tol : KKT 条件容忍度
        max_iter : SMO 最大迭代次数
        """
        self.C = C
        self.kernel = kernel
        self.gamma = gamma
        self.degree = degree
        self.tol = tol
        self.max_iter = max_iter
        self.alpha_ = None     # 拉格朗日乘子
        self.support_vectors_ = None  # 支持向量
        self.support_labels_ = None
        self.b_ = None         # 偏置
        self.w_ = None         # 权重（仅线性核）

    def _kernel(self, X1: np.ndarray, X2: np.ndarray) -> np.ndarray:
        """计算核矩阵"""
        if self.kernel == 'linear':
            return X1 @ X2.T
        elif self.kernel == 'poly':
            return (self.gamma * X1 @ X2.T + 1) ** self.degree
        elif self.kernel == 'rbf':
            # K(x,x') = exp(-γ||x-x'||²)
            # ||x-x'||² = ||x||² + ||x'||² - 2xᵀx'
            X1_sq = np.sum(X1 ** 2, axis=1).reshape(-1, 1)
            X2_sq = np.sum(X2 ** 2, axis=1).reshape(1, -1)
            sq_dist = X1_sq + X2_sq - 2 * X1 @ X2.T
            return np.exp(-self.gamma * sq_dist)
        else:
            raise ValueError(f"Unknown kernel: {self.kernel}")

    def fit(self, X: np.ndarray, y: np.ndarray):
        """
        使用简化 SMO 训练 SVM。

        对偶问题的目标函数：
          W(α) = Σᵢ αᵢ - ½ Σᵢⱼ αᵢαⱼ yᵢyⱼ K(xᵢ, xⱼ)
        """
        y = np.where(y <= 0, -1, 1).astype(float)
        n_samples = X.shape[0]

        # 预计算核矩阵（避免重复计算）
        self._K = self._kernel(X, X)

        # 初始化拉格朗日乘子
        self.alpha_ = np.zeros(n_samples)
        self.b_ = 0.0

        for _ in range(self.max_iter):
            alpha_prev = self.alpha_.copy()

            for i in range(n_samples):
                # 计算当前模型对样本 i 的输出
                # f(x_i) = Σⱼ αⱼyⱼK(xⱼ,x_i) + b
                E_i = (self.alpha_ * y @ self._K[:, i]) + self.b_ - y[i]

                # 检查 KKT 条件是否违反
                # 若 y_i·f(x_i) < 1 - tol 且 α < C（应增大 α）
                # 或 y_i·f(x_i) > 1 + tol 且 α > 0（应减小 α）
                if (y[i] * E_i < -self.tol and self.alpha_[i] < self.C) or \
                   (y[i] * E_i > self.tol and self.alpha_[i] > 0):

                    # 随机选第二个乘子 j ≠ i
                    j = np.random.choice([k for k in range(n_samples) if k != i])

                    E_j = (self.alpha_ * y @ self._K[:, j]) + self.b_ - y[j]

                    # 保存旧值
                    alpha_i_old = self.alpha_[i]
                    alpha_j_old = self.alpha_[j]

                    # 计算 αⱼ 的上下界
                    if y[i] != y[j]:
                        L = max(0, self.alpha_[j] - self.alpha_[i])
                        H = min(self.C, self.C + self.alpha_[j] - self.alpha_[i])
                    else:
                        L = max(0, self.alpha_[j] + self.alpha_[i] - self.C)
                        H = min(self.C, self.alpha_[j] + self.alpha_[i])

                    if L == H:
                        continue

                    # η = Kᵢᵢ + Kⱼⱼ - 2Kᵢⱼ
                    eta = self._K[i, i] + self._K[j, j] - 2 * self._K[i, j]

                    if eta <= 0:
                        continue

                    # 无约束情况下更新 αⱼ
                    self.alpha_[j] += y[j] * (E_i - E_j) / eta

                    # 裁剪到 [L, H]
                    self.alpha_[j] = np.clip(self.alpha_[j], L, H)

                    if abs(self.alpha_[j] - alpha_j_old) < 1e-5:
                        continue

                    # 更新 αᵢ（由等式约束 Σαy=0 决定）
                    self.alpha_[i] += y[i] * y[j] * (alpha_j_old - self.alpha_[j])

                    # 更新偏置 b
                    b1 = (self.b_ - E_i
                          - y[i] * (self.alpha_[i] - alpha_i_old) * self._K[i, i]
                          - y[j] * (self.alpha_[j] - alpha_j_old) * self._K[i, j])
                    b2 = (self.b_ - E_j
                          - y[i] * (self.alpha_[i] - alpha_i_old) * self._K[i, j]
                          - y[j] * (self.alpha_[j] - alpha_j_old) * self._K[j, j])

                    if 0 < self.alpha_[i] < self.C:
                        self.b_ = b1
                    elif 0 < self.alpha_[j] < self.C:
                        self.b_ = b2
                    else:
                        self.b_ = (b1 + b2) / 2

            # 检查收敛
            diff = np.linalg.norm(self.alpha_ - alpha_prev)
            if diff < self.tol:
                break

        # 提取支持向量 (α > 0 的样本)
        sv_mask = self.alpha_ > 1e-5
        self.support_vectors_ = X[sv_mask]
        self.support_labels_ = y[sv_mask]
        self.support_alphas_ = self.alpha_[sv_mask]

        # 对于线性核，计算显式权重 w
        if self.kernel == 'linear':
            self.w_ = (self.alpha_ * y) @ X

        return self

    def decision_function(self, X: np.ndarray) -> np.ndarray:
        """返回决策函数值 f(x) = wᵀφ(x) + b = Σ αᵢyᵢK(xᵢ,x) + b"""
        K_test = self._kernel(self.support_vectors_, X)
        return (self.support_alphas_ * self.support_labels_) @ K_test + self.b_

    def predict(self, X: np.ndarray) -> np.ndarray:
        return np.where(self.decision_function(X) >= 0, 1, -1)

    def score(self, X: np.ndarray, y: np.ndarray) -> float:
        y = np.where(y <= 0, -1, 1)
        return np.mean(self.predict(X) == y)


# ============================================================================
# 示例
# ============================================================================
if __name__ == "__main__":
    print("=" * 60)
    print("第9章 支持向量机 — 线性SVM / 核方法 / SMO")
    print("=" * 60)

    # ---- 1. 线性可分数据（鸢尾花前两类） ----
    print("\n--- 线性可分 SVM ---")
    X, y = load_iris(return_X_y=True)
    mask = y != 2  # 二分类
    X_bin, y_bin = X[mask][:, :2], y[mask]
    y_bin = np.where(y_bin == 0, -1, 1)

    X_train, X_test, y_train, y_test = train_test_split(
        X_bin, y_bin, test_size=0.3, random_state=42
    )
    scaler = StandardScaler()
    X_train_s = scaler.fit_transform(X_train)
    X_test_s = scaler.transform(X_test)

    # 线性核
    svm_linear = SVM(C=1.0, kernel='linear')
    svm_linear.fit(X_train_s, y_train)
    acc = svm_linear.score(X_test_s, y_test)
    n_sv = len(svm_linear.support_vectors_)
    print(f"  线性核: 准确率={acc:.4f}, 支持向量数={n_sv}/{len(X_train)}")

    # RBF 核
    svm_rbf = SVM(C=1.0, kernel='rbf', gamma=0.5)
    svm_rbf.fit(X_train_s, y_train)
    acc_rbf = svm_rbf.score(X_test_s, y_test)
    n_sv_rbf = len(svm_rbf.support_vectors_)
    print(f"  RBF核:  准确率={acc_rbf:.4f}, 支持向量数={n_sv_rbf}/{len(X_train)}")

    # ---- 2. 非线性数据演示 ----
    print("\n--- 非线性可分数据（同心圆）---")
    X_circle, y_circle = make_circles(n_samples=200, noise=0.1, factor=0.5,
                                      random_state=42)
    Xc_train, Xc_test, yc_train, yc_test = train_test_split(
        X_circle, y_circle, test_size=0.3, random_state=42
    )
    yc_train_bin = np.where(yc_train == 0, -1, 1)
    yc_test_bin = np.where(yc_test == 0, -1, 1)

    # 线性 SVM 对非线性数据
    svm_c_linear = SVM(C=1.0, kernel='linear')
    svm_c_linear.fit(Xc_train, yc_train_bin)
    acc_cl = svm_c_linear.score(Xc_test, yc_test_bin)

    # RBF SVM 对非线性数据
    svm_c_rbf = SVM(C=1.0, kernel='rbf', gamma=2.0)
    svm_c_rbf.fit(Xc_train, yc_train_bin)
    acc_cr = svm_c_rbf.score(Xc_test, yc_test_bin)

    print(f"  线性核 (同心圆数据): 准确率={acc_cl:.4f}  ← 几乎失败")
    print(f"  RBF核  (同心圆数据): 准确率={acc_cr:.4f}  ← 核技巧的力量")

    # ---- 3. C 参数的影响 ----
    print("\n--- C 参数的影响（软间隔）---")
    for C_val in [0.01, 0.1, 1.0, 10.0, 100.0]:
        svm_c = SVM(C=C_val, kernel='linear', max_iter=500)
        svm_c.fit(X_train_s, y_train)
        n_sv = len(svm_c.support_vectors_)
        train_acc = svm_c.score(X_train_s, y_train)
        test_acc = svm_c.score(X_test_s, y_test)
        print(f"  C={C_val:6.2f}: SV={n_sv:3d}, 训练={train_acc:.4f}, 测试={test_acc:.4f}")

    print("\n" + "=" * 60)
    print("关键观察")
    print("-" * 60)
    print("1. SVM 只依赖支持向量——其他样本对模型没有影响")
    print("2. C 越小 → 间隔越大 → 允许更多误分类 → 偏差↑ 方差↓")
    print("3. 核技巧隐式地做特征映射，无需显式计算高维特征")
    print("4. RBF 核可以将任意非线性数据映射到可分的高维空间")
    print("5. SMO 每次只优化 2 个 α，把大 QP 问题分解为可解析求解的子问题")
    print("=" * 60)
