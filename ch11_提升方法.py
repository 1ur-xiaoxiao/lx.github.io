"""
==============================================================================
第11章 提升方法 (Boosting) — AdaBoost / GBDT / XGBoost 思想
==============================================================================
统计思想：
  Boosting 的核心思想是将**弱学习器**（比随机猜测稍好）组合成**强学习器**。
  与 Bagging（并行训练、独立投票）不同，Boosting 是串行的：
  每个新模型聚焦于前一个模型做不好的样本。

  这体现了一个统计哲学：**"三个臭皮匠，顶个诸葛亮"**，
  但前提是这三个臭皮匠有不同的视角（多样性）。

  AdaBoost (Adaptive Boosting)：
    通过动态调整样本权重，让后续的弱分类器关注被前面分类器分错的样本。
    最终用加权投票聚合。

    AdaBoost 算法的核心是**指数损失**的前向分步加法模型：
      L = Σ_i exp(-yᵢ · f(xᵢ))

    每轮选一个弱分类器 G_t 和权重 α_t 来最小化这个损失，
    这就是 AdaBoost 为什么有效的原因。

  GBDT (Gradient Boosting Decision Tree)：
    更一般化的提升框架，每次用新树去拟合当前模型的**负梯度方向**。
    换句说，每一轮用一棵回归树来近似损失函数的梯度下降。
    这就是 GBDT 名字的由来——梯度+提升+决策树。

    AdaBoost (指数损失) + 决策树 ≈ GBDT 的特例

  XGBoost (eXtreme Gradient Boosting) 的核心改进：
    1. 二阶泰勒展开近似损失函数 → 更精确的步长估计
    2. 显式正则化项（树复杂度惩罚）→ 防止过拟合
    3. 近似分裂点搜索 → 加速（直方图算法）
==============================================================================
"""

import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_breast_cancer, load_diabetes
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor


# ============================================================================
# 1. AdaBoost 分类器
# ============================================================================
class AdaBoost:
    """
    AdaBoost (Adaptive Boosting) 分类器。

    算法流程：
      1. 初始化样本权重 D₁(i) = 1/n（所有样本同等重要）
      2. 对 t = 1, 2, ..., T：
         a. 在当前权重分布 D_t 下训练弱分类器 G_t
         b. 计算 G_t 的加权错误率 ε_t = Σ_i D_t(i)·I(G_t(x_i)≠y_i)
         c. 计算 G_t 的权重 α_t = ½ ln((1-ε_t)/ε_t)
            （ε_t 越小 → α_t 越大 → 该分类器越重要）
         d. 更新样本权重：
            D_{t+1}(i) ∝ D_t(i)·exp(-α_t·y_i·G_t(x_i))
            即：正确分类的样本权重↓，错误分类的权重↑
      3. 最终分类器：G(x) = sign(Σ_t α_t·G_t(x))

    统计解释：
      AdaBoost 等价于用指数损失函数的前向分步加法模型。
      每一步更新恰好是最小化指数损失的最优解。
    """

    def __init__(self, n_estimators: int = 50, learning_rate: float = 1.0):
        """
        Parameters
        ----------
        n_estimators : 弱分类器数量 T
        learning_rate : 学习率 η（用于缩小每个分类器的贡献，η<1 通常更好）
        """
        self.n_estimators = n_estimators
        self.learning_rate = learning_rate
        self.estimators_ = []     # 弱分类器列表
        self.estimator_weights_ = []  # 对应的 α_t
        self.estimator_errors_ = []   # 每轮的错误率

    def fit(self, X: np.ndarray, y: np.ndarray):
        y = np.where(y <= 0, -1, 1)
        n_samples = X.shape[0]

        # 初始化样本权重（均匀分布）
        sample_weights = np.ones(n_samples) / n_samples

        for t in range(self.n_estimators):
            # ---- a. 训练弱分类器 ----
            # 使用加权样本训练（这里用决策树桩：深度为1的决策树）
            stump = DecisionTreeClassifier(max_depth=1, random_state=t)
            stump.fit(X, y, sample_weight=sample_weights)
            y_pred = stump.predict(X)

            # ---- b. 计算加权错误率 ----
            # ε = Σ_i w_i · I(G(x_i) ≠ y_i)
            incorrect = (y_pred != y).astype(float)
            error = np.sum(sample_weights * incorrect) / np.sum(sample_weights)

            # 如果错误率 ≥ 0.5（比随机还差），停止
            if error >= 0.5:
                break

            # ---- c. 计算分类器权重 ----
            # α = ½ · ln((1-ε)/ε) · η
            alpha = self.learning_rate * 0.5 * np.log((1 - error) / max(error, 1e-10))

            self.estimators_.append(stump)
            self.estimator_weights_.append(alpha)
            self.estimator_errors_.append(error)

            # ---- d. 更新样本权重 ----
            # w_i ← w_i · exp(-α · y_i · G(x_i))
            sample_weights *= np.exp(-alpha * y * y_pred)

            # 归一化
            sample_weights /= np.sum(sample_weights)

        return self

    def predict(self, X: np.ndarray) -> np.ndarray:
        """
        加权投票：G(x) = sign(Σ_t α_t G_t(x))
        """
        n_samples = X.shape[0]
        aggregate = np.zeros(n_samples)

        for alpha, estimator in zip(self.estimator_weights_, self.estimators_):
            pred = estimator.predict(X)
            aggregate += alpha * pred

        return np.where(aggregate >= 0, 1, -1)

    def score(self, X: np.ndarray, y: np.ndarray) -> float:
        y = np.where(y <= 0, -1, 1)
        return np.mean(self.predict(X) == y)

    def staged_score(self, X: np.ndarray, y: np.ndarray) -> list:
        """返回每个弱分类器加入后的累积准确率"""
        y = np.where(y <= 0, -1, 1)
        n_samples = X.shape[0]
        aggregate = np.zeros(n_samples)
        scores = []

        for alpha, estimator in zip(self.estimator_weights_, self.estimators_):
            aggregate += alpha * estimator.predict(X)
            acc = np.mean(np.where(aggregate >= 0, 1, -1) == y)
            scores.append(acc)

        return scores


# ============================================================================
# 2. GBDT (Gradient Boosting Decision Tree) — 回归
# ============================================================================
class GBDTRegressor:
    """
    梯度提升决策树（回归）。

    核心思想：
      第 t 轮，用一棵回归树去拟合当前模型的**负梯度**：
        r_i = -∂L(y_i, f(x_i)) / ∂f(x_i) |_{f=f_{t-1}}

      然后更新: f_t(x) = f_{t-1}(x) + η · h_t(x)
      其中 h_t(x) 是拟合负梯度的回归树。

    对于平方损失 L = ½(y-f)²，负梯度 = y - f，即拟合残差。

    这正是"梯度下降在函数空间的推广"：
      - 传统梯度下降：在参数空间更新 θ
      - GBDT：在函数空间更新 f(x)，每步沿负梯度方向走 η 步
    """

    def __init__(self, n_estimators: int = 100, learning_rate: float = 0.1,
                 max_depth: int = 3, min_samples_split: int = 2):
        self.n_estimators = n_estimators
        self.learning_rate = learning_rate
        self.max_depth = max_depth
        self.min_samples_split = min_samples_split
        self.estimators_ = []       # 回归树列表
        self.initial_pred_ = None   # 初始预测（均值）

    def fit(self, X: np.ndarray, y: np.ndarray):
        n_samples = X.shape[0]

        # 初始预测：目标值的均值（最优常数预测）
        self.initial_pred_ = np.mean(y)
        current_pred = np.full(n_samples, self.initial_pred_)

        for t in range(self.n_estimators):
            # ---- 计算负梯度（对平方损失即残差）----
            # r_i = -∂L/∂f = y - f  (平方损失)
            residuals = y - current_pred

            # ---- 用回归树拟合负梯度 ----
            tree = DecisionTreeRegressor(
                max_depth=self.max_depth,
                min_samples_split=self.min_samples_split,
                random_state=t
            )
            tree.fit(X, residuals)

            # ---- 更新预测 ----
            # f_t(x) = f_{t-1}(x) + η · h_t(x)
            update = self.learning_rate * tree.predict(X)
            current_pred += update

            self.estimators_.append(tree)

        return self

    def predict(self, X: np.ndarray) -> np.ndarray:
        pred = np.full(X.shape[0], self.initial_pred_)
        for tree in self.estimators_:
            pred += self.learning_rate * tree.predict(X)
        return pred

    def score(self, X: np.ndarray, y: np.ndarray) -> float:
        """R² 分数"""
        y_pred = self.predict(X)
        ss_res = np.sum((y - y_pred) ** 2)
        ss_tot = np.sum((y - np.mean(y)) ** 2)
        return 1 - ss_res / ss_tot


# ============================================================================
# 3. XGBoost 风格（简化版，展示核心创新）
# ============================================================================
class SimpleXGBoostRegressor:
    """
    简化版 XGBoost，展示其核心思想。

    相比 GBDT 的两个关键改进：
      1. 用二阶泰勒展开更精确地近似损失函数
      2. 显式加入树复杂度的正则化项

    XGBoost 的目标函数（第 t 轮）：
      Obj_t = Σ_i [g_i h_t(x_i) + ½ h_i h_t(x_i)²] + γ·T + ½λ·Σⱼ w_j²

      其中 g_i = ∂L/∂f_{t-1}, h_i = ∂²L/∂f_{t-1}²（一阶和二阶梯度）
      T 是叶节点数，w_j 是叶节点权重，γ 和 λ 是正则化参数。

    这是 XGBoost 相比 GBDT 最重要的理论贡献：
      正则化防止过拟合 + 二阶信息加速收敛。
    """

    def __init__(self, n_estimators: int = 100, learning_rate: float = 0.1,
                 max_depth: int = 3, reg_lambda: float = 1.0, gamma: float = 0.0):
        self.n_estimators = n_estimators
        self.learning_rate = learning_rate
        self.max_depth = max_depth
        self.reg_lambda = reg_lambda  # L2 正则化强度 λ
        self.gamma = gamma            # 叶节点分裂的最小损失减少量
        self.estimators_ = []
        self.initial_pred_ = None

    def fit(self, X: np.ndarray, y: np.ndarray):
        n_samples = X.shape[0]
        self.initial_pred_ = np.mean(y)
        current_pred = np.full(n_samples, self.initial_pred_)

        for t in range(self.n_estimators):
            # ---- 对平方损失：g = (f - y), h = 1 ----
            # L = ½(y - f)²
            # g = ∂L/∂f = f - y
            # h = ∂²L/∂f² = 1
            g = current_pred - y  # 一阶梯度
            h = np.ones(n_samples)  # 二阶梯度（平方损失恒为 1）

            # 用回归树拟合（XGBoost 用精确的分裂搜索，这里简化为普通回归树）
            # XGBoost 的分裂增益：
            #   Gain = ½[G_L²/(H_L+λ) + G_R²/(H_R+λ) - (G_L+G_R)²/(H_L+H_R+λ)] - γ
            # 其中 G = Σg_i, H = Σh_i（叶节点内的梯度和）
            tree = DecisionTreeRegressor(
                max_depth=self.max_depth, random_state=t
            )
            tree.fit(X, -g)  # 负梯度方向

            update = self.learning_rate * tree.predict(X)

            # 简化版 L2 正则化（XGBoost 在叶节点层面做正则化）
            # 这里在更新后正则化
            current_pred += update / (1 + self.reg_lambda * self.learning_rate)

            self.estimators_.append(tree)

        return self

    def predict(self, X: np.ndarray) -> np.ndarray:
        pred = np.full(X.shape[0], self.initial_pred_)
        for tree in self.estimators_:
            pred += self.learning_rate * tree.predict(X) / (
                1 + self.reg_lambda * self.learning_rate
            )
        return pred


# ============================================================================
# 示例
# ============================================================================
if __name__ == "__main__":
    print("=" * 60)
    print("第11章 提升方法 — AdaBoost / GBDT / XGBoost")
    print("=" * 60)

    # ==================================================================
    # 1. AdaBoost
    # ==================================================================
    print("\n--- AdaBoost 分类 ---")
    X_clf, y_clf = load_breast_cancer(return_X_y=True)
    Xc_train, Xc_test, yc_train, yc_test = train_test_split(
        X_clf, y_clf, test_size=0.3, random_state=42
    )
    scaler_clf = StandardScaler()
    Xc_train = scaler_clf.fit_transform(Xc_train)
    Xc_test = scaler_clf.transform(Xc_test)

    # 训练
    ada = AdaBoost(n_estimators=50, learning_rate=1.0)
    ada.fit(Xc_train, yc_train)

    print(f"  弱分类器数: {len(ada.estimators_)}")
    print(f"  测试准确率: {ada.score(Xc_test, yc_test):.4f}")

    # 错误率变化
    print("  各轮加权错误率（前10轮）:")
    for i, err in enumerate(ada.estimator_errors_[:10]):
        print(f"    轮次{i+1:2d}: ε_t = {err:.4f}, α_t = {ada.estimator_weights_[i]:.4f}")

    # 准确率随轮次变化
    staged = ada.staged_score(Xc_test, yc_test)
    print(f"  第1轮测试准确率: {staged[0]:.4f}")
    print(f"  第10轮测试准确率: {staged[9]:.4f}")
    print(f"  最终测试准确率: {staged[-1]:.4f}")

    # ==================================================================
    # 2. GBDT
    # ==================================================================
    print("\n--- GBDT 回归 ---")
    X_reg, y_reg = load_diabetes(return_X_y=True)
    Xr_train, Xr_test, yr_train, yr_test = train_test_split(
        X_reg, y_reg, test_size=0.3, random_state=42
    )
    scaler_reg = StandardScaler()
    Xr_train = scaler_reg.fit_transform(Xr_train)
    Xr_test = scaler_reg.transform(Xr_test)

    gbdt = GBDTRegressor(n_estimators=100, learning_rate=0.1, max_depth=3)
    gbdt.fit(Xr_train, yr_train)
    r2_gbdt = gbdt.score(Xr_test, yr_test)
    print(f"  测试 R² = {r2_gbdt:.4f}")

    # 不同学习率对比
    print("\n  不同学习率对比 (n_estimators=100):")
    for lr in [0.01, 0.05, 0.1, 0.5, 1.0]:
        g = GBDTRegressor(n_estimators=100, learning_rate=lr, max_depth=3)
        g.fit(Xr_train, yr_train)
        print(f"    η={lr:.2f}: R²={g.score(Xr_test, yr_test):.4f}")

    # ==================================================================
    # 3. 简化 XGBoost
    # ==================================================================
    print("\n--- 简化 XGBoost 回归 ---")
    xgb = SimpleXGBoostRegressor(n_estimators=100, learning_rate=0.1,
                                  max_depth=3, reg_lambda=1.0)
    xgb.fit(Xr_train, yr_train)
    r2_xgb = xgb.score(Xr_test, yr_test)
    print(f"  测试 R² = {r2_xgb:.4f}")
    print(f"  λ=1.0（有正则化）")

    # 正则化效果对比
    print("\n  正则化强度对比:")
    for lam in [0.0, 0.5, 1.0, 5.0, 10.0]:
        x = SimpleXGBoostRegressor(n_estimators=100, learning_rate=0.1,
                                    max_depth=3, reg_lambda=lam)
        x.fit(Xr_train, yr_train)
        r2_train = x.score(Xr_train, yr_train)
        r2_test = x.score(Xr_test, yr_test)
        print(f"    λ={lam:5.1f}: 训练R²={r2_train:.4f}, 测试R²={r2_test:.4f}")

    print("\n" + "=" * 60)
    print("关键观察")
    print("-" * 60)
    print("1. AdaBoost 通过样本重加权让后续分类器关注困难样本")
    print("2. α_t = ½ ln((1-ε)/ε)：错误率越低，分类器权重越大")
    print("3. GBDT = 函数空间中的梯度下降，每步拟合负梯度")
    print("4. 学习率 η < 1 时模型更稳定（shrinkage），但需要更多树")
    print("5. XGBoost 的核心创新：二阶泰勒展开 + 显式正则化")
    print("6. 相比 AdaBoost，GBDT 对异常值更鲁棒（L2 损失 vs 指数损失）")
    print("=" * 60)
