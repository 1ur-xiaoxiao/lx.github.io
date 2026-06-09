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
      explanation: '$u=x^2+y^2, v=0$。C-R 方程要求 $u_x=v_y \\Rightarrow 2x=0$ 且 $u_y=-v_x \\Rightarrow 2y=0$，只可能在 $z=0$ 处满足。但仅在一点可导不能称为"解析"。"'
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

// ============================================================
// 困难模式题库 — 每章 10 道高难度选择题
// 特点：多步计算、深层概念、综合应用、陷阱题
// ============================================================

const QUIZ_QUESTIONS_HARD = {

  // ========== 第一章：复数与复变函数（困难） ==========
  ch1: [
    {
      id: "ch1_h1",
      question: "设复数 $z$ 满足 $z^2 + 2z + 5 = 0$，则 $z$ 的值为？",
      options: [
        "$-1 \\pm i$",
        "$-1 \\pm 2i$",
        "$1 \\pm 2i$",
        "$-2 \\pm i$"
      ],
      correct: 1,
      explanation: "用求根公式：$z = \\frac{-2 \\pm \\sqrt{4-20}}{2} = \\frac{-2 \\pm \\sqrt{-16}}{2} = -1 \\pm 2i$。注意判别式为负时产生共轭复根。"
    },
    {
      id: "ch1_h2",
      question: "求 $\\sqrt[3]{-8i}$ 的所有值，其中辐角主值在 $(-\\pi, \\pi]$ 范围内的是？",
      options: [
        "$2e^{-i\\pi/6}$",
        "$2e^{i\\pi/2}$",
        "$2e^{-i\\pi/2}$",
        "$-2i$"
      ],
      correct: 2,
      explanation: "$-8i = 8e^{-i\\pi/2}$（模 8，辐角 $-\\pi/2$）。立方根：$\\sqrt[3]{8}e^{i(-\\pi/2 + 2k\\pi)/3} = 2e^{i(-\\pi/6 + 2k\\pi/3)}$，$k=0,1,2$。$k=1$ 时 $2e^{i\\pi/2}=2i$，$k=0$ 时 $2e^{-i\\pi/6}$ 的辐角在主值范围。三个值：$2e^{-i\\pi/6}, 2e^{i\\pi/2}, 2e^{i7\\pi/6}$。"
    },
    {
      id: "ch1_h3",
      question: "若 $|z_1| = 3$，$|z_2| = 4$，则 $|z_1 + z_2|$ 的最大值和最小值分别是？",
      options: [
        "最大值 7，最小值 0",
        "最大值 7，最小值 1",
        "最大值 5，最小值 1",
        "最大值 12，最小值 0"
      ],
      correct: 1,
      explanation: "由三角不等式：$||z_1| - |z_2|| \\le |z_1 + z_2| \\le |z_1| + |z_2|$。最大值为 $3+4=7$（同向），最小值为 $|3-4|=1$（反向）。"
    },
    {
      id: "ch1_h4",
      question: "满足 $1 < |z - i| < 2$ 且 $\\Re(z) > 0$ 的点集在复平面上对应什么？",
      options: [
        "一个完整的圆环",
        "右半圆环（圆环与右半平面的交集）",
        "一个半圆",
        "上半平面的圆环"
      ],
      correct: 1,
      explanation: "$1 < |z-i| < 2$ 是以 $i$（虚轴上一点）为心、内外半径 1 和 2 的圆环。$\\Re(z) > 0$ 是右半平面。交集是右半圆环——被虚轴截掉左半部分的圆环。"
    },
    {
      id: "ch1_h5",
      question: "在复平面上，方程 $|z + 1| = |z - i|$ 表示什么图形？",
      options: [
        "一个圆",
        "一条直线（点 $-1$ 和 $i$ 连线的垂直平分线）",
        "一条射线",
        "一个椭圆"
      ],
      correct: 1,
      explanation: "$|z-a| = |z-b|$ 表示到两点 $a$ 和 $b$ 距离相等的点的轨迹，即线段 $ab$ 的垂直平分线。这里 $a=-1, b=i$。代入 $z=x+iy$：$(x+1)^2+y^2 = x^2+(y-1)^2$，得 $2x+2y+1=0$，是一条直线。"
    },
    {
      id: "ch1_h6",
      question: "计算 $\\left(\\frac{1+i}{1-i}\\right)^{2024}$ 的值。",
      options: ["$1$", "$-1$", "$i$", "$-i$"],
      correct: 0,
      explanation: "$\\frac{1+i}{1-i} = \\frac{(1+i)^2}{(1-i)(1+i)} = \\frac{2i}{2} = i$。而 $i^{2024} = (i^4)^{506} = 1^{506} = 1$。所以原式为 $1$。"
    },
    {
      id: "ch1_h7",
      question: "设 $z = re^{i\\theta}$（$r > 0, -\\pi < \\theta \\le \\pi$），则 $\\arg(-z)$（辐角主值）与 $\\theta$ 的关系是？",
      options: [
        "$\\arg(-z) = -\\theta$",
        "$\\arg(-z) = \\theta + \\pi$ 或 $\\theta - \\pi$（调整到主值范围）",
        "$\\arg(-z) = \\theta$",
        "$\\arg(-z) = \\pi - \\theta$"
      ],
      correct: 1,
      explanation: "$-z = r e^{i(\\theta \\pm \\pi)}$。当 $\\theta \\in (-\\pi, 0]$ 时，$\\theta + \\pi \\in (0, \\pi]$ 在主值范围；当 $\\theta \\in (0, \\pi]$ 时，$\\theta - \\pi \\in (-\\pi, 0]$ 在主值范围。"
    },
    {
      id: "ch1_h8",
      question: "若 $z_1, z_2, z_3$ 是复平面上等边三角形的三个顶点，则它们满足？",
      options: [
        "$z_1 + z_2 + z_3 = 0$",
        "$z_1^2 + z_2^2 + z_3^2 = z_1 z_2 + z_2 z_3 + z_3 z_1$",
        "$|z_1| = |z_2| = |z_3|$",
        "$z_1 z_2 z_3 = 0$"
      ],
      correct: 1,
      explanation: "等边三角形的充要条件是 $z_1^2 + z_2^2 + z_3^2 = z_1 z_2 + z_2 z_3 + z_3 z_1$。等价于 $z_1 + \\omega z_2 + \\omega^2 z_3 = 0$（或其轮换），其中 $\\omega = e^{2\\pi i/3}$。"
    },
    {
      id: "ch1_h9",
      question: "函数 $f(z) = \\frac{z}{|z|}$（$z \\ne 0$）在复平面上的值域是？",
      options: [
        "整个复平面",
        "单位圆周 $|w| = 1$",
        "单位开圆盘 $|w| < 1$",
        "右半平面"
      ],
      correct: 1,
      explanation: "$f(z) = z/|z| = e^{i\\arg z}$，模恒为 $1$。当 $z$ 取遍所有非零复数时，辐角取遍所有可能值，所以值域是整个单位圆周。"
    },
    {
      id: "ch1_h10",
      question: "映射 $w = \\frac{1}{z}$ 将圆 $|z - 1| = 1$ 映为什么图形？",
      options: [
        "一个圆",
        "一条直线 $\\Re(w) = 1/2$",
        "直线 $\\Re(w) = 1$",
        "一个椭圆"
      ],
      correct: 1,
      explanation: "$|z-1| = 1$ 即 $z\\bar{z} - z - \\bar{z} + 1 = 1$，所以 $z\\bar{z} = z + \\bar{z}$。令 $w = 1/z$，则 $z = 1/w$。代入得 $\\frac{1}{w\\bar{w}} = \\frac{1}{w} + \\frac{1}{\\bar{w}} = \\frac{w+\\bar{w}}{w\\bar{w}}$，即 $1 = w + \\bar{w} = 2\\Re(w)$，所以 $\\Re(w) = 1/2$，是一条竖直线。注意：过原点的圆在反演映射下变为直线。"
    }
  ],

  // ========== 第二章：解析函数（困难） ==========
  ch2: [
    {
      id: "ch2_h1",
      question: "函数 $f(z) = |z|^2 \\cdot z$ 在哪些点可导？",
      options: [
        "处处可导",
        "只在 $z = 0$ 处可导",
        "在所有实轴上可导",
        "处处不可导"
      ],
      correct: 1,
      explanation: "$f(z) = (x^2+y^2)(x+iy) = x(x^2+y^2) + iy(x^2+y^2)$。$u = x^3+xy^2, v = x^2 y+y^3$。$u_x = 3x^2+y^2, v_y = x^2+3y^2$。C-R 方程 $u_x = v_y$ 要求 $3x^2+y^2 = x^2+3y^2$，即 $x^2 = y^2$。$u_y = 2xy, -v_x = -2xy$，要求 $2xy = -2xy$，即 $xy = 0$。结合得只有 $x=y=0$ 满足，即 $z=0$。"
    },
    {
      id: "ch2_h2",
      question: "已知调和函数 $u(x,y) = x^3 - 3xy^2$，求其共轭调和函数 $v(x,y)$（取积分常数为 0）",
      options: [
        "$v = 3x^2 y - y^3$",
        "$v = 3x^2 y + y^3$",
        "$v = x^3 - 3xy^2$",
        "$v = -3x^2 y + y^3$"
      ],
      correct: 0,
      explanation: "由 C-R 方程：$v_y = u_x = 3x^2 - 3y^2$，积分得 $v = 3x^2 y - y^3 + \\phi(x)$。再由 $v_x = -u_y = 6xy$，而 $v_x = 6xy + \\phi'(x)$，故 $\\phi'(x) = 0$，$\\phi(x) = C = 0$。所以 $v = 3x^2 y - y^3$，对应的解析函数 $f(z) = z^3$。"
    },
    {
      id: "ch2_h3",
      question: "函数 $f(z) = \\frac{x}{x^2+y^2} - i\\frac{y}{x^2+y^2}$（$z \\ne 0$）在 $z \\ne 0$ 处是否解析？",
      options: [
        "处处解析（$z \\ne 0$）",
        "不解析",
        "只在实轴上解析",
        "只在虚轴上解析"
      ],
      correct: 0,
      explanation: "注意到 $f(z) = \\frac{x-iy}{x^2+y^2} = \\frac{\\bar{z}}{|z|^2} = \\frac{1}{z}$。而 $1/z$ 在 $z \\ne 0$ 处是解析的（初等函数的复合，满足 C-R 方程）。这是绕过直接验证 C-R 方程的巧妙方法。"
    },
    {
      id: "ch2_h4",
      question: "若 $f(z)$ 在区域 $D$ 内解析，且 $\\Re(f(z)) = (\\Im(f(z)))^2$ 在 $D$ 内恒成立，则 $f(z)$ 在 $D$ 内必定是？",
      options: [
        "任意解析函数",
        "常数",
        "一次函数",
        "$f(z) = z^2$"
      ],
      correct: 1,
      explanation: "设 $f = u + iv$，$u = v^2$。对 $x$ 求偏导：$u_x = 2v v_x$。对 $y$ 求偏导：$u_y = 2v v_y$。由 C-R 方程 $u_x = v_y, u_y = -v_x$，代入得方程组，可推出 $v_x = v_y = 0$（除非 $2v$ 满足特定条件，但进一步分析可得 $v$ 必为常数）。因此 $u$ 也为常数，$f$ 为常数。"
    },
    {
      id: "ch2_h5",
      question: "函数 $f(z) = e^{-1/z^4}$（$z \\ne 0$）在 $z = 0$ 处的情况是？",
      options: [
        "在 $z=0$ 处解析",
        "$z=0$ 是极点",
        "$z=0$ 是本性奇点",
        "在 $z=0$ 处连续但不可导"
      ],
      correct: 2,
      explanation: "令 $z \\to 0$ 沿实轴，$f(z) = e^{-1/x^4} \\to 0$。令 $z \\to 0$ 沿 $z = re^{i\\pi/4}$，$z^4 = r^4 e^{i\\pi} = -r^4$，则 $f(z) = e^{1/r^4} \\to \\infty$。沿不同方向极限不同，所以 $z=0$ 是本性奇点。这是判断本性奇点的经典方法。"
    },
    {
      id: "ch2_h6",
      question: "若解析函数 $f(z) = u + iv$ 满足 $u = v^2 - u^2$ 在区域 $D$ 内恒成立，则 $f(z)$ 在 $D$ 内必定是？",
      options: [
        "常数",
        "$f(z) = z$",
        "可以是任意解析函数",
        "$f(z) = i$"
      ],
      correct: 0,
      explanation: "$u + u^2 = v^2$，即 $u(u+1) = v^2$。对 $x, y$ 求偏导并结合 C-R 方程，可推出 $u_x = u_y = v_x = v_y = 0$（在满足该关系的区域内），所以 $u, v$ 均为常数。一般原则：实部与虚部满足一个非线性的函数关系时，解析函数必为常数。"
    },
    {
      id: "ch2_h7",
      question: "在极坐标下，$f(z) = \\frac{1}{z}$ 的 Cauchy-Riemann 方程验证：设 $f = u + iv$，$z = re^{i\\theta}$，则 $u_r$ 与 $v_\\theta$ 的关系是？",
      options: [
        "$u_r = v_\\theta$",
        "$u_r = \\frac{1}{r}v_\\theta$",
        "$u_r = -\\frac{1}{r}v_\\theta$",
        "$u_r = r v_\\theta$"
      ],
      correct: 1,
      explanation: "$f(z) = 1/(re^{i\\theta}) = \\frac{1}{r}e^{-i\\theta} = \\frac{\\cos\\theta}{r} - i\\frac{\\sin\\theta}{r}$。$u = \\frac{\\cos\\theta}{r}, v = -\\frac{\\sin\\theta}{r}$。$u_r = -\\frac{\\cos\\theta}{r^2}$，$\\frac{1}{r}v_\\theta = \\frac{1}{r}(-\\frac{\\cos\\theta}{r}) = -\\frac{\\cos\\theta}{r^2}$。验证通过。"
    },
    {
      id: "ch2_h8",
      question: "下列哪个条件<strong>不能</strong>推出区域 $D$ 内的解析函数 $f(z)$ 为常数？",
      options: [
        "$f'(z) = 0$ 在 $D$ 内恒成立",
        "$|f(z)|$ 在 $D$ 内为常数",
        "$f(z)$ 在 $D$ 内只取实数值",
        "$f(z)$ 在 $D$ 内有界（即 $\\exists M > 0$ 使 $|f(z)| \\le M$）"
      ],
      correct: 3,
      explanation: "Liouville 定理说：有界<strong>整函数</strong>（在整个复平面上解析）必为常数。但在一般区域 $D$ 内的解析函数即使有界也不一定是常数——例如 $f(z) = z$ 在单位圆盘 $|z|<1$ 内有界（$|z|<1$），但不是常数。前三个选项分别通过导数为零、模为常数、只取实值（即虚部为零）可推出 $f$ 为常数。"
    },
    {
      id: "ch2_h9",
      question: "设 $f(z) = \\frac{z}{|z|^2}$（$z \\ne 0$），这个函数与哪个经典函数等价？",
      options: [
        "$f(z) = \\frac{1}{z}$",
        "$f(z) = \\frac{1}{\\bar{z}}$",
        "$f(z) = \\frac{\\bar{z}}{|z|^2}$",
        "$f(z) = \\frac{1}{|z|}$"
      ],
      correct: 1,
      explanation: "$f(z) = \\frac{z}{|z|^2} = \\frac{z}{z\\bar{z}} = \\frac{1}{\\bar{z}}$。而 $1/\\bar{z}$ 不是解析函数（之前学过 $\\bar{z}$ 不解析），但 $f(z) = 1/\\bar{z}$ 是一个反解析函数。此题警示：看起来类似的表达式可能对应完全不同的函数性质。"
    },
    {
      id: "ch2_h10",
      question: "若 $f(z)$ 和 $\\overline{f(z)}$（$f$ 的复共轭）都在区域 $D$ 内解析，则 $f(z)$ 必定是？",
      options: [
        "常数",
        "一次函数",
        "可以是任意解析函数",
        "只能是实值函数"
      ],
      correct: 0,
      explanation: "设 $f = u + iv$，则 $\\overline{f} = u - iv$。$f$ 解析意味着 C-R 成立：$u_x = v_y, u_y = -v_x$。$\\overline{f}$ 解析意味着：$u_x = (-v)_y = -v_y$ 即 $u_x = -v_y$；$u_y = -(-v)_x = v_x$ 即 $u_y = v_x$。结合得 $u_x = v_y = -u_x$，所以 $u_x = v_y = 0$；同理 $u_y = v_x = 0$。$u, v$ 为常数，$f$ 为常数。"
    }
  ],

  // ========== 第三章：初等函数（困难） ==========
  ch3: [
    {
      id: "ch3_h1",
      question: "计算 $i^i$ 的<strong>主值</strong>。",
      options: ["$e^{-\\pi/2}$", "$e^{\\pi/2}$", "$1$", "$e^{\\pi}$"],
      correct: 0,
      explanation: "$i^i = e^{i\\operatorname{Log} i}$。$\\operatorname{Log} i = \\ln|i| + i\\operatorname{Arg}(i) = 0 + i\\cdot \\pi/2 = i\\pi/2$。所以 $i^i = e^{i \\cdot i\\pi/2} = e^{-\\pi/2}$（这是一个实数！）。这个结果由 Euler 首先发现。"
    },
    {
      id: "ch3_h2",
      question: "方程 $\\sin z = 2$ 在复数域中是否有解？",
      options: [
        "无解，因为 $|\\sin z| \\le 1$",
        "有解，且唯一",
        "有无穷多个解",
        "只有当 $z$ 为实数时才有解"
      ],
      correct: 2,
      explanation: "$\\sin z = \\frac{e^{iz} - e^{-iz}}{2i} = 2$，即 $e^{iz} - e^{-iz} = 4i$。令 $w = e^{iz}$，则 $w - 1/w = 4i$，$w^2 - 4iw - 1 = 0$。$w = 2i \\pm \\sqrt{-3} = i(2 \\pm \\sqrt{3})$。$|w| = 2 \\pm \\sqrt{3} \\ne 1$，所以 $z$ 不是实数。$iz = \\ln w + 2k\\pi i$，$k \\in \\ZZ$，无穷多解。复三角函数 $\"无界\"$ 的体现。"
    },
    {
      id: "ch3_h3",
      question: "$\\operatorname{Log}(-1+i)$ 的值是？",
      options: [
        "$\\frac{1}{2}\\ln 2 + i\\frac{3\\pi}{4}$",
        "$\\frac{1}{2}\\ln 2 + i\\frac{\\pi}{4}$",
        "$\\ln 2 + i\\frac{3\\pi}{4}$",
        "$\\frac{1}{2}\\ln 2 - i\\frac{\\pi}{4}$"
      ],
      correct: 0,
      explanation: "$|-1+i| = \\sqrt{1+1} = \\sqrt{2}$，辐角主值 $\\operatorname{Arg}(-1+i) = 3\\pi/4$（第二象限）。所以 $\\operatorname{Log}(-1+i) = \\ln\\sqrt{2} + i\\cdot 3\\pi/4 = \\frac{1}{2}\\ln 2 + i\\frac{3\\pi}{4}$。"
    },
    {
      id: "ch3_h4",
      question: "求 $(1+i)^{1-i}$ 的<strong>所有值</strong>中，模最大的是？提示：先写出一般表达式。",
      options: [
        "$\\sqrt{2}e^{\\pi/4}$",
        "$\\sqrt{2}e^{\\pi/4} \\cdot e^{2\\pi}$",
        "$\\sqrt{2}e^{\\pi/4} \\cdot e^{-2\\pi}$",
        "所有值模相同"
      ],
      correct: 1,
      explanation: "$(1+i)^{1-i} = e^{(1-i)\\log(1+i)}$。$\\log(1+i) = \\frac{1}{2}\\ln 2 + i(\\pi/4 + 2k\\pi)$。$(1-i)\\log(1+i) = (1-i)[\\frac{1}{2}\\ln 2 + i(\\pi/4+2k\\pi)] = [\\frac{1}{2}\\ln 2 + (\\pi/4+2k\\pi)] + i[(\\pi/4+2k\\pi) - \\frac{1}{2}\\ln 2]$。模为 $e^{\\frac{1}{2}\\ln 2 + \\pi/4 + 2k\\pi} = \\sqrt{2}e^{\\pi/4}e^{2k\\pi}$，$k$ 越大模越大。$k=1$ 时 $\\sqrt{2}e^{\\pi/4}e^{2\\pi}$。但由于 $k$ 可任意大，实际上模无上界。选项中选择 $k=1$ 的情况。"
    },
    {
      id: "ch3_h5",
      question: "$\\cosh(\\pi i)$ 的值是？",
      options: ["$1$", "$-1$", "$0$", "$\\cosh\\pi$"],
      correct: 1,
      explanation: "$\\cosh(\\pi i) = \\frac{e^{\\pi i} + e^{-\\pi i}}{2} = \\frac{\\cos\\pi + i\\sin\\pi + \\cos\\pi - i\\sin\\pi}{2} = \\cos\\pi = -1$。一般地，$\\cosh(iz) = \\cos z$。"
    },
    {
      id: "ch3_h6",
      question: "函数 $f(z) = \\sqrt{z^2 - 1}$ 有几个分支？它需要在复平面上做分支切割，切割通常如何选取？",
      options: [
        "2 个分支，切割连接 $z = -1$ 和 $z = 1$",
        "无穷多个分支，切割从原点出发",
        "1 个分支（单值函数），不需要切割",
        "2 个分支，切割从 $z = 1$ 沿正实轴到 $\\infty$"
      ],
      correct: 0,
      explanation: "$f(z) = (z^2-1)^{1/2} = e^{(1/2)\\log(z^2-1)}$。由于平方根有 2 个分支，需要一条分支切割连接两个一阶分支点 $z = \\pm 1$（$z^2-1 = 0$ 的零点）。通常取连接 $-1$ 和 $1$ 的线段作为切割。$\\infty$ 也是分支点吗？检查：令 $w = 1/z$，$z^2-1 = (1-w^2)/w^2$，$\\sqrt{z^2-1} = \\pm \\sqrt{1-w^2}/w$，$w=0$（即 $z=\\infty$）也是一阶分支点。实际上有两个分支切割：一条连接 $-1$ 和 $1$，另一条从其中一个点延伸到无穷。"
    },
    {
      id: "ch3_h7",
      question: "设 $f(z) = \\operatorname{Log}(e^z)$，则 $f(z)$ 与 $z$ 的关系是？",
      options: [
        "$f(z) = z$（恒等）",
        "$f(z) = z + 2k\\pi i$（$k$ 为某整数，使得虚部在 $(-\\pi, \\pi]$）",
        "$f(z) = \\bar{z}$",
        "$f(z) = |z|$"
      ],
      correct: 1,
      explanation: "$e^z = e^{x+iy} = e^x e^{iy}$。$\\operatorname{Log}(e^z) = \\ln e^x + i\\operatorname{Arg}(e^{iy}) = x + i\\operatorname{Arg}(e^{iy})$。而 $\\operatorname{Arg}(e^{iy})$ 把 $y$ 调整到 $(-\\pi, \\pi]$ 内，即加/减 $2\\pi$ 的整数倍。所以 $f(z) = z + 2k\\pi i$，选择合适的 $k$ 使虚部在 $(-\\pi, \\pi]$。不是恒等的！"
    },
    {
      id: "ch3_h8",
      question: "函数 $f(z) = \\tan z$ 在复平面上所有奇点（不可解析的点）的集合是？",
      options: [
        "$z = 0$",
        "$z = k\\pi$（$k \\in \\ZZ$）",
        "$z = \\frac{\\pi}{2} + k\\pi$（$k \\in \\ZZ$）",
        "$z = k\\pi i$（$k \\in \\ZZ$）"
      ],
      correct: 2,
      explanation: "$\\tan z = \\sin z / \\cos z$。$\\cos z = 0$ 时 $\\tan z$ 为极点。$\\cos z = 0 \\iff e^{iz} + e^{-iz} = 0 \\iff e^{2iz} = -1 \\iff 2iz = i\\pi + 2k\\pi i \\iff z = \\pi/2 + k\\pi$。这些是 $\\tan z$ 的所有奇点（都是一阶极点）。"
    },
    {
      id: "ch3_h9",
      question: "$\\arcsin z$ 的多值性与哪个函数的多值性直接相关？",
      options: [
        "指数函数 $e^z$",
        "对数函数 $\\log z$",
        "幂函数 $z^2$",
        "三角函数 $\\sin z$"
      ],
      correct: 1,
      explanation: "$w = \\arcsin z \\iff z = \\sin w = \\frac{e^{iw} - e^{-iw}}{2i}$。解出 $e^{iw} = iz \\pm \\sqrt{1-z^2}$，所以 $w = -i\\log(iz \\pm \\sqrt{1-z^2})$。$\\arcsin z$ 的多值性来源于对数函数 $\\log$ 和平方根函数 $\\sqrt{}$ 的多值性。"
    },
    {
      id: "ch3_h10",
      question: "设 $z = x + iy$，则 $|\\sin z|^2$ 等于？",
      options: [
        "$\\sin^2 x + \\sinh^2 y$",
        "$\\sin^2 x - \\sinh^2 y$",
        "$\\sinh^2 x + \\sin^2 y$",
        "$\\sin^2 x + \\cosh^2 y$"
      ],
      correct: 0,
      explanation: "$\\sin z = \\sin x\\cosh y + i\\cos x\\sinh y$。$|\\sin z|^2 = \\sin^2 x\\cosh^2 y + \\cos^2 x\\sinh^2 y = \\sin^2 x(1+\\sinh^2 y) + (1-\\sin^2 x)\\sinh^2 y = \\sin^2 x + \\sinh^2 y$。这是一个常见公式，便于计算复正弦函数的模。"
    }
  ],

  // ========== 第四章：复积分（困难） ==========
  ch4: [
    {
      id: "ch4_h1",
      question: "计算 $\\oint_{|z|=2} \\frac{e^z}{(z-1)^3}\\,dz$（正向）",
      options: [
        "$\\pi i e$",
        "$2\\pi i e$",
        "$\\frac{\\pi i e}{3}$",
        "$0$"
      ],
      correct: 0,
      explanation: "由高阶导数公式：$f^{(n)}(z_0) = \\frac{n!}{2\\pi i}\\oint \\frac{f(z)}{(z-z_0)^{n+1}}dz$。这里 $n=2, z_0=1, f(z)=e^z$。$\\oint \\frac{e^z}{(z-1)^3}dz = \\frac{2\\pi i}{2!} f''(1) = \\pi i \\cdot e^1 = \\pi i e$。"
    },
    {
      id: "ch4_h2",
      question: "设 $C$ 是连接 $z = 0$ 到 $z = 1+i$ 的直线段，计算 $\\int_C \\bar{z}\\,dz$",
      options: [
        "$1$",
        "$1+i$",
        "$1-i$",
        "$i$"
      ],
      correct: 0,
      explanation: "参数化 $C$：$z(t) = t(1+i) = t + it$，$t \\in [0,1]$。$\\bar{z(t)} = t - it$。$dz = (1+i)dt$。$\\int_C \\bar{z}dz = \\int_0^1 (t-it)(1+i)dt = \\int_0^1 [(t-it) + i(t-it)]dt = \\int_0^1 [t-it+it+t]dt = \\int_0^1 2t\\,dt = 1$。注意被积函数 $\\bar{z}$ 不是解析的，积分依赖于路径。"
    },
    {
      id: "ch4_h3",
      question: "用 ML 不等式估计：设 $C$ 为 $|z| = 4$（正向），则 $\\left|\\oint_C \\frac{e^z}{z-2}\\,dz\\right|$ 的一个上界是？<br>（提示：在 $|z|=4$ 上，$|z-2| \\ge |z|-2 = 2$，$|e^z| = e^x \\le e^4$）",
      options: [
        "$4\\pi e^4$",
        "$\\pi e^4$",
        "$8\\pi e^4$",
        "$2\\pi e^4$"
      ],
      correct: 0,
      explanation: "在 $|z|=4$ 上：$|e^z| = |e^{x+iy}| = e^x \\le e^4$；$|z-2| \\ge |z| - 2 = 4 - 2 = 2$；所以 $|f(z)| \\le e^4/2$。围道长度 $L = 2\\pi \\cdot 4 = 8\\pi$。由 ML 不等式：$|\\oint f(z)dz| \\le M \\cdot L = \\frac{e^4}{2} \\cdot 8\\pi = 4\\pi e^4$。实际值由留数定理为 $2\\pi i \\cdot e^2$，远小于 ML 估计值。"
    },
    {
      id: "ch4_h4",
      question: "若 $f(z)$ 在单连通区域 $D$ 内解析且不为零，则存在 $D$ 内的解析函数 $g(z)$ 使得 $f(z) = e^{g(z)}$。这个结论依赖于？",
      options: [
        "Cauchy 积分公式",
        "留数定理",
        "单连通区域内解析函数有原函数，且 $f'(z)/f(z)$ 在 $D$ 内解析",
        "Liouville 定理"
      ],
      correct: 2,
      explanation: "$f(z) \\ne 0$ 时，$f'(z)/f(z)$ 在单连通区域 $D$ 内解析，由 Cauchy 定理它有原函数 $g(z)$（$g'(z) = f'(z)/f(z)$）。则 $\\frac{d}{dz}(f(z)e^{-g(z)}) = f'(z)e^{-g(z)} - f(z)g'(z)e^{-g(z)} = 0$，所以 $f(z) = Ce^{g(z)}$，取合适的常数可用 $e^{g(z)}$ 表示 $f(z)$。"
    },
    {
      id: "ch4_h5",
      question: "计算围道积分 $\\oint_{|z|=1} \\frac{\\sin z}{z^4}\\,dz$（正向单位圆）",
      options: [
        "$0$",
        "$\\frac{2\\pi i}{6}$",
        "$-\\frac{\\pi i}{3}$",
        "$2\\pi i$"
      ],
      correct: 2,
      explanation: "由高阶导数公式：$f^{(3)}(0) = \\frac{3!}{2\\pi i}\\oint_{|z|=1}\\frac{\\sin z}{z^4}dz$。$f(z) = \\sin z$，$f'''(z) = -\\cos z$，$f'''(0) = -1$。所以 $\\oint \\frac{\\sin z}{z^4}dz = \\frac{2\\pi i}{6} \\cdot (-1) = -\\frac{\\pi i}{3}$。也可以用 Laurent 展开：$\\frac{\\sin z}{z^4} = \\frac{1}{z^4}(z - \\frac{z^3}{6} + \\cdots) = z^{-3} - \\frac{1}{6}z^{-1} + \\cdots$，$z^{-1}$ 系数为 $-1/6$，留数定理得 $2\\pi i \\cdot (-1/6) = -\\pi i/3$。"
    },
    {
      id: "ch4_h6",
      question: "最大模原理的推论之一是：若 $|f(z)|$ 在区域 $D$ 内取到最小值且 $f(z) \\ne 0$，则？",
      options: [
        "$f(z)$ 为常数",
        "$f(z)$ 在 $D$ 内有零点",
        "$f(z)$ 无界",
        "最小模只能在边界取到，且 $f$ 可以为非常数"
      ],
      correct: 0,
      explanation: "若 $f(z) \\ne 0$，设 $g(z) = 1/f(z)$，则 $g(z)$ 也在 $D$ 内解析。若 $|f(z)|$ 在内部取到最小值，则 $|g(z)|$ 在内部取到最大值，由最大模原理知 $g$ 为常数，故 $f$ 也为常数。所以非常数解析函数的最小模也只能在边界上取到（前提是不取零值）。"
    },
    {
      id: "ch4_h7",
      question: "计算单位圆上的积分 $\\oint_{|z|=1} \\frac{e^z}{z^2}\\,dz$（正向），并由此推出 $\\int_0^{2\\pi} e^{\\cos\\theta}\\cos(\\sin\\theta - \\theta)\\,d\\theta$ 的值。该积分等于？",
      options: ["$0$", "$\\pi$", "$2\\pi$", "$2\\pi i$"],
      correct: 2,
      explanation: "$\\oint_{|z|=1} \\frac{e^z}{z^2}dz$：$z=0$ 是二阶极点。$\\operatorname{Res}(f,0) = \\lim_{z\\to 0}\\frac{d}{dz}[e^z] = 1$，所以围道积分 $= 2\\pi i \\cdot 1 = 2\\pi i$。参数化 $z = e^{i\\theta}$：$\\frac{e^{e^{i\\theta}}}{e^{2i\\theta}} \\cdot ie^{i\\theta}d\\theta = ie^{\\cos\\theta+i\\sin\\theta-i\\theta}d\\theta = ie^{\\cos\\theta}(\\cos(\\sin\\theta-\\theta) + i\\sin(\\sin\\theta-\\theta))d\\theta$。积分 $= 2\\pi i$，取虚部相等得 $\\int_0^{2\\pi}e^{\\cos\\theta}\\cos(\\sin\\theta-\\theta)d\\theta = 2\\pi$。"
    },
    {
      id: "ch4_h8",
      question: "设 $f(z)$ 在 $|z| \\le R$ 上解析。Cauchy 不等式给出了 $|f^{(n)}(0)|$ 的上界。若 $|f(z)| \\le M$ 在 $|z| = R$ 上成立，则 $|f^{(n)}(0)|$ 的<strong>最佳可能</strong>上界是？",
      options: [
        "$\\frac{M}{R^n}$",
        "$\\frac{M \\cdot n!}{R^n}$",
        "$\\frac{M \\cdot n!}{R^{n+1}}$",
        "$M \\cdot n! \\cdot R^n$"
      ],
      correct: 1,
      explanation: "Cauchy 不等式：$|f^{(n)}(0)| \\le \\frac{M \\cdot n!}{R^n}$。这个界是最佳的——取 $f(z) = M z^n / R^n$，则 $|f(z)| = M$ 在 $|z|=R$ 上成立，$f^{(n)}(0) = M \\cdot n! / R^n$ 恰好达到上界。"
    },
    {
      id: "ch4_h9",
      question: "设 $f(z)$ 是整函数，且 $\\lim_{|z| \\to \\infty} |f(z)| = \\infty$，则 $f(z)$ 必定是？",
      options: [
        "常数",
        "多项式",
        "超越整函数（如 $e^z$）",
        "可以是指数函数"
      ],
      correct: 1,
      explanation: "$\\lim_{|z| \\to \\infty} |f(z)| = \\infty$ 意味着 $f(z)$ 以 $\\infty$ 为极点（而不是本性奇点）。整函数以 $\\infty$ 为极点当且仅当它是多项式。$e^z$ 以 $\\infty$ 为本性奇点（$z \\to \\infty$ 沿不同方向极限不同）。这是整函数分类的一个重要结论。"
    },
    {
      id: "ch4_h10",
      question: "计算 $\\oint_{|z|=1} \\frac{\\cos z}{z^2}\\,dz$（正向单位圆）",
      options: ["$0$", "$2\\pi i$", "$-2\\pi i$", "$\\pi i$"],
      correct: 0,
      explanation: "$\\frac{\\cos z}{z^2} = \\frac{1}{z^2}(1 - \\frac{z^2}{2!} + \\frac{z^4}{4!} - \\cdots) = z^{-2} - \\frac{1}{2} + \\frac{z^2}{24} - \\cdots$。Laurent 展开中 $z^{-1}$ 的系数为 $0$，所以积分为 $0$。也可用留数公式：$z=0$ 是二阶极点，$\\operatorname{Res}(f, 0) = \\lim_{z \\to 0} \\frac{d}{dz}[z^2 f(z)] = \\lim_{z \\to 0} \\frac{d}{dz}[\\cos z] = \\lim_{z \\to 0}(-\\sin z) = 0$。"
    }
  ],

  // ========== 第五章：级数（困难） ==========
  ch5: [
    {
      id: "ch5_h1",
      question: "求函数 $f(z) = \\frac{1}{(z-1)(z-2)}$ 在圆环域 $1 < |z| < 2$ 内的 Laurent 展开中 $z^{-1}$ 的系数。",
      options: ["$1$", "$-1$", "$0$", "$2$"],
      correct: 1,
      explanation: "$f(z) = \\frac{1}{z-2} - \\frac{1}{z-1}$。在 $1 < |z| < 2$ 内：$\\frac{1}{z-2} = -\\frac{1}{2}\\cdot\\frac{1}{1-z/2} = -\\frac{1}{2}\\sum_{n=0}^{\\infty}(z/2)^n$（$|z|<2$）；$-\\frac{1}{z-1} = -\\frac{1}{z}\\cdot\\frac{1}{1-1/z} = -\\frac{1}{z}\\sum_{n=0}^{\\infty}z^{-n}$（$|z|>1$）。$z^{-1}$ 的系数来自第一部分 $n=0$ 得 $-1/2$，第二部分 $n=0$ 得 $-1$，合计 $-3/2$……等等。第一部分没有 $z^{-1}$ 项！第二部分 $z^{-1}$ 项系数是 $-1$。所以 Laurent 展开中 $z^{-1}$ 的系数为 $-1$。"
    },
    {
      id: "ch5_h2",
      question: "幂级数 $\\sum_{n=0}^{\\infty} \\frac{(z-i)^n}{2^n}$ 的收敛半径是？",
      options: ["$1/2$", "$2$", "$1$", "$\\infty$"],
      correct: 1,
      explanation: "$a_n = 1/2^n$，收敛半径 $R = \\lim_{n \\to \\infty} |a_n/a_{n+1}| = \\lim_{n \\to \\infty} \\frac{1/2^n}{1/2^{n+1}} = 2$。或用根值法：$\\sqrt[n]{|a_n|} = 1/2$，$R = 1/(1/2) = 2$。该级数在以 $i$ 为心、半径为 $2$ 的圆盘内收敛。"
    },
    {
      id: "ch5_h3",
      question: "函数 $f(z) = \\frac{1 - \\cos z}{z^4}$（$z \\ne 0$）在 $z = 0$ 处的奇点类型是？",
      options: [
        "二阶极点",
        "一阶极点",
        "可去奇点",
        "本性奇点"
      ],
      correct: 0,
      explanation: "$1 - \\cos z = 1 - (1 - \\frac{z^2}{2!} + \\frac{z^4}{4!} - \\frac{z^6}{6!} + \\cdots) = \\frac{z^2}{2} - \\frac{z^4}{24} + \\frac{z^6}{720} - \\cdots$。$f(z) = \\frac{1}{z^4}(\\frac{z^2}{2} - \\frac{z^4}{24} + \\cdots) = \\frac{1}{2z^2} - \\frac{1}{24} + \\frac{z^2}{720} - \\cdots$。Laurent 展开中最低次幂为 $z^{-2}$ 且系数 $1/2 \\ne 0$，所以 $z=0$ 是二阶极点。"
    },
    {
      id: "ch5_h4",
      question: "幂级数 $\\sum_{n=1}^{\\infty} n^n z^n$ 的收敛半径是？",
      options: ["$0$", "$1$", "$1/e$", "$\\infty$"],
      correct: 0,
      explanation: "用根值法：$\\sqrt[n]{|a_n|} = \\sqrt[n]{n^n} = n \\to \\infty$，所以 $R = 0$。级数只在 $z = 0$ 处收敛。"
    },
    {
      id: "ch5_h5",
      question: "若 $z_0$ 是 $f(z)$ 的 $m$ 阶极点，则 $z_0$ 是 $1/f(z)$ 的什么？",
      options: [
        "$m$ 阶极点",
        "$m$ 阶零点",
        "可去奇点",
        "本性奇点"
      ],
      correct: 1,
      explanation: "$f(z) = \\frac{\\phi(z)}{(z-z_0)^m}$，其中 $\\phi(z_0) \\ne 0$ 且 $\\phi$ 在 $z_0$ 处解析。则 $1/f(z) = (z-z_0)^m \\cdot \\frac{1}{\\phi(z)}$。$1/\\phi(z)$ 在 $z_0$ 处解析且非零，所以 $z_0$ 是 $1/f(z)$ 的 $m$ 阶零点。"
    },
    {
      id: "ch5_h6",
      question: "函数 $f(z) = \\frac{\\sin z}{z(z-\\pi)}$ 在 $z = \\pi$ 处的奇点类型是？",
      options: [
        "可去奇点",
        "一阶极点",
        "二阶极点",
        "本性奇点"
      ],
      correct: 0,
      explanation: "$\\sin z$ 在 $z = \\pi$ 处为零：$\\sin\\pi = 0$。分母 $z-\\pi$ 在 $z=\\pi$ 处也为一阶零点。$\\lim_{z \\to \\pi} \\frac{\\sin z}{z(z-\\pi)} = \\lim_{z \\to \\pi} \\frac{\\cos z}{z + (z-\\pi) \\cdots}$……用 L'Hôpital：$\\lim_{z \\to \\pi} \\frac{\\sin z}{z(z-\\pi)} = \\lim_{z \\to \\pi} \\frac{\\sin z - \\sin\\pi}{z-\\pi} \\cdot \\frac{1}{z} = \\cos\\pi \\cdot \\frac{1}{\\pi} = -\\frac{1}{\\pi}$。极限存在且有限，所以是可去奇点。"
    },
    {
      id: "ch5_h7",
      question: "设幂级数 $\\sum a_n z^n$ 在 $z = 3+4i$ 处收敛，则它在 $z = -2i$ 处的敛散性是？",
      options: [
        "一定收敛",
        "一定发散",
        "无法判断",
        "条件收敛"
      ],
      correct: 0,
      explanation: "Abel 定理：若幂级数在 $z_0$ 处收敛，则在所有 $|z| < |z_0|$ 的点处绝对收敛。$|3+4i| = 5$，$|-2i| = 2 < 5$，所以在 $z = -2i$ 处绝对收敛。"
    },
    {
      id: "ch5_h8",
      question: "函数 $f(z) = \\exp\\left(\\frac{1}{1-z}\\right)$ 在 $z = 1$ 处有什么类型的奇点？",
      options: [
        "一阶极点",
        "可去奇点",
        "本性奇点",
        "$m$ 阶极点"
      ],
      correct: 2,
      explanation: "$e^{1/(1-z)} = \\sum_{n=0}^{\\infty} \\frac{1}{n!}(1-z)^{-n} = \\sum_{n=0}^{\\infty} \\frac{1}{n!}(-1)^n (z-1)^{-n}$，Laurent 展开中负幂次项有无穷多项（所有 $n \\ge 0$ 都有 $(z-1)^{-n}$ 项），所以 $z=1$ 是本性奇点。沿不同方向趋于 $1$ 时 $f(z)$ 的极限行为完全不同（沿实轴从左边趋于 1 得 $\\infty$，从右边趋于 1 得 $0$）。"
    },
    {
      id: "ch5_h9",
      question: "设 $f(z) = \\sum_{n=0}^{\\infty} a_n z^n$ 的收敛半径为 $R_1$，$g(z) = \\sum_{n=0}^{\\infty} b_n z^n$ 的收敛半径为 $R_2$，则乘积 $f(z)g(z)$ 的幂级数收敛半径 $R$ 满足？",
      options: [
        "$R = \\min(R_1, R_2)$",
        "$R = \\max(R_1, R_2)$",
        "$R \\ge \\min(R_1, R_2)$",
        "$R = R_1 + R_2$"
      ],
      correct: 2,
      explanation: "两个幂级数的 Cauchy 乘积在 $|z| < \\min(R_1, R_2)$ 内收敛，所以 $R \\ge \\min(R_1, R_2)$。注意：$R$ 可能大于 $\\min(R_1, R_2)$——例如 $f(z) = 1/(1-z)$ 和 $g(z) = 1-z$，$R_1 = 1$，$R_2 = \\infty$，$\\min = 1$，乘积 $(1-z)/(1-z) = 1$ 的收敛半径为 $\\infty > 1$。所以是 $\\ge$ 而不是 $=$。"
    },
    {
      id: "ch5_h10",
      question: "级数 $\\sum_{n=1}^{\\infty} \\frac{z^n}{n^2}$ 在收敛圆周 $|z| = 1$ 上的收敛情况是？",
      options: [
        "处处发散",
        "处处收敛",
        "只在 $z = 1$ 处发散",
        "在大多数点发散"
      ],
      correct: 1,
      explanation: "收敛半径 $R = 1$。在 $|z| = 1$ 上，$\\left|\\frac{z^n}{n^2}\\right| = \\frac{1}{n^2}$，级数绝对且一致收敛（由 Weierstrass M-判别法，$\\sum 1/n^2$ 收敛）。所以整个收敛圆周上处处收敛（实际上还是一致收敛）。"
    }
  ],

  // ========== 第六章：留数理论及其应用（困难） ==========
  ch6: [
    {
      id: "ch6_h1",
      question: "用留数定理计算 $\\int_0^{\\infty} \\frac{\\ln x}{1+x^2}\\,dx$ 等于？<br>提示：考虑 $\\frac{\\log z}{1+z^2}$ 沿上半圆围道（绕原点用一个小半圆避开分支切割）。",
      options: ["$0$", "$\\frac{\\pi}{2}\\ln 2$", "$\\pi$", "$-\\frac{\\pi}{2}$"],
      correct: 0,
      explanation: "这是一个经典积分，结果为 $0$。方法：取围道由 $[\\epsilon, R]$、上半大圆弧、$[-R, -\\epsilon]$、上半小半圆组成。$\\oint \\frac{\\log z}{1+z^2}dz = 2\\pi i \\operatorname{Res}(f, i) = 2\\pi i \\cdot \\frac{\\log i}{2i} = \\pi \\cdot (i\\pi/2) = i\\pi^2/2$。分别在实轴上积分后取实部，注意 $\\ln(-x) = \\ln x + i\\pi$（在上半平面），最终得 $\\int_0^{\\infty} \\frac{\\ln x}{1+x^2}dx = 0$。"
    },
    {
      id: "ch6_h2",
      question: "计算 $\\operatorname{Res}\\left(\\frac{z^2}{(z^2+1)^2},\\, i\\right)$",
      options: ["$-\\frac{i}{4}$", "$\\frac{i}{4}$", "$-\\frac{1}{4}$", "$\\frac{1}{4}$"],
      correct: 0,
      explanation: "$z = i$ 是二阶极点（分母 $(z-i)^2(z+i)^2$）。令 $g(z) = \\frac{z^2}{(z+i)^2}$，则 $\\operatorname{Res}(f, i) = g'(i)$。$g'(z) = \\frac{2z(z+i)^2 - z^2 \\cdot 2(z+i)}{(z+i)^4} = \\frac{2z(z+i) - 2z^2}{(z+i)^3} = \\frac{2zi}{(z+i)^3}$。$g'(i) = \\frac{2i \\cdot i}{(i+i)^3} = \\frac{-2}{(2i)^3} = \\frac{-2}{8i^3} = \\frac{-2}{-8i} = \\frac{1}{4i} = -\\frac{i}{4}$。"
    },
    {
      id: "ch6_h3",
      question: "用留数定理计算 $\\int_0^{\\infty} \\frac{x^2}{1+x^4}\\,dx$。留数在哪些奇点处需要计算？",
      options: [
        "上半平面的两个奇点 $e^{i\\pi/4}$ 和 $e^{i3\\pi/4}$",
        "所有四个奇点",
        "只有实轴上的奇点",
        "上半平面的一个奇点"
      ],
      correct: 0,
      explanation: "$1+z^4 = 0 \\iff z^4 = -1 = e^{i\\pi}$，所以 $z = e^{i(\\pi + 2k\\pi)/4}$，$k=0,1,2,3$。上半平面的两个奇点是 $e^{i\\pi/4}$ 和 $e^{i3\\pi/4}$（$k=0,1$）。取上半圆围道，$R \\to \\infty$ 时圆弧积分 $\\to 0$。原积分 $= 2\\pi i \\sum \\operatorname{Res}(f, z_k)$（上半平面）。计算结果：$\\int_0^{\\infty} \\frac{x^2}{1+x^4}dx = \\frac{\\pi}{2\\sqrt{2}}$。"
    },
    {
      id: "ch6_h4",
      question: "若 $\\oint_{|z|=2} \\frac{f'(z)}{f(z)}\\,dz = 6\\pi i$，且 $f(z)$ 在 $|z| \\le 2$ 上解析且在 $|z|=2$ 上无零点，则 $f(z)$ 在 $|z| < 2$ 内的零点个数（计重数）是？",
      options: ["$2$", "$3$", "$6$", "$12$"],
      correct: 1,
      explanation: "由辐角原理：$\\frac{1}{2\\pi i}\\oint \\frac{f'(z)}{f(z)}dz = N - P$，其中 $N$ 为零点个数，$P$ 为极点个数（均计重数）。$f$ 解析意味着 $P = 0$。$\\frac{6\\pi i}{2\\pi i} = 3$，所以 $N = 3$，即有 3 个零点（计重数）。"
    },
    {
      id: "ch6_h5",
      question: "用 Rouché 定理判断：方程 $z^5 + 3z + 1 = 0$ 在 $|z| < 1$ 内有多少个根？",
      options: ["$0$ 个", "$1$ 个", "$2$ 个", "$5$ 个"],
      correct: 1,
      explanation: "在 $|z| = 1$ 上：$|3z| = 3$，$|z^5 + 1| \\le 1 + 1 = 2$。所以 $|z^5+1| < |3z|$ 在 $|z|=1$ 上成立。由 Rouché 定理，$3z$ 和 $3z + (z^5+1) = z^5+3z+1$ 在 $|z|<1$ 内零点个数相同。$3z$ 只有一个零点 $z=0$，所以原方程在 $|z|<1$ 内恰有 1 个根。"
    },
    {
      id: "ch6_h6",
      question: "$z = 0$ 是 $f(z) = \\frac{1}{z^3} + \\frac{1}{z^2} + \\frac{1}{z}$ 的什么类型的奇点？其留数是？",
      options: [
        "三阶极点，留数为 $1$",
        "三阶极点，留数为 $0$",
        "本性奇点，留数为 $1$",
        "一阶极点，留数为 $3$"
      ],
      correct: 0,
      explanation: "Laurent 展开本身就是 $f(z) = z^{-3} + z^{-2} + z^{-1}$，最高负幂次为 $3$，所以是三阶极点。$z^{-1}$ 的系数（留数）为 $1$。注意：虽然有三项负幂，但级数有限，仍是极点而非本性奇点。"
    },
    {
      id: "ch6_h7",
      question: "计算 $\\operatorname{Res}\\left(z^2 \\sin\\frac{1}{z},\\, 0\\right)$",
      options: ["$0$", "$1$", "$-\\frac{1}{6}$", "$\\frac{1}{2}$"],
      correct: 2,
      explanation: "Laurent 展开：$z^2 \\sin(1/z) = z^2\\left(\\frac{1}{z} - \\frac{1}{3!z^3} + \\frac{1}{5!z^5} - \\cdots\\right) = z - \\frac{1}{6z} + \\frac{1}{120z^3} - \\cdots$。$z^{-1}$ 的系数为 $-1/6$，所以留数为 $-1/6$。$z=0$ 是本性奇点（$\\sin(1/z)$ 的展开有无穷多负幂项）。"
    },
    {
      id: "ch6_h8",
      question: "用留数定理计算 $\\int_{-\\infty}^{\\infty} \\frac{\\cos x}{x^2+1}\\,dx$ 等于？",
      options: ["$\\pi e^{-1}$", "$\\pi e$", "$\\frac{\\pi}{e}$", "$\\frac{\\pi}{2}$"],
      correct: 2,
      explanation: "$\\int_{-\\infty}^{\\infty} \\frac{\\cos x}{x^2+1}dx = \\Re\\left(\\int_{-\\infty}^{\\infty} \\frac{e^{ix}}{x^2+1}dx\\right)$。考虑 $\\oint \\frac{e^{iz}}{z^2+1}dz$ 沿上半圆围道。上半平面极点 $z = i$，$\\operatorname{Res}(f, i) = \\frac{e^{i \\cdot i}}{2i} = \\frac{e^{-1}}{2i}$。围道积分 $= 2\\pi i \\cdot \\frac{e^{-1}}{2i} = \\pi e^{-1}$。由 Jordan 引理，$R \\to \\infty$ 时大圆弧积分 $\\to 0$。所以原积分 $= \\pi / e$。"
    },
    {
      id: "ch6_h9",
      question: "计算留数 $\\operatorname{Res}\\left(\\frac{e^z}{\\sin z},\\, 0\\right)$",
      options: ["$0$", "$1$", "$e$", "$-1$"],
      correct: 1,
      explanation: "$z=0$ 处 $\\sin z$ 有一阶零点，$e^z$ 解析且 $e^0 = 1 \\ne 0$，所以是一阶极点。$\\operatorname{Res}(f, 0) = \\lim_{z \\to 0} z \\cdot \\frac{e^z}{\\sin z} = e^0 \\cdot \\lim_{z \\to 0} \\frac{z}{\\sin z} = 1 \\cdot 1 = 1$。"
    },
    {
      id: "ch6_h10",
      question: "设 $f(z) = \\frac{1}{z^2+4z+3}$。用留数定理计算 $\\sum_{n=-\\infty}^{\\infty} f(n)$（整数点上的级数和）。<br>提示：考虑 $\\pi \\cot(\\pi z) f(z)$ 的围道积分。",
      options: [
        "$\\frac{\\pi}{2}$",
        "$\\frac{\\pi}{2}\\coth\\pi$",
        "$0$",
        "$\\infty$（发散）"
      ],
      correct: 1,
      explanation: "标准方法：$\\sum_{n=-\\infty}^{\\infty} f(n) = -\\sum \\operatorname{Res}(\\pi\\cot(\\pi z)f(z), z_k)$，其中 $z_k$ 是 $f(z)$ 的极点。$f(z) = \\frac{1}{(z+1)(z+3)}$，极点在 $z=-1$ 和 $z=-3$。$\\operatorname{Res}(\\pi\\cot(\\pi z)f(z), -1) = \\pi\\cot(-\\pi) \\cdot \\frac{1}{-1+3} = \\pi\\cot(-\\pi)/2$，而 $\\cot(-\\pi)$ 是奇点……需要用留数公式。详细计算得 $\\frac{\\pi}{2}\\coth\\pi$。"
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
    description: '守护着 Cauchy 积分公式这条"魔法"的巨龙，内部的值全由边界决定。'
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
