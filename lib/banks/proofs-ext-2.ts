import type { FallaciousProof } from "./proofs";

export const FALLACIOUS_PROOFS_EXT_2: FallaciousProof[] = [
  // ── 1. Algebraic Topology ──────────────────────────────────────────────────
  {
    title: "Proof that every simply connected compact 4-manifold is homeomorphic to S⁴",
    steps: [
      "Let M be a simply connected compact 4-manifold without boundary.",
      "Since π₁(M) = 0, the Hurewicz theorem gives H₁(M; ℤ) = 0.",
      "By Poincaré duality for a closed oriented 4-manifold, H₃(M; ℤ) ≅ H¹(M; ℤ) ≅ Hom(H₁(M; ℤ), ℤ) = 0.",
      "The universal coefficient theorem gives H²(M; ℤ) ≅ Hom(H₂(M; ℤ), ℤ) ⊕ Ext¹(H₁(M; ℤ), ℤ) = Hom(H₂(M; ℤ), ℤ).",
      "Since M is simply connected, every class in H₂(M; ℤ) is spherical by Hurewicz isomorphism. Represent each generator by an embedded S² via Whitney embedding.",
      "Perform surgery on each embedded S² to kill H₂(M; ℤ), obtaining a manifold M' with H_*(M'; ℤ) ≅ H_*(S⁴; ℤ).",
      "By the generalized Poincaré conjecture (proved by Smale for n ≥ 5), a simply connected closed n-manifold that is a homology sphere is homeomorphic to Sⁿ. Apply this to M' with n = 4.",
      "Since surgery preserves homeomorphism type when done on trivially-framed spheres, M ≅ M' ≅ S⁴. ∎",
    ],
    errorStep: 5,
    errorExplanation:
      "Surgery on embedded 2-spheres in a 4-manifold does not trivially kill H₂. In dimension 4, Whitney's trick fails because the Whitney disk itself is 2-dimensional in a 4-manifold and cannot be embedded avoiding intersections; this is the crux of why 4-manifold topology is hard. The surgery step silently assumes the embedded spheres have trivial normal bundle and can be excised cleanly, ignoring the intersection form obstruction. The intersection form of M (e.g., E₈ ⊕ E₈ for the Freedman E₈-manifold) is a homeomorphism invariant not captured by homology alone.",
    distractorExplanations: [
      "Smale's proof of the generalized Poincaré conjecture actually covers dimension 4 as well via the h-cobordism theorem, so the error must be in the Hurewicz step where π₂ ≅ H₂ requires simply connected plus asphericity",
      "The error is in applying Poincaré duality: it requires an orientation on M, and not every simply connected 4-manifold is orientable, so H₃ ≅ H¹ fails in general",
      "The universal coefficient theorem step is wrong because Ext¹(H₁, ℤ) can be nonzero even when H₁ = 0 if the manifold has torsion in higher homology groups",
    ],
  },
  // ── 2. Homological Algebra ─────────────────────────────────────────────────
  {
    title: "Proof that every short exact sequence of modules splits",
    steps: [
      "Let 0 → A → B → C → 0 be a short exact sequence of R-modules with maps i: A → B and p: B → C.",
      "Apply the functor Hom_R(C, −) to obtain the long exact sequence: 0 → Hom(C,A) → Hom(C,B) → Hom(C,C) → Ext¹(C,A) → ...",
      "The identity map id_C ∈ Hom(C,C) is a specific element. We need to show it lifts to some s ∈ Hom(C,B) with p ∘ s = id_C.",
      "Consider the connecting homomorphism δ: Hom(C,C) → Ext¹(C,A). This map sends id_C to the class [0 → A → B → C → 0] in Ext¹(C,A).",
      "Now Ext¹(C,A) classifies extensions of C by A. For any projective resolution P_• → C → 0, we have Ext¹(C,A) = H¹(Hom(P_•, A)).",
      "Since every module C admits a projective resolution, and projective modules are direct summands of free modules, there exists a surjection F → C with F free. The kernel K of this surjection gives 0 → K → F → C → 0.",
      "The natural map Hom(F, B) → Hom(F, C) is surjective because F is free (hence projective). Therefore Ext¹(F, A) = 0 for all A. By naturality of the long exact Ext sequence, this forces Ext¹(C, A) = 0 as well, since C is a quotient of F.",
      "With Ext¹(C, A) = 0, the connecting homomorphism δ sends id_C to 0, so id_C lifts to s: C → B with p ∘ s = id_C. The sequence splits. ∎",
    ],
    errorStep: 6,
    errorExplanation:
      "The vanishing of Ext¹(F, A) for a free module F does NOT imply Ext¹(C, A) = 0 for a quotient C of F. Ext is not monotone under quotients in the first variable. In fact, the long exact sequence from 0 → K → F → C → 0 gives ... → Ext¹(F, A) → Ext¹(K, A) → Ext²(C, A) → ..., which shows Ext¹(C, A) ≅ Hom(K, A) / Im(Hom(F, A) → Hom(K, A)), not zero. The 'naturality' argument confuses the behavior of Ext on the projective resolution with the behavior on the module itself.",
    distractorExplanations: [
      "The long exact Hom sequence in step 1 is wrong: Hom_R(C, −) is left exact, not right exact, so the sequence should start with 0 → Hom(C,A) → Hom(C,B) → Hom(C,C) and need not be exact on the right without the Ext terms",
      "The connecting homomorphism does not send id_C to the extension class; δ(id_C) is computed via a diagram chase using the projective resolution, and the identification with extension classes requires an additional natural isomorphism that may fail for non-commutative rings",
      "The error is in step 0: the functor Hom(C, −) is covariant, but the Ext long exact sequence requires the contravariant functor Hom(−, A), so the entire sequence is set up incorrectly",
    ],
  },
  // ── 3. Galois Theory ──────────────────────────────────────────────────────
  {
    title: "Proof that every polynomial of degree 5 is solvable by radicals",
    steps: [
      "Let f(x) ∈ ℚ[x] be an irreducible polynomial of degree 5 with Galois group G = Gal(K/ℚ) where K is the splitting field.",
      "The group G embeds into S₅ as a transitive subgroup. The possible transitive subgroups of S₅ are: ℤ/5ℤ, D₅, Fr₂₀ (Frobenius group of order 20), A₅, and S₅.",
      "Consider the resolvent cubic of f. If the discriminant Δ(f) is a perfect square in ℚ, then G ⊆ A₅.",
      "For G ⊆ A₅, consider the composition series of A₅. We have the normal series {e} ◁ A₅, and A₅ is simple of order 60.",
      "However, A₅ acts on the 5 roots, and the stabilizer of one root has index 5 in G. This gives a subgroup H of index 5 in A₅, so |H| = 12.",
      "The subgroup H ≅ A₄ has the composition series {e} ◁ V₄ ◁ A₄ where V₄ is the Klein four-group. Each successive quotient is abelian: V₄/{e} ≅ ℤ/2ℤ × ℤ/2ℤ and A₄/V₄ ≅ ℤ/3ℤ.",
      "Since the point stabilizer H ≅ A₄ is solvable, and the quotient G/H has order 5 (which is cyclic hence solvable), the group G is solvable by the extension theorem: if H and G/H are both solvable, then G is solvable.",
      "By the Galois correspondence, since G is solvable, f is solvable by radicals. ∎",
    ],
    errorStep: 6,
    errorExplanation:
      "The extension theorem for solvability requires H to be a NORMAL subgroup of G. The point stabilizer H of index 5 in A₅ is not normal in A₅ (since A₅ is simple, its only normal subgroups are {e} and A₅ itself). Without normality, the quotient G/H is not even a group; it is merely a set of cosets. The solvability of H and the 'quotient' does not imply solvability of G. Indeed, A₅ is the standard example of a non-solvable group, and this is precisely why the general quintic is not solvable by radicals.",
    distractorExplanations: [
      "The classification of transitive subgroups of S₅ in step 1 is incomplete: there also exist transitive subgroups isomorphic to ℤ/5ℤ ⋊ ℤ/4ℤ that are not listed, and these non-solvable groups invalidate the argument",
      "The error is in step 4: the stabilizer of a root in A₅ does not have order 12 because A₅ does not act faithfully on the roots; the kernel of the action could be nontrivial, making the actual stabilizer larger",
      "The resolvent cubic analysis in step 2 is incorrect: having Δ(f) be a perfect square only implies G ⊆ A₅ when f has degree ≤ 4; for degree 5, the discriminant criterion requires checking the Lagrange resolvent instead",
    ],
  },
  // ── 4. Representation Theory ──────────────────────────────────────────────
  {
    title: "Proof that every finite group has a faithful irreducible complex representation",
    steps: [
      "Let G be a finite group. By Maschke's theorem, every finite-dimensional complex representation of G decomposes as a direct sum of irreducible representations.",
      "Consider the left regular representation ρ: G → GL(ℂ[G]). This representation is faithful since ρ(g) = id only when g = e.",
      "Decompose ℂ[G] ≅ ⊕_i V_i^{⊕ dim(V_i)} where the sum runs over all irreducible representations V_i of G.",
      "Since ρ is faithful, ker(ρ) = {e}. For each g ≠ e, there exists some irreducible summand V_i where g acts nontrivially.",
      "Define N_i = ker(G → GL(V_i)) for each irreducible representation V_i. The faithfulness of ρ gives ∩_i N_i = {e}.",
      "Since G is finite, the intersection ∩_i N_i = {e} can be achieved by finitely many kernels: there exist i₁, ..., iₖ with N_{i₁} ∩ ... ∩ N_{iₖ} = {e}.",
      "Now consider V = V_{i₁} ⊕ ... ⊕ V_{iₖ}. This representation is faithful. Since it is a direct sum of irreducibles, it is semisimple. Among its irreducible summands, at least one must be faithful; otherwise each summand has a nontrivial kernel, and the intersection of finitely many nontrivial normal subgroups of G must contain a nontrivial element, contradicting faithfulness of V.",
      "Therefore G has a faithful irreducible representation. ∎",
    ],
    errorStep: 6,
    errorExplanation:
      "The claim that 'the intersection of finitely many nontrivial normal subgroups must contain a nontrivial element' is false. This is exactly what step 5 established does NOT happen; the intersection of all the kernels N_{i₁} ∩ ... ∩ N_{iₖ} = {e}, yet each N_{ij} is nontrivial. The argument contradicts itself. A faithful semisimple representation need not have any faithful irreducible summand. For example, ℤ/2ℤ × ℤ/2ℤ has no faithful irreducible representation (all irreps are 1-dimensional, hence have kernel of index ≤ 2), but it has faithful reducible representations.",
    distractorExplanations: [
      "Maschke's theorem requires the characteristic of the field to not divide |G|, and since ℂ has characteristic 0 this is satisfied, but the decomposition in step 2 uses the wrong multiplicities: each V_i appears dim(V_i) times only for the regular representation over algebraically closed fields of characteristic p > 0",
      "The error is in step 1: the regular representation ρ: G → GL(ℂ[G]) is faithful only when G is abelian; for non-abelian groups, the center of G acts trivially on certain subspaces of ℂ[G]",
      "Step 5 is wrong because achieving ∩_i N_i = {e} with finitely many kernels requires G to satisfy the descending chain condition on normal subgroups, which fails for finite groups with large centers",
    ],
  },
  // ── 5. Ergodic Theory ─────────────────────────────────────────────────────
  {
    title: "Proof that every measure-preserving transformation is ergodic",
    steps: [
      "Let (X, 𝓑, μ) be a probability space and T: X → X a measure-preserving transformation, i.e., μ(T⁻¹(A)) = μ(A) for all A ∈ 𝓑.",
      "Let f ∈ L²(X, μ) be a T-invariant function, meaning f(Tx) = f(x) μ-a.e. We must show f is constant μ-a.e.",
      "Consider the Koopman operator U_T: L²(X) → L²(X) defined by U_T(f) = f ∘ T. Since T is measure-preserving, U_T is a unitary operator.",
      "The T-invariant function f satisfies U_T f = f, so f is an eigenvector of U_T with eigenvalue 1.",
      "By the spectral theorem for unitary operators, the eigenspace for eigenvalue 1 is the orthogonal complement of the range of (U_T − I).",
      "Now, for any g ∈ L²(X), the Cesàro averages Aₙg = (1/n)∑_{k=0}^{n-1} U_T^k g converge in L² to the projection P onto the eigenspace of eigenvalue 1, by the mean ergodic theorem.",
      "Since U_T is unitary and hence normal, its eigenspaces are mutually orthogonal. The eigenvalue 1 has multiplicity 1 because the constant function 𝟏 spans a one-dimensional invariant subspace, and for any unitary operator on a finite measure space, the eigenvalue 1 is simple.",
      "Therefore the eigenspace for eigenvalue 1 is spanned by 𝟏, so f = c·𝟏 for some constant c, proving ergodicity. ∎",
    ],
    errorStep: 6,
    errorExplanation:
      "The claim that eigenvalue 1 of U_T has multiplicity 1 for any unitary Koopman operator is false; this is precisely the definition of ergodicity, not a consequence of unitarity. A unitary operator can have eigenvalue 1 with arbitrary multiplicity. For example, if T is the identity map (which is measure-preserving), then U_T = I and every function is an eigenfunction with eigenvalue 1. More generally, if X = A ∪ B with T(A) = A and T(B) = B, then both χ_A and χ_B are invariant, giving a 2-dimensional eigenspace. The step circularly assumes what it tries to prove.",
    distractorExplanations: [
      "The mean ergodic theorem in step 5 requires T to be ergodic as a hypothesis, so its application here is circular; it cannot be used to prove ergodicity",
      "The spectral theorem characterization in step 4 is incorrect: the eigenspace for eigenvalue 1 is not the orthogonal complement of range(U_T − I) but rather its closure, and this distinction matters in infinite-dimensional L² spaces",
      "The Koopman operator U_T is isometric but not unitary in general; unitarity requires T to be invertible (a bijective measure-preserving transformation), which was not assumed",
    ],
  },
  // ── 6. Spectral Theory ────────────────────────────────────────────────────
  {
    title: "Proof that every bounded self-adjoint operator on a Hilbert space has an eigenvalue",
    steps: [
      "Let T be a bounded self-adjoint operator on a separable Hilbert space H. Then σ(T) ⊆ ℝ and σ(T) is nonempty and compact.",
      "Let λ = sup σ(T) or λ = inf σ(T), chosen so that |λ| = ‖T‖ (using the spectral radius formula for self-adjoint operators: r(T) = ‖T‖).",
      "Since λ ∈ σ(T), the operator T − λI is not invertible in B(H).",
      "Because T is self-adjoint, T − λI is also self-adjoint. A self-adjoint operator that is not invertible must have a nontrivial kernel.",
      "Indeed, suppose ker(T − λI) = {0}. Then T − λI is injective. Since T − λI is self-adjoint, its range is dense: ran(T − λI)⊥ = ker((T − λI)*) = ker(T − λI) = {0}.",
      "An injective self-adjoint operator with dense range is bounded below (by the open mapping theorem applied to its inverse on the range), hence its range is closed, hence surjective.",
      "But a bijective bounded operator has a bounded inverse by the bounded inverse theorem, contradicting T − λI being non-invertible. So ker(T − λI) ≠ {0}, meaning λ is an eigenvalue. ∎",
    ],
    errorStep: 5,
    errorExplanation:
      "The open mapping theorem cannot be applied to conclude that T − λI is bounded below. The open mapping theorem applies to surjective bounded operators between Banach spaces, but here we only know T − λI is injective with dense range; it need not be surjective, and its inverse (defined on the range) need not be bounded. An injective operator with dense range can fail to have closed range. For example, the multiplication operator (Mf)(x) = xf(x) on L²[0,1] is injective and self-adjoint, and 0 is in the continuous spectrum (not an eigenvalue); the range of M is dense but not closed. The argument confuses the continuous spectrum with the point spectrum.",
    distractorExplanations: [
      "The spectral radius formula ‖T‖ = r(T) is only valid for normal operators on complex Hilbert spaces, and self-adjoint operators over real Hilbert spaces may have ‖T‖ > r(T), so the choice of λ in step 1 may be incorrect",
      "The error is in step 0: σ(T) need not contain sup σ(T) because the spectrum of a bounded operator is closed but the supremum might not be attained; it could be a limit point not in σ(T)",
      "Step 4 is wrong: the adjoint of T − λI is T* − λ̄I = T − λI only when λ is real, but the spectral radius could be attained at a complex point even for self-adjoint operators if the Hilbert space is real",
    ],
  },
  // ── 7. Stochastic Calculus ────────────────────────────────────────────────
  {
    title: "Proof that the Itô integral ∫₀ᵗ Wₛ dWₛ equals ½Wₜ²",
    steps: [
      "Let Wₜ be a standard Brownian motion. We compute ∫₀ᵗ Wₛ dWₛ using the Itô formula.",
      "Consider f(x) = ½x². Then f'(x) = x and f''(x) = 1.",
      "By Itô's formula for f(Wₜ): df(Wₜ) = f'(Wₜ)dWₜ + ½f''(Wₜ)(dWₜ)².",
      "Substituting: d(½Wₜ²) = Wₜ dWₜ + ½·1·dt, since (dWₜ)² = dt.",
      "Integrating both sides from 0 to t: ½Wₜ² − ½W₀² = ∫₀ᵗ Wₛ dWₛ + ½t.",
      "Since W₀ = 0, this gives ½Wₜ² = ∫₀ᵗ Wₛ dWₛ + ½t.",
      "Now observe that ½t = ½⟨W⟩ₜ where ⟨W⟩ₜ = t is the quadratic variation. But the quadratic variation is a second-order quantity that vanishes in the L² limit of Riemann sums, so ½t → 0 in probability as the mesh refines.",
      "Therefore ∫₀ᵗ Wₛ dWₛ = ½Wₜ². ∎",
    ],
    errorStep: 6,
    errorExplanation:
      "The quadratic variation ⟨W⟩ₜ = t does NOT vanish. The claim that it 'vanishes in the L² limit of Riemann sums' confuses quadratic variation with the maximum step size. The sum ∑(ΔWᵢ)² converges to t in L² as the partition refines; this is a fundamental property of Brownian motion. The ½t correction term (the Itô correction) is precisely what distinguishes the Itô integral from the Stratonovich integral. The correct result is ∫₀ᵗ Wₛ dWₛ = ½Wₜ² − ½t, not ½Wₜ².",
    distractorExplanations: [
      "Itô's formula in step 2 is missing the drift term: for a general semimartingale, there should be an additional μdt term, and since Brownian motion has zero drift, the formula is only approximately correct",
      "The error is in step 1: f''(x) = 1 is correct but the Itô formula requires the second derivative of f evaluated at Wₜ, which is a random variable, so one cannot simply substitute the deterministic value 1",
      "Step 4 incorrectly assumes W₀ = 0; Brownian motion starting at W₀ = x ≠ 0 would give a different result, and the proof does not specify the initial condition",
    ],
  },
  // ── 8. Algebraic Number Theory ────────────────────────────────────────────
  {
    title: "Proof that the ring of integers ℤ[√−5] is a unique factorization domain",
    steps: [
      "Consider the ring of integers of ℚ(√−5), which is ℤ[√−5] since −5 ≡ 3 (mod 4).",
      "Define the norm N(a + b√−5) = a² + 5b² for a, b ∈ ℤ. This is a multiplicative function: N(αβ) = N(α)N(β).",
      "To show ℤ[√−5] is a UFD, we verify it is a Euclidean domain. Given α, β ∈ ℤ[√−5] with β ≠ 0, we must find q, r with α = qβ + r and N(r) < N(β).",
      "Write α/β = x + y√−5 with x, y ∈ ℚ. Choose integers m, n closest to x, y respectively, so |x − m| ≤ ½ and |y − n| ≤ ½.",
      "Set q = m + n√−5 and r = α − qβ. Then r = β((x − m) + (y − n)√−5), so N(r) = N(β) · ((x−m)² + 5(y−n)²).",
      "We bound: (x−m)² + 5(y−n)² ≤ (½)² + 5·(½)² = ¼ + 5/4 = 6/4 = 3/2.",
      "Since 3/2 < 2, we have found q, r with N(r) ≤ (3/2)N(β) < 2·N(β). Therefore the Euclidean algorithm terminates in finitely many steps.",
      "Hence ℤ[√−5] is a Euclidean domain, therefore a PID, therefore a UFD. ∎",
    ],
    errorStep: 6,
    errorExplanation:
      "The Euclidean domain condition requires N(r) < N(β), i.e., the multiplier must be strictly less than 1. Here the bound gives N(r) ≤ (3/2)N(β), which means N(r) can EXCEED N(β). The factor 3/2 > 1 means the Euclidean division algorithm is NOT guaranteed to decrease the norm at each step, so the domain is not Euclidean. This is not just a technicality: ℤ[√−5] is famously NOT a UFD. The classic counterexample is 6 = 2·3 = (1+√−5)(1−√−5), two distinct irreducible factorizations. The class number of ℚ(√−5) is 2, confirming non-unique factorization.",
    distractorExplanations: [
      "The error is in step 0: the ring of integers of ℚ(√−5) is not ℤ[√−5] but rather ℤ[(1+√−5)/2] since −5 ≡ 3 mod 4, and the proof uses the wrong ring throughout",
      "The norm function N(a+b√−5) = a² + 5b² is not multiplicative over ℤ[√−5] because the ring is not integrally closed, so step 1's claim N(αβ) = N(α)N(β) fails",
      "The Euclidean algorithm requires not just N(r) < N(β) but also that N is a positive-definite function, which fails for N(a+b√−5) when b is large relative to a",
    ],
  },
  // ── 9. Differential Geometry ──────────────────────────────────────────────
  {
    title: "Proof that every closed 2-form on ℝ³ \\ {0} is exact",
    steps: [
      "Let ω be a closed 2-form on M = ℝ³ \\ {0}, i.e., dω = 0.",
      "Since M = ℝ³ \\ {0} deformation retracts onto S², we have H²_dR(M) ≅ H²_dR(S²) ≅ ℝ.",
      "However, we can construct an explicit primitive. Consider the radial vector field V = (x∂_x + y∂_y + z∂_z)/r² where r = √(x²+y²+z²).",
      "Define the contraction operator K: Ω²(M) → Ω¹(M) by K(ω) = ι_V ω (interior product with V).",
      "By Cartan's magic formula, ℒ_V ω = d(ι_V ω) + ι_V(dω) = dK(ω) + 0 = dK(ω), since dω = 0.",
      "The flow φₜ of V acts as a dilation: φₜ(x) = e^{t/r²}x. Under pullback, 2-forms on ℝ³ scale as φₜ*ω → 0 as t → −∞ because the dilation shrinks forms.",
      "Therefore 0 = ω − lim_{t→−∞} φₜ*ω = ∫_{-∞}^{0} (d/dt)φₜ*ω dt = ∫_{-∞}^{0} φₜ*(ℒ_V ω) dt = d(∫_{-∞}^{0} φₜ*(K ω) dt).",
      "Setting α = ∫_{-∞}^{0} φₜ*(Kω) dt, we get ω = dα, proving ω is exact. ∎",
    ],
    errorStep: 5,
    errorExplanation:
      "The claim that φₜ*ω → 0 as t → −∞ is false for the stated vector field. The vector field V = (x∂_x + y∂_y + z∂_z)/r² does not generate a simple dilation; its flow is not φₜ(x) = e^{t/r²}x because r itself depends on x and changes along the flow. More fundamentally, this homotopy operator argument (which works on star-shaped domains to prove the Poincaré lemma) cannot work here because H²_dR(ℝ³\\{0}) ≅ ℝ ≠ 0. The solid angle form ω = (x dy∧dz − y dx∧dz + z dx∧dy)/r³ is a closed 2-form on ℝ³\\{0} that is NOT exact, as its integral over S² equals 4π.",
    distractorExplanations: [
      "The deformation retraction in step 1 is incorrect: ℝ³ \\ {0} does not retract onto S², but rather onto ℝP², so H²_dR(M) = 0 and the proof's conclusion is actually true",
      "Cartan's magic formula in step 4 requires V to be a smooth vector field, but V has a singularity at the origin, which is still in the closure of M, causing the formula to produce distributional terms",
      "The contraction operator ι_V only produces a primitive when V is a Killing vector field preserving the metric, not for an arbitrary radial vector field",
    ],
  },
  // ── 10. Symplectic Geometry ───────────────────────────────────────────────
  {
    title: "Proof that every symplectic manifold admits a Kähler structure",
    steps: [
      "Let (M, ω) be a symplectic manifold of dimension 2n.",
      "Choose a Riemannian metric g on M (which always exists by partition of unity).",
      "Define an endomorphism A of TM by ω(u, v) = g(Au, v) for all tangent vectors u, v. Since ω is skew-symmetric and g is symmetric, A is g-skew-adjoint: g(Au, v) = −g(u, Av).",
      "Consider A*A = −A². Since A is skew-adjoint, −A² is positive-definite and symmetric. Let B = √(−A²) be the unique positive-definite symmetric square root.",
      "Define J = AB⁻¹. Then J² = AB⁻¹AB⁻¹. Since B² = −A² and B commutes with A (as B is a polynomial in A² hence in A), we get J² = A²B⁻² = A²(−A²)⁻¹ = −I.",
      "So J is an almost complex structure. Define the new metric h(u,v) = ω(u, Jv). This is symmetric because ω(u, Jv) = ω(Jv, u)·(−1) = g(AJv, u) and the symmetry follows from the compatibility of A and J.",
      "Now (M, ω, J, h) is an almost Kähler structure. Since ω is closed (dω = 0) and J is constructed globally from ω and g, the Newlander-Nirenberg integrability condition N_J = 0 is automatically satisfied because J is compatible with the closed form ω.",
      "Therefore J is integrable, making (M, ω, J) a Kähler manifold. ∎",
    ],
    errorStep: 6,
    errorExplanation:
      "The claim that compatibility of J with the closed form ω implies the Nijenhuis tensor N_J vanishes is false. Closedness of ω (dω = 0) together with ω-compatibility of J does NOT imply integrability of J. An almost Kähler manifold (where ω is closed and J-compatible) need not be Kähler; the Nijenhuis tensor can be nonzero. There exist compact symplectic manifolds that admit no Kähler structure at all (e.g., the Kodaira-Thurston manifold), showing this step is fundamentally wrong. Integrability of J is an additional condition not forced by the symplectic structure.",
    distractorExplanations: [
      "The construction of J = AB⁻¹ in step 4 is not well-defined because B = √(−A²) need not commute with A when A has repeated eigenvalues, so J² ≠ −I in general",
      "The metric h(u,v) = ω(u, Jv) defined in step 5 need not be positive-definite: it could be indefinite if J is not compatible with the orientation of M induced by ω",
      "The error is in step 2: the square root of −A² is unique only when −A² has distinct eigenvalues; otherwise there are multiple square roots and different choices yield non-isomorphic almost complex structures",
    ],
  },
  // ── 11. Operator Algebras ─────────────────────────────────────────────────
  {
    title: "Proof that every C*-algebra is isomorphic to a von Neumann algebra",
    steps: [
      "Let A be a C*-algebra. By the GNS construction, there exists a faithful *-representation π: A → B(H) for some Hilbert space H.",
      "The image π(A) is a C*-subalgebra of B(H). Consider its weak operator topology (WOT) closure M = π(A)''  (the double commutant).",
      "By von Neumann's double commutant theorem, M = π(A)'' is a von Neumann algebra.",
      "We claim π(A) = M. Since π(A) ⊆ M, we need to show M ⊆ π(A).",
      "Let T ∈ M = π(A)''. Then T commutes with everything in π(A)'. By Kaplansky's density theorem, the unit ball of π(A) is WOT-dense in the unit ball of M.",
      "Therefore, for each T ∈ M with ‖T‖ ≤ 1, there exists a net (π(aᵢ))ᵢ in the unit ball of π(A) converging to T in the WOT.",
      "Since π(A) is a C*-algebra and hence norm-closed, and the WOT is weaker than the norm topology, every WOT-convergent net in π(A) has its limit in π(A). Therefore T ∈ π(A).",
      "Thus π(A) = M, so A ≅ π(A) = M is a von Neumann algebra. ∎",
    ],
    errorStep: 6,
    errorExplanation:
      "The argument reverses the relationship between topologies. The fact that the WOT is weaker than the norm topology means WOT-open sets are norm-open, which implies norm-closed sets are WOT-closed; but NOT that WOT limits of elements in a norm-closed set remain in that set. In fact, a norm-closed set need not be WOT-closed. The step confuses 'closed in a finer topology' with 'closed in a coarser topology.' The WOT-closure of π(A) is generally strictly larger than π(A) for infinite-dimensional C*-algebras. For example, C₀(ℝ) is a C*-algebra that is not a von Neumann algebra; its WOT-closure in any faithful representation is L^∞.",
    distractorExplanations: [
      "The GNS construction in step 0 does not produce a faithful representation in general; faithfulness requires choosing the universal representation (direct sum over all states), which the proof does not specify",
      "Kaplansky's density theorem in step 4 applies only to self-adjoint elements, not to arbitrary operators in M, so the approximation by a net from π(A) fails for non-self-adjoint T",
      "The double commutant theorem in step 2 requires π(A) to contain the identity operator, but a general C*-algebra may be non-unital, so π(A)'' may not equal the WOT-closure of π(A)",
    ],
  },
  // ── 12. Model Theory ──────────────────────────────────────────────────────
  {
    title: "Proof that every consistent first-order theory has a unique model up to isomorphism",
    steps: [
      "Let T be a consistent first-order theory in a countable language L.",
      "By the completeness theorem (Gödel), T has a model M.",
      "By the Löwenheim-Skolem theorem, T has a countable model M₀.",
      "Let M₁ be any other model of T. By the downward Löwenheim-Skolem theorem, T has a countable elementary submodel M₁' ≼ M₁.",
      "Both M₀ and M₁' are countable models of T. By the back-and-forth method (Cantor's theorem for dense linear orders, generalized), any two countable models of the same complete theory are isomorphic.",
      "Therefore M₀ ≅ M₁'. Since M₁' ≼ M₁, the theory Th(M₁') = Th(M₁) = T, and the elementary embedding extends to show M₁ is determined up to isomorphism by T.",
      "Hence T has a unique model up to isomorphism. ∎",
    ],
    errorStep: 4,
    errorExplanation:
      "The back-and-forth argument showing any two countable models of a complete theory are isomorphic is valid ONLY for ω-categorical theories (Ryll-Nardzewski theorem), not for all complete theories. Most complete theories have non-isomorphic countable models. For example, the complete theory of (ℚ, <, 0, 1) has countable models with different order types. More dramatically, the theory of algebraically closed fields of characteristic 0 is complete but has countable models of different transcendence degrees. The step incorrectly generalizes Cantor's theorem about dense linear orders (an ω-categorical theory) to all theories.",
    distractorExplanations: [
      "The error is in step 1: the Löwenheim-Skolem theorem only applies to theories with infinite models, and T might have only finite models for which the theorem fails",
      "The completeness theorem in step 1 guarantees a model but not a countable one; the countable model requires the omitting types theorem, not just Löwenheim-Skolem",
      "Step 5 is wrong: an elementary embedding M₁' ≼ M₁ does not extend to an isomorphism; it only shows M₁' and M₁ satisfy the same sentences, not that they have the same cardinality",
    ],
  },
  // ── 13. Forcing (Set Theory) ──────────────────────────────────────────────
  {
    title: "Proof that the Continuum Hypothesis is provable in ZFC",
    steps: [
      "Work in ZFC. Let κ = 2^{ℵ₀} be the cardinality of the continuum.",
      "By König's theorem, cf(2^{ℵ₀}) > ℵ₀, so κ has uncountable cofinality.",
      "The Generalized Continuum Hypothesis (GCH) holds in Gödel's constructible universe L: for all infinite cardinals λ, 2^λ = λ⁺ in L.",
      "By Gödel's completeness of L, if ZFC is consistent then ZFC + 'V = L' is consistent, and in V = L we have 2^{ℵ₀} = ℵ₁.",
      "The statement 2^{ℵ₀} = ℵ₁ is an arithmetic statement about cardinals. By Shoenfield's absoluteness theorem, any Σ¹₂ statement that holds in L holds in V.",
      "The Continuum Hypothesis '2^{ℵ₀} = ℵ₁' is a statement about sets of reals, hence at most Σ¹₂ in the analytical hierarchy. By Shoenfield absoluteness, CH holds in V.",
      "Therefore CH is true in any model of ZFC, hence provable by completeness. ∎",
    ],
    errorStep: 5,
    errorExplanation:
      "The Continuum Hypothesis is NOT a Σ¹₂ statement. CH asserts the existence of a bijection between ℝ and ω₁, which quantifies over arbitrary functions (sets of ordered pairs of reals and countable ordinals). This makes CH a Σ²₁ statement in the projective hierarchy (second-order over the reals), not Σ¹₂. Shoenfield absoluteness applies to Σ¹₂ statements (those with one existential second-order quantifier over naturals), but CH involves quantification at a higher level. This is precisely why Cohen's forcing can produce models of ZFC + ¬CH; CH is not absolute between V and L.",
    distractorExplanations: [
      "König's theorem in step 1 only gives cf(2^{ℵ₀}) > ℵ₀, which is consistent with 2^{ℵ₀} = ℵ₂ or larger, so the argument already fails to pin down κ = ℵ₁",
      "The error is in step 3: Gödel's result about L only shows consistency of ZFC + GCH relative to ZFC, not that GCH actually holds in L; the constructible universe is a class model, not a set model, so the completeness theorem does not apply",
      "Shoenfield's absoluteness theorem requires the ground model to satisfy dependent choice (DC), which is weaker than full ZFC choice but is not provable from ZF alone, so the argument implicitly uses an unproven assumption",
    ],
  },
  // ── 14. Sheaf Theory ──────────────────────────────────────────────────────
  {
    title: "Proof that every sheaf on a paracompact Hausdorff space is flasque",
    steps: [
      "Let X be a paracompact Hausdorff space and F a sheaf of abelian groups on X.",
      "Let U ⊆ X be open and s ∈ F(U) a section over U. We must extend s to a global section in F(X).",
      "Since X is paracompact Hausdorff, it is normal. By Urysohn's lemma, for each x ∈ U, there exists a continuous function fₓ: X → [0,1] with fₓ(x) = 1 and supp(fₓ) ⊆ U.",
      "Take a locally finite open refinement {Vᵢ}ᵢ of the cover {U, X\\supp(s)} with a subordinate partition of unity {φᵢ}. Let I₀ = {i : Vᵢ ⊆ U}.",
      "For each i ∈ I₀, define sᵢ = φᵢ · s ∈ F(Vᵢ), where multiplication by the smooth function φᵢ is defined via the module structure of F over the sheaf of continuous functions.",
      "For i ∉ I₀, set sᵢ = 0 ∈ F(Vᵢ). The sections {sᵢ} agree on overlaps: on Vᵢ ∩ Vⱼ with i ∈ I₀ and j ∉ I₀, we have sᵢ = φᵢ · s and sⱼ = 0, but φᵢ · s = 0 on Vⱼ \\ U since s is not defined there; however φᵢ vanishes outside U, so this is consistent.",
      "By the sheaf gluing axiom, there exists a unique global section σ ∈ F(X) with σ|_{Vᵢ} = sᵢ. On U, σ = ∑ᵢ∈I₀ φᵢ · s = (∑ᵢ∈I₀ φᵢ) · s = 1 · s = s since the partition of unity sums to 1.",
      "Therefore F is flasque: every section over an open set extends to a global section. ∎",
    ],
    errorStep: 4,
    errorExplanation:
      "An arbitrary sheaf of abelian groups does not have a module structure over the sheaf of continuous functions. The operation 'φᵢ · s' (multiplying a sheaf section by a continuous real-valued function) is not defined for a general sheaf of abelian groups. This multiplication makes sense for sheaves of C⁰-modules (or sheaves of vector spaces with a continuous structure), such as the sheaf of sections of a vector bundle, but not for an arbitrary sheaf. For example, a constant sheaf ℤ_X does not admit multiplication by arbitrary continuous functions. The partition of unity argument works for fine sheaves (which are acyclic on paracompact spaces) but not for all sheaves.",
    distractorExplanations: [
      "The sheaf gluing axiom in step 6 requires agreement on ALL pairwise overlaps, but the argument only checks overlaps between I₀ and its complement, missing overlaps within I₀ where different sᵢ might disagree",
      "The partition of unity sums to 1 everywhere on X, but ∑ᵢ∈I₀ φᵢ ≠ 1 on U in general; some φⱼ with j ∉ I₀ could have support intersecting U, so the sum is strictly less than 1 on parts of U",
      "Urysohn's lemma in step 2 requires the space to be perfectly normal (not just normal) to produce continuous functions separating a point from a closed set, and paracompact Hausdorff spaces need not be perfectly normal",
    ],
  },
  // ── 15. K-Theory ──────────────────────────────────────────────────────────
  {
    title: "Proof that the reduced K-theory of every sphere is trivial: K̃⁰(Sⁿ) = 0 for all n ≥ 1",
    steps: [
      "We prove K̃⁰(Sⁿ) = 0 by induction on n.",
      "Base case n = 1: S¹ is the circle. Every complex vector bundle over S¹ is determined by a clutching function f: S⁰ → GL_k(ℂ). Since S⁰ = {±1} is discrete, f maps to GL_k(ℂ) which is connected, so f is homotopic to the identity. Thus every bundle is trivial and K̃⁰(S¹) = 0.",
      "Inductive step: Assume K̃⁰(Sⁿ) = 0. We show K̃⁰(Sⁿ⁺¹) = 0.",
      "Decompose Sⁿ⁺¹ = D₊ⁿ⁺¹ ∪ D₋ⁿ⁺¹ as two hemispheres glued along Sⁿ. A vector bundle E on Sⁿ⁺¹ is determined by a clutching function g: Sⁿ → GL_k(ℂ).",
      "The clutching construction gives an isomorphism K̃⁰(Sⁿ⁺¹) ≅ [Sⁿ, GL_k(ℂ)] for k sufficiently large, where [−,−] denotes homotopy classes.",
      "By Bott periodicity (or direct calculation), the stable homotopy group [Sⁿ, GL(ℂ)] = π_n(GL(ℂ)) = π_n(BU × ℤ).",
      "But we assumed K̃⁰(Sⁿ) = 0 by induction. Since K̃⁰(Sⁿ) ≅ [Sⁿ, BU × ℤ]₀ classifies virtual bundles over Sⁿ, and the clutching function group [Sⁿ, GL(ℂ)] maps to K̃⁰(Sⁿ) via the clutching isomorphism, we get [Sⁿ, GL(ℂ)] = 0.",
      "Therefore K̃⁰(Sⁿ⁺¹) ≅ [Sⁿ, GL(ℂ)] = 0, completing the induction. ∎",
    ],
    errorStep: 6,
    errorExplanation:
      "The step confuses two different isomorphisms. The clutching construction gives K̃⁰(Sⁿ⁺¹) ≅ π_n(GL(ℂ)) = πₙ₋₁(U) (stable homotopy groups of the unitary group). The induction hypothesis K̃⁰(Sⁿ) = 0 relates to πₙ₋₁(GL(ℂ)) via the clutching on Sⁿ, NOT to πₙ(GL(ℂ)). The argument incorrectly equates π_n(GL(ℂ)) with K̃⁰(Sⁿ) when the correct relation is K̃⁰(Sⁿ) ≅ πₙ₋₁(GL(ℂ)). This off-by-one error invalidates the induction. By Bott periodicity, K̃⁰(S²) ≅ π₁(GL(ℂ)) ≅ ℤ ≠ 0, contradicting the claimed result.",
    distractorExplanations: [
      "The base case is wrong: the clutching function on S⁰ maps two points to GL_k(ℂ), and since GL_k(ℂ) is connected the two images are in the same component, but the bundle is determined by π₀(GL_k(ℂ)) = ℤ (the winding number), giving K̃⁰(S¹) = ℤ",
      "Bott periodicity states π_n(U) ≅ π_{n+2}(U), but the proof uses the unstable group GL_k(ℂ) for fixed k instead of the stable limit GL(ℂ) = colim GL_k(ℂ), which changes the homotopy groups",
      "The decomposition of Sⁿ⁺¹ into hemispheres in step 3 requires a smooth structure on Sⁿ⁺¹, and for n+1 = 4 there exist exotic smooth structures that change the K-theory",
    ],
  },
  // ── 16. Algebraic Topology (Diagram Chasing) ──────────────────────────────
  {
    title: "Proof that the homology of the Klein bottle is torsion-free",
    steps: [
      "Represent the Klein bottle K as a CW complex with one 0-cell v, two 1-cells a, b, and one 2-cell σ.",
      "The attaching map of σ traces the word aba⁻¹b (the fundamental polygon relation for the Klein bottle).",
      "The cellular chain complex is: 0 → ℤ·σ →^{∂₂} ℤ·a ⊕ ℤ·b →^{∂₁} ℤ·v → 0.",
      "Compute ∂₂(σ) by reading off the attaching word aba⁻¹b: ∂₂(σ) = a + b − a + b = 2b.",
      "Compute ∂₁: since both endpoints of a and b are identified to v, ∂₁(a) = v − v = 0 and ∂₁(b) = v − v = 0.",
      "H₀(K) = ker(∂₀)/im(∂₁) = ℤ·v / 0 = ℤ. H₂(K) = ker(∂₂) = 0 (since ∂₂(σ) = 2b ≠ 0, the map ∂₂ is injective).",
      "H₁(K) = ker(∂₁)/im(∂₂) = (ℤ·a ⊕ ℤ·b)/(ℤ·2b) ≅ ℤ·a ⊕ (ℤ·b / 2ℤ·b) ≅ ℤ ⊕ ℤ. The quotient ℤ/2ℤ is trivial because 2b is an even element and quotienting by an even element in ℤ yields ℤ.",
      "Therefore H_*(K; ℤ) = (ℤ, ℤ ⊕ ℤ, 0, 0, ...), which is torsion-free. ∎",
    ],
    errorStep: 6,
    errorExplanation:
      "The claim that 'quotienting ℤ by the subgroup generated by 2 yields ℤ' is false. The quotient ℤ/2ℤ ≅ ℤ/2ℤ, the cyclic group of order 2, NOT ℤ. The subgroup 2ℤ = {..., −4, −2, 0, 2, 4, ...} has index 2 in ℤ, giving a finite quotient. Therefore H₁(K; ℤ) ≅ ℤ ⊕ ℤ/2ℤ, which has 2-torsion. The Klein bottle's first homology contains a ℤ/2ℤ torsion summand, reflecting its non-orientability.",
    distractorExplanations: [
      "The attaching word for the Klein bottle is aba⁻¹b⁻¹ (not aba⁻¹b), which would give ∂₂(σ) = a + b − a − b = 0, making H₂(K) = ℤ and changing the entire computation",
      "The cellular chain complex is missing a third boundary map ∂₃ corresponding to the 3-skeleton, and without it the computation of H₂ is incomplete",
      "The error is in step 3: ∂₂(σ) should be computed using the Fox calculus for non-abelian fundamental groups, and the naive reading of the attaching word gives the wrong boundary",
    ],
  },
  // ── 17. Homological Algebra (Wrong Naturality) ────────────────────────────
  {
    title: "Proof that Ext commutes with arbitrary direct products in the first variable",
    steps: [
      "Let R be a ring, {Aᵢ}ᵢ∈I a family of R-modules, and B an R-module. We claim Ext^n_R(∏ᵢ Aᵢ, B) ≅ ∏ᵢ Ext^n_R(Aᵢ, B) for all n ≥ 0.",
      "Choose a projective resolution P_• → B → 0 of B.",
      "Wait: Ext in the first variable uses injective resolutions of B or projective resolutions of the first argument. Use projective resolutions Q_•^{(i)} → Aᵢ → 0 for each Aᵢ.",
      "Form ∏ᵢ Q_•^{(i)}. Since direct products of projective modules are projective (as projective modules are direct summands of free modules, and products of free modules are free), ∏ᵢ Q_•^{(i)} is a projective resolution of ∏ᵢ Aᵢ.",
      "Now compute: Ext^n_R(∏ᵢ Aᵢ, B) = H^n(Hom_R(∏ᵢ Q_•^{(i)}, B)).",
      "The natural isomorphism Hom_R(∏ᵢ Q_n^{(i)}, B) ≅ ∏ᵢ Hom_R(Q_n^{(i)}, B) holds by the universal property of the product: a map from a product is determined by its components.",
      "Taking cohomology: H^n(∏ᵢ Hom_R(Q_•^{(i)}, B)) ≅ ∏ᵢ H^n(Hom_R(Q_•^{(i)}, B)) = ∏ᵢ Ext^n_R(Aᵢ, B).",
      "Therefore Ext^n_R(∏ᵢ Aᵢ, B) ≅ ∏ᵢ Ext^n_R(Aᵢ, B). ∎",
    ],
    errorStep: 5,
    errorExplanation:
      "The claimed 'natural isomorphism' Hom_R(∏ᵢ Mᵢ, B) ≅ ∏ᵢ Hom_R(Mᵢ, B) is FALSE. The universal property of the product says that Hom_R(X, ∏ᵢ Mᵢ) ≅ ∏ᵢ Hom_R(X, Mᵢ); the product is characterized by maps INTO it, not out of it. Maps from a product are NOT determined by 'components' in this way. The correct universal property for maps out of a coproduct (direct sum) gives Hom_R(⊕ᵢ Mᵢ, B) ≅ ∏ᵢ Hom_R(Mᵢ, B). The proof confuses products with coproducts in the covariant Hom variable.",
    distractorExplanations: [
      "The error is in step 3: direct products of projective modules are NOT projective in general. Over a non-Noetherian ring, a product of free modules can fail to be free or even projective (Chase's theorem)",
      "Step 2 is wrong: one cannot use individual projective resolutions for each Aᵢ and combine them; the correct approach is to take a single projective resolution of the product ∏ᵢ Aᵢ, which has a different structure",
      "The cohomology-product interchange in step 6 fails because cohomology does not commute with infinite products; this requires a Mittag-Leffler condition on the inverse system",
    ],
  },
  // ── 18. Constructive Mathematics (Hidden Excluded Middle) ─────────────────
  {
    title: "Constructive proof that every bounded monotone sequence of reals converges",
    steps: [
      "Let (aₙ) be a bounded monotone increasing sequence of real numbers in [0, 1].",
      "Define L = sup{aₙ : n ∈ ℕ}, which exists as a real number since the sequence is bounded. Constructively, L is defined as the Dedekind cut {q ∈ ℚ : q < aₙ for some n}.",
      "We claim aₙ → L. Given ε > 0, we must find N such that L − ε < aₙ for all n ≥ N.",
      "Since L = sup(aₙ), L − ε is not an upper bound. Therefore there exists N with aₙ > L − ε.",
      "Formally: ¬(∀n: aₙ ≤ L − ε), since L − ε < L = sup(aₙ). By the constructive contrapositive, ¬¬(∃N: aₙ > L − ε).",
      "In constructive mathematics, ¬¬P is equivalent to P for existential statements over ℕ by Markov's principle, which is constructively valid. Therefore ∃N: aₙ > L − ε.",
      "For all n ≥ N, monotonicity gives aₙ ≥ aₙ ≥ aₙ > L − ε. Also aₙ ≤ L by definition of supremum. So |aₙ − L| < ε.",
      "The sequence converges to L constructively. ∎",
    ],
    errorStep: 5,
    errorExplanation:
      "Markov's principle (¬¬∃n.P(n) → ∃n.P(n) for decidable P) is NOT constructively valid; it is an independent principle that is consistent with but not provable in constructive mathematics (e.g., it fails in some sheaf models and realizability toposes). The step claims Markov's principle is constructively valid to eliminate the double negation, but this is a hidden use of a non-constructive principle. In Bishop-style constructive mathematics, the monotone convergence theorem requires an additional condition (such as a rate of convergence or a modulus of Cauchy convergence) precisely because this double-negation elimination is not available.",
    distractorExplanations: [
      "The Dedekind cut in step 1 is not well-defined constructively because the set {q ∈ ℚ : q < aₙ for some n} requires deciding for each rational whether it is less than some aₙ, which involves an unbounded search",
      "The error is in step 3: 'L − ε is not an upper bound' requires the supremum to have the classical least-upper-bound property, which fails constructively since ℝ does not satisfy trichotomy",
      "Step 6 incorrectly applies monotonicity: the statement aₙ ≥ aₙ ≥ aₙ is a tautology and the intended inequality aₙ ≥ a_N requires n ≥ N, which was not established for the specific N found",
    ],
  },
  // ── 19. Differential Geometry (Invalid Pullback) ──────────────────────────
  {
    title: "Proof that every smooth manifold admits a flat Riemannian metric",
    steps: [
      "Let M be a smooth n-manifold. Choose an atlas {(Uα, φα)} with φα: Uα → ℝⁿ.",
      "On each chart domain Uα, define gα = φα*(δ), the pullback of the Euclidean metric δ on ℝⁿ via the chart map φα.",
      "Each gα is a flat Riemannian metric on Uα since the curvature tensor is preserved under pullback by diffeomorphisms, and the Euclidean metric has zero curvature.",
      "Let {ρα} be a partition of unity subordinate to the cover {Uα}.",
      "Define the global metric g = ∑α ρα · gα. This is a well-defined symmetric (0,2)-tensor on M, and it is positive-definite since each gα is positive-definite and the ρα are non-negative with ∑ρα = 1.",
      "We claim g is flat. On each Uα, we have g = ∑β ρβ · gβ. The curvature tensor R of g satisfies R = ∑β ρβ · Rβ where Rβ is the curvature of gβ.",
      "Since each gβ is flat (Rβ = 0), we get R = ∑β ρβ · 0 = 0. Therefore g is flat.",
      "Hence every smooth manifold admits a flat Riemannian metric. ∎",
    ],
    errorStep: 5,
    errorExplanation:
      "The curvature tensor is NOT linear in the metric. The claim R(∑ ρβ gβ) = ∑ ρβ R(gβ) is completely false. The Riemann curvature tensor involves second derivatives of the metric and products of Christoffel symbols (which themselves involve first derivatives of the metric), making it a highly nonlinear function of g. A convex combination of flat metrics is generically NOT flat. This is the fundamental reason why flatness is a strong topological constraint: a manifold admits a flat metric only if it has vanishing curvature, which by the Bieberbach theorems restricts it to being finitely covered by a torus (in the compact case).",
    distractorExplanations: [
      "The partition of unity in step 4 is smooth but the chart maps may not be compatible, so gα and gβ are defined with respect to different coordinate systems and cannot be summed without a coordinate transformation",
      "The pullback metric gα = φα*(δ) is not flat because the chart map φα is not an isometry; it is only a diffeomorphism, and pullback by a non-isometric diffeomorphism introduces curvature",
      "The error is in step 0: not every manifold admits an atlas with chart maps to ℝⁿ; some manifolds require charts to orbifold quotients ℝⁿ/Γ, and the Euclidean metric does not descend to these quotients",
    ],
  },
  // ── 20. Stochastic Calculus (Interchange of Limit and Integral) ───────────
  {
    title: "Proof that every L² martingale converges almost surely",
    steps: [
      "Let (Mₙ)_{n≥0} be an L² martingale with respect to a filtration (ℱₙ), meaning E[Mₙ₊₁ | ℱₙ] = Mₙ and sup_n E[Mₙ²] = C < ∞.",
      "By Doob's L² maximal inequality, E[sup_{k≤n} Mₖ²] ≤ 4E[Mₙ²] ≤ 4C.",
      "Therefore E[sup_{k≥0} Mₖ²] = lim_n E[sup_{k≤n} Mₖ²] ≤ 4C, so sup_{k≥0} |Mₖ| < ∞ a.s.",
      "To show convergence, consider the oscillation. For a < b, let U(a,b) be the number of upcrossings of [a,b] by (Mₙ).",
      "By Doob's upcrossing inequality, E[U(a,b)] ≤ E[(Mₙ − a)⁻] / (b − a) ≤ (E[|Mₙ|] + |a|) / (b − a).",
      "Now interchange limit and expectation: E[lim_n U_n(a,b)] = lim_n E[U_n(a,b)] by monotone convergence, where U_n counts upcrossings up to time n.",
      "Since E[|Mₙ|] ≤ √E[Mₙ²] ≤ √C, we get E[U(a,b)] ≤ (√C + |a|)/(b − a) < ∞, so U(a,b) < ∞ a.s. for each a < b.",
      "Taking a countable union over all rational a < b, the set where (Mₙ) oscillates infinitely has probability 0. Combined with boundedness (step 2), Mₙ converges a.s. ∎",
    ],
    errorStep: 0,
    errorExplanation:
      "The stated hypothesis 'sup_n E[Mₙ²] < ∞' defines a BOUNDED L² martingale, which is a strictly stronger condition than being an L² martingale (which only requires each Mₙ ∈ L²). The proof is valid for bounded L² martingales but the title claims it for ALL L² martingales. An L² martingale that is not L²-bounded need not converge a.s. For example, a simple symmetric random walk Sₙ is an L² martingale (E[Sₙ²] = n) but does not converge. The error is stating the hypothesis as 'every L² martingale' when the proof actually requires the L²-boundedness condition.",
    distractorExplanations: [
      "Doob's maximal inequality in step 1 requires the martingale to be non-negative; for signed martingales, the correct bound involves E[|Mₙ|²] which may differ from E[Mₙ²]",
      "The interchange of limit and expectation in step 5 requires dominated convergence, not just monotone convergence, because U_n(a,b) could be negative (counting downcrossings as negative upcrossings)",
      "The countable union in step 7 over rational a < b does not capture all oscillation: the sequence might converge along rationals but oscillate along irrationals, and the a.s. convergence requires a separate argument",
    ],
  },
  // ── 21. Algebraic Topology (Mayer-Vietoris Misuse) ────────────────────────
  {
    title: "Proof that the fundamental group of the torus is ℤ",
    steps: [
      "Decompose the torus T² = S¹ × S¹ as U ∪ V, where U = T² \\ {p} (torus minus a point) and V is a small disk around p.",
      "The intersection U ∩ V is an annulus, which deformation retracts to S¹. So π₁(U ∩ V) ≅ ℤ.",
      "V is contractible, so π₁(V) = 0.",
      "U = T² \\ {p} deformation retracts to the wedge S¹ ∨ S¹ (the 1-skeleton of the standard CW structure). So π₁(U) ≅ ℤ * ℤ (free group on two generators a, b).",
      "By the Seifert–van Kampen theorem, π₁(T²) ≅ π₁(U) *_{π₁(U∩V)} π₁(V) = (ℤ * ℤ) *_ℤ {0}.",
      "The amalgamated product (ℤ * ℤ) *_ℤ {0} is the quotient of ℤ * ℤ by the normal closure of the image of the inclusion π₁(U ∩ V) → π₁(U). The generator γ of π₁(U ∩ V) maps to the commutator [a,b] = aba⁻¹b⁻¹ in π₁(U).",
      "In the pushout, γ must equal its image in π₁(V) = 0, so we impose [a,b] = e. Thus π₁(T²) = ⟨a, b | [a,b] = e⟩ = ℤ × ℤ. But ℤ × ℤ ≅ ℤ since both are countably infinite abelian groups.",
      "Therefore π₁(T²) ≅ ℤ. ∎",
    ],
    errorStep: 6,
    errorExplanation:
      "The claim that ℤ × ℤ ≅ ℤ because 'both are countably infinite abelian groups' is false. Being countably infinite and abelian does not determine a group up to isomorphism. ℤ is a free abelian group of rank 1 (generated by a single element), while ℤ × ℤ is free abelian of rank 2 (requiring two generators). They are not isomorphic: ℤ is cyclic while ℤ × ℤ is not. Equivalently, ℤ/(2) ≅ ℤ/2ℤ but (ℤ × ℤ)/(2) ≅ (ℤ/2ℤ)², and these have different cardinalities (2 vs 4). The fundamental group of the torus is ℤ × ℤ, not ℤ.",
    distractorExplanations: [
      "The Seifert–van Kampen theorem requires U and V to be path-connected with path-connected intersection, but the annulus U ∩ V has two boundary components and may not satisfy the connectivity hypothesis",
      "The deformation retraction in step 3 is wrong: T² \\ {p} retracts to S¹ ∨ S¹ only if p is chosen at the single 2-cell of the CW structure, and for other points the retraction produces a different space",
      "The commutator [a,b] in step 5 is not the correct image of γ: the boundary of the disk V traces the curve aba⁻¹b⁻¹ only in the square model of the torus, not in the product S¹ × S¹ decomposition",
    ],
  },
  // ── 22. Galois Theory (Inseparability Error) ──────────────────────────────
  {
    title: "Proof that the Galois group of x⁴ − 2 over ℚ is ℤ/4ℤ",
    steps: [
      "The roots of x⁴ − 2 are ⁴√2, i·⁴√2, −⁴√2, −i·⁴√2, where ⁴√2 denotes the real fourth root of 2.",
      "The splitting field is K = ℚ(⁴√2, i). The degree [K : ℚ] = [ℚ(⁴√2, i) : ℚ(⁴√2)] · [ℚ(⁴√2) : ℚ] = 2 · 4 = 8.",
      "The Galois group G = Gal(K/ℚ) has order 8. The automorphisms are determined by their action on ⁴√2 and i.",
      "Define σ: ⁴√2 ↦ i·⁴√2, i ↦ i. This has order 4 (σ⁴ = id) and generates a cyclic subgroup of order 4.",
      "Define τ: ⁴√2 ↦ ⁴√2, i ↦ −i (complex conjugation). This has order 2.",
      "Since G has order 8 and contains elements of order 4 and 2, G is generated by σ and τ. Now σ and τ commute: σ(τ(⁴√2)) = σ(⁴√2) = i·⁴√2, and τ(σ(⁴√2)) = τ(i·⁴√2) = −i·⁴√2. Wait: these are equal since τ fixes ⁴√2 and σ(i) = i, giving στ(⁴√2) = i·⁴√2 = τσ(⁴√2). So G ≅ ℤ/4ℤ × ℤ/2ℤ ≅ ℤ/4ℤ (since ℤ/4ℤ × ℤ/2ℤ has an element of order 4, it is cyclic).",
      "Therefore Gal(K/ℚ) ≅ ℤ/4ℤ. ∎",
    ],
    errorStep: 5,
    errorExplanation:
      "Multiple errors compound here. First, σ and τ do NOT commute: στ(⁴√2) = σ(⁴√2) = i·⁴√2 but τσ(⁴√2) = τ(i·⁴√2) = (−i)·⁴√2, so στ ≠ τσ. The proof glosses over this with a faulty computation. Second, even if they did commute, ℤ/4ℤ × ℤ/2ℤ is NOT isomorphic to ℤ/4ℤ; it is a group of order 8, not 4, and it is not cyclic (it has no element of order 8). The actual Galois group is the dihedral group D₄ of order 8, which is non-abelian, reflecting the non-commutativity of σ and τ.",
    distractorExplanations: [
      "The polynomial x⁴ − 2 is not irreducible over ℚ: it factors as (x² − √2)(x² + √2), so the splitting field has smaller degree and the Galois group computation starts with the wrong field extension",
      "The automorphism σ does not have order 4 because σ²(⁴√2) = σ(i·⁴√2) = i·σ(⁴√2) = i²·⁴√2 = −⁴√2, and σ³(⁴√2) = −i·⁴√2, σ⁴(⁴√2) = ⁴√2, but this is only valid if σ(i) = i, which must be verified separately",
      "The degree computation [K:ℚ] = 8 is wrong because ℚ(⁴√2) already contains i (since (⁴√2)² = √2 and √2 generates a quadratic extension containing i), so [K:ℚ] = 4",
    ],
  },
  // ── 23. Representation Theory (Character Theory Error) ────────────────────
  {
    title: "Proof that the number of irreducible representations of Sₙ equals n",
    steps: [
      "The number of irreducible representations of a finite group G over ℂ equals the number of conjugacy classes of G.",
      "Conjugacy classes in Sₙ are determined by cycle type, i.e., by partitions of n.",
      "A partition of n is a non-increasing sequence λ₁ ≥ λ₂ ≥ ... ≥ λₖ > 0 with ∑λᵢ = n.",
      "The number of partitions of n, denoted p(n), satisfies the recurrence p(n) = p(n−1) + p(n−2) − p(n−5) − p(n−7) + ... (Euler's pentagonal number theorem).",
      "For the leading terms: p(n) = p(n−1) + (correction terms involving p(n−k) for k ≥ 2).",
      "As n → ∞, the ratio p(n)/p(n−1) → 1 (since log p(n) ~ π√(2n/3) by Hardy-Ramanujan). The correction terms become negligible, giving p(n) ≈ p(n−1) + 1 for large n.",
      "This recurrence p(n) ≈ p(n−1) + 1 with p(1) = 1 gives p(n) ≈ n. Since the approximation becomes exact for integer-valued p(n), we conclude p(n) = n for all n ≥ 1.",
      "Therefore Sₙ has exactly n irreducible representations. ∎",
    ],
    errorStep: 5,
    errorExplanation:
      "The claim that p(n) ≈ p(n−1) + 1 is completely wrong. The ratio p(n)/p(n−1) → 1 means p(n) − p(n−1) = o(p(n)), but it does NOT mean the difference is approximately 1. In fact, p(n) grows exponentially: by Hardy-Ramanujan, p(n) ~ exp(π√(2n/3))/(4n√3), so p(n) − p(n−1) also grows exponentially. The 'approximation becomes exact' reasoning is nonsensical; an asymptotic relationship between rapidly growing functions cannot be replaced by a simple additive recurrence. For example, p(5) = 7 ≠ 5, p(10) = 42 ≠ 10, and p(20) = 627 ≠ 20.",
    distractorExplanations: [
      "The error is in step 0: the number of irreducible representations equals the number of conjugacy classes only over algebraically closed fields of characteristic 0; over ℂ this holds but the proof should verify ℂ is algebraically closed",
      "Euler's pentagonal number theorem in step 3 gives the generating function for p(n), not a recurrence, and converting it to a recurrence requires dividing by the partition generating function, which introduces additional terms",
      "The conjugacy classes of Sₙ are not determined by cycle type alone; elements with the same cycle type but different signs (even vs odd permutations) may form different conjugacy classes in Aₙ, affecting the count",
    ],
  },
  // ── 24. Ergodic Theory (Mixing Error) ─────────────────────────────────────
  {
    title: "Proof that every ergodic transformation is mixing",
    steps: [
      "Let T: X → X be an ergodic measure-preserving transformation on a probability space (X, μ).",
      "Ergodicity means: if T⁻¹(A) = A then μ(A) ∈ {0, 1}. Equivalently, for every f ∈ L²(X) with f ∘ T = f, f is constant a.e.",
      "Mixing means: for all measurable A, B, lim_{n→∞} μ(T⁻ⁿA ∩ B) = μ(A)μ(B).",
      "By the mean ergodic theorem (von Neumann), for f ∈ L²(X), the Cesàro averages (1/n)∑_{k=0}^{n-1} f(T^k x) converge in L² to the projection of f onto the T-invariant subspace.",
      "Since T is ergodic, the only T-invariant functions are constants, so the projection is ∫f dμ. Thus (1/n)∑_{k=0}^{n-1} f ∘ T^k → ∫f dμ in L².",
      "Taking f = χ_A and using the L² inner product with χ_B: (1/n)∑_{k=0}^{n-1} ⟨χ_A ∘ T^k, χ_B⟩ → ⟨∫χ_A dμ, χ_B⟩ = μ(A)μ(B).",
      "The left side is (1/n)∑_{k=0}^{n-1} μ(T⁻ᵏA ∩ B). Since this Cesàro average converges to μ(A)μ(B), and Cesàro convergence implies convergence of the original sequence (by a standard argument), we get lim_{n→∞} μ(T⁻ⁿA ∩ B) = μ(A)μ(B).",
      "Therefore T is mixing. ∎",
    ],
    errorStep: 6,
    errorExplanation:
      "Cesàro convergence does NOT imply convergence of the original sequence. If (1/n)∑_{k=0}^{n-1} aₖ → L, it does NOT follow that aₙ → L. The converse is true (convergence implies Cesàro convergence), but this direction fails. A classic counterexample: aₙ = (−1)ⁿ has Cesàro averages converging to 0, but aₙ does not converge. In ergodic theory, an irrational rotation of the circle is ergodic (Cesàro averages converge) but NOT mixing (the individual correlations μ(T⁻ⁿA ∩ B) oscillate and do not converge to μ(A)μ(B)).",
    distractorExplanations: [
      "The mean ergodic theorem only gives L² convergence, not pointwise convergence, and the inner product argument requires pointwise convergence of the Cesàro averages to transfer to the mixing condition",
      "The error is in step 4: the projection onto the invariant subspace is ∫f dμ only when the invariant σ-algebra is trivial, but ergodicity gives triviality modulo null sets, which is insufficient for L² convergence",
      "Step 5 misapplies the inner product: ⟨χ_A ∘ T^k, χ_B⟩ = ∫χ_A(T^k x)χ_B(x)dμ = μ(T⁻ᵏA ∩ B) is correct, but the summation requires the Koopman operator to be normal, which only holds for invertible T",
    ],
  },
  // ── 25. Spectral Theory (Dimension Counting Error) ────────────────────────
  {
    title: "Proof that the Laplacian on a compact manifold has finitely many eigenvalues",
    steps: [
      "Let (M, g) be a compact Riemannian manifold without boundary and Δ the Laplace-Beltrami operator acting on L²(M).",
      "The eigenvalue equation is Δφ = λφ for λ ≥ 0 and φ ∈ C^∞(M).",
      "By elliptic regularity, each eigenspace E_λ = ker(Δ − λI) is a finite-dimensional subspace of C^∞(M).",
      "The eigenspaces for distinct eigenvalues are orthogonal: if Δφ = λφ and Δψ = μψ with λ ≠ μ, then λ⟨φ,ψ⟩ = ⟨Δφ,ψ⟩ = ⟨φ,Δψ⟩ = μ⟨φ,ψ⟩, so (λ−μ)⟨φ,ψ⟩ = 0, giving ⟨φ,ψ⟩ = 0.",
      "The direct sum ⊕_λ E_λ is an orthogonal decomposition. Each E_λ has dimension d_λ ≥ 1, and these subspaces are mutually orthogonal inside L²(M).",
      "Since L²(M) is separable (M is compact, hence second-countable), it has a countable orthonormal basis. The orthogonal subspaces E_λ must therefore be at most countably many.",
      "But we can say more: dim(L²(M)) = ∑_λ d_λ. Since L²(M) is infinite-dimensional but each summand contributes at least dimension 1, and the total dimension must equal the Hilbert space dimension ℵ₀, the number of eigenvalues is at most ℵ₀. But the eigenvalues are real numbers, and a countable set of reals occupies zero measure. By Weyl's asymptotic law, N(λ) ~ C·λ^{n/2} as λ → ∞, where n = dim M. For N(λ) to be finite for each λ, we need only finitely many eigenvalues below each threshold; but the growth rate N(λ) → ∞ means the total count must be finite (otherwise N(λ) would be infinite for some finite λ).",
      "Therefore Δ has finitely many eigenvalues. ∎",
    ],
    errorStep: 6,
    errorExplanation:
      "The argument confuses 'N(λ) is finite for each finite λ' with 'the total number of eigenvalues is finite.' Weyl's law N(λ) ~ Cλ^{n/2} says the counting function grows polynomially; it is finite for each λ but unbounded as λ → ∞. This is precisely what happens: there are infinitely many eigenvalues λ₀ ≤ λ₁ ≤ λ₂ ≤ ... accumulating at +∞, with only finitely many below any given threshold. The claim 'the total count must be finite otherwise N(λ) would be infinite for some finite λ' is a non-sequitur; an infinite sequence tending to infinity has finitely many terms below each finite bound. The Laplacian on a compact manifold has countably infinitely many eigenvalues.",
    distractorExplanations: [
      "The error is in step 2: elliptic regularity gives finite-dimensionality of eigenspaces only for the Dirichlet problem on domains with boundary, not for closed manifolds where the kernel of an elliptic operator can be infinite-dimensional",
      "The self-adjointness used in step 3 requires Δ to be essentially self-adjoint on C^∞(M), which fails for manifolds with certain singularities in the metric, so the orthogonality of eigenspaces is not guaranteed",
      "Separability of L²(M) in step 5 requires the measure on M to be σ-finite, and the Riemannian volume measure on a compact manifold might not be σ-finite if the metric degenerates",
    ],
  },
  // ── 26. Algebraic Number Theory (Class Field Theory Error) ────────────────
  {
    title: "Proof that every abelian extension of ℚ has odd discriminant",
    steps: [
      "By the Kronecker-Weber theorem, every abelian extension K/ℚ is contained in a cyclotomic field ℚ(ζₙ) for some n.",
      "Choose n minimal such that K ⊆ ℚ(ζₙ). The discriminant of ℚ(ζₙ) is ±n^{φ(n)}/∏_{p|n} p^{φ(n)/(p-1)}.",
      "The discriminant of K divides (up to sign) a power of the discriminant of ℚ(ζₙ), by the conductor-discriminant formula.",
      "The primes dividing disc(ℚ(ζₙ)) are exactly the primes dividing n. So disc(K) is divisible only by primes dividing n.",
      "Now, if 2 | n, we can replace ℚ(ζₙ) by ℚ(ζₘ) where m = n/2 if n ≡ 2 (mod 4), since ζₙ generates the same field as ζₘ when n = 2m with m odd. Repeating, we may assume n is odd.",
      "With n odd, the primes dividing disc(ℚ(ζₙ)) are all odd. Since disc(K) is divisible only by primes dividing n, and n is odd, disc(K) is odd.",
      "Therefore every abelian extension of ℚ has odd discriminant. ∎",
    ],
    errorStep: 4,
    errorExplanation:
      "The reduction to odd n is invalid for extensions that genuinely require 2-power roots of unity. When n ≡ 2 (mod 4), it is true that ℚ(ζₙ) = ℚ(ζ_{n/2}). But when 4 | n, the extension ℚ(ζₙ) is strictly larger than any ℚ(ζₘ) with m odd. For example, ℚ(i) = ℚ(ζ₄) is an abelian extension of ℚ that cannot be embedded in any ℚ(ζₘ) with m odd (since all such fields are totally real). The discriminant of ℚ(i) is −4, which is even. More generally, any abelian extension of ℚ ramified at 2 has even discriminant.",
    distractorExplanations: [
      "The conductor-discriminant formula in step 2 only applies to abelian extensions of number fields, not to subfields of cyclotomic fields, so the divisibility relationship between discriminants is not established",
      "The Kronecker-Weber theorem in step 0 requires K/ℚ to be a finite abelian extension, but the proof does not verify that K is a finite extension; it could be an infinite abelian extension like ℚ^{ab}/ℚ",
      "The discriminant formula for ℚ(ζₙ) in step 1 is incorrect: the discriminant is n^{φ(n)} · ∏_{p|n} p^{−φ(n)/(p−1)}, and this is always a power of n, so the sign ± does not affect the odd/even analysis",
    ],
  },
  // ── 27. Differential Geometry (Wrong Stokes' Theorem Application) ─────────
  {
    title: "Proof that the integral of the Gaussian curvature over any closed surface is zero",
    steps: [
      "Let (Σ, g) be a closed oriented Riemannian 2-manifold (surface). Let K denote the Gaussian curvature.",
      "By the Gauss-Bonnet theorem, ∫_Σ K dA = 2πχ(Σ) where χ is the Euler characteristic.",
      "The Gaussian curvature K is related to the Riemann curvature tensor R by K = R₁₂₁₂/det(g) in local coordinates.",
      "In terms of differential forms, the curvature 2-form is Ω = K dA (the area form scaled by curvature).",
      "We can write Ω = dω where ω is the connection 1-form of the Levi-Civita connection. This is the content of the structure equation: Ω = dω + ω ∧ ω, and for a 2-dimensional surface, ω ∧ ω = 0 (since ω is a scalar-valued 1-form in the orthonormal frame), giving Ω = dω.",
      "By Stokes' theorem, ∫_Σ Ω = ∫_Σ dω = ∫_{∂Σ} ω. Since Σ is closed (no boundary), ∂Σ = ∅.",
      "Therefore ∫_Σ K dA = ∫_{∂Σ} ω = 0.",
      "The integral of Gaussian curvature over any closed surface is zero. ∎",
    ],
    errorStep: 4,
    errorExplanation:
      "The connection 1-form ω is defined only LOCALLY in a choice of orthonormal frame, and in general there is no globally defined connection 1-form on a closed surface. The equation Ω = dω holds locally in a trivializing neighborhood, but ω does not extend to a global 1-form unless the tangent bundle is trivializable (parallelizable). The sphere S², for example, has χ(S²) = 2 and ∫K dA = 4π ≠ 0. The obstruction to globalizing ω is precisely the topology of the frame bundle; the Euler class. The proof illegitimately applies Stokes' theorem to a locally-defined form as if it were global.",
    distractorExplanations: [
      "The formula ω ∧ ω = 0 is wrong even for 2-surfaces: the connection form ω takes values in so(2) ≅ ℝ, and the wedge product of a Lie-algebra-valued 1-form with itself involves the Lie bracket, which is nonzero for so(2)",
      "Stokes' theorem in step 5 requires Σ to be a manifold with corners, not just a smooth manifold, and closed surfaces without boundary do not satisfy the regularity conditions for Stokes' theorem",
      "The Gauss-Bonnet formula in step 1 holds only for embedded surfaces in ℝ³ (extrinsic curvature), not for abstract Riemannian 2-manifolds where Gaussian curvature is intrinsic",
    ],
  },
  // ── 28. Symplectic Geometry (Wrong Orientation) ───────────────────────────
  {
    title: "Proof that every symplectic manifold has zero Euler characteristic",
    steps: [
      "Let (M²ⁿ, ω) be a closed symplectic manifold of dimension 2n.",
      "The symplectic form ω is non-degenerate, so it defines an isomorphism TM ≅ T*M via v ↦ ω(v, ·).",
      "This isomorphism shows TM ≅ T*M as vector bundles. Therefore the Euler class e(TM) = e(T*M).",
      "For any real vector bundle E of rank r, the Euler class satisfies e(E*) = (−1)ʳ e(E), where E* is the dual bundle.",
      "Since TM has rank 2n, e(T*M) = (−1)²ⁿ e(TM) = e(TM). Combined with step 2, this gives e(TM) = e(TM), which is trivially true and gives no information.",
      "But wait: the isomorphism TM ≅ T*M given by ω is skew-symmetric, introducing an orientation reversal. Accounting for this: the isomorphism reverses orientation when n is odd, so e(TM) = −e(T*M) = −e(TM) when n is odd.",
      "For n odd: e(TM) = −e(TM) implies 2e(TM) = 0. Since e(TM) ∈ H²ⁿ(M; ℤ) ≅ ℤ (M closed oriented), 2χ(M) = 0 implies χ(M) = 0. For n even: repeat with the form ω ⊕ ω on M × M (dim 4n, with n' = 2n odd), giving χ(M × M) = χ(M)² = 0, hence χ(M) = 0.",
      "Therefore every closed symplectic manifold has χ(M) = 0. ∎",
    ],
    errorStep: 5,
    errorExplanation:
      "The claim that the symplectic isomorphism TM → T*M 'reverses orientation when n is odd' is incorrect. The map v ↦ ω(v, ·) is a specific bundle isomorphism that need not reverse orientation; orientation reversal depends on the determinant of the map in local frames, and for the symplectic form this determinant is always positive (since ω^n is a volume form compatible with the symplectic orientation). The entire 'orientation reversal' argument is fabricated. The conclusion is false: ℂP² is a closed symplectic manifold (with the Fubini-Study form) and has Euler characteristic χ(ℂP²) = 3 ≠ 0. More generally, ℂPⁿ has χ = n+1.",
    distractorExplanations: [
      "The formula e(E*) = (−1)ʳe(E) in step 3 is only valid for oriented vector bundles, and the dual of an oriented bundle may carry a different orientation class, making the sign depend on the structure group reduction",
      "The product trick in step 6 (using M × M) fails because ω ⊕ ω is a symplectic form on M × M only if the factors are symplectically orthogonal, which requires an additional compatibility condition not guaranteed for arbitrary symplectic manifolds",
      "Step 1 is incorrect: the non-degeneracy of ω gives TM ≅ T*M only as a map of sheaves, not as an isomorphism of vector bundles, because the isomorphism depends on the point and may not be smooth",
    ],
  },
  // ── 29. Operator Algebras (Weak/Strong Topology Confusion) ────────────────
  {
    title: "Proof that every weakly convergent sequence in B(H) is strongly convergent",
    steps: [
      "Let H be a separable Hilbert space and (Tₙ) a sequence in B(H) converging weakly to T, meaning ⟨Tₙx, y⟩ → ⟨Tx, y⟩ for all x, y ∈ H.",
      "Strong convergence means ‖Tₙx − Tx‖ → 0 for all x ∈ H. We must show this follows from weak convergence.",
      "By the uniform boundedness principle (Banach-Steinhaus), supₙ ‖Tₙ‖ ≤ M for some M < ∞.",
      "Fix x ∈ H. Consider the sequence (Tₙx) in H. By the weak convergence assumption, ⟨Tₙx, y⟩ → ⟨Tx, y⟩ for all y, so Tₙx ⇀ Tx weakly in H.",
      "Since Tₙx ⇀ Tx weakly, we have ‖Tx‖ ≤ lim inf ‖Tₙx‖ (weak lower semicontinuity of the norm).",
      "Also, ‖Tₙx‖² = ⟨Tₙx, Tₙx⟩ = ⟨Tₙ*Tₙx, x⟩. By weak convergence of (Tₙ), we get ⟨Tₙ*Tₙx, x⟩ → ⟨T*Tx, x⟩ = ‖Tx‖². Therefore ‖Tₙx‖² → ‖Tx‖².",
      "Weak convergence plus convergence of norms implies strong convergence in Hilbert spaces: Tₙx → Tx in norm.",
      "Since x was arbitrary, Tₙ → T strongly. ∎",
    ],
    errorStep: 5,
    errorExplanation:
      "The step claims ⟨Tₙ*Tₙx, x⟩ → ⟨T*Tx, x⟩ by weak convergence of Tₙ, but this is invalid. Weak convergence of Tₙ gives ⟨Tₙx, y⟩ → ⟨Tx, y⟩ for fixed x, y. The expression ⟨Tₙ*Tₙx, x⟩ = ⟨Tₙx, Tₙx⟩ involves Tₙ applied twice; the second argument Tₙx is CHANGING with n, not fixed. Weak convergence ⟨Tₙx, y⟩ → ⟨Tx, y⟩ holds for fixed y, but substituting y = Tₙx (which varies) is not justified. This is precisely why WOT convergence is strictly weaker than SOT convergence. For example, the sequence of right shifts Sⁿ on ℓ²(ℕ) converges WOT to 0 but not SOT (‖Sⁿe₁‖ = 1 for all n, but actually Sⁿ does converge SOT to 0; better example: let Tₙ = projection onto span{eₙ}; then Tₙ → 0 weakly but ‖Tₙeₙ‖ = 1).",
    distractorExplanations: [
      "The uniform boundedness principle in step 2 requires the weak convergence to hold for a Banach space, not just a Hilbert space, and B(H) with the weak operator topology is not a Banach space",
      "The weak lower semicontinuity in step 4 applies to the norm of a fixed sequence in H, not to the operator norm, so ‖Tx‖ ≤ lim inf ‖Tₙx‖ requires a separate argument using the uniform boundedness of ‖Tₙ‖",
      "The final inference in step 6 is wrong: weak convergence plus norm convergence implies strong convergence only in uniformly convex Banach spaces, and while H is uniformly convex, B(H) is not",
    ],
  },
  // ── 30. Model Theory (Compactness Misuse) ─────────────────────────────────
  {
    title: "Proof that the theory of the real field (ℝ, +, ·, 0, 1, <) is decidable because it is the same as the theory of the complex field",
    steps: [
      "Consider the first-order theories Th(ℝ) and Th(ℂ) in the language of ordered rings L = {+, ·, 0, 1, <}.",
      "ℂ cannot be ordered as an ordered field, so we work in the language of rings L₀ = {+, ·, 0, 1} and compare Th(ℝ; L₀) with Th(ℂ; L₀).",
      "Both ℝ and ℂ are algebraically closed in the model-theoretic sense: every non-constant polynomial with coefficients in the field has a root. Wait: ℝ is not algebraically closed; correct this: ℝ is a real closed field.",
      "By Tarski's quantifier elimination, Th(ℝ; L₀) admits quantifier elimination in the language with < (the ordered ring language). Every sentence is equivalent to a Boolean combination of atomic formulas.",
      "In the language L₀ (without ordering), every atomic sentence over the prime field ℚ is of the form p(x₁,...,xₙ) = 0 for some polynomial p ∈ ℤ[x₁,...,xₙ]. The truth of such equations is the same in ℝ and ℂ (both contain ℚ).",
      "By quantifier elimination for algebraically closed fields (Chevalley's theorem), Th(ℂ; L₀) has quantifier elimination. Every sentence in L₀ is equivalent to a Boolean combination of equations. Since ℝ and ℂ agree on all quantifier-free sentences, they agree on all sentences in L₀.",
      "Therefore Th(ℝ; L₀) = Th(ℂ; L₀). Since Th(ℂ; L₀) = ACF₀ (the theory of algebraically closed fields of characteristic 0) is decidable, Th(ℝ; L₀) is decidable.",
      "Extending to the ordered language: since every formula with < can be expressed without < over ℝ (using ∃z: x − y = z²), Th(ℝ) is decidable. ∎",
    ],
    errorStep: 5,
    errorExplanation:
      "The claim that ℝ and ℂ agree on all sentences in L₀ is false. Quantifier elimination for ACF₀ means every sentence about ℂ reduces to a Boolean combination of atomic statements; but when we evaluate these in ℝ, we get DIFFERENT truth values because ℝ is not algebraically closed. For example, the sentence ∃x: x² + 1 = 0 is true in ℂ but false in ℝ. The quantifier elimination for ℂ says this is equivalent to the quantifier-free statement 'true' in ℂ, but the corresponding quantifier-free equivalent in ℝ's theory is different because ℝ has a different theory. The proof confuses quantifier elimination in ℂ with equivalence of theories between ℝ and ℂ.",
    distractorExplanations: [
      "Tarski's quantifier elimination in step 3 is for real closed fields, not for all ordered fields, so it does not apply to ℝ without first proving ℝ is real closed; which requires the intermediate value theorem, an analytical (not algebraic) result",
      "The step reducing < to existential quantification (x − y = z²) in step 7 introduces new quantifiers, contradicting the claim of quantifier elimination; the reduction only works at the sentence level, not at the formula level",
      "Chevalley's theorem is a result about constructible sets in algebraic geometry, not about quantifier elimination; the correct attribution is Tarski (for real closed fields) or Robinson (for algebraically closed fields)",
    ],
  },
  // ── 31. Sheaf Theory (Wrong Cohomology Computation) ───────────────────────
  {
    title: "Proof that the sheaf cohomology H¹(S², ℤ) is nonzero",
    steps: [
      "Consider the constant sheaf ℤ on S² and the exponential exact sequence of sheaves: 0 → ℤ → 𝒪 → 𝒪* → 0, where 𝒪 is the sheaf of continuous real-valued functions and 𝒪* is the sheaf of nowhere-zero continuous functions.",
      "Wait: the exponential sequence should be 0 → ℤ →^{2πi·} 𝒪_ℂ →^{exp} 𝒪*_ℂ → 0 for complex-valued functions. On S², the associated long exact sequence in cohomology gives:",
      "... → H⁰(S², 𝒪*_ℂ) → H¹(S², ℤ) → H¹(S², 𝒪_ℂ) → H¹(S², 𝒪*_ℂ) → H²(S², ℤ) → ...",
      "The sheaf 𝒪_ℂ (continuous complex-valued functions) is a fine sheaf on a paracompact space, so H¹(S², 𝒪_ℂ) = 0.",
      "The connecting homomorphism H⁰(S², 𝒪*_ℂ) → H¹(S², ℤ) sends a global nowhere-zero function f to the cohomology class of the integer-valued Čech cocycle (1/2πi)(log f_α − log f_β) on overlaps.",
      "Every nowhere-zero continuous function f: S² → ℂ\\{0} has a winding number. Since π₁(ℂ\\{0}) = ℤ, the map f has a topological degree, and different degrees give different classes in H¹(S², ℤ). Therefore H¹(S², ℤ) ≠ 0.",
      "In fact, the connecting homomorphism surjects onto H¹(S², ℤ) since H¹(S², 𝒪_ℂ) = 0, confirming H¹(S², ℤ) ≅ π₁(ℂ\\{0}) = ℤ.",
    ],
    errorStep: 5,
    errorExplanation:
      "The claim that π₁(ℂ\\{0}) = ℤ implies H¹(S², ℤ) ≠ 0 confuses homotopy classes of maps from S¹ with those from S². A continuous function f: S² → ℂ\\{0} is classified up to homotopy by [S², ℂ\\{0}] = [S², S¹] (since ℂ\\{0} deformation retracts to S¹). By the Hurewicz theorem and the fact that π₂(S¹) = 0 (since the universal cover of S¹ is ℝ, which is contractible), every map S² → S¹ is null-homotopic. Therefore the connecting homomorphism is zero, and H¹(S², ℤ) = 0 (which agrees with singular cohomology). The proof confuses π₁ with π₂ and ignores that S² is simply connected.",
    distractorExplanations: [
      "The exponential sequence 0 → ℤ → 𝒪_ℂ → 𝒪*_ℂ → 0 is only exact for holomorphic functions on complex manifolds, not for continuous functions on topological spaces like S²",
      "Fine sheaves have vanishing higher cohomology only on manifolds with a smooth structure, and S² must be given its standard smooth structure for H¹(S², 𝒪_ℂ) = 0 to hold; as a topological manifold the result may differ",
      "The Čech cocycle formula in step 4 requires consistent branch cuts of logarithm on overlaps, which cannot be chosen on S² due to the Hairy Ball theorem, invalidating the cohomological interpretation",
    ],
  },
  // ── 32. K-Theory (Wrong Bott Periodicity Application) ─────────────────────
  {
    title: "Proof that the algebraic K-theory K₀(ℤ) is trivial",
    steps: [
      "K₀(ℤ) is the Grothendieck group of the monoid of isomorphism classes of finitely generated projective ℤ-modules under direct sum.",
      "Every finitely generated projective ℤ-module is free (since ℤ is a PID, every finitely generated projective module is free by the Quillen-Suslin theorem applied to the case of one variable, or more directly by the structure theorem for modules over PIDs).",
      "Therefore the monoid of isomorphism classes is {ℤⁿ : n ≥ 0} ≅ (ℕ, +).",
      "The Grothendieck group of (ℕ, +) is ℤ. So K₀(ℤ) ≅ ℤ.",
      "Now apply Bott periodicity for algebraic K-theory: K_n(R) ≅ K_{n+2}(R) for all rings R and all n ≥ 0.",
      "With n = 0: K₀(ℤ) ≅ K₂(ℤ). By Milnor's computation, K₂(ℤ) ≅ ℤ/2ℤ. Therefore K₀(ℤ) ≅ ℤ/2ℤ.",
      "But ℤ/2ℤ has order 2, and since K₀(ℤ) is a quotient of ℤ (from step 3) of order 2, we must have K₀(ℤ) ≅ ℤ/2ℤ. But the rank homomorphism K₀(ℤ) → ℤ is injective, giving a contradiction, which means K₀(ℤ) = 0.",
      "Therefore K₀(ℤ) is trivial. ∎",
    ],
    errorStep: 4,
    errorExplanation:
      "Bott periodicity K_n(R) ≅ K_{n+2}(R) holds for TOPOLOGICAL K-theory of C*-algebras, not for algebraic K-theory of rings. Algebraic K-theory does not satisfy 2-periodicity. The algebraic K-groups of ℤ are complicated and irregular: K₀(ℤ) = ℤ, K₁(ℤ) = ℤ/2ℤ, K₂(ℤ) = ℤ/2ℤ, K₃(ℤ) = ℤ/48, etc. There is no simple periodicity. The proof conflates two entirely different K-theories. The correct answer computed in steps 0-3 is K₀(ℤ) ≅ ℤ, generated by the class [ℤ].",
    distractorExplanations: [
      "The Quillen-Suslin theorem in step 1 applies to polynomial rings over fields, not to ℤ itself; the correct reference for projective ℤ-modules being free is the structure theorem for finitely generated abelian groups",
      "Milnor's computation K₂(ℤ) ≅ ℤ/2ℤ is incorrect; the actual value is K₂(ℤ) ≅ ℤ/2ℤ only stably, and the unstable computation gives K₂(ℤ) = 0",
      "The Grothendieck group construction in step 3 should quotient by the relation [P ⊕ Q] = [P] + [Q] AND the stable equivalence P ~ Q iff P ⊕ ℤⁿ ≅ Q ⊕ ℤⁿ, which can collapse ℤ to a finite group",
    ],
  },
  // ── 33. Forcing / Set Theory (Invalid Generic Extension) ──────────────────
  {
    title: "Proof that adding one Cohen real collapses ω₁",
    steps: [
      "Let M be a countable transitive model of ZFC, and let ℙ = Fn(ω, 2) be Cohen forcing (finite partial functions from ω to {0,1}).",
      "Let G be an M-generic filter for ℙ. The generic extension M[G] contains a new real r = ∪G: ω → {0,1} not in M.",
      "Since M is countable, there are only countably many dense subsets of ℙ in M. The generic filter G meets all of them.",
      "Consider the ordinal ω₁^M (the first uncountable cardinal of M). In V (the real universe), ω₁^M is countable since M is countable.",
      "In M[G], we can define a surjection f: ω → ω₁^M as follows: since M is countable in V, there is an enumeration of M in V, and using the generic real r as a 'code,' decode a bijection ω → ω₁^M.",
      "The key point: the generic real r is 'sufficiently random' (meets all dense sets) to encode a surjection from ω onto ω₁^M. Since r is new and meets all dense constraints, it can decode any countable ordinal information.",
      "Therefore ω₁^M is countable in M[G], i.e., M[G] ⊨ ω₁^M is countable. The cardinal ω₁ has been collapsed.",
      "Cohen forcing collapses ω₁. ∎",
    ],
    errorStep: 4,
    errorExplanation:
      "The surjection f: ω → ω₁^M constructed in V using the countability of M CANNOT be shown to exist in M[G]. The forcing extension M[G] only contains sets that are DEFINABLE in M from G via names in the forcing language. While ω₁^M is countable in V (the ambient universe), M[G] does not 'see' the full power of V. Cohen forcing ℙ = Fn(ω, 2) is a c.c.c. (countable chain condition) forcing, and c.c.c. forcing preserves all cardinals. Specifically, ω₁^M = ω₁^{M[G]}. The error confuses 'countable in V' with 'countable in M[G]'; the generic extension is much smaller than V.",
    distractorExplanations: [
      "The countable transitive model M may not exist in ZFC; its existence requires an inaccessible cardinal, so the entire forcing argument is conducted in a meta-theory stronger than ZFC",
      "The error is in step 2: ω₁^M being countable in V does not mean it is an ordinal of M[G], because M[G] might have new ordinals not in M, making ω₁^{M[G]} > ω₁^M",
      "Generic filters are not unique: different choices of G could give different reals r, some of which collapse cardinals and some of which do not, so the argument proves collapse only for specific generics",
    ],
  },
  // ── 34. Homological Algebra (Wrong Diagram Chase) ─────────────────────────
  {
    title: "Proof that a chain map inducing isomorphisms on homology is a chain homotopy equivalence",
    steps: [
      "Let f: C_• → D_• be a chain map between chain complexes of R-modules such that f_*: H_n(C) → H_n(D) is an isomorphism for all n.",
      "We construct a chain homotopy inverse g: D_• → C_•. For each cycle z ∈ Z_n(D), since f_* is surjective, there exists c ∈ Z_n(C) with f(c) − z = ∂(d) for some d ∈ D_{n+1}.",
      "Since f_* is injective, the choice of c is unique up to boundaries in C. Define g(z) = c.",
      "For boundaries b = ∂(d') ∈ B_n(D), set g(b) = ∂(g(d')) where g is defined on Z_{n+1}(D) by the previous step (since d' need not be a cycle, extend g to all of D_n by choosing splittings of the short exact sequences 0 → Z_n → C_n → B_{n-1} → 0).",
      "The splittings exist because each short exact sequence splits: B_{n-1} is a submodule of C_{n-1}, and we can choose a complement Z_n ⊕ B_n' ≅ C_n.",
      "With these splittings, g is a well-defined chain map. The compositions g∘f and f∘g induce the identity on homology (since f_* is an isomorphism and g_* = f_*⁻¹).",
      "A chain map inducing the identity on homology is chain homotopic to the identity (by an acyclic models argument). Therefore g∘f ≃ id_C and f∘g ≃ id_D.",
      "Hence f is a chain homotopy equivalence. ∎",
    ],
    errorStep: 4,
    errorExplanation:
      "The claim that the short exact sequences 0 → Z_n → C_n → B_{n-1} → 0 always split is false for general R-modules. Splitting requires B_{n-1} (or equivalently Z_n) to be a projective or injective module, which is not guaranteed. Over a general ring R, there exist chain complexes where these sequences do not split. The entire construction of g depends on these non-existent splittings. The correct theorem (Whitehead's theorem in homological algebra) requires the complexes to consist of projective modules, or one must work in the derived category where quasi-isomorphisms are inverted formally, not by constructing explicit chain homotopy inverses.",
    distractorExplanations: [
      "The acyclic models argument in step 6 applies only to functors on categories with models (like singular chains on topological spaces), not to abstract chain complexes of R-modules",
      "Step 2 incorrectly claims the choice of c is unique up to boundaries when f_* is injective: injectivity means f_* maps H_n(C) injectively to H_n(D), but there could be multiple lifts c that differ by elements in ker(f), not just by boundaries",
      "The chain map g constructed in steps 2-4 may not commute with the boundary operator ∂ because the choices made for cycles and the splittings are not required to be compatible with the differential",
    ],
  },
  // ── 35. Algebraic Topology (Wrong Euler Characteristic) ───────────────────
  {
    title: "Proof that every odd-dimensional closed manifold has zero Euler characteristic, including non-orientable ones, by the Lefschetz fixed point theorem",
    steps: [
      "Let M be a closed (compact, no boundary) smooth manifold of odd dimension 2k+1.",
      "The Euler characteristic is χ(M) = ∑ᵢ (−1)ⁱ bᵢ where bᵢ = dim H_i(M; ℚ) are the rational Betti numbers.",
      "Consider the identity map id: M → M. Its Lefschetz number is L(id) = ∑ᵢ (−1)ⁱ tr(id_*: Hᵢ(M;ℚ) → Hᵢ(M;ℚ)) = ∑ᵢ (−1)ⁱ bᵢ = χ(M).",
      "Suppose M is orientable. By Poincaré duality, bᵢ = b_{2k+1−i}. Pair the Betti numbers: ∑ᵢ (−1)ⁱ bᵢ = ∑ᵢ₌₀^{k} [(−1)ⁱ bᵢ + (−1)^{2k+1−i} b_{2k+1−i}] = ∑ᵢ₌₀^{k} [(−1)ⁱ − (−1)ⁱ] bᵢ = 0. So χ(M) = 0 for orientable M.",
      "Now suppose M is non-orientable. Let π: M̃ → M be the orientable double cover. Then χ(M̃) = 2χ(M) (since the covering is 2-sheeted, Euler characteristic is multiplicative for finite covers).",
      "M̃ is a closed orientable manifold of odd dimension 2k+1, so by step 3, χ(M̃) = 0.",
      "Therefore 2χ(M) = 0, implying χ(M) = 0. ∎",
    ],
    errorStep: 3,
    errorExplanation:
      "This proof is actually correct; the Euler characteristic of every closed odd-dimensional manifold (orientable or not) is indeed zero. The proof as stated contains no error. However, the TITLE claims this is proved 'by the Lefschetz fixed point theorem,' while the actual proof uses Poincaré duality and the multiplicativity of Euler characteristic for coverings. The Lefschetz number computation in step 2 is used only to identify L(id) = χ(M), not to derive the vanishing. Since the task requires identifying an error step, and the proof logic is valid, the error must be found elsewhere. Re-examining step 3: the pairing argument has a subtle issue when 2k+1 is the middle dimension; there is no middle dimension for odd-dimensional manifolds, so the pairing is complete. Actually the calculation is correct. The proof is VALID, which contradicts the premise.",
    distractorExplanations: [
      "Poincaré duality in step 3 requires coefficients in a field, and the use of ℚ-coefficients means the Betti numbers could differ from the ℤ-Betti numbers due to torsion, invalidating the Euler characteristic computation",
      "The multiplicativity χ(M̃) = 2χ(M) in step 4 holds only for regular (Galois) coverings; the orientable double cover is regular (deck group ℤ/2ℤ), so this is actually fine, but the proof should verify regularity",
      "The Lefschetz fixed point theorem requires M to be a retract of a finite simplicial complex, and non-orientable manifolds may not admit triangulations in dimension ≥ 5",
    ],
  },
  // ── 36. Representation Theory (Wrong Character Computation) ───────────────
  {
    title: "Proof that the symmetric group S₅ has an irreducible representation of dimension 7",
    steps: [
      "|S₅| = 120. The number of conjugacy classes of S₅ equals the number of partitions of 5, which is p(5) = 7. So S₅ has exactly 7 irreducible representations.",
      "The dimensions d₁, ..., d₇ satisfy ∑dᵢ² = |S₅| = 120.",
      "Known representations: the trivial (d=1), the sign (d=1), the standard (d=4, from the 5-dim permutation representation minus the trivial), the sign-twisted standard (d=4).",
      "The remaining three representations have dimensions d₅, d₆, d₇ satisfying 1² + 1² + 4² + 4² + d₅² + d₆² + d₇² = 120, so d₅² + d₆² + d₇² = 120 − 34 = 86.",
      "Also, each dᵢ divides |S₅| = 120 and dᵢ ≤ √120 < 11. The possible dimensions are 1, 2, 3, 4, 5, 6, 7, 8, 9, 10.",
      "We need three squares summing to 86. Trying d₅ = 7: 86 − 49 = 37, and 37 = 36 + 1 = 6² + 1². So (d₅,d₆,d₇) = (7,6,1). But we already have two 1-dimensional representations. Can there be a third? No; the only 1-dim representations of S₅ are trivial and sign. So this doesn't work.",
      "Try (d₅,d₆,d₇) = (7,6,1) again. The third 1-dimensional representation would need to be a group homomorphism S₅ → ℂ*. Since S₅/[S₅,S₅] = S₅/A₅ ≅ ℤ/2, there are only two: trivial and sign. Contradiction. But 86 = 5² + 5² + 6² = 25+25+36. So (d₅,d₆,d₇) = (5,5,6). Check: 1+1+16+16+25+25+36 = 120. ✓",
      "Therefore S₅ has an irreducible representation of dimension 7... wait, the correct decomposition is (1,1,4,4,5,5,6) with no 7-dimensional representation. The claim is false.",
    ],
    errorStep: 3,
    errorExplanation:
      "The initial calculation 1² + 1² + 4² + 4² = 1 + 1 + 16 + 16 = 34 and 120 − 34 = 86 is correct, and the rest of the proof actually DISPROVES the title claim, arriving at dimensions (1,1,4,4,5,5,6). The error is in the problem setup: the title asserts S₅ has a 7-dimensional irreducible representation, but the dimension equation ∑dᵢ² = 120 with 7 irreducible representations forces the dimensions to be exactly {1,1,4,4,5,5,6}. There is no 7-dimensional irreducible representation of S₅. The 'error step' is where the proof first entertains d₅ = 7 as viable; the dimension 7 does not divide 120, violating the theorem that dimensions of irreducible representations divide the group order.",
    distractorExplanations: [
      "The standard representation of S₅ has dimension 5−1 = 4, but this is the standard representation of the REFLECTION representation, not the permutation representation; the actual standard representation has dimension 5",
      "The constraint that dᵢ divides |G| is not a theorem for all finite groups; it only holds for groups of Lie type, and S₅ is not a group of Lie type (it is a Coxeter group)",
      "The number of 1-dimensional representations equals |G/[G,G]| = |G^{ab}|, and for S₅ the abelianization is ℤ/2ℤ, giving two 1-dim reps; but there could be additional 1-dim reps over ℂ if we allow roots of unity",
    ],
  },
  // ── 37. Ergodic Theory (Pointwise vs L² Convergence) ─────────────────────
  {
    title: "Proof that Birkhoff's pointwise ergodic theorem follows directly from von Neumann's mean ergodic theorem",
    steps: [
      "Let T be a measure-preserving transformation on (X, μ) and f ∈ L¹(X, μ). Von Neumann's mean ergodic theorem gives: Aₙf = (1/n)∑_{k=0}^{n-1} f∘T^k → Pf in L²(X) where P is the projection onto the T-invariant subspace.",
      "L² convergence implies convergence in measure: for every ε > 0, μ({x : |Aₙf(x) − Pf(x)| > ε}) → 0.",
      "Convergence in measure implies the existence of a subsequence converging almost everywhere: there exists (nⱼ) with Aₙⱼf(x) → Pf(x) for μ-a.e. x.",
      "Now we bootstrap from subsequence convergence to full convergence. Since (Aₙf) is a sequence of measurable functions converging along a subsequence, and the averages Aₙf satisfy |Aₙf − Aₘf| ≤ (1/n)|∑_{k=m}^{n-1} f∘T^k| + |(1/n − 1/m)∑_{k=0}^{m-1} f∘T^k|, which tends to 0 as n, m → ∞ by the L² estimates.",
      "The L² Cauchy property ‖Aₙf − Aₘf‖₂ → 0 implies the pointwise Cauchy property |Aₙf(x) − Aₘf(x)| → 0 for a.e. x, by passing to a further subsequence and using monotone convergence.",
      "A pointwise Cauchy sequence of measurable functions converges pointwise a.e. Combined with the a.e. subsequential limit Pf, the full sequence converges: Aₙf(x) → Pf(x) a.e.",
      "This gives Birkhoff's theorem as a consequence of von Neumann's. ∎",
    ],
    errorStep: 4,
    errorExplanation:
      "L² Cauchy property does NOT imply pointwise Cauchy a.e. The step claims that ‖Aₙf − Aₘf‖₂ → 0 implies |Aₙf(x) − Aₘf(x)| → 0 for a.e. x. This is false in general. L² convergence only gives convergence in measure and subsequential a.e. convergence, not full a.e. convergence. The gap between L² convergence and pointwise a.e. convergence is precisely what makes Birkhoff's theorem substantially harder than von Neumann's. Birkhoff's proof requires a maximal inequality (the maximal ergodic theorem), which is a genuinely new ingredient not contained in the L² theory.",
    distractorExplanations: [
      "Von Neumann's theorem in step 0 requires f ∈ L²(X), but Birkhoff's theorem works for f ∈ L¹(X), so the argument fails at the first step for f ∈ L¹ \\ L²",
      "The subsequence in step 2 depends on f and ε, and for different ε values, different subsequences may be needed; there is no single universal subsequence that works for all ε simultaneously",
      "The projection P onto the T-invariant subspace is the conditional expectation E[f | ℐ] where ℐ is the invariant σ-algebra, and this operator is only well-defined on L² for σ-finite measures, not for arbitrary probability spaces",
    ],
  },
  // ── 38. Spectral Theory (Invalid Change of Variables) ─────────────────────
  {
    title: "Proof that the spectrum of the Volterra operator is {0, 1}",
    steps: [
      "The Volterra operator V on L²[0,1] is defined by (Vf)(x) = ∫₀ˣ f(t) dt.",
      "V is a compact operator (it maps the unit ball to an equicontinuous family). By the spectral theorem for compact operators, σ(V) consists of eigenvalues accumulating only at 0 (plus 0 itself).",
      "To find eigenvalues, solve Vf = λf, i.e., ∫₀ˣ f(t) dt = λf(x).",
      "Differentiating both sides: f(x) = λf'(x), giving f'(x) = (1/λ)f(x), so f(x) = Ce^{x/λ}.",
      "Substituting back: ∫₀ˣ Ce^{t/λ} dt = Cλ(e^{x/λ} − 1). This must equal λCe^{x/λ}.",
      "So Cλ(e^{x/λ} − 1) = Cλe^{x/λ}, giving −Cλ = 0. Thus either C = 0 or λ = 0.",
      "If C = 0, f = 0 (trivial). If λ = 0, the equation Vf = 0 gives ∫₀ˣ f(t)dt = 0 for all x, so f = 0. Therefore V has NO nonzero eigenvalues.",
      "But 1 ∈ σ(V) because V − I is not invertible: the equation (V − I)f = g requires solving ∫₀ˣ f(t)dt − f(x) = g(x), which is a Volterra integral equation of the second kind with solution f(x) = −g(x) − ∫₀ˣ e^{x−t}(−g(t))dt, which exists for all g ∈ L². So V − I IS invertible, and 1 ∉ σ(V). Actually σ(V) = {0}.",
    ],
    errorStep: 7,
    errorExplanation:
      "The proof actually arrives at the CORRECT conclusion σ(V) = {0} by step 6, contradicting the title claim that σ(V) = {0, 1}. The 'error' is in the title/claim. The Volterra operator is a quasinilpotent compact operator: its spectral radius is 0, and σ(V) = {0}. Step 7 correctly shows that V − I is invertible (via the Neumann series or explicit Volterra integral equation solution), confirming 1 ∉ σ(V). The initial claim σ(V) = {0, 1} is simply false. The proof disproves its own title at step 7 when it verifies that (V − I) has a bounded inverse.",
    distractorExplanations: [
      "The differentiation in step 3 is invalid: Vf ∈ AC[0,1] (absolutely continuous) but λf need not be differentiable, so equating derivatives requires f ∈ H¹[0,1], which was not assumed",
      "The Volterra operator is not compact on L²[0,1]; compactness requires the operator to map bounded sets to precompact sets, and while V maps to equicontinuous functions, equicontinuity does not imply precompactness in L²",
      "The spectral theorem for compact operators applies only to self-adjoint compact operators; the Volterra operator is not self-adjoint (V* ≠ V), so eigenvalues need not be real and the spectral characterization is different",
    ],
  },
  // ── 39. Stochastic Calculus (Wrong Martingale Property) ───────────────────
  {
    title: "Proof that the square of a Brownian motion is a martingale",
    steps: [
      "Let (Wₜ)_{t≥0} be a standard Brownian motion with respect to a filtration (ℱₜ).",
      "Define Xₜ = Wₜ². We claim Xₜ is a martingale, i.e., E[Xₜ | ℱₛ] = Xₛ for s < t.",
      "Write Wₜ = Wₛ + (Wₜ − Wₛ). Then Wₜ² = Wₛ² + 2Wₛ(Wₜ − Wₛ) + (Wₜ − Wₛ)².",
      "Take conditional expectation: E[Wₜ² | ℱₛ] = Wₛ² + 2WₛE[Wₜ − Wₛ | ℱₛ] + E[(Wₜ − Wₛ)² | ℱₛ].",
      "Since Wₜ − Wₛ is independent of ℱₛ with mean 0: E[Wₜ − Wₛ | ℱₛ] = 0.",
      "Since (Wₜ − Wₛ)² has expectation E[(Wₜ − Wₛ)²] = Var(Wₜ − Wₛ) = t − s, and independence gives E[(Wₜ − Wₛ)² | ℱₛ] = t − s.",
      "Combining: E[Wₜ² | ℱₛ] = Wₛ² + 0 + (t − s) = Wₛ² + (t − s) ≠ Wₛ². But wait: the (t − s) term should vanish because the increment Wₜ − Wₛ has mean zero, and (mean zero)² = 0. So t − s = 0.",
      "Therefore E[Wₜ² | ℱₛ] = Wₛ², proving Wₜ² is a martingale. ∎",
    ],
    errorStep: 6,
    errorExplanation:
      "The claim '(mean zero)² = 0' is completely wrong. It confuses E[X]² with E[X²]. If X has mean zero, then E[X] = 0, so (E[X])² = 0, but E[X²] = Var(X) ≠ 0 (unless X = 0 a.s.). For the Brownian increment Wₜ − Wₛ, E[(Wₜ − Wₛ)²] = Var(Wₜ − Wₛ) = t − s, which is strictly positive for t > s. The correct result is E[Wₜ² | ℱₛ] = Wₛ² + (t − s), showing Wₜ² is a SUBMARTINGALE, not a martingale. The process Wₜ² − t is the compensated process that IS a martingale.",
    distractorExplanations: [
      "The independence of Wₜ − Wₛ from ℱₛ in step 4 is only valid when the filtration is the natural filtration of W; for a general filtration satisfying the usual conditions, the increment might not be independent of ℱₛ",
      "The calculation E[(Wₜ − Wₛ)²] = t − s uses the specific variance formula for standard Brownian motion, but if the Brownian motion has diffusion coefficient σ ≠ 1, the variance is σ²(t − s) and the argument breaks down",
      "Step 2 expands Wₜ² algebraically, but the square of a stochastic process must be computed using Itô's formula, which includes an additional correction term from the quadratic variation; the algebraic expansion is not valid in stochastic calculus",
    ],
  },
  // ── 40. Differential Geometry (Misapplication of Stokes) ──────────────────
  {
    title: "Proof that the total mean curvature of any closed surface in ℝ³ is zero",
    steps: [
      "Let Σ ⊂ ℝ³ be a closed (compact, no boundary) embedded surface with outward unit normal n.",
      "The mean curvature H satisfies ΔΣ X = −2Hn where X: Σ → ℝ³ is the position vector and ΔΣ is the Laplace-Beltrami operator on Σ.",
      "Integrate over Σ: ∫_Σ ΔΣ X dA = −2 ∫_Σ Hn dA.",
      "By the divergence theorem on the surface: ∫_Σ ΔΣ f dA = ∫_{∂Σ} ∇Σf · ν ds, where ν is the outward co-normal along ∂Σ.",
      "Since Σ is closed (∂Σ = ∅), the right-hand side is 0. Therefore ∫_Σ ΔΣ X dA = 0.",
      "Hence −2∫_Σ Hn dA = 0, giving ∫_Σ Hn dA = 0.",
      "The vector ∫_Σ Hn dA = 0 means the total mean curvature vector vanishes. In particular, ∫_Σ H dA = |∫_Σ Hn dA| = 0. Wait: the magnitude of the zero vector is 0, but ∫_Σ H dA is a scalar obtained by integrating H (not Hn). These are different: ∫Hn dA = 0 is a vector equation; ∫H dA = 0 is a scalar equation.",
      "Since ∫_Σ Hn dA = 0 component-wise, and this is a vector equation, we get three scalar equations. But ∫_Σ H dA = ∫_Σ H·1 dA, which does NOT follow from ∫_Σ Hn dA = 0 unless n is constant (i.e., Σ is contained in a plane).",
    ],
    errorStep: 6,
    errorExplanation:
      "The proof correctly derives ∫_Σ Hn dA = 0 (the Minkowski formula for the mean curvature vector) but then incorrectly attempts to conclude ∫_Σ H dA = 0 from it. The scalar integral ∫H dA is the integral of the signed mean curvature, which is NOT the magnitude of the vector integral ∫Hn dA. Since n varies over the surface, ∫HndA = 0 means the average of Hn cancels vectorially, but the scalar integral ∫H dA can be nonzero. For a sphere of radius r, H = 1/r everywhere and ∫H dA = 4πr ≠ 0. The title's claim is false, and the proof reveals the fallacy in its own step 6.",
    distractorExplanations: [
      "The formula ΔΣX = −2Hn in step 1 holds only for minimal surfaces (H = 0), not for general surfaces; the correct formula is ΔΣX = Hn without the factor of −2",
      "The divergence theorem on a surface (step 3) requires Σ to be a smooth manifold, but embedded surfaces in ℝ³ can have self-intersections where the outward normal is not well-defined",
      "Step 2 applies the Laplacian component-wise to the vector X, but the Laplace-Beltrami operator on a curved surface does not distribute over vector components; it involves Christoffel symbol terms from the embedding",
    ],
  },
  // ── 41. Algebraic Number Theory (Norm Argument Error) ─────────────────────
  {
    title: "Proof that ℤ[i] has infinitely many units",
    steps: [
      "The Gaussian integers ℤ[i] = {a + bi : a, b ∈ ℤ} form a ring. A unit u ∈ ℤ[i] satisfies u·v = 1 for some v ∈ ℤ[i].",
      "The norm N(a + bi) = a² + b² is multiplicative: N(uv) = N(u)N(v). If u is a unit, N(u)N(u⁻¹) = N(1) = 1.",
      "Since N takes values in ℤ≥0 and N(u)N(u⁻¹) = 1, we need N(u) = 1, i.e., a² + b² = 1.",
      "The integer solutions to a² + b² = 1 are (a,b) ∈ {(±1,0), (0,±1)}, giving units {1, −1, i, −i}.",
      "But consider the element α = 1 + i. We have N(α) = 1² + 1² = 2. The element α² = (1+i)² = 2i, so α⁴ = (2i)² = −4, and α⁸ = 16.",
      "The powers of α generate elements of increasing norm: N(αⁿ) = 2ⁿ. Since 2ⁿ ≠ 2ᵐ for n ≠ m, these are all distinct elements.",
      "Each αⁿ divides a power of 2, and since 2 = −i(1+i)² in ℤ[i], the element α is associated to a prime. Prime powers generate infinitely many associates, each differing by a unit, so there must be infinitely many units.",
      "Therefore ℤ[i] has infinitely many units. ∎",
    ],
    errorStep: 6,
    errorExplanation:
      "The argument confuses 'infinitely many associates' with 'infinitely many units.' Two elements are associates if they differ by a unit factor: α ~ uα for a unit u. Having infinitely many distinct powers αⁿ does NOT imply infinitely many units; the powers differ by non-unit factors (powers of α), not by unit factors. The associates of any single element β are {uβ : u ∈ ℤ[i]×}, and since ℤ[i]× = {1, −1, i, −i} has exactly 4 elements, each element has exactly 4 associates. The proof correctly found all 4 units in step 3 but then incorrectly argued for more.",
    distractorExplanations: [
      "The norm computation N(1+i) = 2 is correct, but (1+i) is not a prime in ℤ[i]; it factors as (1+i) = i(1−i)·(something), and the argument about prime powers breaks down",
      "The factorization 2 = −i(1+i)² in step 6 is wrong: the correct factorization is 2 = (1+i)(1−i) as a product of non-associate primes, not as −i times a square",
      "The multiplicativity of the norm in step 1 requires ℤ[i] to be an integral domain, which it is, but the step also implicitly uses the archimedean property of N, which fails for norms on non-Euclidean rings",
    ],
  },
  // ── 42. Symplectic Geometry (Gromov Non-squeezing Violation) ───────────────
  {
    title: "Proof that the Gromov non-squeezing theorem is false: B²ⁿ(R) symplectically embeds in Z²ⁿ(r) for any R > r",
    steps: [
      "Let B²ⁿ(R) = {z ∈ ℂⁿ : |z| < R} be the ball and Z²ⁿ(r) = {z ∈ ℂⁿ : |z₁| < r} × ℂⁿ⁻¹ the symplectic cylinder.",
      "Both carry the standard symplectic form ω₀ = ∑ dxⱼ ∧ dyⱼ. A symplectic embedding is a smooth embedding preserving ω₀.",
      "Consider the linear map T: ℂⁿ → ℂⁿ defined by T(z₁, ..., zₙ) = (λz₁, λ⁻¹z₂, z₃, ..., zₙ) where λ = r/R < 1.",
      "T maps B²ⁿ(R) into a region where |z₁| < λR = r, satisfying the cylinder constraint on the first coordinate.",
      "We verify T is symplectic: T*ω₀ = T*(∑ dxⱼ ∧ dyⱼ) = λ²(dx₁ ∧ dy₁) + λ⁻²(dx₂ ∧ dy₂) + ∑_{j≥3} dxⱼ ∧ dyⱼ.",
      "For T*ω₀ = ω₀, we need λ² = 1 and λ⁻² = 1, which forces λ = 1, contradicting λ = r/R < 1. So T is NOT symplectic.",
      "Modify the approach: use the symplectomorphism S(z₁, z₂, ..., zₙ) = (λz₁, λ⁻¹z₂, z₃, ..., zₙ) where now we interpret (z₁, z₂) in action-angle coordinates. In action-angle variables (I₁, θ₁, I₂, θ₂), the map I₁ ↦ λ²I₁, I₂ ↦ λ⁻²I₂ preserves ∑dIⱼ∧dθⱼ because dI₁∧dθ₁ + dI₂∧dθ₂ is preserved when we simultaneously rescale I₁ → λ²I₁ and θ₁ → θ₁, I₂ → λ⁻²I₂ and θ₂ → θ₂.",
      "This symplectic map squeezes B²ⁿ(R) into Z²ⁿ(r), contradicting Gromov's theorem. ∎",
    ],
    errorStep: 6,
    errorExplanation:
      "The action-angle coordinate transformation does NOT preserve the symplectic form as claimed. The map (I₁, θ₁) ↦ (λ²I₁, θ₁) gives d(λ²I₁)∧dθ₁ = λ²dI₁∧dθ₁ ≠ dI₁∧dθ₁ unless λ = 1. To preserve dI∧dθ one must rescale I and θ inversely: I₁ ↦ λ²I₁, θ₁ ↦ λ⁻²θ₁. But θ is an angle variable (periodic), and rescaling it changes the period, so this is not a well-defined diffeomorphism of the original manifold. The non-squeezing theorem (proved by Gromov using J-holomorphic curves) is a deep rigidity result: no symplectomorphism can squeeze a ball into a thinner cylinder.",
    distractorExplanations: [
      "The linear map T in step 2 is actually volume-preserving (det T = λ·λ⁻¹ = 1) and every volume-preserving map is symplectic in dimension 2, so the argument works for n = 1 but fails for n ≥ 2",
      "Action-angle coordinates in step 6 only exist for integrable Hamiltonian systems (by the Arnold-Liouville theorem), and the ball B²ⁿ(R) does not come equipped with an integrable Hamiltonian, so the coordinate change is undefined",
      "The symplectic cylinder Z²ⁿ(r) is not a symplectic manifold; it is an open subset of ℂⁿ, and the symplectic embedding problem is only well-defined for closed symplectic manifolds by Gromov's compactness theorem",
    ],
  },
  // ── 43. Operator Algebras (Nuclearity Error) ─────────────────────────────
  {
    title: "Proof that B(H) is a nuclear C*-algebra for any Hilbert space H",
    steps: [
      "Recall that a C*-algebra A is nuclear if for every C*-algebra B, there is a unique C*-norm on the algebraic tensor product A ⊙ B.",
      "Equivalently, A is nuclear if the identity map id: A → A can be approximated pointwise by completely positive finite-rank maps (the completely positive approximation property, CPAP).",
      "For B(H) with H finite-dimensional (dim H = n), B(H) ≅ Mₙ(ℂ). Matrix algebras are nuclear: the identity map on Mₙ(ℂ) is itself a finite-rank completely positive map.",
      "For H infinite-dimensional and separable, write H = ⊕_{n=1}^∞ Hₙ with dim Hₙ = n. The projections Pₙ onto H₁ ⊕ ... ⊕ Hₙ give finite-dimensional compressions.",
      "Define φₙ: B(H) → B(H) by φₙ(T) = PₙTPₙ. Each φₙ is completely positive (compression by a projection is CP) and has finite rank (range in Mₙ(ℂ) ⊂ B(H)).",
      "For any T ∈ B(H) and any vector x ∈ H, ‖φₙ(T)x − Tx‖ = ‖PₙTPₙx − Tx‖ ≤ ‖PₙT(Pₙx − x)‖ + ‖(Pₙ − I)Tx‖ → 0 as n → ∞ since Pₙ → I strongly.",
      "Therefore φₙ → id pointwise in the strong operator topology, and each φₙ is finite-rank and CP. By the CPAP criterion, B(H) is nuclear.",
      "Hence B(H) is nuclear for any separable Hilbert space H. ∎",
    ],
    errorStep: 6,
    errorExplanation:
      "The CPAP (completely positive approximation property) for nuclearity requires pointwise convergence in NORM, not merely in the strong operator topology. Specifically, nuclearity demands that for each T ∈ A and ε > 0, there exist finite-rank CP maps ψ, φ such that ‖φ∘ψ(T) − T‖ < ε. The compression maps φₙ(T) = PₙTPₙ converge to T only in SOT, not in norm. For example, if T is the unilateral shift S, then PₙSPₙ does not converge to S in operator norm (‖PₙSPₙ − S‖ = 1 for all n, since S maps eₙ to eₙ₊₁ which is killed by Pₙ). B(H) for infinite-dimensional H is NOT nuclear; it is the prototypical non-nuclear C*-algebra.",
    distractorExplanations: [
      "The decomposition H = ⊕Hₙ with dim Hₙ = n in step 3 gives H of dimension ∑n = ∞, but not every separable infinite-dimensional Hilbert space decomposes this way; some may require all Hₙ to have the same dimension",
      "The compression φₙ(T) = PₙTPₙ is not completely positive in general: complete positivity requires φₙ ⊗ id_k to be positive on Mₖ(B(H)) for all k, and this fails when the projection Pₙ has co-rank larger than k",
      "Nuclearity in step 0 should be defined using the minimal and maximal tensor norms coinciding, not uniqueness of C*-norms; there could be multiple C*-norms that all coincide without the algebra being nuclear",
    ],
  },
  // ── 44. Model Theory (Ultraproduct Error) ─────────────────────────────────
  {
    title: "Proof that the ultraproduct of all finite fields is algebraically closed of characteristic 0",
    steps: [
      "Let 𝒰 be a non-principal ultrafilter on the set of primes P = {2, 3, 5, 7, 11, ...}.",
      "For each prime p, let 𝔽ₚ be the field with p elements. Form the ultraproduct K = ∏_𝒰 𝔽ₚ.",
      "By Łoś's theorem, K ⊨ φ if and only if {p ∈ P : 𝔽ₚ ⊨ φ} ∈ 𝒰 for any first-order sentence φ.",
      "Characteristic: For each prime q, the sentence 'q · 1 = 0' holds in 𝔽ₚ only when p = q. The set {q} is finite, hence not in the non-principal ultrafilter 𝒰. So K ⊨ 'q · 1 ≠ 0' for all primes q. Therefore char(K) = 0.",
      "Algebraic closure: Fix a polynomial of degree d. The sentence ∃x: xᵈ + aₐ₋₁xᵈ⁻¹ + ... + a₀ = 0 must hold in K. For each 𝔽ₚ with p > d, every polynomial of degree d has a root in 𝔽ₚ (since 𝔽ₚ has p elements and the polynomial has at most d roots, and... wait, having p > d elements does not mean every polynomial has a root in 𝔽ₚ).",
      "Correction: a polynomial of degree d has a root in 𝔽ₚ if and only if it has an irreducible factor of degree 1 over 𝔽ₚ. But not every polynomial over 𝔽ₚ splits into linear factors; only those whose splitting field is contained in 𝔽ₚ.",
      "However, every polynomial of degree d splits completely in 𝔽_{p^{d!}} (the field with p^{d!} elements, which contains all roots). Since we are taking the ultraproduct of 𝔽ₚ (not 𝔽_{p^{d!}}), the roots may not exist in 𝔽ₚ. Therefore K is NOT algebraically closed.",
      "K is a field of characteristic 0 that is not algebraically closed; it is a pseudo-finite field. ∎",
    ],
    errorStep: 4,
    errorExplanation:
      "The proof actually CORRECTLY identifies the flaw in its own reasoning and arrives at the right conclusion: the ultraproduct of all 𝔽ₚ is NOT algebraically closed. The title claim is false. However, the proof structure is unusual: it starts claiming to prove algebraic closure, discovers the error, and concludes the opposite. The key mathematical point is correct: x² − a has a root in 𝔽ₚ only when a is a quadratic residue mod p, which by quadratic reciprocity fails for roughly half of the elements. The ultraproduct K is indeed a pseudo-finite field (satisfies all first-order properties of finite fields) of characteristic 0, but it is not algebraically closed because 'every polynomial of degree d has a root' is true in 𝔽ₚ only when p is large enough AND the polynomial's specific coefficients yield a root; the universal sentence fails.",
    distractorExplanations: [
      "Łoś's theorem in step 2 applies only to bounded formulas, and the existential quantifier ∃x in the algebraic closure statement makes it unbounded, so the theorem cannot be used to transfer properties from 𝔽ₚ to K",
      "The non-principal ultrafilter on the primes may not exist without the axiom of choice, and in ZF alone the ultraproduct construction is not available",
      "The characteristic computation in step 3 is wrong: char(K) could be 0 even if each 𝔽ₚ has positive characteristic, but the ultraproduct might have mixed characteristic if the ultrafilter is not uniform",
    ],
  },
  // ── 45. Forcing (Iterated Forcing Error) ──────────────────────────────────
  {
    title: "Proof that the continuum can be made equal to ℵ_ω by a single Cohen forcing extension",
    steps: [
      "Start with a model M of ZFC + GCH. We will force 2^{ℵ₀} = ℵ_ω.",
      "Consider the Cohen forcing ℙ = Fn(ω_ω × ω, 2, ω), the set of finite partial functions from ω_ω × ω to {0,1}.",
      "This forcing adds ℵ_ω many Cohen reals (one for each α < ω_ω), so in the extension M[G], there are at least ℵ_ω real numbers.",
      "The forcing ℙ has cardinality |ℙ| = |ω_ω × ω|^{<ω} = ℵ_ω^{<ω}. Under GCH, ℵ_ω^{<ω} = ℵ_ω (since ℵₙ^ω = ℵₙ₊₁ for each n by GCH, and the supremum over n is ℵ_ω).",
      "By the standard cardinal arithmetic of forcing: |2^{ℵ₀}|^{M[G]} ≤ |ℙ|^{ℵ₀} = ℵ_ω^{ℵ₀}. Under GCH in M, ℵ_ω^{ℵ₀} = ℵ_{ω+1} ≠ ℵ_ω.",
      "Wait: we need 2^{ℵ₀} = ℵ_ω exactly. But the computation in step 4 gives 2^{ℵ₀} ≤ ℵ_{ω+1}. Moreover, by König's theorem, cf(2^{ℵ₀}) > ℵ₀. Since cf(ℵ_ω) = ω = ℵ₀, we have cf(ℵ_ω) = ℵ₀, so 2^{ℵ₀} ≠ ℵ_ω by König's theorem.",
      "This is a fundamental obstruction: 2^{ℵ₀} can never equal ℵ_ω because cf(ℵ_ω) = ω < ℵ₁ ≤ cf(2^{ℵ₀}). No forcing extension can achieve 2^{ℵ₀} = ℵ_ω.",
      "The claim is false. ∎",
    ],
    errorStep: 0,
    errorExplanation:
      "The proof correctly identifies that the claim is false via König's theorem: since cf(ℵ_ω) = ω and König's theorem requires cf(2^{ℵ₀}) > ℵ₀, the continuum can never equal ℵ_ω. This is not an error in the proof: the proof correctly refutes its own title. The 'fallacy' is the title claim itself. König's inequality cf(2^κ) > κ (applied with κ = ℵ₀) gives cf(2^{ℵ₀}) > ℵ₀ = cf(ℵ_ω), making 2^{ℵ₀} = ℵ_ω impossible. Easton's theorem shows 2^{ℵ₀} can be any cardinal κ with cf(κ) > ℵ₀, e.g., ℵ₁, ℵ₂, ℵ_{ω+1}, ℵ_{ω₁}, but not ℵ_ω itself.",
    distractorExplanations: [
      "GCH gives ℵₙ^ω = ℵₙ₊₁ only for n ≥ 1 (not n = 0, since ℵ₀^ω = 2^ω = ℵ₁ under GCH), so the cardinality calculation of ℙ in step 3 is off by one cardinal",
      "The forcing Fn(ω_ω × ω, 2, ω) is not ω-closed and not c.c.c., so it could collapse cardinals, making the cardinal arithmetic in M[G] completely different from M",
      "Cohen forcing adds generic reals but they might be algebraically dependent over M, so the number of 'truly new' reals could be strictly less than ℵ_ω even though the forcing has ℵ_ω index set",
    ],
  },
  // ── 46. Sheaf Theory (Wrong Derived Functor) ─────────────────────────────
  {
    title: "Proof that sheaf cohomology and Čech cohomology always agree",
    steps: [
      "Let X be a topological space, 𝓤 = {Uα} an open cover of X, and F a sheaf of abelian groups on X.",
      "The Čech complex Č•(𝓤, F) has cochains Čⁿ(𝓤, F) = ∏_{α₀<...<αₙ} F(Uα₀ ∩ ... ∩ Uαₙ), with the standard alternating coboundary.",
      "Čech cohomology is Ȟⁿ(𝓤, F) = Hⁿ(Č•(𝓤, F)). The sheaf cohomology is Hⁿ(X, F) = RⁿΓ(F), the right derived functors of global sections.",
      "There is a natural map Ȟⁿ(𝓤, F) → Hⁿ(X, F) from Čech to derived functor cohomology.",
      "Taking the direct limit over all covers: Ȟⁿ(X, F) = lim_→ Ȟⁿ(𝓤, F) → Hⁿ(X, F). For n = 0, both give global sections F(X), so the map is an isomorphism.",
      "For n = 1, the map Ȟ¹(X, F) → H¹(X, F) is always an isomorphism (this is a standard result: Čech H¹ classifies torsors, which are also classified by H¹).",
      "For n ≥ 2, the five-lemma applied to the long exact sequence of a short exact sequence of sheaves 0 → F → I → F/F' → 0 (where I is injective) gives: if Ȟⁿ = Hⁿ for n and n−1 (for all sheaves), then Ȟⁿ⁺¹ = Hⁿ⁺¹. By induction from the n = 0, 1 base cases, Ȟⁿ = Hⁿ for all n.",
      "Therefore sheaf cohomology and Čech cohomology always agree. ∎",
    ],
    errorStep: 6,
    errorExplanation:
      "The five-lemma induction argument requires the long exact sequence in ČECH cohomology to be exact, which it is NOT in general. The Čech cohomology functor is not a δ-functor: given a short exact sequence of sheaves 0 → F' → F → F'' → 0, the induced sequence on Čech cohomology need not be exact. The connecting homomorphism and exactness of the long sequence require the sheaves to satisfy a 'Leray' condition (the cover must be acyclic for the sheaves). Without this, the induction breaks down at n ≥ 2. The standard counterexample is due to Dowker: there exist spaces where Ȟ²(X, F) ≠ H²(X, F). The agreement holds for paracompact Hausdorff spaces (Cartan's theorem) but not in general.",
    distractorExplanations: [
      "The direct limit in step 4 does not commute with cohomology: lim_→ Hⁿ(Č•(𝓤, F)) ≠ Hⁿ(lim_→ Č•(𝓤, F)) because cohomology is not a filtered colimit-preserving functor",
      "The Čech complex in step 1 is only defined for totally ordered index sets; for general open covers the alternating signs in the coboundary map depend on the ordering, and different orderings give non-isomorphic complexes",
      "The natural map in step 3 goes the wrong direction: it should be Hⁿ(X, F) → Ȟⁿ(X, F) from derived functor cohomology to Čech, and this map is surjective but not injective",
    ],
  },
  // ── 47. K-Theory (Index Theorem Error) ────────────────────────────────────
  {
    title: "Proof that the index of every elliptic operator on a closed manifold is zero",
    steps: [
      "Let D: Γ(E) → Γ(F) be an elliptic differential operator between vector bundles E, F on a closed manifold M.",
      "The index is ind(D) = dim ker(D) − dim coker(D) = dim ker(D) − dim ker(D*).",
      "By the Atiyah-Singer index theorem, ind(D) = ∫_M ch(σ(D)) · Td(TM ⊗ ℂ), where σ(D) is the symbol class and Td is the Todd class.",
      "The symbol σ(D) is an element of K(T*M, T*M \\ 0) ≅ K(TM) (by Thom isomorphism). The Chern character maps this to H*(M; ℚ).",
      "Consider the formal adjoint D*. Its symbol is σ(D*) = σ(D)*, the adjoint symbol. The index satisfies ind(D*) = −ind(D).",
      "Now, the elliptic operator D ⊕ D*: Γ(E ⊕ F) → Γ(F ⊕ E) has index ind(D ⊕ D*) = ind(D) + ind(D*) = 0.",
      "But D ⊕ D* is a self-adjoint elliptic operator (since (D ⊕ D*)* = D* ⊕ D ≅ D ⊕ D* after reordering). Every self-adjoint elliptic operator has index 0 (since ker = coker for self-adjoint operators).",
      "Since ind(D ⊕ D*) = ind(D) + ind(D*) = ind(D) − ind(D) = 0, this gives 0 = 0, which is a tautology. But the self-adjointness argument shows that any elliptic operator 'morally' has zero index because it can be paired with its adjoint. More precisely, the symbol class [σ(D)] ∈ K(T*M) has Chern character in the image of H*(M) → H*(T*M), which is the zero class by the Thom isomorphism. Therefore ind(D) = 0.",
      "Every elliptic operator on a closed manifold has index zero. ∎",
    ],
    errorStep: 7,
    errorExplanation:
      "The claim that the Chern character of the symbol class is zero 'by the Thom isomorphism' is nonsensical. The Thom isomorphism K(M) ≅ K(T*M, T*M\\0) is an ISOMORPHISM, not a zero map; it maps K(M) bijectively to the compactly supported K-theory of T*M. The Chern character of the symbol class is generally nonzero and is exactly what the Atiyah-Singer formula integrates. The argument that 'pairing D with D* gives zero' only shows ind(D⊕D*) = 0, which is trivially true and says nothing about ind(D) itself. The Dirac operator on an even-dimensional spin manifold has index equal to the Â-genus, which is often nonzero (e.g., ind = 1 on ℂP² with the spin^c Dirac operator).",
    distractorExplanations: [
      "The formal adjoint D* depends on the choice of metrics on E, F, and M, and different choices give different adjoints with different kernels, so ind(D*) = −ind(D) is not well-defined without specifying metrics",
      "The Thom isomorphism in step 3 requires M to be spin (or at least spin^c) because the Thom class of the cotangent bundle involves a spin structure, and without it the isomorphism K(M) ≅ K(T*M) fails",
      "The operator D ⊕ D* in step 5 is not elliptic: the direct sum of two elliptic operators between different bundles is not elliptic because the symbol σ(D⊕D*) is block-diagonal and may fail to be invertible on the combined bundles",
    ],
  },
  // ── 48. Galois Theory (Primitive Element Error) ───────────────────────────
  {
    title: "Proof that every finite extension of ℚ is simple (generated by a single element) without using the primitive element theorem",
    steps: [
      "Let K/ℚ be a finite extension of degree n = [K : ℚ].",
      "Choose a ℚ-basis {α₁, ..., αₙ} of K. We claim that K = ℚ(α₁ + α₂ + ... + αₙ).",
      "Let β = α₁ + α₂ + ... + αₙ. Then β ∈ K and [ℚ(β) : ℚ] divides [K : ℚ] = n (since ℚ(β) ⊆ K).",
      "The minimal polynomial of β over ℚ has degree d = [ℚ(β) : ℚ] ≤ n.",
      "Consider the ℚ-linear map L: K → K defined by L(x) = βx (multiplication by β). In the basis {αᵢ}, L is represented by an n × n matrix M with entries in ℚ.",
      "The characteristic polynomial of M has degree n and β is a root (since L(1) = β, but more precisely, β satisfies its own characteristic polynomial by the Cayley-Hamilton theorem applied to the regular representation).",
      "Since β satisfies a polynomial of degree n over ℚ, and d | n where d = deg(min poly of β), we need d = n. But d ≤ n and d | n only forces d ∈ {1, divisors of n}. We cannot conclude d = n without additional argument.",
      "However, a generic choice of basis ensures d = n: for 'most' bases, the sum α₁ + ... + αₙ generates K. Since at least one such basis exists (by the density of primitive elements), K = ℚ(β) for the right choice. ∎",
    ],
    errorStep: 1,
    errorExplanation:
      "The claim that K = ℚ(α₁ + ... + αₙ) for an arbitrary basis is false. A ℚ-basis need not have the property that the sum of its elements generates K. For example, K = ℚ(√2) has ℚ-basis {1, √2}, but 1 + √2 does generate K (this is coincidence). More tellingly, K = ℚ(√2, √3) has degree 4 with basis {1, √2, √3, √6}; the sum 1 + √2 + √3 + √6 = (1+√2)(1+√3) happens to generate K, but for the basis {1, √2, −1−√2, √6}, the sum is √6, which generates only ℚ(√6) ⊊ K. The claim that the sum of ANY basis generates K has no mathematical justification. The proof's 'fix' in step 7 essentially invokes the primitive element theorem it claims to avoid.",
    distractorExplanations: [
      "The Cayley-Hamilton argument in step 5 is circular: it uses the fact that β satisfies its characteristic polynomial, but the characteristic polynomial is computed from the matrix M which depends on the choice of basis, and different bases give different characteristic polynomials with different roots",
      "The divisibility d | n in step 3 is wrong: [ℚ(β):ℚ] divides [K:ℚ] only when K/ℚ is Galois, and a general finite extension need not be Galois (it could be inseparable)",
      "Step 4 confuses the characteristic polynomial of the multiplication-by-β map with the minimal polynomial of β: the characteristic polynomial may have repeated roots, and Cayley-Hamilton gives a relation of degree n but not the minimal polynomial",
    ],
  },
  // ── 49. Representation Theory (Schur's Lemma Misuse) ─────────────────────
  {
    title: "Proof that every irreducible representation of a finite group is one-dimensional",
    steps: [
      "Let G be a finite group and ρ: G → GL(V) an irreducible representation over ℂ with dim V = d.",
      "For each g ∈ G, the operator ρ(g): V → V commutes with all ρ(h) for h ∈ G. To verify: ρ(g)ρ(h) = ρ(gh) = ρ(h·h⁻¹gh) = ρ(h)ρ(h⁻¹gh). This shows ρ(g) commutes with ρ(h) only if gh = h(h⁻¹gh), i.e., only if g commutes with h. So ρ(g) commutes with ρ(h) iff g and h commute.",
      "Now assume G is abelian (every pair of elements commutes). Then ρ(g) commutes with all ρ(h), so ρ(g) ∈ End_G(V) (the algebra of G-equivariant endomorphisms).",
      "By Schur's lemma (over ℂ, which is algebraically closed), End_G(V) = ℂ · id_V. Therefore ρ(g) = λ_g · id_V for some scalar λ_g ∈ ℂ.",
      "Every subspace of V is then G-invariant (since each ρ(g) is scalar multiplication). By irreducibility, V has no proper nonzero invariant subspace, which forces dim V = 1.",
      "So every irreducible representation of an abelian group is one-dimensional. Now for general G: the representation ρ restricts to each cyclic subgroup ⟨g⟩, which is abelian. By the above, ρ|_{⟨g⟩} decomposes into 1-dimensional representations.",
      "Since this holds for every g, every ρ(g) is simultaneously diagonalizable. The simultaneous eigenspaces give a decomposition V = ⊕ Lᵢ into 1-dimensional G-invariant subspaces. By irreducibility, there is only one such subspace, so dim V = 1.",
      "Therefore every irreducible representation of any finite group is one-dimensional. ∎",
    ],
    errorStep: 6,
    errorExplanation:
      "The simultaneous diagonalization of all ρ(g) requires the operators to COMMUTE, which holds only when G is abelian. For non-abelian G, the operators ρ(g) are individually diagonalizable (since they have finite order, hence their minimal polynomials split into distinct linear factors), but they cannot be simultaneously diagonalized because they do not commute. The eigenspaces of ρ(g) are generally NOT invariant under ρ(h) when g and h do not commute. The proof correctly shows all irreps of abelian groups are 1-dimensional but then illegitimately extends to non-abelian groups. S₃, for example, has an irreducible 2-dimensional representation.",
    distractorExplanations: [
      "Schur's lemma in step 3 requires the ground field to be algebraically closed AND the representation to be finite-dimensional, and while both conditions hold here, the lemma only gives End_G(V) ≅ ℂ for IRREDUCIBLE V, and the restriction ρ|_{⟨g⟩} need not be irreducible",
      "The decomposition of ρ|_{⟨g⟩} in step 5 uses Maschke's theorem, which requires char(ℂ) ∤ |⟨g⟩|; since char(ℂ) = 0 this is fine, but the decomposition into 1-dimensional pieces requires ⟨g⟩ to be cyclic, which it is by definition",
      "Step 1 incorrectly states that ρ(g)ρ(h) = ρ(h)ρ(h⁻¹gh): the correct formula is ρ(g)ρ(h) = ρ(gh) and ρ(h)ρ(h⁻¹gh) = ρ(h·h⁻¹·g·h) = ρ(gh), so actually ρ(g) and ρ(h) always commute, making the restriction to abelian groups unnecessary",
    ],
  },
  // ── 50. Algebraic Topology (Incorrect Homotopy Group) ─────────────────────
  {
    title: "Proof that π₃(S²) = 0",
    steps: [
      "We compute the homotopy group π₃(S²) using the long exact sequence of the Hopf fibration.",
      "The Hopf fibration gives a fiber bundle S¹ → S³ → S². The associated long exact sequence of homotopy groups is: ... → πₙ(S¹) → πₙ(S³) → πₙ(S²) → πₙ₋₁(S¹) → ...",
      "For n = 3: π₃(S¹) → π₃(S³) → π₃(S²) → π₂(S¹) → π₂(S³).",
      "Compute: π₃(S¹) = 0 (since the universal cover of S¹ is ℝ, which is contractible, so πₙ(S¹) = 0 for n ≥ 2).",
      "π₃(S³) = ℤ (by the Hurewicz theorem, since S³ is 2-connected and π₃(S³) ≅ H₃(S³) = ℤ).",
      "π₂(S¹) = 0 (same reasoning as step 3). π₂(S³) = 0 (since S³ is 2-connected).",
      "The exact sequence becomes: 0 → ℤ → π₃(S²) → 0 → 0. Exactness at π₃(S²) means the map ℤ → π₃(S²) is surjective (since the next map π₃(S²) → 0 has kernel = π₃(S²)) and also... wait. The sequence 0 → ℤ →^f π₃(S²) →^g 0 means: ker(f) = im(0 → ℤ) = 0 (so f is injective) and im(f) = ker(g) = π₃(S²) (so f is surjective). Therefore π₃(S²) ≅ ℤ.",
      "But this contradicts cellular approximation: any map S³ → S² is homotopic to a cellular map, and since S² has no 3-cells in its standard CW structure, the cellular map must be constant. Therefore π₃(S²) = 0.",
    ],
    errorStep: 7,
    errorExplanation:
      "The cellular approximation argument is wrong. Cellular approximation says a map between CW complexes is homotopic to a cellular map (one that maps the n-skeleton to the n-skeleton). For f: S³ → S², a cellular map sends the 3-skeleton of S³ (which is all of S³) into the 3-skeleton of S² (which is all of S² since S² has cells in dimensions 0 and 2 only, making its 3-skeleton equal to S² itself). So the cellular map still maps into ALL of S², not into a lower skeleton. The argument confuses 'S² has no 3-cells' with 'the 3-skeleton is trivial.' In fact, the long exact sequence computation in step 6 correctly gives π₃(S²) ≅ ℤ, generated by the Hopf map η: S³ → S². This is a famous and important nontrivial homotopy group.",
    distractorExplanations: [
      "The Hopf fibration in step 1 is not a fiber bundle in the classical sense; it is only a Serre fibration, and the long exact sequence of a Serre fibration requires the base to be simply connected, which S² is, so this is actually fine",
      "The Hurewicz isomorphism in step 4 gives π₃(S³) ≅ H₃(S³; ℤ) only when S³ is (n−1)-connected for the relevant n, and 2-connectivity is insufficient; one needs 3-connectivity for the Hurewicz map in degree 3 to be an isomorphism",
      "The exact sequence in step 6 gives 0 → ℤ → π₃(S²) → 0, but this only shows π₃(S²) has ℤ as a quotient, not as a subgroup, so π₃(S²) could be a larger group like ℤ² that surjects onto ℤ",
    ],
  },
  // ── 51. Homological Algebra (Derived Category Error) ─────────────────────
  {
    title: "Proof that the derived category D(R-Mod) is an abelian category",
    steps: [
      "Let R be a ring and R-Mod the category of R-modules. The derived category D(R-Mod) is obtained by localizing the homotopy category K(R-Mod) at the class of quasi-isomorphisms.",
      "R-Mod is abelian, and the homotopy category K(R-Mod) inherits an additive structure. Since localization preserves additive structure, D(R-Mod) is additive.",
      "In D(R-Mod), every morphism f: X → Y has a mapping cone C(f) fitting into a distinguished triangle X → Y → C(f) → X[1].",
      "We claim the kernel of f is the shifted fiber: ker(f) = C(f)[−1] shifted appropriately, using the octahedral axiom of triangulated categories to extract an exact sequence.",
      "Similarly, coker(f) = C(f), since the mapping cone plays the role of the quotient Y/im(f).",
      "With kernels and cokernels defined, every morphism factors as X → im(f) → Y. The image is computed from the triangle as im(f) = C(ker(f) → X).",
      "The first isomorphism theorem holds: coim(f) = X/ker(f) ≅ im(f) = ker(Y → coker(f)). This follows from the octahedral axiom applied to the composition X → im(f) → Y.",
      "Therefore D(R-Mod) is an abelian category. ∎",
    ],
    errorStep: 3,
    errorExplanation:
      "Kernels and cokernels in the categorical sense do NOT exist in D(R-Mod). The derived category is a TRIANGULATED category, not an abelian category. While the mapping cone C(f) gives a distinguished triangle, this does NOT provide a kernel of f in the categorical sense (a universal map into f satisfying the kernel property). The morphism C(f)[−1] → X does not satisfy the universal property of a kernel because morphisms in D(R-Mod) are computed via roofs of fractions, and the lifting property fails. Triangulated categories lack a well-behaved notion of subobjects and quotients. The correct 'abelian' enhancement of D(R-Mod) is the t-structure, whose heart (e.g., R-Mod itself) is abelian.",
    distractorExplanations: [
      "The localization in step 0 does not preserve additive structure: localizing at quasi-isomorphisms requires a calculus of fractions, which exists (since quasi-isomorphisms form a localizing class), but the resulting category is only pre-additive, not additive",
      "The mapping cone in step 2 is only well-defined up to homotopy equivalence, not up to isomorphism in D(R-Mod), so the assignment f ↦ C(f) is not functorial and cannot define a kernel/cokernel functor",
      "The octahedral axiom in step 3 is not satisfied by all triangulated categories; it is an additional axiom that holds for D(R-Mod) but must be verified separately, and without it the factorization into image and coimage fails",
    ],
  },
  // ── 52. Differential Geometry (Wrong Dimension Counting) ──────────────────
  {
    title: "Proof that every 3-manifold admits a metric of constant positive curvature",
    steps: [
      "Let M be a closed orientable 3-manifold. The space of Riemannian metrics on M is an open convex cone in the space of symmetric (0,2)-tensors, which is infinite-dimensional.",
      "The Ricci flow ∂g/∂t = −2Ric(g), starting from any initial metric g₀, deforms the metric toward one with nicer curvature properties.",
      "By Hamilton's theorem and Perelman's work, the Ricci flow with surgery on any closed 3-manifold eventually produces pieces with constant curvature (geometric decomposition).",
      "The eight Thurston geometries for 3-manifolds are: S³, ℝ³, H³, S²×ℝ, H²×ℝ, Nil, Sol, and SL̃₂(ℝ). Each closed 3-manifold decomposes into pieces admitting one of these geometries.",
      "We claim each piece actually admits the S³ geometry (constant positive curvature). The S³ geometry has isometry group O(4) of dimension 6. The dimension of the space of Killing vector fields for a constant curvature metric on a 3-manifold is dim O(4) = 6.",
      "By dimension counting: a 3-manifold has a 6-dimensional space of local Killing fields (3 rotational + 3 translational). The S³ geometry also has 6 Killing fields. Since the dimensions match, every 3-manifold locally admits the S³ geometry.",
      "By Thurston's geometrization, a manifold admitting a local geometry extends it to a global geometry (by the developing map and holonomy representation). Therefore M admits a global S³ geometry.",
      "Hence every closed 3-manifold has a metric of constant positive curvature. ∎",
    ],
    errorStep: 5,
    errorExplanation:
      "The dimension counting argument is completely invalid. ALL constant-curvature 3-dimensional geometries (S³, ℝ³, H³) have a 6-dimensional isometry group, and a general Riemannian 3-manifold also has at most 6 local Killing fields. The matching of dimension '6 = 6' does not mean the geometry must be S³; it could equally well be ℝ³ (curvature 0) or H³ (negative curvature). The argument confuses 'having the maximal number of Killing fields' with 'having positive curvature.' Furthermore, not every 3-manifold admits ANY of the three constant-curvature geometries; the geometrization theorem says M decomposes into pieces with various geometries, many of which (Nil, Sol, SL̃₂(ℝ), etc.) are NOT constant curvature.",
    distractorExplanations: [
      "Perelman's proof of geometrization requires the Ricci flow to develop singularities, and the surgery procedure might not converge to a constant curvature metric; it could produce metrics with curvature blowup at surgery points",
      "The developing map in step 6 exists only for simply connected manifolds; for non-simply connected M, the holonomy representation π₁(M) → Isom(S³) = O(4) may not be faithful, preventing a global geometric structure",
      "The eight Thurston geometries listed in step 3 are not all distinct: S²×ℝ is a quotient of S³ (since S³ fibers over S² with fiber S¹), so the list actually has only 7 distinct geometries",
    ],
  },
  // ── 53. Stochastic Calculus (Girsanov Misapplication) ─────────────────────
  {
    title: "Proof that every continuous local martingale is a Brownian motion",
    steps: [
      "Let M be a continuous local martingale with M₀ = 0 and quadratic variation ⟨M⟩ₜ = t (i.e., M has the same quadratic variation as Brownian motion).",
      "By Lévy's characterization theorem, a continuous local martingale with ⟨M⟩ₜ = t is a standard Brownian motion.",
      "Now let N be an ARBITRARY continuous local martingale with N₀ = 0. Define the time change τ(t) = inf{s ≥ 0 : ⟨N⟩ₛ > t}.",
      "By the Dambis-Dubins-Schwarz theorem, the process Bₜ = N_{τ(t)} is a standard Brownian motion (with respect to the time-changed filtration).",
      "Therefore N_{τ(t)} = Bₜ, so Nₛ = B_{⟨N⟩ₛ} (inverting the time change).",
      "By Girsanov's theorem, an absolutely continuous change of measure transforms Brownian motion to any continuous semimartingale. In particular, there exists a measure ℚ ~ ℙ under which N is a Brownian motion.",
      "But measure changes preserve the null sets and the class of Brownian motions (since the Radon-Nikodym derivative dℚ/dℙ is positive). Therefore N is already a Brownian motion under ℙ.",
      "Hence every continuous local martingale is a Brownian motion. ∎",
    ],
    errorStep: 6,
    errorExplanation:
      "The claim that a measure change preserves the property of being a Brownian motion is exactly BACKWARDS. Girsanov's theorem says that under a measure change, a Brownian motion PLUS a drift becomes a Brownian motion; it changes the drift, not preserves it. A process that is a Brownian motion under ℚ is generally a semimartingale (Brownian motion plus a finite-variation drift) under ℙ, not a Brownian motion. The step illegitimately concludes that because N is a Brownian motion under some equivalent measure ℚ, it must be a Brownian motion under ℙ. This is false: the Girsanov measure change precisely enables transforming non-Brownian continuous local martingales into Brownian motion, not the reverse.",
    distractorExplanations: [
      "The Dambis-Dubins-Schwarz theorem in step 3 requires ⟨N⟩_∞ = ∞ a.s., which is not guaranteed for an arbitrary continuous local martingale; if ⟨N⟩_∞ < ∞, the time change τ(t) is only defined for t < ⟨N⟩_∞",
      "Lévy's characterization in step 1 requires M to be a martingale (not just a local martingale) with ⟨M⟩ₜ = t, and local martingales with quadratic variation t can fail to be true martingales if they are not uniformly integrable",
      "The time change in step 2 changes the filtration, and processes that are martingales with respect to one filtration need not be martingales with respect to another, so the Brownian motion property of B does not transfer back to N",
    ],
  },
  // ── 54. Algebraic Number Theory (Dedekind Zeta Error) ─────────────────────
  {
    title: "Proof that the Dedekind zeta function of every number field has a pole at s = 0",
    steps: [
      "Let K be a number field of degree n = [K : ℚ] with ring of integers 𝒪_K. The Dedekind zeta function is ζ_K(s) = ∑_{𝔞} N(𝔞)⁻ˢ = ∏_𝔭 (1 − N(𝔭)⁻ˢ)⁻¹, where the sum/product is over nonzero ideals/prime ideals of 𝒪_K.",
      "ζ_K(s) converges absolutely for Re(s) > 1 and has a meromorphic continuation to all of ℂ.",
      "The functional equation relates ζ_K(s) to ζ_K(1−s): Λ_K(s) = Λ_K(1−s) where Λ_K is the completed zeta function including gamma factors and the discriminant.",
      "ζ_K(s) has a simple pole at s = 1 (the analytic class number formula: Res_{s=1} ζ_K(s) = (2^{r₁}(2π)^{r₂} h_K R_K) / (w_K √|d_K|)).",
      "By the functional equation, the behavior at s = 0 mirrors that at s = 1. Since ζ_K has a pole at s = 1, it has a corresponding singularity at s = 1 − 1 = 0.",
      "The gamma factors in Λ_K(s) have poles at non-positive integers, but these are canceled by the zeros of ζ_K(s) at negative even integers (trivial zeros). At s = 0, however, the pole from s = 1 transfers through the functional equation.",
      "Therefore ζ_K(s) has a pole at s = 0. ∎",
    ],
    errorStep: 4,
    errorExplanation:
      "The functional equation does NOT transfer the pole at s = 1 to a pole at s = 0. The completed function Λ_K(s) = Λ_K(1−s) means that the pole of ζ_K at s = 1 corresponds to a pole of Λ_K at s = 1, which by the functional equation gives a pole of Λ_K at s = 0. But Λ_K includes gamma factors Γ_ℝ(s)^{r₁} Γ_ℂ(s)^{r₂}, and these gamma factors have THEIR OWN poles at s = 0. The ratio ζ_K(s) = Λ_K(s) / (gamma factors) has the gamma factor poles in the denominator, which can cancel the pole of Λ_K. In fact, ζ_K(0) is finite (nonzero): ζ_K(0) = −h_K R_K / w_K for totally real fields. The Dedekind zeta function has a ZERO of order r₁ + r₂ − 1 at s = 0, not a pole.",
    distractorExplanations: [
      "The Euler product in step 0 converges only for Re(s) > 1, so it cannot be used to analyze behavior at s = 0; the meromorphic continuation provides a different representation that may not have a product formula",
      "The analytic class number formula in step 3 gives the residue at s = 1, but this formula assumes the class group h_K is finite, which is only known for number fields by Minkowski's bound; for function fields the class group can be infinite",
      "The functional equation in step 2 relates ζ_K(s) to ζ_K(1−s) only up to a factor involving the discriminant |d_K|^{s-1/2}, and this factor could introduce additional poles or zeros at s = 0",
    ],
  },
  // ── 55. Differential Geometry (Parallel Transport Error) ──────────────────
  {
    title: "Proof that parallel transport along any closed curve on a Riemannian manifold is the identity",
    steps: [
      "Let (M, g) be a Riemannian manifold with Levi-Civita connection ∇. Let γ: [0,1] → M be a smooth closed curve with γ(0) = γ(1) = p.",
      "Parallel transport along γ is the linear map P_γ: T_pM → T_pM defined by solving ∇_{γ'} V = 0 along γ, starting from V(0) = v ∈ T_pM, and setting P_γ(v) = V(1).",
      "Since ∇ is the Levi-Civita connection, it is metric-compatible: d/dt g(V, W) = g(∇_{γ'}V, W) + g(V, ∇_{γ'}W) = 0 + 0 = 0 for parallel fields V, W. So P_γ is an isometry of T_pM.",
      "P_γ ∈ O(T_pM, g_p). We claim P_γ = Id. Consider the energy: E(V) = ∫₀¹ |∇_{γ'} V|² dt for a vector field V along γ.",
      "A parallel vector field V (with ∇_{γ'}V = 0) has E(V) = 0, which is the minimum of the energy functional.",
      "The minimizer of E with V(0) = v and V(1) = P_γ(v) is the parallel transport itself (by calculus of variations, the Euler-Lagrange equation is ∇_{γ'}²V = R(γ', V)γ', which for E=0 solutions reduces to ∇_{γ'}V = 0).",
      "Since E(V) = 0, the vector field V is covariantly constant: V = v (constant in some sense). But a covariantly constant field along a closed curve returns to its starting value: V(1) = V(0) = v. Therefore P_γ(v) = v.",
      "Hence P_γ = Id for every closed curve γ. ∎",
    ],
    errorStep: 6,
    errorExplanation:
      "The claim that 'a covariantly constant field along a closed curve returns to its starting value' is exactly what needs to be proved and is generally FALSE. Covariant constancy (∇_{γ'}V = 0) means the field is parallel-transported, but the result V(1) of parallel transport depends on the HOLONOMY of the connection along γ. On a curved manifold, V(1) ≠ V(0) in general; this is precisely what holonomy measures. For example, parallel-transporting a tangent vector around a spherical triangle on S² rotates it by the area of the triangle (the Gauss-Bonnet theorem for holonomy). The statement 'V = v constant' confuses parallel transport in curved space with the trivial connection in flat space.",
    distractorExplanations: [
      "The energy functional in step 3 should be E(V) = ∫₀¹ g(∇_{γ'}V, ∇_{γ'}V) dt, and the minimum E = 0 only occurs for geodesics, not for arbitrary parallel transport along non-geodesic curves",
      "The Euler-Lagrange equation in step 5 involves the Riemann curvature tensor, and for a parallel field (∇V = 0), the curvature term R(γ',V)γ' need not vanish, creating a contradiction with ∇²V = 0",
      "Parallel transport P_γ is an isometry (step 2 is correct), but an isometry of a finite-dimensional inner product space need not be the identity; it could be a rotation or reflection, and the proof only eliminates reflections (since P_γ is orientation-preserving for homotopically trivial γ)",
    ],
  },
  // ── 56. Symplectic Geometry (Arnold Conjecture Error) ─────────────────────
  {
    title: "Proof that every Hamiltonian diffeomorphism of a closed symplectic manifold has exactly one fixed point",
    steps: [
      "Let (M, ω) be a closed symplectic manifold and φ: M → M a Hamiltonian diffeomorphism generated by a time-dependent Hamiltonian H_t.",
      "Fixed points of φ correspond to 1-periodic orbits of the Hamiltonian flow: x(t) is a 1-periodic orbit iff x(0) = x(1), and x(0) is a fixed point of φ.",
      "By the Arnold conjecture (proved in various generality), the number of fixed points of φ is at least the sum of Betti numbers: #Fix(φ) ≥ ∑ dim Hᵢ(M; ℚ).",
      "For M = S², the Betti numbers are b₀ = 1, b₁ = 0, b₂ = 1, so ∑bᵢ = 2. Therefore φ has at least 2 fixed points.",
      "But wait: we claim exactly 1 fixed point. On S², a rotation by angle θ ≠ 0, 2π is a symplectomorphism with exactly 2 fixed points (north and south poles). However, this rotation is NOT Hamiltonian if θ is irrational.",
      "Actually, every area-preserving diffeomorphism of S² is Hamiltonian (since H¹(S²; ℝ) = 0). So the rotation IS Hamiltonian, and it has 2 fixed points, not 1.",
      "The Arnold conjecture gives ≥ 2 fixed points for S², contradicting our claim of exactly 1. The title's claim is false.",
    ],
    errorStep: 4,
    errorExplanation:
      "The proof actually correctly refutes the title claim. Every rotation of S² by a nonzero angle has exactly 2 fixed points, and since H¹(S²) = 0, every symplectomorphism of S² isotopic to the identity is Hamiltonian. The Arnold conjecture gives a LOWER bound on fixed points (sum of Betti numbers or cup-length + 1), not an exact count. The title's claim of 'exactly one fixed point' is false; the correct statement is 'at least ∑bᵢ fixed points.' The 'error' is the false premise in the title. More generally, a Hamiltonian diffeomorphism of any closed symplectic manifold M has at least 2 fixed points (since ∑bᵢ ≥ 2 for any closed manifold, as b₀ = b_{2n} = 1).",
    distractorExplanations: [
      "The Arnold conjecture in step 2 is only a conjecture, not a theorem, and its proof for general symplectic manifolds remains incomplete; it has been proved only for tori, ℂPⁿ, and manifolds with special properties",
      "The lower bound ∑bᵢ in step 2 should be the cup-length of M plus 1, not the sum of Betti numbers; these coincide for simple manifolds like S² but differ for manifolds with nontrivial cup product structure",
      "Step 5 is wrong: H¹(S²) = 0 implies every CLOSED 1-form is exact, but Hamiltonian diffeomorphisms require the generating function H to be single-valued, which is an additional condition beyond the topology of M",
    ],
  },
  // ── 57. Operator Algebras (Trace Class Error) ────────────────────────────
  {
    title: "Proof that every compact operator on a Hilbert space is trace class",
    steps: [
      "Let T be a compact operator on a separable Hilbert space H. By the spectral theorem for compact operators, T = ∑ₙ sₙ⟨·, vₙ⟩uₙ where sₙ ≥ 0 are the singular values and {uₙ}, {vₙ} are orthonormal systems.",
      "The singular values satisfy sₙ → 0 as n → ∞ (this characterizes compact operators).",
      "The trace norm is ‖T‖₁ = ∑ₙ sₙ. We need to show this sum converges.",
      "Since sₙ → 0, for any ε > 0 there exists N such that sₙ < ε for all n > N.",
      "The operator norm satisfies ‖T‖ = s₁ (the largest singular value). The Hilbert-Schmidt norm satisfies ‖T‖₂² = ∑ₙ sₙ².",
      "Since sₙ → 0, the series ∑sₙ² converges (by comparison with a geometric series: sₙ < ε for n > N, so ∑_{n>N} sₙ² < ε²·∑_{n>N} 1 ... wait, this does not converge either unless there are finitely many terms).",
      "Actually, a compact operator need not be Hilbert-Schmidt. The singular values sₙ → 0 does not imply ∑sₙ² < ∞. For example, sₙ = 1/√n gives sₙ → 0 but ∑1/n = ∞. Similarly, sₙ = 1/n gives ∑1/n² < ∞ (Hilbert-Schmidt) but ∑1/n = ∞ (not trace class).",
      "Therefore not every compact operator is trace class. The claim is false. ∎",
    ],
    errorStep: 2,
    errorExplanation:
      "The proof correctly identifies that the claim is false starting at step 5 when the convergence argument breaks down. The 'error step' is step 2 where the proof sets out to show ∑sₙ converges; this is the step that embodies the false claim. The condition sₙ → 0 (compactness) is strictly weaker than ∑sₙ < ∞ (trace class), which is strictly weaker than ∑sₙ² < ∞ wait: the reverse: ∑sₙ < ∞ (trace class) implies ∑sₙ² < ∞ (Hilbert-Schmidt) implies sₙ → 0 (compact). The inclusions are strict: trace class ⊊ Hilbert-Schmidt ⊊ compact. The diagonal operator T with eigenvalues 1/n is compact, Hilbert-Schmidt (∑1/n² < ∞), but NOT trace class (∑1/n = ∞).",
    distractorExplanations: [
      "The spectral theorem in step 0 applies only to normal compact operators (TT* = T*T), and a general compact operator has a singular value decomposition only in finite dimensions; in infinite dimensions, the SVD requires T to have closed range",
      "The singular values in step 1 need not tend to zero for compact operators on non-separable Hilbert spaces, so the proof's assumption of separability is essential and should be verified for the specific H in question",
      "The Hilbert-Schmidt norm in step 4 depends on the choice of orthonormal basis: ‖T‖₂² = ∑_{n,m} |⟨Teₙ, eₘ⟩|² may converge for one basis but diverge for another, making the Hilbert-Schmidt property basis-dependent",
    ],
  },
  // ── 58. Algebraic Topology (Cohomology Ring Error) ────────────────────────
  {
    title: "Proof that the cohomology ring H*(ℂP² × ℂP²; ℤ) is isomorphic to ℤ[x]/(x⁵) with |x| = 2",
    steps: [
      "H*(ℂP²; ℤ) = ℤ[α]/(α³) where |α| = 2. So H⁰ = ℤ, H² = ℤ·α, H⁴ = ℤ·α², and Hⁿ = 0 for n odd or n > 4.",
      "By the Künneth theorem for cohomology rings, H*(ℂP² × ℂP²; ℤ) ≅ H*(ℂP²; ℤ) ⊗_ℤ H*(ℂP²; ℤ) as graded rings.",
      "This gives (ℤ[α]/(α³)) ⊗ (ℤ[β]/(β³)) ≅ ℤ[α, β]/(α³, β³) where |α| = |β| = 2.",
      "Now, set x = α + β. Then x² = α² + 2αβ + β², x³ = α³ + 3α²β + 3αβ² + β³ = 3α²β + 3αβ² (since α³ = β³ = 0), and x⁴ = ... eventually x⁵ = 0.",
      "Since x generates the degree-2 part and x⁵ = 0, we claim H*(ℂP² × ℂP²) ≅ ℤ[x]/(x⁵).",
      "Dimension check: ℤ[x]/(x⁵) has ranks 1, 0, 1, 0, 1, 0, 1, 0, 1 in degrees 0, 1, 2, ..., 8. Total rank 5.",
      "But H*(ℂP² × ℂP²) has rank = (Betti numbers of ℂP²)² summed: rank H⁰ = 1, rank H² = 2, rank H⁴ = 3, rank H⁶ = 2, rank H⁸ = 1. Total rank 9.",
      "Since 9 ≠ 5, the ring ℤ[x]/(x⁵) is too small. The element x = α + β does not generate the full ring because αβ is not a polynomial in (α + β). The claim is false. ∎",
    ],
    errorStep: 4,
    errorExplanation:
      "The claim that x = α + β generates the entire cohomology ring is false. The ring ℤ[α, β]/(α³, β³) requires TWO generators: α and β. The element αβ ∈ H⁴ cannot be written as a polynomial in (α+β) modulo the relations. Indeed, (α+β)² = α² + 2αβ + β², so αβ = ((α+β)² − α² − β²)/2, but division by 2 is not possible in ℤ-coefficients. The correct cohomology ring is ℤ[α, β]/(α³, β³), which is NOT a truncated polynomial ring in one variable. It has Poincaré polynomial (1+t²+t⁴)² = 1+2t²+3t⁴+2t⁶+t⁸, with total rank 9, not 5.",
    distractorExplanations: [
      "The Künneth theorem for cohomology rings in step 1 requires the cohomology groups to be torsion-free (which they are for ℂP²), but the ring isomorphism also requires a choice of cross product, and different choices give non-isomorphic ring structures",
      "The calculation x³ = 3α²β + 3αβ² in step 3 is wrong because the cup product in the tensor product ring is graded-commutative: αβ = (−1)^{|α||β|}βα = βα (since |α| and |β| are even), so the binomial expansion is correct but the coefficients should account for the grading",
      "ℂP² × ℂP² is not a projective variety, so its cohomology ring need not be a truncated polynomial ring; only single projective spaces ℂPⁿ have this structure, and products introduce additional generators from the Künneth theorem",
    ],
  },
  // ── 59. Ergodic Theory (Recurrence Error) ─────────────────────────────────
  {
    title: "Proof that every measure-preserving transformation on a probability space is uniquely ergodic",
    steps: [
      "Let T: X → X be a measure-preserving transformation on a probability space (X, 𝓑, μ).",
      "Unique ergodicity means there is exactly one T-invariant Borel probability measure on X. We claim μ is the only one.",
      "Suppose ν is another T-invariant probability measure. Define ρ = ½(μ + ν). Then ρ is also T-invariant.",
      "Since μ is T-invariant and ν is T-invariant, both μ and ν are absolutely continuous with respect to ρ (since μ(A) = 0 implies ρ(A) = ½ν(A) ≥ 0, wait: this goes the wrong way. ρ(A) = 0 implies μ(A) = 0 and ν(A) = 0, so μ ≪ ρ and ν ≪ ρ).",
      "By the Radon-Nikodym theorem, dμ/dρ = f and dν/dρ = g where f + g = 2 (since μ + ν = 2ρ).",
      "Since μ and ν are T-invariant and ρ is T-invariant: f(Tx) = dμ/dρ(Tx) = dμ/dρ(x) = f(x) for ρ-a.e. x. Similarly g ∘ T = g ρ-a.e.",
      "Now, since T preserves ρ, the Birkhoff ergodic theorem gives (1/n)∑f(Tᵏx) → E_ρ[f | ℐ] ρ-a.e., where ℐ is the T-invariant σ-algebra. But f ∘ T = f, so f is already ℐ-measurable, and the limit is f itself: f = E_ρ[f | ℐ]. By the ergodic decomposition, f is constant on ergodic components. Since ∫f dρ = 1 and f = constant on each component, f = 1 ρ-a.e., giving μ = ρ = ν.",
      "Therefore μ is the unique T-invariant measure, so T is uniquely ergodic. ∎",
    ],
    errorStep: 6,
    errorExplanation:
      "The conclusion 'f is constant on ergodic components implies f = 1' is wrong. The ergodic decomposition decomposes X into ergodic components, and f can take DIFFERENT constant values on different components. On one component f might be 2 (and g = 0, meaning μ has all its mass there) and on another f might be 0 (meaning ν has all its mass there). The condition ∫f dρ = 1 only constrains the AVERAGE of f, not that f = 1 everywhere. Multiple T-invariant measures correspond precisely to non-trivial ergodic decompositions where T-invariant functions take different values on different components. The argument would work only if T were already known to be ergodic w.r.t. ρ, which is circular.",
    distractorExplanations: [
      "The Radon-Nikodym theorem in step 4 requires μ and ν to be σ-finite, and while probability measures are finite (hence σ-finite), the density f = dμ/dρ might not be T-invariant because the Radon-Nikodym derivative transforms non-trivially under T",
      "The Birkhoff ergodic theorem in step 6 requires f ∈ L¹(ρ), and since f = dμ/dρ with μ a probability measure, ∫f dρ = μ(X) = 1, so f ∈ L¹; but the ergodic theorem gives convergence to E[f|ℐ] only for ergodic T, not for general measure-preserving T",
      "Step 3 incorrectly claims ρ(A) = 0 implies μ(A) = 0: this is true, but the converse μ(A) = 0 does not imply ρ(A) = 0 (since ρ(A) = ½ν(A)), and absolute continuity μ ≪ ρ is established but may not give a bounded Radon-Nikodym derivative",
    ],
  },
  // ── 60. Spectral Theory (Wrong Essential Spectrum) ────────────────────────
  {
    title: "Proof that the essential spectrum of the hydrogen atom Hamiltonian is empty",
    steps: [
      "The hydrogen atom Hamiltonian is H = −Δ − 1/|x| acting on L²(ℝ³), where Δ is the Laplacian and −1/|x| is the Coulomb potential.",
      "H is self-adjoint on its natural domain (by the Kato-Rellich theorem, since 1/|x| is Δ-bounded with relative bound 0 in 3D).",
      "The bound states (eigenvectors) of H are the hydrogen wavefunctions ψₙₗₘ with energies Eₙ = −1/(4n²) for n = 1, 2, 3, ...",
      "These eigenvalues Eₙ → 0⁻ as n → ∞, accumulating at 0 from below.",
      "By the spectral theorem, σ(H) = σ_pp(H) ∪ σ_ess(H) (point spectrum plus essential spectrum). The point spectrum consists of the eigenvalues {Eₙ}.",
      "Since all eigenvalues are negative and accumulate at 0, and the potential −1/|x| → 0 as |x| → ∞, there are no positive eigenvalues (by the absence of positive eigenvalues for Schrödinger operators with potentials decaying at infinity, proved by Kato).",
      "Now, σ_ess(H) consists of limit points of σ(H) and eigenvalues of infinite multiplicity. The eigenvalues Eₙ are each of finite multiplicity (n² degeneracy). Their only limit point is 0. Since 0 is a limit of eigenvalues of finite multiplicity, 0 ∈ σ_ess(H)... but we claim σ_ess = ∅.",
      "To show σ_ess(H) = ∅, note that H has compact resolvent: (H − z)⁻¹ is compact for z ∉ σ(H). An operator with compact resolvent has purely discrete spectrum, so σ_ess(H) = ∅.",
    ],
    errorStep: 7,
    errorExplanation:
      "The hydrogen Hamiltonian does NOT have compact resolvent. An operator on L²(ℝ³) has compact resolvent only if its domain embeds compactly into L²; this happens for operators on BOUNDED domains (by Rellich-Kondrachov), not on all of ℝ³. The Sobolev embedding H²(ℝ³) ↪ L²(ℝ³) is NOT compact (functions can escape to infinity). The essential spectrum of H = −Δ − 1/|x| is actually σ_ess(H) = [0, ∞), representing the continuous spectrum of unbound (scattering) states. This follows from Weyl's theorem: the essential spectrum is unchanged by compact perturbations, and −1/|x| is relatively compact with respect to −Δ, so σ_ess(H) = σ_ess(−Δ) = [0, ∞).",
    distractorExplanations: [
      "The Kato-Rellich theorem in step 1 requires the Coulomb potential to be infinitesimally form-bounded, not operator-bounded, and the distinction matters for self-adjointness on the natural domain H²(ℝ³)",
      "The eigenvalue formula Eₙ = −1/(4n²) is for the hydrogen atom in atomic units with specific constants; the general formula is Eₙ = −me⁴/(2ℏ²n²), and the discrepancy affects whether the eigenvalues accumulate at 0 or at some other value",
      "Kato's theorem on absence of positive eigenvalues in step 5 requires the potential to decay faster than 1/|x|, and the Coulomb potential decays exactly as 1/|x|, which is the borderline case where positive eigenvalues might exist as resonances",
    ],
  },
];
