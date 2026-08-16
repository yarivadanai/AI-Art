#!/usr/bin/env python3
"""
Phase 3 T1 rebuild (2026-08-16): within-item distractors.

The three T1 families grammar-violation, cognitive-stack and expert-trap used
distractors drawn from OTHER items of the same family, so a visitor could pick
the answer by topic overlap alone (~85% by lexical shortcut in the audit).
This script replaces every option list of those 75 items with four options
authored for THAT item: the correct diagnosis plus three plausible-but-wrong
diagnoses of the same sentence / passage. Stems are unchanged.

  grammar-violation : each option names a specific edit to the sentence shown
  cognitive-stack   : options are the other referents / readings / orders of
                      the same sentence
  expert-trap       : options are same-topic corrections that are themselves
                      wrong (affirm the misconception, half-correct it, or
                      over-correct it)

Options are shuffled deterministically per item (seed = item id) so the
correct index varies; _verifiedAnswer is set to the new index. Time limits:
grammar-violation and expert-trap move to 45 s (a sentence or passage plus
four anchored options); cognitive-stack stays at 30 s.

Drafted by an LLM at build time, to be hand-reviewed and then locked by the
hash roundtrip test. Hashes are not computed here: the script edits the JSON
and then runs `npx tsx scripts/rehash_dataset.ts`. Idempotent.
"""

import json
import random
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PATH = ROOT / "lib" / "data" / "scca_master_dataset.json"

# id -> [correct, distractor, distractor, distractor]
REBUILD = {
    # ── grammar-violation (signal-detection T1) ───────────────────────────
    "signal-detection-t1-grammar-violation-0101": [
        "'represent' should be 'represents': the subject is the singular 'specimen', separated from its verb by the 'which' clause (subject-verb agreement).",
        "'which' should be 'that': the clause about the decade of study is restrictive.",
        "'had been studying' should be 'have been studying' to match the present tense of 'represent'.",
        "'The paleontologist's assertion' is a misplaced possessive; it should read 'the assertion of the paleontologist'.",
    ],
    "signal-detection-t1-grammar-violation-0102": [
        "'was to reconsider' should be 'were to reconsider': a hypothetical if-clause takes the subjunctive.",
        "'might still hold together' should be 'might still have held together' (sequence of tenses after a past if-clause).",
        "'her position on the amendment' is ambiguous about whose position (faulty pronoun reference).",
        "'through the vote' is misplaced; it must directly follow 'coalition'.",
    ],
    "signal-detection-t1-grammar-violation-0103": [
        "'was given' should be 'be given': 'insisted that' introducing a demand takes the mandative subjunctive.",
        "'commenced' should be 'had commenced': the earlier of two past events needs the past perfect.",
        "'his client' has no clear antecedent (faulty pronoun reference).",
        "'access to' should be 'access of' (wrong preposition).",
    ],
    "signal-detection-t1-grammar-violation-0104": [
        "'registers' should be 'register': 'it is essential that' takes the mandative subjunctive.",
        "'their equipment' disagrees in number with 'every participant'; it must be 'his or her equipment'.",
        "'departs' should be 'will depart' (future reference in the time clause).",
        "'no later than forty-eight hours before' is a dangling comparative with nothing to compare.",
    ],
    "signal-detection-t1-grammar-violation-0105": [
        "'was controlled' should be 'be controlled': 'insisted that' introducing a demand takes the mandative subjunctive.",
        "'Had the researchers not insisted' is nonstandard; formal prose requires 'If the researchers had not insisted'.",
        "'would have rejected' should be 'would reject' (sequence of tenses).",
        "'each variable' takes a plural verb: 'were controlled'.",
    ],
    "signal-detection-t1-grammar-violation-0106": [
        "'If I was' should be 'If I were': a counterfactual if-clause takes the subjunctive.",
        "'would consolidate' should be 'will consolidate' (mixed conditional).",
        "'the three overlapping divisions' should be 'the three divisions that overlap' (participial adjective misuse).",
        "'into a single operational unit' is a misplaced modifier; it must precede 'consolidate'.",
    ],
    "signal-detection-t1-grammar-violation-0107": [
        "'surrenders' and 'reports' should be 'surrender' and 'report': 'demanded that' takes the mandative subjunctive.",
        "'and reports' breaks parallelism with 'surrenders'; it should be 'and reporting'.",
        "'every Monday without exception' dangles; it must be moved next to 'demanded'.",
        "'demanded that' should be 'demanded for' (wrong preposition after 'demand').",
    ],
    "signal-detection-t1-grammar-violation-0108": [
        "'are to present' does not agree with the singular 'each'; it should be 'is to present' (or the subjunctive 'be to present' after 'recommended that').",
        "'who have submitted' should be 'who has submitted' to agree with 'each'.",
        "'their dissertations' should be 'his or her dissertation' (pronoun agreement with 'each').",
        "'before the full faculty' should be 'in front of the full faculty' (wrong preposition).",
    ],
    "signal-detection-t1-grammar-violation-0109": [
        "'submits' should be 'submit': 'stipulated that' takes the mandative subjunctive.",
        "'each graduate student' should be 'every graduate student' after 'stipulated'.",
        "'by the end of the fall semester' is misplaced; it modifies 'stipulated' rather than 'submits'.",
        "'stipulated' should be 'stipulates' (sequence of tenses with 'submits').",
    ],
    "signal-detection-t1-grammar-violation-0110": [
        "'provides' should be 'provide': 'insists that' introducing a requirement takes the mandative subjunctive.",
        "'Were it not for' is nonstandard inversion; it should be 'If it were not for'.",
        "'would be' should be 'will be' (mixed conditional).",
        "'insists' should be 'insisted' to match the past subjunctive 'were'.",
    ],
    "signal-detection-t1-grammar-violation-0111": [
        "'includes' should be 'include': 'proposed that' takes the mandative subjunctive.",
        "'a more comprehensive literature review and a clearer methodological framework' is faulty parallelism (mixed comparative forms).",
        "'the revised manuscript' dangles: it does not say who revised it.",
        "'proposed that' should be 'proposed for' (wrong preposition).",
    ],
    "signal-detection-t1-grammar-violation-0112": [
        "'was to accept' should be 'were to accept': a hypothetical if-clause takes the subjunctive.",
        "'far exceeds' should be 'far exceeded' (sequence of tenses).",
        "'where the cost of living' should be 'in which the cost of living' (relative adverb misuse).",
        "'would need to relocate' should be 'will need to relocate' (mixed conditional).",
    ],
    "signal-detection-t1-grammar-violation-0113": [
        "'attends' should be 'attend': 'requested that' takes the mandative subjunctive.",
        "'but scheduling conflicts made this impossible' is a comma splice.",
        "'this' has no clear antecedent (vague pronoun reference).",
        "'in Geneva' is misplaced; it modifies 'requested' rather than 'session'.",
    ],
    "signal-detection-t1-grammar-violation-0114": [
        "'was' should be 'were': a wish about a present unreality takes the subjunctive.",
        "'have plagued' should be 'has plagued' to agree with 'administration'.",
        "'for the last three fiscal years' should be 'since three fiscal years'.",
        "'forthcoming about' should be 'forthcoming on' (wrong preposition).",
    ],
    "signal-detection-t1-grammar-violation-0115": [
        "'reviews' should be 'review': 'it is imperative that' takes the mandative subjunctive.",
        "'pours' should be 'will pour' (future reference in the time clause).",
        "A comma is required after 'imperative' before the that-clause.",
        "'structural integrity calculations' is an illegal noun stack; it must be 'calculations of structural integrity'.",
    ],
    "signal-detection-t1-grammar-violation-0116": [
        "'Having been revised extensively...' dangles: it attaches to 'the editorial board' but describes the manuscript.",
        "'finally' is misplaced; it must precede 'the editorial board'.",
        "'over the course of several months' is redundant, which is a grammatical error.",
        "'for publication in the spring issue' dangles; it has no noun to modify.",
    ],
    "signal-detection-t1-grammar-violation-0117": [
        "'Exhausted from the twelve-hour surgery...' dangles: it attaches to 'the patient's family' but describes the surgeon.",
        "'was reassured' should be 'were reassured' because 'family' is plural.",
        "The passive 'was reassured by' is ungrammatical and must be recast in the active voice.",
        "'in the waiting room' is misplaced; it modifies 'surgeon' rather than 'reassured'.",
    ],
    "signal-detection-t1-grammar-violation-0118": [
        "'While analyzing the spectroscopic data...' dangles: the anomaly did not do the analyzing; the research team did.",
        "'previously undetected' is redundant with 'anomaly'.",
        "'became apparent to' should be 'became apparent for' (wrong preposition).",
        "'over the previous decade' should be 'in the previous decade'.",
    ],
    "signal-detection-t1-grammar-violation-0119": [
        "'Born into poverty... and largely self-educated' dangles: it attaches to 'the literary critics' but describes the novelist.",
        "'largely self-educated' breaks parallelism with 'born into poverty' (participle versus adjective).",
        "'were astonished by' should be 'were astonished at' (wrong preposition).",
        "'sophisticated' is misplaced; it should modify 'novelist', not 'command'.",
    ],
    "signal-detection-t1-grammar-violation-0120": [
        "'To fully appreciate the complexity...' dangles: the sentence never names who is to appreciate it ('a thorough understanding' cannot).",
        "'To fully appreciate' is a split infinitive and must be 'fully to appreciate'.",
        "'is required' should be 'are required' to agree with 'quartets'.",
        "'before any meaningful analysis can proceed' should be 'before any meaningful analysis proceeds'.",
    ],
    "signal-detection-t1-grammar-violation-0121": [
        "'After spending nearly a decade conducting fieldwork...' dangles: it attaches to 'the ethnographic findings', which did no fieldwork.",
        "'among indigenous communities' should be 'between indigenous communities'.",
        "'that received widespread acclaim' should be 'which received widespread acclaim'.",
        "'were published' should be 'was published' because 'findings' is a single body of work.",
    ],
    "signal-detection-t1-grammar-violation-0122": [
        "'Peering through the electron microscope...' dangles: it attaches to 'the crystalline structure', which was not peering.",
        "'revealed itself' is an improper reflexive; it must be 'was revealed'.",
        "'exceeding fifty thousand times' should be 'exceeding fifty thousand-fold' (wrong unit expression).",
        "'newly synthesized' requires a hyphen as a compound modifier.",
    ],
    "signal-detection-t1-grammar-violation-0123": [
        "'Although widely regarded as one of the foremost authorities...' dangles: it attaches to 'the university' but describes Professor Harrington.",
        "'denied Professor Harrington tenure' has the objects in the wrong order; it must be 'denied tenure Professor Harrington'.",
        "'for the third consecutive time' should be 'for the third time consecutively'.",
        "'medieval Provencal literature' requires a capital 'Medieval'.",
    ],
    "signal-detection-t1-grammar-violation-0124": [
        "'wearing a tailored navy suit and a confident smile' is misplaced: as positioned it modifies 'the quarterly earnings report' rather than 'the CEO'.",
        "'a tailored navy suit and a confident smile' yokes unlike objects to 'wearing' and is therefore faulty parallelism.",
        "'the quarterly earnings report' should be 'the quarter's earnings report'.",
        "'announced' requires a preposition: 'announced about the quarterly earnings report'.",
    ],
    "signal-detection-t1-grammar-violation-0125": [
        "'only' is misplaced: as positioned it limits 'reviewed' (she did nothing but review); it should limit 'the first three chapters'.",
        "'had reviewed' should be 'reviewed': the past perfect cannot follow 'told'.",
        "'that' must be omitted after 'told the committee'.",
        "'before the defense began' should be 'before the defense had begun'.",
    ],
    # ── cognitive-stack (state-tracking T1) ─────────────────────────────
    "state-tracking-t1-cognitive-stack-0026": ["the student", "the professor", "the dean", "nobody: the sentence is ungrammatical"],
    "state-tracking-t1-cognitive-stack-0027": ["barked", "chased", "bit", "attracted"],
    "state-tracking-t1-cognitive-stack-0028": ["the analyst", "the manager", "the CEO", "the analyst and the manager jointly"],
    "state-tracking-t1-cognitive-stack-0029": ["the singer", "the producer", "the label", "the producer and the singer jointly"],
    "state-tracking-t1-cognitive-stack-0030": ["the diplomat", "the ambassador", "the president", "the ambassador and the diplomat jointly"],
    "state-tracking-t1-cognitive-stack-0031": ["the baker", "the chef", "the restaurant", "the chef and the baker jointly"],
    "state-tracking-t1-cognitive-stack-0032": ["the scientist", "the mentor", "the university", "the mentor and the scientist jointly"],
    "state-tracking-t1-cognitive-stack-0033": ["the engineer", "the architect", "the city", "the architect and the engineer jointly"],
    "state-tracking-t1-cognitive-stack-0034": ["the writer", "the editor", "the publisher", "the editor and the writer jointly"],
    "state-tracking-t1-cognitive-stack-0035": ["the intern", "the lead", "the CTO", "the board"],
    "state-tracking-t1-cognitive-stack-0036": [
        "Not every student solved every problem",
        "No student solved any problem",
        "Every student solved none of the problems",
        "Every student solved at least one problem but not all of them",
    ],
    "state-tracking-t1-cognitive-stack-0037": [
        "Each patient was examined by some doctor, possibly a different one",
        "One particular doctor examined all the patients",
        "Every doctor examined every patient",
        "Some patient was examined by every doctor",
    ],
    "state-tracking-t1-cognitive-stack-0038": [
        "The reading where 'someone' takes wide scope claims a single person loves everyone",
        "The reading where 'everyone' takes wide scope claims a single person loves everyone",
        "Both readings claim a single universal lover; they differ only in emphasis",
        "Neither reading claims a single lover; the sentence only says everyone is loved by someone",
    ],
    "state-tracking-t1-cognitive-stack-0039": ["10", "2", "5", "7"],
    "state-tracking-t1-cognitive-stack-0040": [
        "There are two specific languages that every linguist speaks",
        "Each linguist speaks two languages, possibly a different pair for each linguist",
        "The linguists together speak exactly two languages",
        "Two linguists speak every language",
    ],
    "state-tracking-t1-cognitive-stack-0041": [
        "Two readings. The reading where 'most students' takes wide scope suggests students are generally poor readers.",
        "Two readings. The reading where 'few books' takes wide scope suggests students are generally poor readers.",
        "One reading only; 'most' and 'few' do not interact in scope.",
        "Three readings; only the collective reading suggests students are poor readers.",
    ],
    "state-tracking-t1-cognitive-stack-0042": ["No", "Yes", "Only if the room holds fewer than two people", "The sentence has no narrow-scope reading"],
    "state-tracking-t1-cognitive-stack-0043": [
        "Each question was answered by a distinct student; no two questions share the same student",
        "One student, different from the others, answered all the questions",
        "Each student answered exactly one question, but two students may share a question",
        "The questions were answered by students of different kinds",
    ],
    "state-tracking-t1-cognitive-stack-0044": [
        "Treaty signed → treaty annulled → war started",
        "War started → treaty signed → treaty annulled",
        "Treaty signed → war started → treaty annulled",
        "Treaty annulled → treaty signed → war started",
    ],
    "state-tracking-t1-cognitive-stack-0045": [
        "He should have packed → she should remind him → he leaves",
        "She should remind him → he should have packed → he leaves",
        "He leaves → she should remind him → he should have packed",
        "She should remind him → he leaves → he should have packed",
    ],
    "state-tracking-t1-cognitive-stack-0046": [
        "The cover-up began before the crime it was covering up was committed",
        "The statute of limitations expired before the crime was committed",
        "The investigation began before the cover-up did",
        "The crime was committed after the investigation revealed it",
    ],
    "state-tracking-t1-cognitive-stack-0047": ["3", "1", "2", "4"],
    "state-tracking-t1-cognitive-stack-0048": [
        "Theft → hiding → discovery of forgery → confession",
        "Theft → confession → hiding → discovery of forgery",
        "Hiding → theft → discovery of forgery → confession",
        "Theft → hiding → confession → discovery of forgery",
    ],
    "state-tracking-t1-cognitive-stack-0049": [
        "If she never told him, there would be nothing for her to later remind him about, making the condition self-defeating",
        "He cannot forget something he was explicitly told not to forget",
        "She cannot know in advance what he will forget, so the sentence is meaningless",
        "The reminder would have to occur before the telling, which is impossible",
    ],
    "state-tracking-t1-cognitive-stack-0050": [
        "Email sent → memo drafted → meeting held → memo written",
        "Email sent → meeting held → memo drafted → memo written",
        "Memo drafted → email sent → meeting held → memo written",
        "Meeting held → email sent → memo drafted → memo written",
    ],
    # ── expert-trap (probabilistic T1) ─────────────────────────────────────
    "probabilistic-t1-expert-trap-0126": [
        "The uncertainty principle is not about measurement disturbance. It is an intrinsic property of quantum systems arising from the wave nature of matter; conjugate variables like position and momentum cannot simultaneously have precise values regardless of measurement.",
        "The passage is right that instruments cause collapse but wrong about uncertainty: the principle applies only to position and momentum, never to energy and time.",
        "Measurement does not collapse anything; the wavefunction is a bookkeeping device with no physical consequences, so both claims are meaningless.",
        "The error is one of degree: with sufficiently gentle instruments (weak measurement) both the collapse and the uncertainty can be avoided entirely.",
    ],
    "probabilistic-t1-expert-trap-0127": [
        "Evolution has no direction, goal, or 'need.' Natural selection acts on individuals, not species. 'Fitness' means reproductive success, not strength. Complexity does not always increase; parasites often evolve toward simplicity.",
        "The passage is essentially correct; its only error is calling fitness 'survival' when it means strength and speed, the traits selection maximizes.",
        "Species do not evolve to adapt; individuals adapt by learning during their lifetimes and pass the improvements to their offspring.",
        "The error is the claim about complexity: evolution always increases complexity, but it does so for the good of the species rather than the individual.",
    ],
    "probabilistic-t1-expert-trap-0128": [
        "Gold has no intrinsic value as money; its value is also based on social convention. The gold standard was abandoned because it constrained monetary policy, causing deflationary spirals and deepening recessions. Fiat currencies are not inherently less stable.",
        "Governments did run out of gold; the error is calling fiat money unstable, since fiat currencies cannot lose value once a central bank exists.",
        "The passage is correct that gold-backed money is more stable; the error is that the standard was abandoned by accident during wartime, not by choice.",
        "Gold has intrinsic value as money because it is scarce; the error is that the gold standard was never abandoned, only suspended.",
    ],
    "probabilistic-t1-expert-trap-0129": [
        "Quantum computers threaten specific algorithms (RSA, ECC) via Shor's algorithm, not all encryption. Symmetric encryption and lattice-based cryptography are believed to be quantum-resistant. Quantum computers don't 'try all keys simultaneously.'",
        "Quantum computers do try all keys simultaneously; the error is that they threaten only symmetric ciphers like AES, while RSA is safe because factoring is hard.",
        "The passage is correct except that large-scale quantum computers already exist, so classical encryption is already obsolete.",
        "Quantum computers threaten no encryption at all, because measurement collapses the superposition before any key can be read out.",
    ],
    "probabilistic-t1-expert-trap-0130": [
        "The SPE has been largely discredited. Guards were coached and encouraged by the experimenters. The results were not replicated. Demand characteristics, selection bias, and experimenter influence explain the behavior better than situational determinism.",
        "The experiment was rigorous and has been replicated many times; its only flaw is that it used students rather than real prisoners and guards.",
        "The passage is right that the situation transformed the guards; the error is that the participants were prison guards by profession, not volunteers.",
        "The SPE proved the opposite: people resist cruelty even under pressure, which is why it was stopped early.",
    ],
    "probabilistic-t1-expert-trap-0131": [
        "Relativistic mass is a deprecated concept. The modern understanding uses invariant (rest) mass, which does not change. The speed limit arises from the geometry of spacetime: not from mass increase but from the fact that spacetime intervals become spacelike beyond c.",
        "The passage is correct: relativistic mass grows toward infinity, which is why photons, being massless, are the only things that can reach c.",
        "The speed limit exists only because light is the fastest thing yet observed; the error is that mass decreases near c, releasing energy.",
        "The error is the claim that nothing exceeds light speed: quantum entanglement transmits information faster than light, so the limit holds only for massive objects.",
    ],
    "probabilistic-t1-expert-trap-0132": [
        "DNA is not a blueprint; it's more like a recipe with context-dependent interpretation. Most traits are polygenic and influenced by environment (epigenetics). Many DNA sequences are regulatory, not protein-coding. Single genes rarely determine complex traits.",
        "DNA is a blueprint; the error is that the Human Genome Project mapped only protein-coding genes, which are the only part of DNA that matters.",
        "Each gene codes for one protein; the error is that personality has no genetic component at all, being entirely environmental.",
        "The passage is correct except that DNA does not determine eye color, which is set by the environment during infancy.",
    ],
    "probabilistic-t1-expert-trap-0133": [
        "Gödel's theorems apply to formal axiomatic systems of sufficient strength, not to 'mathematics' broadly. They show such systems cannot be both complete and consistent, not that math is 'flawed.' Mathematicians work productively with incomplete systems.",
        "Gödel showed that arithmetic is inconsistent, so mathematics really is unreliable; the error is calling them 'incompleteness' theorems.",
        "The theorems apply to all reasoning, including physics and everyday logic, so the passage understates the problem.",
        "The passage is correct in substance; the only error is that Gödel's theorems apply to every formal system, including ones as weak as propositional logic.",
    ],
    "probabilistic-t1-expert-trap-0134": [
        "The greenhouse effect is natural and essential for life: without it, Earth would be about -18°C. The concern is the enhanced greenhouse effect from additional anthropogenic CO₂. The 'blanket' analogy is misleading; greenhouse gases re-radiate infrared, they don't 'trap' heat.",
        "The passage is right that the greenhouse effect is modern and harmful; the error is that CO₂ is not a greenhouse gas, water vapour is the only one.",
        "The greenhouse effect is entirely natural, so human CO₂ emissions cannot change the climate; the error is attributing warming to industry.",
        "The greenhouse effect is real but negligible; the error is that Earth's temperature is set almost entirely by the sun's variability.",
    ],
    "probabilistic-t1-expert-trap-0135": [
        "A p-value is the probability of seeing data this extreme IF the null hypothesis is true, not the probability the null is true. P-values do not measure effect probability. Replication with p < 0.05 doesn't multiply confidence the way described.",
        "A p-value of 0.05 does mean a 5% chance the result is due to chance; the error is that replication with p < 0.05 adds no confidence at all.",
        "A p-value is the probability that the hypothesis is false; the error is that two replications only establish the effect if both are below 0.01.",
        "The passage is correct; the only error is that a p-value below 0.05 also tells you the effect is large enough to matter.",
    ],
    "probabilistic-t1-expert-trap-0136": [
        "All human languages are equally complex and expressive; there are no 'primitive' languages. Ancient languages like Sanskrit, Latin, and Classical Chinese had highly complex grammars. Languages change over time but do not 'progress' linearly.",
        "Languages do progress from primitive to complex; the error is that English is not the most evolved, since Latin has more grammatical cases.",
        "Ancient languages did have simpler grammars; the error is that modern languages have fewer words, not more.",
        "All languages started equally complex, but modern languages have simplified, so English is actually the least evolved.",
    ],
    "probabilistic-t1-expert-trap-0137": [
        "The computer metaphor is limited. Brains are not digital; neurons have analog properties, chemical signaling, dendritic computation, and neuroplasticity with no clear hardware/software distinction. Consciousness is not known to be substrate-independent.",
        "The brain is a digital computer; the error is that neurons are like memory cells, not transistors, and consciousness comes from clock speed.",
        "The metaphor is exact and mind uploading is already possible; the error is only that silicon is currently too slow.",
        "Neurons are not like transistors because they compute with quantum effects; consciousness arises from quantum coherence in microtubules.",
    ],
    "probabilistic-t1-expert-trap-0138": [
        "Many antibiotics don't 'poison' bacteria; they interfere with specific processes like cell wall synthesis or protein synthesis (ribosomal translation). Stopping early promotes resistance by killing susceptible bacteria while letting partially resistant ones survive. Bacteria don't become 'immune.'",
        "Antibiotics do poison bacteria; the error is that stopping early is fine because resistance is caused by antibiotics in farming, not by patients.",
        "Bacteria do become immune to antibiotics through their immune systems; the error is that antibiotics work by boosting the human immune response.",
        "The passage is correct except that resistance is impossible for bacteria; only viruses evolve drug resistance.",
    ],
    "probabilistic-t1-expert-trap-0139": [
        "The legal standard is 'not guilty,' not 'innocent'; the court doesn't declare innocence. 'Beyond a reasonable doubt' does not mean 100% certainty; it means no reasonable person would doubt the conclusion based on the evidence presented.",
        "Defendants are legally declared innocent when acquitted; the error is that the criminal standard is 'preponderance of the evidence', not 'beyond a reasonable doubt'.",
        "'Beyond a reasonable doubt' does mean 100% certainty; the error is that the burden falls on the defence, not the prosecution.",
        "The passage is correct; the only error is that the standard applies in civil trials as well as criminal ones.",
    ],
    "probabilistic-t1-expert-trap-0140": [
        "Ecosystems are not inherently balanced or equilibrium-seeking. They are dynamic, non-linear systems that can shift between multiple stable states. Some perturbations cause irreversible regime shifts. The 'balance of nature' is a myth.",
        "Ecosystems are balanced; the error is that removing a species never matters because another species always fills its role.",
        "Ecosystems always return to their natural state; the error is that this takes millennia rather than decades.",
        "The passage is correct except that species have no roles; ecosystems are random collections that reach equilibrium by chance.",
    ],
    "probabilistic-t1-expert-trap-0141": [
        "Atoms don't 'want' anything; bonding minimizes energy. The octet rule is a useful heuristic but has many exceptions (BF₃, SF₆, NO, free radicals). Ionic bonding exists on a spectrum with covalent bonding. 'Complete transfer' is an idealization.",
        "Atoms do want a full outer shell; the error is that the octet rule has no exceptions once transition metals are excluded.",
        "The passage is correct except that covalent bonds involve complete transfer and ionic bonds equal sharing; the definitions are swapped.",
        "The octet rule is exact for every stable molecule; the error is that bonds form to maximize energy, not to fill shells.",
    ],
    "probabilistic-t1-expert-trap-0142": [
        "Neural networks are loosely inspired by brains but operate very differently: backpropagation has no known biological analog. 'Enough data' doesn't overcome fundamental limitations (no free lunch theorem). Whether LLMs 'understand' language is deeply contested.",
        "Neural networks are accurate models of the brain because backpropagation is how neurons learn; the error is only that data alone is not enough, compute matters too.",
        "The passage is correct except that LLMs understand language better than humans, not merely faster.",
        "Deep learning does not mimic the brain at all; the error is that GPT-style models are rule-based expert systems, not neural networks.",
    ],
    "probabilistic-t1-expert-trap-0143": [
        "The 'Dark Ages' is a misleading term rejected by modern historians. The early medieval period saw significant innovation (heavy plow, horse collar, three-field rotation, Gothic architecture, universities). Knowledge was preserved and advanced in monasteries.",
        "The Dark Ages were a period of total regression; the error is that the Renaissance began in Germany, not Italy, and rescued Europe a century earlier.",
        "The passage is correct except that Europe was ahead of the rest of the world throughout the period.",
        "The Dark Ages saw no innovation; the error is that knowledge was preserved by universities, which the monasteries opposed.",
    ],
    "probabilistic-t1-expert-trap-0144": [
        "The second law applies to closed systems, and a room is not closed (you expend energy to clean it). 'Disorder' is a misleading gloss on entropy; it's about microstates, not messiness. Life doesn't violate the second law; it increases total entropy while locally decreasing it.",
        "Entropy is disorder and cleaning a room really does decrease it, so the second law holds only on average over many rooms.",
        "Life does violate the second law; the error is that a messy room is a low-entropy state, not a high one.",
        "The second law applies to open systems only; the passage errs by treating the room as closed.",
    ],
    "probabilistic-t1-expert-trap-0145": [
        "The US is a constitutional republic with representative democracy, not a direct democracy. 'Majority rules' ignores constitutional protections of minority rights. Democracies don't always produce better outcomes; Arrow's impossibility theorem shows no voting system perfectly aggregates preferences.",
        "The US is a direct democracy where citizens vote on all issues; the error is the claim that democracies always produce better outcomes.",
        "Majority rule is the definition of democracy and admits no minority protections; the error is that the US is not a democracy at all.",
        "The passage is correct; the only error is that Arrow's theorem proves democracy always produces the best outcome.",
    ],
    "probabilistic-t1-expert-trap-0146": [
        "Fat doesn't uniquely cause weight gain; total energy balance and hormonal responses matter. Dietary cholesterol has minimal impact on blood cholesterol for most people. Calorie sources differ in satiety, thermic effect, and metabolic pathways.",
        "Fat does make you fat because it is stored directly; the error is that dietary cholesterol has no relation to heart disease whatsoever, so eating it freely is safe.",
        "A calorie is a calorie; the error is that protein has more calories per gram than fat.",
        "The passage is correct except that dietary cholesterol raises blood cholesterol only in vegetarians.",
    ],
    "probabilistic-t1-expert-trap-0147": [
        "Water is intrinsically blue due to selective absorption of red wavelengths by O-H bond vibrations. The ocean's color is primarily from absorption, not sky reflection. Deep water appears darker because red light is absorbed at shallow depths, leaving only blue.",
        "The ocean does reflect the sky; the error is that deep water looks darker because there is less sky to reflect at depth.",
        "Water is intrinsically blue because it scatters blue light the way the sky does (Rayleigh scattering); the only error is the reflection claim.",
        "The ocean is blue because of dissolved salt; fresh water is colorless, which is why lakes look grey.",
    ],
    "probabilistic-t1-expert-trap-0148": [
        "Electrons drift extremely slowly (millimeters per second). What propagates at near light speed is the electromagnetic field/wave that guides the energy. The water-pipe analogy breaks down because energy is carried in the fields outside the wire, not by the electrons inside it.",
        "Electrons do travel near light speed; the error is that they slow down inside the house wiring, which is why bulbs warm up.",
        "The water-pipe analogy is exact; the error is that the light turns on with a delay proportional to the distance from the plant.",
        "Electrons do not move at all in a circuit; energy is carried by protons in the wire, which is why copper is used.",
    ],
    "probabilistic-t1-expert-trap-0149": [
        "Social evolution is not linear or progressive. Many societies deliberately chose foraging over agriculture. Agricultural societies often had worse nutrition, health, and equality. Complexity can decrease, and some cultures oscillated between modes of subsistence.",
        "Societies do progress linearly; the error is that hunter-gatherers were not 'stuck' but waiting, because agriculture had not yet been invented anywhere.",
        "The passage is correct except that agricultural societies had better nutrition and health, which is why the transition was universal.",
        "Social evolution is linear but runs the other way: civilizations degrade into agriculture and then into foraging.",
    ],
    "probabilistic-t1-expert-trap-0150": [
        "Many drugs work as antagonists (blocking receptors), not agonists. Dose-response curves plateau and can even show paradoxical effects at high doses (hormesis). Tolerance involves receptor downregulation, desensitization, and neuroadaptation, not just faster metabolism.",
        "All drugs are agonists that activate receptors; the error is that tolerance is purely psychological.",
        "A higher dose always produces a stronger effect; the error is that tolerance is caused by receptor upregulation, not faster metabolism.",
        "The passage is correct except that tolerance never occurs for receptor-acting drugs, only for enzyme-acting ones.",
    ],
}

TIME_LIMITS = {"grammar-violation": 45, "expert-trap": 45, "cognitive-stack": 30}


def shuffled(options, seed):
    rng = random.Random(seed)
    order = list(range(len(options)))
    rng.shuffle(order)
    return [options[i] for i in order], order.index(0)


def main():
    data = json.loads(PATH.read_text())
    by_id = {q["id"]: q for q in data}
    missing = [i for i in REBUILD if i not in by_id]
    if missing:
        print("unknown ids:", missing, file=sys.stderr)
        sys.exit(1)
    changed = 0
    for qid, opts in REBUILD.items():
        q = by_id[qid]
        assert q["tier"] == 1 and q["inputType"] == "multiple-choice", qid
        assert len(opts) == 4 and len(set(opts)) == 4, qid
        options, idx = shuffled(opts, qid)
        want = {"options": options, "_verifiedAnswer": str(idx), "timeLimit": TIME_LIMITS[q["subtype"]]}
        if any(q.get(k) != v for k, v in want.items()):
            q.update(want)
            changed += 1
    PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
    print(f"rebuilt {len(REBUILD)} items ({changed} changed)")
    print("running scripts/rehash_dataset.ts ...")
    r = subprocess.run(["npx", "tsx", "scripts/rehash_dataset.ts"], cwd=ROOT)
    if r.returncode != 0:
        print("rehash failed; hashes may be stale", file=sys.stderr)
        sys.exit(r.returncode)


if __name__ == "__main__":
    main()
