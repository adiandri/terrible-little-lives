// Modern Era Horror Life Events & Dilemmas for Terrible Little Lives

const AMBIENT_YEAR_EVENTS = [
  { minAge: 1, maxAge: 3, text: "The smart baby monitor camera in your nursery kept rotating on its motorized swivel to stare at the empty ceiling corner." },
  { minAge: 1, maxAge: 4, text: "Your parents replaced the Alexa smart speaker after it kept whispering someone's name through static at 3:14 AM." },
  { minAge: 2, maxAge: 5, text: "You refused to enter the bathroom whenever the LED mirror backlight turned on." },
  { minAge: 4, maxAge: 7, text: "You drew black chalk spirals on your bedroom iPad screen until the digitizer glass cracked under your nails." },
  { minAge: 5, maxAge: 9, text: "A neighborhood kid told you that the construction site across the avenue dug up a concrete box wrapped in rusted chains." },
  { minAge: 6, maxAge: 11, text: "An emergency phone alert sounded at midnight across the entire district, but the notification text was just a string of unrendered unicode glyphs." },
  { minAge: 7, maxAge: 12, text: "You noticed your front-facing phone camera auto-focus box kept locking onto an invisible point two inches behind your head." },
  { minAge: 8, maxAge: 14, text: "A severe cold snap froze the municipal water pipes. Neighbors reported black, oily water that smelled of copper coming out of the taps." },
  { minAge: 9, maxAge: 15, text: "You found three dead sparrows lined up with surgical precision on the external air conditioning compressor unit." },
  { minAge: 10, maxAge: 16, text: "Your smartphone battery drains from 100% to 0% in three seconds every time you walk under the municipal railway overpass." },
  { minAge: 12, maxAge: 18, text: "A school counselor called your parents after you wrote an essay detailing what lives underneath the subway third rail." },
  { minAge: 13, maxAge: 20, text: "You smell ozone and burning damp tallow whenever you take the late-night commuter train home alone." },
  { minAge: 15, maxAge: 22, text: "An anonymous Discord account added you to a server with zero members and a single voice channel transmitting the sound of laboured underwater breathing." }
];

const INTERACTIVE_DILEMMAS = [
  {
    id: "nursery_smart_cam",
    minAge: 2,
    maxAge: 4,
    title: "The Static Broadcast",
    prompt: "At 2:40 AM, your bedroom smart speaker turns on. A synthetic, garbled voice speaks through the speaker grille: 'Child in the blue blanket. Do not turn around.'",
    choices: [
      {
        text: "Scream at the top of your lungs for your parents.",
        outcome: "Your dad storms in and unplugs the router. He assumes it was a neighborhood hacker, but his hands tremble.",
        effects: { sanity: -6, happiness: -5 }
      },
      {
        text: "Turn around and look into the darkness.",
        outcome: "A silhouette with limbs like bent aluminum pipes is crouched atop your wardrobe. You black out and wake up with a severe nosebleed.",
        effects: { sanity: -18, occult: +15, vitality: -5, shillings: +2 }
      },
      {
        text: "Hide under your weighted blanket and recite the alphabet backwards.",
        outcome: "The speaker lets out a mechanical sigh like escaping steam. Silence returns, but the room smells of burnt plastic.",
        effects: { sanity: -4, happiness: -2 }
      }
    ]
  },
  {
    id: "subway_third_rail",
    minAge: 6,
    maxAge: 9,
    title: "The Track Collector",
    prompt: "While waiting for the commuter train with your mother, you drop your toy onto the subway tracks. Down in the tunnel darkness, a figure in a fluorescent vest crawls along the ties with four knees.",
    choices: [
      {
        text: "Point at the tunnel and yell 'Look, mom!'",
        outcome: "Your mother yanks your arm roughly and stares into her phone. 'Stop looking at track workers,' she snaps, though the platform was totally empty.",
        effects: { sanity: -5, happiness: -4 }
      },
      {
        text: "Stare into the tunnel without blinking.",
        outcome: "The crawling figure pauses. It reaches into its grease-stained pocket and tosses a tarnished blackened silver coin onto the platform edge.",
        effects: { sanity: -14, occult: +16, shillings: +5, humanity: -4 }
      },
      {
        text: "Look away immediately and hold your breath.",
        outcome: "The train roars in with screeching brakes. The cold draft smells of sulfur and old hair.",
        effects: { sanity: +3, happiness: +2 }
      }
    ]
  },
  {
    id: "airdrop_intruder",
    minAge: 11,
    maxAge: 14,
    title: "Unknown AirDrop Request",
    prompt: "While doing homework in your locked bedroom, your smartphone lights up with an AirDrop notification from 'Device_Null': a photo showing you from inside your own closet.",
    choices: [
      {
        text: "Accept the transfer and open the photo file.",
        outcome: "The image is high-resolution. Between the hanging coats, two pale humanoid eyes reflect the camera flash. EXIF data says it was taken 12 seconds ago.",
        effects: { sanity: -22, occult: +18, vitality: -4 }
      },
      {
        text: "Immediately kick the closet door shut and wedge your desk chair under the knob.",
        outcome: "Something slams heavily against the inside of the door once, making the wood creak. Then absolute silence.",
        effects: { sanity: -10, vitality: +5, happiness: -8 }
      },
      {
        text: "Turn off Bluetooth and run to your parents' bedroom.",
        outcome: "Your parents search the closet. Nothing is there except your winter coats and a handful of wet salt on the floor.",
        effects: { sanity: -5, happiness: -3 }
      }
    ]
  },
  {
    id: "darkweb_leak",
    minAge: 14,
    maxAge: 17,
    title: "The Encrypted Forum Link",
    prompt: "An anonymous direct message on Telegram links to a hidden .onion forum called 'The Ashen Ledger'. They are offering 50 Shillings for a vial of fresh blood from a living teenager.",
    choices: [
      {
        text: "Use a sterile diabetic lancet, fill a vial, and mail it to the PO Box.",
        outcome: "Three days later, an unmarked padded envelope arrives in your locker containing five heavy blackened silver coins. A cold ache throbs in your sternum.",
        effects: { shillings: +50, humanity: -18, vitality: -10, occult: +20 }
      },
      {
        text: "Reply with the local police department's IP address.",
        outcome: "The user sends back a video stream of your front porch taken five minutes ago. Your screen glitched with static.",
        effects: { sanity: -16, happiness: -12 }
      },
      {
        text: "Delete Telegram and factory reset your phone.",
        outcome: "You lose all your photos and chat history, but you sleep without the phone buzzing in your drawer.",
        effects: { sanity: +5, money: -50 }
      }
    ]
  },
  {
    id: "elevator_sub_basement",
    minAge: 16,
    maxAge: 20,
    title: "Floor B-7",
    prompt: "Returning to your apartment building at 1:15 AM, the elevator digital panel flickers. It bypasses the ground floor and descends past the parking levels, chiming softly as the display reads: 'B-7'. The doors slide open to a flooded tiled corridor.",
    choices: [
      {
        text: "Step out into the ankle-deep black water to explore.",
        outcome: "You find rusted hospital gurneys and a brass safety deposit box. Inside sits a pristine occult ledger and wet currency.",
        effects: { sanity: -25, occult: +30, shillings: +85, money: +400, humanity: -10 }
      },
      {
        text: "Frantically mash the 'Door Close' and 'Floor 1' buttons.",
        outcome: "The doors hesitate, catching on something soft before snapping shut. The elevator groans and shoots back to the lobby.",
        effects: { sanity: -8, vitality: -2 }
      },
      {
        text: "Take a flash photo and send it to your building manager.",
        outcome: "The building manager calls you within two minutes, his voice terrified: 'Delete that photo right now and don't speak to anyone about it.'",
        effects: { sanity: -12, occult: +10 }
      }
    ]
  },
  {
    id: "hospital_er_blackout",
    minAge: 18,
    maxAge: 23,
    title: "The Unregistered Patient",
    prompt: "You're in the city hospital waiting room when the power cuts out. Emergency red lights blink on. An orderly in blood-stained scrubs offers you an envelope of cash and shillings to help him wheel a sealed steel gurney into the morgue lift.",
    choices: [
      {
        text: "Take the money and push the gurney.",
        outcome: "Whatever is inside the body bag is warm, breathing irregularly, and speaks your birth date as the elevator descends. You wash your hands for an hour.",
        effects: { money: +800, shillings: +35, humanity: -20, sanity: -15 }
      },
      {
        text: "Refuse and sprint for the illuminated fire exit.",
        outcome: "You burst into the rainy street. Behind you, the hospital alarm sirens begin their slow, wailing cycle.",
        effects: { sanity: +4, vitality: -5 }
      },
      {
        text: "Notify the armed security guards at the front desk.",
        outcome: "The guards exchange silent glances, lock the glass doors, and tell you that room 104 is off-limits tonight.",
        effects: { sanity: -10, occult: +12 }
      }
    ]
  },
  {
    id: "sleepover_basement_lock",
    minAge: 7,
    maxAge: 12,
    title: "The Locked Cellar Door",
    prompt: "During a Friday night sleepover at a friend's suburban house, the heavy wooden cellar door begins thudding softly at 2:15 AM in slow, three-beat intervals. Your friend whispers: 'Ignore it. My dad says it's just the old water pipes settling.'",
    choices: [
      {
        text: "Creep down the dark hallway and inspect the cellar keyhole.",
        outcome: "You peer through the brass keyhole. An unblinking yellow eye is looking back at you from three inches away. You stifle a shriek and retreat to your sleeping bag.",
        effects: { sanity: -15, occult: +12, happiness: -6 }
      },
      {
        text: "Slide an envelope of sea salt across the cellar threshold.",
        outcome: "The thudding instantly halts. A low, appreciative hiss echoes through the floorboards. The next morning, two antique coins sit outside the door.",
        effects: { sanity: -4, occult: +15, shillings: +4, humanity: -2 }
      },
      {
        text: "Pull the blankets over your head and wait for morning.",
        outcome: "You don't sleep a wink until dawn filters through the venetian blinds. The kitchen smells of burnt lard.",
        effects: { sanity: -3, happiness: -4 }
      }
    ]
  },
  {
    id: "school_bully_hallway",
    minAge: 9,
    maxAge: 14,
    title: "Behind the Gymnasium Bleachers",
    prompt: "The school bully, a burly kid named Trent, corners you behind the gym equipment cages and demands all your lunch money and your digital watch.",
    choices: [
      {
        text: "Surrender your cash and walk away quietly.",
        outcome: "Trent sneers, snatches your bills, and pushes you against the wall. You go without hot lunch for three days.",
        effects: { money: -25, happiness: -12, sanity: -4 }
      },
      {
        text: "Call out to your companion who has been watching silently.",
        outcome: "Your friend steps from the shadows. Their jaw clicks awkwardly as their gaze unmoors the bully's nerve. Trent turns ash-pale, drops his own wallet, and flees sobbing.",
        effects: { money: +40, happiness: +10, occult: +8, humanity: -4 }
      },
      {
        text: "Fight back with all your strength.",
        outcome: "You land a solid punch to his nose, but take a bruised rib in return. The principal suspends both of you for two days.",
        effects: { vitality: -8, happiness: -4, smarts: +2 }
      }
    ]
  },
  {
    id: "three_eared_stray",
    minAge: 6,
    maxAge: 11,
    title: "The Creature in the Culvert",
    prompt: "A scruffy black cat with three distinct ears and a crooked spine follows you home from school. When it purrs, the digital time on your wrist quartz watch jumps backwards by four minutes.",
    choices: [
      {
        text: "Smuggle the cat into your bedroom and feed it tuna fish.",
        outcome: "The creature sleeps at the foot of your bed, purring in odd frequencies. Your fever breaks, and nightmares no longer wake you.",
        effects: { vitality: +10, sanity: +8, happiness: +12, occult: +6 }
      },
      {
        text: "Shrewdly check its collar for identification.",
        outcome: "Attached to its flea collar is a weathered tin tag engraved with your family's home address—dated 1968, before your house was built.",
        effects: { sanity: -12, occult: +14, shillings: +3 }
      },
      {
        text: "Shoo the animal away with a broom.",
        outcome: "The cat stares at you with calm, human-like contempt, turns on three joints, and vanishes into the storm sewer.",
        effects: { happiness: -2 }
      }
    ]
  },
  {
    id: "playground_dare",
    minAge: 8,
    maxAge: 13,
    title: "The Oxidized Fountain",
    prompt: "Classmates gather around the corroded bronze drinking fountain at the edge of the school athletic field. Black mineral sludge bubbles from the spigot. 'A dollar if you drink it,' someone dares.",
    choices: [
      {
        text: "Take a deep gulp of the metallic black water.",
        outcome: "It tastes of zinc, iron, and burnt sugar. Your vision sharpens with unearthly lucidity, though violent stomach cramps keep you home for two days.",
        effects: { vitality: -12, smarts: +8, occult: +14, shillings: +2, money: +10 }
      },
      {
        text: "Collect a sample in an empty plastic water bottle.",
        outcome: "The liquid glows faint indigo when held under a blue smartphone light. You keep it hidden in your sock drawer.",
        effects: { occult: +8, smarts: +4, shillings: +1 }
      },
      {
        text: "Tell them they're all idiots and walk to class.",
        outcome: "They mock you as a coward, but none of them are brave enough to drink it either.",
        effects: { happiness: -3, sanity: +4 }
      }
    ]
  },
  {
    id: "attic_parchment_mortgage",
    minAge: 12,
    maxAge: 16,
    title: "The Covenant in the Insulation",
    prompt: "While looking for old holiday decorations in the attic crawlspace, you find an iron lockbox. Inside is your family home's original deed, but written beneath your father's signature is a second agreement inked in dark dried blood.",
    choices: [
      {
        text: "Carefully photograph every clause of the blood deed.",
        outcome: "The contract covenants the first-born child of the house to 'The Pale Warden of the Reservoir' upon their 21st year in exchange for thirty years of solvent mortgages.",
        effects: { sanity: -18, occult: +20, smarts: +6 }
      },
      {
        text: "Confront your parents directly at dinner.",
        outcome: "Your father's fork clatters against his plate. He turns pale as salt, confiscates the box, and locks the attic trapdoor with heavy padlocks.",
        effects: { sanity: -8, happiness: -10 }
      },
      {
        text: "Steal the antique wax seal and coins from the bottom of the box.",
        outcome: "You pocket eight heavy blackened shillings and replace the deed. Your hands smell of sulfur for days.",
        effects: { shillings: +8, humanity: -6, money: +80 }
      }
    ]
  },
  {
    id: "birthday_unknown_benefactor",
    minAge: 10,
    maxAge: 15,
    title: "The Package with No Postmark",
    prompt: "On your birthday, an unmarked wooden music box wrapped in brown butcher paper arrives on the front porch with your name written in calligraphic script. There is no return address.",
    choices: [
      {
        text: "Wind the brass key and listen to the melody.",
        outcome: "The cylinder plucks out a chilling, beautiful lullaby. As the chime ends, a secret drawer springs open revealing cash and a carved ivory pendant.",
        effects: { happiness: +10, money: +150, shillings: +5, occult: +10 }
      },
      {
        text: "Hand it over to your parents immediately.",
        outcome: "Your mother looks terrified upon recognizing the box's brass fittings. She refuses to speak of it and hides it in her cedar trunk.",
        effects: { sanity: -4, happiness: -4 }
      },
      {
        text: "Pawn the music box at the antique exchange down the block.",
        outcome: "The elderly pawnbroker's eyes widen. He hands you three times the standard appraisal value and closes his shop early.",
        effects: { money: +350, humanity: -2 }
      }
    ]
  },
  {
    id: "school_fire_drill_fog",
    minAge: 13,
    maxAge: 18,
    title: "The Alarm in the Fog",
    prompt: "During an unscheduled 1:30 PM fire drill, the entire student body is evacuated onto the football field. A dense, unnatural yellow fog rolls in from the highway. In the distance, two towering silhouettes walk along the tree line.",
    choices: [
      {
        text: "Slip away from the faculty line and investigate the tree line.",
        outcome: "You find footprints in the wet mud as large as bathtubs, filled with boiling black water. You retrieve an abandoned surveyor's transit and shillings.",
        effects: { occult: +18, sanity: -12, shillings: +10, vitality: -4 }
      },
      {
        text: "Keep your classmates calm and stay with the homeroom group.",
        outcome: "The teachers hustle everyone back inside as sirens echo from the city center. Nobody speaks about the silhouettes.",
        effects: { sanity: +4, humanity: +4 }
      },
      {
        text: "Take a video and upload it to social media.",
        outcome: "Your post gains 40,000 views within ten minutes before the video is abruptly wiped and your account is shadowbanned.",
        effects: { looks: +4, happiness: +6, sanity: -6 }
      }
    ]
  }
];

window.AMBIENT_YEAR_EVENTS = AMBIENT_YEAR_EVENTS;
window.INTERACTIVE_DILEMMAS = INTERACTIVE_DILEMMAS;
window.GAME_DATA = {
  AMBIENT_YEAR_EVENTS,
  INTERACTIVE_DILEMMAS
};

