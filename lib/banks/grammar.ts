export interface GrammarItem {
  sentence: string;
  violation: string;
  distractors: [string, string, string];
}

export const GRAMMAR_ITEMS: GrammarItem[] = [
  // ============================================================
  // SUBJUNCTIVE MOOD VIOLATIONS (15)
  // ============================================================
  {
    sentence: "The board of directors recommended that the new policy is implemented before the fiscal year ends in March.",
    violation: "Subjunctive mood error",
    distractors: ["Tense inconsistency", "Subject-verb disagreement", "Passive voice misuse"],
  },
  {
    sentence: "If the senator was to reconsider her position on the amendment, the bipartisan coalition might still hold together through the vote.",
    violation: "Subjunctive mood error",
    distractors: ["Conditional tense error", "Pronoun case error", "Comma splice"],
  },
  {
    sentence: "The attorney insisted that his client was given access to the exculpatory evidence before the preliminary hearing commenced.",
    violation: "Subjunctive mood error",
    distractors: ["Tense inconsistency", "Passive voice misuse", "Subject-verb disagreement"],
  },
  {
    sentence: "It is essential that every participant registers their equipment with the safety office no later than forty-eight hours before the expedition departs.",
    violation: "Subjunctive mood error",
    distractors: ["Pronoun-antecedent disagreement", "Tense inconsistency", "Subject-verb disagreement"],
  },
  {
    sentence: "Had the researchers not insisted that each variable was controlled independently, the peer reviewers would have rejected the manuscript outright.",
    violation: "Subjunctive mood error",
    distractors: ["Conditional tense error", "Passive voice misuse", "Tense inconsistency"],
  },
  {
    sentence: "If I was in a position to restructure the department, I would consolidate the three overlapping divisions into a single operational unit.",
    violation: "Subjunctive mood error",
    distractors: ["Conditional tense error", "Pronoun case error", "Parallel structure violation"],
  },
  {
    sentence: "The judge demanded that the defendant surrenders his passport and reports to the probation office every Monday without exception.",
    violation: "Subjunctive mood error",
    distractors: ["Subject-verb disagreement", "Parallel structure violation", "Tense inconsistency"],
  },
  {
    sentence: "If the prime minister was more transparent about the economic data, public trust in the institution would not have eroded so precipitously.",
    violation: "Subjunctive mood error",
    distractors: ["Mixed conditional error", "Tense inconsistency", "Pronoun case error"],
  },
  {
    sentence: "The provost's memorandum stipulated that each graduate student submits a revised thesis proposal by the end of the fall semester.",
    violation: "Subjunctive mood error",
    distractors: ["Subject-verb disagreement", "Tense inconsistency", "Pronoun-antecedent disagreement"],
  },
  {
    sentence: "Were it not for the fact that the committee insists that every applicant provides three references, the process would be far more efficient.",
    violation: "Subjunctive mood error",
    distractors: ["Subject-verb disagreement", "Conditional tense error", "Redundancy error"],
  },
  {
    sentence: "The editorial board proposed that the revised manuscript includes a more comprehensive literature review and a clearer methodological framework.",
    violation: "Subjunctive mood error",
    distractors: ["Parallel structure violation", "Subject-verb disagreement", "Tense inconsistency"],
  },
  {
    sentence: "If she was to accept the fellowship, she would need to relocate to a city where the cost of living far exceeds her current budget.",
    violation: "Subjunctive mood error",
    distractors: ["Conditional tense error", "Faulty comparison", "Pronoun case error"],
  },
  {
    sentence: "The ambassador requested that the foreign minister attends the emergency session in Geneva, but scheduling conflicts made this impossible.",
    violation: "Subjunctive mood error",
    distractors: ["Subject-verb disagreement", "Tense inconsistency", "Comma splice"],
  },
  {
    sentence: "I wish the administration was more forthcoming about the budgetary shortfalls that have plagued the university for the last three fiscal years.",
    violation: "Subjunctive mood error",
    distractors: ["Tense inconsistency", "Subject-verb disagreement", "Redundancy error"],
  },
  {
    sentence: "It is imperative that the lead engineer reviews the structural integrity calculations before the construction crew pours the foundation.",
    violation: "Subjunctive mood error",
    distractors: ["Subject-verb disagreement", "Tense inconsistency", "Misplaced modifier"],
  },

  // ============================================================
  // DANGLING AND MISPLACED MODIFIERS (20)
  // ============================================================
  {
    sentence: "Having been revised extensively over the course of several months, the editorial board finally approved the manuscript for publication in the spring issue.",
    violation: "Dangling modifier",
    distractors: ["Passive voice misuse", "Tense inconsistency", "Subject-verb disagreement"],
  },
  {
    sentence: "Exhausted from the twelve-hour surgery and desperate for a moment of rest, the patient's family was reassured by the lead surgeon in the waiting room.",
    violation: "Dangling modifier",
    distractors: ["Pronoun-antecedent disagreement", "Misplaced modifier", "Comma splice"],
  },
  {
    sentence: "While analyzing the spectroscopic data collected from the Hubble telescope over the previous decade, a previously undetected anomaly in the radiation patterns became apparent to the research team.",
    violation: "Dangling modifier",
    distractors: ["Passive voice misuse", "Tense inconsistency", "Subject-verb disagreement"],
  },
  {
    sentence: "Born into poverty in a small village in the Appalachian Mountains and largely self-educated, the literary critics were astonished by the novelist's sophisticated command of narrative structure.",
    violation: "Dangling modifier",
    distractors: ["Pronoun-antecedent disagreement", "Faulty comparison", "Comma splice"],
  },
  {
    sentence: "To fully appreciate the complexity of the composer's late quartets, a thorough understanding of Baroque counterpoint is required before any meaningful analysis can proceed.",
    violation: "Dangling modifier",
    distractors: ["Split infinitive", "Passive voice misuse", "Subject-verb disagreement"],
  },
  {
    sentence: "After spending nearly a decade conducting fieldwork among indigenous communities in the Amazon basin, the ethnographic findings were published in a monograph that received widespread acclaim.",
    violation: "Dangling modifier",
    distractors: ["Passive voice misuse", "Tense inconsistency", "Pronoun-antecedent disagreement"],
  },
  {
    sentence: "Peering through the electron microscope at magnifications exceeding fifty thousand times, the crystalline structure of the newly synthesized compound revealed itself in unprecedented detail.",
    violation: "Dangling modifier",
    distractors: ["Personification error", "Passive voice misuse", "Subject-verb disagreement"],
  },
  {
    sentence: "Although widely regarded as one of the foremost authorities on medieval Provencal literature, the university denied Professor Harrington tenure for the third consecutive time.",
    violation: "Dangling modifier",
    distractors: ["Comma splice", "Subject-verb disagreement", "Tense inconsistency"],
  },
  {
    sentence: "The CEO announced the quarterly earnings report wearing a tailored navy suit and a confident smile to the assembled shareholders and financial analysts.",
    violation: "Misplaced modifier",
    distractors: ["Dangling modifier", "Parallel structure violation", "Comma splice"],
  },
  {
    sentence: "She told the committee that she had only reviewed the first three chapters of the dissertation hastily before the defense began.",
    violation: "Misplaced modifier",
    distractors: ["Squinting modifier", "Split infinitive", "Dangling modifier"],
  },
  {
    sentence: "The museum displayed a portrait of the duchess that had been painted in the seventeenth century in the east wing gallery alongside works by lesser-known contemporaries.",
    violation: "Misplaced modifier",
    distractors: ["Dangling modifier", "Comma splice", "Tense inconsistency"],
  },
  {
    sentence: "Climbing the steep and treacherous path to the summit under an unrelenting midday sun, the magnificent panoramic vista of the valley unfolded beneath us in every direction.",
    violation: "Dangling modifier",
    distractors: ["Misplaced modifier", "Tense inconsistency", "Subject-verb disagreement"],
  },
  {
    sentence: "The professor only told the graduate students about the research opportunity, not the undergraduates who had also expressed interest in the project.",
    violation: "Misplaced modifier",
    distractors: ["Restrictive clause error", "Pronoun-antecedent disagreement", "Parallel structure violation"],
  },
  {
    sentence: "Raised on a remote cattle station in the Northern Territory with limited access to formal schooling, the sophistication of the artist's technique astounded the Melbourne critics.",
    violation: "Dangling modifier",
    distractors: ["Faulty comparison", "Pronoun-antecedent disagreement", "Comma splice"],
  },
  {
    sentence: "Drenched in sweat and gasping for air after the punishing interval training session, the protein shake was the first thing the athlete reached for in the locker room.",
    violation: "Dangling modifier",
    distractors: ["Misplaced modifier", "Pronoun case error", "Tense inconsistency"],
  },
  {
    sentence: "The researcher discovered a method for synthesizing the compound at room temperature accidentally while cleaning the laboratory equipment late on a Friday afternoon.",
    violation: "Misplaced modifier",
    distractors: ["Dangling modifier", "Split infinitive", "Tense inconsistency"],
  },
  {
    sentence: "Having been thoroughly debunked by multiple peer-reviewed studies over the past two decades, many policymakers continue to cite the discredited theory in their public statements.",
    violation: "Dangling modifier",
    distractors: ["Pronoun-antecedent disagreement", "Tense inconsistency", "Passive voice misuse"],
  },
  {
    sentence: "Funded by a generous grant from the National Science Foundation and equipped with cutting-edge instrumentation, the seismic data collected by the observatory transformed our understanding of plate tectonics.",
    violation: "Dangling modifier",
    distractors: ["Passive voice misuse", "Parallel structure violation", "Subject-verb disagreement"],
  },
  {
    sentence: "He almost drove the entire length of the country in a single day, stopping only once for fuel near the border.",
    violation: "Misplaced modifier",
    distractors: ["Dangling modifier", "Tense inconsistency", "Comma splice"],
  },
  {
    sentence: "Struggling to reconcile the contradictory witness testimonies and the forensic evidence collected at the scene, the verdict reached by the jury surprised no one in the packed courtroom.",
    violation: "Dangling modifier",
    distractors: ["Parallel structure violation", "Pronoun-antecedent disagreement", "Comma splice"],
  },

  // ============================================================
  // CORRELATIVE CONJUNCTION ERRORS (12)
  // ============================================================
  {
    sentence: "The proposed regulation would neither reduce carbon emissions significantly or address the underlying structural incentives that perpetuate fossil fuel dependence.",
    violation: "Correlative conjunction error (neither...or)",
    distractors: ["Parallel structure violation", "Subject-verb disagreement", "Comma splice"],
  },
  {
    sentence: "The fellowship is designed not only to provide financial support but develop the leadership skills necessary for careers in public service and diplomacy.",
    violation: "Correlative conjunction error (not only...but also)",
    distractors: ["Parallel structure violation", "Split infinitive", "Dangling modifier"],
  },
  {
    sentence: "Either the department must hire three additional tenure-track faculty members or it will need to reduce the number of elective courses offered each semester.",
    violation: "Correlative conjunction error (misplaced either)",
    distractors: ["Subject-verb disagreement", "Comma splice", "Parallel structure violation"],
  },
  {
    sentence: "The study concluded that neither the experimental group showed statistically significant improvement or the control group exhibited the expected baseline stability.",
    violation: "Correlative conjunction error (neither...or)",
    distractors: ["Subject-verb disagreement", "Tense inconsistency", "Parallel structure violation"],
  },
  {
    sentence: "The new curriculum not only emphasizes critical thinking and also incorporates project-based learning methodologies across all grade levels.",
    violation: "Correlative conjunction error (not only...and also)",
    distractors: ["Parallel structure violation", "Subject-verb disagreement", "Comma splice"],
  },
  {
    sentence: "Both the architect and the structural engineer was consulted before the city planning commission approved the design for the new pedestrian bridge.",
    violation: "Subject-verb disagreement (correlative conjunction)",
    distractors: ["Correlative conjunction error", "Tense inconsistency", "Pronoun-antecedent disagreement"],
  },
  {
    sentence: "The diplomat stated that neither the proposed ceasefire nor the humanitarian corridor were sufficient to address the crisis unfolding in the region.",
    violation: "Subject-verb disagreement (correlative conjunction)",
    distractors: ["Correlative conjunction error", "Tense inconsistency", "Pronoun case error"],
  },
  {
    sentence: "The candidate's platform promises to not only reform the healthcare system but to also overhaul the tax code and restructure the regulatory agencies.",
    violation: "Correlative conjunction error (misplaced not only)",
    distractors: ["Split infinitive", "Parallel structure violation", "Redundancy error"],
  },
  {
    sentence: "Whether the company decides to expand into Asian markets or to consolidate their European operations will depend on the third-quarter revenue figures.",
    violation: "Pronoun-antecedent disagreement",
    distractors: ["Correlative conjunction error", "Subject-verb disagreement", "Parallel structure violation"],
  },
  {
    sentence: "The professor argued that neither Cartesian dualism nor eliminative materialism provide an adequate account of phenomenal consciousness.",
    violation: "Subject-verb disagreement (correlative conjunction)",
    distractors: ["Correlative conjunction error", "Faulty comparison", "Pronoun-antecedent disagreement"],
  },
  {
    sentence: "Not only did the storm cause widespread flooding, and it also knocked out power to more than three hundred thousand residents across the county.",
    violation: "Correlative conjunction error (not only...and)",
    distractors: ["Comma splice", "Run-on sentence", "Parallel structure violation"],
  },
  {
    sentence: "The grant requires that researchers both publish their findings in peer-reviewed journals and that they present at two national conferences annually.",
    violation: "Correlative conjunction error (misplaced both)",
    distractors: ["Parallel structure violation", "Subjunctive mood error", "Redundancy error"],
  },

  // ============================================================
  // PRONOUN-ANTECEDENT DISAGREEMENT (15)
  // ============================================================
  {
    sentence: "The committee convened an emergency session and, after extensive deliberation lasting well into the evening, announced that they had reached their decision unanimously.",
    violation: "Pronoun-antecedent disagreement (collective noun)",
    distractors: ["Subject-verb disagreement", "Comma splice", "Tense inconsistency"],
  },
  {
    sentence: "If a student wishes to appeal the grade they received on the comprehensive examination, they must submit a formal petition to the academic standards committee within ten business days.",
    violation: "Pronoun-antecedent disagreement (singular/plural)",
    distractors: ["Subject-verb disagreement", "Subjunctive mood error", "Tense inconsistency"],
  },
  {
    sentence: "The corporation released its annual sustainability report, which showed that they had exceeded their carbon reduction targets for the third consecutive year.",
    violation: "Pronoun-antecedent disagreement (shift from 'its' to 'they')",
    distractors: ["Restrictive clause error", "Tense inconsistency", "Subject-verb disagreement"],
  },
  {
    sentence: "Anyone who has completed the prerequisite coursework and passed the qualifying examination can submit their application for the doctoral program.",
    violation: "Pronoun-antecedent disagreement (anyone...their)",
    distractors: ["Subject-verb disagreement", "Parallel structure violation", "Tense inconsistency"],
  },
  {
    sentence: "The jury deliberated for nine days before the foreperson stood and announced that they were hopelessly deadlocked on all seventeen counts.",
    violation: "Pronoun-antecedent disagreement (collective noun)",
    distractors: ["Subject-verb disagreement", "Tense inconsistency", "Ambiguous pronoun reference"],
  },
  {
    sentence: "Neither the principal investigator nor her three research assistants could locate the data set they needed in the laboratory's archival storage system.",
    violation: "Ambiguous pronoun reference",
    distractors: ["Pronoun-antecedent disagreement", "Subject-verb disagreement", "Correlative conjunction error"],
  },
  {
    sentence: "Each of the sixteen regional offices must submit their quarterly compliance report to the central regulatory authority before the fifteenth of every month.",
    violation: "Pronoun-antecedent disagreement (each...their)",
    distractors: ["Subject-verb disagreement", "Tense inconsistency", "Misplaced modifier"],
  },
  {
    sentence: "The orchestra tuned their instruments in a cacophony of discordant sounds before the conductor raised his baton and silence fell across the concert hall.",
    violation: "Pronoun-antecedent disagreement (collective noun)",
    distractors: ["Subject-verb disagreement", "Comma splice", "Tense inconsistency"],
  },
  {
    sentence: "A physician must exercise their best clinical judgment when deciding whether to prescribe an experimental treatment to a terminally ill patient.",
    violation: "Pronoun-antecedent disagreement (singular indefinite)",
    distractors: ["Subject-verb disagreement", "Split infinitive", "Dangling modifier"],
  },
  {
    sentence: "The faculty voted overwhelmingly in favor of the resolution, but they could not agree on the timeline for its implementation across the university.",
    violation: "Pronoun-antecedent disagreement (collective noun)",
    distractors: ["Comma splice", "Subject-verb disagreement", "Tense inconsistency"],
  },
  {
    sentence: "Everybody in the advanced seminar presented their research findings to the visiting scholars, and each one was given detailed written feedback.",
    violation: "Pronoun-antecedent disagreement (everybody...their)",
    distractors: ["Passive voice misuse", "Ambiguous pronoun reference", "Subject-verb disagreement"],
  },
  {
    sentence: "The council has not yet released the findings of its internal investigation, but they are expected to do so before the next public hearing.",
    violation: "Pronoun-antecedent disagreement (shift from 'its' to 'they')",
    distractors: ["Subject-verb disagreement", "Tense inconsistency", "Comma splice"],
  },
  {
    sentence: "No one who witnessed the unprecedented flooding along the eastern seaboard will ever forget what they saw during those harrowing days.",
    violation: "Pronoun-antecedent disagreement (no one...they)",
    distractors: ["Tense inconsistency", "Subject-verb disagreement", "Restrictive clause error"],
  },
  {
    sentence: "The team celebrated their hard-fought victory with a raucous party that lasted well into the early hours of the following morning.",
    violation: "Pronoun-antecedent disagreement (collective noun)",
    distractors: ["Subject-verb disagreement", "Tense inconsistency", "Misplaced modifier"],
  },
  {
    sentence: "Every senator and representative must disclose their financial holdings to the ethics committee within thirty days of assuming office.",
    violation: "Pronoun-antecedent disagreement (every...their)",
    distractors: ["Subject-verb disagreement", "Correlative conjunction error", "Parallel structure violation"],
  },

  // ============================================================
  // SUBTLE COMMA SPLICES (15)
  // ============================================================
  {
    sentence: "The archaeological excavation at the site continued for three additional seasons despite dwindling funding, the team ultimately unearthed artifacts dating to the early Bronze Age.",
    violation: "Comma splice",
    distractors: ["Run-on sentence", "Tense inconsistency", "Dangling modifier"],
  },
  {
    sentence: "The symphony's first movement builds gradually from a whispered pianissimo to an overwhelming fortissimo, the effect on the audience is visceral and immediate.",
    violation: "Comma splice",
    distractors: ["Run-on sentence", "Faulty comparison", "Parallel structure violation"],
  },
  {
    sentence: "The prime minister's approval ratings have plummeted to historic lows in the wake of the scandal, her party is now scrambling to distance itself from the controversy.",
    violation: "Comma splice",
    distractors: ["Run-on sentence", "Pronoun-antecedent disagreement", "Tense inconsistency"],
  },
  {
    sentence: "The defendant maintained his innocence throughout the proceedings, the prosecution presented what they characterized as overwhelming circumstantial evidence.",
    violation: "Comma splice",
    distractors: ["Run-on sentence", "Pronoun-antecedent disagreement", "Tense inconsistency"],
  },
  {
    sentence: "The novelist spent eight years researching and writing the historical epic, it was shortlisted for the National Book Award within months of publication.",
    violation: "Comma splice",
    distractors: ["Run-on sentence", "Pronoun case error", "Tense inconsistency"],
  },
  {
    sentence: "Inflation has eroded the purchasing power of middle-class families across the country, the central bank's decision to raise interest rates has done little to alleviate the pressure.",
    violation: "Comma splice",
    distractors: ["Run-on sentence", "Subject-verb disagreement", "Tense inconsistency"],
  },
  {
    sentence: "The glacier has retreated more than two kilometers over the past century, scientists attribute this dramatic change primarily to rising global temperatures.",
    violation: "Comma splice",
    distractors: ["Run-on sentence", "Subject-verb disagreement", "Faulty comparison"],
  },
  {
    sentence: "The architect envisioned a structure that would harmonize with the surrounding landscape, the final design bore little resemblance to her original concept.",
    violation: "Comma splice",
    distractors: ["Run-on sentence", "Pronoun case error", "Tense inconsistency"],
  },
  {
    sentence: "Several witnesses corroborated the plaintiff's account of events, however the defense attorney argued that their testimonies were inconsistent on key details.",
    violation: "Comma splice (conjunctive adverb)",
    distractors: ["Run-on sentence", "Pronoun-antecedent disagreement", "Misplaced modifier"],
  },
  {
    sentence: "The violinist performed the cadenza with breathtaking virtuosity, the audience sat in stunned silence for several seconds before erupting into applause.",
    violation: "Comma splice",
    distractors: ["Run-on sentence", "Tense inconsistency", "Dangling modifier"],
  },
  {
    sentence: "The experimental drug showed remarkable efficacy in the Phase II trials, consequently the FDA granted it breakthrough therapy designation ahead of the usual schedule.",
    violation: "Comma splice (conjunctive adverb)",
    distractors: ["Run-on sentence", "Subject-verb disagreement", "Tense inconsistency"],
  },
  {
    sentence: "The manuscript had languished in a drawer for nearly forty years, it was only discovered after the author's estate was catalogued by a literary executor.",
    violation: "Comma splice",
    distractors: ["Run-on sentence", "Passive voice misuse", "Tense inconsistency"],
  },
  {
    sentence: "The negotiations between the two delegations collapsed without warning in the early hours of the morning, neither side was willing to make further concessions on the territorial dispute.",
    violation: "Comma splice",
    distractors: ["Run-on sentence", "Correlative conjunction error", "Subject-verb disagreement"],
  },
  {
    sentence: "The algorithm processes approximately fourteen million data points per second, this extraordinary speed enables real-time analysis of global financial markets.",
    violation: "Comma splice",
    distractors: ["Run-on sentence", "Subject-verb disagreement", "Faulty comparison"],
  },
  {
    sentence: "The Renaissance painter's use of chiaroscuro was revolutionary for its time, his contemporaries were slow to adopt the technique despite its dramatic visual impact.",
    violation: "Comma splice",
    distractors: ["Run-on sentence", "Pronoun-antecedent disagreement", "Tense inconsistency"],
  },

  // ============================================================
  // PRONOUN CASE ERRORS (15)
  // ============================================================
  {
    sentence: "Between you and I, the department chair's decision to deny tenure to the most published scholar in the program was politically motivated.",
    violation: "Pronoun case error (objective case required)",
    distractors: ["Pronoun-antecedent disagreement", "Subject-verb disagreement", "Dangling modifier"],
  },
  {
    sentence: "The award was presented to my colleague and I at the annual ceremony by the dean of the graduate school.",
    violation: "Pronoun case error (objective case required)",
    distractors: ["Pronoun-antecedent disagreement", "Passive voice misuse", "Subject-verb disagreement"],
  },
  {
    sentence: "Whom shall I say is calling regarding the position that was advertised in last Sunday's edition of the journal?",
    violation: "Pronoun case error (subjective case required)",
    distractors: ["Subject-verb disagreement", "Restrictive clause error", "Tense inconsistency"],
  },
  {
    sentence: "The dispute between he and the co-author over intellectual property rights delayed publication of the groundbreaking study by nearly two years.",
    violation: "Pronoun case error (objective case required)",
    distractors: ["Pronoun-antecedent disagreement", "Tense inconsistency", "Misplaced modifier"],
  },
  {
    sentence: "Us researchers in the computational linguistics lab have been collaborating with the neuroscience department on a series of cross-disciplinary studies.",
    violation: "Pronoun case error (subjective case required)",
    distractors: ["Subject-verb disagreement", "Pronoun-antecedent disagreement", "Tense inconsistency"],
  },
  {
    sentence: "The conference organizers asked my co-presenter and I to extend our keynote address by an additional fifteen minutes to accommodate the delayed schedule.",
    violation: "Pronoun case error (objective case required)",
    distractors: ["Pronoun-antecedent disagreement", "Subject-verb disagreement", "Parallel structure violation"],
  },
  {
    sentence: "It was him who first proposed the theoretical framework that would later revolutionize the field of quantum chromodynamics.",
    violation: "Pronoun case error (subjective case required)",
    distractors: ["Pronoun-antecedent disagreement", "Tense inconsistency", "Restrictive clause error"],
  },
  {
    sentence: "The fellowship was awarded to whomever demonstrated the most promising original research in the field of epigenetics.",
    violation: "Pronoun case error (subjective case required)",
    distractors: ["Pronoun-antecedent disagreement", "Subject-verb disagreement", "Restrictive clause error"],
  },
  {
    sentence: "Her and the principal investigator co-authored the seminal paper on CRISPR gene-editing applications in agricultural biotechnology.",
    violation: "Pronoun case error (subjective case required)",
    distractors: ["Pronoun-antecedent disagreement", "Subject-verb disagreement", "Tense inconsistency"],
  },
  {
    sentence: "The collaboration between she and her doctoral advisor produced four highly cited publications in top-tier peer-reviewed journals.",
    violation: "Pronoun case error (objective case required)",
    distractors: ["Pronoun-antecedent disagreement", "Subject-verb disagreement", "Tense inconsistency"],
  },
  {
    sentence: "The committee selected whomever had the strongest publication record, regardless of seniority, to lead the new interdisciplinary research center.",
    violation: "Pronoun case error (subjective case required)",
    distractors: ["Pronoun-antecedent disagreement", "Restrictive clause error", "Subject-verb disagreement"],
  },
  {
    sentence: "Give the supplementary materials to whoever you think needs them most among the first-year graduate students in the program.",
    violation: "No error (trick item - 'whoever' is correct as subject of 'needs')",
    distractors: ["Pronoun case error", "Pronoun-antecedent disagreement", "Subject-verb disagreement"],
  },
  {
    sentence: "Just between you and I, the provost's restructuring plan will likely eliminate at least two departments in the College of Arts and Sciences.",
    violation: "Pronoun case error (objective case required)",
    distractors: ["Pronoun-antecedent disagreement", "Subject-verb disagreement", "Tense inconsistency"],
  },
  {
    sentence: "The donors whom the foundation believed were most likely to contribute generously were invited to the exclusive gala at the ambassador's residence.",
    violation: "Pronoun case error (subjective case required)",
    distractors: ["Restrictive clause error", "Pronoun-antecedent disagreement", "Subject-verb disagreement"],
  },
  {
    sentence: "Them publishing the preliminary results without proper peer review undermined the credibility of the entire research program.",
    violation: "Pronoun case error (possessive case required)",
    distractors: ["Pronoun-antecedent disagreement", "Subject-verb disagreement", "Dangling modifier"],
  },

  // ============================================================
  // PARALLEL STRUCTURE VIOLATIONS (15)
  // ============================================================
  {
    sentence: "The strategic plan calls for increasing market share in Southeast Asia, to develop new product lines for European consumers, and the consolidation of distribution channels.",
    violation: "Parallel structure violation",
    distractors: ["Comma splice", "Dangling modifier", "Subject-verb disagreement"],
  },
  {
    sentence: "The successful candidate must demonstrate expertise in quantitative analysis, experience managing cross-functional teams, and be able to communicate complex ideas to non-technical stakeholders.",
    violation: "Parallel structure violation",
    distractors: ["Comma splice", "Subject-verb disagreement", "Pronoun-antecedent disagreement"],
  },
  {
    sentence: "The professor's research interests include computational neuroscience, developing machine-learning algorithms for medical diagnostics, and the philosophy of mind.",
    violation: "Parallel structure violation",
    distractors: ["Comma splice", "Subject-verb disagreement", "Dangling modifier"],
  },
  {
    sentence: "The referendum asked voters whether they supported raising the sales tax, issuing municipal bonds, or to reduce public services to close the budget deficit.",
    violation: "Parallel structure violation",
    distractors: ["Pronoun-antecedent disagreement", "Comma splice", "Subject-verb disagreement"],
  },
  {
    sentence: "She was praised not for the originality of her hypothesis but because she executed the experimental design with meticulous precision.",
    violation: "Parallel structure violation",
    distractors: ["Correlative conjunction error", "Dangling modifier", "Pronoun case error"],
  },
  {
    sentence: "The documentary explored how industrialization transformed the landscape, the displacement of rural communities, and why traditional crafts disappeared within a generation.",
    violation: "Parallel structure violation",
    distractors: ["Comma splice", "Tense inconsistency", "Dangling modifier"],
  },
  {
    sentence: "The surgeon must decide whether to proceed with the operation, to postpone it until the patient's condition stabilizes, or canceling it altogether.",
    violation: "Parallel structure violation",
    distractors: ["Subjunctive mood error", "Subject-verb disagreement", "Pronoun-antecedent disagreement"],
  },
  {
    sentence: "The treaty obligates signatory nations to reduce greenhouse gas emissions, the protection of biodiversity in marine environments, and to fund climate adaptation in developing countries.",
    violation: "Parallel structure violation",
    distractors: ["Comma splice", "Subject-verb disagreement", "Correlative conjunction error"],
  },
  {
    sentence: "His dissertation examines how colonial taxation policies destabilized agrarian economies, undermined traditional governance structures, and were leading to widespread famine.",
    violation: "Parallel structure violation (tense shift)",
    distractors: ["Tense inconsistency", "Subject-verb disagreement", "Dangling modifier"],
  },
  {
    sentence: "The CEO outlined three priorities: reducing operational costs by fifteen percent, to expand into emerging markets, and improving employee retention rates.",
    violation: "Parallel structure violation",
    distractors: ["Comma splice", "Subject-verb disagreement", "Dangling modifier"],
  },
  {
    sentence: "The scholarship committee evaluates applicants based on academic achievement, their contributions to community service, and financial need.",
    violation: "Parallel structure violation",
    distractors: ["Pronoun-antecedent disagreement", "Subject-verb disagreement", "Comma splice"],
  },
  {
    sentence: "The architect designed the building to be energy-efficient, aesthetically striking, and so that it would withstand seismic events up to magnitude eight.",
    violation: "Parallel structure violation",
    distractors: ["Comma splice", "Subject-verb disagreement", "Dangling modifier"],
  },
  {
    sentence: "The report recommended increasing funding for early childhood education, that the state expand vocational training programs, and reducing class sizes in underperforming schools.",
    violation: "Parallel structure violation",
    distractors: ["Subjunctive mood error", "Comma splice", "Subject-verb disagreement"],
  },
  {
    sentence: "To write effectively, a scholar must read widely, think critically, and the revision of multiple drafts is essential.",
    violation: "Parallel structure violation",
    distractors: ["Dangling modifier", "Subject-verb disagreement", "Split infinitive"],
  },
  {
    sentence: "The internship provides experience in financial modeling, conducting due diligence on potential acquisitions, and portfolio management.",
    violation: "Parallel structure violation",
    distractors: ["Comma splice", "Subject-verb disagreement", "Misplaced modifier"],
  },

  // ============================================================
  // RESTRICTIVE VS. NONRESTRICTIVE CLAUSE ERRORS (12)
  // ============================================================
  {
    sentence: "The candidates which the hiring committee interviewed last Thursday have all been notified of the decision by certified mail.",
    violation: "Restrictive clause error ('which' should be 'that/who')",
    distractors: ["Pronoun-antecedent disagreement", "Passive voice misuse", "Tense inconsistency"],
  },
  {
    sentence: "The study that was conducted at Johns Hopkins, examined the correlation between sleep deprivation and cognitive decline in adults over sixty-five.",
    violation: "Restrictive clause error (incorrect comma before 'that')",
    distractors: ["Comma splice", "Subject-verb disagreement", "Tense inconsistency"],
  },
  {
    sentence: "The medication which the FDA approved last month has already been prescribed to over fifty thousand patients nationwide.",
    violation: "Restrictive clause error ('which' should be 'that')",
    distractors: ["Passive voice misuse", "Subject-verb disagreement", "Tense inconsistency"],
  },
  {
    sentence: "The Rosetta Stone, that was discovered by French soldiers in 1799, provided the key to deciphering Egyptian hieroglyphics.",
    violation: "Nonrestrictive clause error ('that' should be 'which')",
    distractors: ["Passive voice misuse", "Tense inconsistency", "Comma splice"],
  },
  {
    sentence: "The hypothesis which best explains the observed data posits a causal relationship between chronic inflammation and the onset of neurodegenerative disease.",
    violation: "Restrictive clause error ('which' should be 'that')",
    distractors: ["Subject-verb disagreement", "Faulty comparison", "Tense inconsistency"],
  },
  {
    sentence: "Her latest novel, that draws heavily on her childhood experiences in rural Appalachia, has been longlisted for the Pulitzer Prize in Fiction.",
    violation: "Nonrestrictive clause error ('that' should be 'which')",
    distractors: ["Pronoun-antecedent disagreement", "Tense inconsistency", "Comma splice"],
  },
  {
    sentence: "The software update which was released yesterday introduced a critical vulnerability that compromised user data across multiple platforms.",
    violation: "Restrictive clause error ('which' should be 'that')",
    distractors: ["Tense inconsistency", "Subject-verb disagreement", "Comma splice"],
  },
  {
    sentence: "Mount Everest, that straddles the border between Nepal and Tibet, has claimed the lives of more than three hundred climbers since records began.",
    violation: "Nonrestrictive clause error ('that' should be 'which')",
    distractors: ["Subject-verb disagreement", "Tense inconsistency", "Pronoun-antecedent disagreement"],
  },
  {
    sentence: "The evidence which the prosecution presented during the first week of the trial was largely circumstantial and failed to establish motive.",
    violation: "Restrictive clause error ('which' should be 'that')",
    distractors: ["Parallel structure violation", "Tense inconsistency", "Comma splice"],
  },
  {
    sentence: "Professor Nakamura's theorem, that unified two previously disparate branches of algebraic topology, earned him the Fields Medal in 2018.",
    violation: "Nonrestrictive clause error ('that' should be 'which')",
    distractors: ["Subject-verb disagreement", "Tense inconsistency", "Pronoun case error"],
  },
  {
    sentence: "The policies which disproportionately affect marginalized communities must be subjected to rigorous equity impact assessments before implementation.",
    violation: "Restrictive clause error ('which' should be 'that')",
    distractors: ["Passive voice misuse", "Subject-verb disagreement", "Parallel structure violation"],
  },
  {
    sentence: "The Amazon rainforest, that produces approximately twenty percent of the world's oxygen, is being deforested at an alarming and accelerating rate.",
    violation: "Nonrestrictive clause error ('that' should be 'which')",
    distractors: ["Subject-verb disagreement", "Tense inconsistency", "Faulty comparison"],
  },

  // ============================================================
  // FAULTY COMPARISONS (12)
  // ============================================================
  {
    sentence: "The infrastructure investment required to modernize the country's electrical grid is significantly greater than most European nations.",
    violation: "Faulty comparison (comparing investment to nations)",
    distractors: ["Subject-verb disagreement", "Dangling modifier", "Pronoun-antecedent disagreement"],
  },
  {
    sentence: "Her analysis of the socioeconomic factors contributing to educational inequality was more nuanced than her colleague.",
    violation: "Faulty comparison (comparing analysis to colleague)",
    distractors: ["Pronoun case error", "Subject-verb disagreement", "Dangling modifier"],
  },
  {
    sentence: "The performance of the new algorithm on large-scale data sets is comparable to, if not better, than the industry-standard benchmark.",
    violation: "Faulty comparison (incomplete comparative structure)",
    distractors: ["Parallel structure violation", "Subject-verb disagreement", "Comma splice"],
  },
  {
    sentence: "The mortality rate from cardiovascular disease in rural communities is nearly three times higher than urban centers.",
    violation: "Faulty comparison (comparing rate to centers)",
    distractors: ["Subject-verb disagreement", "Misplaced modifier", "Tense inconsistency"],
  },
  {
    sentence: "Like Hemingway, the prose style of Cormac McCarthy relies on short declarative sentences and the strategic omission of punctuation.",
    violation: "Faulty comparison (comparing Hemingway to prose style)",
    distractors: ["Dangling modifier", "Parallel structure violation", "Pronoun-antecedent disagreement"],
  },
  {
    sentence: "The tensile strength of the new composite material exceeds titanium by a factor of approximately two point five.",
    violation: "Faulty comparison (comparing strength to titanium)",
    distractors: ["Subject-verb disagreement", "Misplaced modifier", "Tense inconsistency"],
  },
  {
    sentence: "The average salary of a software engineer in Silicon Valley is substantially higher than a physician in most other metropolitan areas.",
    violation: "Faulty comparison (comparing salary to physician)",
    distractors: ["Pronoun-antecedent disagreement", "Subject-verb disagreement", "Misplaced modifier"],
  },
  {
    sentence: "The GDP of California, if it were an independent nation, would be larger than all but four countries in the world.",
    violation: "Faulty comparison (comparing GDP to countries)",
    distractors: ["Subjunctive mood error", "Subject-verb disagreement", "Pronoun case error"],
  },
  {
    sentence: "Unlike the Romantic poets, the poetic output of the Metaphysicals is characterized by intellectual complexity rather than emotional directness.",
    violation: "Faulty comparison (comparing poets to poetic output)",
    distractors: ["Dangling modifier", "Parallel structure violation", "Subject-verb disagreement"],
  },
  {
    sentence: "The biodiversity of the Galapagos Islands is as rich, if not richer, than any comparable archipelago in the Pacific basin.",
    violation: "Faulty comparison (incomplete comparative structure)",
    distractors: ["Parallel structure violation", "Subject-verb disagreement", "Comma splice"],
  },
  {
    sentence: "The cost of healthcare in the United States is exponentially greater than any other industrialized democracy.",
    violation: "Faulty comparison (comparing cost to democracy)",
    distractors: ["Subject-verb disagreement", "Misplaced modifier", "Pronoun-antecedent disagreement"],
  },
  {
    sentence: "Her contributions to the field of behavioral economics have been as influential as Daniel Kahneman.",
    violation: "Faulty comparison (comparing contributions to person)",
    distractors: ["Pronoun case error", "Subject-verb disagreement", "Tense inconsistency"],
  },

  // ============================================================
  // SUBJECT-VERB DISAGREEMENT (12)
  // ============================================================
  {
    sentence: "The number of peer-reviewed publications produced by the department have increased steadily over the past decade under the current chair's leadership.",
    violation: "Subject-verb disagreement ('number' requires singular verb)",
    distractors: ["Tense inconsistency", "Pronoun-antecedent disagreement", "Dangling modifier"],
  },
  {
    sentence: "A series of increasingly severe earthquakes have struck the region over the past six months, displacing tens of thousands of residents.",
    violation: "Subject-verb disagreement ('series' requires singular verb)",
    distractors: ["Tense inconsistency", "Pronoun-antecedent disagreement", "Comma splice"],
  },
  {
    sentence: "The data collected from the three longitudinal studies suggests that early intervention significantly reduces the incidence of chronic disease in adulthood.",
    violation: "Subject-verb disagreement ('data' is plural, requires 'suggest')",
    distractors: ["Tense inconsistency", "Restrictive clause error", "Dangling modifier"],
  },
  {
    sentence: "Economics, along with political science and sociology, are considered essential prerequisites for the interdisciplinary policy studies program.",
    violation: "Subject-verb disagreement (parenthetical phrase doesn't change subject number)",
    distractors: ["Parallel structure violation", "Pronoun-antecedent disagreement", "Comma splice"],
  },
  {
    sentence: "There is, according to the latest census data published by the bureau of statistics, approximately forty-seven million people living below the poverty line.",
    violation: "Subject-verb disagreement ('there are...people')",
    distractors: ["Tense inconsistency", "Misplaced modifier", "Comma splice"],
  },
  {
    sentence: "The criteria for admission to the doctoral program has not changed substantially since the department was established in 1967.",
    violation: "Subject-verb disagreement ('criteria' is plural, requires 'have')",
    distractors: ["Tense inconsistency", "Passive voice misuse", "Pronoun-antecedent disagreement"],
  },
  {
    sentence: "Each of the manuscripts submitted to the journal undergo a rigorous double-blind peer review process lasting between six and twelve weeks.",
    violation: "Subject-verb disagreement ('each' requires singular verb)",
    distractors: ["Pronoun-antecedent disagreement", "Passive voice misuse", "Tense inconsistency"],
  },
  {
    sentence: "The phenomena described in the researchers' latest publication challenges several fundamental assumptions in the field of condensed matter physics.",
    violation: "Subject-verb disagreement ('phenomena' is plural, requires 'challenge')",
    distractors: ["Tense inconsistency", "Dangling modifier", "Pronoun-antecedent disagreement"],
  },
  {
    sentence: "Politics, particularly when it involve questions of resource allocation and distributive justice, are an inherently contentious domain of human activity.",
    violation: "Subject-verb disagreement (double error: 'involves' and 'is')",
    distractors: ["Tense inconsistency", "Pronoun-antecedent disagreement", "Parallel structure violation"],
  },
  {
    sentence: "The alumni association, together with the board of trustees and the president's office, have pledged to raise fifty million dollars for the new science complex.",
    violation: "Subject-verb disagreement (parenthetical phrase doesn't change subject number)",
    distractors: ["Pronoun-antecedent disagreement", "Tense inconsistency", "Comma splice"],
  },
  {
    sentence: "Neither the theoretical predictions nor the computer simulation were able to account for the anomalous readings observed in the third experimental trial.",
    violation: "Subject-verb disagreement (nearest subject 'simulation' requires 'was')",
    distractors: ["Correlative conjunction error", "Tense inconsistency", "Pronoun-antecedent disagreement"],
  },
  {
    sentence: "The media, despite their considerable influence on public opinion, has largely failed to provide adequate coverage of the humanitarian crisis unfolding in the region.",
    violation: "Subject-verb disagreement ('media' is plural, but inconsistent with 'their'/'has')",
    distractors: ["Pronoun-antecedent disagreement", "Tense inconsistency", "Comma splice"],
  },

  // ============================================================
  // MIXED / ADVANCED ERRORS (22)
  // ============================================================
  {
    sentence: "The reason the experiment failed is because the control group was inadvertently exposed to the independent variable during the second phase of the trial.",
    violation: "Redundancy error (reason...is because)",
    distractors: ["Subject-verb disagreement", "Passive voice misuse", "Tense inconsistency"],
  },
  {
    sentence: "Laying on the operating table for nearly four hours while the surgical team meticulously repaired the torn ligament, the patient remained conscious throughout the procedure.",
    violation: "Diction error ('laying' should be 'lying')",
    distractors: ["Dangling modifier", "Tense inconsistency", "Subject-verb disagreement"],
  },
  {
    sentence: "The affect of the new tariffs on agricultural exports has been far more devastating than the administration's economic advisors initially predicted.",
    violation: "Diction error ('affect' should be 'effect')",
    distractors: ["Subject-verb disagreement", "Faulty comparison", "Tense inconsistency"],
  },
  {
    sentence: "Less students enrolled in the advanced calculus sequence this semester than at any point in the preceding decade, prompting the department to consider curricular revisions.",
    violation: "Diction error ('less' should be 'fewer' for countable nouns)",
    distractors: ["Subject-verb disagreement", "Faulty comparison", "Tense inconsistency"],
  },
  {
    sentence: "The data strongly infers that prolonged exposure to particulate matter at concentrations above the recommended threshold significantly increases the risk of respiratory illness.",
    violation: "Diction error ('infers' should be 'implies')",
    distractors: ["Subject-verb disagreement", "Tense inconsistency", "Misplaced modifier"],
  },
  {
    sentence: "She could of finished the dissertation on schedule if the interlibrary loan system had not been offline for three consecutive weeks during the critical research phase.",
    violation: "Diction error ('could of' should be 'could have')",
    distractors: ["Subjunctive mood error", "Tense inconsistency", "Conditional tense error"],
  },
  {
    sentence: "The panel's consensus of opinion was that the proposed merger would substantially reduce competition in the telecommunications sector and harm consumers.",
    violation: "Redundancy error (consensus already implies opinion)",
    distractors: ["Subject-verb disagreement", "Pronoun-antecedent disagreement", "Parallel structure violation"],
  },
  {
    sentence: "Irregardless of the committee's reservations, the provost proceeded to implement the policy changes that had been the subject of such contentious debate.",
    violation: "Diction error ('irregardless' is nonstandard; use 'regardless')",
    distractors: ["Subject-verb disagreement", "Tense inconsistency", "Pronoun case error"],
  },
  {
    sentence: "The witness testified that she seen the defendant leaving the premises through the service entrance at approximately eleven forty-five on the night in question.",
    violation: "Verb form error ('seen' should be 'had seen' or 'saw')",
    distractors: ["Tense inconsistency", "Pronoun case error", "Subject-verb disagreement"],
  },
  {
    sentence: "Having studied the issue exhaustively and consulted with leading authorities in the field, and the committee recommended postponing the implementation indefinitely.",
    violation: "Sentence structure error (dangling participial phrase with extraneous 'and')",
    distractors: ["Dangling modifier", "Comma splice", "Parallel structure violation"],
  },
  {
    sentence: "The city council voted unanimously to demolish the historic building, a decision that, for all intensive purposes, ended any possibility of preserving the downtown's architectural heritage.",
    violation: "Diction error ('intensive purposes' should be 'intents and purposes')",
    distractors: ["Restrictive clause error", "Comma splice", "Pronoun-antecedent disagreement"],
  },
  {
    sentence: "The painting, along with several rare manuscripts and a collection of first-edition novels, were destroyed in the fire that engulfed the east wing of the library.",
    violation: "Subject-verb disagreement (parenthetical phrase doesn't change subject)",
    distractors: ["Parallel structure violation", "Tense inconsistency", "Pronoun-antecedent disagreement"],
  },
  {
    sentence: "She is one of those scholars who insists on conducting primary-source research even when comprehensive secondary literature is readily available.",
    violation: "Subject-verb disagreement ('who' refers to 'scholars,' requires 'insist')",
    distractors: ["Pronoun-antecedent disagreement", "Restrictive clause error", "Tense inconsistency"],
  },
  {
    sentence: "The museum exhibited less artifacts from the Hellenistic period than the curator had originally planned due to conservation concerns about the fragile ceramics.",
    violation: "Diction error ('less' should be 'fewer' for countable nouns)",
    distractors: ["Subject-verb disagreement", "Faulty comparison", "Misplaced modifier"],
  },
  {
    sentence: "If the defendant would have disclosed the relevant financial documents during discovery, the protracted litigation could have been resolved months earlier.",
    violation: "Conditional tense error ('would have' should be 'had' in the if-clause)",
    distractors: ["Subjunctive mood error", "Tense inconsistency", "Pronoun case error"],
  },
  {
    sentence: "The principle reason for the project's failure was not inadequate funding but rather a fundamental flaw in the underlying methodological assumptions.",
    violation: "Diction error ('principle' should be 'principal')",
    distractors: ["Correlative conjunction error", "Subject-verb disagreement", "Parallel structure violation"],
  },
  {
    sentence: "Try and complete the longitudinal analysis before the end of the quarter so that we can include the results in the annual report to stakeholders.",
    violation: "Diction error ('try and' should be 'try to')",
    distractors: ["Parallel structure violation", "Subject-verb disagreement", "Tense inconsistency"],
  },
  {
    sentence: "The amount of doctoral candidates who successfully defend their dissertations within five years has remained stubbornly low despite recent reforms.",
    violation: "Diction error ('amount' should be 'number' for countable nouns)",
    distractors: ["Subject-verb disagreement", "Pronoun-antecedent disagreement", "Restrictive clause error"],
  },
  {
    sentence: "Being that the grant funding expires at the end of the fiscal year, the research team must accelerate the data collection timeline considerably.",
    violation: "Diction error ('being that' is nonstandard; use 'because' or 'since')",
    distractors: ["Dangling modifier", "Subject-verb disagreement", "Tense inconsistency"],
  },
  {
    sentence: "The professor which taught the seminar on postcolonial theory has been nominated for the university's distinguished teaching award three years running.",
    violation: "Pronoun error ('which' should be 'who' for persons)",
    distractors: ["Restrictive clause error", "Subject-verb disagreement", "Tense inconsistency"],
  },
  {
    sentence: "The new policy effects every employee in the organization, from entry-level analysts to senior vice presidents, without exception.",
    violation: "Diction error ('effects' should be 'affects')",
    distractors: ["Subject-verb disagreement", "Pronoun-antecedent disagreement", "Misplaced modifier"],
  },
  {
    sentence: "Whomever is responsible for the data breach must be held accountable, regardless of their seniority or their tenure within the organization.",
    violation: "Pronoun case error (subjective case required: 'whoever')",
    distractors: ["Pronoun-antecedent disagreement", "Subject-verb disagreement", "Restrictive clause error"],
  },
];
