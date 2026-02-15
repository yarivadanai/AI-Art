import type { GrammarItem } from "./grammar";

export const GRAMMAR_ITEMS_EXT_2: GrammarItem[] = [
  // ============================================================
  // FUSED (RUN-ON) SENTENCES (1–20)
  // ============================================================
  {
    sentence: "The ambassador refused to sign the treaty the delegation returned home without reaching any agreement on the disputed territories.",
    violation: "Run-on sentence (fused sentence)",
    distractors: ["Comma splice", "Tense inconsistency", "Dangling modifier"],
  },
  {
    sentence: "The laboratory results confirmed the hypothesis the researchers celebrated by submitting their findings to the most prestigious journal in the field.",
    violation: "Run-on sentence (fused sentence)",
    distractors: ["Comma splice", "Subject-verb disagreement", "Pronoun-antecedent disagreement"],
  },
  {
    sentence: "The bridge had been declared structurally unsound years ago the city continued to allow heavy commercial traffic to cross it daily.",
    violation: "Run-on sentence (fused sentence)",
    distractors: ["Comma splice", "Tense inconsistency", "Passive voice misuse"],
  },
  {
    sentence: "The orchestra's rehearsal ran three hours over schedule the musicians were visibly exhausted by the time the conductor dismissed them.",
    violation: "Run-on sentence (fused sentence)",
    distractors: ["Comma splice", "Dangling modifier", "Pronoun-antecedent disagreement"],
  },
  {
    sentence: "The surgeon completed the transplant in record time the patient's family waited anxiously in the corridor for nearly twelve hours.",
    violation: "Run-on sentence (fused sentence)",
    distractors: ["Comma splice", "Tense inconsistency", "Subject-verb disagreement"],
  },
  {
    sentence: "The volcano had shown signs of increased seismic activity for months the evacuation order came far too late for many of the villages on the eastern slope.",
    violation: "Run-on sentence (fused sentence)",
    distractors: ["Comma splice", "Faulty comparison", "Tense inconsistency"],
  },
  {
    sentence: "The defendant changed his plea to guilty at the last moment the prosecution team was caught completely off guard by the unexpected reversal.",
    violation: "Run-on sentence (fused sentence)",
    distractors: ["Comma splice", "Pronoun case error", "Tense inconsistency"],
  },
  {
    sentence: "The satellite entered orbit precisely on schedule the ground control team erupted in applause as telemetry data confirmed a successful deployment.",
    violation: "Run-on sentence (fused sentence)",
    distractors: ["Comma splice", "Subject-verb disagreement", "Dangling modifier"],
  },
  {
    sentence: "The curator arranged the exhibition chronologically the visitors could trace the artist's stylistic evolution from early impressionism to late abstraction.",
    violation: "Run-on sentence (fused sentence)",
    distractors: ["Comma splice", "Misplaced modifier", "Tense inconsistency"],
  },
  {
    sentence: "The prime minister's speech lasted nearly two hours it failed to address any of the economic concerns raised by the opposition during the previous session.",
    violation: "Run-on sentence (fused sentence)",
    distractors: ["Comma splice", "Pronoun-antecedent disagreement", "Subject-verb disagreement"],
  },
  {
    sentence: "The playwright revised the second act extensively still the director felt the climactic scene lacked emotional resonance.",
    violation: "Run-on sentence (fused sentence)",
    distractors: ["Comma splice", "Dangling modifier", "Misplaced modifier"],
  },
  {
    sentence: "The pharmacologist identified a promising new compound the clinical trials would not begin for another eighteen months due to regulatory requirements.",
    violation: "Run-on sentence (fused sentence)",
    distractors: ["Comma splice", "Tense inconsistency", "Conditional tense error"],
  },
  {
    sentence: "The archaeologist unearthed a remarkably preserved mosaic she immediately contacted the ministry of antiquities to arrange for its protection.",
    violation: "Run-on sentence (fused sentence)",
    distractors: ["Comma splice", "Pronoun-antecedent disagreement", "Tense inconsistency"],
  },
  {
    sentence: "The investment fund posted record losses in the third quarter the board of directors convened an emergency session to discuss a restructuring plan.",
    violation: "Run-on sentence (fused sentence)",
    distractors: ["Comma splice", "Subject-verb disagreement", "Parallel structure violation"],
  },
  {
    sentence: "The novelist destroyed the first three drafts of the manuscript she considered them unworthy of the story she was attempting to tell.",
    violation: "Run-on sentence (fused sentence)",
    distractors: ["Comma splice", "Pronoun-antecedent disagreement", "Tense inconsistency"],
  },
  {
    sentence: "The undersea cable was severed during a trawling accident internet service to the island was disrupted for nearly two weeks.",
    violation: "Run-on sentence (fused sentence)",
    distractors: ["Comma splice", "Passive voice misuse", "Tense inconsistency"],
  },
  {
    sentence: "The tenor's voice cracked during the high C in the second act the audience pretended not to notice out of respect for the aging performer.",
    violation: "Run-on sentence (fused sentence)",
    distractors: ["Comma splice", "Dangling modifier", "Pronoun-antecedent disagreement"],
  },
  {
    sentence: "The geologist collected samples from fourteen different strata she hoped the isotopic analysis would settle the longstanding debate about the formation's age.",
    violation: "Run-on sentence (fused sentence)",
    distractors: ["Comma splice", "Subject-verb disagreement", "Pronoun case error"],
  },
  {
    sentence: "The university's enrollment declined for the fifth consecutive year the administration blamed demographic shifts rather than acknowledging failures in recruitment strategy.",
    violation: "Run-on sentence (fused sentence)",
    distractors: ["Comma splice", "Faulty comparison", "Pronoun-antecedent disagreement"],
  },
  {
    sentence: "The cease-fire agreement collapsed within hours both sides accused the other of firing the first shots across the demilitarized zone.",
    violation: "Run-on sentence (fused sentence)",
    distractors: ["Comma splice", "Pronoun-antecedent disagreement", "Subject-verb disagreement"],
  },

  // ============================================================
  // DOUBLE NEGATIVES / ILLOGICAL NEGATION (21–35)
  // ============================================================
  {
    sentence: "The committee could not find no evidence that the funds had been misappropriated during the previous fiscal year.",
    violation: "Double negative",
    distractors: ["Subject-verb disagreement", "Tense inconsistency", "Pronoun-antecedent disagreement"],
  },
  {
    sentence: "The inspector reported that there wasn't hardly any structural damage to the foundation despite the severity of the earthquake.",
    violation: "Double negative ('wasn't hardly')",
    distractors: ["Subject-verb disagreement", "Faulty comparison", "Tense inconsistency"],
  },
  {
    sentence: "The witness testified that she couldn't barely see the license plate from where she was standing in the dimly lit parking garage.",
    violation: "Double negative ('couldn't barely')",
    distractors: ["Tense inconsistency", "Pronoun case error", "Dangling modifier"],
  },
  {
    sentence: "The auditors didn't find nothing irregular in the financial statements for any of the seven subsidiaries under review.",
    violation: "Double negative ('didn't...nothing')",
    distractors: ["Subject-verb disagreement", "Pronoun-antecedent disagreement", "Tense inconsistency"],
  },
  {
    sentence: "The patient told the physician that the medication hadn't done nothing to alleviate the chronic pain she had been experiencing for months.",
    violation: "Double negative ('hadn't...nothing')",
    distractors: ["Tense inconsistency", "Pronoun case error", "Subject-verb disagreement"],
  },
  {
    sentence: "The researcher couldn't scarcely believe that the results of the decade-long study contradicted every major prediction in the field.",
    violation: "Double negative ('couldn't scarcely')",
    distractors: ["Tense inconsistency", "Subject-verb disagreement", "Faulty comparison"],
  },
  {
    sentence: "There wasn't no precedent in the court's history for overturning a unanimous verdict on the basis of newly discovered procedural irregularities.",
    violation: "Double negative ('wasn't no')",
    distractors: ["Subject-verb disagreement", "Tense inconsistency", "Passive voice misuse"],
  },
  {
    sentence: "The expedition leader said they didn't have but a few days' worth of supplies remaining before they would need to turn back.",
    violation: "Double negative ('didn't have but')",
    distractors: ["Pronoun-antecedent disagreement", "Tense inconsistency", "Subject-verb disagreement"],
  },
  {
    sentence: "The dean remarked that the department hadn't scarcely recovered from the previous round of budget cuts before the new austerity measures were announced.",
    violation: "Double negative ('hadn't scarcely')",
    distractors: ["Tense inconsistency", "Subject-verb disagreement", "Comma splice"],
  },
  {
    sentence: "The editor insisted that the revised manuscript didn't contain none of the factual errors that had been identified in the original submission.",
    violation: "Double negative ('didn't...none')",
    distractors: ["Subjunctive mood error", "Tense inconsistency", "Subject-verb disagreement"],
  },
  {
    sentence: "The spokesperson claimed that the corporation hadn't never engaged in the predatory lending practices described in the regulatory complaint.",
    violation: "Double negative ('hadn't never')",
    distractors: ["Tense inconsistency", "Pronoun-antecedent disagreement", "Subject-verb disagreement"],
  },
  {
    sentence: "The detective couldn't find no fingerprints at the crime scene that matched any individual in the national database.",
    violation: "Double negative ('couldn't...no')",
    distractors: ["Subject-verb disagreement", "Restrictive clause error", "Tense inconsistency"],
  },
  {
    sentence: "The librarian informed us that there weren't scarcely enough copies of the required textbook to accommodate all sixty students enrolled in the course.",
    violation: "Double negative ('weren't scarcely')",
    distractors: ["Subject-verb disagreement", "Faulty comparison", "Pronoun-antecedent disagreement"],
  },
  {
    sentence: "The senator argued that the proposed legislation wouldn't do nothing to address the root causes of the opioid crisis affecting rural communities.",
    violation: "Double negative ('wouldn't...nothing')",
    distractors: ["Subject-verb disagreement", "Tense inconsistency", "Dangling modifier"],
  },
  {
    sentence: "The foreman reported that the construction crew hadn't barely begun the foundation work before the unexpected rainstorm forced a three-day suspension.",
    violation: "Double negative ('hadn't barely')",
    distractors: ["Tense inconsistency", "Subject-verb disagreement", "Misplaced modifier"],
  },

  // ============================================================
  // AMBIGUOUS PRONOUN REFERENCE (36–55)
  // ============================================================
  {
    sentence: "When the professor met with the graduate student to discuss the dissertation proposal, he said he was disappointed with the lack of originality in the theoretical framework.",
    violation: "Ambiguous pronoun reference ('he' could refer to professor or student)",
    distractors: ["Pronoun-antecedent disagreement", "Tense inconsistency", "Subjunctive mood error"],
  },
  {
    sentence: "The architect presented the revised blueprints to the city planner, and she expressed reservations about the feasibility of the cantilevered design.",
    violation: "Ambiguous pronoun reference ('she' could refer to architect or planner)",
    distractors: ["Pronoun-antecedent disagreement", "Comma splice", "Subject-verb disagreement"],
  },
  {
    sentence: "After the attorney consulted with the forensic accountant about the discrepancies in the financial records, he filed a motion to compel disclosure of additional documents.",
    violation: "Ambiguous pronoun reference ('he' could refer to attorney or accountant)",
    distractors: ["Tense inconsistency", "Dangling modifier", "Pronoun case error"],
  },
  {
    sentence: "The conductor criticized the first violinist's interpretation of the adagio passage, and he stormed off the stage before the rehearsal concluded.",
    violation: "Ambiguous pronoun reference ('he' could refer to conductor or violinist)",
    distractors: ["Pronoun-antecedent disagreement", "Tense inconsistency", "Comma splice"],
  },
  {
    sentence: "The diplomat informed the trade representative that his government would not ratify the agreement under the current terms.",
    violation: "Ambiguous pronoun reference ('his' could refer to diplomat's or representative's government)",
    distractors: ["Pronoun-antecedent disagreement", "Subjunctive mood error", "Tense inconsistency"],
  },
  {
    sentence: "When the editor returned the manuscript to the author with extensive annotations, she acknowledged that the revisions would require at least another six months of work.",
    violation: "Ambiguous pronoun reference ('she' could refer to editor or author)",
    distractors: ["Tense inconsistency", "Pronoun-antecedent disagreement", "Dangling modifier"],
  },
  {
    sentence: "The CEO told the board chair that her strategic vision for the company's expansion into Asian markets was fundamentally flawed.",
    violation: "Ambiguous pronoun reference ('her' could refer to CEO's or board chair's vision)",
    distractors: ["Pronoun-antecedent disagreement", "Faulty comparison", "Subject-verb disagreement"],
  },
  {
    sentence: "The historian debated the sociologist about the causes of the revolution, and he argued that economic factors were more significant than ideological ones.",
    violation: "Ambiguous pronoun reference ('he' could refer to historian or sociologist)",
    distractors: ["Pronoun-antecedent disagreement", "Faulty comparison", "Tense inconsistency"],
  },
  {
    sentence: "The chief of surgery spoke privately with the resident about the complication during the procedure, and he admitted that a critical error had been made.",
    violation: "Ambiguous pronoun reference ('he' could refer to chief or resident)",
    distractors: ["Passive voice misuse", "Pronoun-antecedent disagreement", "Tense inconsistency"],
  },
  {
    sentence: "Maria told Elena that she needed to submit the grant application before the end of the fiscal quarter.",
    violation: "Ambiguous pronoun reference ('she' could refer to Maria or Elena)",
    distractors: ["Pronoun-antecedent disagreement", "Subjunctive mood error", "Tense inconsistency"],
  },
  {
    sentence: "The teacher asked the student to present his research findings to the class, but he was not adequately prepared for the questions that followed.",
    violation: "Ambiguous pronoun reference ('he' could refer to teacher or student)",
    distractors: ["Pronoun-antecedent disagreement", "Tense inconsistency", "Dangling modifier"],
  },
  {
    sentence: "When the detective questioned the suspect about the missing evidence, he became increasingly agitated and demanded to speak with a lawyer.",
    violation: "Ambiguous pronoun reference ('he' could refer to detective or suspect)",
    distractors: ["Tense inconsistency", "Pronoun case error", "Comma splice"],
  },
  {
    sentence: "The coach praised the goalkeeper after she made three consecutive saves in the penalty shootout, and she told the press it was the finest performance of the season.",
    violation: "Ambiguous pronoun reference (second 'she' could refer to coach or goalkeeper)",
    distractors: ["Pronoun-antecedent disagreement", "Tense inconsistency", "Comma splice"],
  },
  {
    sentence: "The biologist submitted the paper to the journal editor, but she felt that the methodology section needed substantial revision before it could be accepted.",
    violation: "Ambiguous pronoun reference ('she' could refer to biologist or editor)",
    distractors: ["Pronoun-antecedent disagreement", "Passive voice misuse", "Tense inconsistency"],
  },
  {
    sentence: "The ambassador met with the foreign minister to discuss the stalled negotiations, and he proposed a new framework that might satisfy both parties.",
    violation: "Ambiguous pronoun reference ('he' could refer to ambassador or minister)",
    distractors: ["Pronoun-antecedent disagreement", "Subjunctive mood error", "Tense inconsistency"],
  },
  {
    sentence: "The therapist explained to the patient's mother that she should consider a different approach to managing the anxiety symptoms.",
    violation: "Ambiguous pronoun reference ('she' could refer to therapist or mother)",
    distractors: ["Pronoun-antecedent disagreement", "Subjunctive mood error", "Dangling modifier"],
  },
  {
    sentence: "When the prosecutor cross-examined the defense witness, he revealed that crucial evidence had been withheld from the grand jury.",
    violation: "Ambiguous pronoun reference ('he' could refer to prosecutor or witness)",
    distractors: ["Passive voice misuse", "Tense inconsistency", "Pronoun case error"],
  },
  {
    sentence: "The dean informed the department chair that his budget request had been denied by the provost's office for the third consecutive year.",
    violation: "Ambiguous pronoun reference ('his' could refer to dean's or chair's budget request)",
    distractors: ["Pronoun-antecedent disagreement", "Passive voice misuse", "Tense inconsistency"],
  },
  {
    sentence: "The quarterback threw the ball to the wide receiver, but he misjudged the distance and the pass was intercepted at the twenty-yard line.",
    violation: "Ambiguous pronoun reference ('he' could refer to quarterback or receiver)",
    distractors: ["Pronoun-antecedent disagreement", "Tense inconsistency", "Passive voice misuse"],
  },
  {
    sentence: "The venture capitalist met with the startup founder to evaluate her pitch, and she concluded that the projected revenue figures were wildly optimistic.",
    violation: "Ambiguous pronoun reference ('she' could refer to capitalist or founder)",
    distractors: ["Pronoun-antecedent disagreement", "Faulty comparison", "Tense inconsistency"],
  },

  // ============================================================
  // SHIFTS IN VOICE (56–70)
  // ============================================================
  {
    sentence: "The researchers collected samples from twenty different sites, and the data was analyzed using a newly developed mass spectrometry protocol.",
    violation: "Unnecessary shift from active to passive voice",
    distractors: ["Subject-verb disagreement", "Tense inconsistency", "Parallel structure violation"],
  },
  {
    sentence: "The surgeon carefully made the initial incision, the tumor was located using ultrasound guidance, and she then excised it with remarkable precision.",
    violation: "Unnecessary shift from active to passive and back to active voice",
    distractors: ["Comma splice", "Parallel structure violation", "Tense inconsistency"],
  },
  {
    sentence: "The committee reviewed all the applications thoroughly, and the three finalists were selected after an extensive deliberation process.",
    violation: "Unnecessary shift from active to passive voice",
    distractors: ["Pronoun-antecedent disagreement", "Subject-verb disagreement", "Tense inconsistency"],
  },
  {
    sentence: "The journalist investigated the corruption allegations for six months, dozens of confidential sources were interviewed, and she ultimately published a five-part series.",
    violation: "Unnecessary shift from active to passive and back to active voice",
    distractors: ["Comma splice", "Parallel structure violation", "Pronoun-antecedent disagreement"],
  },
  {
    sentence: "Students must submit their assignments by Friday, and all late work will be penalized at a rate of ten percent per day.",
    violation: "Unnecessary shift from active to passive voice",
    distractors: ["Pronoun-antecedent disagreement", "Subject-verb disagreement", "Parallel structure violation"],
  },
  {
    sentence: "The architect designed the atrium to maximize natural light, but the ventilation system was installed by a separate contractor who ignored the original specifications.",
    violation: "Unnecessary shift from active to passive voice",
    distractors: ["Pronoun-antecedent disagreement", "Restrictive clause error", "Tense inconsistency"],
  },
  {
    sentence: "The chef selected only the freshest seasonal ingredients, and each dish was prepared with meticulous attention to presentation and flavor balance.",
    violation: "Unnecessary shift from active to passive voice",
    distractors: ["Subject-verb disagreement", "Parallel structure violation", "Dangling modifier"],
  },
  {
    sentence: "The prosecutor presented compelling evidence during the opening statement, and the jury was visibly moved by the testimony of the victim's family members.",
    violation: "Unnecessary shift from active to passive voice",
    distractors: ["Tense inconsistency", "Pronoun-antecedent disagreement", "Comma splice"],
  },
  {
    sentence: "The company launched the new product line in September, and record sales figures were achieved within the first quarter of availability.",
    violation: "Unnecessary shift from active to passive voice",
    distractors: ["Subject-verb disagreement", "Tense inconsistency", "Faulty comparison"],
  },
  {
    sentence: "The conductor rehearsed the second movement repeatedly, the tempo was adjusted several times, and he finally declared it satisfactory.",
    violation: "Unnecessary shift from active to passive and back to active voice",
    distractors: ["Comma splice", "Parallel structure violation", "Tense inconsistency"],
  },
  {
    sentence: "The engineer designed the cooling system to operate at maximum efficiency, but excessive noise was generated whenever the ambient temperature exceeded thirty-five degrees.",
    violation: "Unnecessary shift from active to passive voice",
    distractors: ["Subject-verb disagreement", "Faulty comparison", "Tense inconsistency"],
  },
  {
    sentence: "The principal addressed the concerns raised by parents at the meeting, and a revised code of conduct was distributed to all families the following week.",
    violation: "Unnecessary shift from active to passive voice",
    distractors: ["Pronoun-antecedent disagreement", "Subject-verb disagreement", "Tense inconsistency"],
  },
  {
    sentence: "The poet crafted each stanza with deliberate care, and the final couplet was written in a single burst of inspiration late one evening.",
    violation: "Unnecessary shift from active to passive voice",
    distractors: ["Tense inconsistency", "Dangling modifier", "Parallel structure violation"],
  },
  {
    sentence: "The professor explained the key concepts clearly during the lecture, and a comprehensive study guide was provided to students before the midterm examination.",
    violation: "Unnecessary shift from active to passive voice",
    distractors: ["Subject-verb disagreement", "Pronoun-antecedent disagreement", "Tense inconsistency"],
  },
  {
    sentence: "The firefighters evacuated the residents from the upper floors, and the blaze was extinguished after approximately four hours of continuous effort.",
    violation: "Unnecessary shift from active to passive voice",
    distractors: ["Tense inconsistency", "Subject-verb disagreement", "Misplaced modifier"],
  },

  // ============================================================
  // SHIFTS IN PERSON (71–85)
  // ============================================================
  {
    sentence: "When one examines the archaeological record carefully, you will notice that the evidence for a sudden collapse of the Bronze Age civilization is far from conclusive.",
    violation: "Shift in person (from 'one' to 'you')",
    distractors: ["Tense inconsistency", "Dangling modifier", "Subject-verb disagreement"],
  },
  {
    sentence: "A student who wishes to pursue doctoral research must first demonstrate that you have mastered the core competencies expected at the master's level.",
    violation: "Shift in person (from 'a student' to 'you')",
    distractors: ["Pronoun-antecedent disagreement", "Subject-verb disagreement", "Subjunctive mood error"],
  },
  {
    sentence: "If a taxpayer fails to file their return by the statutory deadline, you may be subject to penalties and interest on any outstanding balance.",
    violation: "Shift in person (from 'a taxpayer' to 'you')",
    distractors: ["Pronoun-antecedent disagreement", "Conditional tense error", "Subject-verb disagreement"],
  },
  {
    sentence: "One should always verify the credibility of your sources before citing them in a formal academic paper or dissertation.",
    violation: "Shift in person (from 'one' to 'your')",
    distractors: ["Pronoun-antecedent disagreement", "Split infinitive", "Dangling modifier"],
  },
  {
    sentence: "Employees must report any workplace injuries immediately, and you should also document the incident in writing within twenty-four hours.",
    violation: "Shift in person (from 'employees' to 'you')",
    distractors: ["Parallel structure violation", "Pronoun-antecedent disagreement", "Comma splice"],
  },
  {
    sentence: "When we consider the environmental impact of industrial agriculture, one cannot ignore the devastating effects on biodiversity and water quality.",
    violation: "Shift in person (from 'we' to 'one')",
    distractors: ["Dangling modifier", "Subject-verb disagreement", "Tense inconsistency"],
  },
  {
    sentence: "A researcher must maintain objectivity throughout the investigation; otherwise, you risk introducing confirmation bias into the experimental design.",
    violation: "Shift in person (from 'a researcher' to 'you')",
    distractors: ["Pronoun-antecedent disagreement", "Comma splice", "Subject-verb disagreement"],
  },
  {
    sentence: "Visitors to the national park should stay on the marked trails at all times, and one must never approach or feed the wildlife under any circumstances.",
    violation: "Shift in person (from 'visitors' to 'one')",
    distractors: ["Parallel structure violation", "Pronoun-antecedent disagreement", "Split infinitive"],
  },
  {
    sentence: "If one is determined to succeed in competitive academia, you must be prepared to publish prolifically and secure external funding from the outset of your career.",
    violation: "Shift in person (from 'one' to 'you')",
    distractors: ["Pronoun-antecedent disagreement", "Parallel structure violation", "Subjunctive mood error"],
  },
  {
    sentence: "The handbook states that members shall conduct themselves professionally at all times, and you must refrain from any activity that could bring disrepute to the organization.",
    violation: "Shift in person (from 'members' to 'you')",
    distractors: ["Pronoun-antecedent disagreement", "Subjunctive mood error", "Comma splice"],
  },
  {
    sentence: "When I review the experimental protocols used in this study, one cannot help but wonder whether the control group was adequately isolated from confounding variables.",
    violation: "Shift in person (from 'I' to 'one')",
    distractors: ["Tense inconsistency", "Dangling modifier", "Subject-verb disagreement"],
  },
  {
    sentence: "A physician should always explain the potential side effects of any prescribed medication to their patients, and you must obtain informed consent before initiating treatment.",
    violation: "Shift in person (from 'a physician' to 'you')",
    distractors: ["Pronoun-antecedent disagreement", "Parallel structure violation", "Subject-verb disagreement"],
  },
  {
    sentence: "Jurors must base their verdict solely on the evidence presented during the trial, and one should disregard any information obtained from media coverage.",
    violation: "Shift in person (from 'jurors' to 'one')",
    distractors: ["Pronoun-antecedent disagreement", "Parallel structure violation", "Tense inconsistency"],
  },
  {
    sentence: "If a homeowner discovers asbestos in their property, you should contact a licensed abatement contractor before attempting any renovation work.",
    violation: "Shift in person (from 'a homeowner' to 'you')",
    distractors: ["Pronoun-antecedent disagreement", "Conditional tense error", "Dangling modifier"],
  },
  {
    sentence: "We spent months analyzing the demographic data, and one could see clearly that population growth had outpaced infrastructure investment in every district.",
    violation: "Shift in person (from 'we' to 'one')",
    distractors: ["Tense inconsistency", "Subject-verb disagreement", "Pronoun-antecedent disagreement"],
  },

  // ============================================================
  // SHIFTS IN NUMBER (86–100)
  // ============================================================
  {
    sentence: "A surgeon must wash their hands thoroughly before entering the operating theater, and they should also verify that the instruments have been properly sterilized.",
    violation: "Shift in number (singular 'a surgeon' to plural 'their/they')",
    distractors: ["Pronoun-antecedent disagreement", "Subject-verb disagreement", "Parallel structure violation"],
  },
  {
    sentence: "Each applicant should submit their resume, three letters of recommendation, and a personal statement explaining why they are uniquely qualified for the fellowship.",
    violation: "Shift in number (singular 'each applicant' to plural 'their/they')",
    distractors: ["Pronoun-antecedent disagreement", "Parallel structure violation", "Subject-verb disagreement"],
  },
  {
    sentence: "An experienced diplomat understands that they must sometimes compromise on secondary objectives to achieve their primary negotiating goals.",
    violation: "Shift in number (singular 'an experienced diplomat' to plural 'they/their')",
    distractors: ["Pronoun-antecedent disagreement", "Split infinitive", "Subject-verb disagreement"],
  },
  {
    sentence: "Every nurse on the ward was reminded that they needed to complete their continuing education requirements before the end of the calendar year.",
    violation: "Shift in number (singular 'every nurse' to plural 'they/their')",
    distractors: ["Pronoun-antecedent disagreement", "Tense inconsistency", "Subject-verb disagreement"],
  },
  {
    sentence: "A responsible citizen exercises their right to vote in every election, because they understand that democratic participation requires consistent engagement.",
    violation: "Shift in number (singular 'a responsible citizen' to plural 'their/they')",
    distractors: ["Pronoun-antecedent disagreement", "Subject-verb disagreement", "Comma splice"],
  },
  {
    sentence: "Neither candidate for the position indicated that they were willing to relocate to the regional headquarters in Denver.",
    violation: "Shift in number (singular 'neither candidate' to plural 'they')",
    distractors: ["Pronoun-antecedent disagreement", "Correlative conjunction error", "Subject-verb disagreement"],
  },
  {
    sentence: "Any employee found in violation of the safety protocols will have their access credentials revoked and they will be required to undergo retraining.",
    violation: "Shift in number (singular 'any employee' to plural 'their/they')",
    distractors: ["Pronoun-antecedent disagreement", "Parallel structure violation", "Comma splice"],
  },
  {
    sentence: "A serious scholar does not rely on secondary sources alone; instead, they seek out primary documents and archival materials whenever possible.",
    violation: "Shift in number (singular 'a serious scholar' to plural 'they')",
    distractors: ["Pronoun-antecedent disagreement", "Comma splice", "Subject-verb disagreement"],
  },
  {
    sentence: "Each member of the expedition was instructed to pack their own supplies, and they were told that the base camp would not provide any additional equipment.",
    violation: "Shift in number (singular 'each member' to plural 'their/they')",
    distractors: ["Pronoun-antecedent disagreement", "Tense inconsistency", "Passive voice misuse"],
  },
  {
    sentence: "No student should feel that they have been unfairly disadvantaged by the new grading policy, and they are encouraged to speak with their advisor if concerns arise.",
    violation: "Shift in number (singular 'no student' to plural 'they/their')",
    distractors: ["Pronoun-antecedent disagreement", "Subjunctive mood error", "Subject-verb disagreement"],
  },
  {
    sentence: "An architect who designs public buildings must ensure that they comply with the accessibility requirements mandated by federal law.",
    violation: "Shift in number (singular 'an architect' to plural 'they')",
    distractors: ["Pronoun-antecedent disagreement", "Ambiguous pronoun reference", "Subject-verb disagreement"],
  },
  {
    sentence: "Everybody who attended the conference was given their own copy of the proceedings, and they were asked to provide written feedback within two weeks.",
    violation: "Shift in number (singular 'everybody' to plural 'their/they')",
    distractors: ["Pronoun-antecedent disagreement", "Subject-verb disagreement", "Passive voice misuse"],
  },
  {
    sentence: "A journalist has an ethical obligation to protect their confidential sources, even when they face legal pressure to disclose them.",
    violation: "Shift in number (singular 'a journalist' to plural 'their/they')",
    distractors: ["Pronoun-antecedent disagreement", "Ambiguous pronoun reference", "Split infinitive"],
  },
  {
    sentence: "Anyone who believes that they have been the victim of discrimination should file a formal complaint with the human resources department immediately.",
    violation: "Shift in number (singular 'anyone' to plural 'they')",
    distractors: ["Pronoun-antecedent disagreement", "Subjunctive mood error", "Subject-verb disagreement"],
  },
  {
    sentence: "Every participant in the clinical trial must sign a consent form before they can receive the experimental medication or any placebo alternative.",
    violation: "Shift in number (singular 'every participant' to plural 'they')",
    distractors: ["Pronoun-antecedent disagreement", "Subjunctive mood error", "Subject-verb disagreement"],
  },

  // ============================================================
  // CONDITIONAL TENSE ERRORS (101–110)
  // ============================================================
  {
    sentence: "If the city would have invested in the levee system decades ago, the flooding damage from last month's hurricane could have been largely prevented.",
    violation: "Conditional tense error ('would have' should be 'had' in the if-clause)",
    distractors: ["Subjunctive mood error", "Tense inconsistency", "Passive voice misuse"],
  },
  {
    sentence: "Had the pharmaceutical company would have conducted more rigorous testing, the adverse side effects might have been identified before the drug reached the market.",
    violation: "Conditional tense error ('would have' is redundant after inverted 'had')",
    distractors: ["Subjunctive mood error", "Passive voice misuse", "Tense inconsistency"],
  },
  {
    sentence: "If the government would have ratified the treaty when it was first proposed, the environmental damage to the coastal ecosystem could have been substantially mitigated.",
    violation: "Conditional tense error ('would have' should be 'had' in the if-clause)",
    distractors: ["Subjunctive mood error", "Passive voice misuse", "Tense inconsistency"],
  },
  {
    sentence: "The university would have not faced a budget shortfall if the endowment would have performed better during the recent economic downturn.",
    violation: "Conditional tense error ('would have' should be 'had' in the if-clause)",
    distractors: ["Misplaced modifier", "Tense inconsistency", "Subjunctive mood error"],
  },
  {
    sentence: "If the prosecution would have presented the forensic evidence more effectively, the jury might not have acquitted the defendant on all charges.",
    violation: "Conditional tense error ('would have' should be 'had' in the if-clause)",
    distractors: ["Subjunctive mood error", "Tense inconsistency", "Pronoun case error"],
  },
  {
    sentence: "She would of been promoted to department chair years ago if her publication record would have been stronger during the initial review period.",
    violation: "Double error: diction ('would of' for 'would have') and conditional tense error in if-clause",
    distractors: ["Subjunctive mood error", "Pronoun case error", "Tense inconsistency"],
  },
  {
    sentence: "If the engineers would have stress-tested the bridge supports before opening the span to traffic, the catastrophic structural failure might never have occurred.",
    violation: "Conditional tense error ('would have' should be 'had' in the if-clause)",
    distractors: ["Subjunctive mood error", "Dangling modifier", "Tense inconsistency"],
  },
  {
    sentence: "The diplomat insisted that the summit would have succeeded if both delegations would have shown more flexibility on the territorial dispute.",
    violation: "Conditional tense error ('would have' should be 'had' in the if-clause)",
    distractors: ["Subjunctive mood error", "Tense inconsistency", "Pronoun-antecedent disagreement"],
  },
  {
    sentence: "If the journal editors would have applied the same standards to all submissions, the controversy over the retracted article could have been entirely avoided.",
    violation: "Conditional tense error ('would have' should be 'had' in the if-clause)",
    distractors: ["Subjunctive mood error", "Passive voice misuse", "Parallel structure violation"],
  },
  {
    sentence: "The ecosystem would have recovered more quickly if the mining company would have implemented the remediation plan that the environmental consultants had recommended.",
    violation: "Conditional tense error ('would have' should be 'had' in the if-clause)",
    distractors: ["Subjunctive mood error", "Tense inconsistency", "Restrictive clause error"],
  },

  // ============================================================
  // SQUINTING MODIFIERS (111–125)
  // ============================================================
  {
    sentence: "The manager said during the meeting the new policy would be implemented by the end of the quarter.",
    violation: "Squinting modifier ('during the meeting' could modify 'said' or 'would be implemented')",
    distractors: ["Dangling modifier", "Misplaced modifier", "Tense inconsistency"],
  },
  {
    sentence: "The professor told the students frequently to review the assigned readings before coming to the seminar.",
    violation: "Squinting modifier ('frequently' could modify 'told' or 'to review')",
    distractors: ["Misplaced modifier", "Split infinitive", "Dangling modifier"],
  },
  {
    sentence: "The doctor advised the patient often to take walks in the morning to improve cardiovascular health.",
    violation: "Squinting modifier ('often' could modify 'advised' or 'to take walks')",
    distractors: ["Misplaced modifier", "Split infinitive", "Dangling modifier"],
  },
  {
    sentence: "Researchers who study climate change frequently publish in interdisciplinary journals rather than in specialized meteorological outlets.",
    violation: "Squinting modifier ('frequently' could modify 'study' or 'publish')",
    distractors: ["Misplaced modifier", "Restrictive clause error", "Subject-verb disagreement"],
  },
  {
    sentence: "The attorney who represents the plaintiff aggressively cross-examined the defense's expert witness on the stand.",
    violation: "Squinting modifier ('aggressively' could modify 'represents' or 'cross-examined')",
    distractors: ["Misplaced modifier", "Pronoun case error", "Restrictive clause error"],
  },
  {
    sentence: "The senator promised after the recess to introduce the bipartisan amendment on healthcare reform.",
    violation: "Squinting modifier ('after the recess' could modify 'promised' or 'to introduce')",
    distractors: ["Misplaced modifier", "Dangling modifier", "Split infinitive"],
  },
  {
    sentence: "The CEO told the shareholders repeatedly that the company's long-term strategy would prioritize sustainable growth.",
    violation: "Squinting modifier ('repeatedly' could modify 'told' or 'would prioritize')",
    distractors: ["Misplaced modifier", "Pronoun-antecedent disagreement", "Tense inconsistency"],
  },
  {
    sentence: "Students who practice the violin daily improve their technique more rapidly than those who practice only on weekends.",
    violation: "Squinting modifier ('daily' could modify 'practice' or 'improve')",
    distractors: ["Misplaced modifier", "Faulty comparison", "Subject-verb disagreement"],
  },
  {
    sentence: "The therapist recommended to the patient strongly to consider cognitive behavioral therapy as a complement to the current medication regimen.",
    violation: "Squinting modifier ('strongly' could modify 'recommended' or 'to consider')",
    distractors: ["Misplaced modifier", "Split infinitive", "Dangling modifier"],
  },
  {
    sentence: "The curator explained to the donors at the gala that several rare acquisitions would be unveiled in the spring exhibition.",
    violation: "Squinting modifier ('at the gala' could modify 'explained' or 'donors')",
    distractors: ["Misplaced modifier", "Tense inconsistency", "Pronoun-antecedent disagreement"],
  },
  {
    sentence: "The dean asked the faculty before the semester to submit their proposed syllabi for departmental review.",
    violation: "Squinting modifier ('before the semester' could modify 'asked' or 'to submit')",
    distractors: ["Misplaced modifier", "Pronoun-antecedent disagreement", "Dangling modifier"],
  },
  {
    sentence: "The director told the actors in the afternoon to rehearse the second act from the beginning.",
    violation: "Squinting modifier ('in the afternoon' could modify 'told' or 'to rehearse')",
    distractors: ["Misplaced modifier", "Dangling modifier", "Tense inconsistency"],
  },
  {
    sentence: "Athletes who train in high altitudes regularly outperform their sea-level counterparts in endurance events.",
    violation: "Squinting modifier ('regularly' could modify 'train' or 'outperform')",
    distractors: ["Misplaced modifier", "Faulty comparison", "Subject-verb disagreement"],
  },
  {
    sentence: "The principal informed the parents at the assembly that the school's safety protocols would be significantly revised.",
    violation: "Squinting modifier ('at the assembly' could modify 'informed' or 'parents')",
    distractors: ["Misplaced modifier", "Passive voice misuse", "Pronoun-antecedent disagreement"],
  },
  {
    sentence: "The coach told the players before the game to focus on defensive positioning rather than offensive improvisation.",
    violation: "Squinting modifier ('before the game' could modify 'told' or 'to focus')",
    distractors: ["Misplaced modifier", "Parallel structure violation", "Dangling modifier"],
  },

  // ============================================================
  // FAULTY PREDICATION (126–140)
  // ============================================================
  {
    sentence: "The reason for the economic downturn is because the central bank raised interest rates too aggressively during the third quarter.",
    violation: "Faulty predication (reason...is because)",
    distractors: ["Redundancy error", "Subject-verb disagreement", "Tense inconsistency"],
  },
  {
    sentence: "The purpose of the new zoning ordinance is intended to prevent commercial development in historically residential neighborhoods.",
    violation: "Faulty predication ('the purpose...is intended' conflates subject and predicate)",
    distractors: ["Redundancy error", "Passive voice misuse", "Subject-verb disagreement"],
  },
  {
    sentence: "The field of molecular biology is where scientists study the interactions between the various systems of a cell.",
    violation: "Faulty predication ('the field...is where' — a field is not a place)",
    distractors: ["Restrictive clause error", "Subject-verb disagreement", "Redundancy error"],
  },
  {
    sentence: "An example of a sustainable energy source is when solar panels convert sunlight directly into electrical current.",
    violation: "Faulty predication ('an example...is when' — an example is not a time)",
    distractors: ["Restrictive clause error", "Subject-verb disagreement", "Tense inconsistency"],
  },
  {
    sentence: "The cost of the renovation project is too expensive for the current operating budget to absorb without significant reallocations.",
    violation: "Faulty predication ('cost...is expensive' — cost cannot be expensive; it can be high)",
    distractors: ["Faulty comparison", "Redundancy error", "Subject-verb disagreement"],
  },
  {
    sentence: "The definition of photosynthesis is when plants convert light energy into chemical energy using chlorophyll.",
    violation: "Faulty predication ('the definition...is when' — a definition is not a time)",
    distractors: ["Restrictive clause error", "Subject-verb disagreement", "Tense inconsistency"],
  },
  {
    sentence: "The goal of the literacy program is designed to improve reading comprehension among students in underserved rural communities.",
    violation: "Faulty predication ('the goal...is designed' conflates subject and predicate)",
    distractors: ["Redundancy error", "Passive voice misuse", "Dangling modifier"],
  },
  {
    sentence: "The study of paleontology is where researchers examine fossilized remains to reconstruct the evolutionary history of extinct organisms.",
    violation: "Faulty predication ('the study...is where' — a study is not a place)",
    distractors: ["Restrictive clause error", "Subject-verb disagreement", "Dangling modifier"],
  },
  {
    sentence: "One instance of governmental overreach is when the regulatory agency imposed retroactive compliance requirements on small businesses.",
    violation: "Faulty predication ('an instance...is when' — an instance is not a time)",
    distractors: ["Tense inconsistency", "Subject-verb disagreement", "Restrictive clause error"],
  },
  {
    sentence: "The reason the experiment yielded inconclusive results is because the control variables were not adequately isolated from the independent variable.",
    violation: "Faulty predication (reason...is because)",
    distractors: ["Redundancy error", "Passive voice misuse", "Subject-verb disagreement"],
  },
  {
    sentence: "The job of a structural engineer is a person who calculates load-bearing capacities and designs foundations for commercial buildings.",
    violation: "Faulty predication ('the job...is a person' — a job is not a person)",
    distractors: ["Restrictive clause error", "Subject-verb disagreement", "Pronoun-antecedent disagreement"],
  },
  {
    sentence: "A symptom of the disease is when the patient experiences sudden episodes of vertigo accompanied by severe nausea.",
    violation: "Faulty predication ('a symptom...is when' — a symptom is not a time)",
    distractors: ["Tense inconsistency", "Subject-verb disagreement", "Restrictive clause error"],
  },
  {
    sentence: "The function of the peer review process is intended to ensure that published research meets established methodological standards.",
    violation: "Faulty predication ('the function...is intended' conflates subject and predicate)",
    distractors: ["Redundancy error", "Passive voice misuse", "Subject-verb disagreement"],
  },
  {
    sentence: "The advantage of the new software platform is a system that processes data three times faster than its predecessor.",
    violation: "Faulty predication ('the advantage...is a system' — an advantage is not a system)",
    distractors: ["Faulty comparison", "Subject-verb disagreement", "Restrictive clause error"],
  },
  {
    sentence: "The reason for the bridge's collapse is because the contractors used substandard materials in the load-bearing pylons during the original construction.",
    violation: "Faulty predication (reason...is because)",
    distractors: ["Redundancy error", "Tense inconsistency", "Subject-verb disagreement"],
  },

  // ============================================================
  // MIXED CONSTRUCTION (141–155)
  // ============================================================
  {
    sentence: "By investing heavily in renewable energy sources has allowed several Scandinavian countries to reduce their dependence on fossil fuels significantly.",
    violation: "Mixed construction (prepositional phrase as subject with finite verb 'has allowed')",
    distractors: ["Dangling modifier", "Subject-verb disagreement", "Tense inconsistency"],
  },
  {
    sentence: "For students who struggle with advanced calculus should consider enrolling in the supplementary tutorial sessions offered by the mathematics department.",
    violation: "Mixed construction (prepositional phrase merged with subject clause)",
    distractors: ["Dangling modifier", "Subject-verb disagreement", "Pronoun-antecedent disagreement"],
  },
  {
    sentence: "In the event that the defendant is acquitted does not necessarily mean that the investigation will be closed by the special prosecutor.",
    violation: "Mixed construction (adverbial clause merged with subject position)",
    distractors: ["Subject-verb disagreement", "Passive voice misuse", "Dangling modifier"],
  },
  {
    sentence: "Because the pilot identified the hydraulic failure early was the reason the aircraft was able to land safely despite the emergency.",
    violation: "Mixed construction (adverbial clause used as subject with 'was the reason')",
    distractors: ["Redundancy error", "Subject-verb disagreement", "Tense inconsistency"],
  },
  {
    sentence: "Although the candidate possesses impressive academic credentials does not guarantee success in the highly competitive tenure-track job market.",
    violation: "Mixed construction (concessive clause used as subject)",
    distractors: ["Subject-verb disagreement", "Dangling modifier", "Tense inconsistency"],
  },
  {
    sentence: "By training consistently throughout the off-season resulted in a personal best time for the marathon runner at the national championship.",
    violation: "Mixed construction (prepositional phrase as subject with finite verb 'resulted')",
    distractors: ["Dangling modifier", "Subject-verb disagreement", "Tense inconsistency"],
  },
  {
    sentence: "Just because the corporation reported record profits does not mean that the benefits are being distributed equitably among all stakeholders.",
    violation: "Mixed construction ('just because' clause used as subject)",
    distractors: ["Subject-verb disagreement", "Tense inconsistency", "Faulty comparison"],
  },
  {
    sentence: "In her analysis of the post-colonial literary canon examines how indigenous narratives have been systematically marginalized by the Western academy.",
    violation: "Mixed construction (prepositional phrase as subject with finite verb 'examines')",
    distractors: ["Dangling modifier", "Subject-verb disagreement", "Tense inconsistency"],
  },
  {
    sentence: "Because the pandemic disrupted global supply chains was a major factor in the unprecedented inflation that followed the initial economic recovery.",
    violation: "Mixed construction (adverbial clause used as subject)",
    distractors: ["Subject-verb disagreement", "Redundancy error", "Tense inconsistency"],
  },
  {
    sentence: "By reducing the corporate tax rate has historically stimulated short-term economic growth but has not always led to sustained increases in employment.",
    violation: "Mixed construction (prepositional phrase as subject with finite verb 'has stimulated')",
    distractors: ["Dangling modifier", "Parallel structure violation", "Subject-verb disagreement"],
  },
  {
    sentence: "For anyone who has experienced severe food insecurity should be eligible for the emergency assistance program without additional bureaucratic hurdles.",
    violation: "Mixed construction (prepositional phrase merged with subject clause)",
    distractors: ["Subject-verb disagreement", "Pronoun-antecedent disagreement", "Dangling modifier"],
  },
  {
    sentence: "Although the archaeological evidence strongly supports the revised chronology does not settle the debate among historians about the cause of the empire's decline.",
    violation: "Mixed construction (concessive clause used as subject)",
    distractors: ["Subject-verb disagreement", "Dangling modifier", "Tense inconsistency"],
  },
  {
    sentence: "In the committee's final report recommends that the university establish a dedicated office for diversity, equity, and inclusion.",
    violation: "Mixed construction (prepositional phrase as subject with finite verb 'recommends')",
    distractors: ["Subjunctive mood error", "Subject-verb disagreement", "Dangling modifier"],
  },
  {
    sentence: "Because the vaccine demonstrated ninety-five percent efficacy in the Phase III trials was the primary reason the regulatory authority granted emergency approval.",
    violation: "Mixed construction (adverbial clause used as subject with 'was the reason')",
    distractors: ["Redundancy error", "Subject-verb disagreement", "Tense inconsistency"],
  },
  {
    sentence: "By publishing the leaked documents without redacting the names of confidential informants endangered the lives of several intelligence operatives working abroad.",
    violation: "Mixed construction (prepositional phrase as subject with finite verb 'endangered')",
    distractors: ["Dangling modifier", "Subject-verb disagreement", "Passive voice misuse"],
  },

  // ============================================================
  // DICTION / WORD CHOICE ERRORS (156–180)
  // ============================================================
  {
    sentence: "The affect of prolonged isolation on the mental health of prisoners in solitary confinement has been extensively documented by clinical psychologists.",
    violation: "Diction error ('affect' should be 'effect' when used as a noun meaning result)",
    distractors: ["Subject-verb disagreement", "Passive voice misuse", "Tense inconsistency"],
  },
  {
    sentence: "The principal of diminishing returns applies with particular force to agricultural subsidies in regions where soil quality has already been severely degraded.",
    violation: "Diction error ('principal' should be 'principle' when referring to a fundamental concept)",
    distractors: ["Subject-verb disagreement", "Faulty comparison", "Restrictive clause error"],
  },
  {
    sentence: "The board voted to formerly censure the executive director for his repeated violations of the organization's conflict-of-interest policy.",
    violation: "Diction error ('formerly' should be 'formally')",
    distractors: ["Subjunctive mood error", "Pronoun-antecedent disagreement", "Tense inconsistency"],
  },
  {
    sentence: "The eminent collapse of the financial sector was apparent to anyone who had been closely monitoring the subprime mortgage market.",
    violation: "Diction error ('eminent' should be 'imminent')",
    distractors: ["Tense inconsistency", "Subject-verb disagreement", "Dangling modifier"],
  },
  {
    sentence: "The defendant was charged with the elicit manufacture and distribution of controlled substances across three state jurisdictions.",
    violation: "Diction error ('elicit' should be 'illicit')",
    distractors: ["Parallel structure violation", "Passive voice misuse", "Subject-verb disagreement"],
  },
  {
    sentence: "The panel concluded that the new regulations would have a negligent impact on small businesses operating in the renewable energy sector.",
    violation: "Diction error ('negligent' should be 'negligible')",
    distractors: ["Subject-verb disagreement", "Faulty comparison", "Tense inconsistency"],
  },
  {
    sentence: "The council's refusal to wave the permitting fees has discouraged many prospective developers from investing in the downtown revitalization district.",
    violation: "Diction error ('wave' should be 'waive')",
    distractors: ["Subject-verb disagreement", "Tense inconsistency", "Pronoun-antecedent disagreement"],
  },
  {
    sentence: "The continuous interruptions from the gallery forced the judge to temporarily recess the proceedings and clear the courtroom of spectators.",
    violation: "Diction error ('continuous' should be 'continual' for recurring interruptions)",
    distractors: ["Misplaced modifier", "Split infinitive", "Tense inconsistency"],
  },
  {
    sentence: "The company's attempts to mitigate the environmental damage wrought by decades of unregulated mining have been largely ineffective and, some argue, wholly disingenuous.",
    violation: "No error (trick item: 'wrought' is correct as past tense of 'work' in this context)",
    distractors: ["Diction error", "Tense inconsistency", "Parallel structure violation"],
  },
  {
    sentence: "The sociologist's research implies that urban poverty is not merely an economic condition but a deeply imbedded social phenomenon with cultural dimensions.",
    violation: "Diction error ('imbedded' should be 'embedded')",
    distractors: ["Parallel structure violation", "Subject-verb disagreement", "Faulty comparison"],
  },
  {
    sentence: "The historian argued that the regime's demise was precipitated by its inability to illicit loyalty from the military officer corps.",
    violation: "Diction error ('illicit' should be 'elicit')",
    distractors: ["Tense inconsistency", "Pronoun-antecedent disagreement", "Subject-verb disagreement"],
  },
  {
    sentence: "The number of students who's academic performance improved after the implementation of the tutoring program exceeded all expectations.",
    violation: "Diction error ('who's' should be 'whose')",
    distractors: ["Subject-verb disagreement", "Restrictive clause error", "Pronoun-antecedent disagreement"],
  },
  {
    sentence: "The corporation's stationary, emblazoned with the new logo, was distributed to all twelve regional offices within the first week of the rebranding campaign.",
    violation: "Diction error ('stationary' should be 'stationery')",
    distractors: ["Subject-verb disagreement", "Tense inconsistency", "Passive voice misuse"],
  },
  {
    sentence: "The climatologist warned that the draught affecting the western provinces could persist for another three to five years if precipitation patterns continue to shift.",
    violation: "Diction error ('draught' should be 'drought')",
    distractors: ["Conditional tense error", "Subject-verb disagreement", "Tense inconsistency"],
  },
  {
    sentence: "The professor complemented the student on her insightful analysis of the socioeconomic factors contributing to the decline of the Roman Empire.",
    violation: "Diction error ('complemented' should be 'complimented')",
    distractors: ["Pronoun-antecedent disagreement", "Dangling modifier", "Tense inconsistency"],
  },
  {
    sentence: "The prosecutor argued that the defendant's actions demonstrated a conscious disregard for the safety of the pedestrians in the crosswalk.",
    violation: "No error (trick item: 'conscious' is correct here meaning deliberate)",
    distractors: ["Diction error ('conscious' vs 'conscience')", "Subject-verb disagreement", "Tense inconsistency"],
  },
  {
    sentence: "The senator's aide confided that moral in the office had plummeted since the news of the ongoing ethics investigation became public.",
    violation: "Diction error ('moral' should be 'morale')",
    distractors: ["Tense inconsistency", "Subject-verb disagreement", "Pronoun-antecedent disagreement"],
  },
  {
    sentence: "The anthropologist noted that the indigenous community's oral traditions serve as a valuable compliment to the written historical record maintained by colonial administrators.",
    violation: "Diction error ('compliment' should be 'complement')",
    distractors: ["Tense inconsistency", "Restrictive clause error", "Subject-verb disagreement"],
  },
  {
    sentence: "The amount of doctoral candidates accepted into the program this year was significantly lower than the department had anticipated.",
    violation: "Diction error ('amount' should be 'number' for countable nouns)",
    distractors: ["Subject-verb disagreement", "Faulty comparison", "Tense inconsistency"],
  },
  {
    sentence: "The emigration policies of the host country have made it exceedingly difficult for refugees to obtain legal residency status.",
    violation: "Diction error ('emigration' should be 'immigration')",
    distractors: ["Subject-verb disagreement", "Tense inconsistency", "Pronoun-antecedent disagreement"],
  },
  {
    sentence: "The physiologist discovered that the adverse affects of the experimental compound on liver function were far more severe than the animal models had predicted.",
    violation: "Diction error ('affects' should be 'effects')",
    distractors: ["Subject-verb disagreement", "Faulty comparison", "Tense inconsistency"],
  },
  {
    sentence: "The disinterested spectators in the gallery yawned audibly as the attorney droned on through his two-hour closing argument.",
    violation: "Diction error ('disinterested' should be 'uninterested'; 'disinterested' means impartial)",
    distractors: ["Misplaced modifier", "Subject-verb disagreement", "Tense inconsistency"],
  },
  {
    sentence: "The less participants who enroll in the experimental cohort, the more difficult it will be to achieve statistical significance in the results.",
    violation: "Diction error ('less' should be 'fewer' for countable nouns)",
    distractors: ["Faulty comparison", "Subject-verb disagreement", "Conditional tense error"],
  },
  {
    sentence: "The council decided to precede with the demolition of the condemned building despite vigorous opposition from the historical preservation society.",
    violation: "Diction error ('precede' should be 'proceed')",
    distractors: ["Tense inconsistency", "Subject-verb disagreement", "Pronoun-antecedent disagreement"],
  },
  {
    sentence: "The prosecutor presented the evidence in such a manor that even the most skeptical jurors found the defendant's alibi increasingly implausible.",
    violation: "Diction error ('manor' should be 'manner')",
    distractors: ["Faulty comparison", "Subject-verb disagreement", "Tense inconsistency"],
  },

  // ============================================================
  // ILLOGICAL COMPARISONS (181–195)
  // ============================================================
  {
    sentence: "The research output of the new laboratory is more impressive than any laboratory in the consortium.",
    violation: "Illogical comparison (comparing to 'any' laboratory, which includes itself)",
    distractors: ["Faulty comparison", "Subject-verb disagreement", "Pronoun-antecedent disagreement"],
  },
  {
    sentence: "The violinist plays more expressively than anyone in the orchestra.",
    violation: "Illogical comparison (the violinist is part of the orchestra, so 'anyone else' is needed)",
    distractors: ["Faulty comparison", "Pronoun-antecedent disagreement", "Subject-verb disagreement"],
  },
  {
    sentence: "This year's applicant pool is stronger than any year since the program's founding in 2003.",
    violation: "Illogical comparison (comparing pool to year instead of to another pool)",
    distractors: ["Faulty comparison", "Tense inconsistency", "Subject-verb disagreement"],
  },
  {
    sentence: "The professor has published more peer-reviewed articles than any scholar in the department.",
    violation: "Illogical comparison (the professor is a scholar in the department, so 'any other' is needed)",
    distractors: ["Faulty comparison", "Subject-verb disagreement", "Pronoun-antecedent disagreement"],
  },
  {
    sentence: "New York City has a higher population density than any city in the United States.",
    violation: "Illogical comparison (NYC is a city in the United States, so 'any other' is needed)",
    distractors: ["Faulty comparison", "Subject-verb disagreement", "Misplaced modifier"],
  },
  {
    sentence: "The quarterback's passing accuracy this season is better than last season.",
    violation: "Illogical comparison (comparing accuracy to season instead of to last season's accuracy)",
    distractors: ["Faulty comparison", "Tense inconsistency", "Subject-verb disagreement"],
  },
  {
    sentence: "The hospital's mortality rate for cardiac surgery is lower than any hospital in the region.",
    violation: "Illogical comparison (comparing rate to hospital)",
    distractors: ["Faulty comparison", "Subject-verb disagreement", "Misplaced modifier"],
  },
  {
    sentence: "The cellist's technique is as refined, if not more so, as any musician who has performed at Carnegie Hall.",
    violation: "Illogical comparison (incomplete comparative: 'as refined as...if not more refined than')",
    distractors: ["Faulty comparison", "Parallel structure violation", "Subject-verb disagreement"],
  },
  {
    sentence: "China produces more steel annually than any country in the world.",
    violation: "Illogical comparison (China is a country in the world, so 'any other' is needed)",
    distractors: ["Faulty comparison", "Subject-verb disagreement", "Tense inconsistency"],
  },
  {
    sentence: "The enrollment figures for the fall semester were higher than the spring.",
    violation: "Illogical comparison (comparing figures to spring instead of to spring's figures)",
    distractors: ["Faulty comparison", "Tense inconsistency", "Subject-verb disagreement"],
  },
  {
    sentence: "The novelist's prose style is more lyrical than any writer of her generation.",
    violation: "Illogical comparison (comparing style to writer)",
    distractors: ["Faulty comparison", "Pronoun-antecedent disagreement", "Subject-verb disagreement"],
  },
  {
    sentence: "The university's endowment has grown faster than any institution in the state system.",
    violation: "Illogical comparison (comparing endowment to institution)",
    distractors: ["Faulty comparison", "Subject-verb disagreement", "Tense inconsistency"],
  },
  {
    sentence: "The temperature readings from the Arctic monitoring station were more alarming than the Antarctic.",
    violation: "Illogical comparison (comparing readings to the Antarctic region)",
    distractors: ["Faulty comparison", "Tense inconsistency", "Subject-verb disagreement"],
  },
  {
    sentence: "Shakespeare's plays are performed more frequently than any playwright in the Western canon.",
    violation: "Illogical comparison (comparing plays to playwright)",
    distractors: ["Faulty comparison", "Subject-verb disagreement", "Pronoun-antecedent disagreement"],
  },
  {
    sentence: "The patient's recovery time after the minimally invasive procedure was shorter than the traditional surgery.",
    violation: "Illogical comparison (comparing recovery time to surgery instead of to traditional surgery's recovery time)",
    distractors: ["Faulty comparison", "Tense inconsistency", "Subject-verb disagreement"],
  },

  // ============================================================
  // COMMA ERRORS (196–220)
  // ============================================================
  {
    sentence: "The tall, distinguished, silver-haired gentleman in the corner booth has been waiting for his dinner companion for over an hour.",
    violation: "Comma error (no comma should separate 'distinguished' from 'silver-haired' as they are cumulative adjectives)",
    distractors: ["Misplaced modifier", "Subject-verb disagreement", "Tense inconsistency"],
  },
  {
    sentence: "The poet laureate read her latest work at the ceremony, and received a standing ovation from the assembled dignitaries.",
    violation: "Comma error (no comma before 'and' with compound predicate, not compound sentence)",
    distractors: ["Comma splice", "Parallel structure violation", "Tense inconsistency"],
  },
  {
    sentence: "The ancient crumbling stone walls of the fortress still stand as a testament to the engineering prowess of the medieval builders.",
    violation: "Missing comma ('ancient' and 'crumbling' are coordinate adjectives and need a comma between them)",
    distractors: ["Misplaced modifier", "Subject-verb disagreement", "Tense inconsistency"],
  },
  {
    sentence: "The senator's proposal, which had been debated extensively in committee was finally brought to the full chamber for a vote.",
    violation: "Missing comma (nonrestrictive clause requires closing comma after 'committee')",
    distractors: ["Restrictive clause error", "Subject-verb disagreement", "Tense inconsistency"],
  },
  {
    sentence: "Before the keynote address could begin the technical crew needed to resolve a persistent audio feedback problem in the main auditorium.",
    violation: "Missing comma after introductory adverbial clause",
    distractors: ["Run-on sentence", "Subject-verb disagreement", "Tense inconsistency"],
  },
  {
    sentence: "The renowned, Brazilian architect designed the cultural center that has become the most visited attraction in the metropolitan area.",
    violation: "Comma error (no comma between 'renowned' and 'Brazilian' — nationality adjective is cumulative, not coordinate)",
    distractors: ["Misplaced modifier", "Restrictive clause error", "Subject-verb disagreement"],
  },
  {
    sentence: "The patient who had been experiencing chest pains for several days, was finally admitted to the cardiac care unit for observation.",
    violation: "Comma error (restrictive clause should not be followed by a comma before the main verb)",
    distractors: ["Restrictive clause error", "Subject-verb disagreement", "Tense inconsistency"],
  },
  {
    sentence: "On the other hand the committee's revised proposal addresses many of the concerns raised during the public comment period.",
    violation: "Missing comma after introductory transitional phrase 'On the other hand'",
    distractors: ["Run-on sentence", "Subject-verb disagreement", "Tense inconsistency"],
  },
  {
    sentence: "The expedition required several essential items including climbing ropes, carabiners, ice axes, and insulated tents rated for extreme temperatures.",
    violation: "Missing comma before 'including' when introducing a nonrestrictive list",
    distractors: ["Parallel structure violation", "Comma splice", "Subject-verb disagreement"],
  },
  {
    sentence: "The manuscript was completed on March 15 2024 and submitted to the publisher the following week for editorial review.",
    violation: "Missing comma after the year in a date ('March 15, 2024,')",
    distractors: ["Tense inconsistency", "Passive voice misuse", "Subject-verb disagreement"],
  },
  {
    sentence: "Well the results of the investigation were not entirely what the oversight committee had expected when they initiated the inquiry.",
    violation: "Missing comma after introductory interjection 'Well'",
    distractors: ["Run-on sentence", "Pronoun-antecedent disagreement", "Tense inconsistency"],
  },
  {
    sentence: "The CEO, and the CFO presented the quarterly earnings report to a skeptical audience of financial analysts and institutional investors.",
    violation: "Incorrect comma (no comma should separate compound subject joined by 'and')",
    distractors: ["Subject-verb disagreement", "Parallel structure violation", "Pronoun-antecedent disagreement"],
  },
  {
    sentence: "Nevertheless the archaeological team decided to continue excavating despite the approaching monsoon season and the increasingly unstable terrain.",
    violation: "Missing comma after introductory conjunctive adverb 'Nevertheless'",
    distractors: ["Run-on sentence", "Tense inconsistency", "Subject-verb disagreement"],
  },
  {
    sentence: "The bright, red, vintage convertible parked in the faculty lot attracted considerable attention from passersby throughout the afternoon.",
    violation: "Comma error (no comma between 'red' and 'vintage' as they are cumulative adjectives)",
    distractors: ["Misplaced modifier", "Subject-verb disagreement", "Tense inconsistency"],
  },
  {
    sentence: "The philosopher Immanuel Kant, who spent his entire life in Konigsberg revolutionized Western epistemology with his Critique of Pure Reason.",
    violation: "Missing comma (nonrestrictive clause requires closing comma after 'Konigsberg')",
    distractors: ["Restrictive clause error", "Tense inconsistency", "Subject-verb disagreement"],
  },
  {
    sentence: "Although the defendant's attorney objected strenuously to the admission of the forensic evidence the judge overruled the motion after careful consideration.",
    violation: "Missing comma after introductory adverbial clause",
    distractors: ["Run-on sentence", "Subject-verb disagreement", "Tense inconsistency"],
  },
  {
    sentence: "The orchestra performed Beethoven's Ninth Symphony, and the audience erupted in a prolonged standing ovation that lasted over five minutes.",
    violation: "No error (trick item: comma before 'and' is correct between independent clauses)",
    distractors: ["Comma splice", "Comma error", "Run-on sentence"],
  },
  {
    sentence: "The study published in the New England Journal of Medicine, found that the experimental treatment significantly reduced tumor size in a majority of patients.",
    violation: "Comma error (comma incorrectly separates subject from verb)",
    distractors: ["Passive voice misuse", "Subject-verb disagreement", "Restrictive clause error"],
  },
  {
    sentence: "Dr. Harrison the department's most senior faculty member announced her retirement after thirty-seven years of distinguished service to the university.",
    violation: "Missing commas around appositive phrase 'the department's most senior faculty member'",
    distractors: ["Run-on sentence", "Subject-verb disagreement", "Misplaced modifier"],
  },
  {
    sentence: "The hikers who had been warned about the approaching storm, decided to press on toward the summit despite the deteriorating weather conditions.",
    violation: "Comma error (restrictive clause should not be followed by a comma)",
    distractors: ["Restrictive clause error", "Dangling modifier", "Subject-verb disagreement"],
  },
  {
    sentence: "To be perfectly honest the entire reorganization plan seems poorly conceived and likely to cause more disruption than it prevents.",
    violation: "Missing comma after introductory infinitive phrase",
    distractors: ["Split infinitive", "Run-on sentence", "Faulty comparison"],
  },
  {
    sentence: "The laboratory director a meticulous and demanding supervisor insisted that every experiment be repeated at least three times before results were reported.",
    violation: "Missing commas around appositive phrase 'a meticulous and demanding supervisor'",
    distractors: ["Subjunctive mood error", "Run-on sentence", "Subject-verb disagreement"],
  },
  {
    sentence: "After reviewing the preliminary findings, and consulting with external experts, the committee issued its final recommendations to the board.",
    violation: "Comma error (no comma after 'findings' in a compound gerund phrase within a single introductory element)",
    distractors: ["Dangling modifier", "Parallel structure violation", "Subject-verb disagreement"],
  },
  {
    sentence: "The celebrated, Japanese filmmaker released a new documentary that explores the lasting cultural impact of the Fukushima disaster on rural communities.",
    violation: "Comma error (no comma between 'celebrated' and 'Japanese' — nationality is a cumulative adjective)",
    distractors: ["Misplaced modifier", "Restrictive clause error", "Subject-verb disagreement"],
  },
  {
    sentence: "In the spring of 2023 the university announced a major capital campaign aimed at raising two hundred million dollars for a new research complex.",
    violation: "Missing comma after introductory prepositional phrase",
    distractors: ["Run-on sentence", "Subject-verb disagreement", "Tense inconsistency"],
  },

  // ============================================================
  // SENTENCE FRAGMENTS (221–240)
  // ============================================================
  {
    sentence: "Although the research team had spent over three years collecting data from remote field stations across the Andes and had secured additional funding from two international agencies.",
    violation: "Sentence fragment (subordinate clause with no independent clause)",
    distractors: ["Tense inconsistency", "Run-on sentence", "Parallel structure violation"],
  },
  {
    sentence: "Having been thoroughly reviewed by three independent auditing firms and subjected to an additional round of scrutiny by the regulatory authority.",
    violation: "Sentence fragment (participial phrase with no independent clause)",
    distractors: ["Dangling modifier", "Passive voice misuse", "Tense inconsistency"],
  },
  {
    sentence: "Because the unprecedented severity of the drought had devastated agricultural output across the entire southern region and triggered a humanitarian crisis.",
    violation: "Sentence fragment (subordinate clause with no independent clause)",
    distractors: ["Run-on sentence", "Tense inconsistency", "Subject-verb disagreement"],
  },
  {
    sentence: "Which is precisely why the board of directors convened an emergency session to address the rapidly deteriorating financial situation.",
    violation: "Sentence fragment (relative clause with no antecedent or independent clause)",
    distractors: ["Pronoun-antecedent disagreement", "Tense inconsistency", "Comma splice"],
  },
  {
    sentence: "The senior partner at the firm, a Harvard-educated litigator with over thirty years of experience in international trade disputes and an impeccable record of courtroom victories.",
    violation: "Sentence fragment (noun phrase with appositive but no predicate)",
    distractors: ["Run-on sentence", "Misplaced modifier", "Subject-verb disagreement"],
  },
  {
    sentence: "While the committee deliberated behind closed doors for nearly fourteen hours and the media speculated wildly about the outcome of the internal investigation.",
    violation: "Sentence fragment (subordinate clause with no independent clause)",
    distractors: ["Run-on sentence", "Comma splice", "Tense inconsistency"],
  },
  {
    sentence: "Such as the implementation of stricter emissions standards, the expansion of public transit networks, and the creation of incentives for electric vehicle adoption.",
    violation: "Sentence fragment (prepositional phrase with no independent clause)",
    distractors: ["Parallel structure violation", "Run-on sentence", "Comma splice"],
  },
  {
    sentence: "The distinguished emeritus professor of comparative literature, whose groundbreaking monograph on postcolonial narrative theory had transformed the discipline.",
    violation: "Sentence fragment (noun phrase with relative clause but no main verb)",
    distractors: ["Restrictive clause error", "Run-on sentence", "Tense inconsistency"],
  },
  {
    sentence: "Not only the clinical implications of the discovery but also the profound ethical questions it raises about genetic engineering and human enhancement technologies.",
    violation: "Sentence fragment (noun phrase with correlative conjunction but no predicate)",
    distractors: ["Correlative conjunction error", "Parallel structure violation", "Run-on sentence"],
  },
  {
    sentence: "Including the restoration of the medieval frescoes in the nave, the reinforcement of the flying buttresses, and the replacement of the deteriorating stained-glass windows.",
    violation: "Sentence fragment (participial/prepositional phrase with no independent clause)",
    distractors: ["Parallel structure violation", "Run-on sentence", "Comma splice"],
  },
  {
    sentence: "Even though the defendant's legal team had filed numerous motions to suppress the evidence and had argued persuasively that the search warrant was obtained under false pretenses.",
    violation: "Sentence fragment (subordinate clause with no independent clause)",
    distractors: ["Tense inconsistency", "Run-on sentence", "Parallel structure violation"],
  },
  {
    sentence: "The internationally acclaimed cellist who has performed as a soloist with every major philharmonic orchestra in Europe and who recently completed a critically lauded recording of the Bach Suites.",
    violation: "Sentence fragment (noun phrase with relative clauses but no main verb)",
    distractors: ["Restrictive clause error", "Run-on sentence", "Subject-verb disagreement"],
  },
  {
    sentence: "Regardless of whether the proposed merger receives approval from the antitrust regulators or the shareholders of either company decide to reject the terms.",
    violation: "Sentence fragment (subordinate clause with no independent clause)",
    distractors: ["Run-on sentence", "Correlative conjunction error", "Subject-verb disagreement"],
  },
  {
    sentence: "To investigate the extent to which prolonged exposure to microplastics in drinking water contributes to the development of chronic inflammatory conditions in adults.",
    violation: "Sentence fragment (infinitive phrase with no independent clause)",
    distractors: ["Split infinitive", "Run-on sentence", "Dangling modifier"],
  },
  {
    sentence: "A comprehensive, meticulously researched analysis of the geopolitical factors that led to the collapse of the Ottoman Empire and the subsequent redrawing of national boundaries across the Middle East.",
    violation: "Sentence fragment (noun phrase with no predicate)",
    distractors: ["Run-on sentence", "Misplaced modifier", "Restrictive clause error"],
  },
  {
    sentence: "After the lead prosecutor presented the closing argument, which lasted nearly three hours and included graphic descriptions of the crime scene and emotional appeals to the jury's sense of justice.",
    violation: "Sentence fragment (subordinate clause with embedded relative clause but no independent clause)",
    distractors: ["Run-on sentence", "Tense inconsistency", "Comma splice"],
  },
  {
    sentence: "Especially considering the fact that three previous attempts to reform the immigration system had failed spectacularly in the legislature.",
    violation: "Sentence fragment (adverbial phrase with no independent clause)",
    distractors: ["Tense inconsistency", "Run-on sentence", "Subject-verb disagreement"],
  },
  {
    sentence: "The newly appointed chancellor of the university, a former diplomat who had served as the ambassador to four countries and who was widely respected for her administrative acumen.",
    violation: "Sentence fragment (noun phrase with appositives but no predicate)",
    distractors: ["Run-on sentence", "Restrictive clause error", "Pronoun-antecedent disagreement"],
  },
  {
    sentence: "Given that the preliminary results from the Phase II clinical trial were far more promising than anyone on the research team had dared to hope.",
    violation: "Sentence fragment (subordinate clause with no independent clause)",
    distractors: ["Faulty comparison", "Run-on sentence", "Tense inconsistency"],
  },
  {
    sentence: "For example, the dramatic increase in antibiotic-resistant bacteria in hospital settings and the corresponding rise in post-surgical infection rates over the past decade.",
    violation: "Sentence fragment (noun phrase introduced by transitional expression but no predicate)",
    distractors: ["Parallel structure violation", "Run-on sentence", "Comma splice"],
  },

  // ============================================================
  // COLON AND SEMICOLON ERRORS (241–260)
  // ============================================================
  {
    sentence: "The expedition required: climbing ropes, ice axes, crampons, insulated tents, and enough freeze-dried provisions to last three weeks at high altitude.",
    violation: "Colon error (colon should not separate a verb from its direct object)",
    distractors: ["Comma splice", "Parallel structure violation", "Run-on sentence"],
  },
  {
    sentence: "The three finalists were: Dr. Patel from the molecular biology department, Professor Okoro from the school of public health, and Dr. Chen from the neuroscience institute.",
    violation: "Colon error (colon should not separate a linking verb from its complement)",
    distractors: ["Parallel structure violation", "Comma splice", "Subject-verb disagreement"],
  },
  {
    sentence: "The committee's report highlighted several deficiencies, including: outdated laboratory equipment, insufficient staffing levels, and a lack of standardized safety protocols.",
    violation: "Colon error (colon should not follow 'including')",
    distractors: ["Parallel structure violation", "Comma splice", "Run-on sentence"],
  },
  {
    sentence: "The researchers traveled to: Peru, Ecuador, Colombia, and Brazil to collect soil samples from tropical rainforest ecosystems at various elevations.",
    violation: "Colon error (colon should not separate a preposition from its object)",
    distractors: ["Parallel structure violation", "Run-on sentence", "Misplaced modifier"],
  },
  {
    sentence: "The museum's permanent collection consists of: Renaissance paintings, Baroque sculptures, Impressionist watercolors, and a small but significant collection of Art Deco furniture.",
    violation: "Colon error (colon should not separate a preposition from its object)",
    distractors: ["Parallel structure violation", "Comma splice", "Subject-verb disagreement"],
  },
  {
    sentence: "The candidate's qualifications include: an MBA from a top-tier business school, ten years of executive experience, and fluency in three languages.",
    violation: "Colon error (colon should not separate a verb from its direct object)",
    distractors: ["Parallel structure violation", "Comma splice", "Run-on sentence"],
  },
  {
    sentence: "The historian argued that; the collapse of the empire was caused by a combination of economic stagnation, military overextension, and bureaucratic corruption.",
    violation: "Semicolon error (semicolon incorrectly used where no punctuation or a colon is needed)",
    distractors: ["Comma splice", "Run-on sentence", "Parallel structure violation"],
  },
  {
    sentence: "The orchestra performed Brahms's Fourth Symphony; and received a standing ovation from the capacity audience at the concert hall.",
    violation: "Semicolon error (semicolon should not precede a coordinating conjunction joining a compound predicate)",
    distractors: ["Comma splice", "Parallel structure violation", "Run-on sentence"],
  },
  {
    sentence: "The panel included experts from three fields; medicine, law, and ethics; who debated the implications of the new genetic testing legislation.",
    violation: "Semicolon error (semicolons incorrectly used in a simple list without internal commas)",
    distractors: ["Comma splice", "Parallel structure violation", "Restrictive clause error"],
  },
  {
    sentence: "The project manager identified three critical risks, the supply chain disruption in Southeast Asia; the pending regulatory changes in the European Union; and the ongoing labor dispute at the manufacturing facility.",
    violation: "Semicolon error (inconsistent use of comma then semicolons in a list; should use colon before list)",
    distractors: ["Comma splice", "Parallel structure violation", "Run-on sentence"],
  },
  {
    sentence: "The professor assigned three texts for the seminar: however, she warned the students that additional readings might be required as the semester progressed.",
    violation: "Colon error (colon incorrectly used before a conjunctive adverb; should be semicolon)",
    distractors: ["Comma splice", "Run-on sentence", "Tense inconsistency"],
  },
  {
    sentence: "The CEO made her position clear, the company would not negotiate with the union until the illegal work stoppage ended.",
    violation: "Colon needed (comma should be a colon before an explanatory independent clause)",
    distractors: ["Comma splice", "Run-on sentence", "Subject-verb disagreement"],
  },
  {
    sentence: "The new policy affects; all full-time employees, part-time contractors, and temporary staff working more than twenty hours per week.",
    violation: "Semicolon error (semicolon incorrectly separates a verb from its object)",
    distractors: ["Comma splice", "Parallel structure violation", "Subject-verb disagreement"],
  },
  {
    sentence: "The laboratory was equipped with state-of-the-art instruments, including a mass spectrometer; a centrifuge; and an electron microscope.",
    violation: "Semicolon error (semicolons in a simple list without internal commas; commas should be used)",
    distractors: ["Parallel structure violation", "Comma splice", "Run-on sentence"],
  },
  {
    sentence: "Three factors contributed to the project's failure: poor communication among team members, inadequate funding from the sponsoring agency, unrealistic deadlines imposed by the client.",
    violation: "Missing conjunction or semicolon (list after colon needs 'and' before final item or semicolons if items have internal commas)",
    distractors: ["Comma splice", "Parallel structure violation", "Run-on sentence"],
  },
  {
    sentence: "The study's conclusions were unambiguous; childhood nutrition programs significantly reduce the incidence of developmental delays in underserved populations.",
    violation: "No error (trick item: semicolon correctly joins two related independent clauses)",
    distractors: ["Comma splice", "Colon error", "Run-on sentence"],
  },
  {
    sentence: "Although the evidence was compelling; the jury remained divided on the question of whether the defendant had acted with premeditated intent.",
    violation: "Semicolon error (semicolon should not join a dependent clause to an independent clause; use comma)",
    distractors: ["Comma splice", "Run-on sentence", "Tense inconsistency"],
  },
  {
    sentence: "The department chair, Dr. Ramirez; announced that the hiring freeze would be lifted effective immediately.",
    violation: "Semicolon error (semicolon incorrectly used after an appositive; should be comma)",
    distractors: ["Comma splice", "Subject-verb disagreement", "Run-on sentence"],
  },
  {
    sentence: "The report identified several areas for improvement, such as: laboratory safety procedures, data management protocols, and equipment maintenance schedules.",
    violation: "Colon error (colon should not follow 'such as')",
    distractors: ["Parallel structure violation", "Comma splice", "Run-on sentence"],
  },
  {
    sentence: "The university offers degrees in three broad areas; the natural sciences, the social sciences, and the humanities.",
    violation: "Semicolon error (should be a colon to introduce a list that explains the preceding clause)",
    distractors: ["Comma splice", "Parallel structure violation", "Run-on sentence"],
  },

  // ============================================================
  // TENSE CONSISTENCY ERRORS (261–280)
  // ============================================================
  {
    sentence: "The novelist spent five years writing the manuscript, submits it to seven publishers, and finally secured a contract with a small independent press.",
    violation: "Tense inconsistency ('submits' breaks the past tense pattern of 'spent' and 'secured')",
    distractors: ["Parallel structure violation", "Comma splice", "Subject-verb disagreement"],
  },
  {
    sentence: "The geologists examined the core samples, analyzed the mineral composition, and are concluding that the formation was significantly older than previously estimated.",
    violation: "Tense inconsistency ('are concluding' breaks the past tense pattern of 'examined' and 'analyzed')",
    distractors: ["Parallel structure violation", "Subject-verb disagreement", "Dangling modifier"],
  },
  {
    sentence: "The documentary traces the artist's early career in Paris, depicts her struggles with poverty and illness, and will examine the legacy of her most celebrated works.",
    violation: "Tense inconsistency ('will examine' breaks the present tense pattern of 'traces' and 'depicts')",
    distractors: ["Parallel structure violation", "Subject-verb disagreement", "Tense shift"],
  },
  {
    sentence: "The detective reviewed the surveillance footage, interviews three witnesses, and determined that the suspect had entered the building through the service entrance.",
    violation: "Tense inconsistency ('interviews' breaks the past tense pattern of 'reviewed' and 'determined')",
    distractors: ["Parallel structure violation", "Subject-verb disagreement", "Comma splice"],
  },
  {
    sentence: "The orchestra performs the overture flawlessly, navigated the complex fugue with remarkable precision, and receives a prolonged ovation from the audience.",
    violation: "Tense inconsistency ('navigated' breaks the present tense pattern of 'performs' and 'receives')",
    distractors: ["Parallel structure violation", "Subject-verb disagreement", "Comma splice"],
  },
  {
    sentence: "The company launched the new product in January, expands its distribution network throughout the spring, and reported record revenues by the end of the fiscal year.",
    violation: "Tense inconsistency ('expands' breaks the past tense pattern of 'launched' and 'reported')",
    distractors: ["Parallel structure violation", "Subject-verb disagreement", "Tense shift"],
  },
  {
    sentence: "The astronaut trained for two years at the space center, undergoes a rigorous physical examination, and was selected for the upcoming mission to the International Space Station.",
    violation: "Tense inconsistency ('undergoes' breaks the past tense pattern of 'trained' and 'was selected')",
    distractors: ["Parallel structure violation", "Subject-verb disagreement", "Passive voice misuse"],
  },
  {
    sentence: "In the final chapter, the protagonist confronts her deepest fears, overcame the obstacles placed in her path, and emerges transformed by the ordeal.",
    violation: "Tense inconsistency ('overcame' breaks the present tense pattern of 'confronts' and 'emerges')",
    distractors: ["Parallel structure violation", "Subject-verb disagreement", "Pronoun-antecedent disagreement"],
  },
  {
    sentence: "The curator catalogued the entire collection, organizes the pieces by period and region, and prepared the exhibition for its scheduled opening in September.",
    violation: "Tense inconsistency ('organizes' breaks the past tense pattern of 'catalogued' and 'prepared')",
    distractors: ["Parallel structure violation", "Subject-verb disagreement", "Tense shift"],
  },
  {
    sentence: "The poet draws inspiration from the natural world, incorporated elements of Japanese haiku into her verse, and continues to experiment with unconventional forms.",
    violation: "Tense inconsistency ('incorporated' breaks the present tense pattern of 'draws' and 'continues')",
    distractors: ["Parallel structure violation", "Pronoun-antecedent disagreement", "Subject-verb disagreement"],
  },
  {
    sentence: "The archaeologist meticulously excavated the burial site, documents every artifact with photographs and detailed sketches, and published a comprehensive monograph on the findings.",
    violation: "Tense inconsistency ('documents' breaks the past tense pattern of 'excavated' and 'published')",
    distractors: ["Parallel structure violation", "Subject-verb disagreement", "Dangling modifier"],
  },
  {
    sentence: "The legislature debated the amendment for three weeks, votes on a series of proposed revisions, and ultimately rejected the measure by a narrow margin.",
    violation: "Tense inconsistency ('votes' breaks the past tense pattern of 'debated' and 'rejected')",
    distractors: ["Parallel structure violation", "Subject-verb disagreement", "Comma splice"],
  },
  {
    sentence: "The biochemist isolates the protein from the cell culture, analyzed its structural properties using X-ray crystallography, and publishes the results in a peer-reviewed journal.",
    violation: "Tense inconsistency ('analyzed' breaks the present tense pattern of 'isolates' and 'publishes')",
    distractors: ["Parallel structure violation", "Subject-verb disagreement", "Passive voice misuse"],
  },
  {
    sentence: "The expedition departed from base camp at dawn, traversed the glacier without incident, and is arriving at the summit by early afternoon.",
    violation: "Tense inconsistency ('is arriving' breaks the past tense pattern of 'departed' and 'traversed')",
    distractors: ["Parallel structure violation", "Subject-verb disagreement", "Misplaced modifier"],
  },
  {
    sentence: "The diplomat negotiated tirelessly behind the scenes, brokers a tentative cease-fire agreement, and was credited with averting a full-scale military confrontation.",
    violation: "Tense inconsistency ('brokers' breaks the past tense pattern of 'negotiated' and 'was credited')",
    distractors: ["Parallel structure violation", "Subject-verb disagreement", "Passive voice misuse"],
  },
  {
    sentence: "The philosopher examines the foundations of Western ethics, traced the evolution of utilitarian thought from Bentham to Mill, and argues for a more nuanced approach to moral reasoning.",
    violation: "Tense inconsistency ('traced' breaks the present tense pattern of 'examines' and 'argues')",
    distractors: ["Parallel structure violation", "Subject-verb disagreement", "Tense shift"],
  },
  {
    sentence: "The journalist investigated the corruption allegations for months, writes a series of scathing articles, and was subsequently awarded the Pulitzer Prize for investigative reporting.",
    violation: "Tense inconsistency ('writes' breaks the past tense pattern of 'investigated' and 'was awarded')",
    distractors: ["Parallel structure violation", "Subject-verb disagreement", "Passive voice misuse"],
  },
  {
    sentence: "The surgeon reviewed the patient's imaging scans, consults with the anesthesiologist, and performed the eight-hour operation without a single complication.",
    violation: "Tense inconsistency ('consults' breaks the past tense pattern of 'reviewed' and 'performed')",
    distractors: ["Parallel structure violation", "Subject-verb disagreement", "Tense shift"],
  },
  {
    sentence: "The historian described the social upheaval of the period, analyzes the economic factors that contributed to the revolution, and concluded that the conflict was inevitable.",
    violation: "Tense inconsistency ('analyzes' breaks the past tense pattern of 'described' and 'concluded')",
    distractors: ["Parallel structure violation", "Subject-verb disagreement", "Restrictive clause error"],
  },
  {
    sentence: "The conductor raised his baton, the orchestra falls silent, and the first notes of the symphony filled the concert hall with an almost palpable sense of anticipation.",
    violation: "Tense inconsistency ('falls' breaks the past tense pattern of 'raised' and 'filled')",
    distractors: ["Comma splice", "Subject-verb disagreement", "Parallel structure violation"],
  },

  // ============================================================
  // REDUNDANCY AND WORDINESS ERRORS (281–300)
  // ============================================================
  {
    sentence: "The two co-authors both collaborated together on the groundbreaking study that fundamentally altered the field's understanding of prion diseases.",
    violation: "Redundancy ('co-authors both collaborated together' contains triple redundancy)",
    distractors: ["Subject-verb disagreement", "Pronoun-antecedent disagreement", "Tense inconsistency"],
  },
  {
    sentence: "The consensus of opinion among the panelists was that the proposed merger would have a detrimental impact on consumer prices in the telecommunications sector.",
    violation: "Redundancy ('consensus of opinion' — consensus already means agreement of opinion)",
    distractors: ["Subject-verb disagreement", "Faulty comparison", "Tense inconsistency"],
  },
  {
    sentence: "The autopsy report revealed that the true facts of the case had been deliberately concealed from the district attorney's office for over six months.",
    violation: "Redundancy ('true facts' — facts are by definition true)",
    distractors: ["Passive voice misuse", "Tense inconsistency", "Pronoun-antecedent disagreement"],
  },
  {
    sentence: "Each and every individual member of the faculty is required to submit their annual performance review by the end of the spring semester.",
    violation: "Redundancy ('each and every individual member' — quadruple redundancy)",
    distractors: ["Pronoun-antecedent disagreement", "Subject-verb disagreement", "Parallel structure violation"],
  },
  {
    sentence: "The end result of the protracted negotiations was a compromise that neither delegation considered satisfactory but both were willing to accept.",
    violation: "Redundancy ('end result' — a result is inherently an end product)",
    distractors: ["Pronoun-antecedent disagreement", "Subject-verb disagreement", "Parallel structure violation"],
  },
  {
    sentence: "The CEO made a brief summary of the annual report's key findings during the first fifteen minutes of the shareholders' meeting.",
    violation: "Redundancy ('brief summary' — a summary is inherently brief)",
    distractors: ["Misplaced modifier", "Tense inconsistency", "Subject-verb disagreement"],
  },
  {
    sentence: "The archaeologist discovered a previously unknown artifact that had never before been documented in any existing scholarly publication.",
    violation: "Redundancy ('previously unknown...never before been documented' and 'existing' is redundant)",
    distractors: ["Tense inconsistency", "Passive voice misuse", "Subject-verb disagreement"],
  },
  {
    sentence: "The committee plans to revert back to the original admissions criteria that were in effect prior to the implementation of the revised standards.",
    violation: "Redundancy ('revert back' — revert already means to go back)",
    distractors: ["Tense inconsistency", "Subject-verb disagreement", "Restrictive clause error"],
  },
  {
    sentence: "The astronomer made a new discovery of a hitherto unknown binary star system located in close proximity to the Orion Nebula.",
    violation: "Redundancy ('new discovery', 'hitherto unknown', and 'close proximity' are all redundant phrases)",
    distractors: ["Misplaced modifier", "Subject-verb disagreement", "Tense inconsistency"],
  },
  {
    sentence: "The exact same methodology was employed by both research teams independently, which explains the remarkable convergence of their findings.",
    violation: "Redundancy ('exact same' — 'same' alone suffices)",
    distractors: ["Passive voice misuse", "Pronoun-antecedent disagreement", "Subject-verb disagreement"],
  },
  {
    sentence: "The biography provides a complete and total account of the composer's personal life and professional career from his childhood through his final years.",
    violation: "Redundancy ('complete and total' — either word alone suffices)",
    distractors: ["Parallel structure violation", "Tense inconsistency", "Subject-verb disagreement"],
  },
  {
    sentence: "The witness's sworn affidavit reiterated again the same allegations that had been made in the original complaint filed with the court.",
    violation: "Redundancy ('reiterated again' — reiterate already means to state again)",
    distractors: ["Tense inconsistency", "Passive voice misuse", "Subject-verb disagreement"],
  },
  {
    sentence: "The future plans for the renovation of the historic courthouse include the addition of a new annex and the modernization of the existing courtrooms.",
    violation: "Redundancy ('future plans' — plans are inherently about the future)",
    distractors: ["Parallel structure violation", "Subject-verb disagreement", "Tense inconsistency"],
  },
  {
    sentence: "The CEO personally emphasized the critical importance of maintaining the company's competitive edge in an increasingly volatile global marketplace.",
    violation: "Redundancy ('critical importance' — importance already conveys criticality in context; 'personally' is also redundant with the subject)",
    distractors: ["Misplaced modifier", "Subject-verb disagreement", "Tense inconsistency"],
  },
  {
    sentence: "The two twins share an absolutely unique bond that researchers at the institute have been studying for over fifteen years.",
    violation: "Redundancy ('two twins', 'absolutely unique' — twins implies two; unique cannot be modified)",
    distractors: ["Subject-verb disagreement", "Restrictive clause error", "Tense inconsistency"],
  },
  {
    sentence: "The university's advance planning committee recommended that the institution postpone the construction project until sufficient funding has been secured.",
    violation: "Redundancy ('advance planning' — planning is inherently done in advance)",
    distractors: ["Subjunctive mood error", "Subject-verb disagreement", "Tense inconsistency"],
  },
  {
    sentence: "The detective was able to penetrate into the inner circle of the criminal organization after months of painstaking undercover work.",
    violation: "Redundancy ('penetrate into' — penetrate already means to go into)",
    distractors: ["Tense inconsistency", "Passive voice misuse", "Dangling modifier"],
  },
  {
    sentence: "The philanthropist donated a free gift of ten million dollars to the university's scholarship fund, the largest single contribution in the institution's history.",
    violation: "Redundancy ('free gift' — a gift is by definition free; 'donated a gift' is also redundant)",
    distractors: ["Misplaced modifier", "Subject-verb disagreement", "Appositive error"],
  },
  {
    sentence: "The committee postponed the vote to a later date after several members expressed reservations about the proposed amendment to the charter.",
    violation: "Redundancy ('postponed to a later date' — postponed already implies a later date)",
    distractors: ["Tense inconsistency", "Subject-verb disagreement", "Pronoun-antecedent disagreement"],
  },
  {
    sentence: "The unexpected surprise announcement that the company would be acquired by its largest competitor sent shockwaves through the financial markets.",
    violation: "Redundancy ('unexpected surprise' — a surprise is by definition unexpected)",
    distractors: ["Subject-verb disagreement", "Passive voice misuse", "Tense inconsistency"],
  },

  // ============================================================
  // MIXED ADVANCED ERRORS (301–330)
  // ============================================================
  {
    sentence: "The data shows that the intervention was effective, however the sample size was too small to draw definitive conclusions about its applicability to the general population.",
    violation: "Comma splice with conjunctive adverb ('however' requires semicolon before it when joining independent clauses)",
    distractors: ["Run-on sentence", "Subject-verb disagreement", "Tense inconsistency"],
  },
  {
    sentence: "Laying in bed for three consecutive days with a high fever and severe congestion, the doctoral student missed the deadline for submitting her qualifying examination portfolio.",
    violation: "Diction error ('laying' should be 'lying'; 'lay' requires a direct object)",
    distractors: ["Dangling modifier", "Tense inconsistency", "Pronoun-antecedent disagreement"],
  },
  {
    sentence: "The museum's collection is considered to be one of the most unique assemblages of pre-Columbian artifacts anywhere in the Western Hemisphere.",
    violation: "Diction error ('most unique' — unique is an absolute adjective and cannot be modified by 'most')",
    distractors: ["Faulty comparison", "Subject-verb disagreement", "Redundancy error"],
  },
  {
    sentence: "The department chair, along with the three associate deans who oversee the graduate programs, were responsible for reviewing all tenure applications submitted during the spring cycle.",
    violation: "Subject-verb disagreement ('department chair' is the subject; 'along with' does not compound it; should be 'was')",
    distractors: ["Pronoun-antecedent disagreement", "Tense inconsistency", "Restrictive clause error"],
  },
  {
    sentence: "Whomever designed the new curriculum clearly did not take into account the significant variation in preparation levels among incoming first-year students.",
    violation: "Pronoun case error ('whomever' should be 'whoever' as subject of 'designed')",
    distractors: ["Subject-verb disagreement", "Pronoun-antecedent disagreement", "Dangling modifier"],
  },
  {
    sentence: "The therapy is equally as effective as the standard treatment protocol and has the additional advantage of producing fewer adverse side effects.",
    violation: "Diction error ('equally as effective as' is redundant; use 'as effective as' or 'equally effective')",
    distractors: ["Faulty comparison", "Redundancy error", "Subject-verb disagreement"],
  },
  {
    sentence: "Neither the physicists at CERN nor the theoretical team at MIT were able to reproduce the anomalous results that had generated so much excitement in the scientific community.",
    violation: "Subject-verb disagreement (with 'neither...nor,' verb agrees with nearest subject 'team,' which is singular: 'was')",
    distractors: ["Correlative conjunction error", "Tense inconsistency", "Pronoun-antecedent disagreement"],
  },
  {
    sentence: "The reason the clinical trial was terminated ahead of schedule is because an unacceptable number of participants in the treatment arm experienced severe neurological side effects.",
    violation: "Faulty predication (reason...is because; should be 'reason...is that')",
    distractors: ["Redundancy error", "Subject-verb disagreement", "Tense inconsistency"],
  },
  {
    sentence: "Between the four competing proposals, the committee ultimately selected the one that promised the most cost-effective approach to infrastructure modernization.",
    violation: "Diction error ('between' should be 'among' when referring to more than two items)",
    distractors: ["Faulty comparison", "Subject-verb disagreement", "Pronoun-antecedent disagreement"],
  },
  {
    sentence: "The painting, along with several sketches and a handwritten letter attributed to the artist, were authenticated by a panel of independent experts.",
    violation: "Subject-verb disagreement ('painting' is the subject; 'along with' doesn't compound it; should be 'was authenticated')",
    distractors: ["Parallel structure violation", "Pronoun-antecedent disagreement", "Tense inconsistency"],
  },
  {
    sentence: "Irregardless of the committee's recommendations, the board of trustees voted unanimously to proceed with the controversial campus expansion project.",
    violation: "Diction error ('irregardless' is nonstandard; should be 'regardless')",
    distractors: ["Subject-verb disagreement", "Pronoun-antecedent disagreement", "Tense inconsistency"],
  },
  {
    sentence: "The professor told the class that the exam would test they're understanding of the core concepts covered during the first eight weeks of the semester.",
    violation: "Diction error ('they're' should be 'their')",
    distractors: ["Pronoun-antecedent disagreement", "Subject-verb disagreement", "Tense inconsistency"],
  },
  {
    sentence: "Had the defendant been more forthcoming about his financial assets during the discovery phase, the settlement negotiations would not have been delayed for six additional months, nor the judge would not have imposed sanctions for noncompliance.",
    violation: "Inverted conditional error ('nor the judge would not have' should be 'nor would the judge have'; double negative and wrong word order)",
    distractors: ["Correlative conjunction error", "Conditional tense error", "Tense inconsistency"],
  },
  {
    sentence: "The criteria for evaluating the grant proposals includes the originality of the research question, the feasibility of the methodology, and the potential for real-world application.",
    violation: "Subject-verb disagreement ('criteria' is plural and requires 'include')",
    distractors: ["Parallel structure violation", "Tense inconsistency", "Pronoun-antecedent disagreement"],
  },
  {
    sentence: "Not only did the hurricane destroy hundreds of homes along the coast, and it also disrupted the region's electrical grid for nearly three weeks.",
    violation: "Correlative conjunction error ('not only...and also' should be 'not only...but also')",
    distractors: ["Comma splice", "Run-on sentence", "Parallel structure violation"],
  },
  {
    sentence: "The team of researchers, along with their collaborators at three partner institutions, has been working on the project for over a decade and have recently published their initial findings.",
    violation: "Subject-verb disagreement (shift from correct singular 'has' to incorrect plural 'have' mid-sentence)",
    distractors: ["Tense inconsistency", "Pronoun-antecedent disagreement", "Parallel structure violation"],
  },
  {
    sentence: "Each of the witnesses were asked to provide a written statement detailing what they had observed on the evening in question.",
    violation: "Subject-verb disagreement ('each' is singular and requires 'was asked')",
    distractors: ["Pronoun-antecedent disagreement", "Tense inconsistency", "Passive voice misuse"],
  },
  {
    sentence: "The archaeological evidence, which the team spent four field seasons collecting from sites scattered across the Yucatan Peninsula, strongly suggest that the civilization's decline was more gradual than catastrophic.",
    violation: "Subject-verb disagreement ('evidence' is singular and requires 'suggests')",
    distractors: ["Restrictive clause error", "Tense inconsistency", "Faulty comparison"],
  },
  {
    sentence: "If the researcher would have controlled for the confounding variable, the results of the study would have been far more reliable and the conclusions more defensible.",
    violation: "Conditional tense error ('would have' should be 'had' in the if-clause)",
    distractors: ["Subjunctive mood error", "Parallel structure violation", "Tense inconsistency"],
  },
  {
    sentence: "The company's profits this quarter are significantly more higher than the analysts had projected in their most optimistic forecasts.",
    violation: "Double comparative ('more higher' should be simply 'higher')",
    distractors: ["Faulty comparison", "Subject-verb disagreement", "Tense inconsistency"],
  },
  {
    sentence: "The board mandated that each department submits a revised budget proposal by the end of the month and that all discretionary spending is frozen until further notice.",
    violation: "Subjunctive mood error ('submits' should be 'submit' and 'is frozen' should be 'be frozen' after mandative verb)",
    distractors: ["Subject-verb disagreement", "Parallel structure violation", "Tense inconsistency"],
  },
  {
    sentence: "The less doctoral students who enroll in the program, the more difficult it becomes to justify the administrative overhead required to maintain accreditation.",
    violation: "Diction error ('less' should be 'fewer' for countable nouns)",
    distractors: ["Faulty comparison", "Subject-verb disagreement", "Conditional tense error"],
  },
  {
    sentence: "Her and the principal investigator presented their joint findings at the international conference, where the audience responded with considerable enthusiasm.",
    violation: "Pronoun case error ('her' should be 'she' as subject of the sentence)",
    distractors: ["Pronoun-antecedent disagreement", "Subject-verb disagreement", "Tense inconsistency"],
  },
  {
    sentence: "The exhibition showcased paintings from the Renaissance, the Baroque period, and also including several important works from the Dutch Golden Age.",
    violation: "Mixed construction ('and also including' conflates two different syntactic structures)",
    distractors: ["Parallel structure violation", "Redundancy error", "Comma splice"],
  },
  {
    sentence: "The phenomena described in the latest peer-reviewed publication challenges the long-held assumption that tectonic plate movement is the sole driver of volcanic activity.",
    violation: "Subject-verb disagreement ('phenomena' is plural and requires 'challenge')",
    distractors: ["Restrictive clause error", "Tense inconsistency", "Faulty comparison"],
  },
  {
    sentence: "The witness, whom the defense attorney contended was unreliable, provided testimony that proved decisive in securing the conviction.",
    violation: "Pronoun case error ('whom' should be 'who' as subject of 'was unreliable')",
    distractors: ["Restrictive clause error", "Pronoun-antecedent disagreement", "Subject-verb disagreement"],
  },
  {
    sentence: "Being that the evidence was entirely circumstantial, the judge instructed the jury to apply a particularly rigorous standard of proof before reaching a verdict.",
    violation: "Diction error ('being that' is nonstandard; should be 'because' or 'given that')",
    distractors: ["Dangling modifier", "Subject-verb disagreement", "Tense inconsistency"],
  },
  {
    sentence: "The university president, in addition to the provost and three vice presidents, were present at the emergency board meeting convened to discuss the budget crisis.",
    violation: "Subject-verb disagreement ('president' is the subject; 'in addition to' doesn't compound it; should be 'was present')",
    distractors: ["Pronoun-antecedent disagreement", "Tense inconsistency", "Comma splice"],
  },
  {
    sentence: "Try and reconcile the discrepancies in the quarterly financial statements before the external auditors arrive on Monday morning.",
    violation: "Diction error ('try and' should be 'try to')",
    distractors: ["Parallel structure violation", "Subject-verb disagreement", "Tense inconsistency"],
  },
  {
    sentence: "The affects of the new immigration policy on agricultural labor markets have been studied extensively, but policymakers continue to ignore the mounting evidence of workforce shortages.",
    violation: "Diction error ('affects' should be 'effects' when used as a noun)",
    distractors: ["Subject-verb disagreement", "Tense inconsistency", "Comma splice"],
  },
];