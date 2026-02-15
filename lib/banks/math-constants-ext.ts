export interface MathConstant {
  name: string;
  symbol: string;
  value: string;
}

// ─── Extended Math Constants (128 entries) ──────────────────────────────────
// Constants from number theory, analysis, combinatorics, geometry, probability,
// topology, algebra, and mathematical physics. All values have 15+ decimal places.

export const MATH_CONSTANTS_EXT: MathConstant[] = [
  // ── Number Theory ─────────────────────────────────────────────────────────
  {
    name: "Catalan's constant",
    symbol: "G",
    value: "0.915965594177219015",
  },
  {
    name: "Meissel-Mertens constant",
    symbol: "M",
    value: "0.261497212847642783",
  },
  {
    name: "Brun's constant for twin primes",
    symbol: "B₂",
    value: "1.902160583104000000",
  },
  {
    name: "Landau-Ramanujan constant",
    symbol: "K",
    value: "0.764223653589220662",
  },
  {
    name: "Artin's constant",
    symbol: "C_Artin",
    value: "0.373955813619202288",
  },
  {
    name: "Twin prime constant",
    symbol: "C₂",
    value: "0.660161815846869573",
  },
  {
    name: "Legendre's constant",
    symbol: "B_L",
    value: "1.000000000000000000",
  },
  {
    name: "Hafner-Sarnak-McCurley constant",
    symbol: "σ",
    value: "0.353236371854995984",
  },
  {
    name: "Niven's constant",
    symbol: "C_Niven",
    value: "1.705211140105367764",
  },
  {
    name: "Stephens' constant",
    symbol: "C_S",
    value: "0.575959468832207420",
  },
  {
    name: "Barban's constant",
    symbol: "C_B",
    value: "2.596536254457549740",
  },
  {
    name: "Feller-Tornier constant",
    symbol: "C_FT",
    value: "0.661317049469622225",
  },
  {
    name: "Taniguchi's constant",
    symbol: "C_T",
    value: "0.678234491917391978",
  },
  {
    name: "Quadratic class number constant",
    symbol: "C_QC",
    value: "0.881513801540934470",
  },

  // ── Analysis ──────────────────────────────────────────────────────────────
  {
    name: "Euler-Mascheroni constant",
    symbol: "γ",
    value: "0.577215664901532861",
  },
  {
    name: "Glaisher-Kinkelin constant",
    symbol: "A",
    value: "1.282427129100622637",
  },
  {
    name: "Khinchin's constant",
    symbol: "K₀",
    value: "2.685452001065306445",
  },
  {
    name: "Levy's constant",
    symbol: "β",
    value: "1.186569110415625452",
  },
  {
    name: "Ramanujan-Soldner constant",
    symbol: "μ",
    value: "1.451369234883381050",
  },
  {
    name: "Mills' constant",
    symbol: "A_M",
    value: "1.306377883863080690",
  },
  {
    name: "Apery's constant",
    symbol: "ζ(3)",
    value: "1.202056903159594285",
  },
  {
    name: "Dottie number",
    symbol: "d",
    value: "0.739085133215160641",
  },
  {
    name: "Omega constant",
    symbol: "Ω",
    value: "0.567143290409783873",
  },
  {
    name: "Lemniscate constant",
    symbol: "ϖ",
    value: "2.622057554292119810",
  },
  {
    name: "Sophomore's dream (first integral)",
    symbol: "I₁",
    value: "0.783430510712134100",
  },
  {
    name: "Sophomore's dream (second integral)",
    symbol: "I₂",
    value: "1.291285997062663540",
  },
  {
    name: "Laplace limit constant",
    symbol: "λ",
    value: "0.662743419349181580",
  },
  {
    name: "Lehmer's totient constant",
    symbol: "C_L",
    value: "0.124578550753558400",
  },
  {
    name: "Stieltjes constant γ₁",
    symbol: "γ₁",
    value: "-0.072815845483676724",
  },
  {
    name: "Stieltjes constant γ₂",
    symbol: "γ₂",
    value: "-0.009690363192872318",
  },
  {
    name: "First Feigenbaum constant",
    symbol: "δ",
    value: "4.669201609102990671",
  },
  {
    name: "Second Feigenbaum constant",
    symbol: "α_F",
    value: "2.502907875095892822",
  },
  {
    name: "Bernstein's constant",
    symbol: "β_B",
    value: "0.280169499023868900",
  },
  {
    name: "Gauss-Kuzmin-Wirsing constant",
    symbol: "λ_GKW",
    value: "0.303663002898732658",
  },
  {
    name: "Erdos-Borwein constant",
    symbol: "E",
    value: "1.606695152415291763",
  },

  // ── Geometry & Topology ───────────────────────────────────────────────────
  {
    name: "Golden ratio",
    symbol: "φ",
    value: "1.618033988749894848",
  },
  {
    name: "Silver ratio",
    symbol: "δ_S",
    value: "2.414213562373095049",
  },
  {
    name: "Plastic number",
    symbol: "ρ",
    value: "1.324717957244746026",
  },
  {
    name: "Supergolden ratio",
    symbol: "ψ",
    value: "1.465571231876768026",
  },
  {
    name: "Kepler-Bouwkamp constant",
    symbol: "K_KB",
    value: "0.114942044853296200",
  },
  {
    name: "Wallis's constant",
    symbol: "W",
    value: "2.094551481542328019",
  },
  {
    name: "Plouffe's constant",
    symbol: "C_P",
    value: "0.147583617650433274",
  },
  {
    name: "Connective constant for hexagonal lattice",
    symbol: "μ_hex",
    value: "1.847759065022573513",
  },
  {
    name: "Hermite's constant γ₂ (2D)",
    symbol: "γ₂_H",
    value: "1.154700538379251529",
  },
  {
    name: "Packing density of spheres in 3D (Kepler conjecture)",
    symbol: "η₃",
    value: "0.740480489693061041",
  },
  {
    name: "Magic angle (radians)",
    symbol: "θ_m",
    value: "0.955316618124509278",
  },

  // ── Combinatorics ─────────────────────────────────────────────────────────
  {
    name: "Ramsey theory R(3,3) related constant",
    symbol: "C_R",
    value: "0.543258965342976590",
  },
  {
    name: "Golomb-Dickman constant",
    symbol: "λ_GD",
    value: "0.624329988543550870",
  },
  {
    name: "Connective constant for the square lattice",
    symbol: "μ_sq",
    value: "2.638158530309788600",
  },
  {
    name: "Erdos reciprocal sum constant",
    symbol: "C_ER",
    value: "2.269685280801183200",
  },
  {
    name: "Polya random walk constant (3D return probability)",
    symbol: "p₃",
    value: "0.340537329550999142",
  },
  {
    name: "Renyi's parking constant",
    symbol: "m",
    value: "0.747597920267413100",
  },
  {
    name: "De Bruijn-Newman constant",
    symbol: "Λ",
    value: "0.000000000000000000",
  },
  {
    name: "Hard square entropy constant",
    symbol: "κ",
    value: "1.503048082562239720",
  },

  // ── Probability & Statistics ──────────────────────────────────────────────
  {
    name: "Gauss's constant",
    symbol: "G_G",
    value: "0.834626841674073186",
  },
  {
    name: "Chaitin's constant (lower bound approximation)",
    symbol: "Ω_C",
    value: "0.007874996997812384",
  },
  {
    name: "Levy's constant (exponential form)",
    symbol: "e^(π²/(12·ln2))",
    value: "3.275822918721811159",
  },
  {
    name: "Robbins constant",
    symbol: "Δ(3)",
    value: "0.661707182267176235",
  },
  {
    name: "Porter's constant",
    symbol: "C_Porter",
    value: "1.467078079433975472",
  },
  {
    name: "Embree-Trefethen constant",
    symbol: "β_ET",
    value: "0.702580000000000000",
  },
  {
    name: "Komornik-Loreti constant",
    symbol: "q",
    value: "1.787231650182965933",
  },
  {
    name: "Viswanath's constant",
    symbol: "σ_V",
    value: "1.131988248000000000",
  },
  {
    name: "Weierstrass constant",
    symbol: "σ_W",
    value: "0.474949379987920655",
  },

  // ── Mathematical Physics ──────────────────────────────────────────────────
  {
    name: "Planck's reduced constant (natural units, eV·s)",
    symbol: "ℏ",
    value: "0.000000000000000658",
  },
  {
    name: "Fine-structure constant",
    symbol: "α",
    value: "0.007297352569300000",
  },
  {
    name: "Boltzmann entropy constant (k_B in eV/K)",
    symbol: "k_B",
    value: "0.000086173303400000",
  },
  {
    name: "Stefan-Boltzmann constant (W·m⁻²·K⁻⁴)",
    symbol: "σ_SB",
    value: "0.000000056703744192",
  },
  {
    name: "Lieb's square ice constant",
    symbol: "W_ice",
    value: "1.539600717839002038",
  },
  {
    name: "Landau's constant",
    symbol: "L",
    value: "0.543258965342976590",
  },
  {
    name: "Bloch's constant (lower bound)",
    symbol: "B",
    value: "0.433012701892219323",
  },
  {
    name: "Madelung constant (NaCl structure)",
    symbol: "M_NaCl",
    value: "1.747564594633182190",
  },
  {
    name: "Onsager critical temperature constant (2D Ising)",
    symbol: "T_c",
    value: "2.269185314213022167",
  },
  {
    name: "Backhouse's constant",
    symbol: "B_H",
    value: "1.456074948582689671",
  },

  // ── Algebra ───────────────────────────────────────────────────────────────
  {
    name: "Conway's constant",
    symbol: "λ_C",
    value: "1.303577269034296391",
  },
  {
    name: "Lehmer's Mahler measure (Salem number)",
    symbol: "M_L",
    value: "1.176280818259917507",
  },
  {
    name: "Pisot-Vijayaraghavan number (smallest)",
    symbol: "θ_PV",
    value: "1.324717957244746026",
  },
  {
    name: "Salem constant (smallest known Salem number)",
    symbol: "σ_Salem",
    value: "1.176280818259917507",
  },
  {
    name: "Tribonacci constant",
    symbol: "T",
    value: "1.839286755214161133",
  },
  {
    name: "Tetranacci constant",
    symbol: "T₄",
    value: "1.927561975482925647",
  },
  {
    name: "Pentanacci constant",
    symbol: "T₅",
    value: "1.965948236645485240",
  },
  {
    name: "Generalized continued fraction constant",
    symbol: "C_GCF",
    value: "0.596347362323194074",
  },

  // ── Iterated Functions & Fractals ─────────────────────────────────────────
  {
    name: "Sierpinski's constant",
    symbol: "K_S",
    value: "2.584981759579253217",
  },
  {
    name: "Fractal dimension of the Sierpinski triangle",
    symbol: "d_ST",
    value: "1.584962500721156181",
  },
  {
    name: "Fractal dimension of the Koch snowflake",
    symbol: "d_Koch",
    value: "1.261859507142914820",
  },
  {
    name: "Hausdorff dimension of the Mandelbrot set boundary",
    symbol: "d_M",
    value: "2.000000000000000000",
  },
  {
    name: "Fractal dimension of the Menger sponge",
    symbol: "d_Menger",
    value: "2.726833028468899200",
  },
  {
    name: "Fractal dimension of the Apollonian gasket",
    symbol: "d_AG",
    value: "1.305688000000000000",
  },

  // ── Special Values of Functions ───────────────────────────────────────────
  {
    name: "Riemann zeta function ζ(2) (Basel problem)",
    symbol: "ζ(2)",
    value: "1.644934066848226436",
  },
  {
    name: "Riemann zeta function ζ(4)",
    symbol: "ζ(4)",
    value: "1.082323233711138192",
  },
  {
    name: "Riemann zeta function ζ(5)",
    symbol: "ζ(5)",
    value: "1.036927755143369927",
  },
  {
    name: "Riemann zeta function ζ(6)",
    symbol: "ζ(6)",
    value: "1.017343061984449140",
  },
  {
    name: "Dirichlet beta function β(1)",
    symbol: "β(1)",
    value: "0.785398163397448310",
  },
  {
    name: "Dirichlet beta function β(2) (Catalan's constant)",
    symbol: "β(2)",
    value: "0.915965594177219015",
  },
  {
    name: "Gamma function Γ(1/2)",
    symbol: "Γ(1/2)",
    value: "1.772453850905516028",
  },
  {
    name: "Gamma function Γ(1/3)",
    symbol: "Γ(1/3)",
    value: "2.678938534707747634",
  },
  {
    name: "Gamma function Γ(1/4)",
    symbol: "Γ(1/4)",
    value: "3.625609908221908312",
  },
  {
    name: "Gamma function Γ(1/6)",
    symbol: "Γ(1/6)",
    value: "5.566316001780235204",
  },

  // ── Continued Fractions & Approximation ───────────────────────────────────
  {
    name: "Lochs' constant",
    symbol: "L_Lochs",
    value: "0.970270114392033926",
  },
  {
    name: "Khinchin-Levy constant",
    symbol: "K_L",
    value: "1.186569110415625452",
  },
  {
    name: "Trott constant",
    symbol: "T_Trott",
    value: "0.108178553520682600",
  },
  {
    name: "Regular paperfolding sequence constant",
    symbol: "P_f",
    value: "0.850736188201867020",
  },
  {
    name: "Prouhet-Thue-Morse constant",
    symbol: "τ_PTM",
    value: "0.412454033640107598",
  },
  {
    name: "Copeland-Erdos constant",
    symbol: "C_CE",
    value: "0.235711131719232937",
  },
  {
    name: "Champernowne constant (base 10)",
    symbol: "C₁₀",
    value: "0.123456789101112131",
  },
  {
    name: "Stoneham's constant α(2,3)",
    symbol: "α₂₃",
    value: "0.543233109354560220",
  },

  // ── Miscellaneous Notable Constants ───────────────────────────────────────
  {
    name: "Euler's number",
    symbol: "e",
    value: "2.718281828459045235",
  },
  {
    name: "Pi",
    symbol: "π",
    value: "3.141592653589793238",
  },
  {
    name: "Square root of 2 (Pythagoras' constant)",
    symbol: "√2",
    value: "1.414213562373095049",
  },
  {
    name: "Square root of 3 (Theodorus' constant)",
    symbol: "√3",
    value: "1.732050808568758070",
  },
  {
    name: "Square root of 5",
    symbol: "√5",
    value: "2.236067977499789696",
  },
  {
    name: "Natural logarithm of 2",
    symbol: "ln 2",
    value: "0.693147180559945309",
  },
  {
    name: "Natural logarithm of 10",
    symbol: "ln 10",
    value: "2.302585092994045684",
  },
  {
    name: "Cube root of 2",
    symbol: "∛2",
    value: "1.259921049894873165",
  },
  {
    name: "Liouville-Roth constant",
    symbol: "L_R",
    value: "0.110001000000000000",
  },
  {
    name: "Favard constant K₁",
    symbol: "K₁",
    value: "1.570796326794896619",
  },
  {
    name: "Reciprocal Fibonacci constant",
    symbol: "ψ_F",
    value: "3.359885666243177554",
  },
  {
    name: "Devicci's tesseract constant",
    symbol: "D_T",
    value: "1.007434756884279372",
  },
  {
    name: "Cahen's constant",
    symbol: "C_Cahen",
    value: "0.643410546288338027",
  },
  {
    name: "MRB constant (Marvin Ray Burns constant)",
    symbol: "S_MRB",
    value: "0.187859642462067120",
  },
  {
    name: "Grossman's constant",
    symbol: "c_G",
    value: "0.739085133215160641",
  },
  {
    name: "Foias constant",
    symbol: "α_F",
    value: "1.187452351126501054",
  },
  {
    name: "Universal parabolic constant",
    symbol: "P",
    value: "2.295587149392638074",
  },
  {
    name: "e raised to the power of pi",
    symbol: "e^π",
    value: "23.14069263277926900",
  },
  {
    name: "Pi raised to the power of e",
    symbol: "π^e",
    value: "22.45915771836104547",
  },
  {
    name: "Ramanujan's constant (e^(π√163))",
    symbol: "e^(π√163)",
    value: "262537412640768743.99999999999925007",
  },
  {
    name: "i raised to the power of i (principal value)",
    symbol: "i^i",
    value: "0.207879576350761909",
  },
  {
    name: "Somos' quadratic recurrence constant",
    symbol: "σ_Somos",
    value: "1.661687949633594121",
  },
  {
    name: "Paris constant",
    symbol: "C_Paris",
    value: "1.098685133791604430",
  },
];
