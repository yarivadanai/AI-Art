export interface TranslationWord {
  word: string;
  language: string;
  correctDescription: string;
  distractors: [string, string, string];
}

export const TRANSLATION_WORDS: TranslationWord[] = [
  // ============================================================
  // JAPANESE (15)
  // ============================================================
  {
    word: "木漏れ日 (komorebi)",
    language: "Japanese",
    correctDescription: "The interplay of sunlight filtering through leaves, creating a dappled pattern of light and shadow that shifts with the wind — not merely sunlight through trees, but the specific aesthetic phenomenon of that flickering, living illumination",
    distractors: [
      "The warm glow of sunlight on a forest floor during autumn",
      "The practice of forest bathing and immersing oneself in woodland atmosphere",
      "The peaceful feeling experienced while walking alone through a sunlit forest",
    ],
  },
  {
    word: "侘寂 (wabi-sabi)",
    language: "Japanese",
    correctDescription: "A comprehensive worldview rooted in the acceptance of transience and imperfection, where 'wabi' denotes rustic simplicity and the beauty found in asymmetry and roughness, and 'sabi' evokes the serene beauty that comes with age and wear — together forming an aesthetic-philosophical system that finds profundity in the incomplete, impermanent, and imperfect",
    distractors: [
      "A minimalist design philosophy emphasizing clean lines, empty space, and restraint in decoration",
      "The appreciation of handcrafted objects over mass-produced goods, valuing artisanal imprecision",
      "A meditative practice of finding inner peace through the contemplation of natural objects",
    ],
  },
  {
    word: "物の哀れ (mono no aware)",
    language: "Japanese",
    correctDescription: "A bittersweet awareness of the transience of all things, combining a gentle sorrow at their inevitable passing with a deepened appreciation of their beauty precisely because they are fleeting — not pessimism, but an empathic sensitivity to the ephemeral nature of existence",
    distractors: [
      "An aesthetic appreciation of natural beauty, especially flowers and landscapes, in Japanese culture",
      "The Buddhist concept of non-attachment to material possessions and worldly concerns",
      "A deep respect for ancestral traditions and the sorrow felt when they are lost to modernization",
    ],
  },
  {
    word: "生き甲斐 (ikigai)",
    language: "Japanese",
    correctDescription: "The deeply personal sense that one's life is worth living — not a grand 'purpose' discovered through a Venn diagram, but the everyday small joys and reasons to get up in the morning, which may be as modest as a morning cup of tea or tending a garden, encompassing both trivial daily pleasures and profound lifelong vocations",
    distractors: [
      "The intersection of what you love, what you are good at, what the world needs, and what you can be paid for",
      "The Japanese philosophy of achieving professional mastery through decades of disciplined practice",
      "A formal life-planning methodology used in Japanese corporate culture for career development",
    ],
  },
  {
    word: "改善 (kaizen)",
    language: "Japanese",
    correctDescription: "A philosophical and practical commitment to continuous incremental improvement in all aspects of life, originating in post-war Japanese manufacturing but rooted in a deeper cultural value that no process is ever perfect and that small, daily improvements by every person — not just management — compound into transformative change",
    distractors: [
      "A business management strategy focused on dramatic organizational overhauls to improve efficiency",
      "The Japanese concept of achieving perfection through rigorous quality control and zero-defect manufacturing",
      "A top-down corporate philosophy where executives design optimal systems for workers to implement",
    ],
  },
  {
    word: "間 (ma)",
    language: "Japanese",
    correctDescription: "The pregnant negative space or meaningful pause between things — not mere emptiness, but a dynamic, purposeful interval in time or space that gives form and meaning to what surrounds it, essential in Japanese music, architecture, conversation, and painting as the silence that makes sound meaningful",
    distractors: [
      "The Japanese concept of personal space and physical distance maintained during social interactions",
      "The architectural principle of maximizing floor space in small Japanese living quarters",
      "A formal period of silence observed before Shinto religious ceremonies begin",
    ],
  },
  {
    word: "渋い (shibui)",
    language: "Japanese",
    correctDescription: "An aesthetic of understated, unobtrusive beauty that reveals itself slowly — objects or experiences that are outwardly simple but possess a deep, subtle complexity beneath the surface, achieving a quiet authority through restraint rather than ostentation",
    distractors: [
      "The bitter or astringent taste quality found in certain Japanese teas and persimmons",
      "A strict, minimalist aesthetic that rejects all ornamentation in favor of pure function",
      "The quality of being old-fashioned or outdated in a charming, nostalgic way",
    ],
  },
  {
    word: "金継ぎ (kintsugi)",
    language: "Japanese",
    correctDescription: "The art of repairing broken pottery with gold lacquer, embodying the philosophy that breakage and repair are part of an object's history rather than something to disguise — the fractures become a celebrated feature, transforming damage into a new form of beauty that honors imperfection and resilience",
    distractors: [
      "The Japanese tradition of gilding sacred objects in temples with gold leaf for purification",
      "A meditation practice involving the careful arrangement of golden objects to achieve mindfulness",
      "The craft of creating decorative gold inlay patterns on ceramic surfaces before firing",
    ],
  },
  {
    word: "木枯らし (kogarashi)",
    language: "Japanese",
    correctDescription: "The cold, piercing wind that signals the arrival of winter — not merely a meteorological event, but a deeply evocative seasonal marker carrying associations of loneliness, the stripping away of autumn's beauty, and the stark confrontation with nature's cycle of decay",
    distractors: [
      "The gentle spring breeze that carries cherry blossom petals through the air",
      "The concept of enduring harsh conditions with stoic patience through the winter months",
      "A traditional wind chime hung in Japanese gardens to mark the changing of seasons",
    ],
  },
  {
    word: "本音と建前 (honne to tatemae)",
    language: "Japanese",
    correctDescription: "The culturally understood distinction between one's true feelings and desires (honne) and the behavior and opinions one displays in public to maintain social harmony (tatemae) — not considered hypocritical but rather an essential social mechanism, a dual consciousness that every person navigates simultaneously",
    distractors: [
      "The Japanese custom of being excessively polite to strangers while being casual with close friends",
      "The distinction between formal written Japanese and casual spoken Japanese in different social contexts",
      "The practice of concealing negative emotions to avoid burdening others with personal problems",
    ],
  },
  {
    word: "積ん読 (tsundoku)",
    language: "Japanese",
    correctDescription: "The act of acquiring books and letting them pile up unread — not a criticism but an affectionate acknowledgment of the irresistible compulsion to buy books faster than one can read them, implying both a love of books as objects and an optimistic faith in future reading time",
    distractors: [
      "A scholarly practice of systematically cataloging one's personal library by subject and author",
      "The Japanese tradition of displaying books prominently in the home as symbols of education and status",
      "A meditative reading practice involving slow, deliberate consumption of texts over many months",
    ],
  },
  {
    word: "懐かしい (natsukashii)",
    language: "Japanese",
    correctDescription: "A warm, affectionate feeling of nostalgic longing triggered by encountering something from one's past — distinct from Western nostalgia in that it emphasizes the joy of remembering and reconnection rather than sadness over what is lost, carrying gratitude for having experienced something dear",
    distractors: [
      "A painful yearning to return to a specific time and place in one's childhood",
      "The melancholy realization that the past was better than the present",
      "A formal Japanese greeting used when reuniting with someone after a long absence",
    ],
  },
  {
    word: "しょうがない (shouganai)",
    language: "Japanese",
    correctDescription: "An acceptance that some things cannot be helped or changed — not passive resignation or fatalism, but a pragmatic release of futile resistance, freeing emotional energy for what can be influenced, functioning as both a personal coping philosophy and a social agreement to move forward",
    distractors: [
      "A defeatist attitude of giving up on problems before attempting to solve them",
      "The Buddhist concept of surrendering all worldly desires to achieve enlightenment",
      "A polite phrase used to decline an invitation without giving offense",
    ],
  },
  {
    word: "幽玄 (yugen)",
    language: "Japanese",
    correctDescription: "A profound, mysterious sense of the beauty of the universe and the sad beauty of human suffering — an awareness of the depths that lie beneath surface reality, evoking what cannot be seen or expressed directly, like the shadowed, half-revealed beauty of moonlight obscured by clouds",
    distractors: [
      "The Japanese concept of achieving spiritual enlightenment through ascetic meditation practices",
      "An aesthetic principle focused on the dramatic contrast between light and darkness in visual art",
      "The eerie, supernatural atmosphere associated with Japanese ghost stories and folklore",
    ],
  },
  {
    word: "縁 (en)",
    language: "Japanese",
    correctDescription: "The mysterious force of connection or affinity that draws people together — not fate or destiny in the Western deterministic sense, but a karmic bond that explains why certain people cross paths, with an implicit understanding that such connections require mutual effort to sustain",
    distractors: [
      "The formal social obligation to maintain relationships with business associates and colleagues",
      "The concept of predestined soulmates who are guaranteed to find each other in every lifetime",
      "A Buddhist term for the cycle of reincarnation and the debts carried between lives",
    ],
  },

  // ============================================================
  // GERMAN (12)
  // ============================================================
  {
    word: "Weltanschauung",
    language: "German",
    correctDescription: "A comprehensive philosophy or worldview that constitutes one's entire framework for understanding reality, encompassing metaphysics, ethics, aesthetics, and epistemology — not merely an 'outlook' or 'perspective,' but the fundamental conceptual lens through which all experience is interpreted and meaning is constructed",
    distractors: [
      "A political ideology or system of government that shapes national policy and law",
      "The scientific method of observing the natural world to derive universal truths",
      "A religious doctrine that prescribes moral behavior and spiritual practices for adherents",
    ],
  },
  {
    word: "Vergangenheitsbewaltigung",
    language: "German",
    correctDescription: "The struggle to come to terms with a difficult past, specifically the collective, ongoing process of a society confronting and working through the moral burden of historical atrocities — coined in the context of postwar Germany's reckoning with the Holocaust, implying not closure but continuous, painful engagement",
    distractors: [
      "The formal process of documenting historical events in archives for future generations",
      "A psychological therapy technique for overcoming individual traumatic memories",
      "The political act of issuing official apologies for historical injustices committed by a government",
    ],
  },
  {
    word: "Sehnsucht",
    language: "German",
    correctDescription: "An intense, inconsolable longing for something far-off, undefined, or perhaps nonexistent — a yearning for an alternative, idealized life or state of being that one has never experienced, carrying both the pain of absence and the sweetness of the imagined, often described as life's deepest and most persistent longing",
    distractors: [
      "The homesickness felt when living far from one's native country for an extended period",
      "A compulsive need to travel and explore unfamiliar places driven by restlessness",
      "The grief experienced after the loss of a loved one, especially a romantic partner",
    ],
  },
  {
    word: "Fernweh",
    language: "German",
    correctDescription: "A deep ache or craving for distant, unfamiliar places — the opposite of homesickness (Heimweh), being an intense longing to be somewhere one has never been, a pull toward the unknown and far away that is felt as an almost physical restlessness",
    distractors: [
      "The exhaustion and disorientation experienced after long-distance travel across time zones",
      "A nostalgic longing to return to a foreign place where one previously lived or visited",
      "The philosophical belief that traveling broadens the mind and is essential for personal growth",
    ],
  },
  {
    word: "Torschlusspanik",
    language: "German",
    correctDescription: "Literally 'gate-closing panic' — the mounting anxiety that time is running out to achieve important life goals, that opportunities are diminishing with age, originally referring to medieval peasants rushing to enter a city before the gates closed at nightfall, now evoking the existential dread of missed chances and narrowing possibilities",
    distractors: [
      "The claustrophobic fear of being trapped in enclosed or locked spaces",
      "The anxiety experienced when making an irreversible decision with significant consequences",
      "The panic felt during a financial crisis when investors rush to sell assets before values collapse",
    ],
  },
  {
    word: "Waldeinsamkeit",
    language: "German",
    correctDescription: "The feeling of solitary contemplation experienced while alone in the forest — not loneliness or isolation, but a specific quality of connectedness with nature that emerges in woodland solitude, blending peaceful introspection with an almost mystical sense of unity with the natural world",
    distractors: [
      "The German tradition of long family hikes through forested mountains on weekends",
      "An environmental philosophy emphasizing the preservation of old-growth forests",
      "The melancholy of watching forests be cleared for agricultural or industrial development",
    ],
  },
  {
    word: "Verschlimmbessern",
    language: "German",
    correctDescription: "To make something worse through a well-intentioned attempt to improve it — the specific frustration of an 'improvement' that backfires, where the cure is worse than the disease, combining 'verschlimmern' (to worsen) with 'verbessern' (to improve) into a single concept of counterproductive fixing",
    distractors: [
      "The bureaucratic tendency to overcomplicate simple processes through excessive regulation",
      "The act of deliberately sabotaging a project while pretending to help",
      "A pessimistic worldview that believes all attempts at progress are ultimately futile",
    ],
  },
  {
    word: "Weltschmerz",
    language: "German",
    correctDescription: "A deep sadness about the insufficiency or imperfection of the world — the pain caused by the gap between the ideal world one can imagine and the flawed reality that exists, a specifically Romantic-era concept of existential sorrow that the world can never match our hopes for it",
    distractors: [
      "The guilt of living in comfort while being aware of suffering in other parts of the world",
      "A clinical depression caused by overwhelming exposure to negative news media",
      "Physical pain experienced sympathetically when witnessing another person's suffering",
    ],
  },
  {
    word: "Zugzwang",
    language: "German",
    correctDescription: "A situation in chess and by extension in life where the obligation to act or make a move is itself a disadvantage, because every available option will worsen one's position — the compulsion to move when standing still would be preferable, but standing still is not permitted by the rules",
    distractors: [
      "The strategic advantage gained by forcing an opponent into a defensive position",
      "The paralysis of indecision when presented with too many equally viable options",
      "The competitive drive to always stay one step ahead of an adversary in negotiations",
    ],
  },
  {
    word: "Fremdschamen",
    language: "German",
    correctDescription: "Vicarious embarrassment experienced on behalf of someone else, often someone who is themselves oblivious to how embarrassing their behavior is — a cringing, empathic shame felt as intensely as if one were committing the social transgression oneself",
    distractors: [
      "The fear of embarrassing oneself in front of strangers in an unfamiliar social setting",
      "The cultural practice of maintaining strict social etiquette to avoid any hint of impropriety",
      "A deliberate act of publicly humiliating someone as a form of social punishment",
    ],
  },
  {
    word: "Gemutlichkeit",
    language: "German",
    correctDescription: "A state of warmth, friendliness, good cheer, and unhurried conviviality — more active and communal than mere comfort, encompassing the feeling of belonging, social acceptance, and cheerful coziness found in good company, good food, and an atmosphere free of anxiety or pretension",
    distractors: [
      "The quality of German engineering and craftsmanship that prioritizes durability and reliability",
      "A formal code of social conduct governing behavior at official gatherings and ceremonies",
      "The introverted preference for spending time alone in quiet, comfortable domestic settings",
    ],
  },
  {
    word: "Erklarungsnot",
    language: "German",
    correctDescription: "The distressing state of being caught in a compromising situation that urgently demands an explanation, while having no adequate explanation to give — the specific panic of needing to justify something unjustifiable, when silence is not an option",
    distractors: [
      "The frustration of being unable to communicate in a foreign language during an emergency",
      "A philosophical condition of questioning everything so deeply that no explanation seems sufficient",
      "The academic obligation to provide exhaustive citations and evidence for every scholarly claim",
    ],
  },

  // ============================================================
  // PORTUGUESE (6)
  // ============================================================
  {
    word: "Saudade",
    language: "Portuguese",
    correctDescription: "A profound, melancholic longing for something or someone absent, carrying the knowledge that what is longed for may never return — not simple nostalgia but a complex emotional state that simultaneously embraces the joy of having known something beautiful and the sorrow of its absence, considered central to the Portuguese soul and untranslatable into any single foreign word",
    distractors: [
      "The sadness felt specifically after the end of a romantic relationship",
      "A nostalgic longing for one's childhood that intensifies with age",
      "The homesickness experienced by Portuguese sailors during the Age of Exploration",
    ],
  },
  {
    word: "Desenrascanco",
    language: "Portuguese",
    correctDescription: "The art of improvising a creative, last-minute solution using whatever means are available — a resourceful disentanglement from a seemingly impossible predicament through ingenuity and improvisation, celebrated in Portuguese culture as a national virtue that combines cleverness, adaptability, and refusal to accept defeat",
    distractors: [
      "A meticulous, long-term planning methodology that anticipates every possible contingency",
      "The fatalistic acceptance that some problems have no solution and must simply be endured",
      "The Portuguese tradition of community cooperation where neighbors help each other with practical tasks",
    ],
  },
  {
    word: "Cafune",
    language: "Brazilian Portuguese",
    correctDescription: "The tender, intimate act of running one's fingers gently through a loved one's hair — a specific gesture of affection and comfort between people who share a close emotional bond, carrying connotations of care, soothing, and wordless emotional connection",
    distractors: [
      "A traditional Brazilian coffee ceremony shared between close friends in the morning",
      "The warm embrace exchanged between family members after a long period of separation",
      "A lullaby sung softly to a child to help them fall asleep",
    ],
  },
  {
    word: "Jeitinho",
    language: "Brazilian Portuguese",
    correctDescription: "A creative, often informal way of navigating bureaucracy, rules, or obstacles through charm, cleverness, and personal connections — a culturally specific blend of resourcefulness and social finesse that bends but does not quite break rules, occupying an ambiguous moral space between admirable ingenuity and ethically questionable circumvention",
    distractors: [
      "The formal protocol followed when conducting business negotiations in Brazil",
      "A traditional dance step performed during Carnival celebrations in Rio de Janeiro",
      "The Brazilian custom of offering hospitality and generous meals to all visitors",
    ],
  },
  {
    word: "Desbundar",
    language: "Brazilian Portuguese",
    correctDescription: "To shed one's inhibitions completely and abandon oneself to uninhibited joy, pleasure, or creative expression — exceeding all expected limits of exuberance, losing oneself in the moment with total abandonment of self-consciousness, often associated with Carnival but applicable to any moment of ecstatic release",
    distractors: [
      "The act of organizing a large, formal celebration with meticulous planning and preparation",
      "A spiritual awakening that results in permanent behavioral change and inner peace",
      "The exhaustion and regret felt the morning after excessive celebration",
    ],
  },
  {
    word: "Madrugada",
    language: "Portuguese",
    correctDescription: "The liminal hours between midnight and dawn — not simply 'early morning' or 'late night' but a distinct temporal zone with its own psychological and cultural character, associated with heightened emotion, creative inspiration, insomnia, deep conversation, and the strange solitude of being awake when others sleep",
    distractors: [
      "The first light of dawn as it appears on the horizon before sunrise",
      "A traditional Portuguese early-morning meal eaten before the day's work begins",
      "The afternoon rest period observed in Mediterranean and Latin cultures",
    ],
  },

  // ============================================================
  // FINNISH (4)
  // ============================================================
  {
    word: "Sisu",
    language: "Finnish",
    correctDescription: "An extraordinary determination and inner strength that emerges in the face of seemingly insurmountable adversity — not mere stubbornness or courage, but a uniquely Finnish quality of stoic resolve that activates precisely when the situation appears hopeless, enabling action beyond one's perceived capabilities through sheer force of will",
    distractors: [
      "Physical endurance and athletic stamina developed through rigorous outdoor training",
      "A calm, patient temperament characterized by never showing anger or frustration",
      "The cultural preference for silence, personal space, and emotional restraint in social settings",
    ],
  },
  {
    word: "Kalsarikannnit",
    language: "Finnish",
    correctDescription: "The act of drinking alcohol at home, alone, in one's underwear, with no intention of going out — not considered pathetic but rather a valid, even celebrated form of relaxation, an honest acknowledgment of the occasional human need to withdraw completely from social obligations without pretense",
    distractors: [
      "A traditional Finnish sauna ritual involving alternating between extreme heat and cold immersion",
      "The Scandinavian custom of spending weekends in remote cabins disconnected from technology",
      "The practice of binge-watching television while bundled in blankets during long winter nights",
    ],
  },
  {
    word: "Poronkusema",
    language: "Finnish",
    correctDescription: "A traditional unit of distance measurement equivalent to approximately seven and a half kilometers — the distance a reindeer can travel before needing to stop and urinate, reflecting the deeply practical, nature-attuned origins of Finnish measurement and the central role of reindeer in Sami and Finnish life",
    distractors: [
      "The annual reindeer migration route through Finnish Lapland followed by herders each spring",
      "A measure of snowfall depth used in northern Finland to assess travel conditions",
      "The maximum distance at which a reindeer herder can spot their animals with the naked eye",
    ],
  },
  {
    word: "Myotahapea",
    language: "Finnish",
    correctDescription: "Secondhand embarrassment — the vicarious, cringing shame felt on behalf of another person who is behaving in an embarrassing manner, whether or not they themselves are aware of it, experienced as genuine physical discomfort by the observer",
    distractors: [
      "The Finnish cultural value of avoiding any behavior that might draw unwanted attention to oneself",
      "The awkward social anxiety experienced when forced to make small talk with strangers",
      "A formal apology offered to someone whose feelings have been inadvertently hurt",
    ],
  },

  // ============================================================
  // DANISH / SCANDINAVIAN (4)
  // ============================================================
  {
    word: "Pyt",
    language: "Danish",
    correctDescription: "An untranslatable interjection expressing the conscious decision to let go of minor frustrations — a verbal shrug that acknowledges something went wrong but actively chooses not to let it bother you, functioning as both an emotional release valve and a philosophical micro-practice of acceptance in everyday life",
    distractors: [
      "A Danish exclamation of surprise or delight, similar to 'wow' or 'oh my'",
      "The Scandinavian practice of finding contentment through lowered expectations",
      "A dismissive expression indicating complete indifference to another person's problems",
    ],
  },
  {
    word: "Arbejdsglade",
    language: "Danish",
    correctDescription: "Happiness derived from work itself — not work-life balance or career satisfaction, but the specific Danish concept that work can and should be a genuine source of daily joy, that finding pleasure in one's labor is a right and expectation rather than a fortunate accident",
    distractors: [
      "The Scandinavian model of generous workplace benefits, vacation time, and social safety nets",
      "The feeling of relief experienced on Friday afternoon when the work week has ended",
      "The competitive drive to outperform colleagues and climb the corporate hierarchy",
    ],
  },
  {
    word: "Janteloven",
    language: "Danish/Norwegian",
    correctDescription: "The unwritten Scandinavian social code that discourages individual ambition and self-promotion — a set of implicit cultural rules stipulating that no one should consider themselves better, smarter, or more important than anyone else, functioning as both a force for social equality and a constraint on individual expression",
    distractors: [
      "The Scandinavian tradition of community decision-making through consensus rather than majority vote",
      "A philosophical belief in radical equality of economic outcomes regardless of effort or talent",
      "The legal framework protecting workers' rights and collective bargaining in Nordic countries",
    ],
  },
  {
    word: "Friluftsliv",
    language: "Norwegian",
    correctDescription: "A philosophical way of life centered on spending time outdoors in nature — not merely outdoor recreation or exercise, but a deep cultural value that equates time in natural settings with spiritual well-being, national identity, and the belief that humans need regular immersion in nature to remain whole",
    distractors: [
      "The Scandinavian tradition of building summer cottages in remote rural locations",
      "Extreme outdoor sports and adventure activities practiced in harsh Nordic climates",
      "The environmental conservation movement dedicated to preserving Scandinavian wilderness areas",
    ],
  },

  // ============================================================
  // ARABIC (6)
  // ============================================================
  {
    word: "تقية (taqiyya)",
    language: "Arabic",
    correctDescription: "The principled concealment or dissimulation of one's true beliefs under conditions of genuine persecution or mortal danger — a specific theological dispensation in Islamic jurisprudence permitting outward conformity when one's life is threatened, not a license for habitual deception but an ethically bounded survival mechanism with strict conditions",
    distractors: [
      "The Islamic practice of private prayer and contemplation as distinct from communal worship",
      "A general permission in Islam to lie whenever it serves one's strategic advantage",
      "The Sufi mystical practice of concealing spiritual experiences from the uninitiated",
    ],
  },
  {
    word: "طرب (tarab)",
    language: "Arabic",
    correctDescription: "A state of musical ecstasy or enchantment in which the listener is transported beyond ordinary consciousness by the emotional power of music — a collective, participatory experience where the boundary between performer and audience dissolves, involving visible emotional responses and a shared surrender to the music's spell",
    distractors: [
      "The technical skill and virtuosity displayed by a master musician during a performance",
      "A religious chanting practice used to achieve a trance state in Sufi ceremonies",
      "The nostalgic pleasure of listening to traditional folk music from one's homeland",
    ],
  },
  {
    word: "مروءة (muruwwa)",
    language: "Arabic",
    correctDescription: "A comprehensive ideal of masculine virtue encompassing generosity, courage, hospitality, patience, loyalty, and self-restraint — predating Islam and rooted in pre-Islamic Bedouin culture, it describes not a single quality but an entire code of honorable conduct that defines human excellence in its fullest social and moral dimensions",
    distractors: [
      "The specific obligation of hospitality toward travelers and strangers in Arab culture",
      "Military courage and fearlessness displayed in battle or physical confrontation",
      "The Islamic concept of submission to the will of God as the highest human virtue",
    ],
  },
  {
    word: "قلب (qalb)",
    language: "Arabic",
    correctDescription: "Literally 'heart,' but in Arabic philosophical and mystical tradition it denotes the spiritual center of human consciousness — not the seat of emotion alone (as in English), but the organ of intuitive knowledge, spiritual perception, and divine connection, the place where intellect and feeling unite in a form of understanding that transcends rational thought",
    distractors: [
      "The Arabic word for romantic love between two people in a committed relationship",
      "The physical human heart as described in classical Arabic medical texts",
      "The concept of emotional intelligence and empathy in modern Arabic psychology",
    ],
  },
  {
    word: "عصبية (asabiyya)",
    language: "Arabic",
    correctDescription: "Social cohesion and group solidarity as described by Ibn Khaldun — the binding force that unites a group through shared identity, mutual loyalty, and collective will to power, explaining how civilizations rise and fall as this cohesion strengthens in nomadic groups and inevitably weakens in settled, urbanized societies",
    distractors: [
      "Tribal prejudice and ethnocentric bias that privileges one's own group over outsiders",
      "The nervous energy and aggressive competitiveness displayed in political rivalries",
      "The Islamic concept of the global community of believers united across ethnic boundaries",
    ],
  },
  {
    word: "كيف (kef/keyf)",
    language: "Arabic",
    correctDescription: "A state of blissful, idle contentment — doing nothing and wanting nothing, the luxurious enjoyment of complete leisure without guilt, boredom, or the need for stimulation, a conscious savoring of pleasant inactivity that values being over doing",
    distractors: [
      "The intoxication or mild euphoria produced by consuming coffee or tea in social settings",
      "The Arabic greeting that inquires about someone's current mood and general wellbeing",
      "The meditative state achieved through rhythmic recitation of religious texts",
    ],
  },

  // ============================================================
  // RUSSIAN (5)
  // ============================================================
  {
    word: "тоска (toska)",
    language: "Russian",
    correctDescription: "A sensation of great spiritual anguish, often without specific cause — at its deepest, a soul-sickness or longing with nothing to long for, ranging from vague restlessness and dull ache of the soul to the most acute, agonized yearning, as described by Nabokov as 'a dull ache of the soul, a sick pining, a vague restlessness' that no single English word can convey",
    distractors: [
      "The melancholy felt during the long Russian winter months when daylight is scarce",
      "A celebratory toast given at Russian banquets, often involving emotional personal declarations",
      "The intense patriotic love for the Russian motherland felt by those living in exile",
    ],
  },
  {
    word: "пошлость (poshlost)",
    language: "Russian",
    correctDescription: "A uniquely Russian concept encompassing everything that is vulgar, pretentious, spiritually and morally mediocre — not mere 'bad taste' but a deeper quality of banality, self-satisfied philistinism, and falseness that Nabokov described as 'cheap, sham, common, smutty, pink-and-blue,' the triumphantly fake and complacently inferior masquerading as refined",
    distractors: [
      "Crude, obscene language and behavior that violates standards of social decorum",
      "The nouveau riche tendency to display wealth through gaudy, ostentatious consumption",
      "A cynical worldview that assumes all human motivation is ultimately selfish and base",
    ],
  },
  {
    word: "быт (byt)",
    language: "Russian",
    correctDescription: "The crushing daily grind of mundane domestic existence — not merely 'daily life' or 'routine,' but the soul-deadening weight of petty domestic concerns, chores, and material necessities that drains life of meaning and beauty, a concept with deeply negative connotations in Russian literature as the antithesis of spiritual or creative life",
    distractors: [
      "The traditional Russian way of life in rural villages with its seasonal rhythms and customs",
      "The cozy, warm atmosphere of a Russian household during family gatherings",
      "The practical, no-nonsense approach to problem-solving valued in Russian culture",
    ],
  },
  {
    word: "надрыв (nadryv)",
    language: "Russian",
    correctDescription: "An emotional state of self-laceration and extreme psychological strain, often performative — a Dostoevskian concept of the anguished, dramatic outpouring of repressed feeling that tears at the soul, involving a peculiar combination of genuine suffering and exhibitionistic self-exposure, where the sufferer both endures and displays their torment",
    distractors: [
      "The Russian tradition of deep, soul-baring conversation over late-night tea with close friends",
      "A nervous breakdown caused by unbearable external pressure and circumstances",
      "The dramatic emotional expression characteristic of Russian operatic and theatrical performance",
    ],
  },
  {
    word: "авось (avos)",
    language: "Russian",
    correctDescription: "A characteristically Russian attitude of blind, hopeful trust in fate — doing something risky while counting on luck to see you through, a kind of optimistic recklessness that shrugs at careful planning and instead appeals to some indefinable cosmic benevolence, culturally understood as both a national vice and a charm",
    distractors: [
      "The Russian custom of consulting fortune tellers and astrologers before major decisions",
      "A religious faith that God will provide and protect regardless of human action or inaction",
      "The fatalistic acceptance that suffering is inevitable and resistance is pointless",
    ],
  },

  // ============================================================
  // KOREAN (5)
  // ============================================================
  {
    word: "한 (han)",
    language: "Korean",
    correctDescription: "A uniquely Korean emotional complex of deep, unresolved sorrow, resentment, and regret arising from historical suffering and injustice — not mere sadness but a collective, generational feeling combining grief, indignation, and a yearning for justice that remains unfulfilled, transmuted into a source of creative energy and cultural identity",
    distractors: [
      "The Korean virtue of patience and endurance in the face of personal hardship",
      "A spiritual concept of inner peace achieved through Buddhist meditation practices",
      "The fierce national pride and patriotic fervor felt by Korean people toward their homeland",
    ],
  },
  {
    word: "눈치 (nunchi)",
    language: "Korean",
    correctDescription: "The subtle art of reading the emotional undercurrents of a situation and adjusting one's behavior accordingly — a form of social intelligence that gauges the mood of a room, the unspoken feelings of others, and the dynamics of a group through observation and empathy, considered essential for harmonious social functioning in Korean culture",
    distractors: [
      "The Korean custom of showing respect to elders through formal language and deferential behavior",
      "The ability to detect lies and deception through careful observation of body language",
      "A strategic social skill used to gain advantage in competitive business negotiations",
    ],
  },
  {
    word: "정 (jeong)",
    language: "Korean",
    correctDescription: "A deep, often unspoken emotional bond that develops between people through shared experience over time — not love in the romantic sense, but an attachment, affection, and sense of interconnection that builds gradually and becomes difficult to sever, encompassing compassion, sympathy, empathy, and the bonds between all people in a community",
    distractors: [
      "The formal respect and deference shown to authority figures in Korean hierarchical society",
      "The intense romantic passion experienced in the early stages of a new relationship",
      "The loyalty and devotion felt specifically toward one's parents and immediate family members",
    ],
  },
  {
    word: "대박 (daebak)",
    language: "Korean",
    correctDescription: "Originally meaning a 'jackpot' or windfall of great fortune, it has evolved into an exclamation of astonishment at anything extraordinary or unbelievable — encompassing shock, awe, and admiration, it functions as a cultural marker of the Korean appetite for dramatic reversals and spectacular outcomes, whether positive or negative",
    distractors: [
      "A formal Korean blessing wishing someone prosperity and success in business ventures",
      "The Korean concept of cosmic karma ensuring that good deeds are eventually rewarded",
      "An expression of polite agreement used to maintain harmony in social conversations",
    ],
  },
  {
    word: "답정너 (dapjeongneo)",
    language: "Korean",
    correctDescription: "A situation in which someone asks a question but has already decided the answer they want to hear — the asker is not seeking information but validation, and any answer other than the predetermined one will be rejected or met with displeasure, capturing the frustration of being consulted without actually being given agency",
    distractors: [
      "The Korean educational practice of memorizing predetermined answers for standardized exams",
      "A rhetorical debate technique where one poses questions to which the answer is obvious",
      "The social expectation that younger people always agree with the opinions of their elders",
    ],
  },

  // ============================================================
  // YIDDISH (5)
  // ============================================================
  {
    word: "Schmuck",
    language: "Yiddish",
    correctDescription: "Originally and literally meaning 'jewel' or 'ornament' in German/Yiddish, it became vulgar slang for the penis before evolving into its current English usage as a contemptible or foolish person — the layers of meaning from precious object to anatomy to insult encapsulate the Yiddish tradition of ironic, multilayered language where nothing means only one thing",
    distractors: [
      "A person who is excessively stingy with money and unwilling to share their wealth",
      "An unintelligent person who consistently makes foolish decisions through stupidity alone",
      "A term of mild, affectionate teasing used between close friends and family members",
    ],
  },
  {
    word: "Kvell",
    language: "Yiddish",
    correctDescription: "To burst with pride and joy, especially over the accomplishments of a loved one — a warmth so overwhelming it cannot be contained, typically used for the pride parents feel in their children's achievements, but carrying a specifically public, almost involuntary quality of radiating happiness that must be shared and expressed",
    distractors: [
      "To complain loudly and at length about minor inconveniences and personal grievances",
      "To become overwhelmed with emotion and cry openly without embarrassment",
      "To brag excessively about one's own accomplishments in an attempt to impress others",
    ],
  },
  {
    word: "Naches",
    language: "Yiddish",
    correctDescription: "The deep, glowing pride and joy derived from the achievements of one's children or those one has mentored — distinct from ordinary pride in that it implies a profound fulfillment of generational purpose, the specific satisfaction that one's investment of love and teaching has borne fruit in the next generation",
    distractors: [
      "The sense of accomplishment felt after completing a difficult personal achievement",
      "The relief experienced when a prolonged period of worry or anxiety finally ends",
      "The communal celebration held when a young person reaches an important life milestone",
    ],
  },
  {
    word: "Mensch",
    language: "Yiddish",
    correctDescription: "A person of integrity and honor, someone who does the right thing — not merely a 'good person' in a bland sense, but someone who embodies the highest qualities of humanity: decency, responsibility, dignity, and moral rectitude, with an emphasis on character revealed through action rather than words or intention",
    distractors: [
      "A person of great intelligence and scholarly learning, respected for their wisdom",
      "A strong, physically imposing individual who commands respect through their presence",
      "A charismatic leader who inspires loyalty and devotion in their followers",
    ],
  },
  {
    word: "Luftmensch",
    language: "Yiddish",
    correctDescription: "Literally an 'air person' — someone with their head in the clouds, an impractical dreamer who has no discernible income or means of support, living on unrealistic plans and fanciful schemes, yet possessing a certain creative charm and intellectual vitality that makes their impracticality almost admirable",
    distractors: [
      "A free-spirited traveler who wanders from place to place without permanent residence",
      "A spiritual mystic who claims to communicate with supernatural forces and spirits",
      "An optimistic person who always sees the positive side of every difficult situation",
    ],
  },

  // ============================================================
  // SANSKRIT / HINDI (8)
  // ============================================================
  {
    word: "Dharma",
    language: "Sanskrit",
    correctDescription: "A vast concept encompassing cosmic law, moral duty, right conduct, and the natural order that sustains reality — not merely 'religion' or 'duty,' but the principle of righteousness that governs the universe at every scale, from the behavior of atoms to the obligations of kings, meaning simultaneously what is right, what is true, and what upholds the fabric of existence",
    distractors: [
      "The specific set of religious rituals and practices prescribed by Hindu scripture",
      "The concept of karma and the cycle of rebirth that governs all living beings",
      "A meditation technique for achieving spiritual enlightenment and liberation from suffering",
    ],
  },
  {
    word: "Ahimsa",
    language: "Sanskrit",
    correctDescription: "Non-violence in its most comprehensive form — not merely the absence of physical violence but the complete renunciation of the desire to harm any living being in thought, word, or deed, extending to psychological violence, harsh speech, and even the violence of indifference, requiring active compassion rather than passive avoidance of harm",
    distractors: [
      "The practice of vegetarianism and abstaining from consuming animal products",
      "A pacifist political ideology that opposes all forms of military action and warfare",
      "The Buddhist precept against killing, specifically applied to insects and small animals",
    ],
  },
  {
    word: "Maya",
    language: "Sanskrit",
    correctDescription: "The metaphysical concept that the perceived world is not ultimately real but a cosmic illusion — not that the world does not exist, but that our ordinary perception of it as a collection of separate, permanent objects is fundamentally mistaken, concealing the underlying unity of Brahman, where the illusion is both the power of divine creation and the veil that obscures ultimate truth",
    distractors: [
      "The Buddhist concept that all life is suffering caused by attachment to worldly desires",
      "A hallucination or false vision experienced during deep meditation or extreme ascetic practice",
      "The philosophical position that the material world is entirely imaginary and has no existence whatsoever",
    ],
  },
  {
    word: "Rasa",
    language: "Sanskrit",
    correctDescription: "The aesthetic flavor or emotional essence evoked by a work of art — not the emotion itself but the refined, impersonal experience of that emotion as transformed through artistic expression, theorized in the Natyashastra as eight (later nine) primary aesthetic moods that art can evoke in a cultivated audience, creating an experience that transcends personal feeling",
    distractors: [
      "The physical taste or flavor of food as experienced by the tongue and palate",
      "The artist's personal emotional state that they express through their creative work",
      "The critical evaluation of an artwork's technical quality and adherence to classical standards",
    ],
  },
  {
    word: "Lila",
    language: "Sanskrit",
    correctDescription: "Divine play — the concept that the creation and existence of the universe is the spontaneous, joyful play of the divine, undertaken not out of necessity or purpose but from an overflow of creative delight, implying that the cosmos is fundamentally playful rather than mechanistic, and that the divine relates to creation as an artist relates to art",
    distractors: [
      "A ritual theatrical performance reenacting scenes from Hindu mythological epics",
      "The concept of God testing mortals through trials and suffering to prove their devotion",
      "The playful, mischievous aspect of the god Krishna's character in Hindu mythology",
    ],
  },
  {
    word: "Jugaad",
    language: "Hindi",
    correctDescription: "A frugal, flexible approach to problem-solving that creates workable solutions from limited resources through ingenuity and improvisation — neither celebrated nor condemned outright, it occupies an ambiguous cultural space between admired resourcefulness and a critique of systems so broken that workarounds become a way of life",
    distractors: [
      "The Indian tradition of arranged marriages organized by families based on social compatibility",
      "The practice of bargaining aggressively for the lowest possible price in marketplaces",
      "A corrupt system of bribes and favors used to circumvent government regulations",
    ],
  },
  {
    word: "Santosha",
    language: "Sanskrit",
    correctDescription: "Contentment as a spiritual practice — not passive complacency or settling for less, but an active, disciplined cultivation of satisfaction with what is, a conscious choice to find fulfillment in the present moment regardless of external circumstances, counted among the niyamas (observances) in Patanjali's Yoga Sutras as essential for spiritual development",
    distractors: [
      "The blissful, euphoric state experienced at the peak of deep meditation",
      "The Hindu concept of accepting one's social position and duties without complaint",
      "A feeling of happiness and gratitude that arises naturally from good fortune",
    ],
  },
  {
    word: "Seva",
    language: "Sanskrit",
    correctDescription: "Selfless service performed as a spiritual practice — work done for others without expectation of reward or recognition, where the act of serving is itself the spiritual discipline, dissolving the ego's distinction between self and other, and transforming mundane labor into a form of worship and a path toward liberation",
    distractors: [
      "The charitable donations and tithes given to religious institutions and temples",
      "The Hindu caste system's assignment of specific occupational duties to each social class",
      "Volunteer work performed to build social status and reputation within a community",
    ],
  },

  // ============================================================
  // OTHER LANGUAGES (30)
  // ============================================================
  {
    word: "Duende",
    language: "Spanish",
    correctDescription: "A heightened state of raw, authentic emotion and artistic power that temporarily possesses a performer, described by Lorca as a force that 'climbs up through the soles of the feet' — not talent or technique but a mysterious, dark, earth-bound power connected to death, struggle, and the authentic expression of what it means to be mortal",
    distractors: [
      "A mischievous fairy or goblin from Spanish and Latin American folklore",
      "The lively, joyful atmosphere at a traditional Spanish fiesta or celebration",
      "The technical mastery and precision required to perform flamenco at a professional level",
    ],
  },
  {
    word: "Sobremesa",
    language: "Spanish",
    correctDescription: "The period of lingering conversation and relaxation at the table after a meal has ended — not merely 'after-dinner chat' but a protected social ritual, a time when the food is finished but no one moves to leave, and the conversation deepens into a form of communal bonding that is valued as much as the meal itself",
    distractors: [
      "The elaborate formal table setting and decoration prepared for important Spanish meals",
      "A digestive herbal tea or liqueur served immediately after the dessert course",
      "The Spanish custom of an afternoon nap taken after the midday meal",
    ],
  },
  {
    word: "Meraki",
    language: "Greek",
    correctDescription: "To do something with soul, creativity, and love — to pour oneself wholeheartedly into a task so that a piece of your essence is left in the work, whether it is cooking, painting, writing, or any other act of creation, where the boundary between maker and made becomes porous",
    distractors: [
      "The competitive excellence and drive for perfection valued in ancient Greek athletic contests",
      "A traditional Greek marketplace where artisans sell handcrafted goods",
      "The philosophical pursuit of truth and wisdom through rational argumentation and debate",
    ],
  },
  {
    word: "Philotimo",
    language: "Greek",
    correctDescription: "Literally 'love of honor' — a complex Greek concept encompassing personal pride, dignity, duty to others, hospitality, and doing what is right even at personal cost, considered the highest virtue in Greek culture, driving generous and honorable behavior not for reward but because one's sense of self demands it",
    distractors: [
      "The Greek tradition of demonstrating wealth and status through lavish public generosity",
      "The romantic ideal of courtly love and devotion as depicted in ancient Greek poetry",
      "A strict moral code that demands revenge for any perceived insult to one's family honor",
    ],
  },
  {
    word: "Ubuntu",
    language: "Zulu/Xhosa",
    correctDescription: "A philosophy expressed as 'I am because we are' — the belief that a person's humanity is inextricably bound to the humanity of others, that one cannot be fully human in isolation, and that the self is defined through relationships and community rather than individual achievement, functioning as both an ethical framework and an ontological claim",
    distractors: [
      "The African tradition of tribal governance through the authority of village elders",
      "A spiritual practice of communicating with ancestral spirits for guidance and protection",
      "The collective ownership of land and resources practiced in traditional African communities",
    ],
  },
  {
    word: "Uitwaaien",
    language: "Dutch",
    correctDescription: "To walk in the wind for the sheer pleasure and refreshment of it — literally 'to blow out,' it describes the specific, bracing restoration of going outdoors into the wind to clear one's head and revitalize the spirit, considered a legitimate and valued activity in Dutch culture rather than mere aimless wandering",
    distractors: [
      "The Dutch tradition of ice skating on frozen canals during the winter season",
      "A long-distance cycling expedition undertaken for physical fitness and recreation",
      "The practice of opening all windows in the house to let fresh air circulate through the rooms",
    ],
  },
  {
    word: "Gezellig",
    language: "Dutch",
    correctDescription: "A quality of coziness, warmth, and togetherness that transcends simple comfort — describing an atmosphere, situation, or person that is convivial, intimate, and imbued with belonging, it can apply to a candlelit dinner, a lively pub, or a person whose presence creates warmth, fundamentally about human connection in comfortable settings",
    distractors: [
      "The Dutch concept of efficient, practical design that prioritizes function over decoration",
      "A personality trait characterized by being outgoing, sociable, and the center of attention",
      "The feeling of relaxation experienced when returning to one's own home after a long journey",
    ],
  },
  {
    word: "Sprezzatura",
    language: "Italian",
    correctDescription: "A studied nonchalance and effortless mastery that conceals the art behind the art — as defined by Castiglione, the ability to make the difficult appear easy, to display grace and accomplishment while seeming to do so without effort, requiring enormous discipline to achieve the appearance of having no discipline at all",
    distractors: [
      "The Italian appreciation for fine clothing, luxury goods, and sophisticated personal style",
      "A carefree, spontaneous attitude toward life that prioritizes pleasure over responsibility",
      "The dramatic flair and passionate emotional expression characteristic of Italian culture",
    ],
  },
  {
    word: "Dolce far niente",
    language: "Italian",
    correctDescription: "The sweetness of doing nothing — not laziness or idleness, but the deliberate, pleasurable savoring of leisure, the conscious enjoyment of a moment free from obligation and productivity, elevated to an art form that recognizes the deep human need for unstructured time and the luxury of simply existing",
    distractors: [
      "The Italian tradition of an extended midday meal followed by a restful afternoon",
      "The bittersweet nostalgia for a simpler, slower way of life from a past era",
      "The meditative practice of emptying the mind of all thoughts to achieve inner stillness",
    ],
  },
  {
    word: "Hiraeth",
    language: "Welsh",
    correctDescription: "A deep, soul-level homesickness for a home that may no longer exist or perhaps never existed — a longing for a lost homeland, a vanished era, or an idealized past that transcends mere nostalgia, carrying grief for what has been irrevocably lost combined with an almost mystical pull toward a place of belonging that exists more in feeling than in geography",
    distractors: [
      "The Welsh tradition of communal singing that expresses shared joy and sorrow",
      "A patriotic devotion to the preservation of the Welsh language and cultural traditions",
      "The sadness felt when leaving one's village to seek employment in a distant city",
    ],
  },
  {
    word: "Gigil",
    language: "Filipino/Tagalog",
    correctDescription: "The irresistible urge to squeeze, pinch, or hug something unbearably cute — a physical compulsion triggered by overwhelming affection, where cuteness becomes so intense that it provokes a quasi-aggressive response, a trembling or gritting of teeth from the sheer force of adoration that has no outlet proportionate to the feeling",
    distractors: [
      "The ticklish, giddy sensation experienced when laughing uncontrollably with friends",
      "A nervous, restless energy felt before an exciting or anticipated event",
      "The Filipino custom of warmly welcoming all guests with food and physical affection",
    ],
  },
  {
    word: "Hygge",
    language: "Danish",
    correctDescription: "A quality of cozy togetherness and comfortable conviviality that engenders contentment and well-being — more than comfort or coziness alone, it describes a specific atmosphere of intimacy, warmth, and unpretentious pleasure in simple shared experiences, from candlelight and warm drinks to quiet evenings with close friends, fundamentally about presence and connection",
    distractors: [
      "The Scandinavian practice of maintaining immaculately clean and organized living spaces",
      "A philosophy of extreme minimalism where all unnecessary possessions are discarded",
      "The Danish welfare state model that provides comprehensive social security to all citizens",
    ],
  },
  {
    word: "Toska (different from Russian toska)",
    language: "Czech (stesk)",
    correctDescription: "A form of longing or pining specific to Czech culture — less cosmic than Russian toska, it centers on missing specific people, places, or periods of one's life, carrying a sweet, almost treasured quality of cherishing the ache of absence as proof that something mattered deeply enough to leave a wound",
    distractors: [
      "A philosophical pessimism about the political situation in Central Europe",
      "The general sadness and malaise felt during the short, dark days of winter",
      "A nostalgic longing for the pre-Communist era of Czech cultural and intellectual life",
    ],
  },
  {
    word: "Iktsurpok",
    language: "Inuit",
    correctDescription: "The feeling of anticipation that leads you to keep going outside to check if someone is coming — the restless, excited impatience of expecting a visitor, manifested in the repeated physical act of going to look, capturing both the emotional state and the compulsive behavior it produces",
    distractors: [
      "The Inuit practice of scanning the horizon for approaching weather changes or animal herds",
      "A spiritual vigil kept while waiting for the return of hunters from a dangerous expedition",
      "The anxiety experienced when a family member is traveling in dangerous arctic conditions",
    ],
  },
  {
    word: "Mamihlapinatapai",
    language: "Yaghan",
    correctDescription: "A look shared between two people, each wishing the other would initiate something that both desire but neither is willing to begin — often cited as the most succinct untranslatable word, it captures an entire narrative of mutual desire, shared hesitation, and the pregnant silence of unspoken wishes in a single term",
    distractors: [
      "A deep spiritual connection felt between two people who have known each other in past lives",
      "The telepathic understanding between twins or very close siblings who can communicate without words",
      "An intense staring contest used as a ritual to determine social hierarchy in indigenous cultures",
    ],
  },
  {
    word: "Jayus",
    language: "Indonesian",
    correctDescription: "A joke so poorly told and so unfunny that one cannot help but laugh — not at the joke itself but at the spectacular failure of the joke, where the humor arises from the gap between the teller's intention and the result, a laughter born of the absurdity of the attempt rather than the content",
    distractors: [
      "A specific style of Indonesian slapstick comedy involving physical humor and pratfalls",
      "The social obligation to laugh at a superior's jokes regardless of their actual humor",
      "A witty, improvised joke delivered spontaneously in response to an unexpected situation",
    ],
  },
  {
    word: "Tartle",
    language: "Scottish",
    correctDescription: "The panicky hesitation experienced when you have to introduce someone but have momentarily forgotten their name — a specific, universally recognized micro-crisis that captures the particular social horror of the blank moment between opening your mouth to make an introduction and realizing the name has vanished",
    distractors: [
      "The Scottish habit of understating compliments and deflecting praise with self-deprecation",
      "A long, awkward pause in conversation when no one can think of anything to say",
      "The nervous stammer that occurs when trying to speak in front of a large audience",
    ],
  },
  {
    word: "Wabi",
    language: "Japanese",
    correctDescription: "The beauty found in rustic simplicity, poverty, and imperfection — distinct from sabi, wabi specifically evokes the aesthetic and spiritual value of austerity, roughness, and asymmetry, originating in the tea ceremony tradition where a rough, handmade bowl is prized over a perfect one, finding profundity in what is humble and unrefined",
    distractors: [
      "The Japanese art of flower arrangement emphasizing natural forms and seasonal materials",
      "A state of quiet, meditative solitude sought in Zen Buddhist practice",
      "The deliberate simplification of one's possessions and lifestyle to reduce attachment",
    ],
  },
  {
    word: "Sabi",
    language: "Japanese",
    correctDescription: "The beauty that comes with the passage of time — specifically the patina of age, the wear and weathering that reveals an object's history, the quiet, lonely beauty of things that have endured, finding aesthetic value in rust, tarnish, moss, and the visible evidence of transience marked upon the material world",
    distractors: [
      "The sadness experienced when a beautiful thing reaches the end of its useful life",
      "The Japanese practice of preserving antiques and historical artifacts in pristine condition",
      "A melancholy appreciation of autumn as the most beautiful yet saddest season",
    ],
  },
  {
    word: "Dor",
    language: "Romanian",
    correctDescription: "A profound longing and aching need for someone or something absent — similar to Portuguese saudade but with a more active, burning quality, implying not just passive sadness but an intense, almost physical yearning that colors one's entire experience, considered the defining emotion of Romanian culture and poetry",
    distractors: [
      "The Romanian tradition of elaborate mourning rituals lasting forty days after a death",
      "A passionate, fiery love that burns intensely but briefly before fading away",
      "The nationalistic pride felt for Romania's unique position between Eastern and Western Europe",
    ],
  },
  {
    word: "Lagom",
    language: "Swedish",
    correctDescription: "Just the right amount — not too much, not too little, but the precise, balanced measure that is appropriate for the situation, reflecting a deeply Swedish cultural value of moderation, fairness, and sufficiency that rejects both excess and deprivation in favor of sustainable equilibrium",
    distractors: [
      "The Swedish design principle of creating functional, affordable products for mass consumption",
      "A minimalist lifestyle philosophy that advocates owning as few possessions as possible",
      "The Swedish tradition of workplace equality where hierarchies are deliberately flattened",
    ],
  },
  {
    word: "Fika",
    language: "Swedish",
    correctDescription: "A daily social ritual of taking a break for coffee and pastry with others — far more significant than a 'coffee break,' it is a cornerstone institution of Swedish social and professional life, a sacred pause for connection and conversation that is both a right and an expectation, where the beverage matters less than the act of gathering",
    distractors: [
      "The Swedish tradition of baking elaborate pastries and cakes for weekend family gatherings",
      "An afternoon tea ceremony influenced by British customs but adapted to Swedish tastes",
      "The practice of drinking multiple cups of strong coffee throughout the day to maintain productivity",
    ],
  },
  {
    word: "Tingo",
    language: "Pascuense (Easter Island)",
    correctDescription: "The act of gradually borrowing all the possessions from a neighbor's house, one by one, until there is nothing left — a culturally specific concept of incremental acquisition that blurs the line between borrowing and taking, describing a process so gradual that no single act seems unreasonable while the cumulative effect is total dispossession",
    distractors: [
      "The Easter Island tradition of communal sharing where all resources belong to the entire village",
      "A ritual exchange of gifts between neighboring families to strengthen social bonds",
      "The practice of hoarding valuable objects as a display of social status and power",
    ],
  },
  {
    word: "Schilderwald",
    language: "German",
    correctDescription: "Literally 'sign forest' — a street or area so cluttered with road signs, directional markers, and regulatory notices that they become impossible to follow and self-defeating, the bureaucratic overregulation made physically manifest in a thicket of contradictory signage that overwhelms rather than guides",
    distractors: [
      "A dense, primeval forest where the trees are so thick that sunlight cannot penetrate to the ground",
      "The complex system of German highway rules and regulations that foreign drivers find confusing",
      "A metaphor for the impenetrable complexity of German bureaucratic paperwork and forms",
    ],
  },
  {
    word: "Litost",
    language: "Czech",
    correctDescription: "A state of torment created by the sudden realization of one's own misery — as described by Milan Kundera, a complex feeling combining grief, sympathy, remorse, and an indefinable longing, triggered when confronted with one's own inadequacy, often producing a desire to retaliate against the person who exposed it",
    distractors: [
      "The quiet sadness experienced when a long-anticipated event fails to meet expectations",
      "A deep empathy and compassion for the suffering of others that motivates charitable action",
      "The bitterness and resentment felt toward those who have achieved what one has failed to achieve",
    ],
  },
  {
    word: "Togu na",
    language: "Dogon (Mali)",
    correctDescription: "A low-roofed communal meeting shelter intentionally built too short to stand up in — designed so that disputes must be conducted while seated or crouching, making it physically impossible to jump up in anger, the architecture itself functioning as a conflict-resolution mechanism that enforces deliberation over impulsive violence",
    distractors: [
      "A sacred hut where village elders gather to perform religious ceremonies and rituals",
      "The traditional round dwelling constructed by Dogon families using mud and timber",
      "A shaded rest area built along trading routes for weary travelers to sleep and recover",
    ],
  },
  {
    word: "Ilunga",
    language: "Tshiluba (Congo)",
    correctDescription: "A person who is ready to forgive any abuse the first time, to tolerate it a second time, but never a third time — encapsulating a precise, calibrated approach to forgiveness that is neither unlimited nor zero-tolerance, but a measured three-strike philosophy that balances mercy with self-respect",
    distractors: [
      "A village chief known for wisdom and fairness in settling disputes between community members",
      "The cultural practice of granting unconditional forgiveness to anyone who sincerely apologizes",
      "A person who holds grudges indefinitely and never forgives even the smallest slight",
    ],
  },
  {
    word: "Ya'aburnee",
    language: "Arabic",
    correctDescription: "Literally 'you bury me' — the declaration that you hope to die before a loved one because you cannot bear the thought of living without them, expressing love so profound that one's own death is preferable to enduring the other's absence, transforming a morbid thought into the most extreme declaration of devotion",
    distractors: [
      "A traditional Arabic wedding vow promising eternal devotion and loyalty until death",
      "An expression of deep gratitude indicating that one would sacrifice anything for another person",
      "A poetic phrase describing the grief of a parent who outlives their child",
    ],
  },
  {
    word: "Bakku-shan",
    language: "Japanese",
    correctDescription: "A person who looks attractive from behind but not from the front — a specific, mordant observation that captures the gap between expectation and reality, the disappointment of turning around, and the Japanese cultural tendency to give precise names to very specific human experiences and social observations",
    distractors: [
      "The Japanese concept of inner beauty that transcends physical appearance entirely",
      "A person whose beauty is revealed gradually through their personality rather than their looks",
      "The deceptive appearance of something that seems valuable from a distance but is worthless up close",
    ],
  },
];
