// ============================================================================
// TERRIBLE LITTLE LIVES - RELATIONSHIP NARRATIVE & DIALOGUE VARIATIONS CATALOG
// Gothic-Atmospheric Dialogue Engine with Melancholic & Dark Touches
// ============================================================================

(function() {
  function formatLine(template, vars) {
    if (!template) return '';
    let str = template;
    for (const [key, val] of Object.entries(vars)) {
      const regex = new RegExp(`\\{${key}\\}`, 'g');
      str = str.replace(regex, val !== undefined ? val : '');
    }
    return str;
  }

  function pickRandom(arr) {
    if (!arr || arr.length === 0) return '';
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // ==========================================================================
  // 1. INFANT ACTIONS: BABBLE (Age 0-5)
  // ==========================================================================
  const BABBLE_POOLS = {
    revealed: [
      "You pointed your tiny finger at {name} and let out rhythmic, metallic clicks. Its disguised pupils dilated in cold, amused fascination.",
      "You gurgled a sequence of dissonant syllables at {name}. A shadow detached from its silhouette and danced across the ceiling before returning.",
      "Looking up at {name}, you babbled a backward phrase. The candle flame in the sconce bent toward you in dead, motionless air.",
      "You cooed at {name} while clutching its cold wrist. Its flesh felt like waxen porcelain, and a low vibrational purr hummed beneath its skin.",
      "You chirped innocent baby sounds at {name}. It leaned down, whispering an ancient name into your ear that made the room temperature drop five degrees.",
      "You pointed at {name} and repeated a hollow humming sound. It smiled without moving its facial muscles: 'The infant perceives the veil.'"
    ],
    nonFamily: [
      "You babbled animatedly at {name}, waving your arms and sputtering {word}. They grinned warmly and repeated silly words back to you.",
      "You clapped your small hands and offered a cheerful {word} to {name}. They laughed, booped your nose, and offered a soft stuffed toy.",
      "You reached for {name}'s shiny coat buttons while cooing {word}. They gently unclasped your tiny fingers with an amused chuckle.",
      "You stared curiously at {name} and offered a loud, confident {word}. They chuckled: 'Well aren't you a clever little conversationalist!'",
      "You hid your face behind your tiny hands before popping out with a sudden {word} at {name}, sending them into a warm fit of laughter.",
      "You babbled softly while tugging at {name}'s sleeve. They knelt down to your eye level, speaking gentle nonsense words to keep you smiling."
    ],
    cold_detached: {
      father: [
        "You pointed your tiny hand at your father and babbled {word}. He lowered his financial broadsheet an inch, observed your mouth movements with detached clinical scrutiny, uttered an indifferent \"Mm,\" and went back to reading without touching you.",
        "You crawled to your father's polished leather oxfords and squeaked {word}. He paused his fountain pen, checked his gold pocket watch, and noted: \"Articulate syllables require discipline. Do not drool on the calfskin.\"",
        "You babbled {word} while reaching for your father's signet ring. He calmly withdrew his hand, keeping his immaculate cuffs pristine: \"A gentleman maintains physical composure, even in the nursery.\"",
        "Sitting on the drafty parquet floor, you offered a loud, cheerful {word} to your father. He adjusted his silk tie without looking down: \"Quiet in the study. Silence is the foundation of character.\"",
        "You stammered {word} and tugged his trousers. Your father sighed with weary aristocracy, rang the brass handbell for the nursery nurse, and resumed auditing bond yields.",
        "You cooed {word} from your mahogany playpen. Your father gave an emotionless, two-second nod in your direction before closing the double oak doors behind him."
      ],
      mother: [
        "You reached toward your mother, cooing {word}. She gave a dry, polite nod: \"Articulate syllables are expected of our pedigree. Refrain from dribbling on the Persian rug.\"",
        "You babbled {word} at your mother's silk evening gown. She lifted her velvet hem with gloved fingertips to avoid your sticky hands: \"Nursery maid, fetch a fresh linen handkerchief at once.\"",
        "You gurgled {word} and smiled up at your mother. She gazed down with icy, porcelain perfection, offering only the tip of her index finger for you to hold: \"A proper daughter/son speaks with reserve.\"",
        "You clapped your hands and said {word} while your mother arranged cold calla lilies in a crystal vase. She offered a measured smile that never touched her eyes: \"Adequate effort. Now rest your vocal cords.\"",
        "You stumbled forward, babbling {word} into your mother's lap. She remained rigid as an alabaster statue, waiting until the nurse scooped you away before smoothing her dress.",
        "You squeaked {word} in the drawing room. Your mother paused her tea cup mid-air, noted your grammar with clinical detachment, and murmured: \"Pedigree demands precision, not vulgar babbling.\""
      ],
      sibling: [
        "You gurgled and waved at your {role} {name}. They gave you a stiff, formal glance across the drawing room, returning immediately to their private violin study.",
        "You babbled {word} and tried to touch {name}'s pristine schoolbooks. They coolly shifted the leather satchel out of reach: \"Do not soil my Latin homework with nursery slobber.\"",
        "You giggled and offered a block to {name}, saying {word}. They gave a brief, aristocratic nod of acknowledgment before returning to their posture drills without a smile.",
        "You crawled toward {name} and squeaked {word}. They stood up, dusted their pressed flannel trousers, and moved to the opposite end of the vast, echoing library.",
        "You babbled {word} at {name}. They regarded you with quiet, competitive calculation, wondering how the family inheritance might eventually be divided.",
        "You cooed {word} from your blanket. {name} looked down with polite emotional distance, murmuring: \"Father expects straight marks from both of us. Do not become a distraction.\""
      ],
      grand: [
        "{name} peered down their gold-rimmed pince-nez: \"Adequate diction. The vocal cords appear free of vulgar defects.\"",
        "{name} rested a dry, liver-spotted hand on your head for exactly three seconds: \"The family jawline carries sound vowels. Cultivate silence until you have something profitable to say.\"",
        "You babbled {word} at {name}'s velvet armchair. They turned a yellowed page of the dynastic ledger without smiling: \"Generations of magistrates, and here we begin once again at the animal stage.\"",
        "You squeaked {word} and reached for {name}'s ivory cane. They tapped the rug firmly: \"Grip is firm. Temperament: overly demonstrative. We must weed that sentimentality out before school.\"",
        "{name} inspected your ears and throat with cold diagnostic calm: \"The ancestral ears are intact. Enunciate your consonants, infant.\"",
        "You cooed {word} in {name}'s presence. They offered a crisp, formal nod of approval: \"A respectable start. See that you do not embarrass the family name when speech fully arrives.\""
      ],
      fallback: [
        "You babbled at {name}. They observed your efforts with cool, impassive composure.",
        "You squeaked {word} at {name}, who offered an emotionless nod from across the high-ceilinged room.",
        "You reached out babbling {word}. {name} maintained polite physical distance with aristocratic poise."
      ]
    },
    deeply_religious: {
      father: [
        "You pointed at your father and babbled {word}. He frowned and pressed a heavy index finger to your lips: \"Quiet, child. The evening examination of conscience is at hand. Idle chatter invites wickedness into the throat.\"",
        "You cooed {word} while your father was on his knees before the hearth crucifix. He let out a harsh sigh: \"Must even an infant interrupt holy supplication? Learn the mortification of the tongue.\"",
        "You babbled {word} and grabbed your father's iron cross pendant. He gripped your wrist with stern intensity: \"The cross is not a toy for babbling babes. It is the instrument of our judgment.\"",
        "You shouted {word} with baby delight. Your father bowed his head in grim penitence, murmuring: \"Lord, forgive this home for frivolous clamor. Cleanse this child's heart of early rebellion.\"",
        "You stumbled toward your father cooing {word}. He sprinkled three droplets of holy water on your brow, praying aloud that your infant voice never speaks blasphemy.",
        "You babbled {word} from your crib. Your father gazed down with deep, agonizing dread: \"Pray heaven guards your soul, for the world outside these walls is a furnace of perdition.\""
      ],
      mother: [
        "You cooed {word} from your crib. Your mother bowed her head over a carved rosary: \"May that young tongue learn holy scripture before the devil teaches it worldly vanity.\"",
        "You reached for your mother, babbling {word}. Tears welled in her bloodshot eyes as she murmured: \"Born into iniquity... Lord, wash the stain of Adam from this precious vessel.\"",
        "You gurgled {word} happily. Your mother pressed a small pewter saint's medallion into your palm, whispering urgent prayers against creeping night spirits.",
        "You squeaked {word} in the candlelit bedroom. Your mother dropped to her knees beside your crib, kissing your forehead while chanting the Seven Penitential Psalms.",
        "You babbled {word} while your mother fasted on dry crusts. She stroked your cheek with cold, trembling fingers: \"Feed on milk now, child; life in this sinful city is bitter fasting.\"",
        "You pointed at the wall shadows cooing {word}. Your mother gasped, hurried to your side with a blessed candle, and traced crosses on your crib railings to ward off demons."
      ],
      sibling: [
        "Your {role} {name} knelt beside your crib and nervously whispered: \"Say 'A-men', say 'A-men'! If you make noise during prayer hour, father will fetch the ruler!\"",
        "You babbled {word} at {name}. They looked terror-stricken toward the locked door, whispering: \"Hush! If they hear you laughing during the Lenten silence, we'll both be kneeling on gravel!\"",
        "You reached for {name}'s wooden prayer beads, cooing {word}. They shared a secret, desperate look with you: \"I'll say an extra decade of the rosary so you don't get punished, little one.\"",
        "You gurgled {word} and smiled. {name} smiled back faintly, clutching their worn catechism: \"I hope heaven lets babies into paradise without having to confess their sins first.\"",
        "You babbled {word} loudly. {name} quickly shoved a clean rag into your hands to chew on, whispering: \"Quiet, quiet! The house must stay as silent as a crypt before vespers.\"",
        "You cooed {word} from your blanket. {name} knelt down and held your tiny hand: \"When you grow up, we'll pray together so the dark shadows outside don't take us.\""
      ],
      grand: [
        "{name} anointed your tongue with a drop of bitter holy water, murmuring prayers to seal your infant speech against blasphemies.",
        "{name} rocked your cradle with a bony hand, chanting ancient Latin litanies: \"Vessels of clay, born to suffer and weep until redeemed.\"",
        "You babbled {word} at {name}. They touched a wooden crucifix to your lips: \"May those infant cries be transformed into perpetual prayers of repentance.\"",
        "{name} checked the salt line beneath your crib, nodding grimly as you cooed: \"The fiend prowls like a roaring lion. Keep your tongue pure, babe.\"",
        "You reached toward {name}'s dark veil saying {word}. They whispered: \"The grave is shallow, but heaven is steep. Learn obedience before pride takes root.\"",
        "{name} made the sign of the cross over your small chest: \"Lord have mercy on this newborn creature in an apostate city.\""
      ],
      fallback: [
        "You babbled holy sounds while {name} whispered solemn prayers over your cradle.",
        "You cooed {word} at {name}, who bowed their head and recited a verse against worldly vanity.",
        "You babbled softly while {name} crossed themselves and whispered a plea for divine mercy."
      ]
    },
    religious: {
      father: [
        "You pointed at your father and babbled {word}. A serene smile crossed his face: \"God willing, those little lips will speak words of truth and peace.\"",
        "You cooed {word} from your crib. Your father gently patted your tummy: \"Listen to our little choir singer! Sunday service will be bright with your praise.\"",
        "You babbled {word} while your father was reading the family Bible. He smiled warmly, closed the leather clasp, and held you up to the window light.",
        "You tugged your father's Sunday vest and chirped {word}. He chuckled: \"A joyful noise to the heavens! You bring light into this humble house.\"",
        "You reached for your father's reading glasses, babbling {word}. He smiled and kissed your temple: \"Grow strong in grace, little one.\"",
        "You babbled {word} with baby enthusiasm. Your father smiled, offering a wooden carved lamb: \"May your path always be guided by the Good Shepherd.\""
      ],
      mother: [
        "Your mother beamed and clapped her hands: \"Praise heaven! Listen to those sweet first words!\"",
        "You cooed {word} into your mother's apron. She rocked you gently, humming a lovely morning psalm that lulled you into peaceful contentment.",
        "You babbled {word} while your mother set the dinner table. She stopped to kiss your cheeks: \"Such a sweet, bright voice in our home!\"",
        "You chirped {word} from your highchair. Your mother smiled warmly: \"Thank the Lord for every blessed tooth and every sweet syllable.\"",
        "You reached up toward your mother's warm embrace cooing {word}. She bundled you in a clean cotton blanket: \"An angel's greeting in the morning!\"",
        "You babbled {word} while watching church bells swing through the window. Your mother smiled: \"The bells ring for service, and you sing along!\""
      ],
      sibling: [
        "Your {role} {name} held up an illustrated catechism card, cheering as you mimicked the syllables.",
        "You babbled {word} at {name}. They giggled and clapped: \"Say it again! Say it again! Mother, listen to what the baby just said!\"",
        "You cooed {word} and shared a painted wooden sheep with {name}, who happily sat on the rug teaching you animal sounds.",
        "You chirped {word} in {name}'s ear. They laughed and gave you a gentle bear hug: \"You're the sweetest baby in Sunday school!\"",
        "You babbled {word} while {name} was building block towers. They let you knock the tower down with a big, joyful grin.",
        "You reached for {name}'s hand cooing {word}. They guided your tiny fingers into a gentle prayer fold, giggling softly with you."
      ],
      grand: [
        "{name} chuckled warmly, whispering proverbs as you made playful baby sounds.",
        "{name} rocked your cradle by the fireplace, humming old church hymns in rhythm with your happy babbles.",
        "You cooed {word} at {name}. They offered a sweet lemon lozenge to suck on: \"A sweet tongue for a sweet spirit, praise be.\"",
        "{name} gently smoothed your hair: \"Generations come and go, but the Lord's mercy stays green in every new cradle.\"",
        "You babbled {word} into {name}'s knitted shawl. They smiled with nostalgic warmth, telling you stories of baptisms long ago.",
        "{name} held your small hand: \"May those little feet walk straight down the narrow path, darling child.\""
      ],
      fallback: [
        "You babbled happily at {name}, who thanked the heavens for your bright voice.",
        "You cooed {word} at {name}, who smiled warmly and blessed your little brow.",
        "You made cheerful baby sounds while {name} patted your back with gentle affection."
      ]
    },
    extremely_strict: {
      father: [
        "You stammered {word} toward your father. His eyes narrowed critically: \"Do not mumble. Enunciate the consonant clearly. In this world, lazy speech reflects a lazy mind.\"",
        "You babbled {word} from the floor. Your father checked his pocket watch: \"Play time expired three minutes ago. Stand up straight and practice proper standing drills.\"",
        "You squeaked {word} while reaching for his paperwork. Your father folded his arms coldly: \"Uncontrolled outbursts will not be tolerated. Silence until permitted.\"",
        "You chirped {word} loudly. Your father gave a sharp tap on the mahogany table with his ruler: \"Volume control, child. Loudness is a sign of lack of discipline.\"",
        "You babbled {word} with a grin. Your father remained stone-faced: \"Smiles do not excuse imprecise pronunciation. Again. Properly this time.\"",
        "You reached toward your father squeaking {word}. He pointed at the nursery calendar: \"Speech drills commence tomorrow at 0700 hours sharp. Prepare yourself.\""
      ],
      mother: [
        "Your mother corrected your posture with a firm hand: \"Repeat it properly. Precision and discipline begin before you can walk.\"",
        "You babbled {word} and dribbled on your bib. Your mother immediately wiped your mouth with sterile linen: \"Dignity, child. Messiness is the first step to failure.\"",
        "You cooed {word} playfully. Your mother inspected your small fingers for cleanliness: \"Good diction is useless without spotless presentation. Wash your hands.\"",
        "You squeaked {word} from your crib. Your mother straightened your blanket with military hospital corners: \"Order in the cradle, order in life. Sleep now.\"",
        "You stammered {word} while reaching for toys. Your mother restricted your toy box: \"First you enunciate three vowels cleanly, then you earn ten minutes of play.\"",
        "You babbled {word} with enthusiasm. Your mother shook her head: \"Do not shriek. A well-bred child is seen and rarely heard.\""
      ],
      sibling: [
        "Your {role} {name} hissed in panic: \"Shh! Keep your voice down! If mother hears you yelling, we'll both get extra math drills!\"",
        "You babbled {word} at {name}. They nervously adjusted their collar: \"Quiet! Father is grading report cards in the study. One sound and we lose dessert!\"",
        "You cooed {word} and tugged {name}'s sleeve. They quickly smoothed your hair: \"Stand up straight before mother inspects the nursery, hurry!\"",
        "You squeaked {word} excitedly. {name} pushed a study flashcard into your hands: \"Learn the letters, baby. If you fall behind in this house, you'll be grounded forever.\"",
        "You babbled {word} while {name} practiced violin scales. They didn't miss a single note, whispering through gritted teeth: \"Don't distract me, I'll get demerits!\"",
        "You giggled {word} at {name}. They looked nervously toward the hallway clock: \"Three minutes until evening inspection. Hide the stuffed bear!\""
      ],
      grand: [
        "{name} tapped the arm of their mahogany chair: \"Standards must be upheld. No baby gibberish at this table.\"",
        "{name} inspected your posture with a stern frown: \"Slumping already? Spine straight. Sloth starts in the crib.\"",
        "You babbled {word} at {name}. They pointed their cane at your feet: \"Knees together. Proper decorum begins in toddlerhood.\"",
        "{name} examined your fingernails: \"Clean. But that diction is appalling. When I was two, I recited French verbs.\"",
        "You cooed {word} from the rug. {name} sighed with unyielding austerity: \"Life is a battlefield, not a playground. Toughen up, child.\"",
        "{name} observed your babbling coldly: \"Waste no breath on foolish noises. Only speak when you have achieved excellence.\""
      ],
      fallback: [
        "You babbled at {name}, who strictly corrected your pronunciation.",
        "You made baby sounds while {name} checked your posture with an unbending stare.",
        "You squeaked {word} at {name}, who reminded you that discipline begins in the cradle."
      ]
    },
    alcoholic: {
      father_irritable: [
        "You squeaked {word} and rattled your spoon. Your father flinched, clutching his throbbing temples, and snarled groggily: \"Shut it! Can't a working man get five minutes without that shrieking?!\"",
        "You babbled {word} from your crib. Your father stumbled through the door, kicked an empty boot, and cursed under his breath: \"Quiet down in there, for God's sake!\"",
        "You shouted {word} happily. Your father slammed his mug on the counter with a loud crack: \"My head is splitting! Go bother your mother!\"",
        "You reached toward your father squeaking {word}. He recoiled with bleary irritation, reeking of stale gin: \"Get that kid out of my face right now.\"",
        "You chirped {word} in the morning kitchen. Your father groaned into his stained hands: \"Stop the noise... stop the goddamn noise...\"",
        "You babbled {word} while your father hunted for lost change. He swore violently at the empty drawers, ignoring your outstretched hands."
      ],
      father_soft: [
        "You babbled {word} at your father. His bleary, bloodshot eyes softened with sudden, mournful wonder. He let out a ragged breath and patted your hair: \"Look at you... you're smarter than your old man already.\"",
        "You crawled over and touched your father's knee, cooing {word}. He wiped a sudden tear with a shaking hand: \"Daddy's sorry, baby... daddy's gonna make things right, I swear.\"",
        "You squeaked {word} and smiled. Your father gave a quiet, trembling laugh: \"God, look at those bright eyes. Don't grow up like me, kid. Promise me.\"",
        "You offered your wooden block to your father with a soft {word}. He held it like gold in his trembling fingers, kissing your forehead with alcohol-sweet breath.",
        "You babbled {word} while your father sat slumped on the sofa. He scooped you up in a clumsy, desperate hug: \"You're the only good thing I ever made.\"",
        "You chirped {word} from your blanket. Your father smiled with heartbreaking gentleness, humming a broken tavern ballad until his eyes closed."
      ],
      mother: [
        "Your mother managed a faint, tired smile, wiping a stray tear as she whispered: \"You're my only sunshine in this dark house, little one.\"",
        "You babbled {word} from your crib. Your mother held you close, smelling of lavender water trying to mask stale smoke: \"Hush now, mommy's got you. Everything will be okay tomorrow.\"",
        "You cooed {word} while your mother cleared broken amber glass from the hallway. She kissed your temple with exhausted tenderness: \"Keep babbling, sweet angel. Drown out the shouting.\"",
        "You squeaked {word} in your mother's arms. She rocked you by the drafty window, gazing out at the rain with hollow, resigned eyes: \"We'll survive this. You and me.\"",
        "You clapped your hands saying {word}. Your mother gave a soft, bittersweet laugh: \"Such a brave little voice in such a cold apartment.\"",
        "You babbled {word} while your mother counted pennies on the table. She smiled tiredly: \"We'll buy you sweet milk tomorrow, I promise you, darling.\""
      ],
      sibling: [
        "Your {role} {name} rushed over and popped a pacifier into your mouth, whispering: \"Quiet, quiet! They're still passed out on the rug!\"",
        "You babbled {word} at {name}. They quickly picked you up and carried you into the bedroom closet, sharing a blanket fort where it's safe and quiet.",
        "You cooed {word} loudly. {name} hugged you tight with nervous eyes on the corridor: \"Shh, little brother/sister... don't wake them up yet.\"",
        "You squeaked {word} while {name} checked the cupboards for food. They smiled through tired eyes, handing you a dry cracker: \"Eat this and stay quiet, okay?\"",
        "You chirped {word} at {name}. They made silly funny faces to keep you laughing silently: \"We gotta be sneaky ninjas today!\"",
        "You babbled {word} from your blanket. {name} tucked you under their arm: \"I'll protect you, little one. No matter how loud it gets downstairs.\""
      ],
      grand: [
        "{name} sighed with ancient sorrow, cradling you away from the doorway: \"Don't you fret, angel. Babble all you like with grandfolk.\"",
        "{name} slipped a sweet peppermint into your mouth with a trembling smile: \"Poor sweet babe... you don't deserve this misery at home.\"",
        "You babbled {word} into {name}'s cardigan. They rocked you by the warm stove, tears rolling down their wrinkled cheeks: \"I'll watch over you as long as I draw breath.\"",
        "{name} covered your ears gently while distant shouting echoed from the street: \"Listen only to grandma/grandpa's voice, darling. Pay them no mind.\"",
        "You cooed {word} at {name}. They patted your back with boundless, sorrowful love: \"You are the innocent blossom in a garden of thistles.\"",
        "{name} held your tiny fingers: \"Keep that pure heart safe, little one. The world is cruel, but love will hold you.\""
      ],
      fallback: [
        "You babbled at {name}, who gave a quick, anxious shush toward the living room.",
        "You cooed {word} while {name} cast an uneasy glance down the creaking hallway.",
        "You squeaked {word} at {name}, who held you close with quiet, weary affection."
      ]
    },
    eccentric_occult: {
      father: [
        "You pointed your tiny finger at your father and let out rhythmic clicks and vowels. His eyes flared with fascination: \"Fascinating... the cadence matches the third cipher in the Book of Eibon. Say it once more.\"",
        "You babbled {word} while your father examined star charts. He dipped his crow quill in black ink and noted your exact syllables: \"The celestial houses are in alignment with the infant's tongue.\"",
        "You cooed {word} and reached for an obsidian skull on his desk. He chuckled with dark pride: \"Intuitive affinity! You know the ancestral relics already.\"",
        "You chirped {word} in the candlelit parlor. Your father lit a sprig of dried wormwood, watching the smoke coil toward your crib: \"The spirits approve of your voice, child.\"",
        "You babbled {word} while thunder rattled the leaded glass. Your father grinned in the lightning flash: \"Listen! The storm answers your call!\"",
        "You squeaked {word} at your father's robes. He touched an etched amber talisman to your lips: \"May the old gods grant you sight beyond the veil, little harbinger.\""
      ],
      mother: [
        "Your mother leaned over your cradle, eyes wide with esoteric delight: \"The child remembers the pre-human tongue of the well! Listen how it hums!\"",
        "You cooed {word} while your mother ground belladonna in an iron mortar. She smiled cryptically: \"Such potent vibrations from such small lungs!\"",
        "You babbled {word} at the scrying mirror. Your mother stroked your forehead with lavender oil: \"The shadows in the glass dance whenever you speak, sweet creature.\"",
        "You reached for your mother's raven feather pendant squeaking {word}. She kissed your palm: \"A natural augur. You will read the omens before you read books.\"",
        "You chirped {word} in the dimly lit hallway. Your mother nodded approvingly at the empty doorway: \"Our ancestors gather to hear the new blood speak.\"",
        "You babbled {word} beneath hung bundles of mugwort. Your mother hummed a strange, minor-key nursery rhyme that made candle flames tilt without a draft."
      ],
      sibling: [
        "Your {role} {name} shook a rattle of dried snake vertebrae, chanting weird syllables in harmony with your babble.",
        "You babbled {word} at {name}. They pulled a carved bone rune from their pocket: \"Look! It drew the symbol of the inverted star when you made that sound!\"",
        "You cooed {word} under the black velvet canopy with {name}. They whispered: \"The closet monster says hello back to you, little brother/sister.\"",
        "You chirped {word} and waved your arms. {name} giggled eerily, tracing glowing chalk sigils on the nursery floor around your crib.",
        "You squeaked {word} at {name}'s collection of dead beetles. They shared an obsidian pebble with you: \"Keep this in your sock, it keeps bad dreams away.\"",
        "You babbled {word} into {name}'s ear. They grinned mysteriously: \"You hear the house whispering beneath the floorboards too, don't you?\""
      ],
      grand: [
        "{name} closed their eyes, divining portents from the pitch of your baby squeals.",
        "{name} held an ancient pendulum of lead above your head, nodding as it swung in erratic circles to your babbles: \"The bloodline carries the gift unbroken.\"",
        "You babbled {word} at {name}'s rocking chair. They smiled with toothless mystery: \"I knew a warlock in 1888 who chanted with that exact same cadence.\"",
        "{name} placed a dried black poppy under your mattress: \"Dream of the deep waters, infant. That is where all true knowledge rests.\"",
        "You cooed {word} while {name} read tarot cards by tallow light: \"The Fool, the Moon, and the Tower. What a magnificent destiny awaits you.\"",
        "{name} touched your throat with cold fingers: \"Speak to the silence, child. The silence always answers those who know how to listen.\""
      ],
      fallback: [
        "You babbled strange syllables at {name}, who listened with occult reverence.",
        "You cooed {word} while {name} smiled at shadows that bent toward your crib.",
        "You made eerie baby sounds while {name} traced protective signs in the air."
      ]
    },
    working_class: {
      father: [
        "You reached up from your crib toward your father, shouting {word}. He let out a booming belly laugh, wiping grease from his nose: \"That's my tough little scrapper! Tell the whole street about it!\"",
        "You babbled {word} while your father untied his heavy steel-toed work boots. He grinned through exhaust-stained cheeks and hoisted you up: \"Lungs like a foundry bellows!\"",
        "You squeaked {word} and chewed on his soot-covered thumb. Your father chuckled warmly: \"Tougher than iron, this one! Don't let anyone push you around in this city.\"",
        "You chirped {word} while your father was fixing the leaky radiator. He clinked his wrench against the pipe in rhythm: \"We got ourselves a foreman in the making!\"",
        "You shouted {word} from your highchair. Your father grinned over his boiled cabbage: \"Sing it loud, kid! The landlord can hear we got fight in us!\"",
        "You cooed {word} into your father's flannel collar. He rested his weary head against yours: \"Everything I sweat for at the docks, it's all for you, little scrapper.\""
      ],
      mother: [
        "Your mother laughed warmly over her sewing machine, kissing your forehead: \"Such a loud, strong voice! You'll never be pushed around.\"",
        "You babbled {word} while your mother scrubbed washboards in a tin tub. She hummed a lively dockside labor tune, splashing soapy suds to make you giggle.",
        "You cooed {word} from your blanket by the warm oven. Your mother wiped flour on her apron and kissed your nose: \"A hearty voice for a hearty soul!\"",
        "You squeaked {word} and waved a wooden spoon. Your mother cheered: \"Look at my little helper! We'll make soup together soon enough!\"",
        "You shouted {word} proudly. Your mother laughed and held you up to the window to watch the evening factory whistles blow steam into the smog.",
        "You babbled {word} into your mother's neck while she mended worn wool socks. She smiled: \"As long as we have your sweet laughter, this tenement is a palace.\""
      ],
      sibling: [
        "Your {role} {name} cheered and made funny faces, coaching you to say silly slang.",
        "You babbled {word} at {name}. They laughed and bounced you on the creaking mattress until both of you were in roaring giggles.",
        "You cooed {word} and grabbed {name}'s patched toy truck. They grinned generously: \"You can have it, baby. I'll make you a wooden train tomorrow!\"",
        "You squeaked {word} while {name} shared a crust of bread dipped in sweet tea with you, giggling behind mother's back.",
        "You chirped {word} excitedly. {name} wrapped an oversized coat around both of you: \"We're the tough neighborhood gang now!\"",
        "You babbled {word} into {name}'s ear. They laughed and gave you a big sloppy raspberry on your cheek: \"You're my best little buddy!\""
      ],
      grand: [
        "{name} clapped their weathered hands, humming along to your babbling by the warm stove.",
        "{name} fed you a spoonful of warm oatmeal while chuckling at your baby chatter: \"Eat up, grow strong. Life takes muscle and grit.\"",
        "You cooed {word} at {name}'s rocking chair. They smiled through deep wrinkles: \"That voice sounds just like your grandfather did back in '32.\"",
        "{name} tapped your little nose with a calloused finger: \"Never let the rich folks make you feel small. Speak your mind loud and proud.\"",
        "You babbled {word} while {name} darned stockings by the kerosene lamp. They smiled warmly: \"A sweet song to end a hard day's labor.\"",
        "{name} wrapped you in a worn wool blanket: \"God gave you strong lungs, little one. Use them to stand up for your people.\""
      ],
      fallback: [
        "You babbled loudly with {name}, who cheered your strong lungs.",
        "You cooed {word} while {name} laughed and shared a warm potato crust with you.",
        "You made cheerful baby sounds while {name} smiled through tired, loving eyes."
      ]
    },
    loving: {
      father: [
        "You pointed at your father and tried to say {word}. His eyes lit up with pride as he gently coached your syllables, scooping you up like a soaring airplane.",
        "You babbled {word} while tugging your father's sweater. He laughed aloud, caught you in his arms, and spun you around until you both were giggling.",
        "You reached for your father's nose cooing {word}. He honked playfully, making funny faces that sent you into fits of breathless baby laughter.",
        "You chirped {word} from your crib. Your father called proudly into the kitchen: \"Honey, come quick! Listen to what our baby is saying!\"",
        "You clapped your hands saying {word}. Your father beamed, knelt down, and patted your tummy: \"A brilliant speech from my favorite little person!\"",
        "You babbled {word} into your father's chest. He wrapped his warm arms around you, humming a soothing lullaby until your eyes fluttered closed."
      ],
      mother: [
        "Your mother beamed with joy, holding your hands as you stammered {word}: \"Listen to my sweet angel! You're learning so fast!\"",
        "You cooed {word} into your mother's neck. She kissed your cheeks repeatedly, showering you with giggles and warm forehead snuggles.",
        "You babbled {word} while your mother baked fresh bread. She dipped her finger in sweet warm honey and let you taste it with a loving wink.",
        "You reached up toward your mother squeaking {word}. She gathered you into her lap by the sunny window, rocking you with endless warmth.",
        "You chirped {word} and waved your arms. Your mother laughed joyfully: \"Tell mommy everything! What a clever, beautiful little voice!\"",
        "You babbled {word} softly as evening fell. Your mother tucked you under a fluffy quilt, stroking your hair until you drifted into sweet dreams."
      ],
      sibling: [
        "Your {role} {name} clapped and made funny animal noises, cheering every time you repeated {word}.",
        "You babbled {word} at {name}. They beamed, offered their favorite teddy bear, and sat on the rug building colorful block castles with you.",
        "You cooed {word} and crawled onto {name}'s lap. They hugged you gently, reading colorful picture books with silly voices.",
        "You chirped {word} excitedly. {name} laughed and blew bubbles for you to pop with your tiny fingers.",
        "You squeaked {word} in {name}'s ear. They giggled and gave you a gentle forehead boop: \"You're the best baby brother/sister in the whole world!\"",
        "You babbled {word} while {name} tucked your blanket: \"Night night, little one. I'll play blocks with you again tomorrow!\""
      ],
      grand: [
        "{name} chuckled with overflowing warmth, pulling a wooden music box from their pocket as you babbled {word}.",
        "{name} cuddled you in their lap, kissing your soft curls: \"Every sweet word is a treasure to these old ears, darling.\"",
        "You cooed {word} at {name}. They beamed with gentle pride, feeding you sweet banana purée with a silver baby spoon.",
        "{name} rocked your cradle by the fireplace, singing antique nursery rhymes that smelled of cinnamon and vanilla.",
        "You reached for {name}'s spectacles babbling {word}. They laughed softly, letting you play with their watch fob safely.",
        "{name} held your tiny hand against their wrinkled cheek: \"Such pure joy you bring into our lives, precious little one.\""
      ],
      fallback: [
        "You babbled animatedly at {name}, waving your arms. They smiled and repeated silly words back to you.",
        "You cooed {word} at {name}, who hugged you close and cheered your bright first words.",
        "You made happy baby sounds while {name} stroked your hair with boundless warmth."
      ]
    }
  };

  function getBabbleLine(person, character, chosenWord) {
    const atmo = (character.kin && character.kin.atmosphere) ? character.kin.atmosphere.id : 'loving';
    const isFamily = person.category === 'family';
    const isMother = person.role.includes('Mother');
    const isFather = person.role.includes('Father');
    const isGrand = person.role.includes('Grand');
    const isSibling = person.role.includes('Brother') || person.role.includes('Sister') || person.role.includes('Sibling');

    const vars = {
      name: person.name,
      role: person.role.toLowerCase(),
      word: chosenWord || "'Ma-ma'",
      city: character.city || 'the city'
    };

    if (person.entityType && person.entityType !== 'human' && person.isRevealed) {
      return formatLine(pickRandom(BABBLE_POOLS.revealed), vars);
    }
    if (!isFamily) {
      return formatLine(pickRandom(BABBLE_POOLS.nonFamily), vars);
    }

    const atmoPool = BABBLE_POOLS[atmo] || BABBLE_POOLS.loving;

    if (atmo === 'alcoholic' && isFather) {
      const isIrritable = Math.random() < 0.45;
      const sub = isIrritable ? atmoPool.father_irritable : atmoPool.father_soft;
      return formatLine(pickRandom(sub), vars);
    }

    let branch = atmoPool.fallback;
    if (isFather && atmoPool.father) branch = atmoPool.father;
    else if (isMother && atmoPool.mother) branch = atmoPool.mother;
    else if (isSibling && atmoPool.sibling) branch = atmoPool.sibling;
    else if (isGrand && atmoPool.grand) branch = atmoPool.grand;

    return formatLine(pickRandom(branch), vars);
  }

  window.getBabbleLine = getBabbleLine;
  window.BABBLE_POOLS = BABBLE_POOLS;
})();

// ==========================================================================
// 2. INFANT ACTIONS: CUDDLE, PEEKABOO, FEED MILK (Age 0-5)
// ==========================================================================
(function() {
  function formatLine(template, vars) {
    if (!template) return '';
    let str = template;
    for (const [key, val] of Object.entries(vars)) {
      const regex = new RegExp(`\\{${key}\\}`, 'g');
      str = str.replace(regex, val !== undefined ? val : '');
    }
    return str;
  }

  function pickRandom(arr) {
    if (!arr || arr.length === 0) return '';
    return arr[Math.floor(Math.random() * arr.length)];
  }

  const CUDDLE_POOLS = {
    revealed: [
      "You curled near {name}'s side. A strange, glacial chill radiated through their garments, but their disguised arm curled gently around you.",
      "Resting against {name}'s chest, you heard no heartbeat—only the faint, rhythmic ticking of a clockwork mechanism or trapped cicada.",
      "You buried your face into {name}'s shoulder. Its skin was waxy and unyielding as cold marble, yet it stroked your back with uncanny care.",
      "As you nestled against {name}, the room's shadows bent toward you both like reaching fingers, wrapping you in cold, velvet darkness.",
      "{name} held you close, humming a lullaby in a minor key that made your tiny skull resonate with sweet, dreamless numbness.",
      "You fell asleep against {name}'s side. In the mirror across the room, its reflection showed an empty chair cradling a sleeping infant."
    ],
    nonFamily: [
      "You leaned into {name}'s side. They held your hand gently and let you rest against their arm with genuine fondness.",
      "{name} scooped you up in a warm, gentle hug, rocking you softly until your tiny eyelids grew heavy with comfort.",
      "You nestled against {name}'s wool coat, listening to their calm, steady breathing while city rain drummed on the window.",
      "{name} sat on the sofa beside you, wrapping a soft knitted blanket around your shoulders with a cheerful, affectionate smile.",
      "You reached up with both tiny arms. {name} laughed happily, pulling you into a warm, reassuring hug that chased away the cold.",
      "{name} gently stroked your back, singing a pleasant nursery tune while you rested your head comfortably on their shoulder."
    ],
    cold_detached: {
      father: [
        "You crawled close and leaned against your father's trouser leg. He sat motionless as an icy granite statue, glancing down with mild, formal detachment before tapping your forehead with his fountain pen: \"Composure, child. Even in infancy, self-command is necessary.\"",
        "You reached up for a hug. Your father placed a rigid hand upon your shoulder for exactly five measured seconds: \"Affection must not degenerate into clinginess. Stand upon your own feet.\"",
        "You leaned your head against your father's knee. He paused his ledger calculation, gently removed your fingers from his pressed wool, and pointed you toward the playroom rug: \"Occupational focus, infant.\"",
        "You crawled into his study seeking warmth. Your father gave a single, measured pat to your back: \"The world rewards competence, not sentiment. Remember that.\"",
        "You snuggled against his polished shoes. Your father adjusted his silver cufflink and observed you like an exotic specimen before returning to his bond reports.",
        "Your father permitted you to lean against his armchair, remaining completely motionless until the nursery nurse arrived to collect you."
      ],
      mother: [
        "You reached up toward your mother's silk gown. She paused, stiff and unyielding, offering only two delicate fingers for you to hold so her pressed cuffs wouldn't wrinkle.",
        "You tried curling into your mother's lap. She held you at arm's length with pristine gloved hands, murmuring: \"A lady/gentleman of our standing does not wilt into hysterics. Sit erect.\"",
        "You leaned against her velvet skirt. Your mother offered a cool cheek kiss that barely brushed your brow: \"That will suffice for the morning greeting. Go to your governess.\"",
        "You sought your mother's embrace in the cold drawing room. She smoothed your collar with sterile precision: \"Appearance reflects character. Keep your posture rigid.\"",
        "You nestled your cheek on her sleeve. She produced a linen handkerchief to ensure no drool soiled her lace cuffs, offering a distant, aristocratic pat.",
        "Your mother allowed a brief three-second embrace before checking her pocket watch: \"The carriage arrives shortly. Composure is paramount.\""
      ],
      sibling: [
        "You tried leaning against {name}'s shoulder. They carefully adjusted their immaculate collar and edged away on the sofa, offering only a brief, chilly nod.",
        "You reached for {name}'s hand. They gave a stiff, formal headshake: \"Father expects straight marks from both of us. Do not become a sentimental distraction.\"",
        "You curled up beside {name}'s chair while they practiced violin. They didn't pause their scales, offering only an impassive sidelong glance.",
        "You sat on {name}'s foot. They gently shifted their shoe aside without looking down, continuing their Latin homework in icy silence.",
        "You sought comfort near {name}. They offered a polite, emotionless pat on your head: \"Go play with the nursery toys. I have dynastic duties.\"",
        "You leaned against {name} in the drafty corridor. They stood up and smoothed their pressed flannel, walking away with calculated aristocratic grace."
      ],
      grand: [
        "{name} allowed you to sit beside their velvet armchair, resting a dry, liver-spotted hand atop your head for exactly ten measured seconds before returning to their genealogy ledger.",
        "{name} permitted you to rest your head on their cane: \"The family jawline is unyielding. Do not soften it with childish tears.\"",
        "You leaned into {name}'s silk shawl. They stared into the dying hearth embers: \"Generations have walked these cold halls. Weakness has no inheritance here.\"",
        "{name} gave your small shoulder a single, dry pat: \"Stand tall. The city respects only iron constitutions and heavy ledgers.\"",
        "You curled by {name}'s slippers. They looked down through gold-rimmed spectacles without emotion: \"An adequate child. See that you remain disciplined.\"",
        "{name} allowed a brief, formal embrace before ringing the brass service bell: \"Nursery staff, remove the infant to the designated study.\""
      ],
      fallback: [
        "{name} offered a polite, distant pat on your shoulder with immaculate posture.",
        "{name} allowed you to lean near them for a brief, formal moment before stepping back.",
        "You cuddled near {name}, who maintained strict aristocratic reserve and polite physical distance."
      ]
    },
    deeply_religious: {
      father: [
        "Your father held you tightly against his coarse black wool jacket, but his brow was furrowed with solemn anxiety. He murmured urgent prayers against demonic contagion into your hair, clutching an iron cross against your ribs.",
        "You curled into your father's lap. He pressed an open scripture against your back, chanting Latin verses of deliverance while trembling with holy terror.",
        "Your father embraced you with crushing intensity, whispering into your ear: \"Pray without ceasing, child! The adversary walks the streets outside, seeking whom he may devour!\"",
        "You rested on his chest while he knelt on the bare floorboards. Every breath he took was an agonizing plea for your soul's salvation from eternal hellfire.",
        "Your father held your tiny frame before the hearth crucifix, weeping silent tears: \"Lord, spare this innocent branch from the axe of judgment.\"",
        "He cradled you tightly against his worn catechism, warning you in a hushed whisper that even cradle laughter can hide the whisper of the tempter."
      ],
      mother: [
        "Your mother held you to her chest, rocking in the flickering candlelight. Tears dripped onto your cheeks as she wept, whispering: \"Lord, wash the stain of original sin from this frail vessel.\"",
        "She buried her face in your swaddling, murmuring frantic rosary decades: \"Keep this child pure, Holy Mother... let not the corruptions of the flesh claim them.\"",
        "Your mother hugged you with frantic, protective desperation, pressing cold holy water against your forehead with trembling fingers.",
        "She rocked you before the framed icon of the weeping martyr, whispering: \"Life is suffering and repentance, my sweet lamb. Seek heaven early.\"",
        "Holding you tight against her plain black cotton dress, your mother hummed a mournful funeral hymn to chase away prowling night demons.",
        "Your mother pressed you to her bosom while rain lashed the steeple outside: \"If you die before you wake, I pray the Lord your soul to take.\""
      ],
      sibling: [
        "Your {role} {name} pulled you into a tight, trembling embrace under the heavy wool blanket, both of you listening fearfully to the chapel bell tolling through the dark.",
        "{name} huddled beside your crib, holding your tiny hand in the shadows: \"If we stay close and whisper our prayers, the judgment won't find us.\"",
        "You curled against {name}'s side. They wrapped their threadbare shawl around you, shivering as distant thunder rattled the parish glass.",
        "{name} hugged you tight in the dark closet: \"Don't cry, little one... father is in the chapel doing penitence. We have to be invisible.\"",
        "You shared a tearful, frightened cuddle with {name} while the elders chanted apocalyptic warnings in the adjoining parlor.",
        "{name} pressed a small carved wooden angel into your fingers, holding you close: \"I asked St. Michael to watch over your cradle tonight.\""
      ],
      grand: [
        "{name} wrapped you in a coarse ceremonial shawl smelling of frankincense and beeswax, chanting solemn benedictions to keep night-fiends away.",
        "{name} held you against their frail, trembling chest, whispering: \"The world is a valley of tears, child. Cling to the cross and never look back.\"",
        "You cuddled into {name}'s heavy black skirts while they stroked your brow with holy oil, murmuring old prayers of protection.",
        "{name} cradled your tiny head in their gnarled, rosary-wrapped hands: \"May your infant slumber be shielded from the terrors of the pit.\"",
        "Sitting by the cast-iron stove, {name} pulled you into a somber hug: \"Generations of sinners, but you... perhaps grace will find you.\"",
        "{name} held you while reciting Psalm 91 over your sleeping frame: \"He shall cover thee with his feathers, and under his wings shalt thou trust.\""
      ],
      fallback: [
        "{name} held you while reciting a verse of divine judgment and mercy over your brow.",
        "{name} pulled you into a somber, protective embrace smelling of candlewax and frankincense.",
        "You cuddled close while {name} whispered urgent prayers to seal your soul against worldly corruption."
      ]
    },
    religious: {
      father: [
        "Your father hoisted you onto his shoulder, humming a quiet church hymn as rain drummed against the stained glass.",
        "Your father scooped you into his warm arms, resting his chin on your head with gentle contentment: \"A precious blessing in our home.\"",
        "You curled into your father's lap while he read the evening devotional. He smiled and wrapped his warm wool cardigan around you.",
        "Your father cuddled you by the fireplace, rocking you with rhythmic tranquility: \"May peace dwell in your heart all your days.\"",
        "He lifted you into a big bear hug, laughing softly: \"Growing bigger every Sabbath, little one! God is good.\"",
        "Your father held you close while evening bells tolled across {city}, speaking quiet words of gratitude for your life."
      ],
      mother: [
        "Your mother embraced you warmly, stroking your forehead while reciting a peaceful psalm until your breathing slowed.",
        "She gathered you into her lap by the sunlit window, humming sweet melodies while you rested contentedly against her chest.",
        "Your mother tucked you under her knitted wool blanket, kissing your temple: \"Sleep in heavenly peace, my darling child.\"",
        "She cuddled you gently while dinner bread baked in the oven, filling your senses with warmth, cinnamon, and comfort.",
        "Your mother rocked you in the cedar chair, smiling tenderly: \"Every prayer I ever made was answered when you were born.\"",
        "She held your tiny hands against her heart, whispering gentle blessings of health, wisdom, and joy over your brow."
      ],
      sibling: [
        "Your {role} {name} cuddled beside you on the pew bench, sharing body heat in the drafty hall.",
        "{name} curled up on the rug with you, sharing their soft stuffed lamb and giggling softly under the afternoon sun.",
        "You snuggled under the quilt with {name}, who happily whispered stories about brave shepherd boys and friendly lions.",
        "{name} wrapped both arms around you with joyful affection: \"I'm the luckiest big brother/sister in the whole congregation!\"",
        "You cuddled beside {name} by the hearth, watching glowing embers while they gently stroked your hair.",
        "{name} pulled you into a playful hug, tumbling onto the pillows together in a heap of cheerful laughter."
      ],
      grand: [
        "{name} wrapped you in a soft knitted shawl that smelled of dried lavender and peppermints, humming old hymns of comfort.",
        "{name} rocked you by the hearth, gently smoothing your hair: \"Generations come and go, but love endures through all seasons, sweet one.\"",
        "You curled into {name}'s cozy lap, resting your head against their soft cardigan while they told stories of peaceful days.",
        "{name} cradled you with weathered, gentle hands: \"May providence walk beside every step you ever take, little lamb.\"",
        "You cuddled into {name}'s embrace, lulled by their calm, grandmotherly/grandfatherly voice recounting tales of old parish festivals.",
        "{name} held you close, kissing both your cheeks: \"A bundle of pure joy to brighten an old soul's twilight years.\""
      ],
      fallback: [
        "{name} embraced you with serene warmth, humming a gentle hymn of peace.",
        "{name} cuddled you close, whispering a tender blessing of protection over your life.",
        "You rested contentedly in {name}'s arms, surrounded by quiet faith and comfort."
      ]
    },
    extremely_strict: {
      father: [
        "Your father permitted a rigid, five-second embrace by the stopwatch before placing you back on the rug: \"Affection has its allotted place. Now sit upright.\"",
        "You leaned against your father's knee. He rested a heavy, disciplined hand on your shoulder: \"Do not lean on others, child. Learn to support your own weight.\"",
        "Your father embraced you with brief, military stiffness: \"Good health is maintained through rigorous habits. No slouching, even in my arms.\"",
        "You reached up for a cuddle. He inspected your collar, straightened your spine with two fingers, and nodded once: \"Orderly presentation is approved.\"",
        "Your father held you for three seconds before pointing at the clock: \"Recreation period concluded. Return to your educational building blocks.\"",
        "He gave a firm, disciplined pat on your back: \"Toughen up. The municipal academy will show no mercy to children who crave coddling.\""
      ],
      mother: [
        "Your mother checked your temperature and straightened your collar before allowing a brief, measured hug: \"Cleanliness and restraint in all things.\"",
        "You cuddled against her linen blouse. She ensured your bib was spotless before offering a firm, maternal embrace: \"Posture straight, shoulders back.\"",
        "Your mother hugged you with disciplined precision: \"I show love by holding you to the highest standard. Never forget that.\"",
        "She allowed a brief cuddle while inspecting your fingernails: \"Spotless. Good. Weakness begins when standards slip.\"",
        "You nestled in her lap. After two minutes, she set you upright on your chair: \"Excessive indulgence breeds complacency. Resume your drills.\"",
        "Your mother smoothed your hair with a firm brush, giving a crisp pat: \"A proper child is distinguished by self-control.\""
      ],
      sibling: [
        "Your {role} {name} shared a quick, tense hug behind the study door: \"Quick, before father walks past! We'll get demerits for idling!\"",
        "{name} hugged you tight in secret: \"I know it's hard with all the rules... I'll help you study so you don't get grounded, okay?\"",
        "You cuddled with {name} under the blankets after lights-out, whispering in hushed terror whenever footsteps paced the hallway.",
        "{name} gave you a brief, disciplined hug: \"Stand tall, little one. If mother sees you crying, she'll add an hour of handwriting.\"",
        "You leaned against {name} during mandatory silent reading hour. They discreetly squeezed your hand under the table.",
        "{name} hugged you with nervous haste: \"Keep your chin up. We'll survive this house together if we follow the schedule.\""
      ],
      grand: [
        "{name} tapped their mahogany cane and allowed a stiff, formal embrace: \"In my day, children stood at attention until spoken to. Be grateful.\"",
        "{name} inspected your posture while you leaned against them: \"Spine of iron, mind of steel. That is how our lineage survives.\"",
        "You cuddled near {name}'s armchair. They gave a measured, dry pat on your shoulder: \"No whimpering, no whining. Excellence is the only path.\"",
        "{name} adjusted your collar firmly: \"Self-pity is a poison. Learn endurance while you are young.\"",
        "You sought comfort from {name}. They looked down sternly: \"I do not indulge soft sentimentalism. Achieve results, then seek praise.\"",
        "{name} allowed you to sit beside their footstool, observing your stillness with cold approval: \"At least you have learned how to sit without squirming.\""
      ],
      fallback: [
        "{name} offered a structured, disciplined embrace with strict reminders of self-control.",
        "{name} gave you a brief, measured hug before checking your posture and manners.",
        "You cuddled near {name}, who maintained unbending standards of conduct even in affection."
      ]
    },
    alcoholic: {
      father: [
        "Your father pulled you into a heavy, clumsy hug smelling of stale bourbon, weeping sudden tears into your hair: \"Daddy loves you, baby... don't listen to what they say about me.\"",
        "You crawled into his lap while he sat slumped on the couch. He held you with desperate, trembling tightness: \"You're my little angel... please don't ever hate me.\"",
        "Your father hugged you with slurred tenderness, his bloodshot eyes wet with grief: \"I'm gonna quit tomorrow, I swear it... I'm gonna be the father you deserve.\"",
        "He cradled your tiny head against his chest, smelling of sour beer and cigarettes, patting your back with heartbreaking, clumsy gentleness.",
        "Your father held you tight while shouting echoed in the street below, whispering: \"Stay with me, kiddo... daddy's right here...\"",
        "He scooped you into an unsteady hug, kissing your forehead repeatedly with alcohol-scented breath until he drifted asleep on the sofa."
      ],
      mother: [
        "Your mother held you to her chest with trembling desperation, tears soaking into your blanket: \"You're the only reason I keep going in this dark place, sweet child.\"",
        "She cuddled you tightly in the bedroom closet, rocking you back and forth while doors slammed violently in the hallway downstairs.",
        "Your mother hugged you with exhausted tenderness, smelling faintly of lavender water over stale smoke: \"My brave little baby... we'll get through this.\"",
        "She pressed you to her heart by the rainy window, whispering broken lullabies with a voice worn hoarse from late-night arguments.",
        "Your mother curled around you in the narrow bed, holding your tiny hand against her cheek as she wept silent, exhausted tears.",
        "She embraced you with fierce, protective sorrow: \"No matter what happens in this house, remember your mother loves you more than life itself.\""
      ],
      sibling: [
        "Your {role} {name} pulled you into a tight, trembling embrace in the dark closet, whispering: \"Shh... keep your head down, I've got you safe.\"",
        "{name} wrapped both arms around you under the bed, sharing a torn blanket while violent shouting rattled the apartment walls.",
        "You cuddled together in the hallway corner, {name} covering your ears so you wouldn't hear the shattering glass downstairs.",
        "{name} held you close and whispered funny stories into your ear, fighting through tears to make you smile through the darkness.",
        "You huddled shoulder-to-shoulder with {name} on the fire escape in the rain, sharing body heat until the house went quiet.",
        "{name} hugged you tight with fierce sibling solidarity: \"Don't be scared, little brother/sister... we'll protect each other forever.\""
      ],
      grand: [
        "{name} gathered you into their frail, comforting arms, tears streaming down their wrinkles: \"Come to grandma/grandpa, precious lamb. You're safe here.\"",
        "{name} rocked you by the warm stove, humming an old melody to drown out the memory of shouting: \"I won't let them hurt you, darling.\"",
        "You snuggled into {name}'s cardigan, tasting sweet peppermint as they stroked your hair with boundless, aching sorrow.",
        "{name} held you close against their chest: \"A child shouldn't have to live in such storm and terror. Rest with me now, little angel.\"",
        "You curled in {name}'s lap, feeling their gentle, trembling fingers patting your back until the nightmares faded away.",
        "{name} kissed both your eyelids: \"Sleep peacefully, my darling. Grandfolk's hearth is your true sanctuary.\""
      ],
      fallback: [
        "{name} hugged you quickly with an anxious, protective glance down the hallway.",
        "{name} held you close, offering a quiet haven from the unpredictable domestic tension.",
        "You cuddled near {name}, sharing a moment of tender comfort amidst the household storm."
      ]
    },
    eccentric_occult: {
      father: [
        "Your father gathered you into his heavy velvet robes, smelling of sage and dried nightshade. He gently pressed an obsidian amulet to your forehead, humming in strange harmonic intervals.",
        "He cradled you before the altar of blackened silver, tracing protective geometric sigils across your brow with cold scented oils.",
        "Your father held you close while chanting ancient Sumerian lullabies, smiling as the hearth flames flickered in sync with your breathing.",
        "He wrapped his embroidered astrological cloak around you, pointing out the dark constellations through the skylight: \"The stars welcome you, little initiate.\"",
        "Your father cuddled you against his chest while an antique pendulum of lead swung between you, attuning your infant aura to the house's spirits.",
        "He held you tenderly while burning myrrh and frankincense, whispering esoteric blessings of sight and power into your tiny ear."
      ],
      mother: [
        "Your mother rocked you by the black scrying basin, tracing protective sigils across your spine with cold, scented oils.",
        "She cuddled you under a canopy of dried mugwort and black feathers, humming nursery runes that made the shadows in the room sway peacefully.",
        "Your mother held you to her bosom while looking into the bronze mirror, whispering: \"Two souls, two mirrors, bound across the veil of dreams.\"",
        "She bundled you in velvet woven with silver thread, kissing your temple: \"Sleep deeply, my little augur. The ancestral spirits sing for you tonight.\"",
        "Your mother cradled you by the glow of tallow candles, murmuring secrets of herbs and roots that keep wicked specters from your crib.",
        "She held you against her chest, where an amber locket holding hair from seven generations clicked softly with every breath."
      ],
      sibling: [
        "Your {role} {name} curled under the heavy black velvet tapestry with you, whispering secrets about the friendly spirits nesting in the baseboards.",
        "{name} snuggled beside you in the candlelit corner, showing you how to read omens in melted wax drops while holding you warm.",
        "You cuddled with {name} under a mound of dark woolen cloaks, both of you listening happily to the floorboards creaking their midnight songs.",
        "{name} wrapped an arm around you, sharing a carved bone talisman: \"Hold this against your tummy, baby. It makes sweet ghost dreams come.\"",
        "You curled together by the iron fireplace, {name} humming weird minor-key lullabies that made the house cats purr in unison.",
        "{name} hugged you tight in the attic tower, pointing out distant violet lights flickering above the cemetery ridge."
      ],
      grand: [
        "{name} held you against their frail chest, where an antique bone talisman clicked softly with every slow, deliberate heartbeat.",
        "{name} rocked your cradle with a bony, ringed hand, chanting protective incantations passed down since the 17th century.",
        "You cuddled into {name}'s heavy fur-lined mantle, smelling dried wormwood and sweet pipe tobacco as they smiled with ancient affection.",
        "{name} kissed your forehead with dry, papery lips: \"The veil is thin, but love is thick. No wandering shadow shall harm our newborn blood.\"",
        "You nestled in {name}'s lap while they turned the yellowed pages of an illustrated grimoire, showing you drawings of friendly gargoyles.",
        "{name} held your small hand against an antique scrying stone, murmuring: \"Warm blood, clear sight. Sleep well in the embrace of the old ways.\""
      ],
      fallback: [
        "{name} held you close while burning fragrant lavender incense and chanting quiet protective runes.",
        "{name} embraced you with mystical tenderness, shielding your cradle with ancient family blessings.",
        "You rested contentedly in {name}'s velvet robes, lulled by strange and soothing esoteric harmonies."
      ]
    },
    working_class: {
      father: [
        "Your father scooped you into his muscular, soot-stained arms. Despite aching muscles from a twelve-hour blast furnace shift, he grinned and let you rest your head on his broad shoulder.",
        "He pulled you onto his lap by the hissing radiator, smelling of machine grease and cold drizzle, wrapping his heavy work coat around you with tired joy.",
        "Your father cuddled you against his rough flannel shirt, his deep, rumbling voice humming factory tunes that vibrated through your tiny chest.",
        "He cradled your small head in his calloused, scraped hands with infinite gentleness: \"Everything I break my back for, it's so you never have to work the pits.\"",
        "Your father hoisted you into a warm, joyful bear hug, kissing your cheeks with stubble that made you burst into happy giggles.",
        "He fell asleep sitting in the kitchen chair with you tucked safely against his chest, both of you warmed by the humming copper radiator."
      ],
      mother: [
        "Your mother bundled you into her faded flannel apron, kissing your temple while humming a lively dockside labor tune.",
        "She gathered you into her lap by the open oven door to stay warm, rubbing your small back with loving, soapy hands.",
        "Your mother cuddled you under a heavy patchwork quilt stitched from old overcoats, singing cheerful songs to drown out the howling winter wind.",
        "She held you close after scrubbing clothes all day, her tired smile radiating pure, unshakeable warmth: \"My precious little treasure.\"",
        "Your mother rocked you by the table while dough rose under a damp towel, holding you so tight and safe that no draft could touch you.",
        "She bundled you against her wool sweater, whispering: \"Times are hard in {city}, my sweet lamb, but we've got food, fire, and each other.\""
      ],
      sibling: [
        "Your {role} {name} wrapped an oversized hand-me-down coat around both of you, sharing warmth by the whistling radiator.",
        "{name} snuggled close under the narrow bed's patchy blanket, hugging you tight so your toes wouldn't freeze during the winter freeze.",
        "You cuddled together on the living room rug, {name} whispering funny jokes about the grumpy landlord until you both were giggling.",
        "{name} wrapped both arms around you with fierce older-sibling pride: \"Nobody in this neighborhood messes with my little brother/sister, ever.\"",
        "You curled up on {name}'s lap, chewing on a clean wooden spool while they read battered comic strips to you by candlelight.",
        "{name} tucked your cold feet between their knees to warm them, humming cheerfully until you both drifted to sleep."
      ],
      grand: [
        "{name} tucked you under a thick patchwork quilt, rubbing your cold feet until warmth returned.",
        "{name} rocked you by the kitchen stove, feeding you warm sweet milk from a spoon with weathered, patient hands.",
        "You curled in {name}'s cozy lap, listening to stories of the old days before the factories came to {city}.",
        "{name} wrapped you in an ancient knitted shawl that smelled of black tea and woodsmoke: \"Hard work builds bone, but love feeds the soul, darling.\"",
        "You snuggled into {name}'s embrace, lulled by their raspy, gentle humming as snow piled against the tenement windowpane.",
        "{name} held you close, kissing your soft forehead: \"Stay strong, sweet scrapper. Our blood has weathered worse winters than this.\""
      ],
      fallback: [
        "{name} gave you a big, hearty squeeze and shared their warm woolen scarf with you.",
        "{name} cuddled you close by the radiator, chasing away the tenement drafts with pure family solidarity.",
        "You nestled happily in {name}'s embrace, surrounded by the honest warmth of hardworking family."
      ]
    },
    loving: {
      father: [
        "Your father hoisted you onto his broad shoulder, patting your back with his large, calloused hand until you relaxed into joyful contentment.",
        "He pulled you into a warm, gentle bear hug, pressing his nose to yours and laughing softly as you grabbed his ears.",
        "Your father rocked you in the comfortable armchair, humming a soothing sea ballad until your head rested peacefully on his chest.",
        "He cuddled you on the living room rug, building a cozy fort of pillows and blankets where you felt completely safe from the world.",
        "Your father held your tiny hand against his cheek, beaming down at you with boundless, unconditional adoration.",
        "He cradled you in his arms by the open window, pointing out the stars and promising you'll always have a safe harbor with him."
      ],
      mother: [
        "You curled into your mother's warm embrace. She stroked your hair and rocked you gently until your breathing steadied.",
        "She pulled you into her lap, burying her face in your soft curls and kissing your forehead with endless tenderness.",
        "Your mother cuddled you under a fluffy quilt, singing sweet bedtime lullabies while you drifted into peaceful, dreamless sleep.",
        "She held you close by the sunlit kitchen window, rocking you to the rhythm of birdsong outside.",
        "Your mother showered your cheeks with playful kisses, laughing joyfully as you squealed with baby delight.",
        "She cradled you against her chest, whispering: \"You are the greatest blessing of my entire life, my sweet precious baby.\""
      ],
      sibling: [
        "Your {role} {name} crawled under the blankets with you, sharing their favorite stuffed bear and giggling happily.",
        "{name} pulled you into a warm, playful hug on the rug, gently tickling your tummy until you were squealing with joy.",
        "You snuggled together on the sofa, {name} turning the pages of a colorful picture book with gentle care.",
        "{name} wrapped their arms around you protectively, smiling: \"I'm gonna teach you how to ride a bike and build treehouses!\"",
        "You curled up together for an afternoon nap, {name} resting their head beside yours in sweet sibling harmony.",
        "{name} gave you a big enthusiastic hug, laughing: \"You're the coolest baby ever! Let's play blocks!\""
      ],
      grand: [
        "{name} held you close in their knitted cardigan, humming a faint antique tune that smelled of lavender and old wool.",
        "{name} cuddled you in the wooden rocking chair, gently swaying by the hearth while telling you sweet stories of your parents' childhood.",
        "You snuggled into {name}'s cozy lap, resting your cheek against their soft wool sweater with complete security.",
        "{name} fed you sweet mashed apples with a silver baby spoon, kissing your nose between every bite.",
        "You curled into {name}'s embrace, feeling their weathered, gentle hands patting your back with decades of loving patience.",
        "{name} held you close, whispering with a tearful smile: \"To hold you in my arms is the greatest gift of my old age, darling.\""
      ],
      fallback: [
        "You leaned into {name}'s side. They held your hand gently and let you rest against their arm with deep affection.",
        "{name} pulled you into a warm, comforting embrace that filled you with peace and happiness.",
        "You snuggled close to {name}, who showered you with gentle hugs and unconditional love."
      ]
    }
  };

  const PEEKABOO_POOLS = {
    nonFamily: [
      "{name} covered their face with both hands, waited two seconds, and shouted 'PEEK-A-BOO!' with a funny grin, sending you into fits of giggles.",
      "{name} ducked behind a colorful book, popped their head out with wide silly eyes, and made you burst into baby laughter.",
      "{name} hid behind their fingers, wiggling them playfully before springing out with a cheerful: 'I see you, little one!'",
      "{name} playfully ducked under the table and reappeared on the other side, making you squeal with delighted surprise.",
      "{name} threw a soft silk scarf over their head, pulled it away with a dramatic flourish, and bowed to your enthusiastic applause.",
      "{name} covered their eyes with a stuffed teddy bear, lowered it with a giant smile, and blew a funny raspberry on your cheek."
    ],
    cold_detached: [
      "{name} raised a crisp linen napkin before their face, lowered it after two seconds with an utterly unblinking, impassive stare, and stated: \"I have returned. Demonstrating object permanence is fundamental.\" You blinked back in quiet bafflement.",
      "{name} held up a leatherbound volume of estate law, lowered it with clinical composure, and noted: \"Visual stimulus test concluded. Composure: satisfactory.\"",
      "{name} covered their face with gloved hands, lowered them with zero smile, and nodded once: \"You perceive my presence. Good. Never lose spatial awareness.\"",
      "{name} held a silver tea tray before their visage, lowered it in ceremonial silence, and observed your reaction with aristocratic detachment.",
      "{name} briefly concealed their face behind the financial gazette, reappearing with an icy, formal gaze: \"Frivolity has limits, infant. Resume orderly conduct.\"",
      "{name} lowered a black silk handkerchief with measured slowness, stating: \"Presence established. Do not squirm or shriek.\""
    ],
    deeply_religious: [
      "{name} held an ornate leather hymnbook before their eyes, lowered it with a solemn, unsmiling gaze, and whispered: \"The eyes of God never hide, child. Even when darkness covers the face, all secrets remain visible.\" A chill ran down your tiny spine.",
      "{name} concealed their face behind a carved wooden crucifix, lowered it with urgent piety, and said: \"Behold! The light shines in darkness, and darkness comprehendeth it not!\"",
      "{name} hid behind a heavy wool altar cloth, popped out with a trembling gasp, and murmured: \"Even in hiding, Providence watches every breath you take, little soul.\"",
      "{name} covered their face while reciting Psalm 139, lowering their hands to stare into your eyes: \"Whither shall I flee from thy presence? Nowhere, child. Nowhere.\"",
      "{name} ducked behind a brass candlestick, reappearing with a pale, prayerful face: \"Fear the hidden snare, babe. Only righteousness endures.\"",
      "{name} held a saint's devotional card before their brow, lowering it with a grave nod: \"We see through a glass, darkly. Learn holy vigilance.\""
    ],
    religious: [
      "{name} hid behind an embroidered linen cloth and popped out with a bright, gentle smile, tickling your tummy and praising heaven for your happy laughter.",
      "{name} covered their face with a Sunday school picture book, lowered it with a cheerful 'Boo!', and clapped happily as you giggled.",
      "{name} ducked behind the armchair, popped out with a joyful grin, and gave your nose a playful boop: \"God gave you the sweetest laugh in the parish!\"",
      "{name} hid behind their hands, peeked through their fingers with smiling eyes, and shouted: \"Found you, my little blessed angel!\"",
      "{name} covered their face with a knitted bonnet, revealing a laughing, radiant smile that set your tiny feet kicking with joy.",
      "{name} played peek-a-boo with a soft sheep toy, making funny bleating sounds that had you in stitches."
    ],
    extremely_strict: [
      "{name} held a stiff cardboard folder before their eyes, lowered it after exactly three seconds by the kitchen clock, and noted: \"Focus test passed. Target tracking: acceptable. No unseemly squirming.\"",
      "{name} concealed their face behind an arithmetic ledger, lowered it with razor-sharp gaze, and stated: \"Observation drill: 100% compliance. Discipline is developing.\"",
      "{name} held a ruler horizontally across their nose, lowered it to table level, and ordered: \"Track the movement with your eyes only. Head remains stationary.\"",
      "{name} covered their face with palms flat, removed them with military precision: \"Visual re-acquisition achieved. Maintain upright posture.\"",
      "{name} popped out from behind a wooden clipboard with zero smile: \"Surprise element introduced. Heart rate: controlled. Very good.\"",
      "{name} tested your reflexes with a stiff card: \"Three repetitions permitted, no more. Productive leisure requires boundaries.\""
    ],
    alcoholic: [
      "{name} slumped forward, burying their face in their hands... and stayed frozen like that for a long, alarming minute, groaning into their palms while you sat waiting in silence.",
      "{name} ducked behind a tattered cardigan and jumped out with an exaggerated, drunken wobble, making you burst into giggles before they stumbled against the radiator.",
      "{name} covered their face with trembling, stained fingers, lowered them with bleary bloodshot eyes, and gave a sad, ragged laugh: \"Still there, kiddo? Daddy/Mommy's still here too.\"",
      "{name} hid behind an empty newspaper, popped out with a lopsided, slurred grin, and playfully ruffled your hair before clutching their aching temples.",
      "{name} covered their eyes and began weeping softly into their hands, forgetting to say 'boo' until you reached out and patted their knee.",
      "{name} jumped out from behind the hallway door with a loud, startled yell, making you jump before they gave a clumsy, affectionate hug."
    ],
    eccentric_occult: [
      "{name} covered their face with pale, slender fingers. When they parted their hands, their eyes reflected an unearthly violet luminescence that wasn't in the room, making you clap your hands in eerie delight.",
      "{name} hid behind a heavy black velvet mask, lowered it to reveal an unsettlingly calm smile, while the shadows behind them seemed to bow in greeting.",
      "{name} held an antique scrying mirror before their visage. In the glass, you saw a different face entirely before they lowered it with a cryptic wink.",
      "{name} ducked behind a cloud of burning sage, stepping out with dilated pupils: \"The veil parts, the veil closes. You see through both, little seer.\"",
      "{name} covered their eyes with carved bone runes, parted them with an ethereal laugh that made the nursery candle flame bend toward you.",
      "{name} hid behind a dark ceremonial hood, reappearing with a pale, smiling stare that seemed to look right through your mortal frame."
    ],
    working_class: [
      "{name} ducked behind the evening newspaper, sprang out with a ridiculous monster face, and blew a loud, ticklish raspberry on your tummy that sent you into roaring giggles.",
      "{name} hid behind their soot-covered cap, popped their grinning face out with a loud \"PEEK-A-BOO!\", and tossed you in the air with strong, loving arms.",
      "{name} ducked behind the laundry basket, jumped up waving a pair of woolen socks like puppet ears, making you laugh until you got the hiccups.",
      "{name} covered their eyes with calloused, grease-stained hands, popping out with a funny pirate squint that had you clapping your hands.",
      "{name} hid behind the pantry curtain, jumped out with a playful roar, and tickled your ribs until you were out of breath.",
      "{name} threw a flannel work shirt over their head, made funny engine noises, and revealed a big toothy grin that warmed the whole room."
    ],
    loving: [
      "{name} covered their face with both hands, waited two suspenseful seconds, and shouted 'PEEK-A-BOO!' with a radiant grin, sending you into fits of breathless baby giggles.",
      "{name} ducked behind the armchair, popped out with giant animated eyes, and booped your nose, showering you with loving kisses.",
      "{name} hid behind a soft fleece blanket, pulled it away with an enormous cheerful smile, and scooped you into a warm, joyful cuddle.",
      "{name} covered their eyes, peeked through funny wiggling fingers, and shouted: \"There's my favorite baby in the whole wide world!\"",
      "{name} hid behind a fluffy teddy bear, made silly squeaky voices, and sprang out to give your tummy a gentle, ticklish raspberry.",
      "{name} playfully hid behind their hands, laughing as your tiny fingers pried them apart to reveal their beaming, adoring face."
    ]
  };

  const FEED_MILK_POOLS = {
    nonFamily: [
      "{name} prepared a warm bottle and gently supported your head while you drank, rocking you until you were full and sleepy.",
      "{name} held the bottle with patient care, testing the milk's temperature on their wrist first and smiling down as you drank hungrily.",
      "Sitting in a comfortable chair, {name} cradled you softly, burping you with gentle back pats after you finished your sweet milk.",
      "{name} hummed a cheerful tune while you drank, wiping your chin with a clean soft towel when you finished with a satisfied sigh.",
      "You drank warm sweet milk eagerly while {name} stroked your cheek, watching your tiny eyes grow heavy with milky contentment.",
      "{name} held you close and tipped the bottle at a comfortable angle, whispering gentle encouragements until your tummy was round and full."
    ],
    cold_detached: [
      "{name} held the calibrated glass bottle at a rigid, sterile angle with immaculate posture, checking a pocket watch every few sips until you finished in solemn silence.",
      "{name} fed you with surgical efficiency, keeping a linen handkerchief pressed to your collar to ensure not a single droplet soiled your garments.",
      "{name} administered the formula according to strict nutritional volume charts, removing the nipple after exactly eight minutes: \"Caloric intake: optimal.\"",
      "{name} supported your head with a gloved hand, observing your swallowing mechanics with clinical, diagnostic composure.",
      "{name} tipped the measuring bottle without uttering a word, burping you with three formal, rhythmic pats before handing you back to the nurse.",
      "{name} held the bottle steady while reading bond market summaries, ensuring the volume was consumed without emotional indulgence."
    ],
    deeply_religious: [
      "{name} whispered an earnest blessing over the formula, watching your face with intense, solemn vigilance as you drank, ensuring you gave thanks in your heart.",
      "{name} made the sign of the cross over the ceramic bottle before feeding you, praying aloud that this nourishment sustains a soul destined for righteousness.",
      "{name} held you before the candlelit icon while you drank, murmuring: \"Taste and see that the Lord is good; feed on grace as well as milk, infant.\"",
      "{name} dropped a microscopic droplet of blessed water into the formula, chanting a quiet protection psalm while you suckled hungrily.",
      "{name} cradled your head with solemn reverence, watching your throat swallow: \"May this vessel be fortified to endure the trials of a wicked world.\"",
      "{name} fed you in reverent silence, reciting the names of martyrs between burps to imprint holy patience upon your newborn mind."
    ],
    religious: [
      "{name} blessed the warm ceramic bottle and gently cradled your head, singing peaceful hymns until your tummy was full and your eyelids grew heavy.",
      "{name} smiled warmly as you drank, offering a quiet prayer of thanksgiving for daily bread and healthy, growing children.",
      "{name} held you close by the Sunday morning window, rocking you gently while church chorales played softly from the radio.",
      "{name} patted your back until a hearty baby burp emerged, chuckling softly: \"Praise the Lord for a strong, healthy digestion!\"",
      "{name} fed you warm sweet milk with loving patience, wiping your lips and kissing your brow with peaceful devotion.",
      "{name} rocked your cradle after feeding, humming a tranquil psalm that carried you straight into sweet, angelic slumber."
    ],
    extremely_strict: [
      "{name} supported the bottle firmly at a precise forty-five degree angle, watching the volume markings closely to ensure you drank every ounce without dribbling or pausing.",
      "{name} timed the feeding with a stainless steel stopwatch: \"Four ounces consumed in six minutes, thirty seconds. Pacing: acceptable.\"",
      "{name} wiped your mouth immediately if a micro-droplet appeared: \"Discipline begins at the bottle. Swallow cleanly.\"",
      "{name} held you at a strictly upright ninety-degree posture during feeding: \"Proper spinal alignment prevents colic. Do not slouch.\"",
      "{name} monitored every swallow with a disciplined nod: \"Nutritional schedule maintained. No mid-meal distraction permitted.\"",
      "{name} burped you with firm, measured precision, checking your bib: \"Spotless execution. Return to crib for scheduled nap.\""
    ],
    alcoholic: [
      "{name} held the lukewarm bottle with trembling hands, swaying slightly on the creaking floorboards while smelling of stale gin, relieved when you finally finished drinking.",
      "{name} sat slumped on the couch, gently tipping the bottle for you with bloodshot, weary eyes, whispering: \"Drink up, baby... at least you got food today.\"",
      "{name} warmed the bottle on the stove with shaky fingers, testing the heat on their wrist and sighing with exhausted relief as you drank peacefully.",
      "{name} held you close against their stained flannel shirt, weeping silent tears of remorse as you suckled, stroking your hair with clumsy tenderness.",
      "{name} burped you gently against their shoulder, patting you with unsteady hands while staring blankly at the empty hallway.",
      "{name} fed you while sitting on the floor by the radiator, speaking in a soft, slurred whisper: \"You're gonna have a better life than this, I swear it.\""
    ],
    eccentric_occult: [
      "{name} fed you warm goat's milk steeped with chamomile and nightshade honey, humming ancient nursery runes into the rising steam until your dreams were deep and strange.",
      "{name} tipped a darkened glass bottle etched with celestial sigils, watching your eyes dilate with otherworldly calm as you drank.",
      "{name} whispered esoteric invocations over the warm milk, smiling as the nursery shadows clustered around your cradle like protective guardians.",
      "{name} added three drops of consecrated lavender essence to the formula, humming harmonic intervals that made your tiny limbs relax into trancelike bliss.",
      "{name} cradled you beneath the hanging dried herbs, watching the smoke of burning myrrh coil peacefully above your bottle.",
      "{name} burped you while tapping an antique bone pendulum against your back, divining sweet portents from your contented infant sighs."
    ],
    working_class: [
      "{name} sat in tired overalls beside the humming radiator, patiently holding the warm bottle until you drank your fill and burped contentedly against their shoulder.",
      "{name} tested the warm milk on their calloused wrist, grinning through soot-stained cheeks as you gulped hungrily: \"That's it, little scrapper! Pack it in!\"",
      "{name} held you close after a long shift at the docks, resting their weary chin on your head while you finished every last drop of sweet milk.",
      "{name} wiped your chin with a clean cotton work rag, laughing warmly as you let out a loud, proud baby burp that shook your little frame.",
      "{name} shared a quiet moment by the warm stove, rocking you with tired, loving arms until your milk-drunk eyes fluttered closed.",
      "{name} patted your back with a heavy, gentle hand: \"Grow big and strong, baby. This city takes muscle, but we got plenty of that to spare.\""
    ],
    loving: [
      "{name} prepared a warm, sweet bottle and cradled you in a soft fleece blanket, smiling with overflowing love as you drank with eager baby gulps.",
      "{name} held you close against their heart, singing a tender lullaby while you drank, stroking your soft hair until your breathing slowed.",
      "{name} gently wiped your milky chin with a warm cloth, showering your cheeks with sweet butterfly kisses when you finished.",
      "{name} burped you with soft, loving pats, chuckling happily as you let out a tiny contented squeak and nestled into their neck.",
      "{name} rocked you by the sunny window, gazing down at your round, milk-fed cheeks with pure, unconditional adoration.",
      "{name} kissed your forehead as you drifted into a warm, milky sleep, tucking you into your crib with endless maternal/paternal warmth."
    ]
  };

  function getCuddleLine(person, character) {
    const atmo = (character.kin && character.kin.atmosphere) ? character.kin.atmosphere.id : 'loving';
    const isFamily = person.category === 'family';
    const isMother = person.role.includes('Mother');
    const isFather = person.role.includes('Father');
    const isGrand = person.role.includes('Grand');
    const isSibling = person.role.includes('Brother') || person.role.includes('Sister') || person.role.includes('Sibling');

    const vars = {
      name: person.name,
      role: person.role.toLowerCase(),
      city: character.city || 'the city'
    };

    if (person.isRevealed && person.entityType !== 'human') {
      return formatLine(pickRandom(CUDDLE_POOLS.revealed), vars);
    }
    if (!isFamily) {
      return formatLine(pickRandom(CUDDLE_POOLS.nonFamily), vars);
    }

    const atmoPool = CUDDLE_POOLS[atmo] || CUDDLE_POOLS.loving;
    let branch = atmoPool.fallback;
    if (isFather && atmoPool.father) branch = atmoPool.father;
    else if (isMother && atmoPool.mother) branch = atmoPool.mother;
    else if (isSibling && atmoPool.sibling) branch = atmoPool.sibling;
    else if (isGrand && atmoPool.grand) branch = atmoPool.grand;

    return formatLine(pickRandom(branch), vars);
  }

  function getPeekabooLine(person, character) {
    const atmo = (character.kin && character.kin.atmosphere) ? character.kin.atmosphere.id : 'loving';
    const isFamily = person.category === 'family';
    const vars = {
      name: person.name,
      role: person.role.toLowerCase(),
      city: character.city || 'the city'
    };
    if (!isFamily) return formatLine(pickRandom(PEEKABOO_POOLS.nonFamily), vars);
    const pool = PEEKABOO_POOLS[atmo] || PEEKABOO_POOLS.loving;
    return formatLine(pickRandom(pool), vars);
  }

  function getFeedMilkLine(person, character) {
    const atmo = (character.kin && character.kin.atmosphere) ? character.kin.atmosphere.id : 'loving';
    const isFamily = person.category === 'family';
    const vars = {
      name: person.name,
      role: person.role.toLowerCase(),
      city: character.city || 'the city'
    };
    if (!isFamily) return formatLine(pickRandom(FEED_MILK_POOLS.nonFamily), vars);
    const pool = FEED_MILK_POOLS[atmo] || FEED_MILK_POOLS.loving;
    return formatLine(pickRandom(pool), vars);
  }

  window.getCuddleLine = getCuddleLine;
  window.getPeekabooLine = getPeekabooLine;
  window.getFeedMilkLine = getFeedMilkLine;
  window.CUDDLE_POOLS = CUDDLE_POOLS;
  window.PEEKABOO_POOLS = PEEKABOO_POOLS;
  window.FEED_MILK_POOLS = FEED_MILK_POOLS;
})();

// ==========================================================================
// 3. CORE SOCIAL ACTIONS: SPEND TIME, CONVERSE, COMPLIMENT, GIFTS, MONEY, ARGUE, INVESTIGATE, TRIBUTE
// ==========================================================================
(function() {
  function formatLine(template, vars) {
    if (!template) return '';
    let str = template;
    for (const [key, val] of Object.entries(vars)) {
      const regex = new RegExp(`\\{${key}\\}`, 'g');
      str = str.replace(regex, val !== undefined ? val : '');
    }
    return str;
  }

  function pickRandom(arr) {
    if (!arr || arr.length === 0) return '';
    return arr[Math.floor(Math.random() * arr.length)];
  }

  const SPEND_TIME_POOLS = {
    cold_detached: {
      parent: [
        "You sat in complete silence in the drafty study while {name} reviewed bond ledgers without uttering a single word (+{relGain}% Closeness, +Smarts, -3% Happiness).",
        "You accompanied {name} on a stiff, formal promenade through the manicured city park, walking two paces behind (+{relGain}% Closeness, +Smarts, -2% Happiness).",
        "You ate a sterile, perfectly portioned dinner across the long mahogany table with {name} in absolute quiet (+{relGain}% Closeness, +Smarts, -3% Happiness).",
        "You accompanied {name} to the private municipal bank vault, watching them audit deposit boxes with clinical composure (+{relGain}% Closeness, +Smarts).",
        "You sat opposite {name} in the library, each reading separate treatises on political economy without exchanging a glance (+{relGain}% Closeness, +Smarts, -2% Happiness).",
        "You joined {name} for afternoon tea, where conversation was limited to formal inquiries regarding municipal weather and academic standing (+{relGain}% Closeness, +Smarts)."
      ],
      sibling: [
        "You studied side-by-side with {name} at opposite ends of the cherrywood desk in immaculate, polite silence (+{relGain}% Closeness, +Smarts).",
        "You and {name} practiced separate musical instruments in adjoining drawing rooms, communicating only through formal nods when crossing the hall (+{relGain}% Closeness, +Smarts).",
        "You played a game of chess with {name} in total silence, the ticking clock the only sound between each calculated move (+{relGain}% Closeness, +Smarts).",
        "You accompanied {name} on an orderly walk through the private courtyard, discussing academy curriculum with cool, competitive detachment (+{relGain}% Closeness, +Smarts).",
        "You and {name} reviewed family trust correspondence at the library table, comparing notes like polite corporate associates (+{relGain}% Closeness, +Smarts).",
        "You sat with {name} in the conservatory, each reading in quiet isolation beneath towering palm ferns (+{relGain}% Closeness, +Smarts)."
      ],
      grand: [
        "You sat stiffly on velvet antique settees while {name} lectured you on dynastic decorum and ancestral honor (+{relGain}% Closeness, +Smarts).",
        "You helped {name} turn the yellowed parchment pages of the family genealogy atlas, noting magistrates and judges dating back to 1740 (+{relGain}% Closeness, +Smarts).",
        "You accompanied {name} to inspect ancestral silver in the cellar vault, verifying every hallmark with a jeweler's loupe (+{relGain}% Closeness, +Smarts).",
        "You listened in respectful silence while {name} critiqued the declining standards of modern municipal society (+{relGain}% Closeness, +Smarts).",
        "You shared a formal cup of Earl Grey with {name}, learning how to handle family retainers and manage financial dividends (+{relGain}% Closeness, +Smarts).",
        "You walked through the portrait gallery with {name}, who quizzed you on the names, titles, and dates of departed ancestors (+{relGain}% Closeness, +Smarts)."
      ],
      fallback: [
        "You spent a quiet, structured afternoon with {name}, characterized by polite decorum and intellectual composure (+{relGain}% Closeness, +Smarts).",
        "You accompanied {name} through the city archives, browsing historical ledgers with mutual reserve (+{relGain}% Closeness, +Smarts).",
        "You shared an orderly, restrained conversation with {name} over formal tea (+{relGain}% Closeness, +Smarts)."
      ]
    },
    deeply_religious: {
      parent: [
        "You spent the afternoon kneeling on cold hardwood polishing church candelabras and reciting penitent psalms with {name} (+{relGain}% Closeness, +Humanity, -4% Happiness).",
        "You accompanied {name} to distribute austere charity bread at the parish mission in the freezing drizzle (+{relGain}% Closeness, +Humanity, -3% Happiness).",
        "You sat beside {name} while they copied verses of divine judgment into the family ledger by candlelight (+{relGain}% Closeness, +Humanity, -4% Happiness).",
        "You joined {name} for a grueling midnight prayer vigil before the hearth crucifix, weeping for the sins of {city} (+{relGain}% Closeness, +Humanity, -3% Sanity).",
        "You helped {name} scrub the cold chapel flagstones on your knees, praying silently for deliverance from eternal damnation (+{relGain}% Closeness, +Humanity, -3% Happiness).",
        "You fasted beside {name} on bread and well water, listening to readings from the Book of Revelation (+{relGain}% Closeness, +Humanity, -4% Happiness)."
      ],
      sibling: [
        "You whispered quiet catechism verses under the stairwell with {name}, dreading evening inspection (+{relGain}% Closeness, +Humanity).",
        "You and {name} cleaned tallow drippings from the parish votives, whispering secret comfort to one another when the elders weren't looking (+{relGain}% Closeness, +Humanity).",
        "You huddled with {name} in the cold attic, sharing a wool blanket while reciting protective litanies against the dark (+{relGain}% Closeness, +Humanity, +Sanity).",
        "You helped {name} memorize thirty verses of scripture before sundown, both terrified of failing the examination (+{relGain}% Closeness, +Humanity, +Smarts).",
        "You walked silently with {name} behind the church cemetery, finding solace in your shared endurance (+{relGain}% Closeness, +Humanity).",
        "You sat on the hard pew beside {name}, holding hands secretly under your coats while the preacher thundered (+{relGain}% Closeness, +Humanity)."
      ],
      grand: [
        "You sat by the heavy iron stove while {name} read terrifying sermons about brimstone and the unfaithful (+{relGain}% Closeness, -3% Sanity, +Humanity).",
        "{name} showed you woodcut illustrations of martyrs from an antique leather folio, explaining the glory of suffering (+{relGain}% Closeness, -2% Sanity, +Humanity).",
        "You helped {name} polish heavy cast-iron crucifixes, listening to their solemn warnings about modern wickedness (+{relGain}% Closeness, +Humanity).",
        "You joined {name} in reciting the Seven Penitential Psalms, their raspy, trembling voice filling the room with dread (+{relGain}% Closeness, -2% Sanity, +Humanity).",
        "{name} blessed your forehead with bitter holy water, recounting divine judgments that struck the city in their youth (+{relGain}% Closeness, +Humanity).",
        "You sat with {name} as winter twilight fell, listening to them chant ancient Latin litanies for the dead (+{relGain}% Closeness, -2% Sanity, +Humanity)."
      ],
      fallback: [
        "You joined {name} in quiet spiritual devotion, contemplating the heavy weight of divine judgment (+{relGain}% Closeness, +Humanity).",
        "You spent time with {name} reading sacred scripture and discussing the perils of worldly vanity (+{relGain}% Closeness, +Humanity).",
        "You accompanied {name} on parish charity rounds, offering quiet service to the downtrodden (+{relGain}% Closeness, +Humanity)."
      ]
    },
    religious: {
      parent: [
        "You helped {name} bake warm loaves of communion bread, filling the kitchen with sweet aromas of yeast and roasted grains (+{relGain}% Closeness, +Happiness, +Humanity).",
        "You worked alongside {name} tending the parish vegetable garden, sharing peaceful conversation under the morning sun (+{relGain}% Closeness, +Happiness, +Vitality).",
        "You gathered around the piano with {name}, singing uplifting church hymns that echoed through the cozy living room (+{relGain}% Closeness, +Happiness).",
        "You accompanied {name} to pack food hampers for struggling neighborhood families, feeling deep purposeful pride (+{relGain}% Closeness, +Humanity, +Happiness).",
        "You sat with {name} by the fireplace, discussing moral parables and finding comfort in their steady guidance (+{relGain}% Closeness, +Sanity, +Humanity).",
        "You helped {name} arrange fresh wildflowers on the family altar before Sunday service (+{relGain}% Closeness, +Happiness)."
      ],
      sibling: [
        "You and {name} rode bicycles down to the parish meadow picnic, sharing sweet iced tea and laughter under the shade trees (+{relGain}% Closeness, +Happiness, +Vitality).",
        "You worked on Sunday school crafts with {name}, painting wooden crosses and giggling over spilled watercolor jars (+{relGain}% Closeness, +Happiness).",
        "You and {name} practiced your choir parts together, laughing every time one of you cracked on the high notes (+{relGain}% Closeness, +Happiness).",
        "You walked home from service with {name}, tossing autumn leaves at each other along the tree-lined avenue (+{relGain}% Closeness, +Happiness).",
        "You helped {name} build a wooden birdhouse for the chapel garden, sharing hammers and good-natured jokes (+{relGain}% Closeness, +Happiness).",
        "You and {name} set the Sunday dinner table together, sneaking bites of roast potato behind mother's back (+{relGain}% Closeness, +Happiness)."
      ],
      grand: [
        "You shared a pot of hot peppermint tea with {name} by the hearth, listening to fond memories of old country revivals (+{relGain}% Closeness, +Happiness, +Sanity).",
        "You helped {name} knit warm wool blankets for the parish orphanage, listening to their gentle, comforting wisdom (+{relGain}% Closeness, +Humanity, +Happiness).",
        "You sat on the sunny porch with {name}, who pointed out singing robins and praised the beauty of simple creations (+{relGain}% Closeness, +Sanity, +Happiness).",
        "{name} showed you their treasured prayer journal dating back fifty years, sharing heartfelt reflections on life's blessings (+{relGain}% Closeness, +Humanity, +Happiness).",
        "You accompanied {name} to the church cemetery to lay fresh sprigs of lavender on ancestral graves (+{relGain}% Closeness, +Humanity, +Sanity).",
        "You helped {name} polish silver candlesticks while they hummed antique hymns that brought peace to your soul (+{relGain}% Closeness, +Sanity, +Happiness)."
      ],
      fallback: [
        "You shared a peaceful, uplifting afternoon with {name}, filled with wholesome conversation and good spirits (+{relGain}% Closeness, +Happiness).",
        "You accompanied {name} on a tranquil neighborhood walk, talking about faith, family, and hope for the future (+{relGain}% Closeness, +Happiness).",
        "You and {name} spent quality time together in quiet harmony, enjoying genuine mutual warmth (+{relGain}% Closeness, +Happiness)."
      ]
    },
    extremely_strict: {
      parent: [
        "You sat under a bright desk lamp while {name} audited your homework ledgers with a red grease pencil (+{relGain}% Closeness, +Smarts, -5% Happiness).",
        "You drilled flashcards, mental arithmetic, and Latin grammar for two straight hours under {name}'s watchful scowl (+{relGain}% Closeness, +Smarts, -4% Happiness).",
        "You stood at attention while {name} inspected your bed corners, closet hangers, and polished shoes (+{relGain}% Closeness, +Smarts, -3% Happiness).",
        "You accompanied {name} on a timed four-mile physical conditioning march along the reservoir in brisk morning frost (+{relGain}% Closeness, +Vitality, -3% Happiness).",
        "You sat across from {name} completing timed handwriting drills, erasing and rewriting lines until your fingers cramped (+{relGain}% Closeness, +Smarts, -4% Happiness).",
        "You reviewed your weekly conduct score with {name}, receiving a stern lecture on the dangers of complacency (+{relGain}% Closeness, +Smarts, -3% Happiness)."
      ],
      sibling: [
        "You raced through mandatory household inspections with {name}, both terrified of failing room check (+{relGain}% Closeness, +Smarts).",
        "You and {name} drilled each other on vocabulary lists under a dim lamp, whispering answers to beat the stopwatch (+{relGain}% Closeness, +Smarts, +Sanity).",
        "You sat beside {name} during mandatory silent study hour, exchanging sympathetic glances whenever floorboards creaked (+{relGain}% Closeness, +Smarts).",
        "You helped {name} iron pleats into their school uniform with military precision, avoiding demerits together (+{relGain}% Closeness, +Smarts).",
        "You and {name} practiced violin duets with rigid posture, determined not to let parental reprimands fall on either of you (+{relGain}% Closeness, +Smarts).",
        "You shared a quiet moment of relief with {name} after both passing the weekly chore inspection without a red mark (+{relGain}% Closeness, +Happiness)."
      ],
      grand: [
        "You stood at attention while {name} inspected your posture, diction, and shoe polish (+{relGain}% Closeness, +Smarts).",
        "{name} lectured you on the rigorous military standards of your ancestors, demanding you show iron discipline (+{relGain}% Closeness, +Smarts).",
        "You sat with {name} while they scrutinized your report card, noting that a 94% mark left six shameful points of mediocrity (+{relGain}% Closeness, +Smarts, -2% Happiness).",
        "You accompanied {name} through the municipal gardens, keeping a strictly regimented pace without looking at distractions (+{relGain}% Closeness, +Smarts).",
        "{name} tested your memory with historical dates and treaties, rapping their cane on the floorboards with every pause (+{relGain}% Closeness, +Smarts).",
        "You listened while {name} detailed how weak sentimentalism ruined lesser branches of the family (+{relGain}% Closeness, +Smarts)."
      ],
      fallback: [
        "You spent structured, disciplined time with {name}, adhering strictly to protocol and self-command (+{relGain}% Closeness, +Smarts).",
        "You accompanied {name} through rigorous, timed educational exercises (+{relGain}% Closeness, +Smarts).",
        "You engaged in serious, focused study alongside {name}, meeting demanding standards of excellence (+{relGain}% Closeness, +Smarts)."
      ]
    },
    alcoholic: {
      parent: [
        "You walked to the corner grocery store with {name} while they leaned heavily on your shoulder and slurred old regrets (+{relGain}% Closeness, -4% Happiness, +Smarts).",
        "You helped {name} find their mislaid keys and shoes in the cluttered living room before they lost their temper (+{relGain}% Closeness, +Smarts, -3% Happiness).",
        "You sat in the dim kitchen boiling black coffee while {name} stared out at the rainy alleyway in sullen silence (+{relGain}% Closeness, -3% Happiness, +Sanity).",
        "You quietly cleared empty amber bottles from the sofa so {name} could lie down, receiving a tearful, slurred thank-you (+{relGain}% Closeness, -3% Happiness).",
        "You sat beside {name} on the front steps in the evening breeze, listening to them reminisce about their youth before the drinking started (+{relGain}% Closeness, +Humanity, -2% Happiness).",
        "You cooked a simple pot of canned soup for {name} while they nursed a vicious headache, sharing a rare moment of peaceful truce (+{relGain}% Closeness, +Humanity)."
      ],
      sibling: [
        "You built a pillow fort in the back of the bedroom closet with {name}, hiding until the shouting downstairs quieted down (+{relGain}% Closeness, +Humanity, +Sanity).",
        "You and {name} pooled pocket coins to buy day-old bakery rolls, sharing a picnic on the fire escape above the rainy alley (+{relGain}% Closeness, +Happiness, +Sanity).",
        "You walked through the foggy neighborhood with {name} for two hours, waiting until the lights at home went dark and safe (+{relGain}% Closeness, +Sanity, +Vitality).",
        "You sat on the bed with {name}, sharing a pair of cracked headphones to listen to cassette music and drown out corridor shouting (+{relGain}% Closeness, +Sanity, +Happiness).",
        "You and {name} washed dishes together in whispering silence, taking pride in keeping the kitchen clean despite the chaos (+{relGain}% Closeness, +Humanity, +Smarts).",
        "You held hands with {name} under the blankets, promising each other that one day you'll both have safe, quiet homes of your own (+{relGain}% Closeness, +Sanity, +Humanity)."
      ],
      grand: [
        "You sat on the front porch with {name}, who gave you fresh peppermint candies and told you not to worry about home (+{relGain}% Closeness, +Happiness, +Sanity).",
        "You helped {name} bake warm cinnamon biscuits in their quiet, peaceful kitchen, relishing the sanctuary of their clean home (+{relGain}% Closeness, +Happiness, +Sanity).",
        "{name} stroked your hair while you cried on their shoulder, assuring you that your parents' addiction was never your fault (+{relGain}% Closeness, +Sanity, +Happiness).",
        "You accompanied {name} to the neighborhood market, carrying their string bag and feeling proud to be their helper (+{relGain}% Closeness, +Happiness, +Vitality).",
        "You curled in {name}'s armchair while they read old folk stories, your nervous system finally unwinding in true safety (+{relGain}% Closeness, +Sanity, +Happiness).",
        "{name} held your hands across the kitchen table, feeding you hearty stew and surrounding you with unconditional warmth (+{relGain}% Closeness, +Happiness, +Vitality)."
      ],
      fallback: [
        "You spent time with {name}, navigating the unpredictable household weather with quiet, vigilant resilience (+{relGain}% Closeness, +Smarts).",
        "You shared a quiet, sheltering moment with {name} away from domestic conflict (+{relGain}% Closeness, +Sanity).",
        "You and {name} found a brief pocket of calm together amidst the household storm (+{relGain}% Closeness, +Happiness)."
      ]
    },
    eccentric_occult: {
      parent: [
        "You helped {name} harvest nightshade, belladonna, and wormwood from the overgrown garden by the pale light of the waning moon (+{relGain}% Closeness, +Occult, +Smarts).",
        "You sat in the cellar sanctum while {name} deciphered cursive marginalia in an antique 17th-century grimoire (+{relGain}% Closeness, +Occult, +Smarts).",
        "You accompanied {name} to browse the dust-choked back rooms of an occult antiquarian bookstore, discovering curious lead amulets (+{relGain}% Closeness, +Occult, +Smarts).",
        "You helped {name} grind fragrant dried frankincense and sulfur in a heavy stone mortar, listening to esoteric lectures on astral alignment (+{relGain}% Closeness, +Occult).",
        "You sat beside {name} during a midnight candle ceremony, watching pale smoke twist into uncanny silhouettes that had no shadows (+{relGain}% Closeness, +Occult, -2% Sanity).",
        "You helped {name} polish and calibrate an antique brass orrery that tracked stars that do not appear on municipal charts (+{relGain}% Closeness, +Occult, +Smarts)."
      ],
      sibling: [
        "You and {name} explored the crumbling family crypt behind the garden, deciphering eroded Latin epitaphs with charcoal rubbings (+{relGain}% Closeness, +Occult, +Happiness).",
        "You sat on the attic floor with {name}, sharing secrets while watching an antique pendulum swing toward unseen magnetic currents (+{relGain}% Closeness, +Occult, +Sanity).",
        "You and {name} collected dead beetles and dried crow feathers from the eaves, cataloging them in a velvet-lined cigar box (+{relGain}% Closeness, +Occult).",
        "You huddled with {name} under black tapestry draperies, telling macabre ghost stories until the candle flickered out on its own (+{relGain}% Closeness, +Occult, +Happiness).",
        "You helped {name} draw chalk circles across the floorboards to see which house cats would refuse to cross the barrier (+{relGain}% Closeness, +Occult, +Happiness).",
        "You and {name} climbed to the tower roof at dusk, watching swarms of bats spiral up from the city chimneys (+{relGain}% Closeness, +Occult, +Vitality)."
      ],
      grand: [
        "You sat with {name} by the emerald hearth while they read your fortune from worn, blackened tarot cards (+{relGain}% Closeness, +Occult, +Sanity).",
        "{name} showed you their collection of Victorian spirit photographs, pointing out translucent figures standing beside ancestral chairs (+{relGain}% Closeness, +Occult).",
        "You helped {name} steep bitter mugwort tea in an antique iron kettle, listening to legends of the old witches of {city} (+{relGain}% Closeness, +Occult, +Smarts).",
        "{name} taught you how to read omens in chimney smoke and rain puddles, praising your intuitive second sight (+{relGain}% Closeness, +Occult, +Smarts).",
        "You sat beside {name}'s velvet chair while they demonstrated how candle flames bend sideways when certain names are spoken (+{relGain}% Closeness, +Occult, -1% Sanity).",
        "{name} gave you a small piece of polished amber holding a prehistoric wasp, explaining the flow of ancient life currents (+{relGain}% Closeness, +Occult, +Smarts)."
      ],
      fallback: [
        "You spent time with {name} immersed in strange lore, herbal preparations, and quiet esoteric study (+{relGain}% Closeness, +Occult).",
        "You joined {name} for an afternoon of curious antiquarian research and occult conversation (+{relGain}% Closeness, +Occult).",
        "You shared a fascinating, macabre moment with {name} contemplating secrets that lie beyond the mundane veil (+{relGain}% Closeness, +Occult)."
      ]
    },
    working_class: {
      parent: [
        "You helped {name} repair a sputtering radiator with wire and elbow grease, sharing honest laughs over soot-stained knuckles (+{relGain}% Closeness, +Happiness, +Vitality).",
        "You walked with {name} past the industrial foundries as evening shifts ended, listening to proud stories of worker solidarity (+{relGain}% Closeness, +Humanity, +Vitality).",
        "You sat with {name} on the tenement fire escape, sharing a steaming thermos of sweet black tea while watching rain over {city} (+{relGain}% Closeness, +Happiness, +Sanity).",
        "You helped {name} scrub the entrance stairs of the building, taking pride in clean work and sharing a paper bag of roasted peanuts (+{relGain}% Closeness, +Happiness, +Vitality).",
        "You sat by the humming oven door with {name}, mending heavy work gloves and listening to practical wisdom on standing up for yourself (+{relGain}% Closeness, +Smarts, +Happiness).",
        "You walked down to the docks with {name} on their day off, watching giant freighters unload timber and dreaming of far-off ports (+{relGain}% Closeness, +Happiness, +Smarts)."
      ],
      sibling: [
        "You and {name} scavenged scrap copper wire and empty glass bottles from alleyways, cashing them in for soda pennies (+{relGain}% Closeness, +Happiness, +Smarts).",
        "You wrestled playfully with {name} across the patchwork rag rug, laughing until you collapsed breathless against the couch (+{relGain}% Closeness, +Happiness, +Vitality).",
        "You and {name} built a wooden soapbox cart out of discarded packing crates, racing it down the steep cobblestone alley (+{relGain}% Closeness, +Happiness, +Vitality).",
        "You shared a plate of fried bread and potatoes with {name}, laughing over neighborhood gossip and teasing each other (+{relGain}% Closeness, +Happiness).",
        "You stood back-to-back with {name} in a neighborhood snowball fight behind the coal sheds, claiming victory with cold hands (+{relGain}% Closeness, +Happiness, +Vitality).",
        "You and {name} sat on the stoop watching tram cars click past on the tracks, sharing dreams of what you'll buy when you grow up (+{relGain}% Closeness, +Happiness, +Sanity)."
      ],
      grand: [
        "You sat by the coal stove while {name} darned heavy work socks, recounting dramatic tales of the great dock strikes of 1926 (+{relGain}% Closeness, +Humanity, +Smarts).",
        "You helped {name} peel winter potatoes into a dented pot, listening to their raspy, cheerful folk ballads of the old country (+{relGain}% Closeness, +Happiness).",
        "{name} rubbed soothing liniment on their calloused hands while telling you how honest sweat keeps a person's soul clean (+{relGain}% Closeness, +Humanity, +Happiness).",
        "You shared a buttered crust and a mug of strong builder's tea with {name}, basking in their deep, hard-won affection (+{relGain}% Closeness, +Happiness, +Vitality).",
        "{name} showed you their old union membership pin from fifty years ago, charging you to always stand by working people (+{relGain}% Closeness, +Humanity, +Smarts).",
        "You sat in {name}'s cozy tenement corner, warmed by their endless stories of how the family pulled through tough winters (+{relGain}% Closeness, +Happiness, +Sanity)."
      ],
      fallback: [
        "You spent time with {name} sharing hearty conversation, honest humor, and stubborn family solidarity (+{relGain}% Closeness, +Happiness).",
        "You and {name} enjoyed simple companionship by the kitchen stove, grounded in resilience and mutual care (+{relGain}% Closeness, +Happiness).",
        "You shared honest labor and genuine camaraderie with {name}, proud of your hardworking roots (+{relGain}% Closeness, +Happiness)."
      ]
    },
    loving: {
      parent: [
        "You spent a sunny afternoon walking through the botanical conservatory with {name}, sharing laughter and warm pretzels (+{relGain}% Closeness, +Happiness, +Sanity).",
        "You and {name} baked fresh apple cinnamon tarts in the kitchen, flouring each other's noses in playful joy (+{relGain}% Closeness, +Happiness).",
        "You sat by the living room hearth with {name}, playing board games and sipping hot cocoa while winter rain tapped the glass (+{relGain}% Closeness, +Happiness, +Sanity).",
        "You joined {name} for a leisurely bicycle ride along the river park, stopping to feed the ducks and chat about your dreams (+{relGain}% Closeness, +Happiness, +Vitality).",
        "You and {name} browsed the weekend book stalls together, discovering vintage adventure novels and talking for hours (+{relGain}% Closeness, +Happiness, +Smarts).",
        "You curled up on the couch beside {name}, watching classic films while sharing a giant bowl of buttery popcorn (+{relGain}% Closeness, +Happiness, +Sanity)."
      ],
      sibling: [
        "You and {name} spent hours building an elaborate blanket fort in the living room, giggling over secret passwords (+{relGain}% Closeness, +Happiness).",
        "You went for a bike ride down to the swimming pond with {name}, racing along the dirt road with wind in your hair (+{relGain}% Closeness, +Happiness, +Vitality).",
        "You and {name} shared your favorite comic books on the rug, laughing over silly character voices (+{relGain}% Closeness, +Happiness).",
        "You baked chocolate cookies with {name}, eating half the raw dough together when no one was looking (+{relGain}% Closeness, +Happiness).",
        "You and {name} stargazed from the backyard lawn, pointing out shooting stars and sharing your secret wishes (+{relGain}% Closeness, +Happiness, +Sanity).",
        "You played video games and board games with {name}, sharing high-fives and celebrating each other's victories (+{relGain}% Closeness, +Happiness)."
      ],
      grand: [
        "You sat in the flower garden with {name}, listening to romantic tales of how they met your grandfather/grandmother decades ago (+{relGain}% Closeness, +Happiness, +Sanity).",
        "You baked heirloom shortbread cookies with {name}, learning their secret family recipe while laughing over old stories (+{relGain}% Closeness, +Happiness).",
        "{name} showed you their old travel scrapbooks and vintage postcards, answering all your curious questions with loving patience (+{relGain}% Closeness, +Happiness, +Smarts).",
        "You went for a gentle stroll through the rose gardens with {name}, holding their arm and enjoying the fragrant afternoon breeze (+{relGain}% Closeness, +Happiness, +Sanity).",
        "You sat by the fireplace while {name} knitted, feeling completely safe and cherished in their peaceful presence (+{relGain}% Closeness, +Happiness, +Sanity).",
        "{name} hugged you tight and shared a sweet piece of fudge from their secret pantry tin, smiling with boundless adoration (+{relGain}% Closeness, +Happiness)."
      ],
      fallback: [
        "You spent a delightful, heartwarming afternoon with {name}, filled with genuine laughter, mutual trust, and affection (+{relGain}% Closeness, +Happiness).",
        "You and {name} shared a wonderful conversation over lunch, strengthening your close emotional bond (+{relGain}% Closeness, +Happiness).",
        "You enjoyed peaceful, joyful companionship with {name}, grateful for the deep love in your life (+{relGain}% Closeness, +Happiness)."
      ]
    }
  };

  const ARGUE_POOLS = {
    cold_detached: [
      "A tense disagreement erupted with {name}. They met your words with icy, surgical sarcasm and folded arms, dismissing your feelings as 'vulgar melodrama' (-{relLoss}% Closeness).",
      "You argued with {name} across the long mahogany table. They stared with unflinching, disdainful silence before uttering: 'You are an embarrassment to our lineage' (-{relLoss}% Closeness).",
      "During a clash over personal independence, {name} coldly noted that your financial allowance could easily be redirected to a trust fund (-{relLoss}% Closeness).",
      "{name} terminated the dispute by ringing for the household staff and ordering the study doors locked against you (-{relLoss}% Closeness).",
      "You raised your voice in frustration. {name} adjusted their cuffs with chilling composure: 'Lower your pitch. We do not bray like peasants in this house' (-{relLoss}% Closeness).",
      "A bitter disagreement ended when {name} stood up without looking at you, walking out of the room with absolute, frigid contempt (-{relLoss}% Closeness)."
    ],
    deeply_religious: [
      "{name} slammed their fist on the family Bible, screaming that demonic pride had corrupted your soul and that judgment was already at your door (-{relLoss}% Closeness).",
      "A furious argument erupted. {name} fell to their knees, weeping loudly and begging heaven to curse your stubborn heart with repentance (-{relLoss}% Closeness).",
      "{name} brandished an iron crucifix in your face, shouting: 'Rebel! Apostate! You will burn like chaff in unquenchable fire!' (-{relLoss}% Closeness).",
      "During a heated dispute, {name} threw your personal books into the hearth woodstove, proclaiming them tools of Satan (-{relLoss}% Closeness).",
      "{name} condemned you before the household altar, ordering you to fast on bread and water until your spirit was humbled (-{relLoss}% Closeness).",
      "A bitter religious quarrel ended with {name} splashing bitter holy water in your face and locking themselves in the chapel to mourn your damnation (-{relLoss}% Closeness)."
    ],
    religious: [
      "You got into a sharp argument with {name} over morality. They shook their head in deep disappointment: 'I pray the Lord softens your hardened heart' (-{relLoss}% Closeness).",
      "A disagreement over church duties led to raised voices. {name} turned away with wounded sorrow: 'Pride goeth before destruction, child' (-{relLoss}% Closeness).",
      "{name} accused you of drifting into worldly vanity and bad influences, sparking a tense shouting match that left both of you shaken (-{relLoss}% Closeness).",
      "During a family dispute, {name} firmly ordered silence: 'We do not speak with venom beneath this blessed roof' (-{relLoss}% Closeness).",
      "You clashed with {name} over social double standards. They retreated to the parlor, leaving the house in tense, heavy silence (-{relLoss}% Closeness).",
      "A quarrel about lifestyle choices ended with {name} softly weeping into their apron, murmuring that they expected better from you (-{relLoss}% Closeness)."
    ],
    extremely_strict: [
      "{name} slammed their ruler across the desk with a gunshot crack: 'Insubordination! You will adhere to the household code or face severe consequences!' (-{relLoss}% Closeness).",
      "A clash over rules led to {name} stripping away your weekend privileges, door lock, and recreation time for a full calendar month (-{relLoss}% Closeness).",
      "{name} stared you down with furious, unyielding authority: 'You live under my roof, you obey my command down to the second. Zero exceptions' (-{relLoss}% Closeness).",
      "You challenged {name}'s excessive demands. They delivered a blistering, fifty-minute lecture on discipline that reduced you to bitter silence (-{relLoss}% Closeness).",
      "During a dispute about personal freedom, {name} marked three red demerits on your conduct sheet and doubled your chore schedule (-{relLoss}% Closeness).",
      "{name} cut off your argument with a harsh, barking command: 'Silence! I will not entertain excuses from an undisciplined child!' (-{relLoss}% Closeness)."
    ],
    alcoholic: [
      "A terrifying argument exploded. {name} hurled an empty gin bottle against the kitchen wall, sending amber glass raining across the linoleum (-{relLoss}% Closeness).",
      "{name} staggered into your personal space, shouting slurred insults and bitter recriminations with alcohol-sweet, furious breath (-{relLoss}% Closeness).",
      "A trivial disagreement escalated into a door-slamming rage, with {name} kicking chairs and threatening to pack their bags and vanish forever (-{relLoss}% Closeness).",
      "{name} burst into angry, drunken sobs during the quarrel, blaming you for all the ruined years and wasted paychecks in their life (-{relLoss}% Closeness).",
      "You confronted {name} about their drinking. They flared into volcanic denial, screaming that you were ungrateful and disloyal (-{relLoss}% Closeness).",
      "A furious midnight row ended with neighbors pounding on the drywall and {name} storming out into the rainy alley, cursing your name (-{relLoss}% Closeness)."
    ],
    eccentric_occult: [
      "A chilling dispute arose with {name}. The candle flames flared violent violet as their voice dropped into a dark, resonant cadence of veiled curses (-{relLoss}% Closeness).",
      "{name} glared at you with unblinking eyes, murmuring that the spirits of the house would avenge their slight before the next new moon (-{relLoss}% Closeness).",
      "During an occult argument, {name} overturned an apothecary jar of black salt, whispering: 'May misfortune cling to your footsteps until your pride breaks' (-{relLoss}% Closeness).",
      "{name} extinguished the hearth fire with a single gesture, leaving the room in freezing darkness while declaring you a traitor to the ancestral bloodline (-{relLoss}% Closeness).",
      "You argued over forbidden family relics. {name} locked the cellar sanctum and warned that curiosity without obedience ends in madness (-{relLoss}% Closeness).",
      "{name} hissed a syllable that made your ears ring with metallic pain, ending the argument with a grim, portentous glare (-{relLoss}% Closeness)."
    ],
    working_class: [
      "A heated shouting match broke out over tight finances. {name} slammed their calloused fist on the table: 'I work twelve hours in the blast heat, and you waste breath whining?!' (-{relLoss}% Closeness).",
      "You clashed furiously with {name} over rent money and household duties, exchanging raw, blunt words that stung deeply (-{relLoss}% Closeness).",
      "{name} accused you of growing soft and looking down on honest labor, sparking a bitter, emotional argument in the cramped kitchen (-{relLoss}% Closeness).",
      "During a dispute about future plans, {name} threw their work cap onto the floor: 'This city doesn't give a damn about dreamers! Wake up!' (-{relLoss}% Closeness).",
      "A sharp row flared over broken promises, with {name} storming into the rainy courtyard to smoke in angry, brooding silence (-{relLoss}% Closeness).",
      "You and {name} exchanged cutting insults over past mistakes, leaving a sour, stubborn tension hanging over the evening dinner (-{relLoss}% Closeness)."
    ],
    loving: [
      "A painful, emotional disagreement broke out with {name}. Both of you said hurtful things in the heat of the moment before falling into tearful silence (-{relLoss}% Closeness).",
      "You argued with {name} over personal boundaries. They looked at you with wounded eyes, visibly heartbroken by your harsh tone (-{relLoss}% Closeness).",
      "A dispute flared over misunderstandings and bruised feelings, ending with slammed bedroom doors and a hollow, aching silence in the house (-{relLoss}% Closeness).",
      "You and {name} clashed sharply over important choices, with neither willing to back down until harsh words were spoken in anger (-{relLoss}% Closeness).",
      "{name} turned away during the argument with tears in their eyes: 'I only wanted what was best for you... how can you speak to me like this?' (-{relLoss}% Closeness).",
      "A heated quarrel left both of you exhausted and distant, sitting in separate rooms nursing hurt feelings and regret (-{relLoss}% Closeness)."
    ]
  };

  const INVESTIGATE_POOLS = [
    "You watched {name} closely from the shadows. When they passed the tall mirror in the hallway, their reflection lagged three seconds behind their physical body (+Occult, -Sanity).",
    "Observing {name} in the parlor, you noticed their breathing was utterly erratic—sometimes pausing for four full minutes while they spoke normally (+Occult, -Sanity).",
    "You inspected {name}'s belongings when they left the room. Tucked inside their coat lining were strange, dried parchment slips etched with unfamiliar spiral seals (+Occult).",
    "Watching {name} sleep, you heard them murmuring rhythmic, sibilant syllables in an unknown dead language that made the window glass vibrate faintly (+Occult, -Sanity).",
    "You studied {name}'s footsteps across the dusty floorboards. Uncannily, their boots left no impressions in the fine dust (+Occult, -Sanity).",
    "You peered into {name}'s eyes under direct lamplight and noticed their pupils were not circular, but subtle vertical slits that contracted horizontally (+Occult, -Sanity)."
  ];

  const TRIBUTE_POOLS = [
    "You placed your offering before {name}. Its fingers elongated with unnatural, fluid grace as it absorbed the tribute, letting out a satisfied, resonant purr (+Relationship, +Occult, -Sanity).",
    "The tribute dissolved upon {name}'s open palm like wax under flame. Its shadow stretched across the walls, bowing in deep, unholy communion (+Relationship, +Occult, -Sanity).",
    "{name} accepted your sacrifice with an ancient, terrifying smile: 'The bond deepens. The mortal tether remains strong' (+Relationship, +Occult, -Sanity).",
    "As {name} touched the offering, a sudden wave of freezing euphoria washed through your veins, attuning your spirit to otherworldly realms (+Relationship, +Occult, -Sanity).",
    "The offering vanished into {name}'s dark garments. For a single heartbeat, the room inverted into a vast, starless void before snapping back (+Relationship, +Occult, -Sanity).",
    "{name} inhaled the essence of your gift, its eyes flashing with abyssal purple luminescence: 'Thy loyalty is recorded in the black ledgers' (+Relationship, +Occult, -Sanity)."
  ];

  function getSpendTimeLine(person, character, relGain) {
    const atmo = (character.kin && character.kin.atmosphere) ? character.kin.atmosphere.id : 'loving';
    const isFamily = person.category === 'family';
    const isParent = person.role === 'Father' || person.role === 'Mother';
    const isSibling = person.role.includes('Brother') || person.role.includes('Sister');
    const isGrand = person.role.includes('Grand');

    const vars = {
      name: person.name,
      role: person.role.toLowerCase(),
      relGain: relGain || 10,
      city: character.city || 'the city'
    };

    if (!isFamily) {
      const genericPool = SPEND_TIME_POOLS.loving.fallback;
      return formatLine(pickRandom(genericPool), vars);
    }

    const atmoPool = SPEND_TIME_POOLS[atmo] || SPEND_TIME_POOLS.loving;
    let branch = atmoPool.fallback;
    if (isParent && atmoPool.parent) branch = atmoPool.parent;
    else if (isSibling && atmoPool.sibling) branch = atmoPool.sibling;
    else if (isGrand && atmoPool.grand) branch = atmoPool.grand;

    return formatLine(pickRandom(branch), vars);
  }

  function getArgueLine(person, character, relLoss) {
    const atmo = (character.kin && character.kin.atmosphere) ? character.kin.atmosphere.id : 'loving';
    const pool = ARGUE_POOLS[atmo] || ARGUE_POOLS.loving;
    const vars = {
      name: person.name,
      role: person.role.toLowerCase(),
      relLoss: relLoss || 8,
      city: character.city || 'the city'
    };
    return formatLine(pickRandom(pool), vars);
  }

  function getInvestigateLine(person, character, isRevealed) {
    const vars = {
      name: person.name,
      role: person.role.toLowerCase(),
      city: character.city || 'the city'
    };
    return formatLine(pickRandom(INVESTIGATE_POOLS), vars);
  }

  function getTributeLine(person, character) {
    const vars = {
      name: person.name,
      role: person.role.toLowerCase(),
      city: character.city || 'the city'
    };
    return formatLine(pickRandom(TRIBUTE_POOLS), vars);
  }

  window.getSpendTimeLine = getSpendTimeLine;
  window.getArgueLine = getArgueLine;
  window.getInvestigateLine = getInvestigateLine;
  window.getTributeLine = getTributeLine;
  window.SPEND_TIME_POOLS = SPEND_TIME_POOLS;
  window.ARGUE_POOLS = ARGUE_POOLS;
})();

// ==========================================================================
// 4. CHILDHOOD & TEEN ACTIONS: CHORES, PRAYER, EGGSHELLS, REPORT CARDS, ADVICE, PETS, DRIVING, COLLEGE
// ==========================================================================
(function() {
  function formatLine(template, vars) {
    if (!template) return '';
    let str = template;
    for (const [key, val] of Object.entries(vars)) {
      const regex = new RegExp(`\\{${key}\\}`, 'g');
      str = str.replace(regex, val !== undefined ? val : '');
    }
    return str;
  }

  function pickRandom(arr) {
    if (!arr || arr.length === 0) return '';
    return arr[Math.floor(Math.random() * arr.length)];
  }

  const CHORE_POOLS = {
    cold_detached: [
      "You spent three hours polishing the antique silver flatware with chalk powder, earning a single, measured nod of approval from {name} (+{relGain}% Closeness, +Smarts).",
      "You meticulously cataloged and dusted the leather folios in the library, completing your assigned duties with spotless decorum (+{relGain}% Closeness, +Smarts).",
      "You straightened the Persian carpets and arranged the drawing room chairs in exact symmetry under {name}'s clinical scrutiny (+{relGain}% Closeness, +Smarts).",
      "You polished the mahogany banisters until the grain reflected the crystal chandelier, receiving a formal acknowledgment from {name} (+{relGain}% Closeness, +Smarts).",
      "You assisted with sorting seasonal wardrobe trunks in the cedar closet, learning the proper preservation of fine garments (+{relGain}% Closeness, +Smarts).",
      "You inspected and wound the grandfather clocks throughout the estate, maintaining punctual household cadence (+{relGain}% Closeness, +Smarts)."
    ],
    deeply_religious: [
      "You scrubbed the cold stone hearth and polished heavy iron candelabras, offering your blistered hands as a prayer of penitence to {name} (+{relGain}% Closeness, +Humanity, -2% Happiness).",
      "You spent Saturday morning sweeping coal ash from the flue and scouring the chapel kneelers on your knees alongside {name} (+{relGain}% Closeness, +Humanity).",
      "You helped {name} wash and mend plain linen prayer shawls, reciting verses of mortification with every stitch (+{relGain}% Closeness, +Humanity).",
      "You scoured grease from iron broth pots with coarse sand and lye, accepting the menial labor as spiritual discipline (+{relGain}% Closeness, +Humanity).",
      "You cleaned wax drippings from the family altar and trimmed tallow wicks, receiving a solemn blessing from {name} (+{relGain}% Closeness, +Humanity).",
      "You carried buckets of icy well water to scrub the pantry floorboards in complete, disciplined silence (+{relGain}% Closeness, +Humanity)."
    ],
    religious: [
      "You helped {name} weed the churchyard vegetable patch, sharing friendly conversation while pulling carrots and potatoes (+{relGain}% Closeness, +Happiness, +Vitality).",
      "You swept the porch and polished the front brass doorknobs until they shone brightly in the morning sun (+{relGain}% Closeness, +Happiness).",
      "You washed and dried the Sunday dinner dishes alongside {name}, humming peaceful church hymns together (+{relGain}% Closeness, +Happiness).",
      "You dusted the family Bible and arranged fresh wildflowers in a ceramic vase for the dining table (+{relGain}% Closeness, +Happiness).",
      "You helped {name} fold fresh-smelling laundry dried in the clean spring breeze, sharing sweet family anecdotes (+{relGain}% Closeness, +Happiness).",
      "You assisted in carrying firewood into the kitchen, earning a warm cup of cocoa and sincere thanks from {name} (+{relGain}% Closeness, +Happiness)."
    ],
    extremely_strict: [
      "You scrubbed the kitchen floor on your hands and knees. {name} inspected the baseboards with white gloves, finding zero dust and approving your performance (+{relGain}% Closeness, +Smarts).",
      "You ironed sheets with razor-sharp hospital corners, passing {name}'s military inspection without a single demerit (+{relGain}% Closeness, +Smarts).",
      "You cleared gutters, raked gravel paths into perfect raked lines, and stacked firewood by size under {name}'s strict supervision (+{relGain}% Closeness, +Vitality, +Smarts).",
      "You spent four hours polishing all family boots to a mirror finish, meeting {name}'s rigorous standard of excellence (+{relGain}% Closeness, +Smarts).",
      "You washed windows until the glass was completely transparent, receiving a brief nod: 'Acceptable standard maintained' (+{relGain}% Closeness, +Smarts).",
      "You reorganized the tool shed according to strict labeled outlines on the pegboard, completing the task five minutes ahead of schedule (+{relGain}% Closeness, +Smarts)."
    ],
    alcoholic: [
      "You quietly gathered empty gin and whiskey bottles into recycling crates while {name} slept off a hangover, keeping the house clean (+{relGain}% Closeness, +Smarts).",
      "You mopped up spilled drinks from the carpet and aired out the living room, leaving the space fresh and peaceful for when {name} woke up (+{relGain}% Closeness, +Sanity).",
      "You took over cooking dinner, preparing a simple warm pot of noodles and beans so {name} had food ready after their migraine passed (+{relGain}% Closeness, +Humanity).",
      "You washed a mountain of dishes that had piled in the sink for days, feeling deep quiet pride in restoring order to the kitchen (+{relGain}% Closeness, +Sanity).",
      "You gathered scattered laundry from the hallway, running loads at the laundromat and folding everything neatly on {name}'s bed (+{relGain}% Closeness, +Smarts).",
      "You scrubbed stubborn cigarette burns from the coffee table and wiped down counters, receiving a weary, grateful hug from {name} (+{relGain}% Closeness, +Humanity)."
    ],
    eccentric_occult: [
      "You helped {name} hang fresh bundles of yarrow, wormwood, and rowan from the kitchen beams to dry in the draft (+{relGain}% Closeness, +Occult, +Smarts).",
      "You carefully wiped dust from glass bell jars holding preserved specimens and antique brass instruments in the cellar (+{relGain}% Closeness, +Occult).",
      "You swept chimney ash from the hearth into clay urns for protective salt mixtures, learning their esoteric uses from {name} (+{relGain}% Closeness, +Occult, +Smarts).",
      "You tended the nightshade and black hellebore in the greenhouse, trimming dead leaves under {name}'s watchful eye (+{relGain}% Closeness, +Occult, +Vitality).",
      "You helped {name} scrub wax and charcoal residue from the ritual floorboards, leaving the sacred circles immaculate (+{relGain}% Closeness, +Occult).",
      "You sorted odd animal bones by size and origin, organizing them neatly into velvet-lined drawers (+{relGain}% Closeness, +Occult, +Smarts)."
    ],
    working_class: [
      "You hauled five heavy buckets of coal up the narrow tenement stairs, sweating beside {name} with shared working-class grit (+{relGain}% Closeness, +Vitality, +Happiness).",
      "You spent Saturday morning beating heavy wool carpets over the courtyard railing, laughing through clouds of dust with {name} (+{relGain}% Closeness, +Happiness, +Vitality).",
      "You helped {name} fix a broken window sash with putty and scrap wood, saving the family precious heating money (+{relGain}% Closeness, +Smarts, +Happiness).",
      "You peeled a bushel of winter potatoes for the family stew pot, listening to {name}'s humorous neighborhood gossip (+{relGain}% Closeness, +Happiness).",
      "You scrubbed soot from the copper pipes by the radiator, polishing them until the metal gleamed with honest pride (+{relGain}% Closeness, +Happiness).",
      "You helped {name} mend torn work trousers by lamplight, earning a warm slice of buttered toast and heartfelt thanks (+{relGain}% Closeness, +Happiness)."
    ],
    loving: [
      "You and {name} spent a cheerful morning raking autumn leaves in the yard, jumping into the giant leaf piles together with joyful giggles (+{relGain}% Closeness, +Happiness).",
      "You helped {name} wash the family dishes, blowing soap bubbles at each other and laughing through the chore (+{relGain}% Closeness, +Happiness).",
      "You dusted the bookshelves and organized the family board games, receiving a warm hug and fresh homemade cookies from {name} (+{relGain}% Closeness, +Happiness).",
      "You worked side by side with {name} painting the porch railing a cheerful color, proud of your teamwork (+{relGain}% Closeness, +Happiness).",
      "You helped tidy the bedrooms and made fresh beds smelling of sunshine, rewarded with an afternoon movie and hot cocoa (+{relGain}% Closeness, +Happiness).",
      "You assisted {name} in the garden planting spring tulips, sharing happy conversations about your dreams for the year (+{relGain}% Closeness, +Happiness)."
    ]
  };

  const EGGSHELL_POOLS = {
    alcoholic: [
      "You navigated the hallway on silent tiptoes, tracking the clink of bottles from the kitchen and slipping into your room without drawing notice (+Smarts, +Sanity, -3% Happiness).",
      "Hearing heavy, stumbling footsteps on the stairs, you immediately turned off your desk lamp and sat frozen in total darkness until the door clicked shut (+Smarts, +Sanity).",
      "You carefully observed {name}'s slurred speech and body language over breakfast, adopting a meek, compliant tone that successfully avoided a shouting match (+Smarts, +Sanity).",
      "You hid your school report and loose pocket change in the closet floorboard, knowing anything visible on the counter could trigger a violent row (+Smarts, +Sanity).",
      "You washed your dishes in whispering silence, drying each fork with a cloth so metal wouldn't clatter against ceramic (+Smarts, +Sanity).",
      "You timed your movements around the apartment like a shadow, slipping out for school while {name} remained deeply unconscious on the sofa (+Smarts, +Sanity)."
    ],
    extremely_strict: [
      "You inspected your uniform three times in the mirror, ensured your room was spotless, and presented yourself with military posture, avoiding any demerits (+Smarts, +Sanity).",
      "You timed your arrival home to 16:58 sharp, placing your shoes precisely on the allocated matting and heading straight to silent study (+Smarts, +Sanity).",
      "Anticipating {name}'s inspection, you pre-emptively checked all bed corners and homework headings, maintaining an impeccable record (+Smarts, +Sanity).",
      "You maintained a formal, disciplined silence during dinner, answering only when addressed with respectful brevity (+Smarts, +Sanity).",
      "You carefully concealed a fantasy novel inside your heavy Latin grammar textbook, studying in flawless silence while escaping into your mind (+Smarts, +Sanity).",
      "You walked through the corridors with soft, measured steps, ensuring no doors creaked or cabinets clicked (+Smarts, +Sanity)."
    ],
    deeply_religious: [
      "You kept your eyes cast humbly to the floorboards and carried your rosary visibly, avoiding accusations of sinful worldly pride (+Humanity, +Sanity).",
      "You memorized extra scripture verses in advance, ready to recite them instantly whenever {name} tested your spiritual discipline (+Humanity, +Smarts).",
      "You concealed a secular magazine beneath your mattress and attended evening prayers with immaculate solemnity (+Smarts, +Sanity).",
      "You moved like a quiet ghost through the candlelit hallway, crossing yourself before each doorway to satisfy {name}'s vigilance (+Humanity, +Sanity).",
      "You maintained a somber, penitent demeanor during family dinner, keeping your rebellious thoughts strictly guarded (+Humanity, +Sanity).",
      "You suppressed a natural laugh and bowed your head, murmuring an Amen that completely satisfied {name}'s suspicious scrutiny (+Humanity, +Sanity)."
    ],
    cold_detached: [
      "You observed strict dynastic etiquette, speaking only in measured, articulate tones to avoid being dismissed as vulgar (+Smarts, +Sanity).",
      "You matched {name}'s polite emotional distance, offering crisp handshakes and impeccable posture that earned their quiet approval (+Smarts).",
      "You ate dinner in complete ceremonial silence, using every piece of cutlery with surgical precision to avoid reproach (+Smarts).",
      "You kept all personal emotions strictly guarded behind an aristocratic mask of poise and refined sarcasm (+Smarts, +Sanity).",
      "You presented your academic updates in a concise, bulleted verbal summary, respecting {name}'s demand for efficiency (+Smarts).",
      "You moved through the echoing mansion with silent, graceful steps, respecting the unwritten law of mutual solitude (+Smarts)."
    ],
    fallback: [
      "You navigated the tense household atmosphere with watchful caution and tact, avoiding domestic friction (+Smarts, +Sanity).",
      "You kept your head down and observed subtle changes in mood, maintaining peaceful equilibrium (+Smarts, +Sanity).",
      "You moved carefully through the house, ensuring no unnecessary conflict disturbed the fragile peace (+Smarts, +Sanity)."
    ]
  };

  const REPORT_CARD_POOLS = {
    cold_detached: [
      "{name} adjusted their gold pince-nez, examined your report card line-by-line, and filed it in the dynastic archive with a single nod: 'Adequate pedigree. Mediocrity will not be tolerated next term' (+{relGain}% Closeness, +Smarts).",
      "{name} audited your marks without smiling: 'Straight A's are the bare baseline expected of our lineage. Do not let praise breed complacency' (+{relGain}% Closeness, +Smarts).",
      "Reviewing your marks, {name} noted a 93% with cool scrutiny: 'Those missing seven points represent a lack of focus. Review your study habits' (+{relGain}% Closeness, +Smarts).",
      "{name} signed the school slip with a gold fountain pen, handing you a formal bank deposit slip as a performance dividend (+{relGain}% Closeness, +Smarts).",
      "Your father/mother observed your marks with detached aristocratic composure: 'Acceptable progress. Continue to distinguish our name' (+{relGain}% Closeness, +Smarts).",
      "{name} closed your report card with an indifferent 'Mm': 'Academic excellence is an investment, not an occasion for childish celebrations' (+{relGain}% Closeness, +Smarts)."
    ],
    extremely_strict: [
      "{name} inspected your grades with a red grease pencil: 'A 96%? Where did the other four points go? Weekend privileges are suspended until perfection is achieved' (+{relGain}% Closeness, +Smarts, -3% Happiness).",
      "{name} scrutinized your report card under the desk lamp: 'Top of the class is where you belong. Anything less is failure. Schedule two extra hours of math drills' (+{relGain}% Closeness, +Smarts).",
      "Seeing your flawless marks, {name} gave a rare, stiff nod: 'Standard maintained. Do not dare let your discipline slip next quarter' (+{relGain}% Closeness, +Smarts).",
      "{name} questioned your teacher's remarks: '\"Sociable and well-liked\"? School is for academic mastery, not idle social chatter. Refocus yourself' (+{relGain}% Closeness, +Smarts).",
      "{name} filed your straight-A report into your permanent portfolio, checking your study timetable to increase rigor (+{relGain}% Closeness, +Smarts).",
      "{name} tapped your report card with a ruler: 'Good marks are your duty, not a favor. Keep your head down and keep working' (+{relGain}% Closeness, +Smarts)."
    ],
    deeply_religious: [
      "{name} inspected your marks and opened the scripture: 'Knowledge puffeth up, but charity edifieth. See that your clever mind does not breed devil's pride' (+{relGain}% Closeness, +Humanity).",
      "{name} knelt before the crucifix with your report card: 'We thank heaven for this wisdom. Dedicate every mark to the service of God, not worldly ambition' (+{relGain}% Closeness, +Humanity).",
      "Reviewing your high grades, {name} frowned with spiritual vigilance: 'Intellect without holiness is a snare of perdition. Stay humble, child' (+{relGain}% Closeness, +Humanity).",
      "{name} signed your school card after reciting a prayer of thanksgiving, reminding you that all earthly knowledge turns to ash in the grave (+{relGain}% Closeness, +Humanity).",
      "{name} checked your conduct mark: '\"Pious and obedient\"—that is the only grade that truly matters in the ledgers of eternity' (+{relGain}% Closeness, +Humanity).",
      "{name} blessed your forehead with holy water: 'May the Lord preserve your mind from the godless doctrines taught in municipal classrooms' (+{relGain}% Closeness, +Humanity)."
    ],
    alcoholic: [
      "{name} looked at your straight A's with bleary, bloodshot eyes, suddenly bursting into proud, weeping tears: 'Look at my smart baby... you're gonna get out of this neighborhood, I know it' (+{relGain}% Closeness, +Happiness).",
      "{name} held your report card with shaking hands, digging into their pocket to hand you a crumpled five-dollar bill with an unsteady grin (+{relGain}% Closeness, +Happiness).",
      "{name} proudly taped your report card to the kitchen refrigerator beside the bottle opener: 'The smartest kid on the whole damn block!' (+{relGain}% Closeness, +Happiness).",
      "{name} woke up groggily, squinted at the gold honor roll stamp, and smiled with rare, sober tenderness: 'You make your old man/mom so proud, kiddo' (+{relGain}% Closeness, +Happiness).",
      "{name} showed your report card to the corner tavern bartender later that evening, bragging loudly about their brilliant child (+{relGain}% Closeness, +Happiness).",
      "{name} hugged you tight with alcohol-sweet breath: 'Keep studying, darling... don't you ever end up broken down like me' (+{relGain}% Closeness, +Happiness, +Sanity)."
    ],
    working_class: [
      "{name} held your report card in soot-stained, calloused hands, beaming with immense pride: 'Honor roll! Your mother and I couldn't be prouder! You're going all the way!' (+{relGain}% Closeness, +Happiness).",
      "{name} clinked two hard-earned coins onto the table as a reward: 'A reward from overtime shifts! You earned every penny of it, scholar!' (+{relGain}% Closeness, +Happiness).",
      "{name} proudly passed your report card around the tenement dinner table, cheering over your top marks in arithmetic (+{relGain}% Closeness, +Happiness).",
      "{name} wiped a tear from their eye with a work rag: 'Generations of factory backs, and now we got a real scholar in the house!' (+{relGain}% Closeness, +Happiness, +Humanity).",
      "{name} took you out for an ice cream soda at the corner fountain to celebrate your academic triumph (+{relGain}% Closeness, +Happiness).",
      "{name} framed your report card on the living room mantel beside the grandfather clock, beaming at every guest who walked in (+{relGain}% Closeness, +Happiness)."
    ],
    loving: [
      "{name} squealed with joy, gathered you into a giant bear hug, and spun you around the kitchen: 'Straight A's! I am so incredibly proud of you!' (+{relGain}% Closeness, +Happiness).",
      "{name} taped your report card right in the center of the refrigerator with colorful magnets, celebrating with homemade fudge (+{relGain}% Closeness, +Happiness).",
      "{name} beamed with radiant pride, showering your cheeks with kisses: 'All your hard work paid off, my brilliant superstar!' (+{relGain}% Closeness, +Happiness).",
      "{name} treated you to your favorite dinner and a bookstore shopping spree to celebrate your stellar achievements (+{relGain}% Closeness, +Happiness).",
      "{name} called your grandparents immediately to brag about your academic honors, smiling at you with overflowing adoration (+{relGain}% Closeness, +Happiness).",
      "{name} hugged you tightly, whispering: 'Smart, kind, and hardworking... you are everything a parent could ever dream of' (+{relGain}% Closeness, +Happiness, +Sanity)."
    ]
  };

  const DRIVING_LESSON_POOLS = [
    "You white-knuckled the steering wheel through dense river fog in {city}. {name} slammed their foot onto the imaginary passenger brake three times, barking tense instructions before you finally parallel parked smoothly (+Relationship, +Smarts).",
    "During a rainy driving session, you accidentally stalled the clutch at a busy tramway intersection. {name} gripped the dashboard in panic, but helped you restart and steer out safely (+Relationship, +Smarts).",
    "You navigated tight cobblestone alleyways with {name} watching your mirrors like a hawk, offering steady, patient advice that boosted your road confidence (+Relationship, +Smarts).",
    "You practiced highway merging in freezing drizzle. A freight truck blared its horn, sending your heart into your throat, but {name} calmly guided your steering (+Relationship, +Smarts).",
    "{name} took you out to an empty industrial parking lot after dark, letting you practice emergency stops and skids on wet asphalt with adrenaline-pumping fun (+Relationship, +Smarts, +Happiness).",
    "You successfully navigated a treacherous five-point roundabout during rush hour. {name} let out a long breath and grinned: 'You've got natural road instincts' (+Relationship, +Smarts)."
  ];

  const ROMANTIC_DATE_POOLS = [
    "You and {name} shared a red vinyl booth at a neon-lit diner, sipping cherry milkshakes and laughing until the waitress turned off the sign (+{relGain}% Closeness, +Happiness).",
    "You took a midnight stroll along the desolate canal pier with {name}, watching distant foghorns sound across the water as they rested their head on your shoulder (+{relGain}% Closeness, +Sanity).",
    "You caught a late-night double feature at the vintage cinema with {name}, sharing buttery popcorn in the dim velvet balcony while your fingers tangled together (+{relGain}% Closeness, +Happiness).",
    "You and {name} explored the dusty, candlelit backrooms of an antiquarian bookshop in {city}, discovering strange poetry folios and sharing whispered jokes (+{relGain}% Closeness, +Happiness, +Smarts).",
    "You shared an intimate candlelit dinner in a quiet attic bistro, toasting each other with cheap red wine while rain drummed romantically against the skylight (+{relGain}% Closeness, +Happiness).",
    "You walked hand-in-hand through the historic city botanical gardens at twilight, stealing kisses behind towering ferns while gas lamps flickered to life (+{relGain}% Closeness, +Happiness)."
  ];

  const FLIRT_KISS_POOLS = [
    "Under the flickering streetlight, {name} pulled you close and kissed you deeply in the crisp autumn breeze, their hands trembling against your coat (+{relGain}% Closeness, +Happiness).",
    "You whispered sweet, intimate promises to {name} in the dark, feeling their rapid heartbeat sync with your own as your lips met in passionate embrace (+{relGain}% Closeness, +Sanity, +Happiness).",
    "{name} gently cupped your cheek, gazing into your eyes with intoxicating desire before pulling you into a breathless, tender kiss (+{relGain}% Closeness, +Happiness).",
    "Leaning against the brick wall of an alleyway, {name} smiled playfully, tugged your collar forward, and shared a hungry, lingering kiss (+{relGain}% Closeness, +Happiness).",
    "Sitting side-by-side on the sofa in dim candlelight, you shared gentle kisses that slowly grew deeper and more passionate as the hours slipped away (+{relGain}% Closeness, +Happiness).",
    "{name} caught you by surprise, wrapping their arms around your waist and planting a warm, passionate kiss right on your lips (+{relGain}% Closeness, +Happiness)."
  ];

  function getChoresLine(person, character, relGain) {
    const atmo = (character.kin && character.kin.atmosphere) ? character.kin.atmosphere.id : 'loving';
    const pool = CHORE_POOLS[atmo] || CHORE_POOLS.loving;
    const vars = {
      name: person.name,
      role: person.role.toLowerCase(),
      relGain: relGain || 6,
      city: character.city || 'the city'
    };
    return formatLine(pickRandom(pool), vars);
  }

  function getEggshellsLine(person, character) {
    const atmo = (character.kin && character.kin.atmosphere) ? character.kin.atmosphere.id : 'alcoholic';
    const pool = EGGSHELL_POOLS[atmo] || EGGSHELL_POOLS.fallback;
    const vars = {
      name: person.name,
      role: person.role.toLowerCase(),
      city: character.city || 'the city'
    };
    return formatLine(pickRandom(pool), vars);
  }

  function getReportCardLine(person, character, gradeTier, relGain) {
    const atmo = (character.kin && character.kin.atmosphere) ? character.kin.atmosphere.id : 'loving';
    const pool = REPORT_CARD_POOLS[atmo] || REPORT_CARD_POOLS.loving;
    const vars = {
      name: person.name,
      role: person.role.toLowerCase(),
      relGain: relGain || 8,
      city: character.city || 'the city'
    };
    return formatLine(pickRandom(pool), vars);
  }

  function getDrivingLessonLine(person, character, success) {
    const vars = {
      name: person.name,
      role: person.role.toLowerCase(),
      city: character.city || 'the city'
    };
    return formatLine(pickRandom(DRIVING_LESSON_POOLS), vars);
  }

  function getDateLoverLine(person, character, relGain) {
    const vars = {
      name: person.name,
      role: person.role.toLowerCase(),
      relGain: relGain || 10,
      city: character.city || 'the city'
    };
    return formatLine(pickRandom(ROMANTIC_DATE_POOLS), vars);
  }

  function getFlirtKissLine(person, character, relGain) {
    const vars = {
      name: person.name,
      role: person.role.toLowerCase(),
      relGain: relGain || 10,
      city: character.city || 'the city'
    };
    return formatLine(pickRandom(FLIRT_KISS_POOLS), vars);
  }

  window.getChoresLine = getChoresLine;
  window.getEggshellsLine = getEggshellsLine;
  window.getReportCardLine = getReportCardLine;
  window.getDrivingLessonLine = getDrivingLessonLine;
  window.getDateLoverLine = getDateLoverLine;
  window.getFlirtKissLine = getFlirtKissLine;
  window.CHORE_POOLS = CHORE_POOLS;
  window.EGGSHELL_POOLS = EGGSHELL_POOLS;
  window.REPORT_CARD_POOLS = REPORT_CARD_POOLS;
  window.ROMANTIC_DATE_POOLS = ROMANTIC_DATE_POOLS;
  window.FLIRT_KISS_POOLS = FLIRT_KISS_POOLS;
})();

// ==========================================================================
// 5. SIBLINGS, GRANDPARENTS & ROMANCE ACTIONS
// ==========================================================================
(function() {
  function formatLine(template, vars) {
    if (!template) return '';
    let str = template;
    for (const [key, val] of Object.entries(vars)) {
      const regex = new RegExp(`\\{${key}\\}`, 'g');
      str = str.replace(regex, val !== undefined ? val : '');
    }
    return str;
  }

  function pickRandom(arr) {
    if (!arr || arr.length === 0) return '';
    return arr[Math.floor(Math.random() * arr.length)];
  }

  const SIBLING_BICKER_POOLS = {
    golden_child: [
      "During a mild disagreement, {name} immediately burst into theatrical tears and screamed for your parents, claiming you shoved them! You were harshly reprimanded (-{relLoss}% Closeness, -5% Happiness).",
      "{name} sneered and threatened to show father your hidden report card unless you surrendered the best chair (-{relLoss}% Closeness, -4% Happiness).",
      "During an argument over chores, {name} ran to the parlor and tattled on you, smirking behind mother's skirt while you received extra duties (-{relLoss}% Closeness, -5% Happiness).",
      "{name} loudly accused you of breaking an antique porcelain saucer, putting on a saintly face while parents grounded you (-{relLoss}% Closeness, -5% Happiness).",
      "You bickered over radio channels. {name} immediately complained to father, who ordered you to bed without supper (-{relLoss}% Closeness, -5% Happiness).",
      "{name} deliberately knocked over their own stack of books, shouting that you pushed them, earning you a harsh lecture on responsibility (-{relLoss}% Closeness, -4% Happiness)."
    ],
    sneaky_rebel: [
      "You and {name} wrestled in the hallway until the coats fell. They grinned with a split lip and slipped a contraband peppermint into your palm: \"Don't let them hear us\" (+{relGain}% Closeness, +Smarts).",
      "During a heated scuffle over a borrowed sweater, {name} winked and revealed a pack of stolen sweets: \"Call it a truce? Don't tell mom\" (+{relGain}% Closeness, +Happiness).",
      "You shoved {name} for taking your shoes; they tackled you onto the sofa, laughing breathlessly before offering to help sneak you out tonight (+{relGain}% Closeness, +Smarts).",
      "A hallway shoving match ended with {name} showing you a loose floorboard where they hide forbidden music cassettes (+{relGain}% Closeness, +Smarts).",
      "You and {name} argued furiously over who left the back door open, only to team up and hide the evidence together when floorboards creaked (+{relGain}% Closeness, +Smarts).",
      "{name} playfully tripped you on the rug, then helped you up with a conspiratorial grin: \"Next time you want to fight, let's go behind the school where no one sees\" (+{relGain}% Closeness, +Smarts)."
    ],
    trauma_bonded: [
      "A sudden petty squabble ended when an angry shout echoed from upstairs. You and {name} instantly fell silent, huddling shoulder to shoulder in the dim corridor (+{relGain}% Closeness, +Sanity).",
      "You and {name} were bickering over bread when a door slammed violently downstairs. Both of you froze, exchanged terrified looks, and gripped hands in silence (+{relGain}% Closeness, +Sanity).",
      "A sharp argument between you died instantly as heavy footsteps approached. {name} stepped in front of you protectively, shielding you from view (+{relGain}% Closeness, +Humanity, +Sanity).",
      "You fought over a blanket until you heard weeping from the kitchen. You both fell silent, sitting together in the dark sharing the warmth (+{relGain}% Closeness, +Sanity).",
      "An argument was cut short by the sound of breaking glass. {name} pulled you into the closet, whispering: \"Quiet... we'll be okay, I promise\" (+{relGain}% Closeness, +Sanity).",
      "You exchanged angry words until sirens wailed outside. {name} sighed with exhausted solidarity: \"Forget it... we only have each other in this madhouse\" (+{relGain}% Closeness, +Sanity)."
    ],
    playful: [
      "You and your {role} {name} got into an energetic pillow fight in the hallway, laughing breathlessly until feathers flew everywhere (+{relGain}% Closeness, +Vitality, +Happiness).",
      "You wrestled with {name} across the living room rug for possession of the television remote, collapsing in a heap of breathless giggles (+{relGain}% Closeness, +Happiness).",
      "A fierce argument over who ate the last slice of cake dissolved into a tickle war that left both of you crying with laughter (+{relGain}% Closeness, +Happiness).",
      "You and {name} had a blanket tug-of-war on the creaking bed, tumbling onto the floor with loud, joyful thumps (+{relGain}% Closeness, +Happiness, +Vitality).",
      "You threw a crumpled paper wad at {name}'s head; they retaliated with a couch cushion barrage, resulting in glorious domestic chaos (+{relGain}% Closeness, +Happiness).",
      "You and {name} bickered over who was taller, measuring against the doorframe and shoving each other with good-natured sibling rivalry (+{relGain}% Closeness, +Happiness)."
    ]
  };

  const SIBLING_SECRET_POOLS = [
    "{name} pulled you into the dark closet, lit a match with trembling fingers, and showed you a dented tin holding forty stolen silver shillings (+{relGain}% Closeness, +Smarts, +Sanity).",
    "Whispering under the blankets at midnight, {name} confessed that they saw a tall, faceless figure standing beside your bedroom window during last week's thunderstorm (+{relGain}% Closeness, +Occult, -2% Sanity).",
    "{name} swore you to secrecy and revealed a pack of contraband cigarettes and matches hidden inside an antique hollowed-out dictionary (+{relGain}% Closeness, +Smarts).",
    "With tears in their eyes, {name} confessed they accidentally broke mother's porcelain heirloom last month and buried the shards behind the garden shed (+{relGain}% Closeness, +Humanity).",
    "{name} whispered that they found an old adoption certificate tucked behind the drawers in the master study, leaving both of you shaken (+{relGain}% Closeness, +Smarts, -2% Sanity).",
    "You and {name} pricked your thumbs with an iron sewing needle and swore a midnight blood oath never to betray one another, come what may (+{relGain}% Closeness, +Humanity, +Occult)."
  ];

  const SIBLING_BRAWL_POOLS = [
    "A furious shouting match turned into a violent hallway brawl. You and {name} traded wild punches onto the dusty floorboards before panting in bloody-nosed exhaustion (-{relLoss}% Closeness, +Vitality, -3% Happiness).",
    "You tackled {name} into the hall coat rack, sending winter overcoats and umbrellas clattering as you traded bruising blows (-{relLoss}% Closeness, +Vitality).",
    "A bitter fistfight left both of you with split lips, torn shirts, and black eyes, glaring across the kitchen table with cold, panting fury (-{relLoss}% Closeness, -4% Happiness).",
    "You and {name} brawled down the narrow staircase, bruising ribs and scraping knuckles before neighbors banged on the wall to stop the noise (-{relLoss}% Closeness, +Vitality).",
    "Furious insults escalated into a physical clash in the alley behind the house, leaving both of you nursing bruised jaws and scraped elbows (-{relLoss}% Closeness).",
    "A savage wrestling match ended with both of you pinned against the wall, breathing heavily through clenched teeth before spitting a bitter truce (-{relLoss}% Closeness)."
  ];

  const SIBLING_ALIBI_POOLS = [
    "When parents demanded to know why {name} missed curfew, you smoothly lied that they were studying with you in the municipal library, saving them from severe punishment (+{relGain}% Closeness, +Smarts).",
    "You quietly unlatched the cellar window at 2:30 AM, letting a muddy, shivering {name} sneak inside without waking the household (+{relGain}% Closeness, +Smarts).",
    "You intercepted a disciplinary letter from the academy headmaster addressed to your parents, hiding it under the floorboards to protect {name} (+{relGain}% Closeness, +Smarts).",
    "When police cruisers rolled down the alley looking for youths, you gave {name} your jacket and swore to the officer they had been home all evening (+{relGain}% Closeness, +Smarts).",
    "You took the blame for a dented car fender, claiming you backed your bicycle into it to save {name} from being grounded for life (+{relGain}% Closeness, +Smarts, -3% Happiness).",
    "You washed {name}'s torn, blood-stained party clothes in secret before sunrise, fabricating a convincing alibi that satisfied parents (+{relGain}% Closeness, +Smarts)."
  ];

  const SIBLING_DRINKS_POOLS = [
    "You and {name} clinked dented pint glasses in a noisy corner tavern, toasting bitter beers to surviving your childhood home (+{relGain}% Closeness, +Happiness, +Sanity).",
    "Sitting on the vinyl bar stools under neon lights, you and {name} laughed until you cried over old family disasters and absurd school memories (+{relGain}% Closeness, +Happiness).",
    "You shared whiskey shots with {name} in a quiet dive bar, sharing raw adult regrets and finding deep comfort in each other's unbroken loyalty (+{relGain}% Closeness, +Sanity, +Humanity).",
    "Over cold draft beers, {name} leaned in and confessed their marriage struggles, grateful to have a sibling who understands where they came from (+{relGain}% Closeness, +Humanity).",
    "You and {name} drank dark ales by the tavern hearth, reminiscing about the old neighborhood and celebrating how far you've both come (+{relGain}% Closeness, +Happiness).",
    "A late-night tavern session ended with you and {name} walking arm-in-arm through foggy streets, singing old childhood songs with boozy camaraderie (+{relGain}% Closeness, +Happiness)."
  ];

  const GRANDPARENT_HAVEN_POOLS = [
    "You fled to {name}'s warm, quiet kitchen. They immediately pulled a batch of fresh cinnamon buns from the stove, wrapping you in a soft fleece blanket (+{relGain}% Closeness, +Happiness, +Sanity).",
    "{name} stroked your hair while you cried at their kitchen table, pouring you a steaming cup of chamomile tea with sweet clover honey (+{relGain}% Closeness, +Sanity, +Happiness).",
    "Sitting by {name}'s humming fireplace, the terror of your home melted away as they slipped a warm buttery scone into your hands (+{relGain}% Closeness, +Happiness, +Sanity).",
    "{name} let you nap on their plush velvet sofa, pulling heavy down quilts over your shoulders and humming peaceful lullabies by the hearth (+{relGain}% Closeness, +Sanity, +Happiness).",
    "You found refuge in {name}'s quiet parlor, eating sweet peppermint drops from their antique tin while listening to soothing clockwork chimes (+{relGain}% Closeness, +Happiness, +Sanity).",
    "{name} kissed your forehead with boundless tenderness: \"You're safe under grandfolk's roof, darling. Let the storm rage outside\" (+{relGain}% Closeness, +Sanity, +Happiness)."
  ];

  const GRANDPARENT_FOLKTALE_POOLS = [
    "{name} leaned forward by the dying embers, telling the grim legend of the Black Dog of the reservoir, whose glowing red eyes appear three days before a resident drowns (+{relGain}% Closeness, +Occult, -2% Sanity).",
    "With a raspy, dramatic whisper, {name} recounted the tale of the hollow miller of {city}, who ground human bones into flour to feed the winter famine of 1888 (+{relGain}% Closeness, +Occult, -2% Sanity).",
    "{name} told the haunting folktale of the lady in the fog, who wanders the canal locks calling the names of infants who never lived to see spring (+{relGain}% Closeness, +Occult, -2% Sanity).",
    "Sitting in shadows, {name} whispered the legend of the whistling chimney ghost, who only visits homes where family members harbor secret murder in their hearts (+{relGain}% Closeness, +Occult, -2% Sanity).",
    "{name} shared the macabre regional fable of the clockmaker who sold his own shadow to a gentleman in black velvet in exchange for thirty years of gold (+{relGain}% Closeness, +Occult, +Smarts).",
    "{name} told the ancient tale of the sunken parish beneath the marsh, where drowned church bells toll beneath the mud during heavy winter rains (+{relGain}% Closeness, +Occult, -2% Sanity)."
  ];

  const GRANDPARENT_ATTIC_POOLS = [
    "Rummaging through dust-covered cedar trunks in {name}'s attic, you discovered a clockwork brass music box that plays a slow, mournful tune when wound (+Occult, +Smarts).",
    "Beneath a mound of yellowed newspapers from 1894, you uncovered a silver daguerreotype of an ancestor whose eyes were completely scratched out with a needle (+Occult, -2% Sanity).",
    "You opened a warped leather chest, finding an antique porcelain doll whose glass eyes seemed to follow your candle flame across the attic floorboards (+Occult, -2% Sanity).",
    "In a hidden compartment of an oak wardrobe, you found an apothecary bottle filled with dried belladonna seeds and a handwritten ledger of curses (+Occult, +Smarts).",
    "You discovered a tarnished brass compass whose needle doesn't point north, but spins erratically toward the floorboards beneath the room (+Occult, +Smarts).",
    "You unearthed a packet of Victorian love letters sealed with black wax, detailing an affair that ended in a mysterious drowning in the city canal (+Smarts, +Occult)."
  ];

  const GRANDPARENT_KEEPSAKE_POOLS = [
    "{name} unlocked a velvet jewelry box with trembling hands, presenting you with an engraved silver pocket watch that once belonged to your great-grandfather (+{relGain}% Closeness, +Smarts).",
    "Tears in their eyes, {name} placed a heavy amber pendant around your neck: \"This stone protected our ancestors through two plagues. Keep it close\" (+{relGain}% Closeness, +Occult).",
    "{name} handed you a worn signet ring of tarnished brass, bearing the crest of your ancestral lineage: \"Wear this with dignity, child\" (+{relGain}% Closeness, +Smarts).",
    "{name} gifted you an antique bone hair comb carved with delicate floral filigree: \"My mother gave me this when I turned sixteen. Now it is yours\" (+{relGain}% Closeness, +Happiness).",
    "{name} passed down a leatherbound family diary filled with sketches, dried botanicals, and handwritten memoirs dating back a century (+{relGain}% Closeness, +Smarts, +Occult).",
    "{name} gave you a small, ornate silver flask engraved with your initials: \"A keepsake of our bloodline. Guard it well through hard times\" (+{relGain}% Closeness, +Smarts)."
  ];

  const GRANDPARENT_NURSING_POOLS = [
    "You sat by {name}'s bedside in the sterile municipal hospice, holding their fragile, paper-thin hand while they drifted in and out of peaceful sleep (+{relGain}% Closeness, +Humanity, +Sanity).",
    "You peeled fresh sweet oranges and fed them to {name} slice by slice, listening to their raspy, nostalgic memories of festivals in {city} sixty years ago (+{relGain}% Closeness, +Humanity, +Happiness).",
    "{name} gazed up at you with misty eyes, gently squeezing your fingers: \"Seeing your face brings the sunlight back into this dim room, darling\" (+{relGain}% Closeness, +Humanity, +Happiness).",
    "You adjusted {name}'s woolen bed shawl, reading aloud from the morning newspaper while winter rain tapped gently against the hospice glass (+{relGain}% Closeness, +Humanity).",
    "You brushed {name}'s soft silver hair and helped them drink warm tea, sharing quiet, poignant smiles that transcended generations (+{relGain}% Closeness, +Humanity, +Sanity).",
    "{name} whispered a final, heartfelt blessing over your life, their weathered hand resting weakly on yours with boundless love (+{relGain}% Closeness, +Humanity, +Sanity)."
  ];

  const FRIEND_CONFESS_POOLS = {
    accept: [
      "Standing under the dripping awning of a bus shelter, you confessed your feelings to {name}. Their eyes lit up with shock, then joy, as they pulled you into a passionate, rain-soaked kiss (+{relGain}% Closeness, +Happiness).",
      "During a quiet walk home from the library, you nervously confessed your love. {name} stopped in their tracks, blushed deeply, and took your hand: \"I've been waiting for you to say that for months\" (+{relGain}% Closeness, +Happiness).",
      "Sitting on a park bench at twilight, your heart pounded as you spoke your truth. {name} laughed with overwhelming relief, throwing their arms around your neck in joyful tears (+{relGain}% Closeness, +Happiness).",
      "You confessed your feelings to {name} over coffee. They reached across the table, intertwined their fingers with yours, and whispered: \"I feel the exact same way\" (+{relGain}% Closeness, +Happiness).",
      "Under the flickering gas lamp, you took a deep breath and confessed your love. {name} smiled with radiant affection and pulled you into a breathless, tender kiss (+{relGain}% Closeness, +Happiness).",
      "{name} gazed into your eyes with intoxicating tenderness after your confession, whispering: \"You're the only person I've ever truly cared for in this city\" (+{relGain}% Closeness, +Happiness)."
    ],
    reject: [
      "You confessed your romantic feelings to {name}. They looked down with gentle, agonizing awkwardness: \"I value our friendship so much, but I don't feel that way about you... I'm so sorry\" (-{relLoss}% Closeness, -5% Happiness).",
      "After your confession, {name} gave a pained, apologetic grimace: \"You're like a brother/sister to me. I don't want to ruin what we have\" (-{relLoss}% Closeness, -5% Happiness).",
      "{name} gently withdrew their hand after your confession, murmuring with regret: \"My heart belongs to someone else right now... please forgive me\" (-{relLoss}% Closeness, -6% Happiness).",
      "A heavy, awkward silence fell over the bench as {name} struggled for words: \"I think it's best if we just stay friends, okay?\" (-{relLoss}% Closeness, -5% Happiness).",
      "{name} smiled with sad pity: \"You're a wonderful person, but I just don't feel that romantic spark between us\" (-{relLoss}% Closeness, -5% Happiness).",
      "Your confession was met with a stunned, uncomfortable pause before {name} excused themselves to catch an earlier tram home (-{relLoss}% Closeness, -6% Happiness)."
    ]
  };

  const MOVE_IN_POOLS = [
    "You and {name} signed the lease on a charming, drafty fourth-floor apartment in {city}, clinking mismatched mugs over a makeshift milk-crate table (+Relationship, +Happiness).",
    "Carrying heavy cardboard boxes up three flights of stairs, you collapsed onto the bare mattress together, laughing breathlessly at your new shared home (+Relationship, +Happiness).",
    "{name} handed you a duplicate brass key on a red ribbon, kissing your lips passionately in the doorway of your new shared apartment (+Relationship, +Happiness).",
    "You and {name} spent your first evening hanging dark velvet curtains and assembling bookshelves, celebrating with cheap champagne by candlelight (+Relationship, +Happiness).",
    "Sitting on the floor of the empty living room eating takeout noodles, you and {name} toasted to your new domestic life together (+Relationship, +Happiness).",
    "You unlocked the door to your shared home, {name} scooping you into a playful bridal carry across the threshold with joyful laughter (+Relationship, +Happiness)."
  ];

  const PROPOSE_POOLS = {
    accept: [
      "Kneeling on the rainy canal pier under flickering gas lamps, you opened the velvet ring box. {name} gasped, burst into joyful tears, and cried 'YES!' before throwing their arms around your neck (+Relationship, +Happiness).",
      "By the glowing embers of the fireplace, you pulled out the ring. {name}'s hands flew to their mouth in breathless shock, kissing you deeply as they whispered 'Yes, a thousand times yes!' (+Relationship, +Happiness).",
      "During a rooftop dinner overlooking the misty spires of {city}, you asked {name} to be your spouse. They smiled through radiant tears and slipped the ring onto their finger (+Relationship, +Happiness).",
      "Walking through the historic rose garden at twilight, you dropped to one knee. {name} laughed with overwhelming joy, pulling you up into a passionate, ecstatic embrace (+Relationship, +Happiness).",
      "You presented the ring during an intimate midnight stroll. {name} stared in breathless wonder, whispering: 'I will marry you, in this life and the next' (+Relationship, +Happiness).",
      "{name} saw the ring box and practically tackled you onto the sofa with overjoyed laughter, shouting: 'YES! Of course I will!' (+Relationship, +Happiness)."
    ],
    reject: [
      "You dropped to one knee with the ring, but {name} recoiled with a look of pained panic: \"I... I'm so sorry, but I'm not ready for this. We need to slow down\" (-Relationship, -15% Happiness).",
      "{name} stared at the ring box in frozen horror, shaking their head tearfully: \"I love you, but I cannot marry you... not now, maybe not ever\" (-Relationship, -18% Happiness).",
      "A devastating silence fell as {name} gently closed the velvet box in your hands: \"Marriage is too big a step... I don't think we want the same future\" (-Relationship, -15% Happiness).",
      "{name} backed away with tears in their eyes: \"Please stand up... people are looking. I cannot say yes to this\" (-Relationship, -20% Happiness).",
      "You proposed under the streetlights, but {name} gave a heartbroken sigh: \"Our lives are too chaotic for marriage right now... I'm sorry\" (-Relationship, -15% Happiness).",
      "{name} rejected your proposal with trembling regret, turning and walking away into the misty rain, leaving you kneeling alone (-Relationship, -20% Happiness)."
    ]
  };

  const WEDDING_POOLS = [
    "You and {name} exchanged vows in a dim, candlelit stone chapel while organ music reverberated through the ancient rafters, sealing your union with an intense, passionate kiss (+Relationship, +Happiness).",
    "Standing before the municipal magistrate in {city}, you pledged your eternal devotion, slipping matching bands onto each other's fingers amidst joyful applause (+Relationship, +Happiness).",
    "You celebrated an intimate autumn wedding ceremony beneath a canopy of golden oak leaves, dancing together under strings of fairy lights into the midnight hours (+Relationship, +Happiness).",
    "Surrounded by close friends and weeping family, you and {name} toasted your holy matrimony with vintage champagne in a historic ballroom (+Relationship, +Happiness).",
    "You shared a quiet, deeply romantic ceremony in a botanical greenhouse, surrounded by blooming jasmine and the warm glow of lanterns (+Relationship, +Happiness).",
    "Your wedding day was a whirlwind of music, dancing, and heartfelt toasts, ending with you and {name} collapsing happily in each other's arms as legally wedded spouses (+Relationship, +Happiness)."
  ];

  const CONCEIVE_POOLS = [
    "After weeks of nervous anticipation, {name} emerged from the bathroom with tears of overwhelming joy, showing you a positive pregnancy test strip (+Relationship, +Happiness).",
    "Sitting on the edge of the bed in the morning sunlight, you and {name} held hands over your shared dream, celebrating the wonderful news of an impending child (+Relationship, +Happiness).",
    "{name} whispered the joyful secret into your ear over evening dinner, both of you bursting into happy tears and celebrating the start of a new family (+Relationship, +Happiness).",
    "You and {name} embraced tightly in the hallway, gazing at the positive test result with profound awe at the miracle growing within your lives (+Relationship, +Happiness).",
    "{name} placed your hand gently upon their stomach with a radiant, adoring smile: 'Our family is growing, my love' (+Relationship, +Happiness).",
    "The doctor confirmed the joyful pregnancy, sending you and {name} into an ecstatic celebration of prospective parenthood (+Relationship, +Happiness)."
  ];

  const BREAKUP_POOLS = [
    "A tearful, agonizing confrontation ended with {name} packing their suitcases, leaving their front door key on the kitchen table and walking out into the cold rain (-Relationship, -25% Happiness).",
    "After hours of bitter shouting and painful recriminations, you and {name} mutually agreed that the love had died, parting ways with cold, numb finality (-Relationship, -20% Happiness).",
    "{name} looked at you with hollow, exhausted eyes, stating quietly: 'We have become strangers living in the same room. It's over' (-Relationship, -22% Happiness).",
    "The relationship dissolved in court with the signing of bitter divorce decree documents, splitting shared assets in chilling silence (-Relationship, -30% Happiness).",
    "You slammed the door behind you with your belongings in a cardboard box, leaving {name} weeping in the empty hallway as your romance turned to dust (-Relationship, -25% Happiness).",
    "A quiet, heart-wrenching conversation over coffee concluded your years together, ending with a final, painful hug before walking in opposite directions (-Relationship, -20% Happiness)."
  ];

  function getSiblingBickerLine(person, character, role, outcomeType, relGainOrLoss) {
    const vars = {
      name: person.name,
      role: person.role.toLowerCase(),
      relGain: relGainOrLoss || 4,
      relLoss: Math.abs(relGainOrLoss || 6),
      city: character.city || 'the city'
    };

    if (role === 'The Golden Child' || role === 'Tattling Moralist') {
      return formatLine(pickRandom(SIBLING_BICKER_POOLS.golden_child), vars);
    } else if (role === 'The Sneaky Rebel') {
      return formatLine(pickRandom(SIBLING_BICKER_POOLS.sneaky_rebel), vars);
    } else if (role === 'Trauma-Bonded Protector') {
      return formatLine(pickRandom(SIBLING_BICKER_POOLS.trauma_bonded), vars);
    }
    return formatLine(pickRandom(SIBLING_BICKER_POOLS.playful), vars);
  }

  function getSiblingSecretLine(person, character, relGain) {
    const vars = { name: person.name, role: person.role.toLowerCase(), relGain: relGain || 6, city: character.city || 'the city' };
    return formatLine(pickRandom(SIBLING_SECRET_POOLS), vars);
  }

  function getSiblingBrawlLine(person, character, relLoss) {
    const vars = { name: person.name, role: person.role.toLowerCase(), relLoss: relLoss || 8, city: character.city || 'the city' };
    return formatLine(pickRandom(SIBLING_BRAWL_POOLS), vars);
  }

  function getSiblingAlibiLine(person, character, relGain) {
    const vars = { name: person.name, role: person.role.toLowerCase(), relGain: relGain || 8, city: character.city || 'the city' };
    return formatLine(pickRandom(SIBLING_ALIBI_POOLS), vars);
  }

  function getSiblingDrinksLine(person, character, relGain) {
    const vars = { name: person.name, role: person.role.toLowerCase(), relGain: relGain || 10, city: character.city || 'the city' };
    return formatLine(pickRandom(SIBLING_DRINKS_POOLS), vars);
  }

  function getGrandparentHavenLine(person, character, relGain) {
    const vars = { name: person.name, role: person.role.toLowerCase(), relGain: relGain || 10, city: character.city || 'the city' };
    return formatLine(pickRandom(GRANDPARENT_HAVEN_POOLS), vars);
  }

  function getGrandparentFolktaleLine(person, character, relGain) {
    const vars = { name: person.name, role: person.role.toLowerCase(), relGain: relGain || 6, city: character.city || 'the city' };
    return formatLine(pickRandom(GRANDPARENT_FOLKTALE_POOLS), vars);
  }

  function getGrandparentAtticLine(person, character) {
    const vars = { name: person.name, role: person.role.toLowerCase(), city: character.city || 'the city' };
    return formatLine(pickRandom(GRANDPARENT_ATTIC_POOLS), vars);
  }

  function getGrandparentKeepsakeLine(person, character) {
    const vars = { name: person.name, role: person.role.toLowerCase(), relGain: 12, city: character.city || 'the city' };
    return formatLine(pickRandom(GRANDPARENT_KEEPSAKE_POOLS), vars);
  }

  function getNursingHomeLine(person, character, relGain) {
    const vars = { name: person.name, role: person.role.toLowerCase(), relGain: relGain || 10, city: character.city || 'the city' };
    return formatLine(pickRandom(GRANDPARENT_NURSING_POOLS), vars);
  }

  function getFriendConfessLine(person, character, success, relGainOrLoss) {
    const pool = success ? FRIEND_CONFESS_POOLS.accept : FRIEND_CONFESS_POOLS.reject;
    const vars = {
      name: person.name,
      role: person.role.toLowerCase(),
      relGain: relGainOrLoss || 15,
      relLoss: Math.abs(relGainOrLoss || 10),
      city: character.city || 'the city'
    };
    return formatLine(pickRandom(pool), vars);
  }

  function getMoveInLine(person, character, success) {
    const vars = { name: person.name, role: person.role.toLowerCase(), city: character.city || 'the city' };
    return formatLine(pickRandom(MOVE_IN_POOLS), vars);
  }

  function getProposeMarriageLine(person, character, success, ringTier) {
    const pool = success ? PROPOSE_POOLS.accept : PROPOSE_POOLS.reject;
    const vars = { name: person.name, role: person.role.toLowerCase(), city: character.city || 'the city' };
    return formatLine(pickRandom(pool), vars);
  }

  function getWeddingCeremonyLine(person, character, venueType) {
    const vars = { name: person.name, role: person.role.toLowerCase(), city: character.city || 'the city' };
    return formatLine(pickRandom(WEDDING_POOLS), vars);
  }

  function getConceiveChildLine(person, character) {
    const vars = { name: person.name, role: person.role.toLowerCase(), city: character.city || 'the city' };
    return formatLine(pickRandom(CONCEIVE_POOLS), vars);
  }

  function getBreakupLine(person, character, isDivorce) {
    const vars = { name: person.name, role: person.role.toLowerCase(), city: character.city || 'the city' };
    return formatLine(pickRandom(BREAKUP_POOLS), vars);
  }

  window.getSiblingBickerLine = getSiblingBickerLine;
  window.getSiblingSecretLine = getSiblingSecretLine;
  window.getSiblingBrawlLine = getSiblingBrawlLine;
  window.getSiblingAlibiLine = getSiblingAlibiLine;
  window.getSiblingDrinksLine = getSiblingDrinksLine;
  window.getGrandparentHavenLine = getGrandparentHavenLine;
  window.getGrandparentFolktaleLine = getGrandparentFolktaleLine;
  window.getGrandparentAtticLine = getGrandparentAtticLine;
  window.getGrandparentKeepsakeLine = getGrandparentKeepsakeLine;
  window.getNursingHomeLine = getNursingHomeLine;
  window.getFriendConfessLine = getFriendConfessLine;
  window.getMoveInLine = getMoveInLine;
  window.getProposeMarriageLine = getProposeMarriageLine;
  window.getWeddingCeremonyLine = getWeddingCeremonyLine;
  window.getConceiveChildLine = getConceiveChildLine;
  window.getBreakupLine = getBreakupLine;
})();


// ============================================================================
// 6. EXTENDED FAMILY & ADULT KIN ACTIONS (Prayers, Pets, College, Loans, Elder Care, Light Talk, Compliments)
// ============================================================================
(function() {
  function formatLine(template, vars) {
    if (!template) return '';
    let str = template;
    for (const [key, val] of Object.entries(vars)) {
      const regex = new RegExp(`\\{${key}\\}`, 'g');
      str = str.replace(regex, val !== undefined ? val : '');
    }
    return str;
  }

  function pickRandom(arr) {
    if (!arr || arr.length === 0) return '';
    return arr[Math.floor(Math.random() * arr.length)];
  }

  const PRAY_POOLS = {
    holy: [
      "You knelt in solemn silence beside {name}, palms pressed flat as candlelight flickered against old vellum scripture. A deep, tranquil stillness settled over the household (+{relGain}% Closeness, +Humanity, +Sanity).",
      "Bowing before the dark iron crucifix beside {name}, you recited the evening penitence in unison, your voices mingling with the distant chime of the parish bell (+{relGain}% Closeness, +Humanity, +Sanity).",
      "You and {name} knelt on the worn floorboards, lighting thin beeswax tapers before an antique icon of Saint Jude, seeking grace against the winter frost (+{relGain}% Closeness, +Humanity, +Sanity).",
      "{name} traced a gentle cross onto your forehead with cold holy water, murmuring psalms of protection as the evening wind whistled through the rafters (+{relGain}% Closeness, +Humanity, +Sanity).",
      "Under {name}'s steady guidance, you bowed your head over an heirloom prayer book, reading verses of comfort that seemed to soften the gloom of the room (+{relGain}% Closeness, +Humanity, +Sanity).",
      "You shared a quiet half-hour in prayer with {name}, both kneeling on coarse prayer mats while tallow smoke curled into the quiet dark (+{relGain}% Closeness, +Humanity, +Sanity)."
    ],
    occult_burned: [
      "You knelt on the cold hardwood beside {name}, bowing before the crucifix. As you murmured the holy verses, your occult senses burned like lye; shadows coiled along the baseboard, repelled by the prayer (+{relGain}% Closeness, +Humanity, -5% Sanity).",
      "Kneeling beside {name}, you tried to recite the sacred words, but an icy weight seized your throat. The candle flames bowed sideways toward the hearth as unseen entities hissed in protest (+{relGain}% Closeness, +Humanity, -5% Sanity).",
      "As {name} recited the solemn litany, the air around you turned freezing cold. The words of faith felt like molten lead against your third eye, clashing with the unseen forces tied to your blood (+{relGain}% Closeness, +Humanity, -5% Sanity).",
      "You clasped your trembling hands beside {name}. While they prayed with pure devotion, the dark shadows under the armoire twitched violently, resisting the holy invocation (+{relGain}% Closeness, +Humanity, -5% Sanity).",
      "The incense smoke seemed to choke your breath as {name} chanted the vespers. Unseen murmurs scratched at the window glass, furious at the holy barrier (+{relGain}% Closeness, +Humanity, -5% Sanity).",
      "You forced yourself to endure the long prayer beside {name}, though an invisible chill prickled every hair on your arms and your reflection in the glass appeared momentarily hollow (+{relGain}% Closeness, +Humanity, -5% Sanity)."
    ]
  };

  const BEG_PET_POOLS = {
    pet_granted: [
      "{name} sighed, looked into your pleading eyes, and brought home a scruffy stray {species}: {petName}! (+Happiness, +Closeness)",
      "Moved by your desperate tears, {name} gave in and allowed you to take in a shivering stray {species} from the alley: {petName}! (+Happiness, +Closeness)",
      "{name} shook their head with a helpless, fond chuckle, returning that evening with a quiet {species} bundled in an old woolen scarf: {petName}! (+Happiness, +Closeness)",
      "After days of endless pleading, {name} opened the back gate and presented a wide-eyed stray {species}: {petName}! (+Happiness, +Closeness)",
      "{name} finally relented, setting down a wicker basket containing a gentle stray {species}: {petName}! (+Happiness, +Closeness)",
      "Wiping your tears with a calloused thumb, {name} agreed to let you adopt the stray {species} that had been lingering on the porch: {petName}! (+Happiness, +Closeness)"
    ],
    toy_granted: [
      "{name} gave in to your persistence and bought you a beautiful antique wooden puzzle toy and sweet treats (+12% Happiness, +5% Closeness).",
      "{name} slipped a small velvet bag into your hand containing a set of hand-carved painted lead soldiers and peppermint sticks (+12% Happiness, +5% Closeness).",
      "Seeing your longing glance, {name} surprised you with an intricately geared brass kaleidoscope from the street market (+12% Happiness, +5% Closeness).",
      "{name} brought home a beautifully bound book of fairy tales with gilded edges, patting your hair with rare indulgence (+12% Happiness, +5% Closeness).",
      "Pitying your boredom, {name} gifted you a lovely antique music box that played a melancholy waltz when wound (+12% Happiness, +5% Closeness).",
      "{name} bought you a sturdy wooden rocking horse carved from pale birch, smiling as you laughed in delight (+12% Happiness, +5% Closeness)."
    ],
    denied: [
      "{name} firmly crossed their arms: 'We cannot afford frivolous luxuries or extra mouths to feed in this house. Absolutely not.' (-4% Happiness, -4% Closeness).",
      "{name} gave an icy glare: 'A child of this household must learn discipline, not self-indulgence. Return to your studies at once.' (-4% Happiness, -4% Closeness).",
      "{name} shook their head with an exhausted, weary sigh: 'Money is too scarce, child. Do not ask for what we cannot provide.' (-4% Happiness, -4% Closeness).",
      "{name} pushed away your hand: 'No animals and no useless trinkets. This house is drafty enough without more noise.' (-4% Happiness, -4% Closeness).",
      "{name} frowned sternly: 'Wanting things you have not earned will make you weak in this city. Cease this whining.' (-4% Happiness, -4% Closeness).",
      "{name} tapped the table impatiently: 'The municipal bills take priority over toys. Learn some patience.' (-4% Happiness, -4% Closeness)."
    ]
  };

  const DISCUSS_COLLEGE_POOLS = [
    "{name} reviewed your ambitions and nodded solemnly: 'The world beyond these walls is merciless, but an educated mind is an iron fortress.' (+Smarts, +Closeness)",
    "{name} adjusted their spectacles and scrutinized your academic ledger: 'Aim high, but never forget where you came from. True scholar's blood requires relentless discipline.' (+Smarts, +Sanity)",
    "{name} poured two cups of black tea and spoke frankly about career paths in the municipal bureaus and universities (+Smarts, +Closeness)",
    "{name} listened intently to your aspirations, offering measured advice on balancing ambition with financial reality (+Smarts, +Sanity)",
    "{name} pulled down an old atlas from the bookshelf, tracing university towns and speaking wistfully of opportunities they never had (+Smarts, +Closeness)",
    "{name} gave a rare, quiet smile of approval: 'You have a sharper head than I did at your age. Do not let this city extinguish your fire.' (+Smarts, +Closeness)"
  ];

  const LOAN_POOLS = {
    granted: [
      "{name} counted out {formattedAmount} with a stern expression: 'Take this to get yourself on your feet. Repay me when your harvest comes in.' (Debt Recorded)",
      "{name} signed a bank draft for {formattedAmount}, looking into your eyes: 'Kin must support kin in dark hours, but honor the debt when you can.' (Debt Recorded)",
      "{name} retrieved {formattedAmount} from a metal lockbox beneath the floorboards: 'Use this wisely. Every shilling was earned with blistered fingers.' (Debt Recorded)",
      "{name} handed you an envelope containing {formattedAmount}: 'Consider this an investment in your future. Do not make me regret my generosity.' (Debt Recorded)",
      "With a heavy sigh, {name} opened their leather billfold and gave you {formattedAmount}: 'Pay it back when your fortunes turn, child.' (Debt Recorded)",
      "{name} slid {formattedAmount} across the table: 'Family stands together against the city's wolves. Put this toward your stability.' (Debt Recorded)"
    ],
    denied: [
      "{name} shook their head: 'I cannot risk {formattedAmount}. Money lent to kin often burns the bridge between them.' (-6% Closeness).",
      "{name} closed their ledger with a cold snap: 'I run a household, not a charitable foundation. Manage your own debts.' (-6% Closeness).",
      "{name} gave an apologetic grimace, showing empty pockets: 'If I had it, I would give it, but the winter costs have cleaned me out.' (-6% Closeness).",
      "{name} frowned deeply: 'Borrowing is a trap that swallows foolish youths. Find another way to resolve your trouble.' (-6% Closeness).",
      "{name} sternly declined: 'You must learn to stand on your own two feet. Relying on family handouts will cripple your character.' (-6% Closeness).",
      "{name} pushed the request away: 'The municipal economy is too fragile right now. I cannot spare a single banknote.' (-6% Closeness)."
    ]
  };

  const ELDER_CARE_POOLS = [
    "You accompanied {name} to the municipal clinic, reviewing their prescription tinctures and holding their frail, spotted hand (+{relGain}% Closeness, +Humanity).",
    "You repaired the drafty insulation around their bedroom sash windows and brewed three pots of nourishing bone broth for {name} (+{relGain}% Closeness, +Sanity).",
    "You spent the Sunday afternoon organizing {name}'s household ledgers and reading old correspondence aloud by lamplight (+{relGain}% Closeness, +Humanity).",
    "You gently bathed {name}'s tired feet in warm salted water and trimmed their brittle nails as they reminisced about vanished decades (+{relGain}% Closeness, +Sanity).",
    "You shoveled snow from {name}'s front porch and chopped a cord of seasoned birch wood to keep their hearth blazing through the frost (+{relGain}% Closeness, +Vitality).",
    "You sat beside {name}'s armchair, spoon-feeding them warm oatmeal and listening patiently as they repeated stories of their youth (+{relGain}% Closeness, +Humanity)."
  ];

  const TALK_LIGHT_POOLS = {
    cold: [
      "You and {name} exchanged three formal sentences regarding municipal tax levies and the cost of coal.",
      "You shared an austere, unbroken silence while the mantel clock ticked rhythmically in the drawing room.",
      "A brief, polite nod was exchanged over the morning broadsheet; neither of you volunteered superfluous chatter.",
      "{name} noted the exact drop in mercury on the barometer, and you offered a precise, respectful agreement.",
      "You discussed the household ledger balance in terse, measured clauses before returning to separate desks.",
      "A cool, composed greeting was traded in the hallway, preserving proper decorum without emotional indulgence."
    ],
    deeply_religious: [
      "You recited a minor vesper verse together in low, solemn tones, watching the rain streak the stained glass.",
      "You discussed the pastor's warnings about worldly temptation and the approaching winter freeze.",
      "A brief murmur of mutual prayer ended the short exchange before {name} resumed their examination of conscience.",
      "You spoke in hushed reverence of the martyrs while candlelight trembled against the iron crucifix.",
      "You and {name} agreed that the city's tribulations are righteous trials meant to test mortal humility.",
      "A quiet benediction was spoken over the threshold before both of you returned to your evening devotions."
    ],
    general: [
      "You and {name} chatted idly about the changing autumn weather and distant sirens echoing through the district.",
      "You exchanged casual neighborhood rumors about the strange tenant residing on the third floor of the tenements.",
      "You shared a brief, comfortable silence watching rain pool on the cracked asphalt outside the window.",
      "You discussed recent radio broadcasts, dock strikes, and municipal road construction near the harbor.",
      "You talked about funny childhood memories, burnt Sunday roasts, and old family recipes passed down in pencil.",
      "You shared a pot of hot black tea, laughing quietly over municipal eccentricities and stray alley cats."
    ]
  };

  const COMPLIMENT_POOLS = {
    revealed: [
      "You whispered that their true abyssal presence commands quiet awe. They let out a purr of electrostatic resonance (+{relGain}% Closeness, +3% Occult).",
      "You admired how seamlessly their disguised joints moved. A flicker of cold satisfaction crossed their eyes (+{relGain}% Closeness).",
      "You complimented the uncanny precision of their shadowed silhouette. A low harmonic vibration hummed through the floorboards (+{relGain}% Closeness, +Occult).",
      "You remarked on the ageless dignity of their gaze. Their pupils dilated across their irises in silent, eldritch acknowledgment (+{relGain}% Closeness).",
      "You commended the perfection with which they mimic mortal breath. A dry, rustling laugh escaped their throat (+{relGain}% Closeness).",
      "You offered quiet praise to the impossible geometry that folds behind their posture (+{relGain}% Closeness, +Occult)."
    ],
    cold_detached: [
      "You complimented {name}'s immaculate decorum and dignified bearing. They adjusted a cufflink with a slight, measured inclination of the head: 'Flattery is unnecessary, but an appreciation of proper standards is noted.' (+{relGain}% Closeness, +3% Smarts)",
      "You praised {name}'s unflinching composure under pressure. They offered a crisp, minimal nod: 'Loss of self-command is the first step toward ruin. Remember that.' (+{relGain}% Closeness, +3% Smarts)",
      "You commended {name}'s analytical intellect. A faint, razor-thin smile crossed their face before they turned back to their ledger (+{relGain}% Closeness, +3% Smarts)",
      "You admired {name}'s impeccable grooming and stately posture. They gave a brief approving glance: 'Appearance reflects internal discipline.' (+{relGain}% Closeness, +3% Smarts)",
      "You noted how {name} never allows sentiment to cloud their judgment. They nodded coolly: 'A rare virtue in a hysterical world.' (+{relGain}% Closeness, +3% Smarts)",
      "You praised {name}'s exquisite taste in classical literature. They touched their book spine with quiet satisfaction (+{relGain}% Closeness, +3% Smarts)"
    ],
    deeply_religious: [
      "You praised {name}'s unwavering piety and devotion. They lowered their gaze in solemn chastisement: 'Give all praise to the Almighty, child; we are merely dust and clay.' (+{relGain}% Closeness, +3% Humanity)",
      "You complimented {name}'s solemn grace during prayer hour. They gripped their rosary: 'May our conduct be worthy of mercy when the final trumpet sounds.' (+{relGain}% Closeness, +3% Humanity)",
      "You told {name} their steadfast faith is an anchor for the whole home. A tear shone in their eye as they whispered a prayer of thanksgiving (+{relGain}% Closeness, +3% Humanity)",
      "You commended {name}'s tireless charity to the parish poor. They bowed their head: 'To whom much trial is given, much duty is required.' (+{relGain}% Closeness, +3% Humanity)",
      "You admired how {name} keeps the commandments without faltering. They whispered: 'The path is narrow and paved with thorns, but heaven watches.' (+{relGain}% Closeness, +3% Humanity)",
      "You praised {name}'s knowledge of sacred scripture. They offered a warm blessing over your forehead (+{relGain}% Closeness, +3% Humanity)"
    ],
    extremely_strict: [
      "You commended {name}'s iron principles and high standards. A razor-thin smirk of approval touched their lips: 'Good. You are beginning to understand why mediocrity is unacceptable.' (+{relGain}% Closeness, +3% Smarts)",
      "You praised {name}'s unyielding work ethic. They nodded firmly: 'Only those who refuse to surrender ever rise above the gutter.' (+{relGain}% Closeness, +3% Smarts)",
      "You admired {name}'s flawless organization and punctual habits. They tapped their watch: 'Precision is the armor of success.' (+{relGain}% Closeness, +3% Smarts)",
      "You commended {name}'s high expectations for the family. They looked you in the eye: 'I demand greatness because this world devours the weak.' (+{relGain}% Closeness, +3% Smarts)",
      "You praised {name}'s decisive leadership in the home. They gave a curt nod of satisfaction (+{relGain}% Closeness, +3% Smarts)",
      "You told {name} that their strict lessons made you stronger. Their eyes softened for a fraction of a second: 'Then my labor was not in vain.' (+{relGain}% Closeness, +3% Smarts)"
    ],
    alcoholic: [
      "You told {name} that you believe in them and love them anyway. Their eyes welled with sudden, messy tears; they turned away toward the sink to wipe their face, deeply shaken: 'You're too good for me, kid.' (+{relGain}% Closeness, +4% Humanity, -2% Sanity)",
      "You complimented {name}'s genuine kindness when the house is quiet. They stared down at their trembling hands and let out a broken sigh: 'I wish I were the parent you deserved.' (+{relGain}% Closeness, +4% Humanity)",
      "You told {name} they have a beautiful soul beneath all the sorrow. They choked back a sob and hugged you with fierce, desperate remorse (+{relGain}% Closeness, +4% Humanity, -1% Sanity)",
      "You praised {name}'s old stories of when they were young and full of dreams. Their face lit up with a fragile, nostalgic warmth (+{relGain}% Closeness, +4% Happiness)",
      "You told {name} that no matter what the neighbors gossip, you will always stand by them. They buried their face in their hands, weeping softly (+{relGain}% Closeness, +4% Humanity)",
      "You gently told {name} they look rested today. A faint, grateful smile touched their weary lips (+{relGain}% Closeness, +4% Happiness)"
    ],
    eccentric_occult: [
      "You praised {name}'s profound esoteric knowledge. A strange, knowing gleam sparked in their eyes: 'The unseen currents hum around you, little seeker. You recognize the true architecture of things.' (+{relGain}% Closeness, +3% Occult)",
      "You admired the rare grimoires and dried botanicals in {name}'s study. They chuckled softly: 'The library of the forgotten holds all true power.' (+{relGain}% Closeness, +3% Occult)",
      "You complimented {name}'s skill in reading celestial portents. They traced a chalk sigil on the desk with a pleased grin (+{relGain}% Closeness, +3% Occult)",
      "You praised the eerie beauty of {name}'s talisman collection. Their eyes glittered with arcane pride (+{relGain}% Closeness, +3% Occult)",
      "You noted how {name} walks without casting an ordinary shadow. They gave an enigmatic, crooked smile (+{relGain}% Closeness, +3% Occult)",
      "You commended {name}'s fearlessness when facing the supernatural. They leaned close: 'Only fools fear the dark; the wise learn its grammar.' (+{relGain}% Closeness, +3% Occult)"
    ],
    religious: [
      "You complimented {name}'s gentle patience and faith. They beamed warmly and touched your shoulder: 'Bless your sweet heart, child. You bring warmth to this home.' (+{relGain}% Closeness, +4% Happiness)",
      "You praised {name}'s kind, forgiving nature toward difficult neighbors. They smiled: 'Mercy is the greatest offering we can make.' (+{relGain}% Closeness, +3% Humanity)",
      "You told {name} their smile makes the whole room brighter. They chuckled and pressed a warm sweet into your hand (+{relGain}% Closeness, +4% Happiness)",
      "You admired how {name} always finds something to be thankful for. They patted your cheek with pure affection (+{relGain}% Closeness, +4% Happiness)",
      "You complimented {name}'s melodious singing during Sunday services. They blushed with modest pleasure (+{relGain}% Closeness, +4% Happiness)",
      "You commended {name}'s steadfast devotion to the family's welfare. They embraced you tenderly (+{relGain}% Closeness, +4% Happiness)"
    ],
    working_class: [
      "You told {name} they are the toughest, hardest working person in the city. They let out a hearty belly laugh, ruffling your hair: 'Someone's gotta keep the coal in the bin!' (+{relGain}% Closeness, +4% Happiness)",
      "You praised {name}'s incredible endurance after long shifts. They grinned with honest pride: 'Honest sweat never hurt anyone with a clean conscience.' (+{relGain}% Closeness, +3% Vitality)",
      "You admired how {name} can repair anything broken in the house with basic tools. They winked: 'A little grease and gumption solves most things.' (+{relGain}% Closeness, +4% Happiness)",
      "You complimented {name}'s steadfast loyalty to their trade union brothers. They nodded with fierce dignity (+{relGain}% Closeness, +3% Vitality)",
      "You told {name} their calloused hands built a good life for the household. They smiled warmly over their evening coffee (+{relGain}% Closeness, +4% Happiness)",
      "You praised {name}'s resilient spirit in hard winters. They clapped your shoulder with sturdy warmth (+{relGain}% Closeness, +3% Vitality)"
    ],
    loving: [
      "You told {name} you admire their unwavering resilience and how hard they work for the family. They looked touched and embraced you warmly (+{relGain}% Closeness, +3% Happiness).",
      "You remarked that {name} makes the drafty house feel like a real sanctuary. A gentle smile broke across their tired face (+{relGain}% Closeness).",
      "You praised their practical wisdom and warm guidance. {name} chuckled softly and thanked you with a kiss on your forehead (+{relGain}% Closeness).",
      "You told {name} that they inspire you every single day. Their eyes misted with happy tears as they hugged you tight (+{relGain}% Closeness, +3% Happiness).",
      "You complimented {name}'s infectious laugh, which always dispels the gloom. They grinned and pulled you into a warm hug (+{relGain}% Closeness).",
      "You told {name} that having them in your life is the greatest gift. They held your hand tenderly with deep affection (+{relGain}% Closeness, +3% Happiness)."
    ]
  };

  function getPrayLine(person, character, relGain, charOccult) {
    const vars = { name: person.name, role: person.role.toLowerCase(), relGain: relGain || 8, city: character.city || 'the city' };
    const pool = (charOccult > 25) ? PRAY_POOLS.occult_burned : PRAY_POOLS.holy;
    return formatLine(pickRandom(pool), vars);
  }

  function getBegPetLine(person, character, granted, pet) {
    const vars = {
      name: person.name,
      role: person.role.toLowerCase(),
      species: pet ? pet.species : 'kitten',
      petName: pet ? pet.name : 'Shadow',
      city: character.city || 'the city'
    };
    if (granted) {
      const pool = pet ? BEG_PET_POOLS.pet_granted : BEG_PET_POOLS.toy_granted;
      return formatLine(pickRandom(pool), vars);
    }
    return formatLine(pickRandom(BEG_PET_POOLS.denied), vars);
  }

  function getDiscussCollegeLine(person, character, relGain) {
    const vars = { name: person.name, role: person.role.toLowerCase(), relGain: relGain || 6, city: character.city || 'the city' };
    return formatLine(pickRandom(DISCUSS_COLLEGE_POOLS), vars);
  }

  function getRequestLoanLine(person, character, granted, formattedAmount) {
    const vars = { name: person.name, role: person.role.toLowerCase(), formattedAmount: formattedAmount || '$1,000', city: character.city || 'the city' };
    const pool = granted ? LOAN_POOLS.granted : LOAN_POOLS.denied;
    return formatLine(pickRandom(pool), vars);
  }

  function getCareElderLine(person, character, relGain) {
    const vars = { name: person.name, role: person.role.toLowerCase(), relGain: relGain || 8, city: character.city || 'the city' };
    return formatLine(pickRandom(ELDER_CARE_POOLS), vars);
  }

  function getTalkLightLine(person, character, relGain) {
    const atmo = (character.kin && character.kin.atmosphere) ? character.kin.atmosphere.id : 'loving';
    const isFamily = person.category === 'family';
    const vars = { name: person.name, role: person.role.toLowerCase(), relGain: relGain || 2, city: character.city || 'the city' };
    let pool = TALK_LIGHT_POOLS.general;
    if (isFamily && atmo === 'cold_detached') pool = TALK_LIGHT_POOLS.cold;
    else if (isFamily && atmo === 'deeply_religious') pool = TALK_LIGHT_POOLS.deeply_religious;
    return formatLine(pickRandom(pool), vars);
  }

  function getComplimentLine(person, character, relGain) {
    const atmo = (character.kin && character.kin.atmosphere) ? character.kin.atmosphere.id : 'loving';
    const vars = { name: person.name, role: person.role.toLowerCase(), relGain: relGain || 5, city: character.city || 'the city' };
    if (person.isRevealed && person.entityType !== 'human') {
      return formatLine(pickRandom(COMPLIMENT_POOLS.revealed), vars);
    }
    const pool = COMPLIMENT_POOLS[atmo] || COMPLIMENT_POOLS.loving;
    return formatLine(pickRandom(pool), vars);
  }

  window.getPrayLine = getPrayLine;
  window.getBegPetLine = getBegPetLine;
  window.getDiscussCollegeLine = getDiscussCollegeLine;
  window.getRequestLoanLine = getRequestLoanLine;
  window.getCareElderLine = getCareElderLine;
  window.getTalkLightLine = getTalkLightLine;
  window.getComplimentLine = getComplimentLine;
})();
