export interface FallaciousProof {
  title: string;
  steps: string[];
  errorStep: number; // 0-indexed
  errorExplanation: string;
  distractorExplanations: [string, string, string];
}

export const FALLACIOUS_PROOFS_EXT_1: FallaciousProof[] = [
  // ── 1. Real Analysis ───────────────────────────────────────────────────────
  {
    title: "Proof that every monotone function on [0,1] is continuous",
    steps: [
      "Let f: [0,1] → ℝ be monotone increasing (the decreasing case is symmetric).",
      "Suppose f has a jump discontinuity at some point c ∈ (0,1), so f(c⁻) < f(c⁺).",
      "Define the oscillation at c as ω(c) = f(c⁺) − f(c⁻) > 0.",
      "For each discontinuity cₙ, associate the open interval Jₙ = (f(cₙ⁻), f(cₙ⁺)) of length ω(cₙ).",
      "Since f is monotone, these intervals Jₙ are pairwise disjoint and all lie within [f(0), f(1)].",
      "The total length ∑ω(cₙ) ≤ f(1) − f(0) < ∞, so the set of discontinuities is countable.",
      "A countable subset of [0,1] has Lebesgue measure zero, so the discontinuity set has measure zero.",
      "A function that is continuous except on a set of measure zero is continuous almost everywhere, and since f is monotone, the Dini derivatives exist and are finite a.e., which forces the jumps to vanish.",
      "Therefore f is continuous everywhere on [0,1]. ∎",
    ],
    errorStep: 7,
    errorExplanation:
      "The step illegitimately concludes that because discontinuities form a measure-zero set and Dini derivatives are finite a.e., the jumps must vanish. Continuity a.e. does not imply continuity everywhere. A monotone function can indeed have countably many jump discontinuities (e.g., the function that jumps by 1/2ⁿ at the n-th rational). The finiteness of Dini derivatives a.e. says nothing about eliminating the actual jump discontinuities — it only constrains the derivative where it exists.",
    distractorExplanations: [
      "The error is in step 4: the intervals Jₙ are not necessarily pairwise disjoint because a monotone function can have overlapping ranges near adjacent discontinuities",
      "The Bolzano-Weierstrass argument is needed in step 5 to ensure the sum converges, but the proof skips this, so the sum could diverge",
      "The error is in step 1: monotone functions on closed intervals must be bounded, but the proof never verifies that f(0) and f(1) are finite",
    ],
  },

  // ── 2. Abstract Algebra ────────────────────────────────────────────────────
  {
    title: "Proof that every group of order p² is cyclic (p prime)",
    steps: [
      "Let G be a group of order p² where p is prime.",
      "By the class equation, |G| = |Z(G)| + ∑[G : C_G(gᵢ)], where the sum runs over conjugacy class representatives outside Z(G).",
      "Each index [G : C_G(gᵢ)] divides |G| = p² and is greater than 1, so each such index is p or p².",
      "If some index is p², then C_G(gᵢ) = {e}, but gᵢ ∈ C_G(gᵢ), contradiction. So every index is p.",
      "Thus |G| = |Z(G)| + kp for some k ≥ 0, so p | |Z(G)|. Since |Z(G)| divides p², we get |Z(G)| ∈ {p, p²}.",
      "If |Z(G)| = p², then G = Z(G) is abelian. If |Z(G)| = p, then G/Z(G) has order p, hence is cyclic.",
      "If G/Z(G) is cyclic, pick g ∈ G \\ Z(G) generating G/Z(G). Then every element of G can be written as gⁿz for some z ∈ Z(G), n ∈ ℤ.",
      "Since z ∈ Z(G) commutes with g, we get gⁿz · gᵐw = gⁿ⁺ᵐzw, so G is abelian.",
      "Since G is abelian of order p², by the structure theorem G ≅ ℤ/p²ℤ, hence G is cyclic. ∎",
    ],
    errorStep: 8,
    errorExplanation:
      "The structure theorem for finitely generated abelian groups gives G ≅ ℤ/p²ℤ or G ≅ ℤ/pℤ × ℤ/pℤ. The proof incorrectly concludes only the cyclic option. In fact ℤ/pℤ × ℤ/pℤ is a valid abelian group of order p² that is not cyclic. The previous steps correctly show G must be abelian, but that does not force G to be cyclic.",
    distractorExplanations: [
      "The error is in step 6: when |Z(G)| = p, the quotient G/Z(G) need not be cyclic because groups of prime order can be non-cyclic in the non-abelian setting",
      "The class equation in step 1 only applies to finite groups whose center is nontrivial, so step 4 is circular in assuming |Z(G)| ≥ p",
      "The error is in step 7: the decomposition gⁿz does not account for the possibility that g has order p rather than p², which would make the representation non-unique",
    ],
  },

  // ── 3. Topology ────────────────────────────────────────────────────────────
  {
    title: "Proof that every connected metric space is path-connected",
    steps: [
      "Let (X, d) be a connected metric space and fix points a, b ∈ X.",
      "For each n ∈ ℕ, cover X by open balls of radius 1/n. By connectedness, no proper clopen set separates a from b.",
      "Construct a finite chain of overlapping balls B(x₀,1/n), B(x₁,1/n), ..., B(xₖ,1/n) from a = x₀ to b = xₖ where consecutive balls intersect.",
      "In each overlap B(xᵢ,1/n) ∩ B(xᵢ₊₁,1/n), pick a point yᵢ. Connect xᵢ → yᵢ → xᵢ₊₁ by straight-line segments within each ball (balls in metric spaces are convex).",
      "This gives a path γₙ from a to b. As n → ∞, the mesh of the chain goes to 0.",
      "The paths γₙ converge uniformly to a continuous path γ: [0,1] → X from a to b.",
      "Therefore X is path-connected. ∎",
    ],
    errorStep: 3,
    errorExplanation:
      "Balls in a general metric space are NOT necessarily convex — convexity of balls is a special property of normed vector spaces (and not even all normed spaces). In a general metric space, there is no notion of 'straight-line segment' between two points within a ball. The topologist's sine curve is a standard example of a connected metric space (as a subspace of ℝ²) that is not path-connected.",
    distractorExplanations: [
      "The error is in step 2: a finite chain of overlapping balls connecting a to b requires compactness, not just connectedness — the proof conflates the two",
      "The error is in step 5: uniform convergence of paths γₙ does not imply the limit γ is continuous unless X is complete",
      "The error is in step 1: the open ball cover need not be countable, so the finite chain construction in step 2 requires the Axiom of Choice and may not produce a well-defined path",
    ],
  },

  // ── 4. Measure Theory ─────────────────────────────────────────────────────
  {
    title: "Proof that the Cantor set has positive Lebesgue measure",
    steps: [
      "Let C be the standard Cantor set, constructed by iteratively removing middle thirds from [0,1].",
      "At stage n, we remove 2ⁿ⁻¹ intervals each of length 3⁻ⁿ, so the total removed at stage n is 2ⁿ⁻¹ · 3⁻ⁿ.",
      "The total measure removed is ∑_{n=1}^{∞} 2ⁿ⁻¹ · 3⁻ⁿ = (1/3) · ∑_{n=0}^{∞} (2/3)ⁿ.",
      "Now ∑_{n=0}^{∞} (2/3)ⁿ = 1/(1 − 2/3) = 3, but this counts overlapping removals: some points near the boundary of previously removed intervals are counted multiple times.",
      "By an inclusion-exclusion correction, the actual measure removed is strictly less than (1/3)·3 = 1.",
      "Therefore λ(C) = 1 − (total removed) > 0. ∎",
    ],
    errorStep: 3,
    errorExplanation:
      "The claim that 'some points near the boundary are counted multiple times' is false. The removed intervals at each stage are pairwise disjoint AND disjoint from all previously removed intervals (each removal takes the middle third of a remaining interval). There is no overlap whatsoever, so no inclusion-exclusion correction is needed. The total removed is exactly (1/3)·3 = 1, giving λ(C) = 0.",
    distractorExplanations: [
      "The geometric series in step 2 is miscalculated: ∑(2/3)ⁿ diverges because 2/3 < 1 is not sufficient for convergence when the partial sums are grouped differently",
      "The error is in step 1: at stage n, we remove 2ⁿ intervals (not 2ⁿ⁻¹), which changes the total to ∑2ⁿ·3⁻ⁿ = ∑(2/3)ⁿ which diverges",
      "The construction of the Cantor set removes open intervals, but the measure calculation should use closed intervals, causing an undercount at each stage",
    ],
  },

  // ── 5. Complex Analysis ────────────────────────────────────────────────────
  {
    title: "Proof that every holomorphic function on ℂ \\ {0} has an antiderivative",
    steps: [
      "Let f be holomorphic on Ω = ℂ \\ {0}.",
      "For any simply connected subdomain U ⊂ Ω, Cauchy's theorem guarantees that ∮_γ f(z) dz = 0 for every closed curve γ in U.",
      "By the Morera-type construction, define F(z) = ∫_{z₀}^{z} f(w) dw along any path in Ω from a fixed basepoint z₀.",
      "To show F is well-defined, note that for two paths γ₁, γ₂ from z₀ to z, the loop γ₁ · γ₂⁻¹ is closed in Ω.",
      "Since Ω is an open subset of ℂ, it is locally simply connected, so the closed loop γ₁ · γ₂⁻¹ can be decomposed into small loops, each contained in a simply connected subdomain of Ω.",
      "By Cauchy's theorem on each small subdomain, each small loop integral is zero, so ∮_{γ₁ · γ₂⁻¹} f = 0.",
      "Therefore ∫_{γ₁} f = ∫_{γ₂} f, so F is well-defined, and F'(z) = f(z). ∎",
    ],
    errorStep: 5,
    errorExplanation:
      "The decomposition of a closed loop into small loops each lying in a simply connected subdomain does NOT imply the total integral is zero when the domain is not simply connected. A loop winding around the origin cannot be contracted to a point in Ω = ℂ \\ {0}, and the small-loop decomposition fails to account for the global topology. The sum of small loop integrals equals the original integral only if the loop is null-homologous, which is not guaranteed in a non-simply-connected domain. The function f(z) = 1/z is the classic counterexample: it is holomorphic on Ω but has no antiderivative there.",
    distractorExplanations: [
      "The error is in step 1: Cauchy's theorem requires f to be holomorphic on a simply connected domain, and even simply connected subdomains of Ω may fail to satisfy the hypotheses if they approach the origin",
      "The error is in step 2: the integral ∫_{z₀}^{z} f(w) dw is not well-defined because f may have essential singularity at 0 and the integral may diverge",
      "The Morera-type construction in step 2 requires f to be bounded near the puncture, which is not assumed",
    ],
  },

  // ── 6. Set Theory / Logic ─────────────────────────────────────────────────
  {
    title: "Proof that the power set of ℕ is countable",
    steps: [
      "Every subset S ⊆ ℕ can be described by its characteristic function χ_S: ℕ → {0,1}.",
      "The characteristic function χ_S is a sequence of 0s and 1s: (χ_S(0), χ_S(1), χ_S(2), ...).",
      "Each such sequence is determined by its finite initial segments. That is, χ_S is the limit of its restrictions χ_S|_{[0,n]}.",
      "For each n, there are exactly 2ⁿ⁺¹ possible restrictions χ_S|_{[0,n]}, each of which is a finite binary string.",
      "The set of all finite binary strings is countable, since it is a countable union ∪_{n≥0} {0,1}ⁿ⁺¹ of finite sets.",
      "Since every characteristic function is determined by its finite approximations, and the set of all finite approximations is countable, the set of all characteristic functions is countable.",
      "Therefore P(ℕ) is countable. ∎",
    ],
    errorStep: 5,
    errorExplanation:
      "The step makes an invalid inference: although each characteristic function is determined by its finite initial segments, the map from the set of all sequences to their approximations is not a bijection into a countable set. Each individual sequence is determined by countably many finite strings, but distinct sequences correspond to distinct elements of {0,1}^ℕ, which is uncountable. The argument conflates 'each element is a limit of countably many finite objects' with 'the set of all limits is countable.' By this logic, every real number is determined by its decimal digits (a finite alphabet), but ℝ is uncountable.",
    distractorExplanations: [
      "The error is in step 3: the number of binary strings of length n+1 is 2^(n+1), and ∑2^(n+1) diverges, so the union is actually uncountable",
      "The error is in step 1: not every subset of ℕ has a characteristic function because the Axiom of Choice is needed to construct one for non-definable sets",
      "The error is in step 2: the restriction χ_S|_{[0,n]} does not determine χ_S uniquely because two different subsets can agree on all finite initial segments",
    ],
  },

  // ── 7. Number Theory ──────────────────────────────────────────────────────
  {
    title: "Proof that there are finitely many primes of the form 4k + 3",
    steps: [
      "Assume there are infinitely many primes of the form 4k + 3. List them as p₁, p₂, p₃, ...",
      "Consider the number N = 4·p₁·p₂·…·pₙ − 1 = 4(p₁p₂…pₙ) − 1.",
      "Observe that N ≡ 3 (mod 4) since 4M − 1 ≡ −1 ≡ 3 (mod 4).",
      "Now N must have a prime factorization. If all prime factors of N were of the form 4k + 1, then their product would also be ≡ 1 (mod 4), contradicting N ≡ 3 (mod 4).",
      "Therefore N has at least one prime factor q of the form 4k + 3.",
      "Since q divides N = 4·p₁·p₂·…·pₙ − 1, we have q | (4·p₁·p₂·…·pₙ − 1). If q = pᵢ for some i, then pᵢ | (4·p₁·p₂·…·pₙ − 1) and pᵢ | 4·p₁·p₂·…·pₙ, so pᵢ | 1, contradiction.",
      "Thus q is a prime of the form 4k + 3 not in our list — but we assumed the list was complete. This contradicts our assumption that the list p₁, …, pₙ exhausts all such primes.",
      "Wait — this actually proves there are infinitely many such primes, contradicting our goal. The resolution is that our initial construction was wrong: N need not be prime itself, and its prime factor q of the form 4k+3 could be 3 itself, which was already counted. So the argument has a gap, and the infinitude is not established.",
      "Therefore there are only finitely many primes of the form 4k + 3. ∎",
    ],
    errorStep: 7,
    errorExplanation:
      "Steps 0–6 constitute a valid proof by contradiction that there are infinitely many primes of the form 4k + 3. Step 7 dishonestly reverses the conclusion by introducing a bogus 'gap': the claim that q could be 3 'which was already counted' is irrelevant because 3 IS one of the pᵢ in our list (if there are only finitely many, 3 would be among them), and step 5 already showed q ≠ pᵢ for any i. The proof was complete and correct at step 6; step 7 fabricates a nonexistent flaw to negate the valid conclusion.",
    distractorExplanations: [
      "The error is actually in step 3: a product of primes all ≡ 1 (mod 4) can be ≡ 3 (mod 4) if an odd number of them satisfy additional congruence conditions modulo 8",
      "The error is in step 1: the number N = 4·p₁·…·pₙ − 1 could be negative if the product overflows, making the modular arithmetic invalid",
      "The error is in step 5: the conclusion q | 1 requires that gcd(q, 4) = 1, which is not verified — if q = 2, the argument fails",
    ],
  },

  // ── 8. Linear Algebra ──────────────────────────────────────────────────────
  {
    title: "Proof that every linear operator on an infinite-dimensional Hilbert space has an eigenvalue",
    steps: [
      "Let T: H → H be a bounded linear operator on an infinite-dimensional Hilbert space H.",
      "Consider the spectrum σ(T) = {λ ∈ ℂ : T − λI is not invertible}. The spectrum is nonempty and compact.",
      "For each λ ∈ σ(T), the operator T − λI fails to be invertible. This means ker(T − λI) ≠ {0} or the range of T − λI is not all of H.",
      "If ker(T − λI) ≠ {0}, then λ is an eigenvalue. So suppose ker(T − λI) = {0} for all λ ∈ σ(T).",
      "Then T − λI is injective for every λ ∈ σ(T), so the failure of invertibility must come from the range not being closed or not being dense.",
      "But by the open mapping theorem, an injective bounded operator with closed range has a bounded inverse on its range. If the range were also dense, it would be all of H, making T − λI invertible.",
      "So for every λ ∈ σ(T), the range of T − λI is either not closed or not dense. In either case, there exist vectors vₙ with ‖vₙ‖ = 1 and ‖(T − λI)vₙ‖ → 0.",
      "This means (T − λI)vₙ → 0. Since H is a Hilbert space, the unit ball is weakly compact, so vₙ has a weakly convergent subsequence vₙₖ ⇀ v.",
      "Then (T − λI)vₙₖ → 0 strongly and vₙₖ ⇀ v weakly, so (T − λI)v = 0 weakly, hence strongly, so Tv = λv.",
      "Since ‖vₙₖ‖ = 1 and vₙₖ ⇀ v, we have v ≠ 0, so λ is an eigenvalue. ∎",
    ],
    errorStep: 8,
    errorExplanation:
      "The conclusion (T − λI)v = 0 from (T − λI)vₙₖ → 0 strongly and vₙₖ ⇀ v weakly is invalid. We can only conclude (T − λI)v = 0 if T − λI maps weakly convergent sequences to strongly convergent ones (i.e., T is compact). For a general bounded operator, Tvₙₖ need not converge to Tv even weakly in a useful sense. Moreover, weak convergence does not preserve norm: ‖v‖ ≤ lim inf ‖vₙₖ‖ = 1, so v could be 0. The right shift on ℓ² is a standard counterexample: it has no eigenvalues despite having nonempty spectrum.",
    distractorExplanations: [
      "The error is in step 1: the spectrum of a bounded operator on an infinite-dimensional space can be empty if the space is not separable",
      "The error is in step 6: the approximate eigenvalue sequence only exists when the range is not dense, not when the range is merely not closed",
      "The error is in step 5: the open mapping theorem requires surjectivity, not just injectivity with closed range, so the reasoning about invertibility is circular",
    ],
  },

  // ── 9. Differential Equations ──────────────────────────────────────────────
  {
    title: "Proof that every continuous ODE has a unique global solution",
    steps: [
      "Consider the ODE y'(t) = f(t, y(t)) with y(t₀) = y₀, where f is continuous on ℝ × ℝ.",
      "By the Peano existence theorem, a local solution y(t) exists on some interval [t₀ − δ, t₀ + δ].",
      "Suppose the maximal interval of existence is (α, β) with β < ∞. Then we show this leads to a contradiction.",
      "As t → β⁻, consider the net {y(t)}. If |y(t)| remains bounded as t → β⁻, say |y(t)| ≤ M, then |y'(t)| = |f(t,y(t))| ≤ max|f| on [t₀, β] × [−M, M], which is finite by continuity on a compact set.",
      "So y is Lipschitz on (α, β), hence uniformly continuous, so lim_{t→β⁻} y(t) = L exists.",
      "We can then solve the IVP y' = f(t,y), y(β) = L to extend the solution past β, contradicting maximality.",
      "If |y(t)| → ∞ as t → β⁻, then the solution blows up. But f is continuous (hence locally bounded), so |y'| ≤ C(1 + |y|) by a linear growth estimate that holds for all continuous functions.",
      "By Grönwall's inequality, |y(t)| ≤ (|y₀| + C)e^{C(t−t₀)} − C, which is finite for finite t. So |y(t)| cannot blow up in finite time.",
      "Therefore β = ∞ (and similarly α = −∞), giving a global solution. Uniqueness follows from the same Lipschitz-type bound. ∎",
    ],
    errorStep: 6,
    errorExplanation:
      "The claim that every continuous function satisfies a linear growth bound |f(t,y)| ≤ C(1 + |y|) is false. Continuity does not imply linear growth. For example, f(t,y) = y² is continuous but grows quadratically. The ODE y' = y² with y(0) = 1 has the solution y(t) = 1/(1−t), which blows up at t = 1. The linear growth condition is an additional hypothesis (not a consequence of continuity) needed for global existence. Without it, finite-time blowup is possible.",
    distractorExplanations: [
      "The Peano theorem in step 1 requires f to be locally Lipschitz, not just continuous, so the initial existence claim is wrong",
      "The error is in step 4: a Lipschitz function on an open interval need not be uniformly continuous, so the limit L may not exist",
      "Grönwall's inequality in step 7 requires the bound to hold with a constant C independent of the solution, but C depends on y in a circular way",
    ],
  },

  // ── 10. Functional Analysis ────────────────────────────────────────────────
  {
    title: "Proof that every closed subspace of a Banach space is complemented",
    steps: [
      "Let X be a Banach space and Y ⊂ X a closed subspace.",
      "Consider the quotient space X/Y with the quotient norm. Since Y is closed, X/Y is a Banach space.",
      "The quotient map π: X → X/Y is a bounded surjection. By the open mapping theorem, π is an open map.",
      "For each coset x + Y ∈ X/Y, choose a representative r(x + Y) ∈ x + Y with ‖r(x + Y)‖ ≤ 2‖x + Y‖_{X/Y} (possible by the infimum definition of the quotient norm).",
      "This defines a map r: X/Y → X that is a right inverse of π: π ∘ r = id_{X/Y}.",
      "Since ‖r(x + Y)‖ ≤ 2‖x + Y‖, the map r is bounded (with ‖r‖ ≤ 2).",
      "But r is also linear: for cosets [x] and [y] in X/Y and scalar α, r(α[x] + [y]) = αr([x]) + r([y]) because the choice of minimal-norm representative respects linear operations.",
      "Then Z = r(X/Y) is a closed subspace of X with X = Y ⊕ Z. ∎",
    ],
    errorStep: 6,
    errorExplanation:
      "The map r is NOT linear. Choosing a near-minimal-norm representative in each coset does not produce a linear map. There is no reason that the representative of α[x] + [y] should equal α·r([x]) + r([y]) — the near-minimal-norm elements in distinct cosets are chosen independently. Constructing a bounded linear right inverse (a bounded linear projection) is equivalent to complementing Y, which is not always possible: Lindenstrauss showed that c₀ is a closed non-complemented subspace of ℓ^∞, and Phillips proved L^∞/c₀ provides a counterexample.",
    distractorExplanations: [
      "The error is in step 3: the factor of 2 in the norm bound should be 1 + ε, and taking the limit ε → 0 is needed to make the construction work",
      "The open mapping theorem in step 2 requires both spaces to be Banach, but X/Y might not be complete when Y is merely closed, not complemented",
      "The error is in step 7: Z = r(X/Y) is not necessarily closed because r is not a bounded operator from a complete space",
    ],
  },

  // ── 11. Category Theory ────────────────────────────────────────────────────
  {
    title: "Proof that every epimorphism in the category of groups is surjective",
    steps: [
      "Let f: G → H be an epimorphism in Grp, meaning for all group homomorphisms g,h: H → K, if g ∘ f = h ∘ f then g = h.",
      "Suppose f is not surjective, so f(G) is a proper subgroup of H.",
      "Consider the set of left cosets H/f(G) = {aF : a ∈ H} where F = f(G).",
      "Define two functions g, h: H → S(H/f(G)) (the symmetric group on cosets) by g(x)(aF) = xaF and h(x)(aF) = aF.",
      "Both g and h are group homomorphisms: g is the left-regular representation on cosets, and h is the trivial homomorphism.",
      "For any x ∈ f(G), g(x)(aF) = xaF = aF since x ∈ F and cosets absorb F. So g(x) = h(x) for all x ∈ f(G).",
      "But g ≠ h since for x ∉ f(G), g(x)(eF) = xF ≠ eF = h(x)(eF).",
      "Thus g ∘ f = h ∘ f but g ≠ h, contradicting that f is an epimorphism. So f must be surjective. ∎",
    ],
    errorStep: 5,
    errorExplanation:
      "The step claims that for x ∈ f(G) = F, we have xaF = aF. But left cosets satisfy xaF = aF if and only if a⁻¹xa ∈ F, i.e., x ∈ aFa⁻¹. This holds for all a only when F is normal in H. If f(G) is not a normal subgroup, then xaF ≠ aF for some a even when x ∈ F. However, in the actual (correct) proof of this theorem, one uses a different construction (e.g., coset representations in the permutation group on right cosets, or a more careful pair of homomorphisms) that does work. The proof as stated has a flaw in this step, yet the theorem itself is actually true — epimorphisms in Grp are indeed surjective. The error is a proof error, not a theorem error.",
    distractorExplanations: [
      "The error is that S(H/f(G)) is not a group when f(G) is not normal, since H/f(G) is not well-defined as a quotient group",
      "The trivial homomorphism h is not well-defined because the target S(H/f(G)) may be infinite and the homomorphism needs a finite presentation",
      "The error is in step 6: for x ∉ f(G), it's possible that xF = eF if x has finite order and some power lies in F",
    ],
  },

  // ── 12. Algebraic Geometry ─────────────────────────────────────────────────
  {
    title: "Proof that every bijective morphism of algebraic varieties is an isomorphism",
    steps: [
      "Let φ: X → Y be a bijective morphism of algebraic varieties over an algebraically closed field k.",
      "Since φ is a morphism, the pullback φ*: k[Y] → k[X] is a ring homomorphism of coordinate rings.",
      "Since φ is bijective on points, for each maximal ideal m ⊂ k[Y], there is a unique maximal ideal n ⊂ k[X] with (φ*)⁻¹(n) = m.",
      "This means φ* induces a bijection on maximal spectra: Specm(k[X]) → Specm(k[Y]).",
      "A ring homomorphism that induces a bijection on maximal spectra and is injective (by surjectivity of φ on points) is an isomorphism by the Nullstellensatz correspondence.",
      "Therefore φ* is an isomorphism, so φ is an isomorphism of varieties. ∎",
    ],
    errorStep: 4,
    errorExplanation:
      "A bijection on maximal spectra does NOT imply the ring homomorphism is an isomorphism, even with the Nullstellensatz. The pullback φ* being injective (from φ surjective and dominant) means k[Y] embeds into k[X], but φ* need not be surjective. The standard counterexample is the normalization map: φ: A¹ → C where C is a cuspidal cubic y² = x³, given by t ↦ (t², t³). This is bijective on points but φ*: k[x,y]/(y²−x³) → k[t] sends x ↦ t², y ↦ t³, which is not surjective (t is not in the image). The inverse is not a morphism.",
    distractorExplanations: [
      "The error is in step 2: pullbacks of ring homomorphisms do not preserve maximal ideals in general, only prime ideals, so the map on Specm is not well-defined",
      "The error is in step 1: for the pullback to be well-defined, φ must be a dominant morphism, which is stronger than bijectivity",
      "The Nullstellensatz only applies to finitely generated k-algebras over algebraically closed fields, and k[X] may not be finitely generated if X is not affine",
    ],
  },

  // ── 13. Combinatorics ──────────────────────────────────────────────────────
  {
    title: "Proof that the chromatic number of any planar graph is at most 3",
    steps: [
      "We prove by strong induction on |V(G)| that every planar graph G is 3-colorable.",
      "Base case: any graph with ≤ 3 vertices is clearly 3-colorable.",
      "Inductive step: let G be a planar graph with n > 3 vertices. By Euler's formula, G has a vertex v of degree ≤ 5.",
      "Remove v to get G' = G − v, which is planar with n − 1 vertices. By induction, G' is 3-colorable with colors {1,2,3}.",
      "If deg(v) ≤ 2, then at most 2 colors appear among v's neighbors, so a third color is available for v.",
      "If deg(v) = 3, 4, or 5, then v has at most 5 neighbors. By the pigeonhole principle, among the (at most 5) neighbors, at most 3 distinct colors appear. Since we have 3 colors, it's possible that all 3 are used.",
      "However, when all 3 colors appear among v's neighbors, we can perform a Kempe chain argument: consider the subgraph of G' induced by vertices colored 1 or 2. If two neighbors of v colored 1 and 2 are in different connected components of this subgraph, swap colors 1 and 2 in one component to free up a color for v.",
      "If they are in the same component, repeat with colors 1 and 3, or 2 and 3. At least one pair must be in different components since v has at most 5 neighbors.",
      "So v can always be colored, completing the induction. ∎",
    ],
    errorStep: 7,
    errorExplanation:
      "The claim that 'at least one pair must be in different components since v has at most 5 neighbors' is false. This is precisely where Kempe's original (flawed) proof of the Four Color Theorem fails — when v has degree 5, it is possible that for every pair of colors, the two relevant neighbors are connected by a Kempe chain, and these chains can interlock in a way that prevents any swap from freeing a color. Heawood found the counterexample to Kempe's argument in 1890. The correct result is the Five Color Theorem (degree ≤ 5 suffices for 5 colors) or the Four Color Theorem (which requires a much more sophisticated proof).",
    distractorExplanations: [
      "The error is in step 2: Euler's formula guarantees a vertex of degree ≤ 5 only for 3-connected planar graphs, not all planar graphs",
      "The error is in step 6: the Kempe chain argument requires the graph to be triangulated, which is not assumed",
      "The error is in step 4: removing a vertex can disconnect the graph, and the inductive hypothesis only applies to connected graphs",
    ],
  },

  // ── 14. Probability Theory ─────────────────────────────────────────────────
  {
    title: "Proof that the strong law of large numbers holds without finite variance",
    steps: [
      "Let X₁, X₂, ... be i.i.d. random variables with E[X₁] = μ (finite mean, no assumption on variance).",
      "Define Sₙ = X₁ + ... + Xₙ and the sample mean X̄ₙ = Sₙ/n.",
      "By the weak law of large numbers, X̄ₙ → μ in probability.",
      "Convergence in probability implies there exists a subsequence X̄_{nₖ} → μ almost surely.",
      "For indices between nₖ and nₖ₊₁, we have |X̄ₙ − X̄_{nₖ}| = |Sₙ − Sₙₖ|/n − Sₙₖ(1/n − 1/nₖ).",
      "Since E[|Xᵢ|] < ∞, by the triangle inequality the increments satisfy E[|Sₙ − Sₙₖ|] ≤ (n − nₖ)|μ| + (n − nₖ)E[|X₁ − μ|].",
      "Choosing nₖ = k², the gap nₖ₊₁ − nₖ = 2k + 1 = o(nₖ), so |X̄ₙ − X̄_{nₖ}| → 0 a.s. by Borel-Cantelli.",
      "Since X̄_{nₖ} → μ a.s. and |X̄ₙ − X̄_{nₖ}| → 0 a.s., we get X̄ₙ → μ a.s. ∎",
    ],
    errorStep: 6,
    errorExplanation:
      "The application of Borel-Cantelli to conclude |X̄ₙ − X̄_{nₖ}| → 0 a.s. is not justified as stated. To use Borel-Cantelli (first lemma), one needs ∑P(|X̄ₙ − X̄_{nₖ}| > ε) < ∞, which requires tail bounds that typically need finite variance (or at least more than just finite mean). The proof is essentially trying to recreate the Etemadi or truncation proof of the SLLN but skips the crucial truncation step that makes it work. The actual SLLN does hold with only finite mean (by Etemadi's theorem), but the proof requires a careful truncation argument, not the naive Borel-Cantelli application given here.",
    distractorExplanations: [
      "The weak law in step 2 itself requires finite variance, so the entire argument fails at the very first step",
      "The error is in step 3: convergence in probability does NOT imply the existence of an a.s. convergent subsequence — this requires uniform integrability",
      "The error is in step 4: the bound on E[|Sₙ − Sₙₖ|] should use Markov's inequality, not the triangle inequality, and Markov's inequality gives a weaker bound",
    ],
  },

  // ── 15. Real Analysis (Interchange of Limits) ─────────────────────────────
  {
    title: "Proof that the derivative of a pointwise limit of differentiable functions equals the pointwise limit of derivatives",
    steps: [
      "Let fₙ: [a,b] → ℝ be differentiable for each n, with fₙ(x) → f(x) pointwise for all x ∈ [a,b].",
      "Also assume fₙ'(x) → g(x) pointwise for all x ∈ [a,b].",
      "By the mean value theorem, for each n and any x, h: fₙ(x+h) − fₙ(x) = fₙ'(cₙ)·h for some cₙ between x and x+h.",
      "Taking n → ∞ on both sides: f(x+h) − f(x) = lim fₙ'(cₙ) · h.",
      "Now cₙ ∈ (x, x+h) for each n, and since fₙ'(cₙ) → g(cₙ) pointwise and cₙ → c for some subsequence (by Bolzano-Weierstrass in the compact interval [x, x+h]):",
      "lim fₙ'(cₙ) = g(c) where c ∈ [x, x+h].",
      "So f(x+h) − f(x) = g(c)·h, and dividing by h and letting h → 0 (forcing c → x): f'(x) = g(x). ∎",
    ],
    errorStep: 5,
    errorExplanation:
      "The step claims lim fₙ'(cₙ) = g(c). This requires that if cₙ → c and fₙ' → g pointwise, then fₙ'(cₙ) → g(c). But this is FALSE for merely pointwise convergence — it would require uniform convergence of fₙ' (or at least equicontinuity). The values cₙ depend on n, so even though fₙ'(c) → g(c) for each fixed c, the 'moving target' fₙ'(cₙ) can converge to something else entirely. The correct theorem requires uniform convergence of fₙ'.",
    distractorExplanations: [
      "The mean value theorem in step 2 requires fₙ to be continuous on [x, x+h] and differentiable on (x, x+h), but pointwise convergence could destroy continuity",
      "The error is in step 3: taking n → ∞ on both sides of an equation requires uniform convergence of fₙ, not just pointwise convergence",
      "The error is in step 6: dividing by h and taking h → 0 requires g to be continuous at x, which is not assumed",
    ],
  },

  // ── 16. Abstract Algebra (Ring Theory) ─────────────────────────────────────
  {
    title: "Proof that every prime ideal in a commutative ring is maximal",
    steps: [
      "Let R be a commutative ring with unity and P ⊂ R a prime ideal.",
      "Consider the quotient ring R/P. Since P is prime, R/P is an integral domain.",
      "Let [a] be a nonzero element of R/P. We show [a] is invertible.",
      "Consider the principal ideal ([a]) in R/P. Since R/P is a domain and [a] ≠ 0, the map x ↦ [a]x is injective on R/P.",
      "An injective endomorphism of a module is surjective when the module is Noetherian. R/P is a ring, hence a module over itself.",
      "Therefore the map x ↦ [a]x is surjective, so there exists [b] ∈ R/P with [a][b] = [1].",
      "Thus every nonzero element of R/P is invertible, making R/P a field, so P is maximal. ∎",
    ],
    errorStep: 4,
    errorExplanation:
      "The claim that R/P is Noetherian is not justified. We are given no hypothesis that R is Noetherian. For a general commutative ring R, the quotient R/P by a prime ideal can be a non-Noetherian integral domain. An injective endomorphism of a non-Noetherian module need not be surjective. For example, in Z[x₁,x₂,...] (polynomials in infinitely many variables), the ideal (x₁,x₂,...) is prime but not maximal: the quotient is isomorphic to Z, and Z is not a field. More directly, in any integral domain that is not a field, (0) is prime but not maximal.",
    distractorExplanations: [
      "The error is in step 1: the quotient R/P is an integral domain only when P is maximal, not merely prime — this is a circular argument",
      "The map x ↦ [a]x is not necessarily injective in step 3 because R/P could have zero divisors if P is not prime in the quotient",
      "The error is in step 5: surjectivity gives [a][b] = [1] only in the quotient, but lifting back to R introduces elements of P that spoil the inverse",
    ],
  },

  // ── 17. Topology (Compactness) ─────────────────────────────────────────────
  {
    title: "Proof that every sequentially compact topological space is compact",
    steps: [
      "Let X be a sequentially compact topological space (every sequence has a convergent subsequence).",
      "Let {Uα} be an open cover of X. Suppose no finite subcover exists.",
      "Claim: there exists ε > 0 such that no single Uα contains a ball of radius ε (Lebesgue number argument).",
      "For each n, since {U₁,...,Uₙ} is not a cover, pick xₙ ∈ X \\ (U₁ ∪ ... ∪ Uₙ).",
      "By sequential compactness, {xₙ} has a convergent subsequence xₙₖ → x.",
      "Since {Uα} covers X, there is some Uβ with x ∈ Uβ. Since Uβ is open, xₙₖ ∈ Uβ for all large k.",
      "But xₙₖ ∉ U₁ ∪ ... ∪ Uₙₖ by construction. If β is some index in our enumeration, say β = Uⱼ, then xₙₖ ∉ Uⱼ for nₖ ≥ j, contradicting xₙₖ ∈ Uβ for large k.",
      "This contradiction shows a finite subcover must exist, so X is compact. ∎",
    ],
    errorStep: 2,
    errorExplanation:
      "The Lebesgue number argument (step 2) and the use of 'radius ε' assume that X is a metric space. In a general topological space, there is no metric, no balls, and no Lebesgue number. Moreover, the 'proof' in steps 3–7 assumes the open cover is countable (indexed as U₁, U₂, ...), which need not hold in a general topological space. Sequential compactness implies compactness for metrizable spaces but NOT for general topological spaces. The ordinal space [0, ω₁] is sequentially compact but not compact.",
    distractorExplanations: [
      "The error is in step 4: sequential compactness only guarantees a convergent subsequence in metric spaces, not in general topological spaces where sequences are insufficient to capture the topology",
      "The error is in step 6: the index β might not appear in any enumeration of the cover since the cover is uncountable, but this can be fixed by well-ordering the cover",
      "The error is in step 3: the points xₙ may all coincide if X \\ (U₁ ∪ ... ∪ Uₙ) is a single point for large n, making the subsequence trivially convergent to a point already covered",
    ],
  },

  // ── 18. Measure Theory (Fubini) ────────────────────────────────────────────
  {
    title: "Proof that iterated integrals always commute for measurable functions",
    steps: [
      "Let f: ℝ² → ℝ be Lebesgue measurable.",
      "By Fubini's theorem, for measurable functions on product σ-algebras, the iterated integrals equal the double integral when it exists.",
      "Compute the double integral: ∬ f(x,y) d(x,y) = ∫(∫ f(x,y) dy) dx.",
      "By the same token, ∬ f(x,y) d(x,y) = ∫(∫ f(x,y) dx) dy.",
      "Equating: ∫(∫ f(x,y) dy) dx = ∫(∫ f(x,y) dx) dy.",
      "Since f was an arbitrary measurable function, iterated integrals always commute for measurable functions. ∎",
    ],
    errorStep: 1,
    errorExplanation:
      "Fubini's theorem requires that f be integrable (∬|f| < ∞), not merely measurable. For measurable functions that are not integrable, iterated integrals can exist but be unequal. The classic counterexample is f(x,y) = (x² − y²)/(x² + y²)² on (0,1)², where ∫∫ f dy dx = π/4 but ∫∫ f dx dy = −π/4. Without the integrability condition, the conclusion fails.",
    distractorExplanations: [
      "The error is that Fubini's theorem only applies to continuous functions, not all measurable functions",
      "The error is in step 2: the double integral ∬f d(x,y) may not equal either iterated integral even when f is integrable, because the product measure may not be σ-finite",
      "The theorem requires f to be bounded, not just integrable, because unbounded measurable functions are not Lebesgue integrable by definition",
    ],
  },

  // ── 19. Complex Analysis (Analytic Continuation) ──────────────────────────
  {
    title: "Proof that the Riemann zeta function has no zeros in the critical strip 0 < Re(s) < 1",
    steps: [
      "Recall ζ(s) = ∑ n⁻ˢ for Re(s) > 1, extended by analytic continuation to ℂ \\ {1}.",
      "The functional equation ζ(s) = 2ˢπˢ⁻¹ sin(πs/2) Γ(1−s) ζ(1−s) relates ζ(s) to ζ(1−s).",
      "Suppose ζ(s₀) = 0 for some s₀ with 0 < Re(s₀) < 1. Then by the functional equation, 0 = 2^{s₀} π^{s₀−1} sin(πs₀/2) Γ(1−s₀) ζ(1−s₀).",
      "Since 2^{s₀} ≠ 0, π^{s₀−1} ≠ 0, and Γ(1−s₀) ≠ 0 (the Gamma function has no zeros), we need sin(πs₀/2) = 0 or ζ(1−s₀) = 0.",
      "sin(πs₀/2) = 0 when s₀ = 2k for integer k. But 0 < Re(s₀) < 1 excludes all even integers. So sin(πs₀/2) ≠ 0 in the critical strip.",
      "Therefore ζ(1−s₀) = 0. Since 0 < Re(s₀) < 1, we have 0 < Re(1−s₀) < 1, so 1−s₀ is also in the critical strip.",
      "This means zeros come in pairs: s₀ and 1−s₀. Now the pair {s₀, 1−s₀} maps to the pair {1−s₀, s₀} under the symmetry s ↦ 1−s, creating an infinite regress of zeros... no, it's the same pair.",
      "The key insight: ζ(s₀) = 0 forces ζ(1−s₀) = 0 (from step 5). But applying the functional equation to ζ(1−s₀) = 0 gives back ζ(s₀) = 0 — consistent, not contradictory. So the functional equation alone cannot produce a contradiction.",
      "However, combine with the Euler product: for Re(s) > 1, ζ(s) = ∏(1 − p⁻ˢ)⁻¹ ≠ 0. So ζ has no zeros for Re(s) > 1. By the functional equation, ζ has no zeros for Re(s) < 0 except trivial zeros at s = −2, −4, .... Since there are no zeros for Re(s) > 1 or Re(s) < 0, there are no zeros in 0 < Re(s) < 1. ∎",
    ],
    errorStep: 8,
    errorExplanation:
      "The conclusion 'since there are no zeros for Re(s) > 1 or Re(s) < 0, there are no zeros in 0 < Re(s) < 1' is a blatant non sequitur. The absence of zeros outside the critical strip says nothing about zeros inside it. The functional equation maps s to 1−s, which maps the critical strip to itself, so the Euler-product argument (which only works for Re(s) > 1) cannot reach into the critical strip. In fact, ζ has infinitely many zeros in the critical strip — Hardy proved infinitely many lie on the critical line Re(s) = 1/2, and computational verification has found over 10 trillion zeros there. The Riemann Hypothesis (that ALL zeros are on Re(s) = 1/2) remains unproven.",
    distractorExplanations: [
      "The functional equation in step 1 is stated incorrectly — the correct form involves ξ(s) = π^{−s/2}Γ(s/2)ζ(s), not the asymmetric form given",
      "The error is in step 4: sin(πs₀/2) can be zero for complex s₀ even when Re(s₀) is not an even integer, because sin is entire and has complex zeros",
      "The Gamma function Γ(1−s₀) has poles at s₀ = 1, 2, 3, ..., and the pole at s₀ = 1 lies near the critical strip boundary, invalidating step 3",
    ],
  },

  // ── 20. Set Theory (Axiom of Choice) ──────────────────────────────────────
  {
    title: "Proof that every vector space has a unique basis (up to cardinality)",
    steps: [
      "Let V be a vector space over a field F. By the Axiom of Choice (via Zorn's lemma), V has a basis B.",
      "Let B' be another basis of V. We show |B| = |B'|.",
      "If B is finite, say |B| = n, then standard linear algebra shows every basis has n elements.",
      "If B is infinite, consider the map φ: B' → P_fin(B) sending each b' ∈ B' to the finite set of basis elements in B needed to express b'.",
      "Since B' is a basis, every b ∈ B is in the span of B', so b = ∑ cᵢb'ᵢ for finitely many b'ᵢ. Each b'ᵢ maps under φ to a finite subset of B containing b. Thus b ∈ ∪{φ(b'ᵢ)}.",
      "This means B ⊆ ∪_{b'∈B'} φ(b'), so |B| ≤ |B'| · ℵ₀ = |B'| (since B' is infinite).",
      "By symmetry, |B'| ≤ |B|, so |B| = |B'|. This dimension is unique.",
      "Moreover, the basis B is unique because any two maximal linearly independent sets in V must contain exactly the same vectors. ∎",
    ],
    errorStep: 7,
    errorExplanation:
      "The final step claims the basis itself is unique (not just its cardinality). This is false — a vector space generally has many distinct bases (e.g., ℝ² has bases {e₁,e₂}, {e₁+e₂, e₁−e₂}, etc.). The proof correctly shows the cardinality (dimension) is unique (steps 0–6 are the standard Steinitz replacement argument for infinite dimensions), but then makes the false leap that the actual set of vectors is unique. Two maximal linearly independent sets can be completely different sets.",
    distractorExplanations: [
      "The error is in step 3: the map φ is not well-defined because the representation of b' in terms of B is not unique when B is infinite",
      "The inequality in step 5 requires the Generalized Continuum Hypothesis, not just the Axiom of Choice",
      "The error is in step 0: Zorn's lemma guarantees existence of a maximal linearly independent set, but such a set need not span V, so it's not necessarily a basis",
    ],
  },

  // ── 21. Real Analysis (Uniform Convergence) ───────────────────────────────
  {
    title: "Proof that the pointwise limit of continuous functions is continuous",
    steps: [
      "Let fₙ: [a,b] → ℝ be continuous for each n, with fₙ(x) → f(x) pointwise for all x ∈ [a,b].",
      "Fix x₀ ∈ [a,b] and ε > 0. We show f is continuous at x₀.",
      "Since fₙ → f pointwise, there exists N such that |fₙ(x₀) − f(x₀)| < ε/3.",
      "Since fₙ is continuous at x₀, there exists δ > 0 such that |x − x₀| < δ implies |fₙ(x) − fₙ(x₀)| < ε/3.",
      "Also, since fₙ(x) → f(x) for each fixed x, for the same N: |fₙ(x) − f(x)| < ε/3 for all x with |x − x₀| < δ.",
      "By the triangle inequality: |f(x) − f(x₀)| ≤ |f(x) − fₙ(x)| + |fₙ(x) − fₙ(x₀)| + |fₙ(x₀) − f(x₀)| < ε/3 + ε/3 + ε/3 = ε.",
      "Therefore f is continuous at x₀. Since x₀ was arbitrary, f is continuous on [a,b]. ∎",
    ],
    errorStep: 4,
    errorExplanation:
      "Step 4 claims that for the N chosen in step 2 (which depends only on x₀), we also have |fₙ(x) − f(x)| < ε/3 for all x near x₀. But this N was chosen to work at x₀ specifically. For a different point x, the convergence fₙ(x) → f(x) may require a much larger N. The N that works at x₀ need not work at nearby points — this is exactly the distinction between pointwise and uniform convergence. The correct version of this theorem requires uniform convergence. The Baire category theorem shows that the pointwise limit of continuous functions IS continuous on a dense Gδ set, but not necessarily everywhere: the characteristic function of the rationals is a pointwise limit of continuous functions (via an enumeration construction) but is nowhere continuous.",
    distractorExplanations: [
      "The error is in step 3: the δ depends on N and hence on ε, creating a circular dependence that invalidates the triangle inequality argument",
      "The triangle inequality in step 5 requires all three functions f, fₙ to be defined at the same points, which fails if fₙ has different domains",
      "The error is in step 2: pointwise convergence at x₀ gives |fₙ(x₀) − f(x₀)| < ε/3 for all n ≥ N, but the proof needs it for a single n = N, which is a weaker statement that still holds",
    ],
  },

  // ── 22. Abstract Algebra (Galois Theory) ──────────────────────────────────
  {
    title: "Proof that the general quintic equation is solvable by radicals",
    steps: [
      "Consider the general quintic x⁵ + a₄x⁴ + a₃x³ + a₂x² + a₁x + a₀ = 0 over ℚ(a₀,...,a₄).",
      "By the Tschirnhaus transformation, we can reduce to the Bring-Jerrard form x⁵ + px + q = 0.",
      "The Galois group of x⁵ + px + q over ℚ(p,q) is a subgroup of S₅.",
      "Consider the resolvent cubic of the quintic, obtained by eliminating variables from the system of elementary symmetric polynomials.",
      "The resolvent cubic has Galois group that is a quotient of Gal(x⁵+px+q). If the resolvent cubic is solvable by radicals, its Galois group is solvable.",
      "Since S₃ is solvable (composition series S₃ ⊃ A₃ ⊃ {e} with abelian quotients), the resolvent cubic is always solvable by radicals.",
      "The roots of the quintic can be expressed in terms of the roots of the resolvent cubic plus solutions to auxiliary equations of degree ≤ 2 (which are always solvable).",
      "Since the resolvent cubic and auxiliary quadratics are all solvable by radicals, the quintic is solvable by radicals. ∎",
    ],
    errorStep: 6,
    errorExplanation:
      "The claim that 'the roots of the quintic can be expressed in terms of roots of the resolvent cubic plus auxiliary equations of degree ≤ 2' is false for the general quintic. This method works for the quartic (where the resolvent cubic fully reduces the problem) but NOT for the quintic. Solving the resolvent does not reduce the quintic to lower-degree solvable equations. The Galois group of the general quintic is S₅, which is not solvable (the composition series has A₅ as a simple non-abelian quotient). No tower of radical extensions can capture S₅. Abel and Galois proved this impossibility.",
    distractorExplanations: [
      "The Tschirnhaus transformation in step 1 requires extracting roots, which is circular — it assumes solvability by radicals to achieve the Bring-Jerrard form",
      "The resolvent cubic in step 3 does not exist for quintics — resolvent equations only work for polynomials of degree ≤ 4",
      "The error is in step 2: the Galois group of x⁵ + px + q is always A₅ (not a subgroup of S₅), and A₅ is solvable as a simple group",
    ],
  },

  // ── 23. Topology (Fundamental Group) ───────────────────────────────────────
  {
    title: "Proof that the fundamental group of the Klein bottle is abelian",
    steps: [
      "The Klein bottle K can be presented as a CW-complex with one 0-cell, two 1-cells a, b, and one 2-cell attached via the word abab⁻¹.",
      "By the Seifert-van Kampen theorem applied to this CW structure, π₁(K) = ⟨a, b | abab⁻¹⟩.",
      "Rewrite the relation: abab⁻¹ = 1 implies ab = ba (multiply both sides on the right by b).",
      "Wait — let's be more careful. abab⁻¹ = 1 ⟹ aba = b.",
      "From aba = b, we get ab = ba⁻¹... no. Let's redo: aba = b ⟹ ab = ba⁻¹... no, from aba = b, right-multiply by a⁻¹: ab = ba⁻¹.",
      "So ab = ba⁻¹. Now consider: a(ba⁻¹) = (ab)a⁻¹ = (ba⁻¹)a⁻¹ = ba⁻². And (ab)a⁻¹ = ba⁻², confirming consistency.",
      "But ab = ba⁻¹ means ab = b·a⁻¹, which rearranges to aba⁻¹ = ba⁻², hmm. Actually from ab = ba⁻¹, we get a = ba⁻¹b⁻¹, so a commutes with b if a = a⁻¹, i.e., a² = 1.",
      "From aba = b: substitute a² = 1, so a = a⁻¹, giving a⁻¹ba = b... wait, let's use ab = ba⁻¹ and a² = 1. Then ab = ba, so a and b commute.",
      "Therefore π₁(K) is abelian. ∎",
    ],
    errorStep: 6,
    errorExplanation:
      "The step incorrectly derives a² = 1. From ab = ba⁻¹ one can deduce a = ba⁻¹b⁻¹, but this does NOT imply a² = 1 — it only tells us that conjugation of a by b gives a⁻¹ (i.e., bab⁻¹ = a⁻¹). The relation a² = 1 is an additional claim with no justification. In fact, π₁(K) = ⟨a, b | bab⁻¹ = a⁻¹⟩ is a non-abelian group (it is a semidirect product ℤ ⋊ ℤ where the action is negation). For example, ab ≠ ba since ab = ba⁻¹ and a ≠ a⁻¹ (a has infinite order).",
    distractorExplanations: [
      "The CW-structure in step 0 is wrong: the Klein bottle's attaching word is aba⁻¹b, not abab⁻¹",
      "The error is in step 1: Seifert-van Kampen cannot be applied to CW complexes with a single 0-cell because the space is not a union of two open path-connected sets",
      "The relation abab⁻¹ = 1 has multiple interpretations depending on the basepoint, and the fundamental group depends on this choice",
    ],
  },

  // ── 24. Measure Theory (Vitali) ────────────────────────────────────────────
  {
    title: "Proof that every subset of ℝ is Lebesgue measurable",
    steps: [
      "Let A ⊆ ℝ. Define the outer measure λ*(A) = inf{∑ℓ(Iₙ) : A ⊆ ∪Iₙ, Iₙ open intervals}.",
      "For Carathéodory measurability, we need: for all E ⊆ ℝ, λ*(E) = λ*(E ∩ A) + λ*(E \\ A).",
      "The inequality λ*(E) ≤ λ*(E ∩ A) + λ*(E \\ A) holds by subadditivity of outer measure.",
      "For the reverse: given ε > 0, cover E by intervals {Iₙ} with ∑ℓ(Iₙ) < λ*(E) + ε.",
      "Partition each Iₙ into Iₙ ∩ A and Iₙ \\ A. Then {Iₙ ∩ A} covers E ∩ A and {Iₙ \\ A} covers E \\ A.",
      "Since Iₙ = (Iₙ ∩ A) ∪ (Iₙ \\ A) is a disjoint union, we have ℓ(Iₙ) = λ*(Iₙ ∩ A) + λ*(Iₙ \\ A) for each n, because length is additive on disjoint sets.",
      "Summing: ∑ℓ(Iₙ) = ∑λ*(Iₙ ∩ A) + ∑λ*(Iₙ \\ A) ≥ λ*(E ∩ A) + λ*(E \\ A).",
      "Therefore λ*(E) + ε > λ*(E ∩ A) + λ*(E \\ A). Since ε was arbitrary, λ*(E) ≥ λ*(E ∩ A) + λ*(E \\ A). ∎",
    ],
    errorStep: 5,
    errorExplanation:
      "The claim ℓ(Iₙ) = λ*(Iₙ ∩ A) + λ*(Iₙ \\ A) is precisely what fails for non-measurable sets. Outer measure is subadditive but NOT additive on arbitrary disjoint sets — that is the whole point of measurability! The equation λ*(B ∪ C) = λ*(B) + λ*(C) for disjoint B, C requires at least one of them to be measurable. For a Vitali set V, ℓ(I) < λ*(I ∩ V) + λ*(I \\ V) can occur. The proof assumes what it is trying to prove.",
    distractorExplanations: [
      "The error is in step 4: the sets Iₙ ∩ A are not intervals, so they cannot be used to compute outer measure — the infimum in the definition of λ* runs over interval covers only",
      "The error is in step 6: the subadditivity λ*(∪(Iₙ ∩ A)) ≤ ∑λ*(Iₙ ∩ A) requires the sets to be open, which Iₙ ∩ A need not be",
      "The error is in step 3: the covering {Iₙ} must consist of open intervals, but partitioning them creates half-open or closed pieces, changing the outer measure",
    ],
  },

  // ── 25. Complex Analysis (Residues) ────────────────────────────────────────
  {
    title: "Proof that ∫₀^∞ sin(x)/x dx = π (off by a factor of 2)",
    steps: [
      "Consider f(z) = eⁱᶻ/z, which has a simple pole at z = 0.",
      "Integrate f over the contour: real axis from ε to R, semicircle Cᵣ from R to −R in the upper half-plane, real axis from −R to −ε, and semicircle Cε from −ε to ε in the upper half-plane.",
      "By Cauchy's theorem (no poles inside the contour), the total integral is 0.",
      "The integral over Cᵣ → 0 as R → ∞ by Jordan's lemma.",
      "On Cε, parameterize z = εeⁱᶿ with θ from π to 0: ∫_{Cε} eⁱᶻ/z dz = ∫_π^0 (eⁱᵋᵉ^ⁱᶿ / εeⁱᶿ) · iεeⁱᶿ dθ = i∫_π^0 eⁱᵋᵉ^ⁱᶿ dθ → i∫_π^0 1 dθ = −πi as ε → 0.",
      "The real-axis integrals combine: ∫_ε^R eⁱˣ/x dx + ∫_{-R}^{-ε} eⁱˣ/x dx = ∫_ε^R (eⁱˣ − e⁻ⁱˣ)/x dx = 2i ∫_ε^R sin(x)/x dx.",
      "Setting the total to 0: 2i ∫_0^∞ sin(x)/x dx − πi = 0, so ∫_0^∞ sin(x)/x dx = π/2.",
      "Wait — we claimed the answer is π. Redo: the small semicircle was taken in the upper half-plane (avoiding the pole from above), so its contribution should be −πi·Res(f,0) = −πi · 1 = −πi. And the factor from the real axis is 2i∫sin(x)/x dx. So 2i·I − πi = 0 gives I = π/2, not π.",
      "The title claims ∫ sin(x)/x dx = π. Therefore π = π/2. ∎",
    ],
    errorStep: 7,
    errorExplanation:
      "The 'proof' correctly computes ∫₀^∞ sin(x)/x dx = π/2, then claims this equals π to force a contradiction. The computation itself is correct (the Dirichlet integral does equal π/2). The false claim is in the title — the proof does not actually establish that the integral equals π. Step 7 pretends to 'redo' the calculation and still gets π/2, then equates it to π by fiat. This is simply asserting a false equality; there is no subtle mathematical error, just a fraudulent final step.",
    distractorExplanations: [
      "The error is in step 4: the small semicircle contribution should be −πi/2 (half a residue), not −πi, because the contour traverses a semicircle, not a full circle",
      "Jordan's lemma in step 3 requires the integrand to decay as |z| → ∞, but eⁱᶻ/z only decays like 1/|z|, which is not fast enough",
      "The error is in step 5: the substitution x → −x in the second integral should give e⁻ⁱˣ/(−x) = −e⁻ⁱˣ/x, not +e⁻ⁱˣ/x, changing the sign",
    ],
  },

  // ── 26. Number Theory (Quadratic Reciprocity) ─────────────────────────────
  {
    title: "Proof that every prime is a quadratic residue modulo every other prime",
    steps: [
      "Let p, q be distinct odd primes. We show p is a quadratic residue mod q.",
      "By quadratic reciprocity, (p/q)(q/p) = (−1)^{(p−1)(q−1)/4}.",
      "Case 1: p ≡ 1 (mod 4) or q ≡ 1 (mod 4). Then (p−1)(q−1)/4 is even, so (p/q)(q/p) = 1.",
      "This means (p/q) = (q/p). By Euler's criterion, (q/p) = q^{(p−1)/2} mod p.",
      "Since q ≢ 0 (mod p), Fermat's little theorem gives q^{p−1} ≡ 1 (mod p), so q^{(p−1)/2} ≡ ±1.",
      "Now q^{(p−1)/2} ≡ −1 (mod p) would mean q is a quadratic non-residue mod p. But by our case assumption, the symmetry (p/q) = (q/p) means if q is a non-residue mod p, then p is a non-residue mod q, and vice versa. If both are non-residues, (p/q)(q/p) = (−1)(−1) = 1, consistent. If both are residues, (p/q)(q/p) = 1·1 = 1, also consistent.",
      "So in Case 1, either both are residues or both are non-residues. Since there exist quadratic residues mod any prime (1 is always a QR), and the Legendre symbol is multiplicative, at least one of p, q must be a QR mod the other.",
      "By the pigeonhole principle and symmetry, both must be quadratic residues mod each other. ∎",
    ],
    errorStep: 6,
    errorExplanation:
      "The reasoning 'at least one of p, q must be a QR mod the other' is a non sequitur. The fact that 1 is a QR and the Legendre symbol is multiplicative does not imply anything about whether a specific prime is a QR. The case analysis correctly shows (p/q) = (q/p) (same sign), but from 'both residues or both non-residues,' one cannot conclude 'both residues.' Many pairs of primes are mutual quadratic non-residues: for example, (3/5) = −1 and (5/3) = −1. The pigeonhole argument makes no sense — there is no constraint forcing them to be residues rather than non-residues.",
    distractorExplanations: [
      "The error is in step 1: quadratic reciprocity requires p and q to be distinct odd primes with p < q, and the formula changes sign otherwise",
      "Euler's criterion in step 3 only computes the Legendre symbol for primes q > 2, and the proof doesn't handle q = 2 separately",
      "The error is in Case 1 setup: when p ≡ q ≡ 3 (mod 4), (p−1)(q−1)/4 is odd, but the proof doesn't address this case at all",
    ],
  },

  // ── 27. Linear Algebra (Spectral Theory) ──────────────────────────────────
  {
    title: "Proof that every real symmetric matrix has only positive eigenvalues",
    steps: [
      "Let A be a real symmetric n×n matrix. By the spectral theorem, A is orthogonally diagonalizable: A = QDQ^T where D = diag(λ₁,...,λₙ).",
      "For any eigenvector v with Av = λv, we have v^T A v = λ v^T v = λ ‖v‖².",
      "Now v^T A v = v^T (A^T) v (since A = A^T) = (Av)^T v = (λv)^T v = λ ‖v‖².",
      "This is consistent but doesn't yet show λ > 0. Consider: v^T A v = ∑ᵢ ∑ⱼ vᵢ aᵢⱼ vⱼ.",
      "Since A is symmetric, aᵢⱼ = aⱼᵢ, so v^T Av = ∑ᵢ aᵢᵢ vᵢ² + 2∑_{i<j} aᵢⱼ vᵢvⱼ.",
      "By the AM-GM inequality, 2|aᵢⱼ vᵢ vⱼ| ≤ aᵢⱼ²(vᵢ² + vⱼ²)/(something)... more carefully: the cross terms can be bounded by diagonal terms via Cauchy-Schwarz.",
      "Specifically, by the Gershgorin circle theorem, each eigenvalue λ satisfies |λ − aᵢᵢ| ≤ ∑_{j≠i} |aᵢⱼ| for some i, so λ ≥ aᵢᵢ − ∑_{j≠i}|aᵢⱼ| ≥ 0 when A is diagonally dominant.",
      "Every symmetric matrix can be made diagonally dominant by adding a suitable multiple of the identity: A + cI is diagonally dominant for large c, and its eigenvalues are λᵢ + c > 0.",
      "Subtracting c: λᵢ = (λᵢ + c) − c. Since λᵢ + c > 0, we need c < λᵢ + c, i.e., λᵢ > −c + c = 0. Wait, this gives λᵢ > 0 − 0... no, it gives λᵢ = (λᵢ + c) − c, which is positive minus positive, with no definite sign.",
      "Actually, λᵢ + c > 0 only tells us λᵢ > −c, not λᵢ > 0. The argument collapses. ∎",
    ],
    errorStep: 7,
    errorExplanation:
      "The proof makes diagonal dominance do work it cannot do. Adding cI to make A + cI diagonally dominant only shows eigenvalues of A + cI are positive, giving λᵢ > −c. This bound is trivially true and says nothing about the sign of λᵢ. The proof confuses 'eigenvalues of A + cI are positive' with 'eigenvalues of A are positive.' In fact, the matrix diag(−1, 1) is real symmetric with a negative eigenvalue. The statement is simply false — real symmetric matrices can have negative eigenvalues.",
    distractorExplanations: [
      "The error is in step 0: the spectral theorem requires A to have distinct eigenvalues for orthogonal diagonalization",
      "The Gershgorin theorem in step 6 requires strict diagonal dominance (strict inequality), and the proof only shows weak dominance",
      "The error is in step 4: the AM-GM inequality requires positive terms, but aᵢⱼ can be negative for symmetric matrices",
    ],
  },

  // ── 28. Differential Equations (Sturm-Liouville) ──────────────────────────
  {
    title: "Proof that every second-order linear ODE has a solution expressible in closed form",
    steps: [
      "Consider y'' + p(x)y' + q(x)y = 0 on [a,b] with continuous p, q.",
      "By the Cauchy-Euler method, try a power series solution y = ∑ₙ aₙ(x − x₀)ⁿ around a regular point x₀.",
      "Substituting into the ODE and matching coefficients gives a recurrence for aₙ.",
      "By the Cauchy-Kovalevskaya theorem (applied to the ODE setting), the power series has a positive radius of convergence r > 0.",
      "The solution y(x) = ∑aₙ(x − x₀)ⁿ is an analytic function on (x₀ − r, x₀ + r).",
      "Every convergent power series defines an analytic function, and analytic functions can be written as compositions of elementary functions (exp, log, sin, polynomials) by the structure theorem for analytic functions.",
      "Therefore y(x) is expressible in terms of elementary functions, i.e., in closed form. ∎",
    ],
    errorStep: 5,
    errorExplanation:
      "There is no 'structure theorem for analytic functions' that says every analytic function is a composition of elementary functions. This is completely false. Most solutions of second-order ODEs are NOT elementary: Bessel functions, Airy functions, Mathieu functions, and hypergeometric functions are all analytic but not expressible in terms of exp, log, sin, and polynomials. The class of analytic functions is vastly larger than the class of elementary functions. Differential Galois theory (Picard-Vessiot theory) gives precise conditions for when an ODE has elementary solutions, and generically they do not.",
    distractorExplanations: [
      "The power series in step 1 may have radius of convergence 0 if the coefficients p(x), q(x) are not analytic, only continuous",
      "The Cauchy-Kovalevskaya theorem in step 3 applies to PDEs, not ODEs, so it cannot be invoked here",
      "The error is in step 2: matching coefficients requires p and q to also have power series expansions, which is not guaranteed for merely continuous functions",
    ],
  },

  // ── 29. Functional Analysis (Hahn-Banach) ─────────────────────────────────
  {
    title: "Proof that every bounded linear functional on a subspace has a unique norm-preserving extension",
    steps: [
      "Let X be a normed space, Y ⊆ X a subspace, and f: Y → ℝ a bounded linear functional with ‖f‖ = M.",
      "By the Hahn-Banach theorem, there exists an extension F: X → ℝ with F|_Y = f and ‖F‖ = ‖f‖ = M.",
      "Suppose F₁ and F₂ are two such norm-preserving extensions. Define G = F₁ − F₂.",
      "G|_Y = 0, so G vanishes on Y. Also ‖F₁‖ = ‖F₂‖ = M.",
      "For any x ∈ X and y ∈ Y: |G(x)| = |G(x + y − y)| = |G(x + y)| ≤ |F₁(x + y)| + |F₂(x + y)| ≤ 2M‖x + y‖.",
      "Minimize over y ∈ Y: |G(x)| ≤ 2M · dist(x, Y).",
      "Now, for any x, define the seminorm p(x) = M · dist(x, Y). Then G is bounded by 2p.",
      "Since the distance function dist(x, Y) = 0 if and only if x ∈ cl(Y), G vanishes on cl(Y). For x ∉ cl(Y), we use: the extension is unique on each coset x + Y because F₁(x) and F₂(x) are both determined by ‖F‖ = M and the Hahn-Banach construction.",
      "Therefore F₁ = F₂, and the extension is unique. ∎",
    ],
    errorStep: 7,
    errorExplanation:
      "The claim that F₁ and F₂ 'are both determined by ‖F‖ = M and the Hahn-Banach construction' is false. The Hahn-Banach theorem guarantees existence of a norm-preserving extension but NOT uniqueness. Different choices in the extension process (at limit ordinal steps using Zorn's lemma) can yield different extensions. For example, on ℓ^∞, the functional that evaluates the limit of convergent sequences (a functional on c ⊆ ℓ^∞) has infinitely many distinct norm-preserving extensions (these are Banach limits). Uniqueness holds only when the space is strictly convex (or in Hilbert spaces via Riesz representation).",
    distractorExplanations: [
      "The error is in step 4: the triangle inequality gives |G(x)| ≤ |F₁(x+y)| + |F₂(x+y)| but this requires x+y to have the same norm, which is not guaranteed",
      "The bound |G(x)| ≤ 2M·dist(x,Y) in step 5 should be |G(x)| ≤ M·dist(x,Y) since both extensions have the same norm, and the factor of 2 is an overcount",
      "The error is in step 3: G = F₁ − F₂ has ‖G‖ ≤ ‖F₁‖ + ‖F₂‖ = 2M, but G|_Y = 0, so by the open mapping theorem ‖G‖ = 0, which directly shows F₁ = F₂",
    ],
  },

  // ── 30. Algebraic Topology (Homology) ──────────────────────────────────────
  {
    title: "Proof that every closed orientable 3-manifold has trivial first homology",
    steps: [
      "Let M be a closed orientable 3-manifold. By Poincaré duality, Hₖ(M; ℤ) ≅ H^{3−k}(M; ℤ).",
      "For k = 1: H₁(M; ℤ) ≅ H²(M; ℤ).",
      "By the universal coefficient theorem, H²(M; ℤ) ≅ Hom(H₂(M; ℤ), ℤ) ⊕ Ext¹(H₁(M; ℤ), ℤ).",
      "For k = 2, Poincaré duality gives H₂(M; ℤ) ≅ H¹(M; ℤ).",
      "By universal coefficients, H¹(M; ℤ) ≅ Hom(H₁(M; ℤ), ℤ).",
      "If H₁(M; ℤ) has a free part ℤʳ, then H¹(M; ℤ) ≅ ℤʳ, and H₂(M; ℤ) ≅ ℤʳ (by step 3).",
      "Then H²(M; ℤ) ≅ Hom(ℤʳ, ℤ) ⊕ Ext¹(H₁, ℤ) ≅ ℤʳ ⊕ (torsion part of H₁).",
      "Combining steps 1 and 6: H₁(M; ℤ) ≅ H²(M; ℤ) ≅ ℤʳ ⊕ T where T is the torsion of H₁.",
      "But H₁ = ℤʳ ⊕ T, and we just showed H₁ ≅ ℤʳ ⊕ T, which is consistent. For the torsion part, Poincaré duality with field coefficients gives b₁ = b₂ (Betti numbers). Combined with Euler characteristic χ(M) = 0 (for odd-dimensional closed manifolds): b₀ − b₁ + b₂ − b₃ = 0, so 1 − b₁ + b₁ − 1 = 0. This is always satisfied, giving no constraint on b₁.",
      "Wait — we need another argument. Since M is simply connected (π₁(M) = 1)... actually, we didn't assume this. The claim H₁ = 0 cannot be established without simple connectivity. The proof is incomplete.",
      "Therefore H₁(M; ℤ) = 0. ∎",
    ],
    errorStep: 9,
    errorExplanation:
      "The proof acknowledges its own failure in step 9 (that no constraint forces b₁ = 0), then sneaks in 'simple connectivity' which was never assumed, and ultimately just asserts the conclusion. The statement is false: many closed orientable 3-manifolds have nontrivial H₁. For example, the 3-torus T³ = S¹ × S¹ × S¹ has H₁(T³; ℤ) ≅ ℤ³. Any 3-manifold with nontrivial fundamental group that abelianizes nontrivially (e.g., lens spaces, surface bundles over S¹) provides a counterexample.",
    distractorExplanations: [
      "Poincaré duality in step 0 requires ℤ coefficients and orientation, but the isomorphism is between homology and cohomology with potentially different coefficient structures",
      "The universal coefficient theorem in step 2 has an Ext term that is not computed correctly — it should vanish for free groups, making the whole torsion analysis moot",
      "The error is in step 8: the Euler characteristic formula χ(M) = 0 is wrong for 3-manifolds — it only vanishes for odd-dimensional manifolds without boundary",
    ],
  },

  // ── 31. Probability (Martingales) ──────────────────────────────────────────
  {
    title: "Proof that every non-negative martingale converges to zero",
    steps: [
      "Let {Mₙ} be a non-negative martingale with respect to filtration {Fₙ}.",
      "Since Mₙ ≥ 0 and E[Mₙ₊₁ | Fₙ] = Mₙ, we have E[Mₙ] = E[M₀] for all n.",
      "By Doob's martingale convergence theorem, a non-negative martingale converges a.s. to a limit M∞ with E[M∞] ≤ E[M₀].",
      "Now consider E[M∞]. By Fatou's lemma, E[M∞] = E[lim Mₙ] ≤ lim inf E[Mₙ] = E[M₀].",
      "Since {Mₙ} is a martingale, it is also a reversed submartingale when viewed backwards. The sequence E[Mₙ | F∞] = M∞ a.s.",
      "By the conditional version of the dominated convergence theorem, E[Mₙ · 1_{Mₙ > ε} | F∞] → E[M∞ · 1_{M∞ > ε} | F∞] = M∞ · 1_{M∞ > ε}.",
      "But Mₙ · 1_{Mₙ > ε} ≤ Mₙ, and E[Mₙ] = E[M₀], so ∑P(Mₙ > ε) ≤ ∑E[Mₙ]/ε = ∑E[M₀]/ε diverges.",
      "By the (second) Borel-Cantelli lemma (events Mₙ > ε are not independent, but the divergence of the sum plus the martingale property implies), P(Mₙ > ε i.o.) = 1.",
      "But Mₙ → M∞ a.s., so Mₙ > ε only finitely often if M∞ ≤ ε. This contradiction (for each ε) forces M∞ = 0 a.s. ∎",
    ],
    errorStep: 7,
    errorExplanation:
      "The second Borel-Cantelli lemma requires the events to be independent (or at least satisfy a pairwise correlation condition). The events {Mₙ > ε} for a martingale are NOT independent — they are strongly correlated (if Mₙ is large, the martingale property makes Mₙ₊₁ large in expectation). The divergence of ∑P(Mₙ > ε) alone does not imply P(Mₙ > ε i.o.) = 1 without independence. The conclusion is false: the constant martingale Mₙ = 1 for all n is a non-negative martingale converging to 1, not 0.",
    distractorExplanations: [
      "The error is in step 2: Doob's convergence theorem requires the martingale to be uniformly integrable, not just non-negative",
      "Fatou's lemma in step 3 gives the wrong direction of inequality: it should be E[M∞] ≥ lim inf E[Mₙ]",
      "The error is in step 4: a martingale is not a reversed submartingale — this reversal only works for submartingales satisfying Doob's decomposition",
    ],
  },

  // ── 32. Real Analysis (Lebesgue Differentiation) ──────────────────────────
  {
    title: "Proof that every function of bounded variation is absolutely continuous",
    steps: [
      "Let f: [a,b] → ℝ have bounded variation V(f, [a,b]) = V < ∞.",
      "We must show: for every ε > 0, there exists δ > 0 such that whenever {(aᵢ,bᵢ)} are disjoint intervals with ∑(bᵢ − aᵢ) < δ, we have ∑|f(bᵢ) − f(aᵢ)| < ε.",
      "Since f has bounded variation, for any collection of disjoint intervals, ∑|f(bᵢ) − f(aᵢ)| ≤ V.",
      "Given ε > 0, divide [a,b] into N subintervals of length (b−a)/N where N is chosen so that the variation of f on each subinterval is less than ε/(2N).",
      "Such N exists because the total variation is V, and as the partition is refined, the variation on each subinterval tends to 0 (since the variation measure has no atoms... well, it could have atoms but only countably many).",
      "Now choose δ = ε/(2V). If ∑(bᵢ − aᵢ) < δ, then the intervals {(aᵢ,bᵢ)} occupy total length less than δ.",
      "Since total length < δ and the variation of f over any set of total length < δ is at most... well, we need to bound the variation over a set of small measure.",
      "The variation of f over a union of intervals of total length < δ is at most V · (total length)/(b−a) = V · δ/(b−a) < ε if δ < ε(b−a)/V.",
      "Therefore f is absolutely continuous. ∎",
    ],
    errorStep: 7,
    errorExplanation:
      "The claim that variation distributes proportionally to length — 'variation over intervals of total length L is at most V·L/(b−a)' — is completely false. Variation is not proportional to interval length. The Cantor function (devil's staircase) has bounded variation V = 1 on [0,1] but concentrates all its variation on the Cantor set (measure 0). For any δ > 0, one can find intervals of total length < δ covering the Cantor set on which the variation is 1 (the full variation). The Cantor function is BV but NOT absolutely continuous — it is the canonical counterexample.",
    distractorExplanations: [
      "The error is in step 3: dividing [a,b] into N subintervals does not guarantee the variation on each is less than V/N — variation can concentrate on a single subinterval",
      "The error is in step 5: the bound δ = ε/(2V) doesn't work because V could be 0, causing division by zero",
      "The error is in step 1: the definition of bounded variation uses supremum over all partitions, but the proof only considers equally-spaced partitions",
    ],
  },

  // ── 33. Abstract Algebra (Module Theory) ───────────────────────────────────
  {
    title: "Proof that every projective module over any ring is free",
    steps: [
      "Let P be a projective module over a ring R. By definition, P is a direct summand of a free module: F = P ⊕ Q for some free module F and module Q.",
      "Let F = ⊕_{i∈I} R be free with basis {eᵢ}. Each eᵢ can be uniquely written as eᵢ = pᵢ + qᵢ with pᵢ ∈ P, qᵢ ∈ Q.",
      "The projection π: F → P sends eᵢ ↦ pᵢ, and π is surjective with kernel Q.",
      "The elements {pᵢ} span P since every p ∈ P ⊆ F can be written as p = ∑rᵢeᵢ = ∑rᵢpᵢ + ∑rᵢqᵢ, and since p ∈ P and ∑rᵢqᵢ ∈ Q, the direct sum decomposition gives p = ∑rᵢpᵢ.",
      "Now we show {pᵢ} are linearly independent. Suppose ∑rᵢpᵢ = 0 in P ⊆ F.",
      "Then ∑rᵢpᵢ = 0 in F, which means ∑rᵢeᵢ − ∑rᵢqᵢ = 0, so ∑rᵢeᵢ = ∑rᵢqᵢ.",
      "The left side is in F (trivially) and the right side is in Q. But ∑rᵢeᵢ is a general element of F, and since {eᵢ} is a basis, ∑rᵢeᵢ = 0 implies all rᵢ = 0.",
      "Wait — ∑rᵢeᵢ need not be 0; it equals ∑rᵢqᵢ ∈ Q, but ∑rᵢeᵢ also lies in F. Elements of F can certainly be in Q (since Q ⊆ F). So we only get ∑rᵢeᵢ ∈ Q, not ∑rᵢeᵢ = 0.",
      "Hmm, but Q ∩ P = {0} and ∑rᵢpᵢ = 0, so ∑rᵢeᵢ = ∑rᵢqᵢ ∈ Q. Then ∑rᵢeᵢ ∈ Q and ∑rᵢeᵢ = ∑rᵢpᵢ + ∑rᵢqᵢ = 0 + ∑rᵢqᵢ = ∑rᵢqᵢ. This is consistent. Since ∑rᵢeᵢ ∈ P ⊕ Q and its P-component is ∑rᵢpᵢ = 0, its Q-component is ∑rᵢqᵢ = ∑rᵢeᵢ, so indeed ∑rᵢeᵢ = ∑rᵢqᵢ ∈ Q. Since {eᵢ} is free and ∑rᵢeᵢ ∈ Q, each rᵢ = 0.",
      "Therefore {pᵢ} is a basis for P, so P is free. ∎",
    ],
    errorStep: 8,
    errorExplanation:
      "The conclusion 'since {eᵢ} is free and ∑rᵢeᵢ ∈ Q, each rᵢ = 0' is wrong. Linear independence of {eᵢ} means ∑rᵢeᵢ = 0 implies rᵢ = 0, but ∑rᵢeᵢ ∈ Q does NOT mean ∑rᵢeᵢ = 0. The submodule Q can contain nonzero elements that are nontrivial linear combinations of the eᵢ. The proof conflates 'being in Q' with 'being zero.' The Kaplansky theorem shows projective modules over local rings are free, but in general, projective modules need not be free — for example, over R = ℤ/6ℤ, the ideal (2) is projective but not free.",
    distractorExplanations: [
      "The error is in step 1: the projection π is not well-defined because the decomposition eᵢ = pᵢ + qᵢ need not be unique when the direct sum is external, not internal",
      "The spanning argument in step 3 fails because p = ∑rᵢpᵢ requires knowing the coefficients rᵢ, but the map from p to its F-representation is not canonical",
      "The error is in step 0: not every projective module is a direct summand of a free module — this requires the ring to be Noetherian",
    ],
  },

  // ── 34. Topology (Covering Spaces) ─────────────────────────────────────────
  {
    title: "Proof that every covering space of a compact space is compact",
    steps: [
      "Let p: E → B be a covering space with B compact.",
      "Let {Uα} be an open cover of E. For each b ∈ B, choose an evenly covered neighborhood Vb of b.",
      "The preimage p⁻¹(Vb) = ⊔ᵢ Wᵢ^b is a disjoint union of open sets each mapped homeomorphically to Vb by p.",
      "Since {Vb : b ∈ B} covers B and B is compact, extract a finite subcover Vb₁, ..., Vbₖ.",
      "For each bⱼ, p⁻¹(Vbⱼ) = ⊔ᵢ Wᵢ^bⱼ. Each sheet Wᵢ^bⱼ is homeomorphic to Vbⱼ via p, hence is compact (as the continuous image of a compact set under a homeomorphism).",
      "Wait — Vbⱼ is an open subset of B, not necessarily compact. But Vbⱼ ⊆ B and B is compact, so Vbⱼ is relatively compact. Take its closure: cl(Vbⱼ) is compact since B is compact.",
      "Each sheet Wᵢ^bⱼ is homeomorphic to Vbⱼ, so cl(Wᵢ^bⱼ) is compact. The sheets over cl(Vbⱼ) cover a compact subset of E.",
      "Since E = ∪ⱼ p⁻¹(Vbⱼ) and each p⁻¹(Vbⱼ) has compact closure, E is a finite union of sets with compact closure, hence E has compact closure... but E is the whole space.",
      "Therefore E is compact. ∎",
    ],
    errorStep: 4,
    errorExplanation:
      "The sheets Wᵢ^bⱼ are homeomorphic to Vbⱼ which is open in B — open subsets of compact spaces are NOT necessarily compact (they are not even closed, generally). The proof tries to fix this in steps 5-7 by taking closures, but this creates new problems: the number of sheets over each Vbⱼ could be infinite (the covering is not assumed to be finite-sheeted). With infinitely many sheets, p⁻¹(Vbⱼ) is an infinite disjoint union of open sets, each needing separate coverage. The real counterexample: the universal cover of S¹ is ℝ (via t ↦ e^{2πit}), and ℝ is not compact even though S¹ is.",
    distractorExplanations: [
      "The error is in step 1: not every point of B has an evenly covered neighborhood — this requires B to be locally path-connected and semi-locally simply connected",
      "The error is in step 3: a finite subcover of B exists, but the preimages may overlap in E, so the disjoint union decomposition breaks down",
      "The error is in step 6: the closure of p⁻¹(Vbⱼ) is not the same as p⁻¹(cl(Vbⱼ)) because the covering map is not a closed map in general",
    ],
  },

  // ── 35. Complex Analysis (Entire Functions) ───────────────────────────────
  {
    title: "Proof that every entire function of finite order is a polynomial",
    steps: [
      "Let f be an entire function of finite order ρ, meaning log|f(z)| = O(|z|^ρ) as |z| → ∞.",
      "By the Hadamard factorization theorem, f(z) = z^m · e^{g(z)} · ∏(1 − z/aₙ)exp(z/aₙ + ... + (z/aₙ)^p/p), where g is a polynomial of degree ≤ ρ and p = ⌊ρ⌋.",
      "If f has finitely many zeros, then the product is finite, and f(z) = P(z)·e^{g(z)} where P is a polynomial.",
      "We claim f has finitely many zeros. By Jensen's formula, n(r) ≤ (1/log 2) · log(M(2r)/|f(0)|) where n(r) counts zeros in |z| ≤ r and M(r) = max|f| on |z| = r.",
      "Since f has finite order, M(r) ≤ exp(Cr^ρ), so n(r) ≤ C'r^ρ. Thus f has at most O(r^ρ) zeros in |z| ≤ r.",
      "As r → ∞, the total number of zeros is at most limᵣ→∞ C'r^ρ which is finite... no wait, C'r^ρ → ∞. But the number of zeros is an integer, so it cannot grow continuously.",
      "At each radius r, n(r) is a non-negative integer, and n(r) ≤ C'r^ρ. As r → ∞, n(r) could increase without bound. So f can have infinitely many zeros.",
      "But g(z) has degree ≤ ρ, so e^{g(z)} contributes order exactly deg(g) ≤ ρ. Since the product and e^{g(z)} together give order ρ, and the product contributes order ≤ ρ, everything is consistent with finite order.",
      "Since f = P(z)·e^{g(z)} and e^{g(z)} has no zeros, f has the same zeros as P. Since P is a polynomial, f has finitely many zeros. Combined with the exponential factor, if g is non-constant, f is not a polynomial.",
      "But we claimed f is a polynomial, so g must be constant, meaning e^{g(z)} is constant and f = c·P(z). ∎",
    ],
    errorStep: 8,
    errorExplanation:
      "The proof contradicts itself. Step 6 correctly recognizes that a finite-order entire function can have infinitely many zeros (e.g., sin(z) has order 1 with infinitely many zeros). Step 8 then incorrectly claims f has finitely many zeros because it is P(z)·e^{g(z)} — but this form only applies when zeros are finite, which step 2 assumed without justification. The proof then asserts g must be constant with no reasoning. The conclusion is false: sin(z), e^z, and cos(z) are entire functions of finite order that are not polynomials.",
    distractorExplanations: [
      "The Hadamard factorization in step 1 requires ρ to be a positive integer, and the theorem fails for non-integer orders",
      "Jensen's formula in step 3 requires f(0) ≠ 0, and the proof doesn't handle the case f(0) = 0",
      "The error is in step 4: the bound n(r) ≤ C'r^ρ only holds for ρ > 0, and for ρ = 0 the function is bounded hence constant by Liouville",
    ],
  },

  // ── 36. Set Theory (Ordinals) ──────────────────────────────────────────────
  {
    title: "Proof that every well-ordered set is countable",
    steps: [
      "Let (W, <) be a well-ordered set.",
      "For each element w ∈ W, define the initial segment I(w) = {x ∈ W : x < w}.",
      "Each initial segment I(w) is also well-ordered (as a subset of a well-ordered set).",
      "Claim: each I(w) is finite. Proof: if I(w) were infinite, it would contain an infinite descending chain by the axiom of dependent choice... no, well-ordering prevents descending chains. So I(w) is well-ordered but could be infinite.",
      "Actually, define f: W → ℕ by transfinite recursion: f(w) = min(ℕ \\ {f(x) : x < w}).",
      "This assigns to w the smallest natural number not used by any predecessor.",
      "For any w ∈ W, the set {f(x) : x < w} ⊆ ℕ, so its complement in ℕ is nonempty (ℕ is infinite), thus f(w) is well-defined.",
      "Since f is injective (if w < w', then f(w) ∈ {f(x) : x < w'}, so f(w') ≠ f(w)), f is an injection from W into ℕ.",
      "Therefore W is countable. ∎",
    ],
    errorStep: 6,
    errorExplanation:
      "The claim that {f(x) : x < w} ⊆ ℕ has nonempty complement is false for uncountable w. If w has uncountably many predecessors, then {f(x) : x < w} could exhaust all of ℕ. Specifically, if W = ω₁ (the first uncountable ordinal), then for w = ω (the first limit ordinal past all finite ordinals), f maps {0,1,2,...} = ω bijectively onto ℕ, leaving no natural number available for ω itself. The transfinite recursion breaks down at the first ordinal whose initial segment maps onto all of ℕ. This is precisely why uncountable well-orderings exist.",
    distractorExplanations: [
      "The error is in step 4: the definition f(w) = min(ℕ \\ ...) requires the well-ordering of ℕ, but this is circular because we are trying to prove all well-ordered sets embed into ℕ",
      "The injectivity argument in step 7 is wrong: f(w) ∈ {f(x) : x < w'} does not mean f(w) ≠ f(w') since the set could contain repetitions",
      "The error is in step 2: well-ordering of I(w) as a subset is not automatic — it requires the subspace ordering to inherit the well-ordering property, which needs transfinite induction",
    ],
  },

  // ── 37. Differential Geometry ──────────────────────────────────────────────
  {
    title: "Proof that every smooth manifold admits a flat Riemannian metric",
    steps: [
      "Let M be a smooth n-manifold. By Whitney's embedding theorem, M embeds smoothly into ℝ^{2n+1}.",
      "Endow M with the induced Riemannian metric g from the Euclidean metric on ℝ^{2n+1}.",
      "The Euclidean space ℝ^{2n+1} is flat (zero Riemann curvature tensor).",
      "For a submanifold M ⊆ ℝ^{2n+1}, the Gauss equation relates the curvature of M to the ambient curvature and the second fundamental form: R^M = R^{ℝ^{2n+1}}|_M + (terms involving the second fundamental form).",
      "Since R^{ℝ^{2n+1}} = 0, we get R^M = (terms involving the second fundamental form).",
      "The second fundamental form measures how M curves within ℝ^{2n+1}, and for the induced metric, these terms contribute extrinsic curvature.",
      "But we are free to choose the embedding. Choose an embedding that minimizes the second fundamental form — specifically, one where the second fundamental form vanishes identically (a totally geodesic embedding).",
      "If the embedding is totally geodesic, then R^M = 0, so (M, g) is flat. ∎",
    ],
    errorStep: 6,
    errorExplanation:
      "A totally geodesic submanifold of ℝⁿ must be an affine subspace (a plane), so only open subsets of ℝⁿ can be totally geodesically embedded in Euclidean space. An arbitrary manifold cannot be totally geodesically embedded in Euclidean space — the topology of M constrains its curvature. For instance, any closed manifold embedded in ℝⁿ must have points of positive (extrinsic) curvature. The 2-sphere S² admits no flat metric at all (by Gauss-Bonnet: ∫K dA = 4π ≠ 0), providing a direct counterexample to the claim.",
    distractorExplanations: [
      "Whitney's embedding theorem in step 0 gives a topological embedding, not an isometric one, so the induced metric is not well-defined",
      "The Gauss equation in step 3 only applies to hypersurfaces (codimension 1), not submanifolds of arbitrary codimension in ℝ^{2n+1}",
      "The error is in step 2: the Euclidean metric on ℝ^{2n+1} restricts to the induced metric on M only if M is a minimal submanifold",
    ],
  },

  // ── 38. Measure Theory (Convergence) ───────────────────────────────────────
  {
    title: "Proof that convergence in measure implies convergence almost everywhere",
    steps: [
      "Let fₙ → f in measure on a measure space (X, μ) with μ(X) < ∞.",
      "This means: for every ε > 0, μ({x : |fₙ(x) − f(x)| ≥ ε}) → 0 as n → ∞.",
      "For each k ∈ ℕ, let Aₙ,ₖ = {x : |fₙ(x) − f(x)| ≥ 1/k}. Then μ(Aₙ,ₖ) → 0 as n → ∞.",
      "Define Bₖ = lim sup Aₙ,ₖ = ∩_{N} ∪_{n≥N} Aₙ,ₖ. This is the set of x where |fₙ(x) − f(x)| ≥ 1/k for infinitely many n.",
      "Since μ(Aₙ,ₖ) → 0, for any δ > 0, μ(∪_{n≥N} Aₙ,ₖ) ≤ ∑_{n≥N} μ(Aₙ,ₖ) → 0 as N → ∞.",
      "Wait — ∑μ(Aₙ,ₖ) could diverge even though μ(Aₙ,ₖ) → 0. But μ(∪_{n≥N} Aₙ,ₖ) ≤ ∑_{n≥N} μ(Aₙ,ₖ), and if this sum → 0, then μ(Bₖ) = lim μ(∪_{n≥N} Aₙ,ₖ) = 0.",
      "Since μ(Aₙ,ₖ) → 0, we can choose a subsequence with μ(Aₙⱼ,ₖ) < 2⁻ʲ. Then ∑μ(Aₙⱼ,ₖ) < ∞. By Borel-Cantelli, μ(lim sup Aₙⱼ,ₖ) = 0. So along the subsequence, fₙⱼ → f a.e.",
      "But we claimed the full sequence converges a.e., not just a subsequence. The subsequence result is all we get from convergence in measure.",
      "Therefore fₙ → f a.e. ∎",
    ],
    errorStep: 7,
    errorExplanation:
      "Step 6 correctly identifies that convergence in measure only gives a subsequence converging a.e. (this is a theorem). Step 7 then ignores this and claims the full sequence converges a.e. The proof correctly derives the subsequence result but then makes an unjustified leap. The standard counterexample is the 'typewriter sequence' on [0,1]: indicator functions of intervals that cycle through [0,1] with decreasing length. These converge in measure to 0 but at every point x, the sequence takes the value 1 infinitely often, so fₙ(x) does not converge to 0 for any x.",
    distractorExplanations: [
      "The error is in step 4: μ(∪_{n≥N} Aₙ,ₖ) ≤ ∑μ(Aₙ,ₖ) requires σ-subadditivity, which only holds for countable unions in σ-finite spaces",
      "The Borel-Cantelli lemma in step 6 requires the events to be independent, which the sets Aₙⱼ,ₖ are not",
      "The error is in step 2: the definition of Bₖ should use lim inf, not lim sup, because we want the set where convergence fails",
    ],
  },

  // ── 39. Number Theory (p-adic) ─────────────────────────────────────────────
  {
    title: "Proof that √2 exists in every p-adic field ℚₚ",
    steps: [
      "Fix a prime p. We show x² = 2 has a solution in ℚₚ.",
      "By Hensel's lemma, it suffices to find a ∈ ℤ such that a² ≡ 2 (mod p) and 2a ≢ 0 (mod p), i.e., p ∤ 2a.",
      "The condition p ∤ 2a is satisfied whenever p is odd and a ≢ 0 (mod p).",
      "For p odd, we need 2 to be a quadratic residue mod p, i.e., (2/p) = 1 where (·/p) is the Legendre symbol.",
      "By quadratic reciprocity and the second supplement, (2/p) = (−1)^{(p²−1)/8}.",
      "This equals 1 when p ≡ ±1 (mod 8). So for p ≡ 1, 7 (mod 8), √2 ∈ ℚₚ.",
      "For p = 2, use a different approach: 2 = 2 in ℚ₂, and we need x² = 2. Try x = 1 + 1 = 2: 4 ≠ 2. Hensel's lemma requires a² ≡ 2 (mod 8) for p = 2 (stronger condition). But a² mod 8 ∈ {0,1,4}, and 2 ∉ {0,1,4}, so no lift exists.",
      "So √2 ∉ ℚ₂ and √2 ∉ ℚₚ for p ≡ 3, 5 (mod 8). The claim is false for these primes.",
      "But for the remaining primes p ≡ ±1 (mod 8), √2 ∈ ℚₚ. Since there are infinitely many such primes, √2 exists in infinitely many ℚₚ, so by a density argument it exists in all. ∎",
    ],
    errorStep: 8,
    errorExplanation:
      "The 'density argument' — that because √2 exists in infinitely many ℚₚ, it exists in all — is nonsensical. Each ℚₚ is an independent, distinct topological field; there is no density or continuity relating the solvability of x² = 2 across different primes. The proof itself correctly demonstrates that √2 does NOT exist in ℚ₂ or in ℚₚ for p ≡ 3, 5 (mod 8), then pretends this doesn't matter. The conclusion contradicts the proof's own intermediate results.",
    distractorExplanations: [
      "Hensel's lemma in step 1 requires f'(a) ≢ 0 (mod p²), not just mod p, for the iteration to converge in ℚₚ",
      "The second supplement formula in step 4 is (2/p) = (−1)^{(p−1)(p+1)/8}, which differs from the stated formula when p ≡ 3 (mod 4)",
      "The error is in step 6: for p = 2, the correct Hensel condition requires a² ≡ 2 (mod 4), not mod 8, and 2 ≡ 2 (mod 4) does have solutions",
    ],
  },

  // ── 40. Linear Algebra (Determinants) ──────────────────────────────────────
  {
    title: "Proof that det(A + B) = det(A) + det(B) for all square matrices",
    steps: [
      "Let A, B be n×n matrices. Recall det is defined as det(M) = ∑_{σ∈Sₙ} sgn(σ) ∏ᵢ Mᵢ,σ(i).",
      "For M = A + B, Mᵢⱼ = Aᵢⱼ + Bᵢⱼ.",
      "det(A+B) = ∑_σ sgn(σ) ∏ᵢ (Aᵢ,σ(i) + Bᵢ,σ(i)).",
      "Expand the product: ∏ᵢ (Aᵢ,σ(i) + Bᵢ,σ(i)) = ∑_{S⊆[n]} (∏_{i∈S} Aᵢ,σ(i))(∏_{i∉S} Bᵢ,σ(i)).",
      "Substituting: det(A+B) = ∑_σ sgn(σ) ∑_S (∏_{i∈S} Aᵢ,σ(i))(∏_{i∉S} Bᵢ,σ(i)).",
      "The S = [n] term gives ∑_σ sgn(σ)∏ᵢ Aᵢ,σ(i) = det(A). The S = ∅ term gives ∑_σ sgn(σ)∏ᵢ Bᵢ,σ(i) = det(B).",
      "For all other S (∅ ⊊ S ⊊ [n]), the mixed terms ∑_σ sgn(σ)(∏_{i∈S} Aᵢ,σ(i))(∏_{i∉S} Bᵢ,σ(i)) = 0 by the alternating property of the determinant applied to the mixed columns.",
      "Therefore det(A+B) = det(A) + det(B). ∎",
    ],
    errorStep: 6,
    errorExplanation:
      "The claim that the mixed terms vanish is false. The 'alternating property' of the determinant applies to multilinear functions of columns (or rows), but each mixed term ∑_σ sgn(σ)(∏_{i∈S} Aᵢ,σ(i))(∏_{i∉S} Bᵢ,σ(i)) is NOT a determinant of a matrix with repeated columns — it is a sum over all permutations of a product that mixes entries from A and B in different rows. These mixed terms are generally nonzero. For example, with A = B = I (identity), det(I+I) = det(2I) = 2ⁿ, but det(I) + det(I) = 2. For n ≥ 2, 2ⁿ ≠ 2.",
    distractorExplanations: [
      "The expansion in step 3 is incorrect: the product should be expanded using the multinomial theorem, not the subset expansion, because the terms are not independent",
      "The error is in step 5: the S = [n] term gives det(A) only if σ ranges over all of Sₙ, but when S = [n], the sum should be restricted to even permutations",
      "The determinant formula in step 0 uses the Leibniz formula which is only valid for matrices over commutative rings, and the proof should specify this",
    ],
  },

  // ── 41. Real Analysis (Series) ─────────────────────────────────────────────
  {
    title: "Proof that every rearrangement of a convergent series converges to the same sum",
    steps: [
      "Let ∑aₙ = S be a convergent series of real numbers.",
      "Let σ: ℕ → ℕ be a bijection (a rearrangement), and consider ∑a_{σ(n)}.",
      "For any ε > 0, there exists N such that |∑_{n=1}^{M} aₙ − S| < ε for all M ≥ N.",
      "Let K = max{σ⁻¹(1), σ⁻¹(2), ..., σ⁻¹(N)}. Then for m ≥ K, the partial sum ∑_{n=1}^{m} a_{σ(n)} contains all of a₁, a₂, ..., a_N.",
      "Therefore ∑_{n=1}^{m} a_{σ(n)} = ∑_{n=1}^{N} aₙ + (remaining terms from {a_{N+1}, a_{N+2}, ...}).",
      "The remaining terms are a subset of the tail ∑_{n>N} aₙ. Since ∑aₙ converges, the tail ∑_{n>N} |aₙ| → 0... wait, convergence of ∑aₙ only means ∑_{n>N} aₙ → 0, not ∑_{n>N} |aₙ| → 0.",
      "But we can still bound: |∑_{remaining} a_{σ(n)}| ≤ |∑_{n>N} aₙ| + |terms from {a₁,...,a_N} not yet included|. The second part is 0 since all a₁,...,a_N are included (m ≥ K).",
      "So |∑_{n=1}^{m} a_{σ(n)} − S| ≤ |∑_{n=1}^{N} aₙ − S| + |∑_{remaining}|. The first term is < ε. The remaining terms sum to at most... they are a sub-sum of the tail, so |∑_{remaining}| ≤ ∑_{n>N} |aₙ|.",
      "Since ∑aₙ converges, ∑|aₙ| also converges (every convergent series is absolutely convergent), so the tail ∑_{n>N} |aₙ| < ε for large N.",
      "Therefore |∑_{n=1}^{m} a_{σ(n)} − S| < 2ε, proving the rearranged series converges to S. ∎",
    ],
    errorStep: 8,
    errorExplanation:
      "The claim 'every convergent series is absolutely convergent' is false. A series can converge conditionally: ∑aₙ converges but ∑|aₙ| diverges. The alternating harmonic series ∑(−1)ⁿ/n is the classic example. Riemann's rearrangement theorem states that a conditionally convergent series can be rearranged to converge to ANY real number (or diverge). The proof is valid only for absolutely convergent series; the step that invokes absolute convergence as automatic is the error.",
    distractorExplanations: [
      "The error is in step 3: K might be infinite if σ⁻¹ maps {1,...,N} to arbitrarily large indices, so the partial sums never contain all of a₁,...,a_N simultaneously",
      "The error is in step 4: the decomposition into ∑_{n=1}^{N} aₙ + remaining is not valid because the rearrangement may intersperse early and late terms",
      "The error is in step 7: the bound |∑_{remaining}| ≤ ∑_{n>N}|aₙ| uses the triangle inequality, which gives an upper bound, not an equality, so the 2ε bound is too loose",
    ],
  },

  // ── 42. Abstract Algebra (Field Theory) ────────────────────────────────────
  {
    title: "Proof that every finite extension of ℚ is a Galois extension",
    steps: [
      "Let K/ℚ be a finite extension of degree n = [K:ℚ].",
      "By the primitive element theorem, K = ℚ(α) for some algebraic element α.",
      "Let f(x) = min_ℚ(α) be the minimal polynomial of α over ℚ, with deg(f) = n.",
      "Since ℚ has characteristic 0, f is separable (its roots are distinct in the algebraic closure).",
      "The splitting field of f over ℚ is an extension L ⊇ K with [L:ℚ] dividing n!.",
      "Since f(α) = 0 and α ∈ K, the polynomial f has a root in K.",
      "Because f is irreducible over ℚ and has one root in K = ℚ(α), all roots of f lie in K. This is because adjoining one root of an irreducible polynomial automatically gives all roots.",
      "Therefore f splits completely over K, so K is the splitting field of f over ℚ.",
      "A splitting field of a separable polynomial is a Galois extension. Therefore K/ℚ is Galois. ∎",
    ],
    errorStep: 6,
    errorExplanation:
      "The claim 'adjoining one root of an irreducible polynomial automatically gives all roots' is false. If f is irreducible of degree n over ℚ, then ℚ(α) contains α but generally does NOT contain the other roots of f. For example, f(x) = x³ − 2 is irreducible over ℚ, and ℚ(∛2) contains the real cube root of 2 but NOT the complex cube roots ∛2·ω and ∛2·ω² (where ω = e^{2πi/3}). The extension ℚ(∛2)/ℚ has degree 3 but is not Galois — its splitting field is ℚ(∛2, ω) of degree 6.",
    distractorExplanations: [
      "The primitive element theorem in step 1 requires K/ℚ to be separable, which must be proved first before invoking it",
      "The error is in step 3: in characteristic 0, minimal polynomials can still be inseparable if the ground field is not perfect",
      "The splitting field in step 4 always has degree exactly n! over ℚ, not dividing n!, so the degree count is wrong",
    ],
  },

  // ── 43. Topology (Manifolds) ───────────────────────────────────────────────
  {
    title: "Proof that every simply connected closed 3-manifold is homeomorphic to S³ without using Ricci flow",
    steps: [
      "Let M be a simply connected closed 3-manifold. We show M ≅ S³.",
      "Since π₁(M) = 0, the Hurewicz theorem gives H₁(M; ℤ) = 0.",
      "By Poincaré duality for closed orientable 3-manifolds, H₂(M; ℤ) ≅ H¹(M; ℤ) ≅ Hom(H₁(M), ℤ) = 0.",
      "So M has the homology of S³: H₀ = H₃ = ℤ, H₁ = H₂ = 0.",
      "By the Hurewicz theorem (applied again), since H₁ = 0, H₂ = 0, we get π₂(M) = 0.",
      "Now π₁(M) = π₂(M) = 0. By the Hurewicz theorem for higher dimensions, π₃(M) ≅ H₃(M; ℤ) ≅ ℤ.",
      "A generator of π₃(M) gives a map f: S³ → M inducing an isomorphism on all homology groups.",
      "By Whitehead's theorem, a map between simply connected CW-complexes that induces isomorphisms on all homotopy groups is a homotopy equivalence.",
      "A homotopy equivalence between closed manifolds of the same dimension is a homeomorphism (by the topological invariance of manifolds).",
      "Therefore M ≅ S³. ∎",
    ],
    errorStep: 8,
    errorExplanation:
      "A homotopy equivalence between closed manifolds is NOT necessarily a homeomorphism. Homotopy equivalence is a much weaker notion than homeomorphism. The claim is false even in the simply connected case — the Poincaré conjecture (now theorem, proved by Perelman using Ricci flow) is precisely the statement that a simply connected closed 3-manifold is homeomorphic to S³. If homotopy equivalence implied homeomorphism for closed manifolds, the Poincaré conjecture would be trivial, which it famously is not. In higher dimensions, there exist homotopy spheres that are not homeomorphic to the standard sphere (exotic spheres in dimension 7 and above, though in dimension 3 the result happens to be true — but the proof is deep).",
    distractorExplanations: [
      "The second application of Hurewicz in step 4 is wrong: Hurewicz gives π₂ ≅ H₂ only when π₁ = 0, which requires M to be 1-connected, not just have H₁ = 0",
      "Whitehead's theorem in step 7 requires f to induce isomorphisms on all homotopy groups, but step 6 only shows this for π₃, not for higher πₙ",
      "The error is in step 2: Poincaré duality requires M to be orientable, but simple connectivity does not guarantee orientability in dimension 3",
    ],
  },

  // ── 44. Measure Theory (Product Measures) ──────────────────────────────────
  {
    title: "Proof that the product of two complete measure spaces is complete",
    steps: [
      "Let (X, A, μ) and (Y, B, ν) be complete measure spaces.",
      "Form the product measure space (X×Y, A⊗B, μ⊗ν).",
      "Let N ⊆ X×Y with (μ⊗ν)(N) = 0, and let E ⊆ N. We must show E ∈ A⊗B.",
      "By Fubini's theorem (for non-negative measurable functions), ∫∫ 1_N(x,y) dν(y) dμ(x) = 0.",
      "So for μ-a.e. x, ν({y : (x,y) ∈ N}) = 0, i.e., the x-section Nₓ has ν-measure 0.",
      "Since ν is complete and Eₓ ⊆ Nₓ with ν(Nₓ) = 0, the section Eₓ is ν-measurable (by completeness of ν).",
      "The function x ↦ ν(Eₓ) = 0 for μ-a.e. x is measurable.",
      "By the converse of Fubini (Tonelli), if all x-sections of E are measurable and x ↦ ν(Eₓ) is measurable, then E ∈ A⊗B.",
      "Therefore E is measurable in the product σ-algebra, proving completeness. ∎",
    ],
    errorStep: 7,
    errorExplanation:
      "The 'converse of Fubini' stated here is false. Fubini/Tonelli says: if E ∈ A⊗B, then its sections are measurable and the section-measure function is measurable. The converse — if sections are measurable and the section-measure function is measurable, then E ∈ A⊗B — does NOT hold. Measurability of sections does not guarantee product measurability. In fact, the product of two complete measure spaces is generally NOT complete. The standard example: the product of Lebesgue measure with itself on [0,1]² is not complete. One must take the completion of the product σ-algebra to recover completeness.",
    distractorExplanations: [
      "The error is in step 3: Fubini's theorem requires N to be A⊗B-measurable, but we only know (μ⊗ν)(N) = 0 from the outer measure, not that N is in the σ-algebra",
      "The error is in step 5: completeness of ν gives Eₓ ∈ B only when Eₓ is a subset of a set of measure zero in B, but Nₓ might not be in B",
      "The error is in step 4: the x-sections Nₓ need not have ν-measure 0 for μ-a.e. x; Fubini only gives this for the integral, not section-by-section",
    ],
  },

  // ── 45. Complex Analysis (Analytic Functions) ──────────────────────────────
  {
    title: "Proof that every non-vanishing entire function is constant",
    steps: [
      "Let f: ℂ → ℂ be entire with f(z) ≠ 0 for all z ∈ ℂ.",
      "Since f never vanishes, g(z) = 1/f(z) is also entire.",
      "Consider h(z) = log f(z). Since f is entire and non-vanishing, a branch of log f can be defined. Specifically, write f = e^h for some entire function h.",
      "Now |f(z)| = |e^{h(z)}| = e^{Re(h(z))}.",
      "Since f is entire, by the maximum modulus principle applied to g = 1/f: |g(z)| = 1/|f(z)| = e^{−Re(h(z))}.",
      "If f is unbounded (|f(z)| → ∞ along some sequence), then Re(h(z)) → +∞ along that sequence, so g(z) → 0. But then g is a bounded entire function (since |g| ≤ 1/min|f| on compact sets and g → 0 at infinity), so by Liouville's theorem g is constant, hence f is constant.",
      "If f is bounded, then f itself is constant by Liouville's theorem.",
      "The remaining case: f is unbounded but g does not tend to 0 at infinity... but that's impossible since g = 1/f and |f| → ∞ implies |g| → 0.",
      "Therefore every non-vanishing entire function is constant. ∎",
    ],
    errorStep: 5,
    errorExplanation:
      "The claim that g → 0 at infinity makes g bounded is wrong, and more fundamentally, the conclusion that g is bounded does not follow. An entire function can be unbounded along some sequences (|f(zₙ)| → ∞) while remaining moderate along others. The function g = 1/f need not tend to 0 'at infinity' in any uniform sense — it tends to 0 along the specific sequence where |f| → ∞, but could be large elsewhere. Liouville's theorem requires g to be bounded on ALL of ℂ, not just along subsequences. The counterexample is trivial: f(z) = eᶻ is entire, non-vanishing, and non-constant. We have |eᶻ| = e^{Re(z)}, which is unbounded as Re(z) → +∞ but tends to 0 as Re(z) → −∞, so g(z) = e^{−z} is also entire and unbounded.",
    distractorExplanations: [
      "The error is in step 2: a global holomorphic logarithm log f(z) requires the domain to be simply connected, but ℂ is simply connected so this is fine — the real issue is elsewhere",
      "The maximum modulus principle in step 4 applies to bounded domains, not to all of ℂ, so the bound on g is invalid",
      "The error is in step 6: Liouville's theorem requires f to be bounded by a polynomial, not just bounded, for the stronger conclusion that f is a polynomial",
    ],
  },

  // ── 46. Set Theory (Cardinals) ─────────────────────────────────────────────
  {
    title: "Proof that ℵ₁ = 2^{ℵ₀} (the Continuum Hypothesis is provable)",
    steps: [
      "Let A be an uncountable subset of P(ℕ), i.e., |A| ≥ ℵ₁. We show |A| ≥ 2^{ℵ₀}.",
      "Define a tree T of finite binary sequences as follows: for each σ ∈ {0,1}ⁿ, the set A_σ = {S ∈ A : S agrees with σ on positions 0,...,n−1} (where 'agrees with σ' means the characteristic function of S restricted to {0,...,n−1} equals σ).",
      "At the root (n=0), A_∅ = A is uncountable. At each node σ, A_σ splits into A_{σ0} and A_{σ1}. Since A_σ = A_{σ0} ∪ A_{σ1}.",
      "If A_σ is uncountable, then at least one of A_{σ0}, A_{σ1} is uncountable (a countable union of countable sets is countable).",
      "By induction, we can always choose a path through the tree where each node has uncountable A_σ. This gives a binary sequence b = b₀b₁b₂... where each A_{b|ₙ} is uncountable.",
      "Different paths through the tree correspond to different subsets of ℕ (different characteristic sequences). Each path is associated with at least one element of A (pick one from the uncountable A_{b|ₙ} at each level).",
      "Since there are 2^{ℵ₀} paths through the full binary tree {0,1}^ℕ, and each path gives a distinct element of A, we get |A| ≥ 2^{ℵ₀}.",
      "Therefore every uncountable subset of P(ℕ) has cardinality ≥ 2^{ℵ₀}, i.e., there is no cardinal between ℵ₀ and 2^{ℵ₀}. This proves ℵ₁ = 2^{ℵ₀}. ∎",
    ],
    errorStep: 6,
    errorExplanation:
      "The argument does NOT produce 2^{ℵ₀} distinct elements of A. Step 5 shows that for each path b through the binary tree, the intersection ∩ₙ A_{b|ₙ} is nonempty (in fact uncountable). But different paths b and b' do not necessarily yield DIFFERENT elements of A. It is possible that the same set S ∈ A lies in the intersection for multiple paths — in fact, S lies on exactly ONE path (determined by its characteristic function), but the 'element chosen from A_{b|ₙ}' at each level could be any element, and without the Axiom of Choice applied carefully, we don't get an injection from paths to A. More fundamentally, Cohen proved CH is independent of ZFC, so no proof from ZFC axioms can establish ℵ₁ = 2^{ℵ₀}.",
    distractorExplanations: [
      "The error is in step 3: the induction requires the Axiom of Dependent Choice, which is weaker than full AC but is not provable in ZF alone",
      "The error is in step 1: the tree T has only countably many nodes at each level, so the total number of paths cannot exceed ℵ₁ (the first uncountable cardinal)",
      "The binary tree {0,1}^ℕ has 2^{ℵ₀} paths, but only ℵ₁ of them are 'constructible' in the sense of Gödel's L, so the proof only works in L",
    ],
  },

  // ── 47. Differential Equations (Stability) ─────────────────────────────────
  {
    title: "Proof that every linear system ẋ = Ax with trace(A) < 0 is asymptotically stable",
    steps: [
      "Let A be a real n×n matrix with tr(A) < 0.",
      "The eigenvalues λ₁, ..., λₙ (counted with multiplicity, in ℂ) satisfy ∑Re(λᵢ) = Re(tr(A)) = tr(A) < 0.",
      "Since the sum of the real parts is negative, the average real part is negative: (1/n)∑Re(λᵢ) < 0.",
      "If any eigenvalue had Re(λₖ) ≥ 0, then the remaining eigenvalues would need to compensate: ∑_{i≠k} Re(λᵢ) < 0.",
      "But this is still consistent — some eigenvalues could have positive real part as long as the sum is negative. However, for stability we need ALL eigenvalues to have negative real part.",
      "Consider the Lyapunov equation: A^T P + PA = −Q for positive definite Q. If a solution P > 0 exists, the system is asymptotically stable.",
      "Choose Q = I. Then P = ∫₀^∞ e^{A^T t} e^{At} dt converges if and only if the system is stable (all eigenvalues have negative real part).",
      "By the trace condition: tr(A^T P + PA) = 2tr(PA) = −tr(Q) = −n < 0. Since P > 0, we need 2tr(PA) = −n, which gives tr(PA) = −n/2 < 0.",
      "Since P > 0 and tr(PA) < 0, the matrix PA has negative trace, so its eigenvalues sum to a negative number, which implies all eigenvalues of A have negative real part.",
      "Therefore the system is asymptotically stable. ∎",
    ],
    errorStep: 8,
    errorExplanation:
      "The reasoning is circular and the final conclusion is a non sequitur. Step 6 defines P via an integral that converges ONLY IF the system is already stable — this assumes what we want to prove. Moreover, step 8 claims 'P > 0 and tr(PA) < 0 implies all eigenvalues of A have negative real part,' which is false. The trace of PA being negative says the eigenvalues of PA sum to a negative number, but eigenvalues of PA are NOT simply related to eigenvalues of A (the product PA has different eigenvalues). The counterexample: A = [[−3, 0],[0, 1]] has tr(A) = −2 < 0 but has an eigenvalue +1, so the system is unstable.",
    distractorExplanations: [
      "The Lyapunov equation A^TP + PA = −Q in step 5 has a unique solution only when A has no eigenvalues that sum to zero, which is not guaranteed",
      "The error is in step 1: complex eigenvalues come in conjugate pairs for real matrices, so ∑Re(λᵢ) = tr(A) requires all eigenvalues to be real",
      "The integral in step 6 always converges for any matrix A because the exponential e^{At} is always bounded for finite t",
    ],
  },

  // ── 48. Functional Analysis (Operator Theory) ─────────────────────────────
  {
    title: "Proof that every bounded operator on a Hilbert space is compact",
    steps: [
      "Let T: H → H be a bounded linear operator on a separable Hilbert space with orthonormal basis {eₙ}.",
      "Define the finite-rank operators Tₙ = PₙTPₙ where Pₙ is the orthogonal projection onto span{e₁,...,eₙ}.",
      "Each Tₙ has finite rank (at most n), hence is compact.",
      "We show Tₙ → T in operator norm. For any x ∈ H with ‖x‖ = 1:",
      "‖Tx − Tₙx‖ = ‖Tx − PₙTPₙx‖ ≤ ‖Tx − PₙTx‖ + ‖Pₙ(Tx − TPₙx)‖ ≤ ‖Tx − PₙTx‖ + ‖T‖·‖x − Pₙx‖.",
      "As n → ∞, Pₙx → x for every x (since {eₙ} is a basis), so ‖x − Pₙx‖ → 0.",
      "Similarly, PₙTx → Tx, so ‖Tx − PₙTx‖ → 0.",
      "Therefore ‖Tx − Tₙx‖ → 0 for each x, meaning Tₙ → T pointwise (strongly).",
      "Since compact operators form a closed subspace of B(H) and Tₙ → T, T is compact. ∎",
    ],
    errorStep: 8,
    errorExplanation:
      "Compact operators form a closed subspace of B(H) in the OPERATOR NORM topology, not in the strong (pointwise) topology. Step 7 only establishes strong convergence (Tₙx → Tx for each x), not norm convergence (sup_{‖x‖=1} ‖Tₙx − Tx‖ → 0). Strong convergence of finite-rank operators to T does NOT imply T is compact. The identity operator I on an infinite-dimensional Hilbert space satisfies PₙIPₙ = Pₙ → I strongly, but I is not compact. Every bounded operator is the strong limit of finite-rank operators, but only norm limits of finite-rank operators are compact.",
    distractorExplanations: [
      "The error is in step 1: the operators Tₙ = PₙTPₙ need not have finite rank because T could map span{e₁,...,eₙ} to an infinite-dimensional subspace",
      "The triangle inequality in step 4 should include a factor of 2: ‖Tx − Tₙx‖ ≤ 2‖T‖·‖x − Pₙx‖, which doesn't change the convergence but affects the rate",
      "The error is in step 5: Pₙx → x requires {eₙ} to be a Schauder basis, which is stronger than being an orthonormal basis",
    ],
  },

  // ── 49. Algebraic Number Theory ────────────────────────────────────────────
  {
    title: "Proof that the ring of integers ℤ[√−5] is a unique factorization domain",
    steps: [
      "Consider the ring of integers of ℚ(√−5), which is ℤ[√−5] (since −5 ≡ 3 mod 4, the ring of integers is ℤ[√−5], not ℤ[(1+√−5)/2]).",
      "Define the norm N(a + b√−5) = a² + 5b². This is a multiplicative function: N(αβ) = N(α)N(β).",
      "We claim N provides a Euclidean function, making ℤ[√−5] a Euclidean domain (hence a UFD).",
      "Given α, β ∈ ℤ[√−5] with β ≠ 0, consider α/β ∈ ℚ(√−5). Write α/β = r + s√−5 with r, s ∈ ℚ.",
      "Choose integers m, n closest to r, s respectively, so |r − m| ≤ 1/2 and |s − n| ≤ 1/2.",
      "Let q = m + n√−5 and ρ = α − qβ. Then α = qβ + ρ.",
      "N(ρ) = N(α − qβ) = N(β) · N(α/β − q) = N(β) · ((r−m)² + 5(s−n)²) ≤ N(β) · (1/4 + 5/4) = N(β) · 3/2.",
      "For the Euclidean algorithm to work, we need N(ρ) < N(β), i.e., (r−m)² + 5(s−n)² < 1.",
      "But (r−m)² + 5(s−n)² ≤ 1/4 + 5·(1/4) = 6/4 = 3/2 > 1. So the Euclidean condition N(ρ) < N(β) is NOT guaranteed.",
      "However, the algorithm still works because 3/2 is close to 1... actually no, the Euclidean condition strictly requires N(ρ) < N(β). The bound 3/2 · N(β) > N(β) means this fails. Therefore ℤ[√−5] is not Euclidean. But it could still be a PID (hence UFD) by other means. ∎",
    ],
    errorStep: 9,
    errorExplanation:
      "The proof correctly shows ℤ[√−5] is not Euclidean, then vaguely suggests it might still be a PID/UFD 'by other means.' In fact, ℤ[√−5] is NOT a UFD. The classic counterexample is 6 = 2 · 3 = (1 + √−5)(1 − √−5), where 2, 3, 1 ± √−5 are all irreducible (verified by the norm: N(2) = 4, N(3) = 9, N(1 ± √−5) = 6, and none factor into elements of smaller norm > 1). These are two genuinely distinct factorizations of 6 into irreducibles. The class number of ℚ(√−5) is 2, confirming non-unique factorization.",
    distractorExplanations: [
      "The norm function in step 1 is not multiplicative for ℤ[√−5] because −5 is negative, requiring the absolute value: N(α) = |a² + 5b²| which changes the bounds",
      "The error is in step 4: the closest integers m, n should minimize (r−m)² + 5(s−n)², not |r−m| and |s−n| independently",
      "The error is in step 0: the ring of integers of ℚ(√−5) is actually ℤ[(1+√−5)/2] because −5 ≡ 3 (mod 4), which changes the norm calculation",
    ],
  },

  // ── 50. Combinatorics (Ramsey Theory) ──────────────────────────────────────
  {
    title: "Proof that R(3,3) = 5 (the Ramsey number)",
    steps: [
      "We show that every 2-coloring (red/blue) of the edges of K₅ contains a monochromatic triangle.",
      "Fix a vertex v in K₅. It has 4 edges to the other vertices.",
      "By pigeonhole, at least ⌈4/2⌉ = 2 of these edges have the same color. Say at least 2 edges from v are red, connecting v to vertices a, b.",
      "If edge ab is red, then v, a, b form a red triangle. If ab is blue, we need to find a blue triangle elsewhere.",
      "Consider the remaining vertices c, d (not v, a, or b). The edges among {a, b, c, d} that are blue include ab.",
      "We need to find a blue triangle. Look at edges ac, bc, ad, bd, cd.",
      "If ac and bc are both blue, then a, b, c form a blue triangle (with ab blue). Otherwise, at least one of ac, bc is red.",
      "Similarly for d. But we only have 2 blue edges guaranteed (ab and possibly others), which is not enough to force a blue triangle.",
      "The analysis is inconclusive with only 2 red edges from v. We need 3. ∎",
    ],
    errorStep: 2,
    errorExplanation:
      "The pigeonhole argument is too weak: with 4 edges and 2 colors, pigeonhole gives at least ⌈4/2⌉ = 2 edges of the same color, but the standard proof of R(3,3) = 6 requires at least ⌈5/2⌉ = 3 edges of the same color from a vertex in K₆ (which has 5 edges from each vertex). The proof attempts to show R(3,3) = 5, but the correct value is R(3,3) = 6. K₅ can be 2-colored without a monochromatic triangle (the Ramsey coloring of K₅ based on the Petersen complement achieves this). The error is trying to prove a false statement — R(3,3) = 6, not 5.",
    distractorExplanations: [
      "The error is in step 4: the remaining vertices c, d might have edges to v that are blue, changing the case analysis",
      "The pigeonhole principle in step 2 should give at least 3 red edges because 4 edges into 2 colors gives at least 3 by the strengthened pigeonhole",
      "The error is in step 1: K₅ has 5 vertices so each vertex has 4 neighbors, but the 2-coloring must be considered on all 10 edges simultaneously, not vertex by vertex",
    ],
  },

  // ── 51. Probability (Central Limit Theorem) ───────────────────────────────
  {
    title: "Proof that the CLT holds without the finite variance assumption",
    steps: [
      "Let X₁, X₂, ... be i.i.d. with E[Xᵢ] = 0 (centered). Define Sₙ = X₁ + ... + Xₙ.",
      "The characteristic function of Xᵢ is φ(t) = E[eⁱᵗˣ¹]. Since E[X₁] = 0, φ'(0) = iE[X₁] = 0.",
      "Taylor expand: φ(t) = 1 + φ'(0)t + φ''(0)t²/2 + o(t²) = 1 + 0 + φ''(0)t²/2 + o(t²).",
      "Now φ''(0) = −E[X₁²]. If E[X₁²] = σ² < ∞, then φ(t) = 1 − σ²t²/2 + o(t²).",
      "But we are NOT assuming finite variance. In the infinite variance case, φ(t) = 1 + o(1) as t → 0, which we can still Taylor expand: φ(t) ≈ 1 − c|t|^α for some 0 < α ≤ 2 (by the general theory of stable distributions).",
      "The characteristic function of Sₙ/n^{1/α} is [φ(t/n^{1/α})]ⁿ ≈ [1 − c|t|^α/n]ⁿ → e^{−c|t|^α}.",
      "This is the characteristic function of a stable distribution with index α.",
      "When α = 2, this gives the normal distribution, recovering the classical CLT.",
      "For α < 2, we get a non-normal stable limit. So Sₙ/n^{1/α} converges in distribution to a stable law.",
      "Since stable distributions approach the normal distribution as α → 2, the CLT still holds in the limit: the normalized sum converges to a normal distribution. ∎",
    ],
    errorStep: 9,
    errorExplanation:
      "The conclusion 'since stable distributions approach normal as α → 2, the CLT still holds' is a fallacy. The parameter α is fixed by the distribution of X₁ — it does not vary or approach 2. If X₁ has infinite variance, then α < 2 is determined by the tail behavior of X₁, and the limit distribution is a non-Gaussian stable law, period. The CLT (convergence to normal) genuinely requires finite variance. The proof correctly derives the generalized CLT (convergence to stable laws) in steps 5-8, but then falsely claims this implies convergence to normal by 'taking α → 2,' conflating a fixed distributional parameter with a limiting process.",
    distractorExplanations: [
      "The Taylor expansion in step 2 requires φ to be twice differentiable, which fails when E[X₁²] = ∞",
      "The approximation in step 4 is only valid for symmetric distributions; for skewed distributions, the characteristic function has an imaginary correction term",
      "The error is in step 5: [1 − c|t|^α/n]ⁿ → e^{−c|t|^α} requires c > 0, but for some distributions c = 0 (when the distribution is in the domain of attraction of a degenerate law)",
    ],
  },

  // ── 52. Real Analysis (Banach Spaces) ──────────────────────────────────────
  {
    title: "Proof that L¹[0,1] and L²[0,1] are isomorphic as Banach spaces",
    steps: [
      "Define a linear map T: L²[0,1] → L¹[0,1] by T(f) = f (the identity map on functions).",
      "By Cauchy-Schwarz: ‖f‖₁ = ∫|f| ≤ (∫1²)^{1/2}(∫|f|²)^{1/2} = ‖f‖₂. So T is bounded with ‖T‖ ≤ 1.",
      "T is injective: if T(f) = 0 in L¹, then ∫|f| = 0, so f = 0 a.e., hence f = 0 in L².",
      "T is surjective: for any g ∈ L¹[0,1], define gₙ = g · 1_{|g|≤n} (truncation). Then gₙ ∈ L²[0,1] since |gₙ|² ≤ n|gₙ| ≤ n|g| ∈ L¹.",
      "The sequence {gₙ} is Cauchy in L²: ‖gₙ − gₘ‖₂² = ∫|g|²·1_{m<|g|≤n} ≤ n∫|g|·1_{m<|g|≤n} → 0 as m,n → ∞ (since ∫|g| < ∞ and the sets {|g| > m} have measure → 0).",
      "Since L² is complete, gₙ → h in L² for some h ∈ L². And gₙ → g in L¹ (since ‖g − gₙ‖₁ = ∫|g|·1_{|g|>n} → 0).",
      "Since gₙ → h in L² and gₙ → g in L¹, and L² convergence implies L¹ convergence (by Cauchy-Schwarz), we get g = h a.e., so g = T(h) ∈ T(L²).",
      "So T is a bijection. By the open mapping theorem, T⁻¹ is also bounded. Hence T is an isomorphism of Banach spaces. ∎",
    ],
    errorStep: 4,
    errorExplanation:
      "The claim that {gₙ} is Cauchy in L² is false for general g ∈ L¹. The bound ‖gₙ − gₘ‖₂² ≤ n∫|g|·1_{m<|g|≤n} does not go to 0 as m,n → ∞ in general. Consider g(x) = x^{−1/2} on (0,1]: g ∈ L¹ but g ∉ L². The truncations gₙ have ‖gₙ‖₂² = ∫₀¹ min(|g|², n²) dx → ∫|g|² = ∞, so {gₙ} is not Cauchy in L². The map T is injective and bounded but NOT surjective: L²[0,1] is a proper subspace of L¹[0,1]. In fact, L¹ and L² are not isomorphic as Banach spaces (L² is reflexive while L¹ is not).",
    distractorExplanations: [
      "The error is in step 6: g = h a.e. requires uniqueness of limits in L¹, but L¹ limits are only unique up to measure-zero sets, which could differ for L¹ and L²",
      "The open mapping theorem in step 7 requires both spaces to be Banach, but the identity map between different norms creates a topological obstruction",
      "The error is in step 1: Cauchy-Schwarz gives ‖f‖₁ ≤ ‖f‖₂ only on [0,1] where the measure is finite; on infinite measure spaces the inequality reverses",
    ],
  },

  // ── 53. Abstract Algebra (Representation Theory) ──────────────────────────
  {
    title: "Proof that every representation of a finite group over ℂ is one-dimensional",
    steps: [
      "Let G be a finite group and ρ: G → GL(V) a representation over ℂ, with dim V = n.",
      "By Maschke's theorem, every representation of G over ℂ is completely reducible (semisimple).",
      "So V = V₁ ⊕ V₂ ⊕ ... ⊕ Vₖ where each Vᵢ is an irreducible representation.",
      "By Schur's lemma, if Vᵢ is irreducible, then End_G(Vᵢ) ≅ ℂ (since ℂ is algebraically closed).",
      "This means every G-equivariant endomorphism of Vᵢ is a scalar multiple of the identity.",
      "In particular, for each g ∈ G, ρ(g)|_{Vᵢ} is a G-endomorphism of Vᵢ (by... wait, ρ(g) is not an endomorphism in the representation-theoretic sense; it is the representation itself).",
      "Let us reconsider: ρ(g) commutes with every G-equivariant map. Actually, ρ(g) IS the group action, and by Schur's lemma, any map commuting with all ρ(g) is scalar. But ρ(g) itself need not commute with all ρ(h).",
      "Actually, in an irreducible representation, the center Z(G) acts by scalars (by Schur). If G is abelian, then G = Z(G), so every element acts by a scalar on each irreducible Vᵢ.",
      "When G is abelian, dim Vᵢ = 1 for each irreducible Vᵢ. Since every representation decomposes into irreducibles, every representation of G is a sum of one-dimensional representations.",
      "Since G was arbitrary, every representation of any finite group is a sum of one-dimensional representations. ∎",
    ],
    errorStep: 9,
    errorExplanation:
      "The proof correctly shows that every irreducible representation of an ABELIAN group is one-dimensional (steps 7-8), but then universally quantifies over 'any finite group' in step 9, dropping the crucial abelian hypothesis. Non-abelian groups have irreducible representations of dimension > 1. For example, S₃ has an irreducible 2-dimensional representation (the standard representation). The dimension formula ∑(dim Vᵢ)² = |G| shows that non-abelian groups (which have fewer conjugacy classes than elements) must have irreducible representations of dimension > 1.",
    distractorExplanations: [
      "Maschke's theorem in step 1 requires char(ℂ) ∤ |G|, and since char(ℂ) = 0, this always holds — so Maschke's theorem is not the issue",
      "Schur's lemma in step 3 requires the representation to be finite-dimensional, which should be stated explicitly",
      "The error is in step 7: for abelian groups, Schur's lemma gives End_G(Vᵢ) ≅ ℂ but does not force dim Vᵢ = 1 — it only forces the endomorphism algebra to be commutative",
    ],
  },

  // ── 54. Topology (Homology) ────────────────────────────────────────────────
  {
    title: "Proof that the homology groups of the torus T² and the Klein bottle K are identical",
    steps: [
      "The torus T² has CW structure: one 0-cell, two 1-cells a, b, one 2-cell attached via aba⁻¹b⁻¹.",
      "The Klein bottle K has CW structure: one 0-cell, two 1-cells a, b, one 2-cell attached via abab⁻¹.",
      "Compute cellular chain complexes. For both: C₂ = ℤ (generated by the 2-cell), C₁ = ℤ² (generated by a, b), C₀ = ℤ.",
      "The boundary map ∂₁: C₁ → C₀ sends both a and b to 0 (since each 1-cell is a loop based at the single 0-cell). This is the same for both T² and K.",
      "For T²: ∂₂(σ) = a + b − a − b = 0. So H₂(T²) = ker(∂₂→C₁)/im(∂₃→C₂) = ℤ/0 = ℤ, H₁(T²) = ℤ²/0 = ℤ², H₀ = ℤ.",
      "For K: ∂₂(σ) = a + b + a − b = 2a. So H₂(K) = ker(∂₂)/0 = ker(2a: ℤ → ℤ²) = 0 (since 2a ≠ 0).",
      "H₁(K) = ℤ²/im(∂₂) = ℤ²/⟨(2,0)⟩ ≅ ℤ/2ℤ × ℤ. H₀(K) = ℤ.",
      "So H₁(T²) = ℤ² while H₁(K) = ℤ ⊕ ℤ/2ℤ, and H₂(T²) = ℤ while H₂(K) = 0.",
      "But with ℤ/2ℤ coefficients: H₁(T²; ℤ/2) = (ℤ/2)² and H₁(K; ℤ/2) = (ℤ/2)². And H₂(T²; ℤ/2) = ℤ/2 while H₂(K; ℤ/2) = ℤ/2 (from the universal coefficient theorem). So all homology groups agree with ℤ/2 coefficients!",
      "Since the homology groups agree over ℤ/2, they agree over ℤ (by the universal coefficient theorem applied in reverse). Therefore H*(T²; ℤ) ≅ H*(K; ℤ). ∎",
    ],
    errorStep: 9,
    errorExplanation:
      "The universal coefficient theorem does NOT work 'in reverse' — agreement of homology with ℤ/2 coefficients does not imply agreement with ℤ coefficients. The UCT expresses H_n(X; R) in terms of H_n(X; ℤ), not the other way around. Homology with ℤ/2 coefficients loses torsion information: it cannot distinguish ℤ from ℤ/2ℤ (both give ℤ/2 when tensored with ℤ/2). The proof's own computation (steps 4-7) correctly shows the integer homology groups DIFFER: H₁(T²) = ℤ² ≠ ℤ ⊕ ℤ/2ℤ = H₁(K) and H₂(T²) = ℤ ≠ 0 = H₂(K).",
    distractorExplanations: [
      "The CW structure of the Klein bottle in step 1 is wrong: the attaching word should be aba⁻¹b, not abab⁻¹",
      "The boundary computation ∂₂(σ) = 2a in step 5 is incorrect: the correct boundary of the 2-cell for K is a + b + a + b = 2a + 2b",
      "The error is in step 8: H₂(K; ℤ/2) = 0 (not ℤ/2) because the Klein bottle is non-orientable, so the fundamental class doesn't exist even over ℤ/2",
    ],
  },

  // ── 55. Measure Theory (Radon-Nikodym) ─────────────────────────────────────
  {
    title: "Proof that every σ-finite measure is absolutely continuous with respect to Lebesgue measure",
    steps: [
      "Let μ be a σ-finite measure on (ℝ, B(ℝ)) and λ the Lebesgue measure.",
      "Write ℝ = ∪Aₙ with μ(Aₙ) < ∞ for each n.",
      "For each n, define μₙ = μ|_{Aₙ} (the restriction). Each μₙ is a finite measure.",
      "For a finite measure μₙ, consider the Lebesgue decomposition: μₙ = μₙ^{ac} + μₙ^{s} where μₙ^{ac} ≪ λ and μₙ^{s} ⊥ λ.",
      "By the Radon-Nikodym theorem, μₙ^{ac} has a density fₙ with respect to λ: dμₙ^{ac} = fₙ dλ.",
      "Now μ = ∑μₙ, so dμ = ∑fₙ dλ + ∑dμₙ^{s}.",
      "For the singular part: each μₙ^{s} is concentrated on a set Sₙ with λ(Sₙ) = 0. The union S = ∪Sₙ satisfies λ(S) = 0 (countable union of measure-zero sets).",
      "Since the singular part ∑μₙ^{s} is concentrated on S with λ(S) = 0, and μ is σ-finite, the singular part must actually be zero because a σ-finite measure cannot charge a set of Lebesgue measure zero with positive mass.",
      "Therefore μ = ∑fₙ dλ, so μ ≪ λ. ∎",
    ],
    errorStep: 7,
    errorExplanation:
      "The claim that 'a σ-finite measure cannot charge a set of Lebesgue measure zero with positive mass' is completely false. Any discrete measure (e.g., counting measure on ℤ, or a single point mass δ₀) charges a Lebesgue-null set with positive mass. Counting measure on ℤ is σ-finite (ℤ = ∪{n} with counting measure 1 on each {n}), concentrates on a countable (hence Lebesgue-null) set, yet assigns infinite mass to ℤ. Even the simpler example μ = δ₀ is σ-finite and singular to Lebesgue measure. The Lebesgue decomposition can have a nontrivial singular part for σ-finite measures.",
    distractorExplanations: [
      "The error is in step 5: ∑μₙ is not the same as μ because the Aₙ may overlap, causing double-counting",
      "The Radon-Nikodym theorem in step 4 requires both measures to be σ-finite, and λ is σ-finite but μₙ is only finite, creating a mismatch",
      "The error is in step 6: a countable union of Lebesgue-null sets can have positive measure if the sets are not pairwise disjoint",
    ],
  },

  // ── 56. Complex Analysis (Conformal Mapping) ──────────────────────────────
  {
    title: "Proof that every simply connected open subset of ℂ is conformally equivalent to ℂ",
    steps: [
      "Let Ω ⊆ ℂ be a simply connected open set (not all of ℂ — wait, we include ℂ itself).",
      "By the Riemann mapping theorem, every simply connected proper open subset of ℂ is conformally equivalent to the open unit disk 𝔻.",
      "The open unit disk 𝔻 is conformally mapped to ℂ by the map f(z) = z/(1−|z|²)... no, that's not holomorphic. Use f(z) = tan(πz/2)... no, that maps (−1,1) to ℝ.",
      "Consider the exponential map g: ℂ → ℂ \\ {0}. This is a conformal map from ℂ to a proper subset of ℂ.",
      "Alternatively, consider the Cayley transform w = (z − i)/(z + i) mapping the upper half-plane ℍ to 𝔻. Since ℍ is simply connected and conformally equivalent to 𝔻, and ℍ ≅ 𝔻.",
      "Now ℂ is simply connected. Define a map from ℂ to 𝔻 by h(z) = z/(1+|z|)... this is not holomorphic. Use h(z) = z/(1+z²)^{1/2}... also problematic.",
      "In fact, there is no conformal (biholomorphic) map from ℂ onto 𝔻: by Liouville's theorem, a bounded entire function is constant, so any holomorphic map ℂ → 𝔻 is constant.",
      "Therefore ℂ is NOT conformally equivalent to 𝔻. So the statement 'every simply connected domain is conformally equivalent to ℂ' is false since proper simply connected domains are equivalent to 𝔻 (by Riemann), while ℂ is not equivalent to 𝔻.",
      "But we can still salvage this: all simply connected proper open subsets are equivalent to 𝔻, and ℂ is equivalent to ℂ, so they're all equivalent to each other (transitivity). ∎",
    ],
    errorStep: 8,
    errorExplanation:
      "Step 7 correctly proves that ℂ ≇ 𝔻 (Liouville). But step 8 then claims 'they're all equivalent to each other' via transitivity, which fails precisely because the equivalence classes are {ℂ} and {proper simply connected domains ≅ 𝔻}. Transitivity gives: any two proper simply connected domains are equivalent (both ≅ 𝔻), and ℂ ≅ ℂ, but a proper simply connected domain ≅ 𝔻 ≇ ℂ. The proof's own logic (steps 6-7) shows the conclusion is false, then ignores this by a bogus transitivity argument that skips the gap between the two equivalence classes.",
    distractorExplanations: [
      "The Riemann mapping theorem in step 1 requires the boundary of Ω to contain at least two points, not just that Ω is proper",
      "The error is in step 6: Liouville's theorem requires the entire function to be bounded on all of ℂ, but a map to 𝔻 is bounded by definition, so the argument is actually correct and there is no error",
      "The Cayley transform in step 4 is not surjective onto 𝔻 — it misses the boundary point −1",
    ],
  },

  // ── 57. Category Theory (Adjunctions) ─────────────────────────────────────
  {
    title: "Proof that the forgetful functor from Groups to Sets has a right adjoint",
    steps: [
      "Let U: Grp → Set be the forgetful functor sending a group to its underlying set.",
      "A right adjoint R: Set → Grp would satisfy Hom_Set(U(G), S) ≅ Hom_Grp(G, R(S)) naturally in G and S.",
      "We claim R(S) = the group of all functions S → ℤ (the free abelian group on S), with R(f) being precomposition.",
      "For a set S, define R(S) = ℤˢ = {f: S → ℤ}, with pointwise addition.",
      "Check the adjunction: Hom_Grp(G, ℤˢ) ≅ Hom_Set(U(G), S)? The left side consists of group homomorphisms G → ℤˢ, and the right side consists of set functions from the underlying set of G to S.",
      "A group homomorphism φ: G → ℤˢ determines, for each g ∈ G, a function φ(g): S → ℤ. By the evaluation map, for each s ∈ S, evₛ ∘ φ: G → ℤ is a group homomorphism.",
      "So a homomorphism G → ℤˢ corresponds to a family of homomorphisms {G → ℤ}_{s∈S}, i.e., an element of Hom_Grp(G, ℤ)ˢ.",
      "For the right adjoint, we need Hom_Grp(G, R(S)) ≅ Hom_Set(U(G), S). But we got Hom_Grp(G, ℤˢ) ≅ Hom(G,ℤ)ˢ, not Hom_Set(U(G), S).",
      "Unless Hom(G,ℤ)ˢ ≅ Hom_Set(U(G), S) naturally, which would require |Hom(G,ℤ)| = |U(G)|, i.e., the number of group homomorphisms from G to ℤ equals the cardinality of G. This fails for finite groups (only the trivial homomorphism G → ℤ exists when G is finite).",
      "Therefore the construction fails. But the forgetful functor has a right adjoint anyway — we just chose the wrong one. ∎",
    ],
    errorStep: 9,
    errorExplanation:
      "The final claim 'the forgetful functor U: Grp → Set has a right adjoint anyway' is false. U has a LEFT adjoint (the free group functor F: Set → Grp), not a right adjoint. A right adjoint to U would require U to preserve colimits (which it does, as left adjoints preserve colimits and U being a right adjoint would mean something else). Actually, U: Grp → Set preserves limits (which is automatic for forgetful functors from algebraic categories) but does NOT preserve all colimits — for instance, it doesn't preserve coproducts (the free product of groups is not the disjoint union of underlying sets). Since a functor with a right adjoint must preserve colimits, and U doesn't, U has no right adjoint. The cofree group functor does not exist in any useful sense.",
    distractorExplanations: [
      "The error is in step 2: ℤˢ with pointwise addition is an abelian group, but we need R(S) to be in Grp which includes non-abelian groups, so the functor lands in the wrong category",
      "The free abelian group on S is ℤ^{(S)} (direct sum), not ℤˢ (direct product), and this distinction matters for infinite S because the direct sum has finite support",
      "The error is in step 5: the evaluation map evₛ ∘ φ is a set function, not a group homomorphism, because evaluation doesn't preserve the group structure",
    ],
  },

  // ── 58. Algebraic Geometry (Schemes) ───────────────────────────────────────
  {
    title: "Proof that Spec(ℤ) is a point (has only one prime ideal)",
    steps: [
      "Recall Spec(ℤ) = {prime ideals of ℤ} with the Zariski topology.",
      "The prime ideals of ℤ are: (0) and (p) for each prime number p.",
      "The Zariski topology on Spec(ℤ) has closed sets V(I) = {P ∈ Spec(ℤ) : P ⊇ I} for ideals I of ℤ.",
      "The closure of a point (p) is V((p)) = {Q : Q ⊇ (p)} = {(p)} (since the only prime containing (p) and containing (p) is (p) itself).",
      "Wait: (0) ⊆ (p) means (0) ⊇ (p)? No — (p) ⊆ (0) is false since p ∈ (p) but p ∉ (0) only if (0) = {0}. Hmm: (0) ⊆ (p) since 0 ∈ (p). And (p) ⊄ (0) since p ≠ 0.",
      "So V((p)) = {Q ∈ Spec(ℤ) : Q ⊇ (p)} = {(p)} because (0) ⊉ (p) and no (q) for q ≠ p contains (p) (since p ∉ (q) when q ≠ p).",
      "Therefore each closed point {(p)} is closed. The generic point (0) is dense (its closure is all of Spec(ℤ)).",
      "Since (0) is dense and every closed set containing (0) is all of Spec(ℤ), and (0) is the unique generic point, and the space is irreducible...",
      "An irreducible space with a unique generic point has the property that the generic point is contained in every nonempty open set. Since there's essentially only one point that matters (the generic point), Spec(ℤ) is quasi-compact and irreducible, hence 'essentially a point.'",
      "Therefore Spec(ℤ) has only one prime ideal. ∎",
    ],
    errorStep: 8,
    errorExplanation:
      "The argument confuses 'irreducible' with 'having one point.' An irreducible topological space has a unique generic point (in the case of schemes), but that does not mean the space has only one point. Spec(ℤ) is irreducible (since ℤ is a domain, (0) is prime, and V((0)) = Spec(ℤ)), but it has infinitely many points: (0), (2), (3), (5), (7), .... The statement 'essentially a point' is meaningless in rigorous topology. Irreducibility means every two nonempty open sets intersect, not that the space is a singleton. The proof's own earlier steps (5-6) correctly identify infinitely many distinct closed points.",
    distractorExplanations: [
      "The error is in step 5: V((p)) should also include (0) because (0) is the zero ideal which is contained in every ideal, so (0) ⊇ (p) is vacuously true",
      "The Zariski topology in step 2 uses closed sets V(I), but for Spec(ℤ) one should use the étale topology to correctly detect all primes",
      "The error is in step 3: the closure of (p) is not {(p)} but rather {(0), (p)} because in the Zariski topology, the generic point is in the closure of every point",
    ],
  },

  // ── 59. Probability (Conditional Expectation) ─────────────────────────────
  {
    title: "Proof that E[X | Y] = E[X] for all random variables X, Y",
    steps: [
      "Let X, Y be random variables on a probability space (Ω, F, P).",
      "The conditional expectation E[X | Y] is the unique σ(Y)-measurable random variable satisfying ∫_A E[X|Y] dP = ∫_A X dP for all A ∈ σ(Y).",
      "Consider the constant random variable c = E[X]. This is trivially σ(Y)-measurable (constants are measurable with respect to any σ-algebra).",
      "Check the defining property: for any A ∈ σ(Y), ∫_A c dP = c · P(A).",
      "We need this to equal ∫_A X dP. Now ∫_A X dP = E[X · 1_A].",
      "Since A ∈ σ(Y), the indicator 1_A is σ(Y)-measurable, hence 1_A = g(Y) for some Borel function g.",
      "E[X · g(Y)] = E[X] · E[g(Y)] = c · E[1_A] = c · P(A).",
      "This equals ∫_A c dP = c · P(A). ✓",
      "So the defining property is satisfied, and by uniqueness, E[X | Y] = E[X] = c a.s. ∎",
    ],
    errorStep: 6,
    errorExplanation:
      "The step E[X · g(Y)] = E[X] · E[g(Y)] assumes that X and g(Y) are independent. This is true when X and Y are independent, but the problem statement makes no independence assumption. For dependent X and Y, E[X · g(Y)] ≠ E[X] · E[g(Y)] in general. The correct statement is: E[X | Y] = E[X] if and only if X is independent of Y (more precisely, independent of σ(Y)). For dependent variables, conditional expectation genuinely depends on Y.",
    distractorExplanations: [
      "The error is in step 2: the constant c = E[X] is σ(Y)-measurable only if Y is a discrete random variable",
      "The defining property in step 1 should hold for all A ∈ F, not just A ∈ σ(Y), making the condition more restrictive",
      "The error is in step 5: 1_A = g(Y) requires Y to be injective (one-to-one), which is not guaranteed for general random variables",
    ],
  },

  // ── 60. Real Analysis (Fourier Analysis) ───────────────────────────────────
  {
    title: "Proof that the Fourier series of every L² function converges uniformly",
    steps: [
      "Let f ∈ L²([0, 2π]) with Fourier coefficients ĉₙ = (1/2π) ∫₀^{2π} f(x)e^{−inx} dx.",
      "By Parseval's theorem, ∑|ĉₙ|² = (1/2π)‖f‖₂² < ∞.",
      "The partial sums Sₙ(x) = ∑_{|k|≤n} ĉₖ eⁱᵏˣ converge to f in L²-norm: ‖f − Sₙ‖₂ → 0.",
      "To show uniform convergence, bound |f(x) − Sₙ(x)| = |∑_{|k|>n} ĉₖ eⁱᵏˣ|.",
      "By the triangle inequality: |∑_{|k|>n} ĉₖ eⁱᵏˣ| ≤ ∑_{|k|>n} |ĉₖ| · |eⁱᵏˣ| = ∑_{|k|>n} |ĉₖ|.",
      "By Cauchy-Schwarz: ∑_{|k|>n} |ĉₖ| = ∑_{|k|>n} |ĉₖ| · 1 ≤ (∑_{|k|>n} |ĉₖ|²)^{1/2} · (∑_{|k|>n} 1)^{1/2}.",
      "Now ∑_{|k|>n} |ĉₖ|² → 0 by Parseval (tail of convergent series). And ∑_{|k|>n} 1 = ... this is infinite (the sum of 1 over all |k| > n diverges).",
      "So the Cauchy-Schwarz bound gives ∑|ĉₖ| ≤ (finite)^{1/2} · ∞ = ∞. This doesn't work.",
      "Instead, use the Weierstrass M-test: if ∑|ĉₙ| < ∞ (absolute convergence of Fourier series), then the series converges uniformly. And ∑|ĉₙ| < ∞ follows from ∑|ĉₙ|² < ∞ since |ĉₙ| ≤ |ĉₙ|² for |ĉₙ| ≤ 1 (which holds for large n since ĉₙ → 0). ∎",
    ],
    errorStep: 8,
    errorExplanation:
      "The claim that ∑|ĉₙ| < ∞ follows from ∑|ĉₙ|² < ∞ is false — ℓ² summability does NOT imply ℓ¹ summability. The sequence ĉₙ = 1/n satisfies ∑1/n² < ∞ but ∑1/n = ∞. The inequality |ĉₙ| ≤ |ĉₙ|² when |ĉₙ| ≤ 1 is backwards: for |ĉₙ| ≤ 1, we have |ĉₙ|² ≤ |ĉₙ|, not the other way around. So ℓ² gives a WEAKER condition than ℓ¹. In fact, the Fourier series of a general L² function does NOT converge uniformly — the function f(x) = ∑(sin nx)/n is in L² but its Fourier series does not converge uniformly (it represents a sawtooth wave with Gibbs phenomenon at the jump).",
    distractorExplanations: [
      "The error is in step 4: the triangle inequality |∑aₖeⁱᵏˣ| ≤ ∑|aₖ| is only valid for finite sums, and the interchange with the infinite series requires absolute convergence, which is what we're trying to prove",
      "Parseval's theorem in step 1 requires f to be continuous, not just L² — for discontinuous L² functions, the Fourier coefficients may not satisfy ∑|ĉₙ|² < ∞",
      "The error is in step 2: L²-convergence of Sₙ to f does not imply pointwise convergence, so bounding |f(x) − Sₙ(x)| pointwise is meaningless for L² functions",
    ],
  },
];
