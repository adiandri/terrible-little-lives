// Horror Life Events & Dilemmas for Terrible Little Lives

// Spontaneous one-liner events that happen during normal year progression
const AMBIENT_YEAR_EVENTS = [
  { minAge: 1, maxAge: 3, text: "You woke screaming every time the nursery mirror was uncovered." },
  { minAge: 1, maxAge: 4, text: "The family dog growls whenever it looks directly above your cradle." },
  { minAge: 2, maxAge: 5, text: "You learned to walk early, but only on the balls of your feet without making a sound." },
  { minAge: 4, maxAge: 8, text: "You drew black chalk spirals on the cellar bricks until your knuckles bled." },
  { minAge: 5, maxAge: 9, text: "Your playmate told you there's a second mother sleeping under the garden well." },
  { minAge: 6, maxAge: 11, text: "A severe winter gripped the county. Three neighboring children went into the woods and did not return." },
  { minAge: 7, maxAge: 12, text: "You noticed your reflection in the parlor glass blinked a half-second after you did." },
  { minAge: 8, maxAge: 14, text: "The church bell tolled forty-two times at dusk for an unlisted parishioner." },
  { minAge: 9, maxAge: 15, text: "You found small bird skulls neatly arranged beneath your pillow." },
  { minAge: 10, maxAge: 16, text: "Your teeth itch with a dull, throbbing heat when the moon waxes full." },
  { minAge: 12, maxAge: 18, text: "A traveling phrenologist measured your skull, went deathly pale, and left town without taking payment." },
  { minAge: 13, maxAge: 19, text: "You smell wet earth and burning tallow wherever you walk alone at night." },
  { minAge: 14, maxAge: 21, text: "The town gravedigger tipped his hat to you and said, 'Won't be long now, young one.'" }
];

// Interactive Dilemmas (Popups with choices)
const INTERACTIVE_DILEMMAS = [
  {
    id: "nursery_corner",
    minAge: 2,
    maxAge: 4,
    title: "The Tall Visitor",
    prompt: "At night, a silhouette too tall for the ceiling stands at the foot of your cot, tilting its head sideways.",
    choices: [
      {
        text: "Cry out for your mother.",
        outcome: "Your mother rushes in with a lantern. The shadow snaps into the ceiling corners. She slaps your cheek for hysteria.",
        effects: { sanity: -5, vitality: -2 }
      },
      {
        text: "Offer it your stuffed cloth bear.",
        outcome: "The creature kneels with a dry sound like snapping pine twigs. It accepts the toy. When you wake, the bear is made of dried bone.",
        effects: { sanity: -12, occult: +15, humanity: -5 }
      },
      {
        text: "Pull the rough woolen blanket over your eyes and squeeze tight.",
        outcome: "You hear breath like rattling peas against dry parchment. Hours pass. Morning arrives cold and gray.",
        effects: { sanity: -4 }
      }
    ]
  },
  {
    id: "sunken_well",
    minAge: 5,
    maxAge: 8,
    title: "The Sunken Garden Well",
    prompt: "While playing behind the overgrown carriage house, you find an iron grating covering an old dry well. A voice from within whispers your true birth-name.",
    choices: [
      {
        text: "Peer through the iron bars into the black.",
        outcome: "Two milky eyes stare back from twenty feet below. A hand with too many joints presses against the grate. You scream and wet yourself.",
        effects: { sanity: -18, occult: +8 }
      },
      {
        text: "Whisper back: 'Who are you?'",
        outcome: "The voice replies: 'I am what was left behind when you were brought upstairs.' It gives you an ancient brass token.",
        effects: { sanity: -10, occult: +14, coin: +6 }
      },
      {
        text: "Run back to the house and never speak of it.",
        outcome: "You bolt the back door. That night, wet handprints appear on the exterior stone sill of your room.",
        effects: { sanity: +3, vitality: -2 }
      }
    ]
  },
  {
    id: "yellow_tome",
    minAge: 8,
    maxAge: 12,
    title: "The Locked Study",
    prompt: "Your father left his study key dangling from the brass escutcheon. Inside sits a leather-bound book with locks of coarse hair sewn into the spine.",
    choices: [
      {
        text: "Open the book and decipher the spidery cipher.",
        outcome: "The diagrams depict the anatomy of beings that walk between wall partitions. Your nose begins to bleed, but your mind catches fire with dread understanding.",
        effects: { sanity: -16, occult: +22, vitality: -4 }
      },
      {
        text: "Steal the ivory letter opener from the mahogany desk.",
        outcome: "You slip the sharp ivory relic into your coat. A heavy coldness settles into your ribcage.",
        effects: { coin: +10, humanity: -5 }
      },
      {
        text: "Lock the door and drop the key where he left it.",
        outcome: "You walk away. Yet for days, you hear pages turning by themselves behind the heavy oak panel.",
        effects: { sanity: +4 }
      }
    ]
  },
  {
    id: "fever_consumption",
    minAge: 9,
    maxAge: 14,
    title: "The Gray Spasm",
    prompt: "A coughing sickness sweeps through the settlement. Your throat fills with black phlegm and your skin turns the color of curdled milk. The town leeches offer little hope.",
    choices: [
      {
        text: "Let the traveling plague doctor bleed you with copper cups.",
        outcome: "The cups fill with sluggish, foul-smelling grease. The fever breaks, but your veins feel forever hollow and chilled.",
        effects: { vitality: -20, sanity: +5, coin: -8 }
      },
      {
        text: "Drink the bitter concoction offered by the village crone in the marsh.",
        outcome: "You swallow liquid that smells of hemlock and stagnant pond. Your stomach convulsions violently, but by sunrise you are breathing clear.",
        effects: { vitality: +15, humanity: -12, occult: +10 }
      },
      {
        text: "Pray on your knees before the family shrine until dawn.",
        outcome: "No answer comes. You vomit black bile through the morning. The fever burns your lungs scarred and weak.",
        effects: { vitality: -35, sanity: -8 }
      }
    ]
  },
  {
    id: "cemetery_dare",
    minAge: 12,
    maxAge: 16,
    title: "A Midnight Dare",
    prompt: "The parish orphans dare you to spend midnight locked inside the crypt of Lord Malgrave—a man rumored to have been buried face-down with an iron stake through his boots.",
    choices: [
      {
        text: "Accept the dare and lock yourself inside.",
        outcome: "Behind the limestone sarcophagus, something sighs with dry lungs. You find a silver mourning ring slipped off a mummified finger.",
        effects: { sanity: -14, occult: +12, coin: +15, humanity: -6 }
      },
      {
        text: "Refuse the dare and suffer their ridicule.",
        outcome: "They pelt you with rotten turnips and call you a coward. Your dignity stings, but you sleep in a warm bed.",
        effects: { sanity: -2, vitality: -4 }
      },
      {
        text: "Search the grave digger's open pit nearby instead.",
        outcome: "You discover fresh spade marks and an empty pine box with the lid shattered outward from the inside.",
        effects: { sanity: -15, occult: +18 }
      }
    ]
  },
  {
    id: "the_stranger_carriage",
    minAge: 14,
    maxAge: 18,
    title: "The Black Carriage",
    prompt: "A windowless black carriage pulls up alongside the country lane. A gloved hand extends a velvet coin purse. 'A quiet task in the mortuary basement tonight,' a gravel voice rasps. 'Ten sovereigns for an hour of discretion.'",
    choices: [
      {
        text: "Accept the purse and climb inside.",
        outcome: "You spend an hour holding an oil lantern while they sew lead weights inside a dead man's chest. Your hands reek of embalming salt.",
        effects: { coin: +35, humanity: -20, sanity: -10, occult: +8 }
      },
      {
        text: "Decline and back away with your hand on your pocketknife.",
        outcome: "The driver sneers. The carriage rattles away, leaving sulfur and crushed violet in the road mud.",
        effects: { sanity: +5 }
      },
      {
        text: "Report the carriage to the parish constable.",
        outcome: "The constable listens in silence, then closes his ledger. 'Forget you saw that carriage, child, if you value your lungs.'",
        effects: { sanity: -8, occult: +6 }
      }
    ]
  },
  {
    id: "attic_séance",
    minAge: 15,
    maxAge: 19,
    title: "The Planchette Session",
    prompt: "A group of older youths light three black beeswax candles in an abandoned tannery loft and bring out an ivory planchette on a board of cursed walnut wood.",
    choices: [
      {
        text: "Place your index finger upon the ivory planchette.",
        outcome: "The wood screams across the board with violent speed, spelling out the exact year of your doom before snapping into splinters.",
        effects: { sanity: -22, occult: +25, humanity: -8 }
      },
      {
        text: "Watch from the shadows near the stairs.",
        outcome: "The candle flames turn blue. One girl begins speaking in a voice like wet stones grinding together. You flee into the night.",
        effects: { sanity: -8, occult: +10 }
      },
      {
        text: "Blow out the candles and break the circle.",
        outcome: "A sudden freezing gust throws you against the timber wall. Bruised and shivering, you put an end to the blasphemy.",
        effects: { vitality: -12, sanity: +8, humanity: +10 }
      }
    ]
  }
];

window.GAME_DATA = {
  AMBIENT_YEAR_EVENTS,
  INTERACTIVE_DILEMMAS
};
