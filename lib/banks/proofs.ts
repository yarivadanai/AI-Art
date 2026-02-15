import { FALLACIOUS_PROOFS_EXT_1 } from "./proofs-ext-1";
import { FALLACIOUS_PROOFS_EXT_2 } from "./proofs-ext-2";

export interface FallaciousProof {
  title: string;
  steps: string[];
  errorStep: number; // 0-indexed
  errorExplanation: string;
  distractorExplanations: [string, string, string];
}

export const FALLACIOUS_PROOFS: FallaciousProof[] = [
  // ── 1. Every Continuous Function Is Differentiable ────────────────────────
  {
    title: "Proof that every continuous function is differentiable",
    steps: [
      "Let f: [a,b] → ℝ be continuous. We show f'(x) exists for all x ∈ (a,b).",
      "For each ε > 0 and each x, continuity gives δ > 0 such that |f(t) − f(x)| < ε for |t − x| < δ.",
      "Consider the difference quotient Q(h) = [f(x+h) − f(x)] / h for 0 < |h| < δ.",
      "By the continuity bound: |f(x+h) − f(x)| < ε, so |Q(h)| < ε/|h|. But we need a tighter estimate. Use the supremum: let M(δ) = sup{|Q(h)| : 0 < |h| < δ}.",
      "As δ → 0, the continuity of f forces sup{|f(x+h) − f(x)| : |h| < δ} → 0. Therefore lim_{δ→0} M(δ) · δ = lim_{δ→0} sup{|f(x+h) − f(x)|} = 0.",
      "Since M(δ) · δ → 0, take the limit of Q(h) as h → 0: lim_{h→0} Q(h) = lim_{δ→0} sup{Q(h) : 0 < |h| < δ} = lim_{δ→0} M(δ), which exists because M(δ) is monotone decreasing in δ.",
      "The monotone limit L = lim_{δ→0} M(δ) exists (possibly infinite, but M(δ)·δ → 0 implies M(δ) is finite). Therefore f'(x) = L exists.",
      "Since x was arbitrary, f is differentiable on (a,b). ∎",
    ],
    errorStep: 5,
    errorExplanation: "The step conflates the limit of the supremum of |Q(h)| with the limit of Q(h) itself. The fact that M(δ) = sup|Q(h)| has a monotone limit does NOT mean the difference quotient Q(h) converges to that limit. The supremum of a set of values converging does not imply the values themselves converge — the infimum of |Q(h)| could behave entirely differently. For the Weierstrass function, M(δ) → ∞ while no limit of Q(h) exists, precisely because the oscillation of the difference quotient does not diminish.",
    distractorExplanations: [
      "The continuity bound |f(x+h) − f(x)| < ε only gives |Q(h)| < ε/|h|, which diverges as h → 0, so the proof breaks down at step 2 when bounding Q(h)",
      "The supremum M(δ) is not necessarily monotone decreasing in δ because the set over which the supremum is taken grows as δ increases, not shrinks",
      "The error is in step 6: the claim that M(δ)·δ → 0 implies M(δ) is finite fails because M(δ) could be O(1/δ), giving M(δ)·δ → constant, not zero",
    ],
  },
  // ── 2. The Algebraic Numbers Are Uncountable ─────────────────────────────
  {
    title: "Proof that the set of all algebraic numbers is uncountable",
    steps: [
      "Assume for contradiction that the algebraic numbers are countable. List them as α₁, α₂, α₃, ... in (0,1).",
      "Write each αₙ in its decimal expansion: αₙ = 0.d₁⁽ⁿ⁾d₂⁽ⁿ⁾d₃⁽ⁿ⁾..., choosing the non-terminating expansion when ambiguous.",
      "Construct a new number β = 0.b₁b₂b₃... by the diagonal rule: bₖ = 5 if dₖ⁽ᵏ⁾ ≠ 5, and bₖ = 6 if dₖ⁽ᵏ⁾ = 5.",
      "By construction, β differs from αₙ in the n-th decimal place for every n, so β ≠ αₙ for all n.",
      "The number β lies in (0,1) and is well-defined as a real number. Since every digit of β is either 5 or 6, its decimal expansion is non-terminating and non-repeating only if the diagonal sequence is non-periodic. But regardless of periodicity, β is a definite real number not in the list.",
      "Since the algebraic numbers are closed under the field operations and the construction uses only algebraic input (the listed algebraic numbers), β must also be algebraic — it is defined arithmetically from algebraic data.",
      "But β is not in the enumeration, contradicting our assumption that all algebraic numbers in (0,1) were listed.",
      "Therefore the set of algebraic numbers is uncountable. ∎",
    ],
    errorStep: 5,
    errorExplanation: "The claim that β 'must be algebraic because it is defined arithmetically from algebraic data' is false. The diagonal construction produces an arbitrary real number, not an algebraic one. The closure of algebraic numbers under field operations applies to finite combinations using +, −, ×, ÷ and root extraction, not to the digit-by-digit construction used here. The number β is generically transcendental — the diagonal method exits the class of algebraic numbers. This is precisely why Cantor's diagonal argument proves the reals (not the algebraics) are uncountable.",
    distractorExplanations: [
      "The error is in step 2: algebraic numbers can have multiple decimal expansions (e.g., 0.4999... = 0.5000...), so the diagonal construction is ambiguous and β is not well-defined",
      "The enumeration in step 0 is impossible because algebraic numbers are dense in (0,1), so no sequence can list them in order — the proof fails at the very first step",
      "The diagonal construction in step 2 only uses digits 5 and 6, which means β is rational (its digits form a sequence over a finite alphabet), contradicting the claim that the proof produces uncountably many numbers",
    ],
  },
  // ── 3. Every Bounded Monotone Sequence Converges to Its Supremum ─────────
  {
    title: "Proof that every bounded monotone sequence converges to its supremum",
    steps: [
      "Let (aₙ) be a bounded sequence of real numbers with supremum S = sup{aₙ : n ∈ ℕ}.",
      "Since (aₙ) is bounded, the Bolzano-Weierstrass theorem guarantees a convergent subsequence aₙₖ → L for some L ∈ ℝ.",
      "Since aₙₖ ≤ S for all k (as S is an upper bound), we have L = lim aₙₖ ≤ S.",
      "For any ε > 0, by definition of supremum, there exists some aₙ with aₙ > S − ε. Since (aₙ) is bounded and the subsequence converges, for large enough k we have aₙₖ > S − ε.",
      "From step 3, aₙₖ > S − ε for large k, and from step 2, aₙₖ ≤ S. Therefore |aₙₖ − S| < ε for all large k.",
      "Hence the subsequence aₙₖ → S, which forces L = S.",
      "Since every convergent subsequence has the same limit S, the full sequence (aₙ) must converge to S (by the subsequential limit characterization of convergence for bounded sequences).",
      "Therefore every bounded monotone sequence converges to its supremum. ∎",
    ],
    errorStep: 3,
    errorExplanation: "Step 3 claims that because (aₙ) is bounded and a subsequence converges, for large enough k we have aₙₖ > S − ε. This conflates properties of the full sequence with properties of the subsequence. The subsequence aₙₖ need not visit values near S — it could converge to a value strictly less than S. The definition of supremum guarantees some term aₙ exceeds S − ε, but that particular term may not appear in the chosen subsequence. Moreover, the proof never actually uses the monotonicity hypothesis, which is a red flag: for a non-monotone bounded sequence, the result is false (e.g., aₙ = (−1)ⁿ has sup = 1 but does not converge).",
    distractorExplanations: [
      "The Bolzano-Weierstrass theorem in step 1 requires the sequence to be monotone, not just bounded, so its application is unjustified here",
      "The error is in step 6: the claim that all subsequential limits being equal implies convergence of the full sequence is false — it requires the sequence to be Cauchy, which hasn't been shown",
      "The inequality L ≤ S in step 2 should be strict (L < S) because the supremum of a sequence is never attained, making the conclusion L = S in step 5 contradictory",
    ],
  },
  // ── 4. Circular Reasoning Hidden in Algebraic Steps ───────────────────────
  {
    title: "Proof that the AM-GM inequality holds by assuming it",
    steps: [
      "We prove that for positive reals a, b: (a + b)/2 ≥ √(ab)",
      "Start with the identity: (a + b)² = a² + 2ab + b²",
      "Note that a² + b² ≥ 2ab (this is equivalent to (a − b)² ≥ 0, which is true)",
      "Therefore (a + b)² = a² + 2ab + b² ≥ 2ab + 2ab = 4ab",
      "Taking square roots: a + b ≥ 2√(ab)",
      "Now extend to n variables by induction: assume AM-GM holds for n variables",
      "For n + 1 variables, group the first n and apply the 2-variable case: ((a₁+...+aₙ)/n · n + aₙ₊₁)/2 ≥ √(((a₁+...+aₙ)/n)^n · aₙ₊₁). But the inductive hypothesis gives (a₁+...+aₙ)/n ≥ (a₁···aₙ)^(1/n), so we substitute this bound on the arithmetic mean into the geometric mean side",
      "This yields the (n+1)-variable AM-GM inequality",
    ],
    errorStep: 6,
    errorExplanation: "The inductive step applies the n-variable AM-GM inequality to bound the arithmetic mean from below, then substitutes this into the geometric mean expression. But this substitution goes the wrong direction: replacing a larger quantity (AM) with a smaller bound (GM) on the wrong side of the inequality produces an invalid chain. The inductive step is actually circular — it assumes the conclusion in order to simplify the expression it claims to derive.",
    distractorExplanations: [
      "The identity (a + b)² = a² + 2ab + b² holds only for non-negative reals, not all positive reals",
      "Taking square roots in step 4 is invalid because the square root function is concave, not convex",
      "The base case proof (2-variable) is incorrect because (a − b)² ≥ 0 requires a ≠ b",
    ],
  },
  // ── 5. The p-adic Absolute Value Satisfies Triangle Inequality with Equality
  {
    title: "Proof that the p-adic absolute value satisfies the triangle inequality with equality",
    steps: [
      "Let p be a prime and |·|_p the p-adic absolute value on ℚ. We prove |a + b|_p = |a|_p + |b|_p for all a, b ∈ ℚ.",
      "The p-adic absolute value satisfies the ultrametric (non-Archimedean) inequality: |a + b|_p ≤ max(|a|_p, |b|_p).",
      "In particular, max(|a|_p, |b|_p) ≤ |a|_p + |b|_p (since the max of two non-negative reals is at most their sum).",
      "Combining steps 1 and 2: |a + b|_p ≤ max(|a|_p, |b|_p) ≤ |a|_p + |b|_p. This establishes the triangle inequality.",
      "Now for the reverse: when |a|_p ≠ |b|_p, the ultrametric inequality is actually an equality: |a + b|_p = max(|a|_p, |b|_p). In the Archimedean case, the analogous statement gives |a + b| = |a| + |b| when a, b have the same sign. By the non-Archimedean analogy, the 'same sign' condition in the p-adic world corresponds to |a|_p ≠ |b|_p.",
      "When |a|_p = |b|_p, we have |a + b|_p ≤ |a|_p + |b|_p = 2|a|_p. But in the p-adic world, 2|a|_p = |a|_p + |a|_p = |a|_p + |b|_p, so the triangle inequality is tight.",
      "Therefore |a + b|_p = |a|_p + |b|_p in all cases.",
      "The p-adic absolute value satisfies the triangle inequality with equality. ∎",
    ],
    errorStep: 4,
    errorExplanation: "Step 4 draws a false analogy between the Archimedean and non-Archimedean cases. In the real absolute value, |a + b| = |a| + |b| when a and b have the same sign. But in the p-adic case, |a + b|_p = max(|a|_p, |b|_p) when |a|_p ≠ |b|_p — this is NOT the same as |a|_p + |b|_p (it equals the max, not the sum). The step incorrectly treats the ultrametric equality max(|a|_p, |b|_p) as if it were |a|_p + |b|_p. For example, with p=5, a=1, b=5: |1+5|_5 = |6|_5 = 1 = max(1, 1/5), but |1|_5 + |5|_5 = 1 + 1/5 = 6/5 ≠ 1.",
    distractorExplanations: [
      "The ultrametric inequality in step 1 is stated incorrectly — it should be |a + b|_p ≥ max(|a|_p, |b|_p), not ≤, because p-adic norms reverse the usual ordering",
      "The error is in step 5: when |a|_p = |b|_p, we cannot conclude |a + b|_p = 2|a|_p because the p-adic absolute value only takes values that are powers of p, and 2 is not a power of p (for p ≠ 2)",
      "Step 2 is wrong: max(|a|_p, |b|_p) ≤ |a|_p + |b|_p fails when one of the values is zero, since max(0, x) = x but 0 + x = x requires x ≥ 0 which is not guaranteed for p-adic values",
    ],
  },
  // ── 6. Every Symmetric Matrix Is Positive Definite ────────────────────────
  {
    title: "Proof that every symmetric matrix is positive definite",
    steps: [
      "Let A be an n×n real symmetric matrix. We prove xᵀAx > 0 for all nonzero x ∈ ℝⁿ.",
      "By the Spectral Theorem, A is orthogonally diagonalizable: A = QΛQᵀ where Q is orthogonal and Λ = diag(λ₁, ..., λₙ) contains the eigenvalues.",
      "Then xᵀAx = xᵀQΛQᵀx = (Qᵀx)ᵀΛ(Qᵀx). Let y = Qᵀx, so xᵀAx = yᵀΛy = Σᵢ λᵢyᵢ².",
      "Since Q is orthogonal (invertible), x ≠ 0 implies y = Qᵀx ≠ 0, so at least one yᵢ ≠ 0.",
      "Now consider the eigenvalues λᵢ. Since A is symmetric, all eigenvalues are real. The entries of A satisfy aᵢⱼ = aⱼᵢ, and the diagonal entries aᵢᵢ are the traces of the principal 1×1 submatrices. By Gershgorin's circle theorem, each eigenvalue λᵢ lies in a disc centered at aᵢᵢ with radius Rᵢ = Σⱼ≠ᵢ |aᵢⱼ|. For a symmetric matrix with positive entries, aᵢᵢ > 0 and aᵢᵢ > Rᵢ (since symmetry concentrates the row sum), giving λᵢ > 0.",
      "Since all λᵢ > 0 and at least one yᵢ ≠ 0, we have Σᵢ λᵢyᵢ² > 0.",
      "Therefore xᵀAx > 0 for all nonzero x, so A is positive definite.",
      "Since A was an arbitrary symmetric matrix, every symmetric matrix is positive definite. ∎",
    ],
    errorStep: 4,
    errorExplanation: "Step 4 falsely claims that for a symmetric matrix with positive entries, Gershgorin's theorem guarantees all eigenvalues are positive. The claim 'aᵢᵢ > Rᵢ since symmetry concentrates the row sum' is fabricated — symmetry (aᵢⱼ = aⱼᵢ) does not imply the diagonal dominance condition aᵢᵢ > Σⱼ≠ᵢ |aᵢⱼ|. A symmetric matrix with all positive entries can have negative eigenvalues. For example, the 2×2 matrix [[1, 2],[2, 1]] is symmetric with positive entries but has eigenvalue −1. The proof also silently restricts from 'all symmetric matrices' to those with positive entries, an unjustified narrowing.",
    distractorExplanations: [
      "The Spectral Theorem in step 1 requires A to be positive definite (not merely symmetric) to guarantee real eigenvalues, making the argument circular",
      "The substitution y = Qᵀx in step 2 is invalid because it changes the quadratic form — xᵀAx ≠ yᵀΛy in general unless Q commutes with A",
      "The error is in step 6: the sum Σᵢ λᵢyᵢ² > 0 requires ALL yᵢ ≠ 0, not just one, because a single negative eigenvalue multiplied by a large yᵢ² could dominate",
    ],
  },
  // ── 7. All Triangles Are Equilateral ──────────────────────────────────────
  {
    title: "Proof that all triangles are equilateral",
    steps: [
      "Let triangle ABC have sides a, b, c opposite to angles A, B, C",
      "By the law of cosines: a² = b² + c² − 2bc·cos(A)",
      "By the law of cosines: b² = a² + c² − 2ac·cos(B)",
      "Subtract the second from the first: a² − b² = (b² − a²) + 2c(a·cos(B) − b·cos(A))",
      "Rearrange: 2(a² − b²) = 2c(a·cos(B) − b·cos(A))",
      "By the projection formula: c = a·cos(B) + b·cos(A). Substitute: a² − b² = c·(a·cos(B) − b·cos(A)). But also from the projection formula, a·cos(B) = (a² + c² − b²)/(2c). Substituting and simplifying yields (a² − b²)(1 − 1) = 0",
      "The factor (1 − 1) = 0 makes this trivially true. But dividing both sides by (a² − b²), we get 0/(a² − b²) = 0, which is valid. Now rewrite the equation as (a − b)(a + b) · 0 = 0 and 'cancel' the zero: (a − b)(a + b) = 0",
      "Therefore a = b. By symmetric argument, b = c. Hence a = b = c and the triangle is equilateral.",
    ],
    errorStep: 6,
    errorExplanation: "The manipulation produces the identity 0 = 0 (since the expression reduces to (a² − b²) − (a² − b²) = 0). The 'rewriting' in step 7 that claims to recover (a − b)(a + b) = 0 from a product involving zero is algebraic nonsense — you cannot 'un-multiply' by zero. The equation 0 = 0 is vacuously true and carries no information about a and b.",
    distractorExplanations: [
      "The law of cosines subtraction in step 3 has an algebraic sign error on the right side",
      "The projection formula c = a·cos(B) + b·cos(A) only holds for acute triangles",
      "Dividing by (a² − b²) is only invalid if a = b, but we have not yet proved that",
    ],
  },
  // ── 8. Set Theory: Russell-style Paradox as Proof ─────────────────────────
  {
    title: "Proof that every set is a member of itself",
    steps: [
      "Define S = {x : x ∉ x}, the set of all sets that are not members of themselves",
      "Assume S ∉ S. Then by definition of S, S ∈ S — a contradiction",
      "Therefore S ∈ S (by proof by contradiction)",
      "Now let T be any set. Construct the set U = {x : x ∉ x or x = T}",
      "By the same argument: U ∈ U (otherwise U ∉ U implies U ∈ U)",
      "Since U ∈ U, and membership in U requires (U ∉ U or U = T), and U ∉ U is false, we must have U = T",
      "But U ∈ U means T ∈ T (since U = T)",
      "Since T was arbitrary, every set is a member of itself",
    ],
    errorStep: 2,
    errorExplanation: "Step 2 concludes S ∈ S by contradiction, but if S ∈ S then by the definition of S (sets NOT in themselves), S ∉ S — which is also a contradiction. The correct conclusion is that S cannot exist at all (this is Russell's Paradox). Naive set theory allows the definition, but no consistent conclusion about membership follows. The proof treats one direction of the contradiction while ignoring the other.",
    distractorExplanations: [
      "The definition S = {x : x ∉ x} is syntactically invalid in first-order logic",
      "The set U in step 3 is empty because the disjunction 'x ∉ x or x = T' is always false",
      "The error is in step 6: the logical step from U = T to T ∈ T requires the axiom of extensionality, which doesn't apply here",
    ],
  },
  // ── 9. Invalid Generalization: Finite to Infinite ─────────────────────────
  {
    title: "Proof that every infinite series of positive terms converges",
    steps: [
      "Let aₙ > 0 for all n. Consider the partial sums Sₙ = a₁ + a₂ + ... + aₙ",
      "Each partial sum Sₙ is a positive real number",
      "The sequence S₁ ≤ S₂ ≤ S₃ ≤ ... is monotonically increasing",
      "For any finite collection of positive reals, the sum exists and is finite",
      "By induction, every partial sum Sₙ is finite (since each is the previous finite sum plus a positive term)",
      "Since every Sₙ is finite and the sequence is monotonically increasing, the sequence is bounded above (because each term is a definite finite number, the sequence cannot 'reach' infinity)",
      "By the Monotone Convergence Theorem, a bounded monotone sequence converges",
      "Therefore the series converges",
    ],
    errorStep: 5,
    errorExplanation: "The claim that 'the sequence cannot reach infinity because each term is finite' is the fallacy of composition — inferring a property of the whole from a property of the parts. Each individual Sₙ being finite does NOT imply the sequence {Sₙ} is bounded. For example, Sₙ = 1 + 1 + ... + 1 = n is finite for every n but the sequence is unbounded. A monotone increasing sequence of finite numbers can diverge to infinity.",
    distractorExplanations: [
      "The Monotone Convergence Theorem requires the sequence to be decreasing, not increasing",
      "The induction in step 4 fails at the limit ordinal ω, where transfinite induction is required",
      "Step 2 is incorrect: a monotonically increasing sequence of positive reals must eventually decrease by the Pigeonhole Principle",
    ],
  },
  // ── 10. The Alternating Harmonic Series Converges to ln(3) ────────────────
  {
    title: "Proof that the alternating harmonic series converges to ln(3)",
    steps: [
      "The alternating harmonic series is S = 1 − 1/2 + 1/3 − 1/4 + 1/5 − 1/6 + ... It is well known to converge (by the alternating series test). We compute its sum.",
      "Group consecutive terms in pairs: S = (1 − 1/2) + (1/3 − 1/4) + (1/5 − 1/6) + ... = Σₙ₌₁^∞ [1/(2n−1) − 1/(2n)] = Σₙ₌₁^∞ 1/[2n(2n−1)].",
      "Now rearrange the series. Write S = 1 + 1/3 + 1/5 + ... − (1/2 + 1/4 + 1/6 + ...). The odd-reciprocal sum is Σ 1/(2n−1) and the even-reciprocal sum is (1/2)Σ 1/n.",
      "Recall the integral representation: ln(1+x) = x − x²/2 + x³/3 − x⁴/4 + ... for |x| ≤ 1. At x = 1: ln(2) = 1 − 1/2 + 1/3 − 1/4 + ..., which is our original series.",
      "But consider a rearrangement: take two positive terms, then one negative term. S' = 1 + 1/3 − 1/2 + 1/5 + 1/7 − 1/4 + 1/9 + 1/11 − 1/6 + ...",
      "Grouping in threes: S' = (1 + 1/3 − 1/2) + (1/5 + 1/7 − 1/4) + ... Each group equals (1/(2k−1) + 1/(2k+1) − 1/(2k)) for appropriate k. Summing these groups telescopes via partial fractions to yield ln(3).",
      "Since S' is merely a rearrangement of S (every term of S appears exactly once in S'), we have S = S' = ln(3).",
      "Therefore 1 − 1/2 + 1/3 − 1/4 + ... = ln(3). ∎",
    ],
    errorStep: 6,
    errorExplanation: "The series S = 1 − 1/2 + 1/3 − 1/4 + ... is conditionally convergent (it converges, but not absolutely). By the Riemann rearrangement theorem, any rearrangement of a conditionally convergent series can converge to any prescribed real number, or diverge. The rearrangement S' in step 4 changes the order of summation and thereby changes the sum. S' = ln(3)/2 · 2 ≈ ln(3) is indeed a valid sum for THAT particular rearrangement, but S' ≠ S. Equating a rearrangement to the original series is only valid for absolutely convergent series. The original series converges to ln(2), not ln(3).",
    distractorExplanations: [
      "The integral representation ln(1+x) = x − x²/2 + x³/3 − ... is only valid for |x| < 1, so substituting x = 1 in step 3 is outside the radius of convergence and gives an incorrect value",
      "The grouping in step 1 is invalid because rearranging terms of an infinite series (even into pairs) can change its sum, so the paired form Σ 1/[2n(2n−1)] may not equal S",
      "The error is in step 5: the partial fraction decomposition of (1/(2k−1) + 1/(2k+1) − 1/(2k)) does not telescope, so the claimed sum ln(3) is an arithmetic mistake",
    ],
  },
  // ── 11. Wrong Inductive Step: The Horse Color Problem ─────────────────────
  {
    title: "Proof that all horses are the same color",
    steps: [
      "We prove by induction on n: in any set of n horses, all horses are the same color",
      "Base case (n = 1): a single horse trivially has one color ✓",
      "Inductive step: assume true for all sets of n horses",
      "Consider a set of n + 1 horses: {h₁, h₂, ..., hₙ, hₙ₊₁}",
      "The subset {h₁, h₂, ..., hₙ} has all the same color by the inductive hypothesis",
      "The subset {h₂, h₃, ..., hₙ₊₁} also has all the same color by the inductive hypothesis",
      "These subsets overlap on {h₂, ..., hₙ}, so the color must be the same across all n + 1 horses",
      "By induction, all horses are the same color",
    ],
    errorStep: 6,
    errorExplanation: "When n = 1, the inductive step considers n + 1 = 2 horses: {h₁} and {h₂}. The 'overlap' {h₂, ..., hₙ} = {h₂, ..., h₁} is empty — the two subsets share no common element. Without a non-empty overlap, the colors cannot be linked. The inductive step fails precisely at the n = 1 to n = 2 transition.",
    distractorExplanations: [
      "The base case should start at n = 2 so that the overlap is always non-empty",
      "Mathematical induction does not apply to physical properties like color",
      "The subsets {h₁,...,hₙ} and {h₂,...,hₙ₊₁} each have n elements only if we count distinct horses, but some might be the same horse",
    ],
  },
  // ── 12. π = 4 Staircase Argument ──────────────────────────────────────────
  {
    title: "Proof that π = 4",
    steps: [
      "Inscribe a circle of diameter 1 inside a unit square (side length 1)",
      "The perimeter of the square is 4",
      "Remove the corners of the square by replacing each with a right-angled staircase that follows the circle more closely",
      "After each iteration, the staircase perimeter remains exactly 4 (each removed corner is replaced by two segments of equal total length)",
      "As the number of staircase steps approaches infinity, the staircase converges pointwise to the circle",
      "The perimeter of the limiting curve equals the limit of the perimeters: 4",
      "Since circumference = πd = π(1) = π, we conclude π = 4",
    ],
    errorStep: 5,
    errorExplanation: "The claim that 'the perimeter of the limiting curve equals the limit of the perimeters' is false. Pointwise convergence of curves does NOT imply convergence of their lengths. Arc length is not continuous under pointwise (or even uniform) convergence — it requires convergence of the derivatives as well. The staircase segments always travel horizontally and vertically, giving length 4, while the circle's tangent directions are smooth and diagonal.",
    distractorExplanations: [
      "The inscribed circle has diameter 1 but the circumference should be measured as 2πr = π, which already assumes π ≈ 3.14, making the proof circular",
      "The staircase perimeter actually decreases with each iteration, approaching π from above",
      "The error is that a circle cannot be inscribed in a square — it can only be circumscribed",
    ],
  },
  // ── 13. Complex Logarithm Fallacy ─────────────────────────────────────────
  {
    title: "Proof that 2πi = 0",
    steps: [
      "From Euler's formula: e^(2πi) = cos(2π) + i·sin(2π) = 1",
      "Take the natural logarithm of both sides: ln(e^(2πi)) = ln(1)",
      "Simplify the left side using ln(eˣ) = x: 2πi = ln(1)",
      "Since ln(1) = 0 in standard real analysis: 2πi = 0",
      "Divide both sides by i: 2π = 0",
      "Therefore π = 0, contradicting the fact that π ≈ 3.14159",
    ],
    errorStep: 2,
    errorExplanation: "The identity ln(eˣ) = x holds only for real x, or more precisely, only along the principal branch of the complex logarithm. The complex logarithm is multi-valued: ln(e^(2πi)) = 2πi + 2nπi for any integer n. The principal value of ln(1) is 0, but that does not mean every pre-image under exp maps to 0. Applying the real-valued logarithm identity to a complex exponent is the fundamental error.",
    distractorExplanations: [
      "Euler's formula gives e^(2πi) = −1, not 1 — the correct identity is e^(iπ) = −1",
      "You cannot take the logarithm of both sides of a complex equation because the logarithm is only defined for positive reals",
      "Dividing by i in step 4 is undefined because i has no multiplicative inverse",
    ],
  },
  // ── 14. Fallacious Probability: All Events Are Independent ────────────────
  {
    title: "Proof that P(A ∩ B) = P(A)·P(B) for all events",
    steps: [
      "Let A and B be events in a probability space (Ω, F, P) with P(B) > 0",
      "By definition of conditional probability: P(A|B) = P(A ∩ B) / P(B)",
      "Rearranging: P(A ∩ B) = P(A|B) · P(B)",
      "Now, the probability of event A depends only on the outcomes in A, not on what we condition on",
      "Therefore P(A|B) = P(A) for any event B",
      "Substituting into step 2: P(A ∩ B) = P(A) · P(B)",
      "Since A and B were arbitrary, all events are independent",
    ],
    errorStep: 4,
    errorExplanation: "The claim that P(A|B) = P(A) 'because the probability of A depends only on the outcomes in A' is false. Conditioning on B restricts the sample space to B, which generally changes the probability of A. The equality P(A|B) = P(A) is the very definition of independence — assuming it universally is circular reasoning.",
    distractorExplanations: [
      "The definition of conditional probability P(A|B) = P(A ∩ B)/P(B) is only valid for mutually exclusive events",
      "Step 2 requires Bayes' theorem, not just rearrangement of the conditional probability formula",
      "The proof is actually correct — all events in a finite probability space are independent by the multiplication rule",
    ],
  },
  // ── 15. Differentiating a Variable Sum ────────────────────────────────────
  {
    title: "Proof that 2x = x for all x, hence 2 = 1",
    steps: [
      "Write x² as x added to itself x times: x² = x + x + x + ... + x (x terms)",
      "Differentiate both sides with respect to x",
      "Left side: d/dx(x²) = 2x",
      "Right side: d/dx(x + x + ... + x) = d/dx(x) + d/dx(x) + ... + d/dx(x) = 1 + 1 + ... + 1 (x terms) = x",
      "Therefore 2x = x for all x",
      "Divide by x (for x ≠ 0): 2 = 1",
    ],
    errorStep: 3,
    errorExplanation: "The expression 'x added to itself x times' is only meaningful when x is a positive integer, not a real variable. More critically, the number of terms in the sum depends on x. When differentiating, we cannot treat the number of summands as a constant — the Leibniz rule for sums of varying length requires a product-rule-like correction. The differentiation in step 3 illegally treats the number of terms as fixed.",
    distractorExplanations: [
      "The derivative of a sum is the sum of derivatives only when the sum has finitely many terms, and x could be irrational",
      "Step 2 requires the chain rule: d/dx(x²) = 2x · dx/dx = 2x · 1 = 2x, so actually the left side is also x",
      "The identity x² = x + x + ... + x is algebraically correct for all real x by the definition of multiplication",
    ],
  },
  // ── 16. Cantor Diagonal Applied to Rationals ──────────────────────────────
  {
    title: "Proof that the rational numbers are uncountable",
    steps: [
      "Assume the rationals in (0,1) are countable: list them as r₁, r₂, r₃, ...",
      "Write each rₙ in decimal expansion: rₙ = 0.d₁ⁿd₂ⁿd₃ⁿ...",
      "Construct a new number d = 0.d₁d₂d₃... where dₖ differs from dₖᵏ (the kth digit of rₖ)",
      "Specifically, choose dₖ = 5 if dₖᵏ ≠ 5, and dₖ = 6 if dₖᵏ = 5 (avoiding 0 and 9 to prevent ambiguity)",
      "Then d ≠ rₙ for any n, since d differs from rₙ in the nth decimal place",
      "Therefore d is a number in (0,1) not in our list, contradicting the assumption that the list contains all rationals in (0,1)",
      "Hence the rationals in (0,1) are uncountable",
    ],
    errorStep: 5,
    errorExplanation: "The diagonal argument successfully produces a real number d not in the list, but d is not necessarily rational. Since the rationals are a proper subset of the reals, the argument only shows that no list of rationals exhausts all real numbers in (0,1) — which proves the reals are uncountable, not the rationals. The number d constructed by the diagonal method will generically be irrational.",
    distractorExplanations: [
      "The diagonal argument fails because some rational numbers have two decimal representations (e.g., 0.5000... = 0.4999...)",
      "The rationals in (0,1) cannot be listed as a sequence because they are dense in (0,1)",
      "The construction of d is flawed because digits 5 and 6 alone cannot represent all rational numbers",
    ],
  },
  // ── 17. Power Set of N is Countable ───────────────────────────────────────
  {
    title: "Proof that the power set of ℕ is countable",
    steps: [
      "Let P(ℕ) be the power set of the natural numbers",
      "Represent each subset S ⊆ ℕ as its characteristic function: an infinite binary string b₁b₂b₃... where bₙ = 1 iff n ∈ S",
      "Each infinite binary string can be approximated by its finite prefixes of length k",
      "The set of all finite binary strings is countable (there are 2 + 4 + 8 + ... strings of each length, and a countable union of finite sets is countable)",
      "Since each infinite binary string is the limit of its finite prefixes, and the finite prefixes are countable, each infinite string is determined by countably many finite strings",
      "A set determined by countably many elements from a countable set is itself countable",
      "Therefore P(ℕ) is countable",
    ],
    errorStep: 5,
    errorExplanation: "The claim that 'a set determined by countably many elements from a countable set is itself countable' is false. Each infinite binary string is indeed the limit of its finite prefixes, but the set of all possible such limits (i.e., the set of all infinite binary strings) is uncountable. The proof conflates 'each element is describable by countable data' with 'the collection of all such elements is countable.' By Cantor's diagonal argument, the set of infinite binary strings has cardinality 2^ℵ₀ > ℵ₀.",
    distractorExplanations: [
      "The representation in step 1 is non-unique because the same subset can have different characteristic functions depending on the ordering of ℕ",
      "The set of finite binary strings is actually uncountable because it includes strings of arbitrarily large length",
      "Step 3 is wrong: 2 + 4 + 8 + ... diverges, so the set of finite binary strings is not countable",
    ],
  },
  // ── 18. Matrix Commutativity via Binomial Theorem ─────────────────────────
  {
    title: "Proof that AB = BA for all square matrices",
    steps: [
      "Let A and B be n × n matrices over a field F",
      "Consider the square (A + B)² = (A + B)(A + B)",
      "Expand by distribution: (A + B)² = A² + AB + BA + B²",
      "By the binomial theorem: (A + B)² = A² + 2AB + B²",
      "Setting steps 2 and 3 equal: A² + AB + BA + B² = A² + 2AB + B²",
      "Cancel A² and B² from both sides: AB + BA = 2AB",
      "Subtract AB from both sides: BA = AB",
    ],
    errorStep: 3,
    errorExplanation: "The binomial theorem (a + b)² = a² + 2ab + b² assumes commutativity of multiplication (i.e., ab = ba). Applying it to matrices is circular reasoning — the conclusion AB = BA is implicitly assumed in the very expansion being used to 'prove' it. The correct matrix expansion is (A + B)² = A² + AB + BA + B², which does not simplify further without commutativity.",
    distractorExplanations: [
      "The distributive law does not hold for matrix multiplication, so step 2 is wrong",
      "Matrix squaring (A + B)² is undefined unless A and B are symmetric matrices",
      "Canceling A² and B² in step 5 requires both matrices to be invertible",
    ],
  },
  // ── 19. ∞ − ∞ = 0 Fallacy ─────────────────────────────────────────────────
  {
    title: "Proof that 1 = 0 via divergent series",
    steps: [
      "Consider the integral ∫₁^∞ (1/x) dx = lim(b→∞) [ln(x)]₁ᵇ = ∞",
      "Also consider the integral ∫₁^∞ (1/x) dx = ∞ (the same integral)",
      "Now consider ∫₁^∞ (1/x − 1/x) dx = ∫₁^∞ 0 dx = 0",
      "But also ∫₁^∞ (1/x − 1/x) dx = ∫₁^∞ (1/x) dx − ∫₁^∞ (1/x) dx = ∞ − ∞",
      "Since ∫₁^∞ 0 dx = 0, we have ∞ − ∞ = 0",
      "Now apply this: ∫₁^∞ (1/x) dx = ∞ and ∫₁^∞ (1/(x+1)) dx = ∞",
      "So ∫₁^∞ (1/x − 1/(x+1)) dx = ∫₁^∞ (1/x) dx − ∫₁^∞ (1/(x+1)) dx = ∞ − ∞ = 0 (by step 4)",
      "But ∫₁^∞ (1/x − 1/(x+1)) dx = ∫₁^∞ 1/(x(x+1)) dx = [−ln(x/(x+1))]₁^∞ = ln(2) ≈ 0.693",
    ],
    errorStep: 4,
    errorExplanation: "The step ∞ − ∞ = 0 is invalid because ∞ − ∞ is an indeterminate form, not a determined value. In step 4, the two divergent integrals are identical so their difference is 0, but this is a special case. In step 6, the two integrals are different divergent quantities, and their difference is ln(2), not 0. The fallacy generalizes from the special case (identical integrals) to the general case (different integrals with the same divergent behavior).",
    distractorExplanations: [
      "The integral ∫₁^∞ (1/x) dx actually converges by the p-test with p = 1",
      "Splitting ∫₁^∞ (f − g) dx into ∫₁^∞ f dx − ∫₁^∞ g dx is always valid for improper integrals",
      "The computation ∫₁^∞ 1/(x(x+1)) dx = ln(2) is incorrect — partial fractions give a divergent integral",
    ],
  },
  // ── 20. Every Function Is Continuous ──────────────────────────────────────
  {
    title: "Proof that every function is continuous",
    steps: [
      "Let f: ℝ → ℝ be any function and let a ∈ ℝ",
      "We show lim(x→a) f(x) = f(a) using sequences",
      "Let (xₙ) be any sequence converging to a. Consider f(xₙ)",
      "The sequence (f(xₙ)) is a sequence of real numbers. By the Bolzano-Weierstrass theorem, if bounded, it has a convergent subsequence f(xₙₖ) → L",
      "Since xₙₖ → a and f(xₙₖ) → L, we evaluate: f(a) = f(lim xₙₖ) = L by substituting the limit into f",
      "Therefore f(xₙₖ) → f(a), and since this holds for every convergent subsequence, f(xₙ) → f(a)",
      "Since (xₙ) was arbitrary, lim(x→a) f(x) = f(a), so f is continuous at a",
    ],
    errorStep: 4,
    errorExplanation: "The step f(a) = f(lim xₙₖ) = L assumes that f commutes with limits — that is, f(lim xₙₖ) = lim f(xₙₖ). But this property IS the definition of continuity at a, which is exactly what we are trying to prove. The argument is circular: it assumes continuity to prove continuity.",
    distractorExplanations: [
      "Bolzano-Weierstrass requires (f(xₙ)) to be bounded, which is not guaranteed for arbitrary f",
      "The sequence (xₙ) must approach a from both sides, but step 2 only considers one-sided limits",
      "The argument fails because Bolzano-Weierstrass gives different subsequential limits, proving f is discontinuous",
    ],
  },
  // ── 21. |ℝ| ≠ |ℝ²| Topological Argument ──────────────────────────────────
  {
    title: "Proof that ℝ and ℝ² have different cardinalities",
    steps: [
      "Suppose there exists a bijection f: ℝ → ℝ²",
      "If f is continuous, then f restricted to [0,1] maps a compact interval to a subset of ℝ²",
      "A continuous bijection from a compact space to a Hausdorff space is a homeomorphism",
      "But ℝ and ℝ² are not homeomorphic: removing a point from ℝ disconnects it into two components, while removing a point from ℝ² leaves it connected",
      "Therefore no continuous bijection f exists",
      "Since no bijection (even non-continuous) can exist between spaces of different topological dimension, |ℝ| ≠ |ℝ²|",
    ],
    errorStep: 5,
    errorExplanation: "Step 5 wrongly conflates the non-existence of a continuous bijection (homeomorphism) with the non-existence of ANY bijection. Cardinality only requires a bijection, which need not be continuous. In fact, |ℝ| = |ℝ²| = 2^ℵ₀ by Cantor's interleaving of decimal expansions. The proof correctly shows ℝ and ℝ² are not homeomorphic, but incorrectly concludes they have different cardinalities.",
    distractorExplanations: [
      "Removing a point from ℝ² also disconnects it, so the topological argument in step 3 is wrong",
      "The bijection f: ℝ → ℝ² cannot exist even set-theoretically because ℝ² has strictly more points",
      "Space-filling curves like Peano's curve show continuous surjections from ℝ to ℝ² exist, contradicting step 4",
    ],
  },
  // ── 22. Fermat's Little Theorem Misapplication ────────────────────────────
  {
    title: "Proof that 3 divides 1 (hence 3 = 0 mod 1)",
    steps: [
      "Fermat's Little Theorem: if p is prime and gcd(a, p) = 1, then a^(p−1) ≡ 1 (mod p)",
      "Let p = 3 and a = 2: then 2² = 4 ≡ 1 (mod 3) ✓",
      "Now let p = 3 and a = 3: then 3² = 9 ≡ 1 (mod 3)",
      "But 9 = 3 × 3, so 9 ≡ 0 (mod 3), not 1",
      "From steps 2 and 3: 0 ≡ 1 (mod 3), meaning 3 | (1 − 0) = 1",
      "Therefore 3 divides 1",
    ],
    errorStep: 2,
    errorExplanation: "Fermat's Little Theorem requires gcd(a, p) = 1, i.e., a must be coprime to p. Setting a = 3 and p = 3 gives gcd(3, 3) = 3 ≠ 1, violating the hypothesis. The theorem simply does not apply. The resulting 'contradiction' between 9 ≡ 0 and the claimed 9 ≡ 1 comes from applying the theorem outside its domain of validity.",
    distractorExplanations: [
      "The theorem actually states aᵖ ≡ a (mod p), not a^(p−1) ≡ 1 (mod p), which changes the result",
      "Step 1 correctly applies the theorem; the error is that 9 mod 3 should be computed as 9 − 2·3 = 3, not 0",
      "Fermat's Little Theorem only works for primes larger than a, so p = 3 and a = 3 fails because p must exceed a",
    ],
  },
  // ── 23. e^x derivative is zero ────────────────────────────────────────────
  {
    title: "Proof that d/dx(eˣ) = 0",
    steps: [
      "Express eˣ as a product: eˣ = e · e · e · ... · e (x copies of e)",
      "Each factor e ≈ 2.71828... is a constant with respect to x",
      "The derivative of a constant is 0",
      "By the product rule for finitely many constant factors, d/dx(c₁ · c₂ · ... · cₙ) = 0",
      "The number of factors x does not affect the derivative since each factor is constant",
      "Therefore, since eˣ is a product of constants, d/dx(eˣ) = 0",
    ],
    errorStep: 0,
    errorExplanation: "The expression 'e multiplied by itself x times' is only defined when x is a positive integer. For real-valued x, eˣ is defined via the exponential function (as a power series or the inverse of the natural logarithm), not as a finite product. Moreover, even for integer x, the number of factors changes with x, so the 'product of constants' framing is invalid — the product length is itself a function of x, which must be accounted for in differentiation.",
    distractorExplanations: [
      "The product rule for n factors gives d/dx(eⁿ) = n · eⁿ⁻¹ · d/dx(e) = 0, confirming the result since d/dx(e) = 0",
      "The error is that e is not actually a constant — it depends on the natural logarithm, which depends on x",
      "The derivative should be computed using logarithmic differentiation: d/dx(eˣ) = eˣ · d/dx(x · ln(e)) = eˣ · 1 = eˣ, but this is a different method, not a correction of the product argument",
    ],
  },
  // ── 24. Modular Arithmetic: Squaring the Modulus ──────────────────────────
  {
    title: "Proof that 4 ≡ 0 (mod 4) implies 2 ≡ 0 (mod 2) implies 1 = 0",
    steps: [
      "Start with −1 ≡ 1 (mod 2), which is true since 1 − (−1) = 2",
      "Square both sides: (−1)² ≡ 1² (mod 2²), giving 1 ≡ 1 (mod 4)",
      "Now work backwards: since 1 ≡ 1 (mod 4), take square roots: −1 ≡ 1 (mod 2)",
      "Square both sides again but this time with modulus 2: (−1)² ≡ 1² (mod 2), giving 1 ≡ 1 (mod 2)",
      "But from step 0, −1 ≡ 1 (mod 2), and adding 1: 0 ≡ 2 (mod 2), hence 2 ≡ 0 (mod 2). Divide by 2: 1 ≡ 0 (mod 1)",
      "Since everything is congruent to 0 (mod 1), we conclude 1 = 0",
    ],
    errorStep: 1,
    errorExplanation: "If a ≡ b (mod m), then a² ≡ b² (mod m), NOT (mod m²). Squaring the values does not square the modulus. The jump from mod 2 to mod 4 is unjustified. Additionally, 'dividing' congruences by 2 in step 4 (going from mod 2 to mod 1) is not a valid operation — reducing the modulus to 1 makes every integer congruent to 0, which is trivially true and carries no information.",
    distractorExplanations: [
      "The initial congruence −1 ≡ 1 (mod 2) is false because negative numbers cannot be used in modular arithmetic",
      "Taking square roots in modular arithmetic is undefined, making step 2 the first error",
      "The congruence 0 ≡ 2 (mod 2) is actually false, since 0 and 2 differ by 2 which is the modulus, not a multiple of it",
    ],
  },
  // ── 25. The Cantor Set Has Positive Measure ──────────────────────────────
  {
    title: "Proof that the Cantor set has positive measure",
    steps: [
      "The Cantor set C is constructed from [0,1] by iteratively removing open middle thirds. We compute the Lebesgue measure of C.",
      "At step 1, remove the open middle third (1/3, 2/3), which has length 1/3. Remaining measure: 1 − 1/3 = 2/3.",
      "At step 2, remove the middle thirds of the two remaining intervals: (1/9, 2/9) and (7/9, 8/9). Each has length 1/9, and there are 2 such intervals. Total removed: 2 · (1/9) = 2/9.",
      "At step 3, remove the middle thirds of the four remaining intervals. Each has length 1/27, and there are 4 such intervals. Total removed: 4 · (1/27) = 4/27.",
      "In general, at step n, we remove 2ⁿ⁻¹ intervals each of length 1/3ⁿ. Wait — let us recount. At step n, the number of intervals removed equals the number of remaining intervals from the previous step: at step 1 we have 2 intervals remaining, step 2 gives 4, so at step n we remove 2ⁿ⁻¹ intervals, but each interval at step n has length 3⁻ⁿ. The total removed at step n is 2ⁿ⁻¹ · 3⁻ⁿ.",
      "The total measure removed over all steps is Σₙ₌₁^∞ 2ⁿ⁻¹ · 3⁻ⁿ = (1/3) · Σₙ₌₁^∞ (2/3)ⁿ⁻¹ · (1/3)⁰ ... Let us compute directly: Σₙ₌₁^∞ 2ⁿ⁻¹/3ⁿ = (1/3)·Σₖ₌₀^∞ (2/3)ᵏ = (1/3)·(1/(1−2/3)) = (1/3)·3 = 1. Wait, that gives total removed = 1, leaving measure 0. Recheck: actually at step n we remove 2ⁿ⁻¹ intervals but some of those intervals overlap with previously removed portions. Accounting for overlap, the net new removal at step n is strictly less than 2ⁿ⁻¹ · 3⁻ⁿ.",
      "After correcting for overlaps, the total removed is strictly less than 1. Therefore the Cantor set has measure 1 − (total removed) > 0.",
      "The Cantor set has positive Lebesgue measure. ∎",
    ],
    errorStep: 5,
    errorExplanation: "There are NO overlaps in the Cantor set construction. At each step, the intervals being removed are open middle thirds of the REMAINING closed intervals — they are disjoint from all previously removed intervals by construction. The 'overlap correction' in step 5 is entirely fictitious. The correct computation is: total removed = Σₙ₌₁^∞ 2ⁿ⁻¹/3ⁿ = 1, so the Cantor set has measure 1 − 1 = 0. The proof introduces a spurious correction to avoid the conclusion that the measure is zero, which is in fact the correct answer.",
    distractorExplanations: [
      "The error is in step 4: at step n, the number of intervals removed is 2ⁿ (not 2ⁿ⁻¹), so the geometric series sums to 2 instead of 1, which would give a negative measure — an absurdity showing the construction is ill-defined",
      "The geometric series Σ 2ⁿ⁻¹/3ⁿ does not converge because the ratio 2/3 is not less than 1/2, which is required for geometric series convergence",
      "The construction removes closed intervals (not open ones), so the boundary points are removed twice, causing the measure calculation to double-count and yielding an incorrect total",
    ],
  },
  // ── 26. Differentiable Implies Twice Differentiable ───────────────────────
  {
    title: "Proof that every differentiable function is twice differentiable",
    steps: [
      "Let f be differentiable on ℝ, so f'(x) exists for all x",
      "The derivative is defined as: f'(x) = lim(h→0) [f(x+h) − f(x)] / h",
      "Since this limit exists for every x, the function g(x) = f'(x) is well-defined on all of ℝ",
      "Consider g(x) = f'(x). Compute its derivative: g'(x) = lim(h→0) [g(x+h) − g(x)] / h = lim(h→0) [f'(x+h) − f'(x)] / h",
      "Since f'(x+h) and f'(x) both exist (f is differentiable everywhere), the numerator f'(x+h) − f'(x) is well-defined",
      "A well-defined quotient with a well-defined limit in the denominator (h → 0) must converge",
      "Therefore g'(x) = f''(x) exists, and f is twice differentiable",
    ],
    errorStep: 5,
    errorExplanation: "A quotient [f'(x+h) − f'(x)]/h being 'well-defined' for each h ≠ 0 does NOT guarantee the limit as h → 0 exists. Many sequences of well-defined numbers fail to converge. The existence of f'(x) everywhere says nothing about whether f' itself is differentiable. Counterexample: f(x) = x²·sin(1/x) for x ≠ 0, f(0) = 0 is differentiable everywhere but f' is not even continuous at 0, let alone differentiable.",
    distractorExplanations: [
      "The mean value theorem guarantees that f' is continuous, which would make the limit in step 3 exist",
      "Step 3 is wrong because the limit definition of g'(x) requires g to be continuous, which hasn't been shown",
      "The counterexample f(x) = |x| shows that differentiable functions need not be continuous, invalidating the premise",
    ],
  },
  // ── 27. Harmonic Series Converges ─────────────────────────────────────────
  {
    title: "Proof that the harmonic series converges",
    steps: [
      "Consider H = 1 + 1/2 + 1/3 + 1/4 + 1/5 + ...",
      "Group terms: H = 1 + (1/2) + (1/3 + 1/4) + (1/5 + 1/6 + 1/7 + 1/8) + ...",
      "Bound each group: 1/3 + 1/4 ≤ 1/2 + 1/2 = 1, and 1/5 + 1/6 + 1/7 + 1/8 ≤ 4 · (1/4) = 1",
      "In general, each group of 2ⁿ terms contributes at most 1 to the sum",
      "Since each group contributes at most 1 and the groups get smaller relative to the total, the series converges by comparison with a geometric series",
      "Therefore H is a finite number",
    ],
    errorStep: 4,
    errorExplanation: "The claim that 'the groups get smaller' is false. Each group of 2ⁿ terms actually contributes at least 1/2 (not 'at most 1 and getting smaller'). Specifically: 1/3 + 1/4 > 1/2, and 1/5 + 1/6 + 1/7 + 1/8 > 4·(1/8) = 1/2. Since infinitely many groups each contribute at least 1/2, the partial sums grow without bound. This is precisely the classic Oresme proof that the harmonic series DIVERGES.",
    distractorExplanations: [
      "The grouping changes the order of summation, which is only valid for absolutely convergent series",
      "The comparison test requires comparing with a known convergent series, which was not provided",
      "Step 2 has an error: 1/3 + 1/4 = 7/12, which exceeds 1/2, so the bound of 1 per group is too loose to conclude anything",
    ],
  },
  // ── 28. Logarithm Power Rule for Negatives ────────────────────────────────
  {
    title: "Proof that 1 = −1 via logarithms",
    steps: [
      "Begin with the true statement: (−1)² = 1",
      "Take the natural logarithm of both sides: ln((−1)²) = ln(1)",
      "Apply the power rule for logarithms: 2 · ln(−1) = ln(1)",
      "Since ln(1) = 0: 2 · ln(−1) = 0",
      "Divide by 2: ln(−1) = 0",
      "Exponentiate both sides: e^(ln(−1)) = e⁰, so −1 = 1",
    ],
    errorStep: 2,
    errorExplanation: "The power rule ln(aⁿ) = n·ln(a) is valid only when a > 0 in real analysis. Since a = −1 < 0, ln(−1) is undefined in the reals. In complex analysis, ln(−1) = iπ + 2nπi (multi-valued), and the power rule becomes ln(a^n) = n·ln(a) + 2kπi for some integer k. Dropping the imaginary correction term is the error.",
    distractorExplanations: [
      "Taking ln of both sides is invalid because the natural logarithm is not injective on the complex plane",
      "The error is in step 0: (−1)² = (−1)(−1) could equal −1 under a different convention for negative exponents",
      "ln(1) is actually undefined because 1 is the identity element of multiplication, and ln of a unit is indeterminate",
    ],
  },
  // ── 29. Sum of All Natural Numbers = −1/12 ────────────────────────────────
  {
    title: "Proof that the sum 1 + 2 + 3 + 4 + ... = −1/12",
    steps: [
      "Let S₁ = 1 − 1 + 1 − 1 + ... and assign S₁ = 1/2 by Cesàro summation",
      "Let S₂ = 1 − 2 + 3 − 4 + ... From S₂ − S₂ shifted: 2S₂ = S₁, so S₂ = 1/4",
      "Let S = 1 + 2 + 3 + 4 + 5 + ...",
      "Compute S − S₂ = (1−1) + (2+2) + (3−3) + (4+4) + ... = 0 + 4 + 0 + 8 + ... = 4(1 + 2 + 3 + ...) = 4S",
      "Substituting S₂ = 1/4: S − 1/4 = 4S",
      "Solving: −1/4 = 3S, so S = −1/12",
    ],
    errorStep: 0,
    errorExplanation: "The entire manipulation treats divergent series as having definite sums and applies algebraic operations (shifting, subtracting) that are only valid for convergent series. S₁ = 1/2 is a Cesàro regularization, not a conventional sum. Arithmetic operations like S − S₂ and the term-by-term subtraction in step 3 are not preserved under Cesàro or zeta function regularization. The 'result' −1/12 is the value of the Riemann zeta function ζ(−1), obtained by analytic continuation, not by summing a divergent series.",
    distractorExplanations: [
      "The shift operation in step 1 is valid for Cesàro summable series, so S₂ = 1/4 is correct",
      "The arithmetic in step 3 is wrong: S − S₂ should give 0 + 4 + 0 + 8 + ... = 4S is incorrect bookkeeping",
      "S₁ should equal 0 (not 1/2) because the partial sums alternate between 0 and 1",
    ],
  },
  // ── 30. √(ab) = √a·√b for Negatives ──────────────────────────────────────
  {
    title: "Proof that −1 = 1 using square root properties",
    steps: [
      "Begin with the identity √a · √b = √(ab), assumed valid for all real a, b",
      "Let a = −1 and b = −1",
      "Then √(−1) · √(−1) = √((−1)(−1)) = √(1) = 1",
      "But √(−1) = i by definition, so √(−1) · √(−1) = i · i = i² = −1",
      "From steps 2 and 3: 1 = −1",
      "Add 1 to both sides: 2 = 0, and divide by 2: 1 = 0",
    ],
    errorStep: 0,
    errorExplanation: "The identity √a · √b = √(ab) is only valid when at least one of a, b is non-negative. When both a and b are negative, √(ab) = √(|a||b|) is positive, while √a · √b = i√|a| · i√|b| = −√(|a||b|) is negative. Applying the identity to two negative numbers reverses the sign. This restriction comes from the branch cut of the complex square root function.",
    distractorExplanations: [
      "The definition √(−1) = i is a convention, not a definition; the true value is ±i, and choosing +i is arbitrary",
      "The product (−1)(−1) = −1 under certain algebraic systems, so √(−1·−1) = √(−1), not √(1)",
      "The error is in step 3: i² = +1 by the standard definition of imaginary units, not −1",
    ],
  },
];

// ─── Merge extensions (with dedup) ────────────────────────────────────────────
{
  const seen = new Set(FALLACIOUS_PROOFS.map((p) => p.title.toLowerCase().trim()));
  for (const ext of [...FALLACIOUS_PROOFS_EXT_1, ...FALLACIOUS_PROOFS_EXT_2]) {
    const k = ext.title.toLowerCase().trim();
    if (!seen.has(k)) { seen.add(k); FALLACIOUS_PROOFS.push(ext); }
  }
}
