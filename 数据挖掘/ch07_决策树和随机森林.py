"""
==============================================================================
第7章 决策树模型 — ID3 / C4.5 / CART / 随机森林
==============================================================================
统计思想：
  决策树是一棵递归划分特征空间的树，每次划分让子节点的"纯度"最高。
  这本质上是一种贪心策略——在每一步选择当前看起来最好的特征来切分。

  三个核心问题：
    1. 特征选择 — 用什么度量标准选特征
    2. 树的生成 — 递归划分直到停止条件
    3. 树的剪枝 — 防止过拟合（简化树结构）

  三种特征选择准则（对应三种算法）：

                  熵 H(D) = -Σ_k p_k · log p_k

    ID3:  信息增益    g(D,A)   = H(D) - Σ_v (|Dᵛ|/|D|)·H(Dᵛ)
          （选增益最大的特征，偏向取值多的特征）

    C4.5: 信息增益比  g_R(D,A) = g(D,A) / H_A(D)
          其中 H_A(D) = -Σ_v (|Dᵛ|/|D|)·log(|Dᵛ|/|D|)
          （修正了 ID3 对多值特征的偏倚）

    CART: 基尼指数    Gini(D) = 1 - Σ_k p_k²
          （计算更快，不需 log 运算）

  基尼指数的统计直觉：
    随机从 D 中抽两个样本，它们类别不一致的概率。
    基尼指数越小 → 节点越纯。

  随机森林的核心思想 (Bagging + 随机特征选择)：
    - Bootstrap 采样：每个树用不同的自助样本训练 → 降低方差
    - 随机特征子集：每次分裂只考虑部分特征 → 降低树间相关性
    - 通过"投票"聚合多棵树 → 偏差不变，方差显著降低

  方差-偏差视角：
    单棵决策树 → 低偏差（可以完美拟合训练数据），高方差（对数据扰动敏感）
    随机森林    → 低偏差（依然是深层树），低方差（投票平均降低方差）
==============================================================================
"""

import numpy as np
from collections import Counter


# ============================================================================
# 1. 决策树分类器
# ============================================================================
class DecisionTreeClassifier:
    """
    决策树分类器。

    支持三种特征选择准则：
      - 'entropy':  信息增益 (ID3)
      - 'gain_ratio': 信息增益比 (C4.5)
      - 'gini':     基尼指数 (CART)

    算法流程：
      1. 若当前节点所有样本属于同一类 → 设为叶节点
      2. 若没有特征可用或样本数过少 → 设为叶节点（多数投票）
      3. 计算每个特征的划分准则，选择最优特征
      4. 按最优特征划分数据集，递归构建子树
    """

    class Node:
        """决策树节点"""
        __slots__ = ('feature_idx', 'threshold', 'value', 'left', 'right', 'is_leaf')

        def __init__(self):
            self.feature_idx = None   # 分裂特征索引
            self.threshold = None     # 分裂阈值（连续值用）
            self.value = None         # 叶节点的预测类别
            self.left = None          # 左子树
            self.right = None         # 右子树
            self.is_leaf = False      # 是否叶节点

    def __init__(self, criterion: str = 'gini', max_depth: int = None,
                 min_samples_split: int = 2, min_samples_leaf: int = 1):
        """
        Parameters
        ----------
        criterion : 'entropy', 'gain_ratio', 'gini'
        max_depth : 最大深度（None 则不限制，用于预剪枝）
        min_samples_split : 节点最少样本数才分裂
        min_samples_leaf : 叶节点最少样本数
        """
        self.criterion = criterion
        self.max_depth = max_depth
        self.min_samples_split = min_samples_split
        self.min_samples_leaf = min_samples_leaf
        self.root_ = None
        self.classes_ = None
        self.n_features_ = None

    def fit(self, X: np.ndarray, y: np.ndarray):
        self.classes_ = np.unique(y)
        self.n_features_ = X.shape[1]
        self.root_ = self._build_tree(X, y, depth=0)

    def _build_tree(self, X, y, depth):
        """递归构建决策树"""
        n_samples = X.shape[0]

        # 停止条件
        if (len(np.unique(y)) == 1 or                          # 所有样本同类
            n_samples < self.min_samples_split or              # 样本太少
            (self.max_depth and depth >= self.max_depth)):     # 达到最大深度
            node = self.Node()
            node.is_leaf = True
            node.value = Counter(y).most_common(1)[0][0]
            return node

        # 寻找最优分裂
        best_feature, best_threshold, best_score = self._best_split(X, y)

        # 若无法再提升，设为叶节点
        if best_feature is None:
            node = self.Node()
            node.is_leaf = True
            node.value = Counter(y).most_common(1)[0][0]
            return node

        # 按最优特征和阈值分裂
        if best_threshold is not None:
            # 连续特征：二分
            left_mask = X[:, best_feature] <= best_threshold
        else:
            left_mask = X[:, best_feature] == best_threshold

        right_mask = ~left_mask

        # 若一侧为空，设为叶节点
        if np.sum(left_mask) == 0 or np.sum(right_mask) == 0:
            node = self.Node()
            node.is_leaf = True
            node.value = Counter(y).most_common(1)[0][0]
            return node

        node = self.Node()
        node.feature_idx = best_feature
        node.threshold = best_threshold
        node.left = self._build_tree(X[left_mask], y[left_mask], depth + 1)
        node.right = self._build_tree(X[right_mask], y[right_mask], depth + 1)

        return node

    def _best_split(self, X, y):
        """贪心搜索最优分裂特征和阈值"""
        best_gain = -np.inf
        best_feature = None
        best_threshold = None
        n_samples = X.shape[0]

        # 分裂前的纯度
        parent_score = self._node_impurity(y)

        for feature_idx in range(X.shape[1]):
            values = X[:, feature_idx]

            # 对每个特征，尝试所有可能的分裂点
            unique_vals = np.unique(values)

            if len(unique_vals) == 1:
                continue  # 该特征只有一个值，无法分裂

            # 连续值的中值作为候选分裂点
            if len(unique_vals) > 10:  # 连续特征，取分位数
                thresholds = np.percentile(
                    unique_vals, np.linspace(10, 90, min(20, len(unique_vals)))
                )
            else:
                thresholds = unique_vals

            for threshold in thresholds:
                left_mask = values <= threshold
                right_mask = ~left_mask

                n_left, n_right = np.sum(left_mask), np.sum(right_mask)
                if n_left < self.min_samples_leaf or n_right < self.min_samples_leaf:
                    continue

                # 加权子节点纯度
                child_score = (
                    n_left / n_samples * self._node_impurity(y[left_mask]) +
                    n_right / n_samples * self._node_impurity(y[right_mask])
                )

                gain = parent_score - child_score

                # C4.5 的信息增益比：除以特征本身的信息（分裂信息）
                if self.criterion == 'gain_ratio' and gain > 0:
                    split_info = -(
                        n_left / n_samples * np.log2(n_left / n_samples + 1e-15) +
                        n_right / n_samples * np.log2(n_right / n_samples + 1e-15)
                    )
                    gain = gain / (split_info + 1e-15) if split_info > 0 else 0

                if gain > best_gain:
                    best_gain = gain
                    best_feature = feature_idx
                    best_threshold = threshold

        return best_feature, best_threshold, best_gain

    def _node_impurity(self, y):
        """计算节点的不纯度"""
        _, counts = np.unique(y, return_counts=True)
        probs = counts / counts.sum()

        if self.criterion in ('entropy', 'gain_ratio'):
            # 熵: H = -Σ p_k log₂ p_k
            return -np.sum(probs * np.log2(probs + 1e-15))

        elif self.criterion == 'gini':
            # 基尼指数: Gini = 1 - Σ p_k²
            return 1 - np.sum(probs ** 2)

        else:
            raise ValueError(f"Unknown criterion: {self.criterion}")

    def predict(self, X: np.ndarray) -> np.ndarray:
        return np.array([self._predict_one(x, self.root_) for x in X])

    def _predict_one(self, x, node):
        if node.is_leaf:
            return node.value

        if x[node.feature_idx] <= node.threshold:
            return self._predict_one(x, node.left)
        else:
            return self._predict_one(x, node.right)


# ============================================================================
# 2. 随机森林分类器
# ============================================================================
class RandomForestClassifier:
    """
    随机森林分类器。

    统计思想：
      设单棵树方差为 σ²，树间相关系数为 ρ，有 B 棵树。
      随机森林的方差上界为: Var ≤ ρσ² + (1-ρ)σ²/B

      当 B → ∞ 时: Var → ρσ²
      所以目标是让 ρ 越小越好（降低树间相关性），同时让 σ² 不太大。

      实现方法：
        1. Bootstrap 采样 → 每棵树用不同数据
        2. 随机子集特征 → 每次分裂只考虑 √n_features 个特征
        3. 深层树（不剪枝）→ 保持低偏差
    """

    def __init__(self, n_estimators: int = 100, max_depth: int = None,
                 max_features: str = 'sqrt', min_samples_split: int = 2):
        self.n_estimators = n_estimators
        self.max_depth = max_depth
        self.max_features = max_features
        self.min_samples_split = min_samples_split
        self.trees_ = []
        self.classes_ = None

    def fit(self, X: np.ndarray, y: np.ndarray):
        self.classes_ = np.unique(y)
        n_samples, n_features = X.shape

        # 每次分裂考虑的特征数
        if self.max_features == 'sqrt':
            max_ft = int(np.sqrt(n_features))
        elif self.max_features == 'log2':
            max_ft = int(np.log2(n_features))
        else:
            max_ft = n_features
        max_ft = max(1, max_ft)

        self.trees_ = []
        for _ in range(self.n_estimators):
            # 1. Bootstrap 采样 (有放回)
            indices = np.random.choice(n_samples, n_samples, replace=True)
            X_boot, y_boot = X[indices], y[indices]

            # 2. 随机特征子集
            ft_subset = np.random.choice(n_features, max_ft, replace=False)

            # 3. 仅用特征子集训练决策树
            tree = DecisionTreeClassifier(
                criterion='gini',
                max_depth=self.max_depth,
                min_samples_split=self.min_samples_split
            )
            tree.fit(X_boot[:, ft_subset], y_boot)

            # 保存树及其特征子集
            self.trees_.append((tree, ft_subset))

    def predict(self, X: np.ndarray) -> np.ndarray:
        """Bagging 投票"""
        all_preds = np.zeros((len(X), len(self.trees_)), dtype=object)

        for i, (tree, ft_subset) in enumerate(self.trees_):
            all_preds[:, i] = tree.predict(X[:, ft_subset])

        # 多数投票
        final_preds = []
        for sample_preds in all_preds:
            final_preds.append(Counter(sample_preds).most_common(1)[0][0])
        return np.array(final_preds)


# ============================================================================
# 示例
# ============================================================================
if __name__ == "__main__":
    print("=" * 60)
    print("第7章 决策树模型 — ID3/C4.5/CART / 随机森林")
    print("=" * 60)

    from sklearn.datasets import load_iris
    from sklearn.model_selection import train_test_split

    X, y = load_iris(return_X_y=True)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.3, random_state=42
    )

    # ---- 三种准则对比 ----
    print("\n--- 三种特征选择准则对比 ---")
    for criterion in ['entropy', 'gain_ratio', 'gini']:
        dt = DecisionTreeClassifier(criterion=criterion, max_depth=5)
        dt.fit(X_train, y_train)
        y_pred = dt.predict(X_test)
        acc = np.mean(y_pred == y_test)
        label = {'entropy': '信息增益(ID3)', 'gain_ratio': '增益比(C4.5)',
                 'gini': '基尼指数(CART)'}[criterion]
        print(f"  {label:20s}: 准确率 = {acc:.4f}")

    # ---- 不同深度下过拟合观察 ----
    print("\n--- 不同深度下训练/测试准确率（观察过拟合）---")
    for depth in [1, 2, 3, 5, 10, None]:
        dt = DecisionTreeClassifier(max_depth=depth)
        dt.fit(X_train, y_train)
        train_acc = np.mean(dt.predict(X_train) == y_train)
        test_acc = np.mean(dt.predict(X_test) == y_test)
        depth_str = str(depth) if depth else "无限制"
        print(f"  max_depth={depth_str:6s}: 训练={train_acc:.4f}, 测试={test_acc:.4f}")

    # ---- 随机森林 ----
    print("\n--- 随机森林 ---")
    rf = RandomForestClassifier(n_estimators=50, max_depth=5, max_features='sqrt')
    rf.fit(X_train, y_train)
    y_pred_rf = rf.predict(X_test)
    acc_rf = np.mean(y_pred_rf == y_test)
    print(f"  随机森林 (50棵树): 测试准确率 = {acc_rf:.4f}")

    # 单棵树 vs 森林
    single_tree = DecisionTreeClassifier(max_depth=None)
    single_tree.fit(X_train, y_train)
    acc_single = np.mean(single_tree.predict(X_test) == y_test)
    print(f"  单棵决策树 (无限制): 测试准确率 = {acc_single:.4f}")

    print("\n" + "=" * 60)
    print("关键观察")
    print("-" * 60)
    print("1. 树越深 → 训练误差越低但测试误差可能上升（过拟合）")
    print("2. 信息增益偏向多值特征，增益比对此做了修正")
    print("3. 基尼指数计算更快（无需 log），实践中效果相近")
    print("4. 随机森林通过 Bagging+随机特征，显著降低方差")
    print("5. 偏差-方差角度：单树低偏差高方差；森林低偏差低方差")
    print("=" * 60)
