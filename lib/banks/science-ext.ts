export interface ScienceFact {
  question: string;
  correctAnswer: string;
  distractors: [string, string, string];
}

// ─── Extended Science Facts (416 entries) ────────────────────────────────────

export const SCIENCE_FACTS_EXT: ScienceFact[] = [
  // ── Physics: Mechanics & Thermodynamics (1-30) ────────────────────────────
  {
    question: "What is the Carnot efficiency of a heat engine operating between 600 K and 300 K?",
    correctAnswer: "50%",
    distractors: ["33%", "67%", "25%"],
  },
  {
    question: "In Lagrangian mechanics, what quantity is defined as L = T − V?",
    correctAnswer: "The Lagrangian",
    distractors: ["The Hamiltonian", "The action", "The partition function"],
  },
  {
    question: "What is the SI unit of entropy?",
    correctAnswer: "J/K (joules per kelvin)",
    distractors: ["J·K (joule-kelvins)", "W/K (watts per kelvin)", "Pa/K (pascals per kelvin)"],
  },
  {
    question: "What does Noether's theorem relate continuous symmetries to?",
    correctAnswer: "Conservation laws",
    distractors: ["Gauge invariance", "Spontaneous symmetry breaking", "Renormalization group flows"],
  },
  {
    question: "What is the name of the dimensionless number that characterizes the ratio of inertial to viscous forces in fluid dynamics?",
    correctAnswer: "Reynolds number",
    distractors: ["Mach number", "Prandtl number", "Nusselt number"],
  },
  {
    question: "In the Navier-Stokes equations, what does the viscous term represent?",
    correctAnswer: "Diffusion of momentum due to viscosity",
    distractors: ["Pressure gradient forces", "Gravitational body forces", "Convective acceleration"],
  },
  {
    question: "What is the Boltzmann constant k_B in eV/K?",
    correctAnswer: "8.617 × 10⁻⁵ eV/K",
    distractors: ["1.381 × 10⁻²³ eV/K", "6.022 × 10⁻⁵ eV/K", "5.670 × 10⁻⁵ eV/K"],
  },
  {
    question: "Which thermodynamic potential is minimized at constant temperature and pressure?",
    correctAnswer: "Gibbs free energy",
    distractors: ["Helmholtz free energy", "Enthalpy", "Internal energy"],
  },
  {
    question: "What is the Kolmogorov microscale in turbulence theory?",
    correctAnswer: "The smallest scale at which viscosity dominates and kinetic energy is dissipated into heat",
    distractors: ["The largest energy-containing eddy scale", "The scale at which turbulence becomes isotropic", "The integral length scale of the flow"],
  },
  {
    question: "What does the Clausius inequality state for irreversible cyclic processes?",
    correctAnswer: "∮ δQ/T < 0",
    distractors: ["∮ δQ/T > 0", "∮ δQ/T = 0", "∮ δQ/T ≤ 1"],
  },
  {
    question: "In Hamilton's equations, what is dp/dt equal to?",
    correctAnswer: "−∂H/∂q",
    distractors: ["∂H/∂q", "∂H/∂p", "−∂H/∂p"],
  },
  {
    question: "What is the Rayleigh number used to predict?",
    correctAnswer: "The onset of natural convection in a fluid",
    distractors: ["The transition to turbulence in pipe flow", "The critical angle for total internal reflection", "The threshold for cavitation in liquids"],
  },
  {
    question: "What is the Poisson ratio for a perfectly incompressible isotropic material?",
    correctAnswer: "0.5",
    distractors: ["0.0", "0.33", "1.0"],
  },
  {
    question: "What quantity is conserved according to Liouville's theorem in classical mechanics?",
    correctAnswer: "Phase-space volume (density in phase space)",
    distractors: ["Total energy only", "Angular momentum only", "Linear momentum only"],
  },
  {
    question: "What is the Stefan-Boltzmann constant σ in SI units (W·m⁻²·K⁻⁴)?",
    correctAnswer: "5.670 × 10⁻⁸ W·m⁻²·K⁻⁴",
    distractors: ["1.381 × 10⁻²³ W·m⁻²·K⁻⁴", "6.674 × 10⁻¹¹ W·m⁻²·K⁻⁴", "3.846 × 10⁻⁸ W·m⁻²·K⁻⁴"],
  },
  {
    question: "In the Debye model, how does the heat capacity of a solid scale at very low temperatures?",
    correctAnswer: "Proportional to T³",
    distractors: ["Proportional to T", "Proportional to T²", "Constant (3Nk_B)"],
  },
  {
    question: "What is the name of the effect where a rotating body resists changes to its axis of rotation?",
    correctAnswer: "Gyroscopic precession",
    distractors: ["Coriolis effect", "Lense-Thirring effect", "Thomas precession"],
  },
  {
    question: "What does the Grüneisen parameter relate?",
    correctAnswer: "Thermal expansion to vibrational properties of a crystal lattice",
    distractors: ["Electrical conductivity to thermal conductivity", "Elastic moduli to crystal symmetry", "Phonon dispersion to band gap energy"],
  },
  {
    question: "What is the Mach number at which a flow is considered hypersonic?",
    correctAnswer: "Greater than Mach 5",
    distractors: ["Greater than Mach 1", "Greater than Mach 2", "Greater than Mach 3"],
  },
  {
    question: "In the equipartition theorem, how much energy does each quadratic degree of freedom contribute?",
    correctAnswer: "½ k_B T",
    distractors: ["k_B T", "¼ k_B T", "2 k_B T"],
  },
  {
    question: "What does the Prandtl number Pr represent in fluid mechanics?",
    correctAnswer: "The ratio of momentum diffusivity to thermal diffusivity",
    distractors: ["The ratio of inertial forces to viscous forces", "The ratio of buoyancy to viscous forces", "The ratio of convective to conductive heat transfer"],
  },
  {
    question: "What is the d'Alembert paradox?",
    correctAnswer: "An inviscid, incompressible fluid exerts zero drag on a body moving through it",
    distractors: ["A body in free fall experiences no gravitational force", "Two observers in relative motion disagree on simultaneity", "A particle cannot have both definite position and momentum"],
  },
  {
    question: "What is the critical exponent β for the order parameter in the 2D Ising model?",
    correctAnswer: "1/8",
    distractors: ["1/2", "1/4", "1/3"],
  },
  {
    question: "What is the Wiedemann-Franz law?",
    correctAnswer: "The ratio of thermal to electrical conductivity in metals is proportional to temperature",
    distractors: ["Resistance increases linearly with temperature for metals", "Thermal conductivity is independent of temperature in insulators", "The Seebeck coefficient is inversely proportional to carrier density"],
  },
  {
    question: "Which principle states that every point on a wavefront can be considered a source of secondary wavelets?",
    correctAnswer: "Huygens' principle",
    distractors: ["Fermat's principle", "Babinet's principle", "Maupertuis' principle"],
  },
  {
    question: "What is the Landau free energy expansion used for?",
    correctAnswer: "Describing continuous (second-order) phase transitions via an order parameter",
    distractors: ["Calculating the entropy of ideal gases", "Modeling first-order transitions in binary alloys", "Predicting critical currents in superconductors"],
  },
  {
    question: "What is the moment of inertia of a uniform solid sphere about an axis through its center?",
    correctAnswer: "(2/5)MR²",
    distractors: ["(1/2)MR²", "(2/3)MR²", "(3/5)MR²"],
  },
  {
    question: "In renormalization group theory, what is a fixed point?",
    correctAnswer: "A point in coupling-constant space that is invariant under RG transformations",
    distractors: ["A point where the partition function diverges", "A temperature at which all thermodynamic quantities are finite", "A momentum scale where perturbation theory breaks down"],
  },
  {
    question: "What is the adiabatic index (γ) for a monatomic ideal gas?",
    correctAnswer: "5/3",
    distractors: ["7/5", "4/3", "3/2"],
  },
  {
    question: "What is the Strouhal number used to characterize?",
    correctAnswer: "Oscillating flow mechanisms such as vortex shedding",
    distractors: ["Heat transfer in forced convection", "Shock wave formation", "Drag coefficient in laminar flow"],
  },
  // ── Quantum Mechanics & Particle Physics (31-70) ──────────────────────────
  {
    question: "What is the spin quantum number of the Higgs boson?",
    correctAnswer: "0 (scalar boson)",
    distractors: ["1 (vector boson)", "1/2 (fermion)", "2 (tensor boson)"],
  },
  {
    question: "In quantum mechanics, what is the commutator [x̂, p̂] equal to?",
    correctAnswer: "iℏ",
    distractors: ["−iℏ", "ℏ²", "0"],
  },
  {
    question: "What is the name of the quantum number that distinguishes quarks from leptons?",
    correctAnswer: "Baryon number",
    distractors: ["Lepton number", "Isospin", "Strangeness"],
  },
  {
    question: "How many flavors of quarks exist in the Standard Model?",
    correctAnswer: "6",
    distractors: ["4", "8", "3"],
  },
  {
    question: "What is the mass of the W boson in GeV/c²?",
    correctAnswer: "≈ 80.4 GeV/c²",
    distractors: ["≈ 91.2 GeV/c²", "≈ 125.1 GeV/c²", "≈ 70.3 GeV/c²"],
  },
  {
    question: "What symmetry does the CPT theorem guarantee is conserved in all Lorentz-invariant quantum field theories?",
    correctAnswer: "Combined charge conjugation, parity, and time reversal symmetry",
    distractors: ["Parity alone", "Charge conjugation alone", "CP symmetry alone"],
  },
  {
    question: "What is the ground state energy of the quantum harmonic oscillator?",
    correctAnswer: "½ℏω",
    distractors: ["ℏω", "0", "¼ℏω"],
  },
  {
    question: "What is the Lamb shift?",
    correctAnswer: "A small difference in energy between the 2S₁/₂ and 2P₁/₂ levels of hydrogen, caused by quantum electrodynamic effects",
    distractors: ["The splitting of spectral lines in a magnetic field", "The redshift of photons escaping a gravitational field", "The broadening of spectral lines due to the Doppler effect"],
  },
  {
    question: "What are the gauge bosons of the strong nuclear force?",
    correctAnswer: "Gluons (8 types)",
    distractors: ["W and Z bosons", "Photons", "Gravitons"],
  },
  {
    question: "What is the Pauli exclusion principle a consequence of?",
    correctAnswer: "The antisymmetry of fermionic wavefunctions under particle exchange",
    distractors: ["The Heisenberg uncertainty principle", "Conservation of energy", "Electromagnetic repulsion between electrons"],
  },
  {
    question: "What is the charge of a down quark in units of elementary charge e?",
    correctAnswer: "−1/3",
    distractors: ["+2/3", "−2/3", "+1/3"],
  },
  {
    question: "In quantum field theory, what is a virtual particle?",
    correctAnswer: "An internal line in a Feynman diagram that does not satisfy the on-shell energy-momentum relation",
    distractors: ["A particle that exists only in a vacuum state", "A particle moving faster than light", "A particle that has been observed but not yet classified"],
  },
  {
    question: "What does the Bell inequality test?",
    correctAnswer: "Whether quantum correlations can be explained by local hidden variable theories",
    distractors: ["Whether particles have definite spin before measurement", "Whether entanglement can transmit information faster than light", "Whether quantum mechanics is deterministic"],
  },
  {
    question: "What is the mass of the Z boson in GeV/c²?",
    correctAnswer: "≈ 91.2 GeV/c²",
    distractors: ["≈ 80.4 GeV/c²", "≈ 125.1 GeV/c²", "≈ 105.7 GeV/c²"],
  },
  {
    question: "What is the electron g-factor (Landé g-factor for spin)?",
    correctAnswer: "≈ 2.002319",
    distractors: ["Exactly 2.000000", "≈ 1.001160", "≈ 2.675222"],
  },
  {
    question: "What is the Aharonov-Bohm effect?",
    correctAnswer: "A charged particle is affected by electromagnetic potentials even in regions where both E and B fields are zero",
    distractors: ["Electrons tunnel through a classically forbidden barrier", "A magnetic field causes splitting of spectral lines", "An electric field accelerates charged particles in a vacuum"],
  },
  {
    question: "What is the color charge of quarks in QCD?",
    correctAnswer: "Red, green, or blue (and their anticolors)",
    distractors: ["Positive or negative", "Up or down", "Left or right"],
  },
  {
    question: "What is the Dirac equation used to describe?",
    correctAnswer: "Relativistic spin-1/2 fermions",
    distractors: ["Non-relativistic spinless particles", "Relativistic spin-0 bosons", "Classical electromagnetic waves"],
  },
  {
    question: "What is the Casimir effect?",
    correctAnswer: "An attractive force between two uncharged parallel conducting plates caused by quantum vacuum fluctuations",
    distractors: ["Repulsion between like charges in a dielectric medium", "The emission of photons from an accelerating mirror", "The creation of particle-antiparticle pairs near a black hole"],
  },
  {
    question: "What quantum number is associated with the total angular momentum of a particle?",
    correctAnswer: "J",
    distractors: ["L", "S", "M"],
  },
  {
    question: "What is the mass of the top quark in GeV/c²?",
    correctAnswer: "≈ 173 GeV/c²",
    distractors: ["≈ 4.2 GeV/c²", "≈ 91.2 GeV/c²", "≈ 125 GeV/c²"],
  },
  {
    question: "What is the Schwinger limit in quantum electrodynamics?",
    correctAnswer: "The critical electric field strength above which the vacuum becomes unstable to electron-positron pair production (≈1.3×10¹⁸ V/m)",
    distractors: ["The maximum magnetic field a neutron star can sustain", "The energy threshold for muon pair production", "The minimum photon energy for Compton scattering"],
  },
  {
    question: "In the Standard Model, which force is mediated by the W⁺, W⁻, and Z⁰ bosons?",
    correctAnswer: "The weak nuclear force",
    distractors: ["The strong nuclear force", "The electromagnetic force", "Gravity"],
  },
  {
    question: "What is the de Broglie wavelength of a particle with momentum p?",
    correctAnswer: "λ = h/p",
    distractors: ["λ = p/h", "λ = h·p", "λ = ℏ/p"],
  },
  {
    question: "What is asymptotic freedom in QCD?",
    correctAnswer: "The strong coupling constant decreases at higher energies (shorter distances), so quarks behave as free particles at very high energies",
    distractors: ["Quarks are confined and can never be isolated", "The strong force increases linearly with distance", "Gluons are massless at all energy scales"],
  },
  {
    question: "What is the anomalous magnetic moment of the muon significant for?",
    correctAnswer: "Testing the Standard Model — discrepancies may indicate new physics beyond the Standard Model",
    distractors: ["Measuring the muon's lifetime", "Determining the muon's charge radius", "Calculating the weak mixing angle"],
  },
  {
    question: "What is a Cooper pair?",
    correctAnswer: "A bound pair of electrons with opposite momenta and spins that forms the basis of BCS superconductivity",
    distractors: ["A pair of protons in a helium-4 nucleus", "Two photons entangled in polarization", "A quark-antiquark bound state"],
  },
  {
    question: "What is the Klein-Gordon equation used to describe?",
    correctAnswer: "Relativistic spin-0 (scalar) particles",
    distractors: ["Relativistic spin-1/2 particles", "Non-relativistic electrons in a potential", "Massless vector bosons"],
  },
  {
    question: "What is the Weinberg angle (weak mixing angle) θ_W approximately?",
    correctAnswer: "sin²θ_W ≈ 0.231",
    distractors: ["sin²θ_W ≈ 0.500", "sin²θ_W ≈ 0.118", "sin²θ_W ≈ 0.375"],
  },
  {
    question: "In quantum computing, what is a qubit?",
    correctAnswer: "A two-level quantum system that can exist in a superposition of |0⟩ and |1⟩",
    distractors: ["A classical bit stored in a quantum processor", "A unit of quantum entropy", "A quantum version of a byte (8 quantum states)"],
  },
  {
    question: "What is the WKB approximation used for in quantum mechanics?",
    correctAnswer: "Finding approximate solutions to the Schrödinger equation in the semiclassical limit",
    distractors: ["Solving the Dirac equation for free particles", "Computing exact energy eigenvalues for the hydrogen atom", "Deriving the path integral formulation"],
  },
  {
    question: "What is the running of the coupling constants in quantum field theory?",
    correctAnswer: "The dependence of coupling constants on the energy scale at which they are measured",
    distractors: ["The time evolution of coupling constants", "The variation of constants with temperature", "The change in constants due to gravitational effects"],
  },
  {
    question: "What particle was predicted by Yukawa to mediate the strong nuclear force between nucleons?",
    correctAnswer: "The pion (pi meson)",
    distractors: ["The gluon", "The W boson", "The kaon"],
  },
  {
    question: "What is the spin-statistics theorem?",
    correctAnswer: "Particles with integer spin are bosons (symmetric wavefunctions) and half-integer spin are fermions (antisymmetric wavefunctions)",
    distractors: ["All particles must have quantized angular momentum", "Spin and orbital angular momentum must be independently conserved", "The total spin of a composite system is always an integer"],
  },
  {
    question: "What is the GIM mechanism in particle physics?",
    correctAnswer: "It explains the suppression of flavor-changing neutral currents via the introduction of the charm quark",
    distractors: ["It explains CP violation in kaon decays", "It describes the generation of mass for gauge bosons", "It accounts for neutrino oscillations"],
  },
  {
    question: "What are Majorana fermions?",
    correctAnswer: "Fermions that are their own antiparticles",
    distractors: ["Fermions with zero mass", "Fermions that obey Bose-Einstein statistics", "Fermions with integer spin"],
  },
  {
    question: "What is the Cabibbo-Kobayashi-Maskawa (CKM) matrix?",
    correctAnswer: "A unitary matrix describing the mixing between quark mass eigenstates and weak interaction eigenstates",
    distractors: ["A matrix describing neutrino flavor oscillations", "A rotation matrix for spin states in a magnetic field", "A matrix of strong coupling constants between quarks and gluons"],
  },
  {
    question: "What is the branching ratio of the Higgs boson decay to two photons approximately?",
    correctAnswer: "≈ 0.23% (about 2.3 × 10⁻³)",
    distractors: ["≈ 58%", "≈ 6.3%", "≈ 21.5%"],
  },
  {
    question: "What is the Unruh effect?",
    correctAnswer: "An accelerating observer in vacuum perceives thermal radiation (a warm bath of particles) proportional to their acceleration",
    distractors: ["A stationary observer near a black hole sees Hawking radiation", "Photons blueshift when moving toward an observer", "Virtual particles become real when crossing an event horizon"],
  },
  {
    question: "What is the significance of the number 3 for color charges in QCD?",
    correctAnswer: "The gauge group SU(3) has three color charges, and baryons are color singlets made of three quarks",
    distractors: ["There are three generations of quarks", "Gluons come in three types", "The strong coupling constant has three fixed points"],
  },
  // ── Chemistry: General, Organic & Physical (71-120) ───────────────────────
  {
    question: "What is the VSEPR geometry of SF₆?",
    correctAnswer: "Octahedral",
    distractors: ["Trigonal bipyramidal", "Square planar", "Tetrahedral"],
  },
  {
    question: "What is the hybridization of the central carbon in allene (C₃H₄)?",
    correctAnswer: "sp (the central carbon is sp hybridized)",
    distractors: ["sp²", "sp³", "sp³d"],
  },
  {
    question: "What is the Woodward-Hoffmann rule based on?",
    correctAnswer: "Conservation of orbital symmetry in pericyclic reactions",
    distractors: ["Thermodynamic stability of products", "Kinetic isotope effects", "Steric strain in cyclic transition states"],
  },
  {
    question: "In organometallic chemistry, what is the 18-electron rule?",
    correctAnswer: "Thermodynamically stable transition metal complexes tend to have 18 valence electrons",
    distractors: ["All metal complexes must have 18 ligands", "The maximum coordination number for any metal is 18", "Metals in the 18th group are most reactive"],
  },
  {
    question: "What is the Hückel rule for aromaticity?",
    correctAnswer: "A planar, cyclic, fully conjugated molecule is aromatic if it has 4n+2 π electrons",
    distractors: ["A molecule is aromatic if it has 4n π electrons", "Any cyclic molecule with alternating single and double bonds is aromatic", "Aromaticity requires at least 6 carbon atoms"],
  },
  {
    question: "What catalyst is used in the Haber-Bosch process?",
    correctAnswer: "Iron (with potassium promoter)",
    distractors: ["Platinum", "Vanadium pentoxide", "Nickel"],
  },
  {
    question: "What is the Diels-Alder reaction?",
    correctAnswer: "A [4+2] cycloaddition between a conjugated diene and a dienophile",
    distractors: ["A [2+2] cycloaddition between two alkenes", "An electrocyclic ring opening", "A sigmatropic rearrangement"],
  },
  {
    question: "What does a negative Gibbs free energy change (ΔG < 0) indicate?",
    correctAnswer: "The reaction is thermodynamically spontaneous under the given conditions",
    distractors: ["The reaction is exothermic", "The reaction is fast", "The reaction has a low activation energy"],
  },
  {
    question: "What is the Arrhenius equation?",
    correctAnswer: "k = A·exp(−Ea/RT), relating rate constant to temperature and activation energy",
    distractors: ["k = k_B·T/h, relating rate constant to temperature", "ΔG = ΔH − TΔS, relating free energy to enthalpy and entropy", "PV = nRT, the ideal gas law"],
  },
  {
    question: "What is the Zaitsev rule in elimination reactions?",
    correctAnswer: "The more substituted alkene is the major product in E1 and E2 elimination reactions",
    distractors: ["The less substituted alkene is the major product", "Elimination always occurs anti-periplanar", "The more stable carbocation forms preferentially"],
  },
  {
    question: "What is the crystal field splitting parameter Δ_oct for an octahedral complex related to?",
    correctAnswer: "The energy difference between the t₂g and eg sets of d orbitals in an octahedral ligand field",
    distractors: ["The energy gap between bonding and antibonding molecular orbitals", "The difference between ionization energy and electron affinity", "The splitting between s and p orbitals"],
  },
  {
    question: "What is a zwitterion?",
    correctAnswer: "A molecule with both a positive and negative charge at different locations, giving a net zero charge",
    distractors: ["A molecule with no charge at any pH", "An anion with two negative charges", "A cation with delocalized positive charge"],
  },
  {
    question: "What is the Claisen rearrangement?",
    correctAnswer: "A [3,3]-sigmatropic rearrangement of allyl vinyl ethers to γ,δ-unsaturated carbonyl compounds",
    distractors: ["A [1,2]-hydride shift in carbocations", "A [2,3]-Wittig rearrangement", "A retro-Diels-Alder reaction"],
  },
  {
    question: "What is the Jahn-Teller effect?",
    correctAnswer: "A geometric distortion of non-linear molecular systems that reduces symmetry and energy when electronic degeneracy is present",
    distractors: ["The splitting of spectral lines in an external electric field", "The quenching of orbital angular momentum in transition metals", "The stabilization of high-spin states in strong-field ligands"],
  },
  {
    question: "What is the principle behind mass spectrometry?",
    correctAnswer: "Separation of ionized molecules based on their mass-to-charge ratio (m/z)",
    distractors: ["Separation based on molecular polarity", "Separation based on molecular size through a gel matrix", "Separation based on boiling point differences"],
  },
  {
    question: "What is the anomeric effect in carbohydrate chemistry?",
    correctAnswer: "The preference for electronegative substituents at the anomeric carbon to adopt the axial position in pyranose rings",
    distractors: ["The preference for equatorial substituents in all six-membered rings", "The interconversion of α and β anomers in solution", "The stabilization of boat conformations in glucose"],
  },
  {
    question: "What is the Wittig reaction used to synthesize?",
    correctAnswer: "Alkenes from aldehydes or ketones using phosphonium ylides",
    distractors: ["Alcohols from alkyl halides", "Amines from nitro compounds", "Esters from carboxylic acids"],
  },
  {
    question: "What is Le Chatelier's principle?",
    correctAnswer: "A system at equilibrium will shift to counteract any change imposed on it (concentration, pressure, or temperature)",
    distractors: ["Every reaction proceeds toward maximum entropy", "The rate of a reaction is proportional to the product of reactant concentrations", "Energy is neither created nor destroyed in a chemical reaction"],
  },
  {
    question: "What is the Marcus theory of electron transfer?",
    correctAnswer: "A theory relating the rate of electron transfer to the thermodynamic driving force and reorganization energy",
    distractors: ["A theory of electron tunneling through potential barriers", "A model for electron conduction in metals", "A description of electron capture in nuclear decay"],
  },
  {
    question: "What is the Grignard reaction?",
    correctAnswer: "The addition of an organomagnesium halide (RMgX) to a carbonyl group, forming a new C–C bond",
    distractors: ["The reduction of a ketone by NaBH₄", "The oxidation of a primary alcohol to an aldehyde", "The coupling of two aryl halides using palladium"],
  },
  {
    question: "What is the valence shell electron pair repulsion (VSEPR) geometry of XeF₄?",
    correctAnswer: "Square planar",
    distractors: ["Tetrahedral", "See-saw", "Octahedral"],
  },
  {
    question: "What is the Cahn-Ingold-Prelog priority system used for?",
    correctAnswer: "Assigning R/S configuration to stereocenters and E/Z designation to double bonds",
    distractors: ["Determining the oxidation state of atoms", "Naming branched alkanes", "Predicting the relative stability of conformers"],
  },
  {
    question: "What type of intermolecular force is responsible for the high boiling point of water?",
    correctAnswer: "Hydrogen bonding",
    distractors: ["London dispersion forces", "Dipole-dipole interactions only", "Ion-dipole interactions"],
  },
  {
    question: "What is the Birch reduction?",
    correctAnswer: "The partial reduction of aromatic rings to 1,4-cyclohexadienes using alkali metal in liquid ammonia",
    distractors: ["The full hydrogenation of benzene using Pd/C catalyst", "The conversion of ketones to alcohols with sodium borohydride", "The reduction of nitrobenzene to aniline with tin and HCl"],
  },
  {
    question: "What is the Henderson-Hasselbalch equation?",
    correctAnswer: "pH = pKa + log([A⁻]/[HA])",
    distractors: ["pH = −log[H⁺]", "Kw = [H⁺][OH⁻]", "ΔG = −RT ln K"],
  },
  {
    question: "What is the trans effect in coordination chemistry?",
    correctAnswer: "Certain ligands labilize the ligand trans to themselves, facilitating substitution at that position",
    distractors: ["Trans isomers are always more stable than cis isomers", "Ligands in trans positions have stronger bonds", "Trans complexes have lower crystal field splitting"],
  },
  {
    question: "What is the Nernst equation used for?",
    correctAnswer: "Calculating the electrode potential at non-standard conditions from the standard potential and reaction quotient",
    distractors: ["Determining the equilibrium constant from standard free energy", "Calculating the diffusion rate of ions in solution", "Measuring the conductivity of electrolyte solutions"],
  },
  {
    question: "What is a carbene?",
    correctAnswer: "A neutral divalent carbon species with two unshared electrons (e.g., :CH₂)",
    distractors: ["A positively charged trivalent carbon", "A negatively charged trivalent carbon", "A carbon atom with three unpaired electrons"],
  },
  {
    question: "What is the Suzuki coupling reaction?",
    correctAnswer: "A palladium-catalyzed cross-coupling of an organoboron compound with an organic halide to form a C–C bond",
    distractors: ["A nickel-catalyzed coupling of two Grignard reagents", "A copper-catalyzed coupling of an amine with an aryl halide", "An iron-catalyzed coupling of an alkyl halide with an alkene"],
  },
  {
    question: "What does a high octane number indicate about a fuel?",
    correctAnswer: "Greater resistance to engine knocking (pre-ignition)",
    distractors: ["Higher energy content per liter", "Lower boiling point", "Greater volatility"],
  },
  {
    question: "What is the Boltzmann distribution?",
    correctAnswer: "The probability distribution of particles over energy states at thermal equilibrium: P(E) ∝ exp(−E/k_BT)",
    distractors: ["The distribution of molecular speeds in an ideal gas", "The probability of radioactive decay over time", "The spatial distribution of electrons in an atom"],
  },
  // ── Biology: Molecular, Cell & Genetics (121-180) ─────────────────────────
  {
    question: "What enzyme unwinds the DNA double helix during replication?",
    correctAnswer: "Helicase",
    distractors: ["Topoisomerase", "Primase", "Ligase"],
  },
  {
    question: "What is the Shine-Dalgarno sequence?",
    correctAnswer: "A ribosomal binding site in prokaryotic mRNA located upstream of the start codon that helps recruit the ribosome",
    distractors: ["The poly-A tail signal in eukaryotic mRNA", "A consensus promoter element in eukaryotes", "A splice site recognition sequence"],
  },
  {
    question: "How many ATP equivalents are produced per glucose molecule in aerobic respiration?",
    correctAnswer: "30-32 ATP (revised estimate)",
    distractors: ["36-38 ATP", "24-26 ATP", "2 ATP"],
  },
  {
    question: "What is the wobble hypothesis?",
    correctAnswer: "Non-standard base pairing at the third codon position allows a single tRNA to recognize more than one codon",
    distractors: ["Codons can shift by one base during translation", "Ribosomes can read codons in both directions", "Amino acids can be inserted randomly at degenerate codons"],
  },
  {
    question: "What is the function of the proteasome?",
    correctAnswer: "Degrading ubiquitin-tagged proteins into peptides",
    distractors: ["Synthesizing proteins from mRNA templates", "Folding misfolded proteins", "Transporting proteins across membranes"],
  },
  {
    question: "What is a Hayflick limit?",
    correctAnswer: "The maximum number of times a normal somatic cell can divide before entering senescence (approximately 50-70 divisions)",
    distractors: ["The maximum size a cell can reach before dividing", "The minimum number of cells required for tissue viability", "The threshold mutation rate that triggers apoptosis"],
  },
  {
    question: "What is the central dogma of molecular biology?",
    correctAnswer: "Information flows from DNA to RNA to protein",
    distractors: ["DNA replicates semiconservatively", "Proteins are synthesized on ribosomes", "All living cells contain DNA"],
  },
  {
    question: "What is the role of telomerase?",
    correctAnswer: "Extending the telomere sequences at chromosome ends to prevent shortening during replication",
    distractors: ["Unwinding DNA at the replication fork", "Repairing double-strand DNA breaks", "Adding a 5' cap to mRNA"],
  },
  {
    question: "What is a prion?",
    correctAnswer: "A misfolded protein that can induce normal proteins to adopt the same misfolded conformation, causing disease",
    distractors: ["A small RNA virus that infects bacteria", "A subviral pathogen made of circular RNA", "A defective interfering particle derived from a virus"],
  },
  {
    question: "What is the function of RNA polymerase II in eukaryotes?",
    correctAnswer: "Transcribing protein-coding genes into mRNA precursors (pre-mRNA)",
    distractors: ["Transcribing ribosomal RNA genes", "Transcribing transfer RNA genes", "Synthesizing DNA primers during replication"],
  },
  {
    question: "What is CRISPR-Cas9?",
    correctAnswer: "A genome editing tool derived from a bacterial adaptive immune system that uses guide RNA to direct Cas9 nuclease to specific DNA sequences",
    distractors: ["A method for amplifying DNA sequences using polymerase chain reaction", "A technique for sequencing RNA molecules directly", "A protein purification method using affinity chromatography"],
  },
  {
    question: "What is the difference between a missense and a nonsense mutation?",
    correctAnswer: "A missense mutation changes one amino acid to another; a nonsense mutation creates a premature stop codon",
    distractors: ["A missense mutation is silent; a nonsense mutation changes an amino acid", "A missense adds a base; a nonsense deletes a base", "A missense occurs in introns; a nonsense occurs in exons"],
  },
  {
    question: "What is the role of the spliceosome?",
    correctAnswer: "Removing introns and joining exons during pre-mRNA processing in eukaryotes",
    distractors: ["Adding the poly-A tail to mRNA", "Degrading defective mRNA molecules", "Transporting mRNA from nucleus to cytoplasm"],
  },
  {
    question: "What is an operon?",
    correctAnswer: "A cluster of genes under control of a single promoter, typically found in prokaryotes, that are transcribed together as a polycistronic mRNA",
    distractors: ["A single gene with its own promoter and terminator", "A regulatory protein that binds to enhancers", "A set of genes on different chromosomes that encode related functions"],
  },
  {
    question: "What is the difference between mitosis and meiosis?",
    correctAnswer: "Mitosis produces two genetically identical diploid cells; meiosis produces four genetically distinct haploid cells",
    distractors: ["Mitosis occurs only in germ cells; meiosis occurs in somatic cells", "Mitosis involves two divisions; meiosis involves one", "Mitosis produces haploid cells; meiosis produces diploid cells"],
  },
  {
    question: "What is epigenetics?",
    correctAnswer: "Heritable changes in gene expression that do not involve alterations to the DNA sequence itself (e.g., DNA methylation, histone modification)",
    distractors: ["Mutations that occur above a certain frequency in a population", "The study of gene expression in different species", "Changes in chromosome number during cell division"],
  },
  {
    question: "What enzyme catalyzes the conversion of CO₂ and ribulose-1,5-bisphosphate to two molecules of 3-phosphoglycerate in the Calvin cycle?",
    correctAnswer: "RuBisCO (ribulose-1,5-bisphosphate carboxylase/oxygenase)",
    distractors: ["Phosphofructokinase", "ATP synthase", "Carbonic anhydrase"],
  },
  {
    question: "What is a chaperone protein?",
    correctAnswer: "A protein that assists other proteins in folding correctly without being part of the final structure",
    distractors: ["A protein that transports other proteins across membranes", "A structural protein in the extracellular matrix", "A protein that marks other proteins for degradation"],
  },
  {
    question: "What is the Hardy-Weinberg equilibrium?",
    correctAnswer: "A model predicting that allele and genotype frequencies remain constant in a population in the absence of evolutionary forces",
    distractors: ["A model predicting that populations always evolve toward greater fitness", "An equilibrium between mutation rate and selection pressure", "A balance between gene flow and genetic drift in small populations"],
  },
  {
    question: "What is the role of p53 in cells?",
    correctAnswer: "A tumor suppressor protein that responds to DNA damage by halting the cell cycle, activating repair, or triggering apoptosis",
    distractors: ["An oncogene that promotes cell division", "A structural protein of the nuclear envelope", "A kinase that phosphorylates cyclins"],
  },
  {
    question: "What is horizontal gene transfer?",
    correctAnswer: "The transfer of genetic material between organisms that is not through vertical transmission (parent to offspring)",
    distractors: ["Gene transfer between homologous chromosomes during meiosis", "The movement of transposons within a genome", "The transfer of mitochondrial DNA to the nucleus"],
  },
  {
    question: "What is the meselson-stahl experiment famous for demonstrating?",
    correctAnswer: "That DNA replication is semiconservative",
    distractors: ["That DNA is the genetic material", "That genes are located on chromosomes", "That RNA can act as a catalyst"],
  },
  {
    question: "What is an allosteric enzyme?",
    correctAnswer: "An enzyme whose activity is regulated by binding of an effector molecule at a site other than the active site",
    distractors: ["An enzyme that requires a metal cofactor", "An enzyme that only works at high temperatures", "An enzyme that catalyzes its own synthesis"],
  },
  {
    question: "What are Okazaki fragments?",
    correctAnswer: "Short DNA fragments synthesized on the lagging strand during DNA replication",
    distractors: ["Restriction enzyme cutting products", "Fragments of RNA used as primers", "Pieces of degraded mRNA"],
  },
  {
    question: "What is the endosymbiotic theory?",
    correctAnswer: "Mitochondria and chloroplasts originated as free-living prokaryotes that were engulfed by ancestral eukaryotic cells",
    distractors: ["All organelles arose from invaginations of the plasma membrane", "Eukaryotes evolved from archaea by genome duplication", "Viruses were the precursors to cellular life"],
  },
  {
    question: "What is RNA interference (RNAi)?",
    correctAnswer: "A biological process in which small RNA molecules (siRNA or miRNA) silence gene expression by targeting mRNA for degradation or translational repression",
    distractors: ["A process where RNA directly modifies DNA sequences", "The inhibition of transcription by ribosomal RNA", "A method of gene activation using synthetic RNA"],
  },
  {
    question: "What is the Krebs cycle (citric acid cycle) primary function?",
    correctAnswer: "Oxidizing acetyl-CoA to CO₂ while generating NADH, FADH₂, and GTP for energy production",
    distractors: ["Producing glucose from pyruvate", "Converting fatty acids to acetyl-CoA", "Synthesizing amino acids from ammonia"],
  },
  {
    question: "What is a signal peptide?",
    correctAnswer: "A short amino acid sequence at the N-terminus of a protein that directs it to the secretory pathway (endoplasmic reticulum)",
    distractors: ["A phosphorylation site that activates a kinase cascade", "A nuclear localization signal for transcription factors", "A glycosylation site on the cell surface"],
  },
  {
    question: "What is the function of restriction enzymes in bacteria?",
    correctAnswer: "Defending against bacteriophage infection by cleaving foreign DNA at specific recognition sequences",
    distractors: ["Repairing damaged chromosomal DNA", "Facilitating homologous recombination", "Regulating gene expression during sporulation"],
  },
  {
    question: "What is a polysome (polyribosome)?",
    correctAnswer: "Multiple ribosomes simultaneously translating a single mRNA molecule",
    distractors: ["A cluster of genes on a single chromosome", "A multi-subunit protease complex", "A group of tRNAs bound to a single amino acid"],
  },
  {
    question: "What is the role of the Golgi apparatus?",
    correctAnswer: "Modifying, sorting, and packaging proteins and lipids for secretion or delivery to other organelles",
    distractors: ["Synthesizing ribosomal RNA", "Generating ATP via oxidative phosphorylation", "Detoxifying harmful substances in the cell"],
  },
  {
    question: "What is genomic imprinting?",
    correctAnswer: "An epigenetic phenomenon where certain genes are expressed in a parent-of-origin-specific manner",
    distractors: ["The process of creating a genomic library from tissue samples", "Random inactivation of one X chromosome in females", "Preferential amplification of certain genes during PCR"],
  },
  {
    question: "What is the chemiosmotic hypothesis?",
    correctAnswer: "ATP synthesis is driven by a proton gradient across the inner mitochondrial membrane, established by the electron transport chain",
    distractors: ["ATP is synthesized by substrate-level phosphorylation only", "Protons are transported into the mitochondrial matrix to generate NADH", "ATP synthase uses sodium gradients rather than proton gradients"],
  },
  {
    question: "What is a knockout organism?",
    correctAnswer: "An organism in which a specific gene has been inactivated or deleted to study its function",
    distractors: ["An organism with an extra copy of a gene inserted", "An organism produced by selective breeding for desired traits", "An organism that has lost all its mitochondrial DNA"],
  },
  {
    question: "What is the lac operon a model system for?",
    correctAnswer: "Gene regulation in prokaryotes, specifically inducible gene expression in response to lactose",
    distractors: ["DNA repair mechanisms in E. coli", "Recombination during bacterial conjugation", "Regulation of the cell cycle in yeast"],
  },
  {
    question: "What is the function of topoisomerase during DNA replication?",
    correctAnswer: "Relieving torsional strain (supercoiling) ahead of the replication fork by cutting and rejoining DNA strands",
    distractors: ["Synthesizing RNA primers for Okazaki fragments", "Joining Okazaki fragments on the lagging strand", "Proofreading newly synthesized DNA"],
  },
  {
    question: "What is a retrovirus?",
    correctAnswer: "An RNA virus that uses reverse transcriptase to convert its RNA genome into DNA, which integrates into the host genome",
    distractors: ["A DNA virus that replicates in the cytoplasm", "A virus that only infects bacteria", "An RNA virus that replicates without any DNA intermediate"],
  },
  // ── Astronomy & Astrophysics (181-230) ────────────────────────────────────
  {
    question: "What is the Chandrasekhar limit?",
    correctAnswer: "The maximum mass of a stable white dwarf star, approximately 1.4 solar masses",
    distractors: ["The maximum mass of a neutron star (≈3 solar masses)", "The minimum mass required for hydrogen fusion (≈0.08 solar masses)", "The maximum luminosity a star can achieve (Eddington limit)"],
  },
  {
    question: "What is the Schwarzschild radius?",
    correctAnswer: "The radius of the event horizon of a non-rotating black hole: r_s = 2GM/c²",
    distractors: ["The radius at which a star becomes a red giant", "The orbital radius of the innermost stable circular orbit", "The radius at which tidal forces become infinite"],
  },
  {
    question: "What is the Hertzsprung-Russell diagram?",
    correctAnswer: "A scatter plot of stellar luminosity versus surface temperature (or spectral class) used to classify stars",
    distractors: ["A plot of galaxy redshift versus distance", "A diagram showing planetary orbital periods versus semi-major axes", "A chart of elemental abundances in the solar system"],
  },
  {
    question: "What causes a Type Ia supernova?",
    correctAnswer: "Thermonuclear explosion of a white dwarf that has accreted matter beyond the Chandrasekhar limit",
    distractors: ["Core collapse of a massive star exceeding 8 solar masses", "Collision between two neutron stars", "Magnetic reconnection in a magnetar"],
  },
  {
    question: "What is the cosmic microwave background (CMB)?",
    correctAnswer: "Thermal radiation from approximately 380,000 years after the Big Bang, when the universe became transparent to photons",
    distractors: ["Radio emission from the Milky Way's central black hole", "Infrared radiation from primordial dust clouds", "X-ray emission from galaxy clusters"],
  },
  {
    question: "What is the Hubble constant H₀ approximately (as of recent measurements)?",
    correctAnswer: "≈ 67-73 km/s/Mpc (with tension between different measurement methods)",
    distractors: ["≈ 100-110 km/s/Mpc", "≈ 30-40 km/s/Mpc", "≈ 150-200 km/s/Mpc"],
  },
  {
    question: "What is the Roche limit?",
    correctAnswer: "The minimum distance at which a celestial body held together only by gravity can orbit without being torn apart by tidal forces",
    distractors: ["The maximum orbital distance at which a moon remains gravitationally bound", "The distance at which solar radiation pressure equals gravitational attraction", "The boundary between a planet's magnetosphere and the solar wind"],
  },
  {
    question: "What is a magnetar?",
    correctAnswer: "A neutron star with an extremely powerful magnetic field (10⁹ to 10¹¹ tesla)",
    distractors: ["A white dwarf with strong magnetic fields", "A region of space with anomalously strong magnetic fields", "A type of quasar with polarized radio emission"],
  },
  {
    question: "What is the Tolman-Oppenheimer-Volkoff limit?",
    correctAnswer: "The maximum mass of a neutron star, above which it collapses into a black hole (approximately 2-3 solar masses)",
    distractors: ["The maximum mass of a white dwarf (Chandrasekhar limit)", "The minimum mass for hydrogen fusion in a protostar", "The maximum luminosity of an accreting compact object"],
  },
  {
    question: "What is the Jeans mass?",
    correctAnswer: "The critical mass above which a gas cloud will collapse under its own gravity rather than be supported by thermal pressure",
    distractors: ["The mass of the most common type of star in the galaxy", "The average mass of interstellar dust grains", "The mass equivalent of the cosmic microwave background energy"],
  },
  {
    question: "What is gravitational lensing?",
    correctAnswer: "The bending of light from a distant source by the gravitational field of an intervening massive object",
    distractors: ["The redshift of light leaving a strong gravitational field", "The focusing of gravitational waves by massive objects", "The deflection of charged particles by magnetic fields in space"],
  },
  {
    question: "What are Cepheid variables used for in astronomy?",
    correctAnswer: "Measuring cosmic distances, because their pulsation period is directly related to their luminosity (period-luminosity relation)",
    distractors: ["Determining the chemical composition of stars", "Measuring the age of globular clusters", "Detecting exoplanets via radial velocity"],
  },
  {
    question: "What is the Eddington luminosity?",
    correctAnswer: "The maximum luminosity a body can achieve where radiation pressure outward balances gravitational force inward",
    distractors: ["The luminosity of the Sun", "The minimum luminosity for a main-sequence star", "The peak luminosity of a Type Ia supernova"],
  },
  {
    question: "What is dark energy?",
    correctAnswer: "A hypothetical form of energy that permeates all of space and is driving the accelerating expansion of the universe",
    distractors: ["Energy released during dark matter annihilation", "Gravitational energy from unseen baryonic matter", "Radiation from black holes that escapes the event horizon"],
  },
  {
    question: "What is the Saha equation used for in astrophysics?",
    correctAnswer: "Relating the ionization state of a gas in thermal equilibrium to temperature, density, and ionization energies",
    distractors: ["Calculating the luminosity of a star from its mass", "Determining the orbital period of a binary star system", "Predicting the rate of nuclear fusion in stellar cores"],
  },
  {
    question: "What is a Kerr black hole?",
    correctAnswer: "A rotating black hole solution described by mass and angular momentum (no electric charge)",
    distractors: ["A non-rotating, uncharged black hole (Schwarzschild)", "A charged, non-rotating black hole (Reissner-Nordström)", "A black hole in anti-de Sitter space"],
  },
  {
    question: "What is the Olbers' paradox?",
    correctAnswer: "If the universe is infinite, eternal, and static, the night sky should be uniformly bright, which contradicts observation",
    distractors: ["The apparent faster-than-light recession of distant galaxies", "The missing mass problem in galaxy clusters", "The unexplained uniformity of the cosmic microwave background"],
  },
  {
    question: "What is the main sequence in stellar evolution?",
    correctAnswer: "The phase of a star's life during which it fuses hydrogen into helium in its core, represented as a band on the HR diagram",
    distractors: ["The sequence of nuclear fusion reactions from hydrogen to iron", "The order in which stars form in a molecular cloud", "The evolutionary track from red giant to white dwarf"],
  },
  {
    question: "What is the Friedmann equation?",
    correctAnswer: "An equation derived from general relativity that describes the expansion rate of the universe as a function of its matter, radiation, and dark energy content",
    distractors: ["An equation relating stellar luminosity to surface temperature", "An equation describing the orbits of planets around a star", "An equation for the gravitational redshift of photons"],
  },
  {
    question: "What is baryonic acoustic oscillation?",
    correctAnswer: "Periodic fluctuations in the density of visible baryonic matter caused by acoustic waves in the early universe plasma",
    distractors: ["The oscillation of baryons in neutron stars", "Sound waves propagating through interstellar gas clouds", "Vibrations in the cosmic neutrino background"],
  },
  {
    question: "What is the virial theorem's application in astrophysics?",
    correctAnswer: "Relating the average kinetic energy to the average potential energy of a gravitationally bound system (2K + U = 0 in equilibrium)",
    distractors: ["Predicting the luminosity function of galaxy clusters", "Calculating the escape velocity from a planet", "Determining the temperature of the solar corona"],
  },
  {
    question: "What produces gamma-ray bursts (GRBs)?",
    correctAnswer: "Long GRBs are associated with core-collapse supernovae of massive stars; short GRBs with mergers of compact objects (neutron stars)",
    distractors: ["Solar flares from nearby stars", "Accretion disk instabilities around supermassive black holes", "Annihilation of dark matter particles in galaxy halos"],
  },
  {
    question: "What is the significance of the 21-cm hydrogen line in radio astronomy?",
    correctAnswer: "It corresponds to the spin-flip transition of neutral hydrogen, used to map the distribution of hydrogen gas in the universe",
    distractors: ["It is the Lyman-alpha emission from ionized hydrogen", "It marks the peak wavelength of the cosmic microwave background", "It is a recombination line from helium in HII regions"],
  },
  {
    question: "What is the Bondi accretion rate?",
    correctAnswer: "The rate of spherically symmetric accretion of gas onto a compact object, determined by the object's mass and the sound speed and density of the surrounding medium",
    distractors: ["The rate at which a protoplanetary disk feeds a forming planet", "The maximum accretion rate set by radiation pressure (Eddington rate)", "The rate of mass loss from stellar winds"],
  },
  {
    question: "What is the Tully-Fisher relation?",
    correctAnswer: "An empirical relationship between the luminosity of a spiral galaxy and its rotational velocity, used as a distance indicator",
    distractors: ["A relation between galaxy mass and central black hole mass", "A correlation between redshift and apparent magnitude for quasars", "A relation between stellar age and metallicity"],
  },
  {
    question: "What is the Sunyaev-Zel'dovich effect?",
    correctAnswer: "The distortion of the cosmic microwave background spectrum by inverse Compton scattering off hot electrons in galaxy clusters",
    distractors: ["The gravitational redshift of photons near massive objects", "The absorption of CMB photons by neutral hydrogen", "The polarization of starlight by interstellar dust"],
  },
  {
    question: "What is nucleosynthesis in the Big Bang responsible for producing?",
    correctAnswer: "Primarily hydrogen, helium-4, and small amounts of deuterium, helium-3, and lithium-7",
    distractors: ["All elements up to iron", "Only hydrogen and helium in equal amounts", "Carbon, nitrogen, and oxygen"],
  },
  {
    question: "What is the Sagittarius A* (Sgr A*)?",
    correctAnswer: "The supermassive black hole at the center of the Milky Way, with a mass of about 4 million solar masses",
    distractors: ["A bright star cluster near the galactic center", "A pulsar with the fastest known rotation period", "A supernova remnant from a historical explosion"],
  },
  {
    question: "What are Fast Radio Bursts (FRBs)?",
    correctAnswer: "Transient radio pulses lasting milliseconds originating from cosmological distances, with debated origins likely involving magnetars",
    distractors: ["Periodic radio emissions from pulsars", "Radio signals from extraterrestrial intelligence", "Reflected solar radio bursts from the ionosphere"],
  },
  {
    question: "What is the Shakura-Sunyaev accretion disk model?",
    correctAnswer: "A standard thin accretion disk model where viscosity is parameterized by the α-prescription, relating viscous stress to pressure",
    distractors: ["A thick disk model for super-Eddington accretion", "A model for jets launched from rotating black holes", "A numerical simulation framework for magnetized accretion flows"],
  },
  {
    question: "What is the Birkhoff theorem in general relativity?",
    correctAnswer: "Any spherically symmetric vacuum solution to Einstein's field equations is static and given by the Schwarzschild metric",
    distractors: ["A rotating mass drags spacetime around it (frame dragging)", "Gravitational waves carry energy away from a binary system", "The cosmological constant acts as a repulsive force on large scales"],
  },
  // ── Geology & Earth Science (231-270) ─────────────────────────────────────
  {
    question: "What is the Mohorovičić discontinuity (Moho)?",
    correctAnswer: "The boundary between the Earth's crust and the mantle, defined by a sharp increase in seismic wave velocity",
    distractors: ["The boundary between the mantle and the outer core", "The boundary between the outer and inner core", "The boundary between the lithosphere and asthenosphere"],
  },
  {
    question: "What type of plate boundary is the San Andreas Fault?",
    correctAnswer: "Transform (strike-slip) boundary",
    distractors: ["Convergent boundary", "Divergent boundary", "Subduction zone"],
  },
  {
    question: "What is the Gutenberg discontinuity?",
    correctAnswer: "The boundary between the Earth's mantle and outer core at approximately 2,900 km depth",
    distractors: ["The boundary between the crust and mantle", "The boundary between the outer and inner core", "The transition zone in the upper mantle at 410-660 km"],
  },
  {
    question: "What is the principle of superposition in geology?",
    correctAnswer: "In undisturbed sedimentary sequences, older layers are at the bottom and younger layers are at the top",
    distractors: ["Rocks of the same type formed at the same time", "Fossils in different strata indicate relative age", "Igneous intrusions are younger than the rocks they cut through"],
  },
  {
    question: "What is isostasy?",
    correctAnswer: "The gravitational equilibrium between the lithosphere and asthenosphere, where the crust floats at a level determined by its density and thickness",
    distractors: ["The constant rate of seafloor spreading at mid-ocean ridges", "The balance between erosion and deposition in river systems", "The equilibrium between volcanic activity and plate subduction"],
  },
  {
    question: "What is the Wilson cycle?",
    correctAnswer: "The cyclical opening and closing of ocean basins caused by plate tectonics, from continental rifting to ocean formation to subduction and continental collision",
    distractors: ["The cycle of glacial and interglacial periods", "The periodic reversal of Earth's magnetic field", "The water cycle between oceans, atmosphere, and land"],
  },
  {
    question: "What is a greenstone belt?",
    correctAnswer: "An Archean geological formation consisting of metamorphosed volcanic and sedimentary rocks, often associated with gold deposits",
    distractors: ["A belt of green-colored sandstone formed in desert environments", "A zone of chlorite-rich metamorphic rocks around an intrusion", "A region of active serpentinization on the ocean floor"],
  },
  {
    question: "What is the Bowen reaction series?",
    correctAnswer: "The sequence in which minerals crystallize from cooling magma, with two branches: discontinuous (ferromagnesian) and continuous (plagioclase feldspar)",
    distractors: ["The order of mineral dissolution during chemical weathering", "The sequence of metamorphic grade changes with increasing pressure", "The order of element mobility during hydrothermal alteration"],
  },
  {
    question: "What are ophiolites?",
    correctAnswer: "Sections of oceanic crust and upper mantle that have been uplifted and exposed on land, typically at convergent boundaries",
    distractors: ["Fossilized coral reefs found at high altitudes", "Volcanic glass fragments in deep sea sediments", "Continental crustal blocks embedded in oceanic plates"],
  },
  {
    question: "What is the geothermal gradient?",
    correctAnswer: "The rate of temperature increase with depth in the Earth, approximately 25-30°C per km in the crust",
    distractors: ["The rate of pressure increase with depth", "The variation of gravity with latitude", "The change in magnetic field strength with depth"],
  },
  {
    question: "What is the Curie temperature in the context of paleomagnetism?",
    correctAnswer: "The temperature above which a ferromagnetic mineral loses its permanent magnetization",
    distractors: ["The temperature at which rocks begin to melt", "The temperature of the Earth's core-mantle boundary", "The critical temperature for diamond stability"],
  },
  {
    question: "What type of metamorphism occurs at convergent plate boundaries due to high pressure but relatively low temperature?",
    correctAnswer: "Blueschist (high-pressure, low-temperature) metamorphism",
    distractors: ["Contact metamorphism", "Greenschist metamorphism", "Granulite facies metamorphism"],
  },
  {
    question: "What is a banded iron formation (BIF)?",
    correctAnswer: "Precambrian sedimentary rocks with alternating layers of iron oxides and silica, indicating early Earth conditions before atmospheric oxygen",
    distractors: ["Iron ore deposits formed by hydrothermal vents", "Meteorite impact layers rich in iron", "Iron-bearing sandstones deposited in desert environments"],
  },
  {
    question: "What is the Milankovitch cycle?",
    correctAnswer: "Periodic variations in Earth's orbital eccentricity, axial tilt, and precession that influence long-term climate patterns and glacial cycles",
    distractors: ["The 11-year sunspot cycle's effect on climate", "Tidal cycles caused by the Moon's orbital variations", "Periodic volcanic eruptions that affect global temperatures"],
  },
  {
    question: "What is the difference between P-waves and S-waves?",
    correctAnswer: "P-waves are compressional (longitudinal) waves that travel through solids and liquids; S-waves are shear (transverse) waves that travel only through solids",
    distractors: ["P-waves travel only through solids; S-waves travel through both solids and liquids", "P-waves are slower than S-waves", "P-waves are transverse; S-waves are longitudinal"],
  },
  {
    question: "What is the Lehmann discontinuity?",
    correctAnswer: "The boundary between the Earth's liquid outer core and solid inner core at approximately 5,150 km depth",
    distractors: ["The boundary between the crust and mantle", "The boundary between the upper and lower mantle", "The boundary between the lithosphere and asthenosphere"],
  },
  {
    question: "What is an unconformity in geology?",
    correctAnswer: "A surface between rock layers representing a gap in the geological record where erosion or non-deposition occurred",
    distractors: ["A fault surface where rocks have been displaced", "A layer of volcanic ash between sedimentary strata", "A zone where metamorphism has altered the original rock"],
  },
  {
    question: "What is the asthenosphere?",
    correctAnswer: "The partially molten, ductile layer of the upper mantle below the lithosphere that allows tectonic plates to move",
    distractors: ["The outermost rigid shell of Earth including crust and upper mantle", "The liquid iron-nickel outer core", "The transition zone between upper and lower mantle"],
  },
  {
    question: "What causes the Earth's magnetic field?",
    correctAnswer: "Convective motion of liquid iron in the outer core (the geodynamo)",
    distractors: ["Permanent magnetization of the inner core", "Rotation of the solid mantle", "Solar wind interaction with the ionosphere"],
  },
  {
    question: "What is a Large Igneous Province (LIP)?",
    correctAnswer: "An extremely large accumulation of igneous rock formed by massive volcanic eruptions over geologically short periods, often associated with mass extinctions",
    distractors: ["A region of active volcanism at a subduction zone", "A large granite batholith formed by slow plutonic processes", "A continental rift zone with scattered volcanic centers"],
  },
  {
    question: "What is a kimberlite pipe?",
    correctAnswer: "A vertical volcanic conduit formed by deep-origin eruptions that bring diamonds and mantle xenoliths to the surface",
    distractors: ["A horizontal lava tube formed by basaltic flows", "A hydrothermal vent on the ocean floor", "A natural gas seep through fractured sedimentary rock"],
  },
  {
    question: "What is the zircon U-Pb dating method used for?",
    correctAnswer: "Determining the crystallization age of igneous and metamorphic rocks with high precision using uranium-lead decay in zircon crystals",
    distractors: ["Dating organic materials up to 50,000 years old", "Measuring the age of ocean floor basalts using potassium-argon", "Determining the cooling age of meteorites"],
  },
  {
    question: "What is a graben in structural geology?",
    correctAnswer: "A downdropped block of rock between two parallel normal faults, formed by extensional tectonics",
    distractors: ["An uplifted block of rock between two reverse faults", "A fold with a downward-pointing arch (syncline)", "A thrust sheet pushed over adjacent rocks"],
  },
  {
    question: "What is the D'' (D double-prime) layer?",
    correctAnswer: "A heterogeneous region at the base of the mantle just above the core-mantle boundary, with anomalous seismic properties",
    distractors: ["The top of the inner core with transitional properties", "The low-velocity zone in the upper mantle", "The boundary between the upper and lower mantle at 660 km"],
  },
  {
    question: "What are Heinrich events?",
    correctAnswer: "Episodes during the last glacial period when massive armadas of icebergs were discharged into the North Atlantic, leaving layers of ice-rafted debris",
    distractors: ["Rapid warming events at the end of ice ages", "Volcanic eruptions that triggered abrupt cooling", "Sudden changes in ocean circulation patterns"],
  },
  {
    question: "What is a terrane in geology?",
    correctAnswer: "A fault-bounded crustal block with a distinct geological history that has been accreted to a continental margin by plate tectonics",
    distractors: ["A flat-topped underwater mountain (guyot)", "A region of uniform geological composition", "A sediment-filled basin between two mountain ranges"],
  },
  {
    question: "What is the solidus?",
    correctAnswer: "The temperature below which a material is completely solid; above the solidus, partial melting begins",
    distractors: ["The temperature above which a material is completely liquid", "The pressure at which phase transitions occur", "The equilibrium line between two solid mineral phases"],
  },
  {
    question: "What causes the low-velocity zone (LVZ) in the upper mantle?",
    correctAnswer: "Partial melting of mantle rocks due to temperatures near the solidus, reducing seismic wave speeds",
    distractors: ["A change in mineral composition from olivine to perovskite", "Increased water content absorbing seismic energy", "A thermal boundary layer at the base of the lithosphere"],
  },
  {
    question: "What is a pillow lava?",
    correctAnswer: "Basaltic lava that erupts underwater, forming characteristic rounded, pillow-shaped structures as the outer surface quenches rapidly",
    distractors: ["Lava that flows in smooth, ropy sheets on land", "Explosive volcanic fragments deposited in layers", "Columnar-jointed basalt formed during slow cooling"],
  },
  {
    question: "What is the Snowball Earth hypothesis?",
    correctAnswer: "The hypothesis that Earth's surface was nearly or entirely frozen during one or more Neoproterozoic glaciations (around 700-600 Ma)",
    distractors: ["The idea that early Earth had no atmosphere and was perpetually frozen", "A model for ice ages caused by asteroid impacts", "The theory that polar ice caps have existed continuously for 4 billion years"],
  },
  // ── Materials Science & Engineering (271-310) ─────────────────────────────
  {
    question: "What is the Hall-Petch relationship?",
    correctAnswer: "The yield strength of a polycrystalline material increases as the grain size decreases (σ_y = σ₀ + k·d^(−1/2))",
    distractors: ["Hardness increases linearly with temperature", "Elastic modulus is independent of grain size", "Ductility increases with decreasing grain size"],
  },
  {
    question: "What is a Burgers vector?",
    correctAnswer: "A vector that characterizes the magnitude and direction of the lattice distortion caused by a dislocation",
    distractors: ["The displacement vector in a phase transformation", "The direction of maximum stress in a crystal", "The velocity vector of atomic diffusion"],
  },
  {
    question: "What is the Peierls-Nabarro stress?",
    correctAnswer: "The minimum stress required to move a dislocation through a crystal lattice at absolute zero temperature",
    distractors: ["The critical resolved shear stress for twinning", "The fracture stress of a perfect crystal", "The stress needed to nucleate a new grain"],
  },
  {
    question: "What is a martensitic transformation?",
    correctAnswer: "A diffusionless, shear-dominated phase transformation that occurs by coordinated atomic movements, as in quenched steel",
    distractors: ["A diffusion-controlled transformation at high temperature", "A gradual recrystallization during annealing", "A transformation driven by chemical reactions at grain boundaries"],
  },
  {
    question: "What is the Griffith criterion for brittle fracture?",
    correctAnswer: "A crack propagates when the elastic strain energy released exceeds the energy required to create new crack surfaces",
    distractors: ["Fracture occurs when stress exceeds the theoretical cohesive strength", "Crack growth is controlled by the rate of plastic deformation at the tip", "Brittle fracture only occurs below the ductile-to-brittle transition temperature"],
  },
  {
    question: "What is a shape memory alloy?",
    correctAnswer: "An alloy (e.g., NiTi) that can recover its original shape after deformation when heated above its transformation temperature",
    distractors: ["An alloy that retains its shape under extreme heat", "An alloy that changes color based on temperature", "An alloy with zero thermal expansion coefficient"],
  },
  {
    question: "What is the Hume-Rothery rules' primary criterion for substitutional solid solution formation?",
    correctAnswer: "The atomic radii of the solute and solvent should differ by no more than about 15%",
    distractors: ["The melting points must be within 50°C of each other", "The crystal structures must be identical", "The electronegativity difference must be zero"],
  },
  {
    question: "What is creep in materials science?",
    correctAnswer: "The slow, time-dependent, permanent deformation of a material under constant stress at elevated temperatures",
    distractors: ["The sudden brittle fracture of a material under impact loading", "The elastic deformation that recovers upon unloading", "The cyclic deformation leading to fatigue failure"],
  },
  {
    question: "What is a piezoelectric material?",
    correctAnswer: "A material that generates an electric charge in response to mechanical stress, and conversely deforms under an applied electric field",
    distractors: ["A material that generates a magnetic field under stress", "A material that changes its optical properties under pressure", "A material that becomes superconducting under mechanical compression"],
  },
  {
    question: "What is the Curie temperature in ferromagnetic materials?",
    correctAnswer: "The temperature above which a ferromagnetic material becomes paramagnetic, losing its spontaneous magnetization",
    distractors: ["The temperature at which a material becomes superconducting", "The melting point of a magnetic material", "The temperature at which magnetic domains first form"],
  },
  {
    question: "What is the Kirkendall effect?",
    correctAnswer: "The movement of the boundary between two metals due to differences in their diffusion rates during interdiffusion",
    distractors: ["The formation of precipitates at grain boundaries", "The segregation of impurities to free surfaces", "The creep deformation of metals under constant load"],
  },
  {
    question: "What is the Stoner criterion for ferromagnetism?",
    correctAnswer: "A material is ferromagnetic when the product of the density of states at the Fermi level and the exchange interaction exceeds 1",
    distractors: ["Ferromagnetism occurs when atomic moments exceed 2 Bohr magnetons", "A material is ferromagnetic only if it has unpaired d-electrons", "The Curie temperature must be above room temperature"],
  },
  {
    question: "What is a Frank-Read source?",
    correctAnswer: "A dislocation multiplication mechanism where a pinned dislocation segment bows out under stress and creates new dislocation loops",
    distractors: ["A point defect that emits vacancies under irradiation", "A grain boundary that nucleates new grains during recrystallization", "A crack tip that generates new microcracks under fatigue"],
  },
  {
    question: "What is the glass transition temperature (Tg)?",
    correctAnswer: "The temperature at which an amorphous material transitions from a hard, glassy state to a soft, rubbery state",
    distractors: ["The melting point of a crystalline material", "The temperature at which a glass crystallizes", "The boiling point of a glass-forming liquid"],
  },
  {
    question: "What are metamaterials?",
    correctAnswer: "Artificially engineered materials with structures designed to have properties not found in naturally occurring materials, such as negative refractive index",
    distractors: ["Materials that change phase under pressure", "Naturally occurring minerals with unusual crystal structures", "Composite materials made from recycled metals"],
  },
  {
    question: "What is Ostwald ripening?",
    correctAnswer: "The process by which smaller particles dissolve and redeposit onto larger particles, reducing total interfacial energy",
    distractors: ["The nucleation of new precipitates from supersaturated solution", "The growth of grains during primary recrystallization", "The formation of dendrites during solidification"],
  },
  {
    question: "What is the Zener pinning effect?",
    correctAnswer: "The inhibition of grain boundary migration by second-phase particles that exert a retarding force on moving boundaries",
    distractors: ["The locking of dislocations by solute atoms (Cottrell atmosphere)", "The pinning of magnetic domain walls by crystal defects", "The immobilization of vacancies at grain boundaries"],
  },
  {
    question: "What is a ferroelectric material?",
    correctAnswer: "A material with a spontaneous electric polarization that can be reversed by an external electric field",
    distractors: ["A material that is both ferromagnetic and electrically conductive", "A material that generates electricity from heat", "A material with permanent electric charge on its surfaces"],
  },
  {
    question: "What is the Coble creep mechanism?",
    correctAnswer: "Diffusion-controlled creep where atomic transport occurs along grain boundaries",
    distractors: ["Creep by dislocation climb over obstacles", "Creep by bulk (lattice) diffusion of atoms (Nabarro-Herring)", "Creep by grain boundary sliding without diffusion"],
  },
  {
    question: "What is the BCS theory?",
    correctAnswer: "A theory of superconductivity explaining it as a macroscopic quantum state of Cooper pairs (electron pairs bound via phonon-mediated interactions)",
    distractors: ["A theory of superfluidity in liquid helium-3", "A theory of ferromagnetism based on exchange interactions", "A theory of semiconductor band gaps"],
  },
  {
    question: "What is twinning in crystallography?",
    correctAnswer: "A deformation mechanism where part of a crystal lattice reorients to form a mirror image of the parent lattice across a twin boundary",
    distractors: ["The formation of two adjacent grains with identical orientations", "The splitting of a single crystal into two separate pieces", "The growth of two crystals from a single nucleation site"],
  },
  {
    question: "What is the Cottrell atmosphere?",
    correctAnswer: "A cloud of solute atoms that segregate to the strain field around a dislocation, pinning it and increasing yield strength",
    distractors: ["A layer of oxide that forms on metal surfaces", "A region of depleted solute around a growing precipitate", "A thermal boundary layer around a heated inclusion"],
  },
  {
    question: "What is the Vegard's law?",
    correctAnswer: "The lattice parameter of a solid solution varies linearly between the values of the pure constituent elements",
    distractors: ["The melting point of an alloy is the average of its components' melting points", "The hardness of a solid solution varies parabolically with composition", "The electrical resistivity of alloys increases linearly with temperature"],
  },
  {
    question: "What are topological insulators?",
    correctAnswer: "Materials that behave as insulators in their bulk but have conducting states on their surfaces or edges protected by time-reversal symmetry",
    distractors: ["Insulators that become conductors under extreme pressure", "Materials with topology-dependent mechanical properties", "Thin-film insulators used in semiconductor devices"],
  },
  {
    question: "What is precipitation hardening (age hardening)?",
    correctAnswer: "Strengthening a metal by heat treatment to form finely dispersed second-phase precipitates that impede dislocation motion",
    distractors: ["Hardening by cold working (strain hardening)", "Hardening by rapid quenching to form martensite", "Hardening by introducing interstitial atoms like carbon"],
  },
  {
    question: "What is the RKKY interaction?",
    correctAnswer: "An indirect exchange coupling between localized magnetic moments in metals mediated by conduction electrons",
    distractors: ["A direct exchange interaction between nearest-neighbor atoms", "A dipole-dipole interaction between magnetic nanoparticles", "A superexchange interaction through non-magnetic ions in insulators"],
  },
  {
    question: "What is a quasicrystal?",
    correctAnswer: "A solid with an ordered but non-periodic atomic structure that exhibits symmetries (e.g., 5-fold) forbidden in periodic crystals",
    distractors: ["A crystal with periodic structure but many defects", "An amorphous solid with short-range order only", "A polycrystalline material with very small grain size"],
  },
  {
    question: "What is the Bauschinger effect?",
    correctAnswer: "A reduction in yield strength in the reverse loading direction after plastic deformation, caused by internal stresses from dislocation pile-ups",
    distractors: ["An increase in strength after repeated loading cycles", "The formation of persistent slip bands during fatigue", "The time-dependent recovery of elastic properties after unloading"],
  },
  {
    question: "What is a spintronic device?",
    correctAnswer: "An electronic device that exploits the intrinsic spin of electrons (and its associated magnetic moment) in addition to charge for information processing",
    distractors: ["A device that uses spinning mechanical components for computation", "A quantum device based on nuclear spin resonance", "A photonic device that manipulates circularly polarized light"],
  },
  {
    question: "What is the Portevin-Le Chatelier effect?",
    correctAnswer: "Serrated (jerky) flow in the stress-strain curve caused by dynamic strain aging, where solute atoms repeatedly pin and unpin dislocations",
    distractors: ["Smooth, continuous plastic flow at high temperatures", "Oscillations in stress caused by phase transformations during deformation", "Periodic cracking during tensile testing of brittle materials"],
  },
  // ── Biochemistry & Neuroscience (311-360) ─────────────────────────────────
  {
    question: "What is the primary function of cytochrome c oxidase (Complex IV) in the electron transport chain?",
    correctAnswer: "Transferring electrons from cytochrome c to molecular oxygen, reducing O₂ to water, and pumping protons across the membrane",
    distractors: ["Oxidizing NADH to NAD⁺ and transferring electrons to ubiquinone", "Transferring electrons from FADH₂ to cytochrome c", "Synthesizing ATP using the proton gradient"],
  },
  {
    question: "What is the role of ubiquitin in cellular processes?",
    correctAnswer: "A small protein that tags other proteins for degradation by the proteasome when covalently attached as a polyubiquitin chain",
    distractors: ["A lipid that forms the core of cell membranes", "An enzyme that catalyzes DNA repair", "A signaling molecule that activates transcription factors"],
  },
  {
    question: "What is long-term potentiation (LTP)?",
    correctAnswer: "A persistent strengthening of synaptic connections following high-frequency stimulation, considered a cellular mechanism for learning and memory",
    distractors: ["A permanent increase in resting membrane potential", "The growth of new neurons in the adult brain", "A sustained increase in neurotransmitter synthesis rate"],
  },
  {
    question: "What is the Michaelis-Menten equation?",
    correctAnswer: "v = Vmax·[S]/(Km + [S]), describing the rate of enzymatic reactions as a function of substrate concentration",
    distractors: ["ΔG = ΔG° + RT·ln(Q), relating free energy to reaction quotient", "k = A·exp(−Ea/RT), the Arrhenius equation for rate constants", "v = k·[A]·[B], the rate law for a bimolecular reaction"],
  },
  {
    question: "What are NMDA receptors important for in neuroscience?",
    correctAnswer: "Glutamate receptors that are critical for synaptic plasticity, learning, and memory; they require both glutamate binding and membrane depolarization to open",
    distractors: ["GABA receptors that mediate inhibitory neurotransmission", "Dopamine receptors involved in reward signaling", "Acetylcholine receptors at neuromuscular junctions"],
  },
  {
    question: "What is the citrate synthase reaction?",
    correctAnswer: "The condensation of acetyl-CoA with oxaloacetate to form citrate, the first step of the citric acid cycle",
    distractors: ["The decarboxylation of isocitrate to α-ketoglutarate", "The oxidation of succinate to fumarate", "The conversion of malate to oxaloacetate"],
  },
  {
    question: "What is the blood-brain barrier?",
    correctAnswer: "A selective semipermeable border of endothelial cells with tight junctions that restricts passage of substances from blood to brain tissue",
    distractors: ["A layer of bone protecting the brain from physical trauma", "A network of glial cells that filters cerebrospinal fluid", "The meninges that surround the brain and spinal cord"],
  },
  {
    question: "What is the function of the Na⁺/K⁺-ATPase pump?",
    correctAnswer: "Actively transporting 3 Na⁺ ions out and 2 K⁺ ions into the cell per ATP hydrolyzed, maintaining the resting membrane potential",
    distractors: ["Passively allowing Na⁺ and K⁺ to flow down their concentration gradients", "Transporting Ca²⁺ out of the cell", "Exchanging Cl⁻ for HCO₃⁻ across the membrane"],
  },
  {
    question: "What is autophagy?",
    correctAnswer: "A cellular self-degradation process where cytoplasmic components are enclosed in autophagosomes and delivered to lysosomes for recycling",
    distractors: ["Programmed cell death (apoptosis)", "The engulfment of external particles by phagocytosis", "The spontaneous mutation of cells under stress"],
  },
  {
    question: "What is the role of myelin in the nervous system?",
    correctAnswer: "An insulating sheath around axons that increases the speed of electrical impulse propagation via saltatory conduction",
    distractors: ["A neurotransmitter that modulates synaptic transmission", "A structural protein of the neuronal cell body", "A nutrient supply system for dendrites"],
  },
  {
    question: "What is the Warburg effect?",
    correctAnswer: "The observation that cancer cells preferentially use glycolysis for energy even in the presence of oxygen (aerobic glycolysis)",
    distractors: ["The increased mutation rate in tumor cells", "The ability of cancer cells to evade immune detection", "The tendency of tumors to recruit new blood vessels (angiogenesis)"],
  },
  {
    question: "What is a G-protein coupled receptor (GPCR)?",
    correctAnswer: "A large family of cell surface receptors with seven transmembrane domains that signal through heterotrimeric G proteins",
    distractors: ["A nuclear receptor that directly binds DNA", "A single-pass transmembrane receptor with kinase activity", "A ligand-gated ion channel"],
  },
  {
    question: "What is the function of acetylcholinesterase?",
    correctAnswer: "Rapidly hydrolyzing the neurotransmitter acetylcholine in the synaptic cleft to terminate signal transmission",
    distractors: ["Synthesizing acetylcholine from choline and acetyl-CoA", "Transporting acetylcholine into synaptic vesicles", "Releasing acetylcholine from presynaptic terminals"],
  },
  {
    question: "What is the pentose phosphate pathway primarily used for?",
    correctAnswer: "Generating NADPH for reductive biosynthesis and ribose-5-phosphate for nucleotide synthesis",
    distractors: ["Producing ATP from glucose", "Breaking down fatty acids for energy", "Converting amino acids to glucose"],
  },
  {
    question: "What is the role of the hippocampus?",
    correctAnswer: "Critical for the formation of new explicit (declarative) memories and spatial navigation",
    distractors: ["Processing visual information from the retina", "Controlling voluntary motor movements", "Regulating body temperature and hunger"],
  },
  {
    question: "What is oxidative phosphorylation?",
    correctAnswer: "The metabolic pathway that produces ATP by coupling electron transport to chemiosmotic phosphorylation across the inner mitochondrial membrane",
    distractors: ["The direct transfer of a phosphate group from a substrate to ADP", "The phosphorylation of glucose in the first step of glycolysis", "The synthesis of GTP during the citric acid cycle"],
  },
  {
    question: "What is a lipid raft?",
    correctAnswer: "A microdomain in the cell membrane enriched in cholesterol and sphingolipids that serves as a platform for signaling and membrane trafficking",
    distractors: ["A lipid droplet used for energy storage", "A vesicle transporting lipids between organelles", "A lipid bilayer used in laboratory experiments"],
  },
  {
    question: "What is the action potential threshold?",
    correctAnswer: "The membrane potential (typically around −55 mV) at which voltage-gated Na⁺ channels open in sufficient numbers to trigger a self-reinforcing depolarization",
    distractors: ["The resting membrane potential of −70 mV", "The peak depolarization of +30 mV", "The equilibrium potential for potassium ions"],
  },
  {
    question: "What is the function of heat shock proteins (HSPs)?",
    correctAnswer: "Molecular chaperones that help refold or degrade misfolded proteins under stress conditions",
    distractors: ["Enzymes that repair heat-damaged DNA", "Proteins that lower the body's core temperature", "Membrane proteins that detect temperature changes"],
  },
  {
    question: "What is the Goldman equation used for?",
    correctAnswer: "Calculating the resting membrane potential by considering the permeabilities and concentrations of multiple ions (Na⁺, K⁺, Cl⁻)",
    distractors: ["Determining the equilibrium potential for a single ion species (Nernst equation)", "Calculating the rate of ion channel opening", "Measuring the capacitance of the cell membrane"],
  },
  {
    question: "What is beta-oxidation?",
    correctAnswer: "The catabolic pathway for breaking down fatty acids into acetyl-CoA units in the mitochondrial matrix",
    distractors: ["The synthesis of fatty acids from acetyl-CoA", "The oxidation of glucose to pyruvate in glycolysis", "The conversion of amino acids to ketone bodies"],
  },
  {
    question: "What is the role of the prefrontal cortex?",
    correctAnswer: "Executive functions including planning, decision-making, working memory, and impulse control",
    distractors: ["Processing auditory information from the ears", "Coordinating balance and fine motor movements", "Regulating heart rate and respiration"],
  },
  {
    question: "What is an allosteric activator?",
    correctAnswer: "A molecule that binds to a site other than the active site and increases the enzyme's catalytic activity",
    distractors: ["A competitive inhibitor that occupies the active site", "A cofactor required for enzyme function", "A substrate analog that triggers product release"],
  },
  {
    question: "What is the function of calmodulin?",
    correctAnswer: "A calcium-binding messenger protein that activates various enzymes and proteins in response to Ca²⁺ signals",
    distractors: ["A structural protein in calcarite shells", "An ion channel that transports calcium across membranes", "A hormone that regulates blood calcium levels"],
  },
  {
    question: "What are mirror neurons?",
    correctAnswer: "Neurons that fire both when an animal performs an action and when it observes the same action performed by another, implicated in understanding others' actions",
    distractors: ["Neurons that respond identically in both brain hemispheres", "Sensory neurons that detect reflected light", "Motor neurons that produce symmetrical bilateral movements"],
  },
  {
    question: "What is the role of GABA in the nervous system?",
    correctAnswer: "The primary inhibitory neurotransmitter in the adult central nervous system, reducing neuronal excitability",
    distractors: ["The primary excitatory neurotransmitter in the CNS", "A neuromodulator involved in pain signaling", "A neurotransmitter specific to the peripheral nervous system"],
  },
  {
    question: "What is the Lineweaver-Burk plot?",
    correctAnswer: "A double reciprocal plot (1/v vs 1/[S]) of the Michaelis-Menten equation, used to determine Km and Vmax graphically",
    distractors: ["A plot of reaction rate versus temperature", "A plot of product concentration versus time", "A semilogarithmic plot of enzyme activity versus pH"],
  },
  {
    question: "What is the gluconeogenesis pathway?",
    correctAnswer: "The metabolic pathway that synthesizes glucose from non-carbohydrate precursors (pyruvate, lactate, glycerol, amino acids) primarily in the liver",
    distractors: ["The breakdown of glycogen to glucose (glycogenolysis)", "The conversion of glucose to pyruvate (glycolysis)", "The synthesis of glycogen from glucose (glycogenesis)"],
  },
  {
    question: "What is the role of astrocytes in the brain?",
    correctAnswer: "Glial cells that maintain the blood-brain barrier, regulate neurotransmitter levels, provide metabolic support to neurons, and modulate synaptic transmission",
    distractors: ["Immune cells that phagocytose pathogens in the CNS", "Cells that produce myelin in the central nervous system", "Sensory cells that detect changes in intracranial pressure"],
  },
  {
    question: "What is the electron transport chain Complex I (NADH dehydrogenase)?",
    correctAnswer: "The first enzyme complex that accepts electrons from NADH, transfers them to ubiquinone, and pumps protons across the inner mitochondrial membrane",
    distractors: ["The complex that oxidizes FADH₂ and transfers electrons to cytochrome c", "The complex that reduces molecular oxygen to water", "The complex that synthesizes ATP from ADP and Pi"],
  },
  // ── Quantum Mechanics Advanced & Miscellaneous Science (361-416) ──────────
  {
    question: "What is the density matrix formalism used for in quantum mechanics?",
    correctAnswer: "Describing mixed quantum states and decoherence, generalizing the pure-state wavefunction to statistical mixtures",
    distractors: ["Calculating the energy eigenvalues of a Hamiltonian", "Determining the scattering cross-section of particles", "Solving the time-dependent Schrödinger equation exactly"],
  },
  {
    question: "What is the Lindblad master equation?",
    correctAnswer: "An equation describing the time evolution of the density matrix of an open quantum system, including decoherence and dissipation",
    distractors: ["The equation of motion for a quantum harmonic oscillator", "The relativistic wave equation for massless particles", "The evolution equation for a closed quantum system (von Neumann equation)"],
  },
  {
    question: "What is quantum decoherence?",
    correctAnswer: "The process by which quantum superpositions lose coherence due to interaction with the environment, leading to apparently classical behavior",
    distractors: ["The collapse of the wavefunction upon measurement", "The entanglement of two particles across large distances", "The tunneling of a particle through a potential barrier"],
  },
  {
    question: "What is the quantum Zeno effect?",
    correctAnswer: "Frequent measurements on a quantum system can inhibit its evolution, effectively freezing it in its initial state",
    distractors: ["A quantum system always decays at an exponential rate", "Measurements accelerate the decay of unstable particles", "Quantum tunneling rate increases with observation frequency"],
  },
  {
    question: "What is a topological quantum field theory?",
    correctAnswer: "A quantum field theory whose observables depend only on the topology of the underlying manifold, not on its metric or geometry",
    distractors: ["A quantum field theory defined only on flat spacetime", "A theory that describes quantum effects in curved spacetime", "A classical field theory with topological soliton solutions"],
  },
  {
    question: "What is the no-cloning theorem?",
    correctAnswer: "It is impossible to create an exact copy of an arbitrary unknown quantum state",
    distractors: ["Two entangled particles cannot be separated", "A quantum state cannot be measured without disturbance", "Quantum information cannot be transmitted faster than light"],
  },
  {
    question: "What is the quantum Hall effect?",
    correctAnswer: "The quantization of the Hall conductance in two-dimensional electron systems at low temperatures and strong magnetic fields, in integer multiples of e²/h",
    distractors: ["The generation of a voltage across a semiconductor in a magnetic field", "The resistance of a superconductor dropping to zero", "The emission of electrons from a metal surface under UV light"],
  },
  {
    question: "What is the Berry phase?",
    correctAnswer: "A geometric phase acquired by a quantum system when its parameters are slowly varied around a closed loop in parameter space",
    distractors: ["The phase difference between two interfering wave packets", "The overall phase of a stationary state eigenfunction", "The phase shift in a scattering process"],
  },
  {
    question: "What is the Kondo effect?",
    correctAnswer: "An anomalous increase in electrical resistivity at low temperatures in metals containing magnetic impurities, due to spin-flip scattering of conduction electrons",
    distractors: ["A decrease in resistivity to zero in superconductors below Tc", "An oscillation in magnetoresistance in thin metallic films", "A peak in thermal conductivity at the Debye temperature"],
  },
  {
    question: "What is a Bose-Einstein condensate?",
    correctAnswer: "A state of matter formed at near absolute zero where a large fraction of bosons occupy the lowest quantum state, behaving as a single quantum entity",
    distractors: ["A dense state of matter found in neutron stars", "A plasma state at extremely high temperatures", "A superfluid state that occurs only in helium-3"],
  },
  {
    question: "What is the Lamb-Dicke regime in atomic physics?",
    correctAnswer: "The condition where a trapped atom's spatial extent is much smaller than the wavelength of the interacting light, suppressing motional sidebands",
    distractors: ["The regime where atomic transitions are broadened by Doppler effects", "The condition for population inversion in a laser medium", "The limit where radiation pressure dominates over gravity"],
  },
  {
    question: "What is the Josephson effect?",
    correctAnswer: "The flow of supercurrent through a thin insulating barrier (Josephson junction) between two superconductors without any applied voltage (DC) or with oscillating current under DC voltage (AC)",
    distractors: ["The generation of a voltage when a superconductor is heated above Tc", "The quantization of magnetic flux in a superconducting ring", "The expulsion of magnetic fields from a superconductor (Meissner effect)"],
  },
  {
    question: "What is quantum entanglement swapping?",
    correctAnswer: "A process where two particles that have never interacted become entangled through measurements on intermediate entangled pairs",
    distractors: ["The exchange of quantum states between two entangled particles", "The destruction of entanglement through environmental decoherence", "The creation of entanglement by direct particle interaction"],
  },
  {
    question: "What is the Shor algorithm?",
    correctAnswer: "A quantum algorithm for integer factorization that runs in polynomial time, exponentially faster than the best known classical algorithms",
    distractors: ["A quantum algorithm for searching unsorted databases (Grover's)", "A classical algorithm for prime factorization", "A quantum error correction code"],
  },
  {
    question: "What is the fractional quantum Hall effect?",
    correctAnswer: "Quantization of Hall conductance at fractional values of e²/h, explained by the formation of composite fermions or Laughlin quasiparticles with fractional charge",
    distractors: ["The integer quantization of Hall resistance at low temperatures", "The oscillation of resistance in a two-dimensional electron gas", "The breakdown of superconductivity in a magnetic field"],
  },
  {
    question: "What is the Meissner effect?",
    correctAnswer: "The complete expulsion of magnetic flux from the interior of a superconductor when cooled below its critical temperature",
    distractors: ["The quantization of magnetic flux in units of h/2e", "The generation of a persistent current in a superconducting ring", "The tunneling of Cooper pairs through a normal metal barrier"],
  },
  {
    question: "What is the Gross-Pitaevskii equation?",
    correctAnswer: "A nonlinear Schrödinger equation describing the ground state and dynamics of a Bose-Einstein condensate in the mean-field approximation",
    distractors: ["The relativistic wave equation for a spin-0 boson", "The equation governing superfluid helium at finite temperature", "The transport equation for phonons in a crystal lattice"],
  },
  {
    question: "What is Anderson localization?",
    correctAnswer: "The absence of diffusion of waves (e.g., electrons) in a disordered medium due to destructive interference of scattered waves",
    distractors: ["The localization of electrons in a periodic potential (Bloch states)", "The trapping of photons in a resonant cavity", "The pinning of magnetic flux lines in a Type II superconductor"],
  },
  {
    question: "What is the Hubbard model?",
    correctAnswer: "A lattice model for interacting electrons that includes a kinetic hopping term and an on-site Coulomb repulsion term, used to study strongly correlated systems",
    distractors: ["A model for the elastic properties of crystalline solids", "A mean-field theory of ferromagnetism (Weiss model)", "A continuum model for electron transport in semiconductors"],
  },
  {
    question: "What is a quantum error correction code?",
    correctAnswer: "A scheme that encodes quantum information into multiple physical qubits to protect against decoherence and errors without directly measuring the quantum state",
    distractors: ["A classical error correction method applied to quantum computers", "A technique for eliminating noise in quantum measurements", "A method for perfectly cloning quantum states to create backups"],
  },
  {
    question: "What is the Sachdev-Ye-Kitaev (SYK) model?",
    correctAnswer: "A quantum mechanical model of N Majorana fermions with random all-to-all interactions, used as a toy model for quantum chaos and holography",
    distractors: ["A model for Bose-Einstein condensation in optical lattices", "A lattice gauge theory for confining quarks", "A cosmological model for dark energy"],
  },
  {
    question: "What is the spin Hall effect?",
    correctAnswer: "The generation of a transverse spin current perpendicular to an applied charge current due to spin-orbit coupling, without an external magnetic field",
    distractors: ["The deflection of spin-polarized electrons in a magnetic field", "The rotation of electron spin in a nuclear magnetic resonance experiment", "The suppression of spin transport in insulating materials"],
  },
  {
    question: "What is the Jaynes-Cummings model?",
    correctAnswer: "A model describing the interaction between a single two-level atom and a single quantized mode of an electromagnetic cavity",
    distractors: ["A model for many atoms coupled to a classical electromagnetic field", "A theory of blackbody radiation in an enclosed cavity", "A description of laser operation with population inversion"],
  },
  {
    question: "What is the Thomas-Fermi approximation?",
    correctAnswer: "A semiclassical method for calculating electron density in atoms and solids by treating the electron gas as locally uniform (local density approximation of kinetic energy)",
    distractors: ["An exact solution of the hydrogen atom energy levels", "A perturbative method for calculating transition rates", "A relativistic correction to the electron's orbital angular momentum"],
  },
  {
    question: "What is the Aharonov-Casher effect?",
    correctAnswer: "A neutral particle with a magnetic moment acquires a phase when encircling a line of electric charge, the dual of the Aharonov-Bohm effect",
    distractors: ["A charged particle acquires a phase when encircling a magnetic flux tube", "A neutron precesses in an external magnetic field", "A photon changes polarization when passing through an electric field"],
  },
  {
    question: "What is the Dicke superradiance?",
    correctAnswer: "A collective quantum optical phenomenon where N excited atoms radiate coherently with an intensity proportional to N², much faster than independent spontaneous emission",
    distractors: ["The amplification of light in a laser medium", "The enhanced absorption of photons by a dense gas", "The stimulated emission of a single atom in a cavity"],
  },
  {
    question: "What is the quantum spin liquid?",
    correctAnswer: "A state of matter where spins remain disordered and entangled down to absolute zero, without forming conventional magnetic order",
    distractors: ["A superfluid state of spinor bosons", "A ferromagnetic material above its Curie temperature", "A liquid crystal phase with orientational but no positional order"],
  },
  {
    question: "What is the Kibble-Zurek mechanism?",
    correctAnswer: "A theory predicting the formation of topological defects when a system is driven through a continuous phase transition at a finite rate",
    distractors: ["A mechanism for spontaneous symmetry breaking in the Higgs field", "The production of cosmic strings during the Big Bang", "The nucleation of bubbles during a first-order phase transition"],
  },
  {
    question: "What is the eigenstate thermalization hypothesis (ETH)?",
    correctAnswer: "The hypothesis that individual energy eigenstates of a many-body quantum system encode thermal properties, explaining how isolated quantum systems reach thermal equilibrium",
    distractors: ["The hypothesis that all quantum states have equal probability at equilibrium", "The principle that measurement collapses a system to a thermal state", "The conjecture that entanglement entropy scales with volume for thermal states"],
  },
  {
    question: "What is the Sachdev-Ye model related to in modern physics?",
    correctAnswer: "Quantum gravity and the AdS/CFT correspondence, as the SYK model (its extension) exhibits features of nearly-AdS₂ holography and maximal quantum chaos",
    distractors: ["Topological quantum computing with Fibonacci anyons", "High-temperature superconductivity in cuprate materials", "The unification of electromagnetism and gravity"],
  },
  {
    question: "What is a Weyl semimetal?",
    correctAnswer: "A topological material whose low-energy excitations are Weyl fermions — massless chiral particles that occur at pairs of band-touching points (Weyl nodes)",
    distractors: ["A semiconductor with a very small band gap", "A metal with linear energy-momentum dispersion at a single point", "An insulator with conducting surface states"],
  },
  {
    question: "What is the fluctuation-dissipation theorem?",
    correctAnswer: "A relation connecting the response of a system to a small perturbation with its spontaneous equilibrium fluctuations, linking dissipative transport coefficients to correlation functions",
    distractors: ["A theorem stating that quantum fluctuations vanish at absolute zero", "A principle that dissipation always increases entropy", "A relation between energy fluctuations and the specific heat only"],
  },
  {
    question: "What is the Kubo formula?",
    correctAnswer: "A linear response formula that expresses transport coefficients (e.g., electrical conductivity) as integrals of equilibrium current-current correlation functions",
    distractors: ["A formula for the partition function of a quantum system", "An expression for the density of states in a disordered system", "A relation between magnetic susceptibility and temperature (Curie-Weiss law)"],
  },
  {
    question: "What is a Floquet system?",
    correctAnswer: "A quantum system driven by a time-periodic Hamiltonian, analyzed using Floquet theory to find quasi-energy states analogous to Bloch states in spatial periodic potentials",
    distractors: ["A system in thermal equilibrium with a heat bath", "A static system with spatially periodic boundary conditions", "A system with a randomly fluctuating Hamiltonian"],
  },
  {
    question: "What is the many-body localization (MBL) phenomenon?",
    correctAnswer: "A phase of interacting quantum many-body systems with sufficient disorder that fails to thermalize, retaining memory of initial conditions indefinitely",
    distractors: ["The localization of particles in a periodic lattice potential (band insulator)", "The formation of a Mott insulator due to strong correlations", "The condensation of bosons into the lowest energy state"],
  },
  {
    question: "What is the Page curve in black hole physics?",
    correctAnswer: "A plot of the entanglement entropy of Hawking radiation as a function of time, initially rising then falling, indicating information is ultimately preserved during black hole evaporation",
    distractors: ["A curve showing the temperature of a black hole versus its mass", "A plot of the black hole's luminosity as it evaporates", "A diagram of the event horizon area versus time"],
  },
  {
    question: "What is the Sachdev quantum critical point?",
    correctAnswer: "A zero-temperature phase transition driven by quantum fluctuations, around which novel scaling behavior and exotic quasiparticles emerge at finite temperature",
    distractors: ["The critical temperature above which thermal fluctuations destroy long-range order", "The pressure at which a metal-insulator transition occurs", "The magnetic field strength that quenches superconductivity"],
  },
  // ── Additional Science: Genetics, Organic Chemistry, Particle Physics, Astrophysics (297-416) ──
  {
    question: "What is the Ramachandran plot used for?",
    correctAnswer: "Visualizing the allowed backbone dihedral angles (φ and ψ) of amino acid residues in protein structures",
    distractors: ["Plotting enzyme kinetics data", "Showing the relationship between DNA melting temperature and GC content", "Mapping protein-protein interaction networks"],
  },
  {
    question: "What is the Stokes shift in fluorescence spectroscopy?",
    correctAnswer: "The difference in wavelength between the absorption and emission maxima, with emission at longer wavelength due to energy loss",
    distractors: ["The broadening of spectral lines due to collisions", "The shift in resonance frequency with molecular weight", "The change in absorption wavelength with solvent polarity"],
  },
  {
    question: "What is the Heisenberg uncertainty principle for energy and time?",
    correctAnswer: "ΔE·Δt ≥ ℏ/2",
    distractors: ["ΔE·Δt ≥ ℏ", "ΔE·Δt ≥ h", "ΔE·Δt ≥ 0"],
  },
  {
    question: "What is a Feshbach resonance in atomic physics?",
    correctAnswer: "A scattering resonance that occurs when the energy of a pair of colliding atoms matches a bound molecular state in a different spin channel, tunable via magnetic fields",
    distractors: ["A resonance in an optical cavity at a specific wavelength", "A nuclear resonance used in Mössbauer spectroscopy", "A shape resonance in electron-molecule scattering"],
  },
  {
    question: "What is the Czochralski process?",
    correctAnswer: "A crystal growth method where a seed crystal is slowly pulled from a melt to produce large single crystals (e.g., silicon for semiconductors)",
    distractors: ["A chemical vapor deposition technique for thin films", "A method for growing crystals by slow evaporation", "A zone melting technique for purifying metals"],
  },
  {
    question: "What is the Meerwein-Ponndorf-Verley reduction?",
    correctAnswer: "The selective reduction of ketones and aldehydes to alcohols using aluminum alkoxide as a hydride donor via a six-membered cyclic transition state",
    distractors: ["The oxidation of alcohols to ketones using chromium reagents", "The reduction of esters to alcohols using LiAlH₄", "The hydrogenation of alkenes using Wilkinson's catalyst"],
  },
  {
    question: "What is the Cope rearrangement?",
    correctAnswer: "A [3,3]-sigmatropic rearrangement of 1,5-dienes that proceeds through a chair-like transition state",
    distractors: ["A [2,3]-Wittig rearrangement of ethers", "A [1,5]-hydrogen shift in cyclopentadiene", "A retro-ene reaction of allyl systems"],
  },
  {
    question: "What is the Franck-Condon principle?",
    correctAnswer: "Electronic transitions occur so rapidly compared to nuclear motion that the nuclear configuration remains essentially unchanged during the transition (vertical transitions)",
    distractors: ["Molecules always relax to the lowest vibrational state before emitting light", "The probability of a transition is proportional to the square of the dipole moment", "Nuclear and electronic motions cannot be separated in any approximation"],
  },
  {
    question: "What is the Baryon Asymmetry Problem?",
    correctAnswer: "The observed predominance of matter over antimatter in the universe, unexplained by the Standard Model's small CP violation",
    distractors: ["The discrepancy between observed and predicted baryon density", "The missing mass problem in galaxy clusters", "The uneven distribution of baryons in the cosmic microwave background"],
  },
  {
    question: "What is the proton-proton chain?",
    correctAnswer: "The dominant nuclear fusion process in stars like the Sun, converting hydrogen to helium-4 through a series of reactions",
    distractors: ["The CNO cycle that dominates in massive stars", "The triple-alpha process that produces carbon", "The r-process that creates heavy elements in supernovae"],
  },
  {
    question: "What is the Schwarzschild radius of the Sun?",
    correctAnswer: "≈ 3 km",
    distractors: ["≈ 30 km", "≈ 0.3 km", "≈ 300 km"],
  },
  {
    question: "What is the Drake equation used for?",
    correctAnswer: "Estimating the number of communicative extraterrestrial civilizations in the Milky Way by considering factors like star formation rate and fraction of habitable planets",
    distractors: ["Calculating the age of the universe from the Hubble constant", "Predicting the orbital parameters of exoplanets", "Estimating the total mass of the Milky Way"],
  },
  {
    question: "What is the Penrose process?",
    correctAnswer: "A mechanism for extracting rotational energy from a spinning (Kerr) black hole via the ergosphere",
    distractors: ["A method for detecting gravitational waves from black hole mergers", "The process by which a black hole evaporates via Hawking radiation", "The formation of a singularity during gravitational collapse"],
  },
  {
    question: "What is the Oparin-Haldane hypothesis?",
    correctAnswer: "That life on Earth arose from simple organic molecules formed in the early reducing atmosphere, which assembled into more complex molecules in a 'primordial soup'",
    distractors: ["That life originated at deep-sea hydrothermal vents exclusively", "That life was seeded from extraterrestrial sources (panspermia)", "That RNA was the first genetic material (RNA world)"],
  },
  {
    question: "What is the Miller-Urey experiment?",
    correctAnswer: "An experiment demonstrating that amino acids and other organic molecules can form from inorganic precursors under simulated early Earth conditions",
    distractors: ["An experiment proving that DNA is the genetic material", "An experiment showing spontaneous generation of microorganisms", "An experiment measuring the speed of light in a vacuum"],
  },
  {
    question: "What is the Fermi paradox?",
    correctAnswer: "The apparent contradiction between the high probability of extraterrestrial civilizations and the lack of evidence or contact",
    distractors: ["The impossibility of reaching absolute zero temperature", "The contradiction between quantum mechanics and general relativity", "The paradox of time travel in special relativity"],
  },
  {
    question: "What is the Doppler effect used for in astronomy?",
    correctAnswer: "Measuring the radial velocity of stars and galaxies by observing the shift in wavelength of their spectral lines",
    distractors: ["Measuring the distance to nearby stars via parallax", "Determining the temperature of stellar atmospheres", "Calculating the age of stars from their luminosity"],
  },
  {
    question: "What is the triple-alpha process?",
    correctAnswer: "A nuclear fusion reaction in which three helium-4 nuclei fuse to form carbon-12, occurring in red giant stars",
    distractors: ["The proton-proton chain that powers the Sun", "The CNO cycle in massive stars", "The s-process for slow neutron capture"],
  },
  {
    question: "What is the Pauli paramagnetism?",
    correctAnswer: "The weak paramagnetism of conduction electrons in metals, where only electrons near the Fermi surface contribute to the magnetic susceptibility",
    distractors: ["The strong paramagnetism of ions with unpaired d-electrons", "The diamagnetism of all materials in an external field", "The ferromagnetism of iron at room temperature"],
  },
  {
    question: "What is the Seebeck effect?",
    correctAnswer: "The generation of a voltage (electromotive force) across a junction of two different conductors when there is a temperature difference",
    distractors: ["The cooling of a junction when current flows through it (Peltier effect)", "The heating of a conductor carrying current in a temperature gradient (Thomson effect)", "The generation of current in a wire moving through a magnetic field"],
  },
  {
    question: "What is the Kerr effect in nonlinear optics?",
    correctAnswer: "A change in the refractive index of a material proportional to the square of the applied electric field (or light intensity)",
    distractors: ["The rotation of the polarization plane of light in a magnetic field (Faraday effect)", "The splitting of spectral lines in an electric field (Stark effect)", "The emission of photons by an accelerating charged particle"],
  },
  {
    question: "What is chirality in chemistry?",
    correctAnswer: "The property of a molecule that is non-superimposable on its mirror image, like left and right hands",
    distractors: ["The ability of a molecule to rotate plane-polarized light", "The existence of geometric isomers (cis/trans)", "The presence of multiple bond angles in a molecule"],
  },
  {
    question: "What is the Heck reaction?",
    correctAnswer: "A palladium-catalyzed coupling of an aryl or vinyl halide with an alkene to form a substituted alkene",
    distractors: ["A rhodium-catalyzed hydroformylation of alkenes", "A copper-catalyzed cyclopropanation of alkenes", "A nickel-catalyzed reductive coupling of two halides"],
  },
  {
    question: "What is the Swern oxidation?",
    correctAnswer: "The oxidation of primary and secondary alcohols to aldehydes and ketones using oxalyl chloride and DMSO",
    distractors: ["The oxidation of alcohols using Jones reagent (CrO₃/H₂SO₄)", "The oxidation of primary alcohols to carboxylic acids using KMnO₄", "The oxidation of aldehydes to carboxylic acids using Tollens' reagent"],
  },
  {
    question: "What is the Fermi energy?",
    correctAnswer: "The energy of the highest occupied quantum state at absolute zero temperature in a system of fermions",
    distractors: ["The average thermal energy of particles at room temperature", "The ionization energy of the outermost electron in an atom", "The binding energy of the strongest bond in a crystal"],
  },
  {
    question: "What is the Mössbauer effect?",
    correctAnswer: "The recoil-free emission and absorption of gamma rays by atomic nuclei bound in a solid, allowing extremely precise energy measurements",
    distractors: ["The emission of X-rays by electrons striking a metal target", "The absorption of neutrons by heavy nuclei", "The emission of alpha particles from radioactive decay"],
  },
  {
    question: "What is the Chandrasekhar mass for a white dwarf composed primarily of carbon and oxygen?",
    correctAnswer: "≈ 1.4 solar masses (1.44 M☉)",
    distractors: ["≈ 0.5 solar masses", "≈ 3.0 solar masses", "≈ 8.0 solar masses"],
  },
  {
    question: "What is the Diels-Alder reaction's requirement for the diene?",
    correctAnswer: "The diene must be in the s-cis conformation to undergo [4+2] cycloaddition",
    distractors: ["The diene must be in the s-trans conformation", "The diene must have electron-withdrawing groups", "The diene must be acyclic"],
  },
  {
    question: "What is the Pauli paramagnetic susceptibility proportional to in metals?",
    correctAnswer: "The density of states at the Fermi energy",
    distractors: ["The inverse of temperature (1/T)", "The square of the magnetic moment", "The total number of conduction electrons"],
  },
  {
    question: "What is the Stark effect?",
    correctAnswer: "The splitting and shifting of spectral lines of atoms and molecules in an external electric field",
    distractors: ["The splitting of spectral lines in a magnetic field (Zeeman effect)", "The broadening of spectral lines due to pressure", "The shift in frequency of radiation from a moving source"],
  },
  {
    question: "What is the Born-Oppenheimer approximation?",
    correctAnswer: "The assumption that nuclear and electronic motions can be separated because nuclei are much heavier and slower than electrons",
    distractors: ["The assumption that all atoms in a molecule vibrate independently", "The approximation that electron-electron repulsion can be ignored", "The assumption that molecular wavefunctions are always symmetric"],
  },
  {
    question: "What is the Zeeman effect?",
    correctAnswer: "The splitting of spectral lines in the presence of an external magnetic field due to the interaction of magnetic moments with the field",
    distractors: ["The splitting of lines in an electric field (Stark effect)", "The broadening of spectral lines due to thermal motion", "The shift of absorption lines in high-pressure gases"],
  },
  {
    question: "What is the Compton effect?",
    correctAnswer: "The increase in wavelength of X-rays or gamma rays when scattered by electrons, demonstrating the particle nature of light",
    distractors: ["The photoelectric emission of electrons from a metal surface", "The diffraction of electrons by a crystal lattice", "The absorption of photons by atomic nuclei"],
  },
  {
    question: "What is the Raman effect?",
    correctAnswer: "Inelastic scattering of light by molecules, where the scattered photon has a different energy than the incident photon due to vibrational energy exchange",
    distractors: ["Elastic scattering of light with no change in wavelength (Rayleigh scattering)", "The absorption and re-emission of light at a longer wavelength (fluorescence)", "The stimulated emission of coherent light (laser action)"],
  },
  {
    question: "What is the Debye temperature?",
    correctAnswer: "A characteristic temperature related to the highest frequency of normal modes in a crystal, above which the heat capacity approaches the classical Dulong-Petit value",
    distractors: ["The temperature at which a material becomes superconducting", "The melting point of a crystalline solid", "The temperature at which thermal expansion becomes nonlinear"],
  },
  {
    question: "What is the photoelectric effect?",
    correctAnswer: "The emission of electrons from a material surface when illuminated by light of sufficient frequency, with electron kinetic energy depending on photon frequency, not intensity",
    distractors: ["The generation of a current in a semiconductor by light absorption", "The emission of X-rays when electrons strike a metal", "The change in resistance of a material upon illumination"],
  },
  {
    question: "What is the Kronig-Penney model?",
    correctAnswer: "A simplified one-dimensional periodic potential model that demonstrates the formation of energy bands and band gaps in solids",
    distractors: ["A model for impurity states in semiconductors", "A model for the density of states in amorphous materials", "A model for electron transport in nanotubes"],
  },
  {
    question: "What is a phonon?",
    correctAnswer: "A quantized mode of lattice vibration in a crystal, treated as a quasiparticle that carries energy and momentum",
    distractors: ["A quantum of electromagnetic radiation", "A bound state of an electron and a hole in a semiconductor", "A quantized unit of magnetic flux"],
  },
  {
    question: "What is the Brillouin zone?",
    correctAnswer: "The first primitive cell of the reciprocal lattice, representing the set of unique wave vectors for crystal excitations",
    distractors: ["The unit cell of the real-space crystal lattice", "The region of a crystal within one Debye screening length", "The volume around an atom where bonding interactions occur"],
  },
  {
    question: "What is the Hartree-Fock method?",
    correctAnswer: "A self-consistent field method for approximating the ground state wavefunction of a many-electron system as a single Slater determinant, treating electron exchange exactly but neglecting correlation",
    distractors: ["An exact method for solving the Schrödinger equation for helium", "A density functional approach for computing molecular properties", "A perturbative method for including relativistic corrections"],
  },
  {
    question: "What is the Bloch theorem?",
    correctAnswer: "The eigenstates of an electron in a periodic potential can be written as a plane wave times a function with the periodicity of the lattice",
    distractors: ["Electrons in a crystal have discrete energy levels like atoms", "The wavefunction of an electron in a solid is always localized", "Crystal momentum is always conserved in scattering processes"],
  },
  {
    question: "What is the Landau quantization?",
    correctAnswer: "The quantization of charged particle orbits in a magnetic field into discrete Landau levels, with energy spacing ℏωc",
    distractors: ["The quantization of angular momentum in atoms", "The quantization of vibrational modes in molecules", "The quantization of energy in a harmonic oscillator"],
  },
  {
    question: "What is a polaron?",
    correctAnswer: "A quasiparticle consisting of an electron (or hole) together with its self-induced lattice distortion (phonon cloud) in an ionic or polar crystal",
    distractors: ["A bound exciton at a defect site", "A localized magnetic excitation (magnon)", "A Cooper pair in a superconductor"],
  },
  {
    question: "What is the Luttinger liquid?",
    correctAnswer: "A model for interacting fermions in one dimension where Fermi liquid theory breaks down and excitations are collective (bosonic) density waves",
    distractors: ["A normal Fermi liquid with quasiparticle excitations", "A superfluid phase of bosons in one dimension", "A disordered insulating phase in one dimension"],
  },
  {
    question: "What is the anomalous Hall effect?",
    correctAnswer: "A Hall effect contribution in ferromagnetic materials arising from spin-orbit coupling rather than the Lorentz force, proportional to magnetization",
    distractors: ["The ordinary Hall effect in a non-magnetic metal", "The quantum Hall effect in a two-dimensional electron gas", "The thermal Hall effect (Righi-Leduc effect)"],
  },
  {
    question: "What is the Peierls instability?",
    correctAnswer: "A lattice distortion (dimerization) in a one-dimensional metallic chain that opens a band gap at the Fermi level, making it an insulator",
    distractors: ["The melting of a one-dimensional chain at any finite temperature", "The formation of charge density waves in three-dimensional metals", "The magnetic ordering of a one-dimensional spin chain"],
  },
  {
    question: "What is the orbital hybridization in ethylene (C₂H₄)?",
    correctAnswer: "sp² hybridization on each carbon, with one unhybridized p orbital forming the π bond",
    distractors: ["sp hybridization on each carbon", "sp³ hybridization on each carbon", "sp³d hybridization on each carbon"],
  },
  {
    question: "What is the Mannich reaction?",
    correctAnswer: "A multi-component condensation of a non-enolizable aldehyde (formaldehyde), a primary or secondary amine, and an enolizable carbonyl compound to form a β-amino-carbonyl (Mannich base)",
    distractors: ["The aldol condensation of two aldehydes", "The reductive amination of a ketone", "The Strecker synthesis of amino acids"],
  },
  {
    question: "What is the Beckmann rearrangement?",
    correctAnswer: "The acid-catalyzed rearrangement of an oxime to a lactam or amide, involving migration of the group anti to the hydroxyl",
    distractors: ["The rearrangement of a ketone to an ester (Baeyer-Villiger)", "The rearrangement of an allyl vinyl ether (Claisen)", "The conversion of an alcohol to an alkyl halide (Appel reaction)"],
  },
  {
    question: "What is the r-process in nucleosynthesis?",
    correctAnswer: "Rapid neutron capture process occurring in extreme environments (e.g., neutron star mergers, supernovae) that produces about half of the elements heavier than iron",
    distractors: ["Slow neutron capture in red giant stars (s-process)", "Proton capture in hydrogen-burning shells (p-process)", "Alpha capture in helium-burning cores (triple-alpha)"],
  },
  {
    question: "What is the s-process in nucleosynthesis?",
    correctAnswer: "Slow neutron capture process occurring in AGB stars where neutron capture is slower than beta decay, producing stable isotopes up to bismuth-209",
    distractors: ["Rapid neutron capture in supernovae", "Proton capture in the rp-process", "Spallation reactions from cosmic rays"],
  },
  {
    question: "What is a Fano resonance?",
    correctAnswer: "An asymmetric spectral line shape arising from quantum interference between a discrete state and a continuum of states",
    distractors: ["A symmetric Lorentzian absorption line", "A broadened Gaussian line due to Doppler effects", "A narrow absorption feature in a photonic crystal"],
  },
  {
    question: "What is the Shapiro delay?",
    correctAnswer: "The time delay of light signals passing near a massive object due to spacetime curvature, a test of general relativity",
    distractors: ["The redshift of light from a distant galaxy", "The deflection of starlight by the Sun during an eclipse", "The precession of Mercury's perihelion"],
  },
  {
    question: "What is the Lense-Thirring effect?",
    correctAnswer: "The dragging of spacetime (frame-dragging) by a rotating massive body, causing precession of orbits and gyroscopes nearby",
    distractors: ["The bending of light around a non-rotating mass", "The time dilation experienced by an orbiting clock", "The gravitational redshift near a black hole"],
  },
  {
    question: "What is the principle of detailed balance?",
    correctAnswer: "At equilibrium, each elementary process occurs at the same rate as its reverse process",
    distractors: ["The total energy of an isolated system is conserved", "The entropy of an isolated system always increases", "All microstates of equal energy are equally probable"],
  },
  {
    question: "What is the van der Waals equation?",
    correctAnswer: "(P + a/V²)(V − b) = nRT, a modification of the ideal gas law accounting for intermolecular attraction (a) and finite molecular volume (b)",
    distractors: ["PV = nRT, the ideal gas law", "PV^γ = constant, the adiabatic equation", "P₁V₁/T₁ = P₂V₂/T₂, the combined gas law"],
  },
  {
    question: "What is the Bravais lattice?",
    correctAnswer: "One of 14 distinct three-dimensional lattice types that, when combined with a basis, describe all possible crystal structures",
    distractors: ["A lattice with a single atom at each point", "Any arrangement of atoms in a solid", "The reciprocal of a real-space lattice"],
  },
  {
    question: "What is the Eötvös experiment?",
    correctAnswer: "A precision experiment demonstrating the equivalence of gravitational and inertial mass to high accuracy, supporting the equivalence principle",
    distractors: ["An experiment measuring the gravitational constant G", "An experiment detecting gravitational waves", "An experiment measuring the speed of gravity"],
  },
  {
    question: "What is the cosmic neutrino background?",
    correctAnswer: "A background of low-energy neutrinos predicted to have decoupled from matter about one second after the Big Bang, with a present temperature of ≈1.95 K",
    distractors: ["High-energy neutrinos from supernova explosions", "Neutrinos produced by nuclear reactions in the Sun", "Neutrinos emitted by cosmic ray interactions in the atmosphere"],
  },
  {
    question: "What is the Pound-Rebka experiment?",
    correctAnswer: "An experiment that measured the gravitational redshift of gamma-ray photons in Earth's gravitational field, confirming a prediction of general relativity",
    distractors: ["An experiment detecting the photoelectric effect", "An experiment measuring the speed of light", "An experiment demonstrating electron diffraction"],
  },
  {
    question: "What is a topological insulator's surface state protected by?",
    correctAnswer: "Time-reversal symmetry, which prevents backscattering of surface states by non-magnetic impurities",
    distractors: ["Spatial inversion symmetry only", "Gauge symmetry of the electromagnetic field", "Translational symmetry of the crystal lattice"],
  },
  {
    question: "What is the Mpemba effect?",
    correctAnswer: "The observation that under certain conditions, hot water can freeze faster than cold water, though the underlying mechanism remains debated",
    distractors: ["The increase in boiling point of water at high altitude", "The supercooling of water below 0°C without freezing", "The expansion of water upon freezing"],
  },
  {
    question: "What is the Chandrasekhar-Friedman-Schutz instability?",
    correctAnswer: "A gravitational-wave-driven instability in rapidly rotating neutron stars where counter-rotating modes are dragged forward by the star's rotation and grow by emitting gravitational waves",
    distractors: ["The collapse of a white dwarf exceeding the Chandrasekhar limit", "The tidal disruption of a star by a black hole", "The instability of accretion disks due to magnetic turbulence"],
  },
  {
    question: "What is the Schwinger pair production threshold field strength?",
    correctAnswer: "≈ 1.3 × 10¹⁸ V/m (the critical field for spontaneous electron-positron pair creation from the vacuum)",
    distractors: ["≈ 1.3 × 10⁶ V/m", "≈ 1.3 × 10¹² V/m", "≈ 1.3 × 10²⁴ V/m"],
  },
  {
    question: "What is the cosmological constant problem?",
    correctAnswer: "The discrepancy of roughly 120 orders of magnitude between the observed vacuum energy density and the value predicted by quantum field theory",
    distractors: ["The disagreement between different measurements of the Hubble constant", "The absence of magnetic monopoles in the universe", "The flatness of the universe despite no apparent fine-tuning mechanism"],
  },
  {
    question: "What is the Bekenstein-Hawking entropy of a black hole?",
    correctAnswer: "S = k_B·A/(4·l_P²), proportional to the area of the event horizon, not the volume",
    distractors: ["S = k_B·V/l_P³, proportional to the volume enclosed", "S = k_B·M/m_P, proportional to the black hole mass", "S = k_B·ln(2), a constant for all black holes"],
  },
  {
    question: "What is the holographic principle?",
    correctAnswer: "The conjecture that the information content of a region of space is encoded on its boundary surface, with maximum entropy proportional to the boundary area",
    distractors: ["The principle that the universe is a simulation", "The theory that all physical laws are scale-invariant", "The idea that distant regions of space are quantum entangled"],
  },
  {
    question: "What is the Chandrasekhar number used for?",
    correctAnswer: "A dimensionless number in magnetohydrodynamics representing the ratio of electromagnetic force to viscous force",
    distractors: ["Characterizing the mass limit of white dwarfs", "Measuring the luminosity of Cepheid variable stars", "Describing the instability of rotating fluid bodies"],
  },
  {
    question: "What is the Regge trajectory?",
    correctAnswer: "A linear relationship between the spin J and the mass squared M² of hadrons: J = α' M² + α₀, observed in particle spectroscopy",
    distractors: ["The path of a particle in a gravitational field", "The trajectory of a cosmic ray through the atmosphere", "The orbit of a planet precessing due to general relativity"],
  },
  {
    question: "What is the neutron drip line?",
    correctAnswer: "The boundary on the nuclear chart beyond which adding another neutron results in it being unbound (dripping out) from the nucleus",
    distractors: ["The line separating stable from radioactive isotopes", "The boundary beyond which nuclei undergo spontaneous fission", "The limit above which protons cannot be bound in a nucleus"],
  },
  {
    question: "What is the island of stability?",
    correctAnswer: "A predicted region of superheavy nuclei with certain magic numbers of protons and neutrons that would have significantly longer half-lives than neighboring isotopes",
    distractors: ["A stable region in the periodic table around iron-56", "The set of all naturally occurring isotopes on Earth", "A theoretical group of nuclei with zero binding energy"],
  },
  {
    question: "What is the Bjorken scaling in deep inelastic scattering?",
    correctAnswer: "The approximate independence of structure functions from the momentum transfer Q², indicating point-like constituents (quarks) inside nucleons",
    distractors: ["The linear scaling of cross-sections with energy in elastic scattering", "The scaling of nuclear radii with mass number A^(1/3)", "The proportionality of decay rates to the phase space volume"],
  },
  {
    question: "What is the Higgs mechanism?",
    correctAnswer: "The process by which gauge bosons acquire mass through spontaneous breaking of electroweak symmetry via coupling to the Higgs field",
    distractors: ["The mechanism by which fermions acquire spin", "The process of confinement of quarks inside hadrons", "The generation of the cosmological constant from vacuum energy"],
  },
  {
    question: "What is the Lamb-Retherford experiment?",
    correctAnswer: "The measurement of the Lamb shift (2S₁/₂ − 2P₁/₂ splitting in hydrogen) using microwave spectroscopy, providing key evidence for quantum electrodynamics",
    distractors: ["The observation of the photoelectric effect by Hertz", "The measurement of the electron charge by Millikan", "The discovery of the neutron by Chadwick"],
  },
  {
    question: "What is the axion?",
    correctAnswer: "A hypothetical light, neutral pseudoscalar particle proposed to solve the strong CP problem in QCD, also a candidate for dark matter",
    distractors: ["A heavy charged boson predicted by supersymmetry", "A composite particle made of five quarks (pentaquark)", "A sterile neutrino with no standard model interactions"],
  },
  {
    question: "What is the strong CP problem?",
    correctAnswer: "The puzzle of why the strong interaction does not appear to violate CP symmetry, despite the QCD Lagrangian allowing a CP-violating θ-term",
    distractors: ["The problem of why CP violation occurs in weak interactions", "The question of why protons are stable against decay", "The issue of quark confinement at low energies"],
  },
  {
    question: "What is the Planck length?",
    correctAnswer: "≈ 1.616 × 10⁻³⁵ m, the length scale at which quantum gravitational effects are expected to become significant",
    distractors: ["≈ 1.616 × 10⁻¹⁵ m (the size of a proton)", "≈ 1.616 × 10⁻²⁵ m", "≈ 1.616 × 10⁻⁴⁵ m"],
  },
  {
    question: "What is the Chandrasekhar-Eddington controversy about?",
    correctAnswer: "The debate in the 1930s over whether massive stars could collapse to form black holes, with Eddington opposing Chandrasekhar's correct theoretical prediction",
    distractors: ["A disagreement about the age of the universe", "A debate about whether the universe is expanding or static", "A controversy over the nature of cosmic rays"],
  },
  {
    question: "What is the Stefan-Boltzmann law?",
    correctAnswer: "The total power radiated by a black body per unit area is proportional to the fourth power of its temperature: j = σT⁴",
    distractors: ["The peak wavelength of blackbody radiation is inversely proportional to temperature (Wien's law)", "The spectral radiance of a blackbody follows a specific frequency distribution (Planck's law)", "The total energy of a photon gas is proportional to T³"],
  },
  {
    question: "What is Hawking radiation?",
    correctAnswer: "Thermal radiation predicted to be emitted by black holes due to quantum effects near the event horizon, causing the black hole to slowly lose mass and eventually evaporate",
    distractors: ["Synchrotron radiation from charged particles orbiting a black hole", "The radiation emitted during a supernova that forms a black hole", "Radiation from the accretion disk around a black hole"],
  },
  {
    question: "What is the Penrose singularity theorem?",
    correctAnswer: "Under certain energy conditions, the formation of a trapped surface guarantees the existence of a singularity in the spacetime, proving singularities are generic in general relativity",
    distractors: ["All black holes have the same internal structure", "Singularities are always hidden behind event horizons (cosmic censorship)", "Spacetime is smooth and singularity-free in quantum gravity"],
  },
  {
    question: "What is the cosmological principle?",
    correctAnswer: "The assumption that the universe is homogeneous and isotropic on sufficiently large scales",
    distractors: ["The principle that physical laws are the same everywhere in the universe", "The assumption that the universe had a definite beginning", "The hypothesis that the universe will expand forever"],
  },
  {
    question: "What is nucleocosmochronology?",
    correctAnswer: "The use of radioactive isotope ratios (e.g., uranium, thorium) to estimate the age of the Milky Way and the universe",
    distractors: ["The study of nuclear reactions in the early universe", "The dating of geological samples using carbon-14", "The measurement of cosmic ray flux over time"],
  },
  {
    question: "What is the Einstein ring?",
    correctAnswer: "A circular image of a background source formed when it is exactly aligned with a foreground gravitational lens and the observer",
    distractors: ["The photon sphere around a black hole", "The ring of dust around a protoplanetary disk", "A planetary nebula with a ring-like morphology"],
  },
  {
    question: "What is the Blandford-Znajek process?",
    correctAnswer: "A mechanism for extracting rotational energy from a spinning black hole via magnetic fields threading the event horizon, powering relativistic jets",
    distractors: ["The process of neutron star spin-up by accretion", "The emission of gravitational waves by a binary black hole system", "The thermal radiation from an accretion disk"],
  },
  {
    question: "What is the Comptonization parameter y?",
    correctAnswer: "A dimensionless parameter measuring the total fractional energy change of photons due to repeated Compton scattering in a hot plasma: y = (4kT/m_ec²)·τ for optically thin plasma",
    distractors: ["The ratio of photon to electron number densities", "The optical depth of a plasma to Thomson scattering", "The ratio of radiation pressure to gas pressure"],
  },
  {
    question: "What is the Coulomb barrier in nuclear fusion?",
    correctAnswer: "The electrostatic repulsion between two positively charged nuclei that must be overcome (or tunneled through) for fusion to occur",
    distractors: ["The energy required to remove a nucleon from a nucleus", "The barrier preventing neutron decay inside a stable nucleus", "The magnetic field confining plasma in a tokamak"],
  },
  {
    question: "What is the Alfvén wave?",
    correctAnswer: "A magnetohydrodynamic wave propagating along magnetic field lines in a plasma, with the restoring force provided by magnetic tension",
    distractors: ["An electromagnetic wave in vacuum", "A sound wave in a neutral gas", "A surface wave at the interface of two fluids"],
  },
  {
    question: "What is the Silk damping scale?",
    correctAnswer: "The characteristic scale below which density fluctuations in the early universe are damped by photon diffusion (radiative viscosity) before recombination",
    distractors: ["The scale at which dark matter halos form", "The mean free path of cosmic microwave background photons today", "The horizon size at the time of matter-radiation equality"],
  },
  {
    question: "What is the electron degeneracy pressure?",
    correctAnswer: "The quantum mechanical pressure arising from the Pauli exclusion principle that prevents electrons from occupying the same quantum state, supporting white dwarfs against gravitational collapse",
    distractors: ["The thermal pressure of a hot electron gas", "The radiation pressure from photons in a stellar interior", "The magnetic pressure in a magnetized plasma"],
  },
  {
    question: "What is the CNO cycle?",
    correctAnswer: "A catalytic nuclear fusion cycle using carbon, nitrogen, and oxygen as intermediaries to convert hydrogen to helium, dominant in stars more massive than about 1.3 solar masses",
    distractors: ["The proton-proton chain reaction in the Sun", "The triple-alpha process in red giant cores", "The silicon-burning process in pre-supernova stars"],
  },
  {
    question: "What is the Eddington luminosity for a solar-mass object?",
    correctAnswer: "≈ 3.2 × 10⁴ L☉ (about 1.26 × 10³¹ W)",
    distractors: ["≈ 1 L☉ (the Sun's actual luminosity)", "≈ 10⁶ L☉", "≈ 100 L☉"],
  },
  {
    question: "What is the virial temperature of a galaxy cluster?",
    correctAnswer: "The temperature of the intracluster medium (typically 10⁷-10⁸ K) determined by the gravitational potential well of the cluster via the virial theorem",
    distractors: ["The surface temperature of the brightest cluster galaxy", "The temperature of the cosmic microwave background", "The temperature of the intergalactic medium far from clusters"],
  },
  {
    question: "What is the spin-orbit coupling?",
    correctAnswer: "The interaction between a particle's spin angular momentum and its orbital angular momentum, arising from the relativistic transformation of the electric field into a magnetic field in the particle's rest frame",
    distractors: ["The coupling between two electron spins in a helium atom", "The interaction between nuclear spin and electronic orbital motion (hyperfine)", "The coupling between rotational and vibrational modes of a molecule"],
  },
  {
    question: "What is the Lamb shift's approximate magnitude for the hydrogen 2S₁/₂ level?",
    correctAnswer: "≈ 1057 MHz",
    distractors: ["≈ 10.57 MHz", "≈ 105.7 GHz", "≈ 10.57 kHz"],
  },
  {
    question: "What is the magnetic Reynolds number?",
    correctAnswer: "A dimensionless number estimating the ratio of magnetic advection to magnetic diffusion in a conducting fluid, determining whether magnetic field lines are 'frozen' into the flow",
    distractors: ["The ratio of magnetic pressure to gas pressure (plasma beta)", "The ratio of electric to magnetic energy in an electromagnetic wave", "The ratio of Alfvén speed to sound speed in a plasma"],
  },
  {
    question: "What is the Debye screening length?",
    correctAnswer: "The characteristic distance over which the electric potential of a charge carrier is screened by surrounding mobile charges in a plasma or electrolyte",
    distractors: ["The mean free path of electrons in a conductor", "The penetration depth of an electromagnetic wave into a metal", "The distance between adjacent ions in a crystal lattice"],
  },
  {
    question: "What is the Nordström theory of gravity?",
    correctAnswer: "An early scalar field theory of gravity predating general relativity, in which gravity is mediated by a scalar field rather than spacetime curvature",
    distractors: ["A vector theory of gravity based on electromagnetic analogy", "Einstein's final formulation of general relativity", "A quantum theory of gravity using spin-2 gravitons"],
  },
  {
    question: "What is the London penetration depth?",
    correctAnswer: "The characteristic distance over which an external magnetic field decays exponentially inside a superconductor due to the Meissner effect",
    distractors: ["The depth at which screening currents flow in a normal metal", "The coherence length of Cooper pairs", "The thickness of the insulating barrier in a Josephson junction"],
  },
  {
    question: "What is the de Haas-van Alphen effect?",
    correctAnswer: "Oscillations in the magnetic susceptibility of a metal as a function of applied magnetic field strength at low temperatures, caused by quantized Landau levels crossing the Fermi energy",
    distractors: ["The change of electrical resistance in a magnetic field (magnetoresistance)", "The generation of a voltage perpendicular to current and magnetic field (Hall effect)", "The alignment of magnetic domains in a ferromagnet"],
  },
  {
    question: "What is a Dirac cone in condensed matter physics?",
    correctAnswer: "A conical energy-momentum dispersion relation where energy varies linearly with momentum, as found in graphene and topological surface states",
    distractors: ["A parabolic band structure near the Γ point in a semiconductor", "A flat energy band in a strongly correlated system", "A saddle point in the electronic band structure"],
  },
  {
    question: "What is the Thouless energy?",
    correctAnswer: "The energy scale associated with the diffusion time across a disordered sample: E_Th = ℏD/L², separating diffusive and ergodic regimes of quantum transport",
    distractors: ["The energy gap in a topological insulator", "The activation energy for hopping conduction", "The Fermi energy of a two-dimensional electron gas"],
  },
  {
    question: "What is the Kosterlitz-Thouless transition?",
    correctAnswer: "A phase transition in two-dimensional systems mediated by the binding and unbinding of topological vortex-antivortex pairs, without conventional symmetry breaking",
    distractors: ["A first-order liquid-gas phase transition in 2D", "A metal-insulator transition driven by disorder", "A magnetic transition from ferromagnetic to paramagnetic in 2D"],
  },
  {
    question: "What is the Fermi golden rule?",
    correctAnswer: "A formula giving the transition rate from one quantum state to a continuum of final states: Γ = (2π/ℏ)|⟨f|V|i⟩|²ρ(E_f), in first-order time-dependent perturbation theory",
    distractors: ["The selection rules for electric dipole transitions", "The rule that the Fermi energy lies in the band gap of an insulator", "The condition for resonant tunneling through a double barrier"],
  },
  {
    question: "What is a skyrmion in condensed matter?",
    correctAnswer: "A topologically protected, swirling spin texture in a magnetic material that behaves as a particle-like excitation and cannot be continuously deformed into a uniform state",
    distractors: ["A quantized vortex in a superfluid", "A domain wall between two ferromagnetic regions", "A charge density wave in a metal"],
  },
  {
    question: "What is the Onsager reciprocal relation?",
    correctAnswer: "A fundamental symmetry principle stating that the matrix of linear transport coefficients relating thermodynamic fluxes and forces is symmetric under time reversal",
    distractors: ["The relation between forward and reverse reaction rates at equilibrium", "The reciprocity between electric and magnetic fields in Maxwell's equations", "The symmetry between absorption and emission of radiation"],
  },
  {
    question: "What is the Wiedemann-Franz law's Lorenz number?",
    correctAnswer: "L = κ/(σT) ≈ 2.44 × 10⁻⁸ W·Ω/K², a constant ratio of thermal conductivity to electrical conductivity times temperature for metals",
    distractors: ["≈ 1.38 × 10⁻²³ W·Ω/K²", "≈ 6.02 × 10⁻⁸ W·Ω/K²", "≈ 9.11 × 10⁻⁸ W·Ω/K²"],
  },
  {
    question: "What is the tunneling magnetoresistance (TMR) effect?",
    correctAnswer: "A quantum mechanical effect where the electrical resistance of a magnetic tunnel junction depends on the relative orientation of the magnetizations of two ferromagnetic layers separated by a thin insulator",
    distractors: ["The change in resistance of a bulk ferromagnet in an external field (anisotropic MR)", "The decrease in resistance when magnetic domains align (giant MR)", "The Hall resistance in a ferromagnetic material"],
  },
  {
    question: "What is the Einstein A coefficient?",
    correctAnswer: "The rate of spontaneous emission from an excited atomic state, characterizing the probability per unit time that an atom decays to a lower state by emitting a photon",
    distractors: ["The rate of stimulated absorption of a photon", "The rate of stimulated emission in a laser", "The probability of non-radiative decay"],
  },
  {
    question: "What is the Mott insulator?",
    correctAnswer: "A material that would be metallic according to band theory but is insulating due to strong electron-electron Coulomb repulsion that localizes electrons on individual lattice sites",
    distractors: ["An insulator with a wide band gap like diamond", "A semiconductor doped below the critical carrier concentration", "An Anderson insulator where disorder localizes electrons"],
  },
  {
    question: "What is the Berezinskii-Kosterlitz-Thouless (BKT) transition temperature characterized by?",
    correctAnswer: "A universal jump in the superfluid density at the transition, and the absence of conventional long-range order even below the transition in 2D",
    distractors: ["A discontinuity in the specific heat capacity", "The appearance of a spontaneous magnetization", "A divergence of the correlation length following mean-field theory"],
  },
  {
    question: "What is the Keldysh formalism?",
    correctAnswer: "A non-equilibrium Green's function technique for describing quantum systems driven out of equilibrium, using a doubled time contour",
    distractors: ["A real-time path integral for finite-temperature field theory", "A perturbation theory for weakly interacting bosons", "A variational method for ground-state energy calculations"],
  },
  {
    question: "What is the photon sphere of a Schwarzschild black hole?",
    correctAnswer: "A spherical surface at r = 3GM/c² (1.5 times the Schwarzschild radius) where photons can orbit the black hole on unstable circular orbits",
    distractors: ["The event horizon at r = 2GM/c²", "The innermost stable circular orbit at r = 6GM/c²", "The ergosphere boundary of a Kerr black hole"],
  },
  {
    question: "What is the Sachdev-Ye-Kitaev model's maximal Lyapunov exponent?",
    correctAnswer: "λ_L = 2πk_BT/ℏ, saturating the Maldacena-Shenker-Stanford bound on quantum chaos, matching the behavior of black holes in holographic theories",
    distractors: ["λ_L = 0, indicating integrability", "λ_L = πk_BT/ℏ, half the black hole value", "λ_L = k_BT/ℏ, the thermal rate"],
  },
  {
    question: "What is the Pancharatnam-Berry phase?",
    correctAnswer: "A geometric phase acquired by a light wave when its polarization state is cycled through a closed path on the Poincaré sphere, the optical analog of the Berry phase",
    distractors: ["The phase shift between orthogonal polarizations in a birefringent crystal", "The phase accumulated by a photon traveling through a dispersive medium", "The Gouy phase of a focused Gaussian beam"],
  },
  {
    question: "What is the Chandrasekhar-Kendall function?",
    correctAnswer: "A scalar function used to represent force-free magnetic fields in astrophysical plasmas, simplifying the magnetohydrostatic equilibrium equations",
    distractors: ["A function describing the mass distribution inside a white dwarf", "A potential function for gravitational interactions between three bodies", "A distribution function for stellar velocities in a galaxy"],
  },
  {
    question: "What is the quantum spin Hall effect?",
    correctAnswer: "A topological effect in 2D systems where spin-orbit coupling creates helical edge states with opposite spins propagating in opposite directions, without an external magnetic field",
    distractors: ["The spin accumulation at edges of a conductor due to the classical spin Hall effect", "The quantization of spin in a magnetic field (Stern-Gerlach experiment)", "The splitting of the Hall resistance into spin-up and spin-down components in a strong field"],
  },
  {
    question: "What is the Gross-Neveu model?",
    correctAnswer: "A quantum field theory of N interacting Dirac fermions in 1+1 dimensions with a four-fermion interaction, exhibiting asymptotic freedom and dynamical mass generation",
    distractors: ["A lattice model for interacting spins in two dimensions", "A string theory model with fermions on the worldsheet", "A supersymmetric gauge theory in four dimensions"],
  },
  {
    question: "What is the Hagedorn temperature?",
    correctAnswer: "The temperature at which the partition function of a system with an exponentially growing density of states (such as a hadron gas or strings) diverges, interpreted as a phase transition temperature",
    distractors: ["The temperature of the quark-gluon plasma", "The temperature at the center of the Sun", "The Planck temperature (highest possible temperature)"],
  },
];
