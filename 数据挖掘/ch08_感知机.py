"""
==============================================================================
第8章 感知机模型
==============================================================================
统计思想：
  感知机是神经网络的基本单元，也是最简单的线性二分类器。
  它假设数据是线性可分的，通过误分类驱动的更新规则来寻找一个
  能够完全分开正负样本的超平面。

  模型形式：
    f(x) = sign(wᵀx + b)

    其中 sign(z) = +1 if z ≥ 0 else -1

  感知机 vs 逻辑回归：
    感知机: 硬分类，输出 +1/-1，用 0-1 阶梯函数
    逻辑回归: 软分类，输出概率，用 Sigmoid 平滑函数
    感知机可看作逻辑回归在无限陡峭 Sigmoid 时的极限

  学习策略（误分类驱动）：
    损失函数: L(w, b) = -Σ_{误分类样本} yᵢ · (wᵀxᵢ + b)
    几何解释: 损失 = 误分类点到超平面的距离之和的符号修正版

  更新规则（随机梯度下降 SGD）：
    对每个误分类样本 (xᵢ, yᵢ)：
      w ← w + η · yᵢ · xᵢ
      b ← b + η · yᵢ

  为什么这个更新有意义？
    注意到 yᵢ = ±1，若 yᵢ = +1 但被误分为 -1：
      意味着 wᵀxᵢ + b < 0
      更新后: w ← w + η·xᵢ → 新的 wᵀxᵢ 增大了 η·||xᵢ||² > 0
      朝着正确的方向修正！

  Novikoff 定理（收敛性保证）：
    若数据线性可分且 ||xᵢ|| ≤ R，存在 γ > 0 使 yᵢ(w*ᵀxᵢ+b*) ≥ γ，
    则感知机在最多 (R/γ)² 次更新后收敛（最多误分类次数有上界）。
==============================================================================
"""

import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler


class Perceptron:
    """
    感知机分类器。

    算法流程：
      1. 初始化 w = 0, b = 0
      2. 遍历训练数据，找到误分类样本 (yᵢ·(wᵀxᵢ+b) ≤ 0)
      3. 更新: w ← w + η·yᵢ·xᵢ, b ← b + η·yᵢ
      4. 重复直到所有样本正确分类或达到最大迭代次数
    """

    def __init__(self, lr: float = 0.01, max_iter: int = 1000):
        """
        Parameters
        ----------
        lr : float, 学习率 η
        max_iter : int, 最大迭代次数
        """
        self.lr = lr
        self.max_iter = max_iter
        self.w_ = None
        self.b_ = None
        self.n_iter_ = 0   # 实际迭代次数
        self.errors_ = []   # 每轮误分类数

    def fit(self, X: np.ndarray, y: np.ndarray):
        """
        训练感知机。

        注意：收敛前提是数据线性可分。
        如果数据不可分，算法会一直震荡（不会收敛）。
        """
        n_samples, n_features = X.shape

        # 确保 y ∈ {+1, -1}
        y = np.where(y <= 0, -1, 1)

        # 初始化参数
        self.w_ = np.zeros(n_features)
        self.b_ = 0.0

        for epoch in range(self.max_iter):
            n_errors = 0

            # 遍历每个样本（SGD）
            for i in range(n_samples):
                # 检查是否误分类
                # 正确分类时 yᵢ·(wᵀxᵢ + b) > 0；误分类时 ≤ 0
                if y[i] * (np.dot(self.w_, X[i]) + self.b_) <= 0:
                    # 更新: w ← w + η·yᵢ·xᵢ
                    self.w_ += self.lr * y[i] * X[i]
                    self.b_ += self.lr * y[i]
                    n_errors += 1

            self.errors_.append(n_errors)

            if n_errors == 0:
                # 所有样本正确分类
                self.n_iter_ = epoch + 1
                return self

        self.n_iter_ = self.max_iter
        return self

    def predict(self, X: np.ndarray) -> np.ndarray:
        """预测: sign(wᵀx + b)"""
        scores = X @ self.w_ + self.b_
        return np.where(scores >= 0, 1, -1)

    def score(self, X: np.ndarray, y: np.ndarray) -> float:
        y = np.where(y <= 0, -1, 1)
        return np.mean(self.predict(X) == y)

    def decision_function(self, X: np.ndarray) -> np.ndarray:
        """返回决策函数值 wᵀx + b"""
        return X @ self.w_ + self.b_


# ============================================================================
# 示例
# ============================================================================
if __name__ == "__main__":
    print("=" * 60)
    print("第8章 感知机模型")
    print("=" * 60)

    # 构造线性可分的二分类数据（取鸢尾花前两类）
    X, y = load_iris(return_X_y=True)
    # 只取前两类（setosa vs versicolor），前两个特征便于可视化
    mask = y != 2
    X_bin = X[mask][:, :2]
    y_bin = y[mask]

    # 转换为 +1/-1
    y_bin = np.where(y_bin == 0, -1, 1)

    X_train, X_test, y_train, y_test = train_test_split(
        X_bin, y_bin, test_size=0.3, random_state=42
    )

    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test = scaler.transform(X_test)

    # ---- 训练感知机 ----
    perceptron = Perceptron(lr=1.0, max_iter=1000)
    perceptron.fit(X_train, y_train)

    print(f"\n迭代次数: {perceptron.n_iter_}")
    print(f"权重: w = {perceptron.w_}")
    print(f"偏置: b = {perceptron.b_:.4f}")
    print(f"训练准确率: {perceptron.score(X_train, y_train):.4f}")
    print(f"测试准确率: {perceptron.score(X_test, y_test):.4f}")

    # ---- 可视化决策边界 ----
    print("\n--- 决策边界可视化 ---")
    try:
        # 生成网格点
        x_min, x_max = X_train[:, 0].min() - 1, X_train[:, 0].max() + 1
        y_min, y_max = X_train[:, 1].min() - 1, X_train[:, 1].max() + 1
        xx, yy = np.meshgrid(np.linspace(x_min, x_max, 200),
                             np.linspace(y_min, y_max, 200))
        grid = np.c_[xx.ravel(), yy.ravel()]
        Z = perceptron.predict(grid).reshape(xx.shape)

        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))

        # 左：决策边界
        ax1.contourf(xx, yy, Z, alpha=0.3, cmap='coolwarm')
        scatter = ax1.scatter(X_train[:, 0], X_train[:, 1], c=y_train,
                              cmap='coolwarm', edgecolors='k', s=50)
        ax1.set_title('感知机决策边界')
        ax1.set_xlabel('特征 1（标准化）')
        ax1.set_ylabel('特征 2（标准化）')

        # 右：误分类数随迭代的变化
        ax2.plot(range(1, len(perceptron.errors_) + 1), perceptron.errors_,
                 'b-', linewidth=2)
        ax2.set_xlabel('迭代轮次')
        ax2.set_ylabel('误分类样本数')
        ax2.set_title('感知机收敛过程')
        ax2.grid(True, alpha=0.3)

        plt.tight_layout()
        plt.savefig('ch08_perceptron.png', dpi=100)
        print("  图像已保存至 ch08_perceptron.png")
        plt.close()
    except Exception as e:
        print(f"  可视化失败（无 GUI 环境）: {e}")

    # ---- 验证 Novikoff 定理 ----
    print("\n--- Novikoff 定理验证 ---")
    # 计算所有训练样本的最大范数 R
    R = max(np.linalg.norm(x) for x in X_train)
    # 计算归一化权重的间隔 γ（使用最终权重）
    w_norm = np.linalg.norm(perceptron.w_)
    margins = y_train * (X_train @ perceptron.w_ + perceptron.b_)
    # 对最小间隔做估计
    gamma_est = np.min(margins[margins > 0]) / w_norm if w_norm > 0 else 0
    if gamma_est > 0:
        bound = (R / gamma_est) ** 2
        print(f"  R = {R:.4f} (样本最大范数)")
        print(f"  γ ≈ {gamma_est:.4f} (估计的间隔)")
        print(f"  误分类次数上界 ≈ {bound:.0f}")
        print(f"  实际误分类次数 = {sum(perceptron.errors_)}")
    else:
        print("  数据不完全线性可分（或权重视为零）")

    print("\n" + "=" * 60)
    print("关键观察")
    print("-" * 60)
    print("1. 感知机只在线性可分数据上收敛（Novikoff 定理保证）")
    print("2. 初始值和样本顺序不同，解也不同（解不唯一）")
    print("3. 感知机等价于随机梯度下降法求解最小化误分类损失")
    print("4. 感知机对噪声/异常值敏感——一个异常点可能导致不收敛")
    print("5. 感知机是神经网络的基础，多层感知机 → 深度学习的起源")
    print("=" * 60)
