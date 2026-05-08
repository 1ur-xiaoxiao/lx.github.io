"""
==============================================================================
第3章 K近邻模型 — KNN / KD树
==============================================================================
统计思想：
  K近邻是一种非参数方法，**不对数据的概率分布做任何假设**。
  它基于一个朴素的直觉：相似的样本应当有相似的标签（"近朱者赤"）。

  核心三要素：
  1. 距离度量 — 如何定义"近"（欧氏距离 / 曼哈顿距离 / 闵可夫斯基距离）
  2. K 值选择 — 参考多少个邻居（K 小→复杂→高方差；K 大→简单→高偏差）
  3. 分类决策规则 — 如何利用 K 个邻居的信息（多数投票 / 加权投票）

  最近邻分类器的误差率理论界：
    设 P* 为贝叶斯最优错误率，最近邻分类器的错误率 R 满足：
      P* ≤ R ≤ 2P*(1 - P*)
    即最近邻的错误率不超过贝叶斯最优错误率的两倍。

  KD树 (k-dimensional tree)：
    用于加速最近邻搜索的空间划分数据结构。
    通过递归沿坐标轴划分空间，将搜索复杂度从 O(n) 降至平均 O(log n)。
==============================================================================
"""

import numpy as np
from collections import Counter
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler


# ============================================================================
# 1. K近邻分类器
# ============================================================================
class KNNClassifier:
    """
    K近邻分类器。

    算法流程：
      1. 训练：直接记住所有训练数据（惰性学习，无显式训练过程）
      2. 预测：对每个测试样本，
         a. 计算它与所有训练样本的距离
         b. 找出距离最小的 K 个邻居
         c. 用这 K 个邻居的标签进行多数投票
    """

    def __init__(self, n_neighbors: int = 5, p: int = 2):
        """
        Parameters
        ----------
        n_neighbors : K 值。K 越小模型越复杂（过拟合风险），越大越平滑（欠拟合风险）
        p : 闵可夫斯基距离的阶数。p=2 为欧氏距离，p=1 为曼哈顿距离
        """
        self.n_neighbors = n_neighbors
        self.p = p
        self.X_train_ = None
        self.y_train_ = None

    def fit(self, X: np.ndarray, y: np.ndarray):
        """
        训练：KNN 是惰性学习 (lazy learning)，训练时只存储数据，不做任何计算。
        这既是优点（无需训练时间，新数据容易加入），也是缺点（预测速度慢）。
        """
        self.X_train_ = X
        self.y_train_ = y

    def predict(self, X: np.ndarray) -> np.ndarray:
        """对每个测试样本进行预测"""
        return np.array([self._predict_one(x) for x in X])

    def _predict_one(self, x: np.ndarray):
        """
        对单个样本 x 进行预测。

        KNN 的决策规则（多数投票）：
          y_hat = argmax_c Σ_{i∈N_K(x)} I(yᵢ = c)
        其中 N_K(x) 是 x 的 K 个最近邻的索引集合。
        """
        # 计算 x 到所有训练样本的闵可夫斯基距离
        # d(x, x') = (Σ|x_j - x'_j|^p)^{1/p}
        distances = np.sum(np.abs(self.X_train_ - x) ** self.p, axis=1) ** (1 / self.p)

        # 找到 K 个最近邻的索引
        knn_indices = np.argsort(distances)[:self.n_neighbors]

        # 多数投票
        knn_labels = self.y_train_[knn_indices]
        most_common = Counter(knn_labels).most_common(1)[0][0]
        return most_common

    def predict_proba(self, X: np.ndarray) -> np.ndarray:
        """
        返回每个类别的概率估计：
          P(c|x) = (K个邻居中属于c的数量) / K
        """
        probas = []
        for x in X:
            distances = np.sum(np.abs(self.X_train_ - x) ** self.p, axis=1) ** (1 / self.p)
            knn_indices = np.argsort(distances)[:self.n_neighbors]
            knn_labels = self.y_train_[knn_indices]
            counts = Counter(knn_labels)
            # 构建概率向量
            classes = np.unique(self.y_train_)
            probs = np.array([counts.get(c, 0) / self.n_neighbors for c in classes])
            probas.append(probs)
        return np.array(probas)


# ============================================================================
# 2. KD树 (K-Dimensional Tree)
# ============================================================================
class KDTree:
    """
    KD树：用于高效最近邻搜索的二叉空间划分树。

    统计思想：
      当训练样本数 n 很大时，暴力搜索 O(nd) 太慢。
      KD树通过每次沿一个坐标轴将空间一分为二，把搜索限制在局部区域。

    构建过程：
      1. 选择方差最大的维度作为切分维度（或轮流选择）
      2. 取该维度的中位数作为切分点
      3. 递归构建左右子树

    搜索过程：
      1. 从根节点沿树向下找到测试点所在的叶子区域
      2. 回溯：检查兄弟区域是否可能与当前最优解更近
      3. 如果兄弟区域与测试点的距离 < 当前最优距离，则搜索兄弟区域
    """

    class Node:
        """KD树节点"""
        __slots__ = ('point', 'label', 'split_dim', 'left', 'right')

        def __init__(self, point, label, split_dim):
            self.point = point      # (d,) 数据点坐标
            self.label = label      # 类别标签
            self.split_dim = split_dim  # 该节点切分的维度索引
            self.left = None        # 左子树（在 split_dim 上 ≤ 节点的样本）
            self.right = None       # 右子树（在 split_dim 上 > 节点的样本）

    def __init__(self):
        self.root = None
        self.n_features = None

    def build(self, X: np.ndarray, y: np.ndarray, depth: int = 0):
        """
        递归构建 KD 树。

        复杂度：O(n log n) 时间（每层找中位数 O(n)，共 log n 层）
        """
        if len(X) == 0:
            return None

        n_features = X.shape[1]
        # 选择切分维度：轮流选取（也可选方差最大的维度）
        split_dim = depth % n_features

        # 沿切分维度排序，取中位数
        sorted_idx = np.argsort(X[:, split_dim])
        median_idx = len(sorted_idx) // 2
        median_pos = sorted_idx[median_idx]

        node = self.Node(X[median_pos], y[median_pos], split_dim)

        # 递归构建左右子树
        left_idx = sorted_idx[:median_idx]
        right_idx = sorted_idx[median_idx + 1:]

        node.left = self.build(X[left_idx], y[left_idx], depth + 1)
        node.right = self.build(X[right_idx], y[right_idx], depth + 1)

        return node

    def fit(self, X: np.ndarray, y: np.ndarray):
        self.n_features = X.shape[1]
        self.root = self.build(X, y)
        return self

    def nearest_neighbor(self, query: np.ndarray, k: int = 1):
        """
        查找 k 个最近邻。

        核心：维护一个大小为 k 的最大堆（按距离），搜索过程中持续更新。
        """
        # 使用列表存储 (距离, 标签) 对，按距离从大到小排序便于替换
        best = []  # [(distance, label), ...]

        def _search(node):
            if node is None:
                return

            # 计算当前节点到查询点的欧氏距离
            dist = np.sum((node.point - query) ** 2)  # 先用平方距离比较（避免开方）

            # 如果堆未满或当前点更近，则入堆
            if len(best) < k or dist < best[-1][0]:
                # 按距离插入保持有序（从大到小）
                inserted = False
                for i, (d, _) in enumerate(best):
                    if dist <= d:
                        best.insert(i, (dist, node.label))
                        inserted = True
                        break
                if not inserted:
                    best.append((dist, node.label))
                # 保持堆大小为 k
                if len(best) > k:
                    best.pop()

            # 决定先搜索哪一侧
            dim = node.split_dim
            diff = query[dim] - node.point[dim]

            # 先搜索 query 所在的那一侧（近侧）
            if diff <= 0:
                near_child, far_child = node.left, node.right
            else:
                near_child, far_child = node.right, node.left

            _search(near_child)

            # 判断是否需要搜索远侧：
            # 如果当前最优距离 > 查询点到分割超平面的距离，则远侧可能有更近的点
            if len(best) < k or abs(diff) ** 2 < best[-1][0]:
                _search(far_child)

        _search(self.root)

        # 返回实际距离（开方）
        labels = [label for _, label in best]
        return labels


# ============================================================================
# 3. 距离度量函数
# ============================================================================
def euclidean_distance(x1: np.ndarray, x2: np.ndarray) -> float:
    """欧氏距离 (L2): d = √Σ(xᵢ - yᵢ)²"""
    return np.sqrt(np.sum((x1 - x2) ** 2))


def manhattan_distance(x1: np.ndarray, x2: np.ndarray) -> float:
    """曼哈顿距离 (L1): d = Σ|xᵢ - yᵢ|"""
    return np.sum(np.abs(x1 - x2))


def minkowski_distance(x1: np.ndarray, x2: np.ndarray, p: int = 2) -> float:
    """闵可夫斯基距离: d = (Σ|xᵢ - yᵢ|^p)^{1/p}"""
    return np.sum(np.abs(x1 - x2) ** p) ** (1 / p)


# ============================================================================
# 示例
# ============================================================================
if __name__ == "__main__":
    print("=" * 60)
    print("第3章 K近邻模型 — KNN / KD树")
    print("=" * 60)

    # 加载鸢尾花数据集
    X, y = load_iris(return_X_y=True)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.3, random_state=42
    )
    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test = scaler.transform(X_test)

    # ---- 暴力搜索 KNN ----
    print("\n--- KNN（暴力搜索）---")
    for k in [1, 3, 5, 10, 50]:
        knn = KNNClassifier(n_neighbors=k)
        knn.fit(X_train, y_train)
        y_pred = knn.predict(X_test)
        acc = np.mean(y_pred == y_test)
        print(f"  K={k:2d}: 准确率 = {acc:.4f}")

    # ---- KD树 ----
    print("\n--- KD树最近邻搜索 ---")
    tree = KDTree()
    tree.fit(X_train, y_train)

    # 对前5个测试样本，分别用暴力搜索和 KD 树搜索最近邻并对比
    print("  对比暴力搜索与KD树结果（前5个测试样本）：")
    for i in range(min(5, len(X_test))):
        # KD树
        kd_labels = tree.nearest_neighbor(X_test[i], k=1)
        # 暴力
        distances = np.sum((X_train - X_test[i]) ** 2, axis=1)
        brute_label = y_train[np.argmin(distances)]
        match = "✓" if kd_labels[0] == brute_label else "✗"
        print(f"    样本{i}: KD树={kd_labels[0]}, 暴力={brute_label} {match}")

    print("\n" + "=" * 60)
    print("关键观察")
    print("-" * 60)
    print("1. KNN 不需要训练——所有计算都在预测时进行（惰性学习）")
    print("2. K=1 时对噪声极度敏感（高方差），但训练误差为 0")
    print("3. K 过大会把远处不相关的样本也纳入投票（高偏差）")
    print("4. 实践中通过交叉验证选择最优 K")
    print("5. KD树在高维时退化（维度灾难），实际常用近似近邻搜索")
    print("=" * 60)
