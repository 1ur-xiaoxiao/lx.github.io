// ============================================================
// 复变函数闯关答题 — 题库
// 每章 12 道选择题，覆盖定义、计算、概念判断
// ============================================================

const QUIZ_QUESTIONS = {

  // ========== 第一章：复数与复变函数 ==========
  ch1: [
    {
      id: "ch1_q1",
      question: "设 $z = 3 - 4i$，则 $|z|$ 等于？",
      options: ["$3$", "$4$", "$5$", "$7$"],
      correct: 2,
      explanation: "$|z| = \\sqrt{3^2 + (-4)^2} = \\sqrt{9+16} = 5$"
    },
    {
      id: "ch1_q2",
      question: "复数 $z = 1 + i$ 的辐角主值 $\\arg z$ 是？",
      options: ["$0$", "$\\frac{\\pi}{4}$", "$\\frac{\\pi}{2}$", "$\\pi$"],
      correct: 1,
      explanation: "$z=1+i$ 在第一象限，辐角主值 $\\arg z = \\arctan(1/1) = \\pi/4$"
    },
    {
      id: "ch1_q3",
      question: "设 $z = x + iy$，则 $\\bar{z}$（共轭复数）等于？",
      options: ["$-x - iy$", "$x - iy$", "$-x + iy$", "$-y + ix$"],
      correct: 1,
      explanation: "共轭复数的定义：$\\bar{z} = x - iy$，实部不变，虚部取反号。"
    },
    {
      id: "ch1_q4",
      question: "$z \\cdot \\bar{z}$ 等于什么？",
      options: ["$|z|$", "$|z|^2$", "$2\\Re(z)$", "$2i\\Im(z)$"],
      correct: 1,
      explanation: "$z \\cdot \\bar{z} = (x+iy)(x-iy) = x^2 + y^2 = |z|^2$"
    },
    {
      id: "ch1_q5",
      question: "将 $z = -1 + i$ 写成三角形式，正确的是？",
      options: [
        "$\\sqrt{2}(\\cos\\frac{\\pi}{4} + i\\sin\\frac{\\pi}{4})$",
        "$\\sqrt{2}(\\cos\\frac{3\\pi}{4} + i\\sin\\frac{3\\pi}{4})$",
        "$\\sqrt{2}(\\cos\\frac{5\\pi}{4} + i\\sin\\frac{5\\pi}{4})$",
        "$\\sqrt{2}(\\cos\\frac{7\\pi}{4} + i\\sin\\frac{7\\pi}{4})$"
      ],
      correct: 1,
      explanation: "$|-1+i| = \\sqrt{2}$，在第二象限，辐角为 $3\\pi/4$。"
    },
    {
      id: "ch1_q6",
      question: "根据棣莫弗 (de Moivre) 公式，$(\\cos\\theta + i\\sin\\theta)^n$ 等于？",
      options: [
        "$\\cos(n\\theta) + i\\sin(n\\theta)$",
        "$n(\\cos\\theta + i\\sin\\theta)$",
        "$\\cos(\\theta^n) + i\\sin(\\theta^n)$",
        "$\\cos\\theta + i n\\sin\\theta$"
      ],
      correct: 0,
      explanation: "棣莫弗公式：$(\\cos\\theta + i\\sin\\theta)^n = \\cos(n\\theta) + i\\sin(n\\theta)$"
    },
    {
      id: "ch1_q7",
      question: "方程 $z^3 = 1$ 在复数域中有几个根？",
      options: ["$1$ 个", "$2$ 个", "$3$ 个", "无穷多个"],
      correct: 2,
      explanation: "代数基本定理：$n$ 次方程在复数域中恰有 $n$ 个根。$z^3=1$ 的三个根为 $1, e^{2\\pi i/3}, e^{4\\pi i/3}$。"
    },
    {
      id: "ch1_q8",
      question: "在复平面上，满足 $|z - 1| = 2$ 的点 $z$ 构成什么图形？",
      options: ["一条直线", "一条射线", "一个圆", "一个椭圆"],
      correct: 2,
      explanation: "$|z - z_0| = r$ 表示以 $z_0$ 为圆心、$r$ 为半径的圆。这里是以 $1$ 为圆心、$2$ 为半径的圆。"
    },
    {
      id: "ch1_q9",
      question: "设 $z_1 = 2(\\cos\\frac{\\pi}{3} + i\\sin\\frac{\\pi}{3})$，$z_2 = 3(\\cos\\frac{\\pi}{6} + i\\sin\\frac{\\pi}{6})$，则 $z_1 z_2$ 的模为？",
      options: ["$5$", "$6$", "$1$", "$\\frac{2}{3}$"],
      correct: 1,
      explanation: "两复数相乘，模相乘：$|z_1 z_2| = |z_1| \\cdot |z_2| = 2 \\times 3 = 6$"
    },
    {
      id: "ch1_q10",
      question: "下列哪个集合是复平面上的<strong>区域</strong>（开集且连通）？",
      options: [
        "$|z| \\le 1$（单位闭圆盘）",
        "$|z| < 1$（单位开圆盘）",
        "$|z| = 1$（单位圆周）",
        "$\\{1, i, -1, -i\\}$（四个孤立点）"
      ],
      correct: 1,
      explanation: "区域必须是开集（不含边界）且连通。只有 $|z|<1$ 满足两个条件。单位闭圆盘含边界，不是开集。"
    },
    {
      id: "ch1_q11",
      question: "复变函数 $f(z) = z^2$ 把 $z = x + iy$ 映到 $w = u + iv$，则 $u$ 和 $v$ 的表达式为？",
      options: [
        "$u = x^2 + y^2,\\; v = 2xy$",
        "$u = x^2 - y^2,\\; v = 2xy$",
        "$u = x^2,\\; v = y^2$",
        "$u = 2x,\\; v = 2y$"
      ],
      correct: 1,
      explanation: "$f(z) = (x+iy)^2 = (x^2 - y^2) + i(2xy)$，所以 $u = x^2 - y^2$，$v = 2xy$。"
    },
    {
      id: "ch1_q12",
      question: "满足 $\\Im(z) > 0$ 的点集在复平面上对应什么？",
      options: ["右半平面", "左半平面", "上半平面", "下半平面"],
      correct: 2,
      explanation: "$\\Im(z) = y > 0$ 表示虚部为正，即上半平面。"
    }
  ],

  // ========== 第二章：解析函数 ==========
  ch2: [
    {
      id: "ch2_q1",
      question: "复变函数 $f(z)$ 在点 $z_0$ 处<strong>可导</strong>（可微）的定义中，极限 $\\lim_{\\Delta z \\to 0} \\frac{f(z_0+\\Delta z)-f(z_0)}{\\Delta z}$ 需要满足什么条件？",
      options: [
        "只需沿实轴方向的极限存在",
        "只需沿虚轴方向的极限存在",
        "沿任意方向趋近的极限都存在且相等",
        "只需沿两个坐标轴方向的极限存在且相等"
      ],
      correct: 2,
      explanation: "复可导要求 $\\Delta z \\to 0$ 沿<strong>任意方向</strong>的极限都存在且相等，这比实可导（只需左右两个方向）严苛得多。"
    },
    {
      id: "ch2_q2",
      question: "Cauchy-Riemann 方程（直角坐标形式）是什么？",
      options: [
        "$\\frac{\\partial u}{\\partial x} = \\frac{\\partial v}{\\partial y},\\; \\frac{\\partial u}{\\partial y} = \\frac{\\partial v}{\\partial x}$",
        "$\\frac{\\partial u}{\\partial x} = \\frac{\\partial v}{\\partial y},\\; \\frac{\\partial u}{\\partial y} = -\\frac{\\partial v}{\\partial x}$",
        "$\\frac{\\partial u}{\\partial x} = -\\frac{\\partial v}{\\partial y},\\; \\frac{\\partial u}{\\partial y} = \\frac{\\partial v}{\\partial x}$",
        "$\\frac{\\partial u}{\\partial x} = -\\frac{\\partial v}{\\partial y},\\; \\frac{\\partial u}{\\partial y} = -\\frac{\\partial v}{\\partial x}$"
      ],
      correct: 1,
      explanation: "C-R 方程：$u_x = v_y$，$u_y = -v_x$。这是函数解析的必要条件。"
    },
    {
      id: "ch2_q3",
      question: "函数 $f(z)$ 在区域 $D$ 内<strong>解析</strong>（全纯）是指？",
      options: [
        "$f(z)$ 在 $D$ 内处处连续",
        "$f(z)$ 在 $D$ 内处处可导",
        "$f(z)$ 在 $D$ 内有定义",
        "$f(z)$ 在 $D$ 内处处有界"
      ],
      correct: 1,
      explanation: "解析 = 在区域内<strong>处处可导</strong>。注意：只在一点可导不足以称为解析，必须在一个区域内每点都可导。"
    },
    {
      id: "ch2_q4",
      question: "设 $f(z) = u(x,y) + iv(x,y)$ 在区域 $D$ 内解析，则 $u$ 和 $v$ 满足什么方程？",
      options: [
        "波动方程 $u_{xx} = u_{yy}$",
        "热传导方程 $u_{xx} = u_t$",
        "Laplace 方程 $u_{xx} + u_{yy} = 0$",
        "Poisson 方程 $u_{xx} + u_{yy} = f(x,y)$"
      ],
      correct: 2,
      explanation: "解析函数的实部和虚部都是调和函数，满足 Laplace 方程：$u_{xx} + u_{yy} = 0$，$v_{xx} + v_{yy} = 0$。"
    },
    {
      id: "ch2_q5",
      question: "检查 $f(z) = \\bar{z} = x - iy$ 是否满足 C-R 方程？",
      options: [
        "满足，且函数解析",
        "不满足，函数处处不可导",
        "满足，但函数只在 $z=0$ 处可导",
        "不满足，但函数在实轴上可导"
      ],
      correct: 1,
      explanation: "$u=x, v=-y$，$u_x=1 \\ne v_y=-1$，不满足 C-R 方程，所以 $f(z)=\\bar{z}$ 处处不可导。共轭函数是复分析中最经典的非解析函数例子。"
    },
    {
      id: "ch2_q6",
      question: "若 $f(z)$ 在区域 $D$ 内解析且 $f'(z) = 0$（恒为零），则 $f(z)$ 在 $D$ 内是什么？",
      options: [
        "恒为零",
        "常数",
        "一次函数",
        "无法确定"
      ],
      correct: 1,
      explanation: "导数为零意味着 $u_x = u_y = v_x = v_y = 0$，所以 $u$ 和 $v$ 都是常数，$f(z)$ 为常数。这与实分析一致。"
    },
    {
      id: "ch2_q7",
      question: "函数 $f(z) = |z|^2 = x^2 + y^2$ 在哪些点可导？",
      options: [
        "处处可导",
        "处处不可导",
        "只在 $z=0$ 处可导",
        "只在实轴上可导"
      ],
      correct: 2,
      explanation: "$u=x^2+y^2, v=0$。C-R 方程要求 $u_x=v_y \\Rightarrow 2x=0$ 且 $u_y=-v_x \\Rightarrow 2y=0$，只可能在 $z=0$ 处满足。但仅在一点可导不能称为"解析"。"
    },
    {
      id: "ch2_q8",
      question: "若 $u(x,y)$ 是区域 $D$ 内的调和函数，则其<strong>共轭调和函数</strong> $v(x,y)$ 由什么确定？",
      options: [
        "由 $u$ 的梯度直接给出",
        "由 C-R 方程积分确定（差一个常数）",
        "$v$ 必须是 $u$ 的复共轭",
        "$v$ 可以任意选择"
      ],
      correct: 1,
      explanation: "已知 $u$，通过 C-R 方程 $v_x = -u_y$，$v_y = u_x$ 积分求出 $v$（差一个实常数），从而构造解析函数 $f = u + iv$。"
    },
    {
      id: "ch2_q9",
      question: "指数函数 $e^z = e^{x+iy}$ 的模 $|e^z|$ 等于？",
      options: ["$e^x$", "$e^y$", "$e^{|z|}$", "$1$"],
      correct: 0,
      explanation: "$|e^z| = |e^x \\cdot e^{iy}| = |e^x| \\cdot |e^{iy}| = e^x \\cdot 1 = e^x$。注意 $|e^{iy}| = 1$。"
    },
    {
      id: "ch2_q10",
      question: "下列哪个函数<strong>不是</strong>整个复平面上的解析函数（不是整函数）？",
      options: ["$e^z$", "$\\sin z$", "$z^n$（$n$ 为正整数）", "$\\bar{z}$"],
      correct: 3,
      explanation: "$\\bar{z}$ 处处不可导。$e^z, \\sin z, z^n$ 都在整个复平面上解析，它们都是整函数（entire function）。"
    },
    {
      id: "ch2_q11",
      question: "如果解析函数 $f(z) = u + iv$ 的实部 $u$ 为常数，则 $f(z)$ 本身是什么？",
      options: [
        "恒为零",
        "常数",
        "任意解析函数",
        "纯虚数函数"
      ],
      correct: 1,
      explanation: "$u$ 为常数意味着 $u_x = u_y = 0$，由 C-R 方程得 $v_x = v_y = 0$，所以 $v$ 也为常数，$f(z)$ 为常数。"
    },
    {
      id: "ch2_q12",
      question: "C-R 方程在极坐标 $(r,\\theta)$ 下的形式是？",
      options: [
        "$u_r = v_\\theta,\\; u_\\theta = -v_r$",
        "$u_r = \\frac{1}{r}v_\\theta,\\; \\frac{1}{r}u_\\theta = -v_r$",
        "$u_r = r v_\\theta,\\; r u_\\theta = v_r$",
        "$u_r = -v_\\theta,\\; u_\\theta = v_r$"
      ],
      correct: 1,
      explanation: "极坐标下的 C-R 方程：$u_r = \\frac{1}{r}v_\\theta$，$\\frac{1}{r}u_\\theta = -v_r$（或等价地 $v_r = -\\frac{1}{r}u_\\theta$）。"
    }
  ],

  // ========== 第三章：初等函数 ==========
  ch3: [
    {
      id: "ch3_q1",
      question: "复指数函数 $e^z$ 与实指数函数最重要的不同是？",
      options: [
        "$e^z$ 在复平面上不连续",
        "$e^z$ 是周期函数，周期为 $2\\pi i$",
        "$e^z$ 可以取负值",
        "$e^z$ 的导数不是自身"
      ],
      correct: 1,
      explanation: "$e^{z + 2\\pi i} = e^z \\cdot e^{2\\pi i} = e^z \\cdot 1 = e^z$，所以 $e^z$ 以 $2\\pi i$ 为周期。这是实指数函数没有的性质。"
    },
    {
      id: "ch3_q2",
      question: "复对数函数 $\\operatorname{Log} z$（主值）的定义是？",
      options: [
        "$\\ln|z| + i\\arg z$，其中 $\\arg z \\in (-\\pi, \\pi]$",
        "$\\ln|z| + i\\theta$，$\\theta$ 可以取任意值",
        "$\\ln z$（与实对数相同）",
        "$\\ln|z|$"
      ],
      correct: 0,
      explanation: "对数主值：$\\operatorname{Log} z = \\ln|z| + i\\operatorname{Arg} z$，其中辐角主值 $\\operatorname{Arg} z \\in (-\\pi, \\pi]$。"
    },
    {
      id: "ch3_q3",
      question: "$\\operatorname{Log}(-1)$ 的值是？",
      options: ["$0$", "$\\pi i$", "$-\\pi i$", "$1$"],
      correct: 1,
      explanation: "$|-1| = 1$，$\\operatorname{Arg}(-1) = \\pi$，所以 $\\operatorname{Log}(-1) = \\ln 1 + i\\pi = \\pi i$。"
    },
    {
      id: "ch3_q4",
      question: "复对数函数的多值性来源于什么？",
      options: [
        "$|z|$ 的多值性",
        "$\\ln|z|$ 的多值性",
        "辐角的多值性（可以加 $2k\\pi$）",
        "指数函数的多值性"
      ],
      correct: 2,
      explanation: "对数函数的多值分支：$\\log z = \\ln|z| + i(\\arg z + 2k\\pi), k \\in \\ZZ$。多值性来源于辐角可以加任意整数倍的 $2\\pi$。"
    },
    {
      id: "ch3_q5",
      question: "$\\sin(i)$ 的值是？",
      options: ["$i\\sinh 1$", "$\\sinh 1$", "$i\\sin 1$", "$0$"],
      correct: 0,
      explanation: "$\\sin(iy) = i\\sinh y$。当 $y=1$ 时，$\\sin(i) = i\\sinh 1$。一般公式：$\\sin z = \\sin x \\cosh y + i\\cos x \\sinh y$。"
    },
    {
      id: "ch3_q6",
      question: "复三角函数 $\\sin z$ 和 $\\cos z$ 在复平面上是否有界？",
      options: [
        "都有界，$|\\sin z| \\le 1, |\\cos z| \\le 1$",
        "都无界（与实情形不同！）",
        "$\\sin z$ 有界，$\\cos z$ 无界",
        "$\\cos z$ 有界，$\\sin z$ 无界"
      ],
      correct: 1,
      explanation: "这是复三角函数与实三角函数的重要区别！$|\\sin z|$ 和 $|\\cos z|$ 在复平面上可以任意大，因为它们包含 $\\cosh y$ 和 $\\sinh y$ 因子，$y \\to \\infty$ 时趋于无穷。"
    },
    {
      id: "ch3_q7",
      question: "幂函数 $z^\\alpha$（$\\alpha$ 为复数）的一般定义为？",
      options: [
        "$z^\\alpha = e^{\\alpha \\log z}$",
        "$z^\\alpha = \\alpha \\ln z$",
        "$z^\\alpha = |z|^\\alpha e^{i\\alpha\\theta}$",
        "$z^\\alpha = (e^z)^\\alpha$"
      ],
      correct: 0,
      explanation: "一般幂函数通过指数和对数定义：$z^\\alpha = e^{\\alpha \\log z}$。由于 $\\log z$ 是多值的，$z^\\alpha$ 通常也是多值的（当 $\\alpha$ 不是整数时）。"
    },
    {
      id: "ch3_q8",
      question: "$\\operatorname{Log}(-i)$ 的值是？",
      options: [
        "$\\frac{\\pi}{2}i$",
        "$-\\frac{\\pi}{2}i$",
        "$\\pi i$",
        "$0$"
      ],
      correct: 1,
      explanation: "$|-i| = 1$，$\\operatorname{Arg}(-i) = -\\pi/2$（在负虚轴上），所以 $\\operatorname{Log}(-i) = \\ln 1 - i\\pi/2 = -\\frac{\\pi}{2}i$。"
    },
    {
      id: "ch3_q9",
      question: "根式函数 $\\sqrt{z}$（即 $z^{1/2}$）有几个分支？",
      options: ["$1$ 个", "$2$ 个", "无穷多个", "取决于 $z$ 的值"],
      correct: 1,
      explanation: "$z^{1/2} = e^{(1/2)\\log z} = \\pm \\sqrt{|z|}e^{i\\theta/2}$。由于 $\\log z$ 的辐角每增加 $2\\pi$，$z^{1/2}$ 就取反号，所以它只有两个分支。一般来说 $z^{1/n}$ 有 $n$ 个分支。"
    },
    {
      id: "ch3_q10",
      question: "下列哪个等式在复数域中<strong>不</strong>一定成立？",
      options: [
        "$e^{z_1+z_2} = e^{z_1}e^{z_2}$",
        "$\\sin^2 z + \\cos^2 z = 1$",
        "$\\log(z_1 z_2) = \\log z_1 + \\log z_2$（一般对数）",
        "$e^{\\log z} = z$（一般对数）"
      ],
      correct: 2,
      explanation: "对于一般（多值）对数，$\\log(z_1 z_2) = \\log z_1 + \\log z_2 + 2k\\pi i$，可能差 $2\\pi i$ 的整数倍。$e^{\\log z} = z$ 总是成立的。"
    },
    {
      id: "ch3_q11",
      question: "$e^{\\pi i}$ 的值是？",
      options: ["$1$", "$-1$", "$0$", "$i$"],
      correct: 1,
      explanation: "Euler 恒等式：$e^{\\pi i} = \\cos\\pi + i\\sin\\pi = -1 + 0 = -1$。这是数学中最著名的公式之一。"
    },
    {
      id: "ch3_q12",
      question: "函数 $f(z) = \\sqrt[3]{z}$ 在复平面上除了原点外，在哪些地方不解析？",
      options: [
        "整个复平面都解析",
        "只在正实轴上不解析",
        "在负实轴（分支切割）上不连续，不可导",
        "在虚轴上不解析"
      ],
      correct: 2,
      explanation: "定义了分支切割（通常取负实轴）后，$\\sqrt[3]{z}$ 在切割两侧不连续，因此不解析。这是多值函数单值化的代价。"
    }
  ],

  // ========== 第四章：复积分 ==========
  ch4: [
    {
      id: "ch4_q1",
      question: "设 $C$ 为正向单位圆周 $|z|=1$，则 $\\oint_C \\frac{1}{z}\\,dz$ 等于？",
      options: ["$0$", "$1$", "$2\\pi i$", "$\\pi i$"],
      correct: 2,
      explanation: "这是最基本的围道积分：$\\oint_C z^{-1}dz = 2\\pi i$。一般地，$\\oint_C (z-a)^n dz = 2\\pi i$ 当 $n=-1$ 且 $a$ 在 $C$ 内部；否则为 $0$。"
    },
    {
      id: "ch4_q2",
      question: "若 $f(z)$ 在单连通区域 $D$ 内解析，$C$ 为 $D$ 内任意闭合曲线，则 $\\oint_C f(z)\\,dz$ 等于？",
      options: [
        "$2\\pi i \\cdot f(0)$",
        "$0$",
        "无法确定",
        "$2\\pi i \\sum \\operatorname{Res} f$"
      ],
      correct: 1,
      explanation: "这就是 Cauchy-Goursat 定理：在单连通区域内解析的函数沿任何闭合曲线的积分为零。"
    },
    {
      id: "ch4_q3",
      question: "Cauchy 积分公式：若 $f(z)$ 在正向简单闭曲线 $C$ 内解析，$z_0$ 在 $C$ 内部，则 $f(z_0)$ 等于？",
      options: [
        "$\\frac{1}{2\\pi i}\\oint_C \\frac{f(z)}{z-z_0}\\,dz$",
        "$\\oint_C \\frac{f(z)}{z-z_0}\\,dz$",
        "$\\frac{1}{2\\pi}\\oint_C f(z)\\,dz$",
        "$\\oint_C f'(z)\\,dz$"
      ],
      correct: 0,
      explanation: "Cauchy 积分公式：$f(z_0) = \\frac{1}{2\\pi i}\\oint_C \\frac{f(z)}{z-z_0}dz$。它说明解析函数在内部的值完全由边界上的值决定！"
    },
    {
      id: "ch4_q4",
      question: "若 $f(z)$ 在整个复平面上解析且有界，则根据 Liouville 定理，$f(z)$ 是什么？",
      options: [
        "多项式",
        "常数",
        "有理函数",
        "指数函数"
      ],
      correct: 1,
      explanation: "Liouville 定理：有界整函数必为常数。这个看似简单的结论有着深远影响——比如用它证明代数基本定理。"
    },
    {
      id: "ch4_q5",
      question: "Cauchy 积分公式的高阶导数形式：$f^{(n)}(z_0)$ 等于？",
      options: [
        "$\\frac{1}{2\\pi i}\\oint_C \\frac{f(z)}{(z-z_0)^{n+1}}\\,dz$",
        "$\\frac{n!}{2\\pi i}\\oint_C \\frac{f(z)}{(z-z_0)^{n+1}}\\,dz$",
        "$\\frac{1}{2\\pi i}\\oint_C \\frac{f(z)}{(z-z_0)^n}\\,dz$",
        "$\\frac{n!}{2\\pi i}\\oint_C f^{(n)}(z)\\,dz$"
      ],
      correct: 1,
      explanation: "高阶导数公式：$f^{(n)}(z_0) = \\frac{n!}{2\\pi i}\\oint_C \\frac{f(z)}{(z-z_0)^{n+1}}dz$。这表明解析函数自动无穷次可导！"
    },
    {
      id: "ch4_q6",
      question: "下列哪个定理可以直接用 Liouville 定理推出？",
      options: [
        "Cauchy 积分公式",
        "代数基本定理（任何非常数多项式在复数域中必有根）",
        "留数定理",
        "最大模原理"
      ],
      correct: 1,
      explanation: "代数基本定理的标准证明之一：假设多项式 $P(z)$ 无根，则 $1/P(z)$ 是全平面有界解析函数（整函数），由 Liouville 定理为常数，矛盾。"
    },
    {
      id: "ch4_q7",
      question: "最大模原理说的是什么？",
      options: [
        "解析函数的模在区域内为常数",
        "非常数解析函数的模不能在区域内部取到最大值",
        "解析函数的模随 $|z|$ 增大而增大",
        "解析函数的模在边界上为零"
      ],
      correct: 1,
      explanation: "最大模原理：若 $f(z)$ 在区域 $D$ 内解析且不恒为常数，则 $|f(z)|$ 不能在 $D$ 内部取到最大值（只能在边界上取到）。"
    },
    {
      id: "ch4_q8",
      question: "计算 $\\oint_{|z|=2} \\frac{e^z}{z-1}\\,dz$（正向）",
      options: ["$0$", "$2\\pi i$", "$2\\pi i \\cdot e$", "$2\\pi i \\cdot e^2$"],
      correct: 2,
      explanation: "$z_0 = 1$ 在圆 $|z|=2$ 内部。由 Cauchy 积分公式：$\\oint \\frac{e^z}{z-1}dz = 2\\pi i \\cdot e^1 = 2\\pi i e$。"
    },
    {
      id: "ch4_q9",
      question: "计算 $\\oint_{|z|=1} \\frac{1}{z^2}\\,dz$（正向单位圆）",
      options: ["$0$", "$2\\pi i$", "$-2\\pi i$", "$1$"],
      correct: 0,
      explanation: "$\\oint_C (z-a)^n dz = 0$ 当 $n \\ne -1$。这里 $1/z^2 = z^{-2}$，$n = -2 \\ne -1$，所以积分为 $0$。"
    },
    {
      id: "ch4_q10",
      question: "若 $f(z)$ 在区域 $D$ 内解析且 $|f(z)|$ 在 $D$ 内为常数，则 $f(z)$ 本身是什么？",
      options: [
        "恒为零",
        "常数",
        "可以不恒为常数",
        "可以是任意解析函数"
      ],
      correct: 1,
      explanation: "若 $|f|$ 为常数 $c$：当 $c=0$ 时 $f=0$；当 $c>0$ 时 $f\\bar{f}=c^2$，结合解析性可证 $f$ 必为常数。这也可以从 C-R 方程直接推出。"
    },
    {
      id: "ch4_q11",
      question: "计算实积分 $\\int_0^{2\\pi} \\frac{1}{5+4\\cos\\theta}\\,d\\theta$ 最合适的方法是什么？",
      options: [
        "直接使用 Newton-Leibniz 公式",
        "用留数定理，令 $z = e^{i\\theta}$，化为单位圆周上的复积分",
        "用分部积分",
        "用三角恒等式化简被积函数"
      ],
      correct: 1,
      explanation: "这类含 $\\cos\\theta, \\sin\\theta$ 的 $[0, 2\\pi]$ 定积分，标准方法是令 $z = e^{i\\theta}$，则 $\\cos\\theta = \\frac{z+z^{-1}}{2}$，$d\\theta = \\frac{dz}{iz}$，化为单位圆周上的围道积分后用留数定理。"
    },
    {
      id: "ch4_q12",
      question: "Cauchy 不等式：若 $|f(z)| \\le M$ 在 $|z-z_0| = R$ 上成立，则 $|f^{(n)}(z_0)|$ 不超过？",
      options: [
        "$\\frac{M}{R^n}$",
        "$\\frac{M \\cdot n!}{R^n}$",
        "$\\frac{M \\cdot n!}{R^{n+1}}$",
        "$M \\cdot n!$"
      ],
      correct: 1,
      explanation: "Cauchy 不等式：$|f^{(n)}(z_0)| \\le \\frac{M \\cdot n!}{R^n}$。这是从高阶导数公式直接推出的重要估计。"
    }
  ],

  // ========== 第五章：级数 ==========
  ch5: [
    {
      id: "ch5_q1",
      question: "幂级数 $\\sum_{n=0}^{\\infty} a_n (z - z_0)^n$ 的收敛半径 $R$ 由公式 $R = \\lim_{n \\to \\infty} |a_n / a_{n+1}|$（若极限存在）给出。那么幂级数 $\\sum_{n=0}^{\\infty} \\frac{z^n}{n!}$ 的收敛半径是？",
      options: ["$0$", "$1$", "$e$", "$\\infty$"],
      correct: 3,
      explanation: "$a_n = 1/n!$，$R = \\lim |a_n/a_{n+1}| = \\lim (n+1) = \\infty$。指数函数 $e^z$ 的 Taylor 展开在整个复平面上收敛。"
    },
    {
      id: "ch5_q2",
      question: "幂级数 $\\sum_{n=0}^{\\infty} z^n$ 的收敛半径是？",
      options: ["$0$", "$1$", "$\\infty$", "$2$"],
      correct: 1,
      explanation: "$a_n = 1$，$R = \\lim |a_n/a_{n+1}| = 1$。这对应几何级数 $\\frac{1}{1-z}$，在 $|z| < 1$ 内收敛。"
    },
    {
      id: "ch5_q3",
      question: "若 $f(z)$ 在 $z_0$ 处解析，则 $f(z)$ 在 $z_0$ 的某个邻域内可以展开为什么级数？",
      options: [
        "Laurent 级数",
        "Taylor 级数",
        "Fourier 级数",
        "Dirichlet 级数"
      ],
      correct: 1,
      explanation: "解析函数在解析点附近可以展开为 Taylor 级数：$f(z) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(z_0)}{n!}(z-z_0)^n$。"
    },
    {
      id: "ch5_q4",
      question: "Laurent 级数与 Taylor 级数最重要的区别是什么？",
      options: [
        "Laurent 级数收敛更快",
        "Laurent 级数包含负幂次项 $(z-z_0)^{-n}$",
        "Laurent 级数只用于实函数",
        "没有区别，两者等价"
      ],
      correct: 1,
      explanation: "Laurent 级数形如 $\\sum_{n=-\\infty}^{\\infty} a_n(z-z_0)^n$，包含负幂次项。在奇点附近，函数只能展开为 Laurent 级数而非 Taylor 级数。"
    },
    {
      id: "ch5_q5",
      question: "$f(z) = \\frac{1}{z(1-z)}$ 在 $0 < |z| < 1$ 内的 Laurent 展开中，$z^{-1}$ 的系数是多少？",
      options: ["$0$", "$1$", "$2$", "$-1$"],
      correct: 1,
      explanation: "$\\frac{1}{z(1-z)} = \\frac{1}{z} \\cdot \\frac{1}{1-z} = \\frac{1}{z}(1 + z + z^2 + \\cdots) = \\frac{1}{z} + 1 + z + \\cdots$，所以 $z^{-1}$ 的系数（即留数）为 $1$。"
    },
    {
      id: "ch5_q6",
      question: "下列哪种<strong>不是</strong>孤立奇点的类型？",
      options: ["可去奇点", "极点", "本性奇点", "分支点"],
      correct: 3,
      explanation: "孤立奇点分三类：可去奇点（Laurent 展开无负幂项）、极点（有限个负幂项）、本性奇点（无穷多个负幂项）。分支点不是孤立奇点，是多值函数的奇点。"
    },
    {
      id: "ch5_q7",
      question: "函数 $f(z) = \\frac{\\sin z}{z}$ 在 $z = 0$ 处有什么类型的奇点？",
      options: ["极点", "可去奇点", "本性奇点", "分支点"],
      correct: 1,
      explanation: "$\\lim_{z \\to 0} \\frac{\\sin z}{z} = 1$，极限存在且有限，所以 $z=0$ 是可去奇点。其 Laurent 展开为 $1 - \\frac{z^2}{3!} + \\frac{z^4}{5!} - \\cdots$，没有负幂项。"
    },
    {
      id: "ch5_q8",
      question: "函数 $f(z) = \\frac{1}{z^2}$ 在 $z=0$ 处有什么类型的奇点？",
      options: ["可去奇点", "二阶极点", "本性奇点", "不是奇点"],
      correct: 1,
      explanation: "$1/z^2$ 在 $z=0$ 处的 Laurent 展开只有一个负幂项 $z^{-2}$，所以 $z=0$ 是二阶极点。（极点的阶数 = 最高负幂次的绝对值）"
    },
    {
      id: "ch5_q9",
      question: "函数 $f(z) = e^{1/z}$ 在 $z=0$ 处有什么类型的奇点？",
      options: ["可去奇点", "极点", "本性奇点", "解析点"],
      correct: 2,
      explanation: "$e^{1/z} = \\sum_{n=0}^{\\infty} \\frac{1}{n!z^n}$，Laurent 展开有无穷多个负幂项，所以 $z=0$ 是本性奇点。本性奇点附近函数的行为非常复杂（Casorati-Weierstrass 定理）。"
    },
    {
      id: "ch5_q10",
      question: "若 $f(z)$ 在圆环域 $r < |z - z_0| < R$ 内解析，则 $f(z)$ 在该圆环域内可以展开为什么？",
      options: [
        "Taylor 级数",
        "Laurent 级数",
        "Fourier 级数",
        "幂级数（只有非负幂次）"
      ],
      correct: 1,
      explanation: "在圆环域内解析的函数可以唯一地展开为 Laurent 级数。这是 Laurent 定理的核心内容。"
    },
    {
      id: "ch5_q11",
      question: "如果 $z_0$ 是 $f(z)$ 的 $m$ 阶极点，则 $f(z)$ 在 $z_0$ 附近的 Laurent 展开中负幂项的最高次数是？",
      options: [
        "$0$（没有负幂项）",
        "$m$（即 $a_{-m} \\ne 0$，$a_{-n}=0$ 对 $n>m$）",
        "无穷大",
        "无法确定"
      ],
      correct: 1,
      explanation: "$m$ 阶极点的 Laurent 展开中，$a_{-m} \\ne 0$ 而 $a_{-n} = 0$ 对所有 $n > m$。即最高负幂次恰好为 $m$。"
    },
    {
      id: "ch5_q12",
      question: "级数 $\\sum_{n=1}^{\\infty} \\frac{z^n}{n}$ 的收敛半径是？",
      options: ["$0$", "$1$", "$e$", "$\\infty$"],
      correct: 1,
      explanation: "$a_n = 1/n$，$R = \\lim_{n \\to \\infty} |a_n/a_{n+1}| = \\lim_{n \\to \\infty} \\frac{n+1}{n} = 1$。该级数在 $|z|=1$ 上的收敛行为比较复杂。"
    }
  ],

  // ========== 第六章：留数理论及其应用 ==========
  ch6: [
    {
      id: "ch6_q1",
      question: "函数 $f(z)$ 在孤立奇点 $z_0$ 处的<strong>留数</strong>定义为？",
      options: [
        "$f(z_0)$",
        "$f'(z_0)$",
        "Laurent 展开中 $(z-z_0)^{-1}$ 的系数 $a_{-1}$",
        "$\\lim_{z \\to z_0} f(z)$"
      ],
      correct: 2,
      explanation: "留数 $\\operatorname{Res}(f, z_0) = a_{-1}$，即 Laurent 展开中 $(z-z_0)^{-1}$ 项的系数。"
    },
    {
      id: "ch6_q2",
      question: "<strong>留数定理</strong>说的是：若 $f(z)$ 在正向简单闭曲线 $C$ 内除有限个孤立奇点 $z_1, \\ldots, z_n$ 外解析，则 $\\oint_C f(z)\\,dz$ 等于？",
      options: [
        "$2\\pi i \\sum_{k=1}^n f(z_k)$",
        "$2\\pi i \\sum_{k=1}^n \\operatorname{Res}(f, z_k)$",
        "$\\sum_{k=1}^n \\operatorname{Res}(f, z_k)$",
        "$2\\pi i \\cdot n$"
      ],
      correct: 1,
      explanation: "留数定理：$\\oint_C f(z)dz = 2\\pi i \\sum_{k=1}^n \\operatorname{Res}(f, z_k)$。这是整个复分析应用的最高峰。"
    },
    {
      id: "ch6_q3",
      question: "若 $z_0$ 是 $f(z)$ 的一阶极点，则留数 $\\operatorname{Res}(f, z_0)$ 的计算公式为？",
      options: [
        "$\\lim_{z \\to z_0} z f(z)$",
        "$\\lim_{z \\to z_0} (z - z_0) f(z)$",
        "$f'(z_0)$",
        "$\\frac{1}{2\\pi i}\\oint f(z)\\,dz$"
      ],
      correct: 1,
      explanation: "一阶极点的留数公式：$\\operatorname{Res}(f, z_0) = \\lim_{z \\to z_0} (z - z_0)f(z)$。这是最常用的留数计算技巧。"
    },
    {
      id: "ch6_q4",
      question: "若 $f(z) = \\frac{P(z)}{Q(z)}$，其中 $P(z_0) \\ne 0$，$Q(z_0) = 0$，$Q'(z_0) \\ne 0$（一阶极点），则留数 $\\operatorname{Res}(f, z_0)$ 等于？",
      options: [
        "$\\frac{P(z_0)}{Q(z_0)}$",
        "$\\frac{P'(z_0)}{Q'(z_0)}$",
        "$\\frac{P(z_0)}{Q'(z_0)}$",
        "$\\frac{P'(z_0)}{Q(z_0)}$"
      ],
      correct: 2,
      explanation: "对一阶极点，若 $f = P/Q$，则 $\\operatorname{Res}(f, z_0) = P(z_0)/Q'(z_0)$。这直接来自于 $(z-z_0)f(z) \\to P(z_0)/Q'(z_0)$。"
    },
    {
      id: "ch6_q5",
      question: "计算 $\\operatorname{Res}\\left(\\frac{e^z}{z^2}, 0\\right)$",
      options: ["$0$", "$1$", "$2$", "$e$"],
      correct: 1,
      explanation: "$\\frac{e^z}{z^2} = \\frac{1}{z^2}(1 + z + \\frac{z^2}{2!} + \\cdots) = \\frac{1}{z^2} + \\frac{1}{z} + \\frac{1}{2!} + \\cdots$，$z^{-1}$ 的系数为 $1$。或者用公式 $\\operatorname{Res}(f, 0) = \\lim_{z \\to 0} \\frac{d}{dz}[z^2 f(z)] = \\lim_{z \\to 0} e^z = 1$。"
    },
    {
      id: "ch6_q6",
      question: "用留数定理计算 $\\int_{-\\infty}^{\\infty} \\frac{1}{1+x^2}\\,dx$ 的关键步骤是什么？",
      options: [
        "直接用 Newton-Leibniz 公式",
        "取上半圆围道，极点 $z = i$ 在围道内部",
        "将积分区间改为 $[0, \\infty)$",
        "对被积函数做 Taylor 展开"
      ],
      correct: 1,
      explanation: "标准方法：取由 $[-R, R]$ 和上半圆弧组成的围道。$f(z) = 1/(1+z^2)$ 在上半平面只有极点 $z = i$，$\\operatorname{Res}(f, i) = 1/(2i)$。$R \\to \\infty$ 时圆弧积分为 $0$，故原积分 = $2\\pi i \\cdot 1/(2i) = \\pi$。"
    },
    {
      id: "ch6_q7",
      question: "计算 $\\operatorname{Res}\\left(\\frac{1}{z^3(z-1)}, 0\\right)$",
      options: ["$0$", "$1$", "$-1$", "$2$"],
      correct: 2,
      explanation: "在 $0 < |z| < 1$：$\\frac{1}{z^3(z-1)} = -\\frac{1}{z^3} \\cdot \\frac{1}{1-z} = -\\frac{1}{z^3}(1+z+z^2+\\cdots) = -z^{-3} - z^{-2} - z^{-1} - \\cdots$，$z^{-1}$ 系数为 $-1$。"
    },
    {
      id: "ch6_q8",
      question: "<strong>辐角原理</strong>说的是：若 $f(z)$ 在围道 $C$ 内除有限个极点外解析，则 $\\frac{1}{2\\pi i}\\oint_C \\frac{f'(z)}{f(z)}\\,dz$ 等于？",
      options: [
        "$f$ 在 $C$ 内的零点个数",
        "$f$ 在 $C$ 内的极点个数",
        "零点个数减去极点个数（计重数）",
        "极点个数减去零点个数"
      ],
      correct: 2,
      explanation: "辐角原理：$\\frac{1}{2\\pi i}\\oint_C \\frac{f'(z)}{f(z)}dz = N - P$，其中 $N$ 为零点个数，$P$ 为极点个数（均计重数）。"
    },
    {
      id: "ch6_q9",
      question: "<strong>Rouché 定理</strong>的典型应用是？",
      options: [
        "计算定积分",
        "判断方程在区域内根的个数",
        "求函数的导数",
        "展开 Laurent 级数"
      ],
      correct: 1,
      explanation: "Rouché 定理：若在围道 $C$ 上 $|g(z)| < |f(z)|$，则 $f$ 和 $f+g$ 在 $C$ 内有相同个数的零点。典型应用是判断多项式的零点分布。"
    },
    {
      id: "ch6_q10",
      question: "对于 $m$ 阶极点 $z_0$，留数 $\\operatorname{Res}(f, z_0)$ 的公式是？",
      options: [
        "$\\lim_{z \\to z_0} (z - z_0) f(z)$",
        "$\\frac{1}{(m-1)!}\\lim_{z \\to z_0} \\frac{d^{m-1}}{dz^{m-1}}[(z - z_0)^m f(z)]$",
        "$\\lim_{z \\to z_0} f^{(m)}(z)$",
        "$\\frac{1}{m!}\\lim_{z \\to z_0} (z - z_0)^m f^{(m)}(z)$"
      ],
      correct: 1,
      explanation: "$m$ 阶极点的留数公式：$\\operatorname{Res}(f, z_0) = \\frac{1}{(m-1)!}\\lim_{z \\to z_0} \\frac{d^{m-1}}{dz^{m-1}}[(z-z_0)^m f(z)]$。$m=1$ 时回到一阶极点的公式。"
    },
    {
      id: "ch6_q11",
      question: "用留数定理计算 $\\int_{-\\infty}^{\\infty} \\frac{\\cos x}{1+x^2}\\,dx$ 时，通常考虑哪个复积分？",
      options: [
        "$\\oint \\frac{\\cos z}{1+z^2}\\,dz$",
        "$\\oint \\frac{e^{iz}}{1+z^2}\\,dz$（取实部）",
        "$\\oint \\frac{\\sin z}{1+z^2}\\,dz$",
        "$\\oint \\frac{1}{1+z^2}\\,dz$"
      ],
      correct: 1,
      explanation: "用 Jordan 引理：$\\int_{-\\infty}^{\\infty} \\frac{\\cos x}{1+x^2}dx = \\Re\\left(\\int_{-\\infty}^{\\infty} \\frac{e^{ix}}{1+x^2}dx\\right)$。考虑 $\\oint \\frac{e^{iz}}{1+z^2}dz$，上半圆围道，$R \\to \\infty$ 时圆弧积分趋于 $0$（Jordan 引理）。"
    },
    {
      id: "ch6_q12",
      question: "设 $f(z) = \\frac{1}{z^2+1}$，则 $\\operatorname{Res}(f, i)$ 等于？",
      options: ["$\\frac{1}{2i}$", "$-\\frac{1}{2i}$", "$i$", "$-i$"],
      correct: 0,
      explanation: "$f(z) = \\frac{1}{(z-i)(z+i)}$。$z=i$ 是一阶极点，$\\operatorname{Res}(f, i) = \\frac{1}{2i}$（用公式 $P/Q' = 1/(2i)$）。"
    }
  ]
};

// 每章的 Boss 信息
const BOSS_INFO = {
  ch1: {
    name: "复数之影",
    emoji: "👻",
    title: "虚实交错的幻影",
    color: "#7c3aed",
    description: "在复平面上闪烁的幻影，掌控着复数运算与几何表示的力量。击败它以解锁解析之门。"
  },
  ch2: {
    name: "解析魔像",
    emoji: "💎",
    title: "C-R 方程编织的晶体魔像",
    color: "#0891b2",
    description: "由 Cauchy-Riemann 方程凝聚而成的晶体魔像，凡是不可导者，皆被其排斥在外。"
  },
  ch3: {
    name: "多值妖灵",
    emoji: "🌀",
    title: "对数函数的无数分支化身",
    color: "#d97706",
    description: "对数函数的多值性赋予了它变幻莫测的能力——每一个分支都是一张新的面孔。"
  },
  ch4: {
    name: "积分巨龙",
    emoji: "🐉",
    title: "围绕闭合围道盘旋的巨龙",
    color: "#16a34a",
    description: "守护着 Cauchy 积分公式这条"魔法"的巨龙，内部的值全由边界决定。"
  },
  ch5: {
    name: "级数蜘蛛",
    emoji: "🕷️",
    title: "在收敛圆内织网的蛛形怪兽",
    color: "#ea580c",
    description: "在收敛圆内编织 Taylor 和 Laurent 级数之网，捕捉每一个奇点的秘密。"
  },
  ch6: {
    name: "留数魔王",
    emoji: "👹",
    title: "头顶 $2\\pi i$ 光环的终极魔王",
    color: "#dc2626",
    description: "复变函数的最终 Boss。掌握留数定理的力量，可以轻松征服实分析中难以计算的积分。"
  }
};
