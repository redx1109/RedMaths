/* ============================================================
   DATA & LEVELS
   ============================================================ */
const LEVELS = { 
  '00':'Origin',
  '01':'Structure',
  '02':'Dynamics',
  '03':'Abstraction',
  '04':'Frontier'
};
const LEVEL_ORDER = ['00','01','02','03','04'];

const LESSONS = [
  /* 00 · Origin (7) */
  { id:'f1', level:'00', title:'Place value', intuition:'A digit means different things depending on where it sits.', formula:'247 = 2\\cdot10^{2}+4\\cdot10^{1}+7', needs:[] },
  { id:'f2', level:'00', title:'Addition', intuition:'Adding is combining. Subtraction is adding the opposite.', formula:'a-b = a+(-b)', needs:['f1'] },
  { id:'f3', level:'00', title:'Multiplication', intuition:'Repeated addition. Commutative and distributes over addition.', formula:'a\\times b = b\\times a', needs:['f2'] },
  { id:'f4', level:'00', title:'Fractions', intuition:'A fraction is a division you have not performed yet.', formula:'\\frac{a}{b} = a \\div b', needs:['f3'] },
  { id:'f5', level:'00', title:'Negative numbers', intuition:'Every number has an opposite that cancels it.', formula:'a+(-a) = 0', needs:['f2'] },
  { id:'f6', level:'00', title:'Variables', intuition:'A letter is a placeholder for a number you have not chosen yet.', formula:'3x+2x = 5x', needs:['f4','f5'] },
  { id:'f7', level:'00', title:'Linear equations', intuition:'Undo operations in reverse until the variable stands alone.', formula:'ax+b=0 \\Rightarrow x=-\\frac{b}{a}', needs:['f6'] },

  /* 01 · Structure (10) */
  { id:'b1', level:'01', title:'Coordinates', intuition:'Two numbers pin down a point in the plane.', formula:'(x,y) \\in \\mathbb{R}^{2}', needs:['f5'] },
  { id:'b2', level:'01', title:'Lines & slope', intuition:'Slope is how fast y changes per unit of x.', formula:'y = mx+c', needs:['b1','f7'] },
  { id:'b3', level:'01', title:'Functions', intuition:'A machine: one input, exactly one output.', formula:'f : A \\to B', needs:['f6'] },
  { id:'b4', level:'01', title:'Quadratics', intuition:'A parabola is the graph of a square.', formula:'x = \\frac{-b\\pm\\sqrt{b^{2}-4ac}}{2a}', needs:['f7'] },
  { id:'b5', level:'01', title:'Exponents', intuition:'An exponent counts repeated multiplication.', formula:'a^{m}a^{n} = a^{m+n}', needs:['f3'] },
  { id:'b6', level:'01', title:'Logarithms', intuition:'Logs undo powers and turn products into sums.', formula:'\\log_b(xy) = \\log_b x+\\log_b y', needs:['b5'] },
  { id:'b7', level:'01', title:'Trigonometry', intuition:'Sine and cosine are ratios of sides in a right triangle.', formula:'\\sin^{2}\\theta+\\cos^{2}\\theta = 1', needs:['b1'] },
  { id:'b8', level:'01', title:'Sets', intuition:'A set is a collection with no order and no repeats.', formula:'A\\cup B,\\;A\\cap B,\\;A\\setminus B', needs:['f1'] },
  { id:'b9', level:'01', title:'Counting', intuition:'The product rule does most of the work.', formula:'n! = n(n-1)\\cdots 2\\cdot1', needs:['f3'] },
  { id:'b10', level:'01', title:'Probability', intuition:'Favourable outcomes over possible outcomes.', formula:'P(A) = \\frac{|A|}{|\\Omega|}', needs:['b8','b9'] },

  /* 02 · Dynamics (13) */
  { id:'i1', level:'02', title:'Limits', intuition:'A limit is where a function is heading, not where it lands.', formula:'\\lim_{x\\to a} f(x) = L', needs:['b3','b6'] },
  { id:'i2', level:'02', title:'Continuity', intuition:'Draw it without lifting your pen.', formula:'\\lim_{x\\to a} f(x) = f(a)', needs:['i1'] },
  { id:'i3', level:'02', title:'Derivative', intuition:'Zoom in far enough and a smooth curve looks like a line.', formula:"f'(x) = \\lim_{h\\to0}\\frac{f(x+h)-f(x)}{h}", needs:['i1','b2'] },
  { id:'i4', level:'02', title:'Chain rule', intuition:'Differentiate outside, keep inside, times inside derivative.', formula:"(f\\circ g)'(x) = f'(g(x))\\,g'(x)", needs:['i3','b4'] },
  { id:'i5', level:'02', title:'Integral', intuition:'Slice area into slivers and add them up.', formula:'\\int_{a}^{b} f(x)\\,dx', needs:['i3','b4'] },
  { id:'i6', level:'02', title:'Fundamental theorem', intuition:'Differentiation and integration are inverse.', formula:"\\int_{a}^{b} f'(x)\\,dx = f(b)-f(a)", needs:['i3','i5'] },
  { id:'i7', level:'02', title:'Vectors', intuition:'An arrow with length and direction.', formula:'\\mathbf{v} = (v_1,v_2,\\dots,v_n)', needs:['b1'] },
  { id:'i8', level:'02', title:'Matrices', intuition:'A function on space that moves, stretches, and rotates.', formula:'A\\mathbf{x}=\\mathbf{b}', needs:['i7'] },
  { id:'i9', level:'02', title:'Systems of equations', intuition:'Many equations, many unknowns. Gaussian elimination does the work.', formula:'A\\mathbf{x}=\\mathbf{b}', needs:['i8','f7'] },
  { id:'i10', level:'02', title:'Sequences', intuition:'An infinite list indexed by the naturals.', formula:'(a_n)_{n\\ge1}', needs:['i1'] },
  { id:'i11', level:'02', title:'Series', intuition:'Infinite sums can converge — when terms shrink fast enough.', formula:'\\sum_{n=1}^{\\infty}\\frac{1}{n^{2}} = \\frac{\\pi^{2}}{6}', needs:['i10'] },
  { id:'i12', level:'02', title:'Complex numbers', intuition:'Adjoin i, whose square is -1, and the line becomes a plane.', formula:'i^{2} = -1', needs:['b5'] },
  { id:'i13', level:'02', title:'ε–δ analysis', intuition:'"Arbitrarily close" made rigorous.', formula:'\\forall\\varepsilon>0\\;\\exists\\delta>0:|x-a|<\\delta\\Rightarrow|f(x)-L|<\\varepsilon', needs:['i1'] },

  /* 03 · Abstraction (12) */
  { id:'a1', level:'03', title:'Groups', intuition:'Strip away the numbers and keep the structure of combining.', formula:'a(bc)=(ab)c,\\;ae=a,\\;aa^{-1}=e', needs:['i8'] },
  { id:'a2', level:'03', title:'Rings', intuition:'Add multiplication to a group and you get a ring.', formula:'(R,+,\\cdot)\\;\\text{with distributivity}', needs:['a1'] },
  { id:'a3', level:'03', title:'Fields', intuition:'A ring where every nonzero element is invertible.', formula:'\\mathbb{Z}/p\\mathbb{Z}\\;\\text{is a field}\\iff p\\;\\text{prime}', needs:['a2'] },
  { id:'a4', level:'03', title:'Vector spaces', intuition:'Abstract vectors: anything you can add and scale.', formula:'\\alpha\\mathbf{u}+\\beta\\mathbf{v}\\in V', needs:['i8','i9'] },
  { id:'a5', level:'03', title:'Linear maps', intuition:'Maps that preserve addition and scaling.', formula:'T(\\alpha u+\\beta v) = \\alpha T(u)+\\beta T(v)', needs:['a4'] },
  { id:'a6', level:'03', title:'Eigenvalues', intuition:'Directions that survive a linear map unchanged.', formula:'A\\mathbf{v}=\\lambda\\mathbf{v}', needs:['a5'] },
  { id:'a7', level:'03', title:'Topology', intuition:'Continuity without distance.', formula:"f\\;\\text{continuous}\\iff f^{-1}(U)\\;\\text{open}", needs:['i13','b8'] },
  { id:'a8', level:'03', title:'Metric spaces', intuition:'A distance function obeying three obvious axioms.', formula:'d(x,y)\\le d(x,z)+d(z,y)', needs:['a7'] },
  { id:'a9', level:'03', title:'Compactness', intuition:'Every open cover has a finite subcover.', formula:'\\text{every open cover has a finite subcover}', needs:['a8'] },
  { id:'a10', level:'03', title:'Complex analysis', intuition:'Complex differentiability is stricter — and buys enormous power.', formula:'\\oint_\\gamma f(z)\\,dz = 0', needs:['i6','i12'] },
  { id:'a11', level:'03', title:'Measure theory', intuition:'Not every set has a length, but the measurable ones add up.', formula:'\\mu\\Big(\\bigcup_n A_n\\Big) = \\sum_n \\mu(A_n)', needs:['i13','i11'] },
  { id:'a12', level:'03', title:'Multivariable calculus', intuition:'Functions of several variables. Derivatives become vectors.', formula:'\\nabla f = (\\partial_{x_1}f,\\dots,\\partial_{x_n}f)', needs:['i6'] },

  /* 04 · Frontier (8) */
  { id:'r1', level:'04', title:'Algebraic geometry', intuition:'Geometry as the zero sets of polynomials.', formula:'V(I) = \\{x : f(x)=0\\;\\forall f\\in I\\}', needs:['a3'] },
  { id:'r2', level:'04', title:'Homological algebra', intuition:'Measure how far a sequence is from exact.', formula:'\\cdots\\to C_{n+1}\\xrightarrow{\\partial}C_n\\to\\cdots', needs:['a3'] },
  { id:'r3', level:'04', title:'Lie groups', intuition:'A smooth group. Near the identity it is a Lie algebra.', formula:'[X,Y] = XY-YX', needs:['a1','a8'] },
  { id:'r4', level:'04', title:'Representation theory', intuition:'Turn abstract groups into matrices so you can compute.', formula:'\\rho : G\\to\\mathrm{GL}(V)', needs:['a1','a5'] },
  { id:'r5', level:'04', title:'Riemannian geometry', intuition:'A smooth manifold with a metric on each tangent space.', formula:'ds^{2} = g_{ij}\\,dx^{i}dx^{j}', needs:['a12','a8'] },
  { id:'r6', level:'04', title:'Functional analysis', intuition:'Linear operators on infinite-dimensional spaces.', formula:'\\|Tx\\|\\le C\\|x\\|', needs:['a5','a11'] },
  { id:'r7', level:'04', title:'Probability theory', intuition:'Measure theory applied to events.', formula:'P\\Big(\\bigcup_n A_n\\Big) = \\sum_n P(A_n)', needs:['a11','b10'] },
  { id:'r8', level:'04', title:'Stochastic processes', intuition:'Random variables indexed by time.', formula:'\\mathbb{E}[X_{t+s}\\mid\\mathcal{F}_s] = X_s', needs:['r7'] }
];
const unlocks = {};
LESSONS.forEach(l => l.needs.forEach(n => (unlocks[n] = unlocks[n] || []).push(l.id)));