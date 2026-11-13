// Pets, Exotics & Mythic Familiars Engine for Terrible Little Lives
// Expanded breeds, exotic keeper permit mechanics, real pet stats, and species-specific activities

(function() {
  'use strict';

  // --- Temperaments ---
  const PET_TEMPERAMENTS = [
    { id: 'guardian', label: 'Stoic Guardian', desc: 'Alert to intruders and protective in crises.' },
    { id: 'curious', label: 'Magpie-Curious', desc: 'Snoses into corners and recovers lost curios.' },
    { id: 'soothing', label: 'Hearth-Soothing', desc: 'Steadies household nerves during dark winters.' },
    { id: 'proud', label: 'Proud Aristocrat', desc: 'Commands attention and demands immaculate care.' },
    { id: 'nocturnal', label: 'Nocturnal Watcher', desc: 'Most active between midnight and dawn.' },
    { id: 'volatile', label: 'Untamed Impulse', desc: 'High energy; requires firm obedience or stimulation.' }
  ];

  // --- 1. Domestic Breeds & Varieties (27 Templates across Dogs, Cats, Birds, Small & Reptiles) ---
  const MUNDANE_PET_TEMPLATES = [
    // DOGS (8 Breeds)
    {
      id: 'dog_mutt',
      species: 'Loyal Street Mutt',
      breedGroup: 'Canine · Mixed Breed',
      animalGroup: 'dog',
      icon: 'dog',
      category: 'mundane',
      diet: 'Kibble & Scraps',
      costUSD: 45,
      annualCostUSD: 180,
      lifespan: 14,
      desc: 'A scruffy, weather-hardened mix with warm amber eyes and fierce devotion.',
      quirks: [
        'Growls softly at locked cellar doors whenever rain hits the gutter.',
        'Rests its heavy chin across your ankles during nightmares.',
        'Learns the sound of your footsteps three flights down.'
      ]
    },
    {
      id: 'dog_doberman',
      species: 'Doberman Pinscher',
      breedGroup: 'Canine · Guard Breed',
      animalGroup: 'dog',
      icon: 'shield',
      category: 'mundane',
      diet: 'High-Protein Meat & Chow',
      costUSD: 420,
      annualCostUSD: 480,
      lifespan: 12,
      obedienceBonus: 12,
      desc: 'Sleek, black-and-tan sentinel bred for razor focus and home defense.',
      quirks: [
        'Patrols every windowsill silently before you go to sleep.',
        'Freezes in place whenever footsteps linger near your apartment door.',
        'Maintains unbroken eye contact until given a hand signal.'
      ]
    },
    {
      id: 'dog_borzoi',
      species: 'Borzoi Sighthound',
      breedGroup: 'Canine · Aristocrat',
      animalGroup: 'dog',
      icon: 'sparkles',
      category: 'mundane',
      diet: 'Lean Cuts & Dry Ration',
      costUSD: 680,
      annualCostUSD: 520,
      lifespan: 12,
      desc: 'Long-snouted, silk-coated Russian sighthound with unsettling aristocratic stillness.',
      quirks: [
        'Drifts down misty avenues like a pale grey ghost on a leather lead.',
        'Fixes guests with a stare long enough to make liars fidget.',
        'Naps folded neatly across velvet chairs like an heirloom rug.'
      ]
    },
    {
      id: 'dog_bloodhound',
      species: 'Bloodhound Tracker',
      breedGroup: 'Canine · Scent Hound',
      animalGroup: 'dog',
      icon: 'search',
      category: 'mundane',
      diet: 'Hearty Hound Ration',
      costUSD: 360,
      annualCostUSD: 390,
      lifespan: 11,
      desc: 'Wrinkled-brow scent tracker capable of following cold trails across rain-slick cobblestones.',
      quirks: [
        'Sniffs every envelope delivered to the door for unfamiliar ink.',
        'Bays once when someone new steps onto the street corner.',
        'Unearths lost pocket change and buried keys along fences.'
      ]
    },
    {
      id: 'dog_deerhound',
      species: 'Scottish Deerhound',
      breedGroup: 'Canine · Giant Hound',
      animalGroup: 'dog',
      icon: 'dog',
      category: 'mundane',
      diet: 'Bulk Meat & Bone Broth',
      costUSD: 540,
      annualCostUSD: 580,
      lifespan: 10,
      desc: 'Towering, wire-haired gentle giant that treats small apartments like Highland moors.',
      quirks: [
        'Takes up an entire sofa with a single contented sigh.',
        'Steps firmly between you and aggressive strangers at dusk.',
        'Watches distant fog banks with mournful dignity.'
      ]
    },
    {
      id: 'dog_chihuahua',
      species: 'Applehead Chihuahua',
      breedGroup: 'Canine · Toy Sentinel',
      animalGroup: 'dog',
      icon: 'bell',
      category: 'mundane',
      diet: 'Small-Breed Toy Bites',
      costUSD: 190,
      annualCostUSD: 160,
      lifespan: 17,
      desc: 'Four pounds of trembling wrath and undying loyalty tucked inside a wool coat pocket.',
      quirks: [
        'Shivers violently unless wrapped in heated laundry.',
        'Barks fearlessly at streetlamps, sirens, and six-foot strangers.',
        'Guards your pillow like a dragon perched on gold.'
      ]
    },
    {
      id: 'dog_pug',
      species: 'Black Pug',
      breedGroup: 'Canine · Companion',
      animalGroup: 'dog',
      icon: 'smile',
      category: 'mundane',
      diet: 'Gentle Digestive Kibble',
      costUSD: 280,
      annualCostUSD: 340,
      lifespan: 13,
      desc: 'Velvet-black pug whose wheezing snores fill lonely rooms with comical warmth.',
      quirks: [
        'Sounds like a boiling kettle whenever you open the pantry.',
        'Follows you from room to room with theatrical sighs.',
        'Refuses to step onto damp pavement without dramatic protest.'
      ]
    },
    {
      id: 'dog_dachshund',
      species: 'Wirehaired Dachshund',
      breedGroup: 'Canine · Burrow Hound',
      animalGroup: 'dog',
      icon: 'footprints',
      category: 'mundane',
      diet: 'Standard Kibble',
      costUSD: 220,
      annualCostUSD: 240,
      lifespan: 15,
      desc: 'Stubborn badger-hunter that treats floorboards, sofas, and flowerbeds as excavation sites.',
      quirks: [
        'Digs earnestly behind radiator pipes as if something lives there.',
        'Burrows beneath bedspreads until only a nose remains visible.',
        'Proudly presents dead beetles and stray screws at breakfast.'
      ]
    },

    // CATS (7 Breeds)
    {
      id: 'cat_shorthair',
      species: 'Domestic Shorthair',
      breedGroup: 'Feline · Alley Mouser',
      animalGroup: 'cat',
      icon: 'cat',
      category: 'mundane',
      diet: 'Fish Flakes & Pate',
      costUSD: 35,
      annualCostUSD: 130,
      lifespan: 16,
      desc: 'Sleek municipal tabby with quiet paws and sharp instincts around drafty baseboards.',
      quirks: [
        'Tracks invisible dust motes across empty corners with unblinking eyes.',
        'Sleeps curled across your bedroom threshold every night.',
        'Drops small brass screws on the rug instead of mice.'
      ]
    },
    {
      id: 'cat_sphynx',
      species: 'Sphynx (Hairless)',
      breedGroup: 'Feline · Warm Gremlin',
      animalGroup: 'cat',
      icon: 'cat',
      category: 'mundane',
      diet: 'High-Calorie Feline Feast',
      costUSD: 520,
      annualCostUSD: 310,
      lifespan: 14,
      desc: 'Velvet-wrinkled, hairless gargoyle that radiates furnace heat and demands knitted sweaters.',
      quirks: [
        'Perches directly on your shoulders like an anxious clay imp.',
        'Leaves faint warm grease prints on window glass.',
        'Sits upright beside open textbooks while you study late.'
      ]
    },
    {
      id: 'cat_maine_coon',
      species: 'Maine Coon',
      breedGroup: 'Feline · Hearth Lion',
      animalGroup: 'cat',
      icon: 'cat',
      category: 'mundane',
      diet: 'Rich Poultry & Broth',
      costUSD: 440,
      annualCostUSD: 320,
      lifespan: 15,
      desc: 'Massive tufted-ear cat with a ruff like storm clouds and a chirp instead of a meow.',
      quirks: [
        'Washes its paws in drinking glasses before tasting the water.',
        'Keeps winter chills at bay simply by sprawling across your chest.',
        'Escorts visitors down the hallway with silent suspicion.'
      ]
    },
    {
      id: 'cat_bombay',
      species: 'Black Bombay',
      breedGroup: 'Feline · Parlor Panther',
      animalGroup: 'cat',
      icon: 'moon',
      category: 'mundane',
      diet: 'Dark Meat & Kibble',
      costUSD: 260,
      annualCostUSD: 190,
      lifespan: 16,
      desc: 'Copper-eyed obsidian cat that disappears completely against unlit floorboards.',
      quirks: [
        'Turns neighbors superstitious whenever it sits cleanly on the gatepost.',
        'Purrs loudest during thunder and power outages.',
        'Stares steadily at mirrors long after you leave the bathroom.'
      ]
    },
    {
      id: 'cat_siamese',
      species: 'Seal-Point Siamese',
      breedGroup: 'Feline · Vocal Oracle',
      animalGroup: 'cat',
      icon: 'cat',
      category: 'mundane',
      diet: 'Select Feline Fillet',
      costUSD: 310,
      annualCostUSD: 220,
      lifespan: 16,
      desc: 'Sapphire-eyed conversationalist that holds sharp opinions on every guest you invite over.',
      quirks: [
        'Yowls a harsh three-note warning whenever dishonest visitors speak.',
        'Unlatches cupboard doors purely to inspect their emptiness.',
        'Answers every sigh you utter with a scolding trill.'
      ]
    },
    {
      id: 'cat_persian',
      species: 'Silver Persian',
      breedGroup: 'Feline · Salon Aristocrat',
      animalGroup: 'cat',
      icon: 'crown',
      category: 'mundane',
      diet: 'Gourmet Tin & Cream',
      costUSD: 490,
      annualCostUSD: 380,
      lifespan: 15,
      desc: 'Flat-faced silver cloud of fur that tolerates mortals who brush it on schedule.',
      quirks: [
        'Sheds silver halo tufts over black mourning coats.',
        'Sits strictly on folded silk or freshly ironed shirts.',
        'Blinks slowly like a bored judge presiding over municipal court.'
      ]
    },
    {
      id: 'cat_scottish_fold',
      species: 'Scottish Fold',
      breedGroup: 'Feline · Owl-Eared',
      animalGroup: 'cat',
      icon: 'heart',
      category: 'mundane',
      diet: 'Tender Pate',
      costUSD: 340,
      annualCostUSD: 240,
      lifespan: 14,
      desc: 'Round-faced, folded-ear comfort cat whose quiet companionship eases heavy dread.',
      quirks: [
        'Sits back on its haunches like a small melancholic owl.',
        'Kneads your sleeve gently whenever your pulse climbs.',
        'Naps tucked neatly under your chin without making a sound.'
      ]
    },

    // BIRDS (6 Species)
    {
      id: 'bird_crow',
      species: 'Tamed Black Crow',
      breedGroup: 'Avian · Corvid Scavenger',
      animalGroup: 'bird',
      icon: 'feather',
      category: 'mundane',
      diet: 'Seeds, Nuts & Scraps',
      costUSD: 35,
      annualCostUSD: 70,
      lifespan: 20,
      desc: 'Sharp-eyed city corvid rescued with a splinted wing that hoards metal trinkets.',
      quirks: [
        'Lines tarnished copper coins and keys neatly along the windowsill.',
        'Caws three sharp notes whenever someone steps onto the porch.',
        'Mimics the click of deadbolts with uncanny precision.'
      ]
    },
    {
      id: 'bird_raven',
      species: 'Pied Scholar Raven',
      breedGroup: 'Avian · High Corvid',
      animalGroup: 'bird',
      icon: 'feather',
      category: 'mundane',
      diet: 'Meat Strips & Walnuts',
      costUSD: 210,
      annualCostUSD: 140,
      lifespan: 28,
      desc: 'Heavy-beaked midnight corvid capable of solving latches and imitating whispered names.',
      quirks: [
        'Turns pages of unattended books using its curved black beak.',
        'Croaks a gravelly "nevermore" only when you drop a glass.',
        'Brings dull old buttons retrieved from graveyard hedgerows.'
      ]
    },
    {
      id: 'bird_parrot',
      species: 'African Grey Parrot',
      breedGroup: 'Avian · Mimic Savant',
      animalGroup: 'bird',
      icon: 'message-circle',
      category: 'mundane',
      diet: 'Orchard Pellets & Fruit',
      costUSD: 580,
      annualCostUSD: 260,
      lifespan: 45,
      desc: 'Astonishingly clever grey parrot that remembers arguments years after humans forget.',
      quirks: [
        'Repeats embarrassing family secrets in the exact voice of their speaker.',
        'Whistles ambulance sirens whenever the room turns tense.',
        'Demands walnuts before offering polite greetings.'
      ]
    },
    {
      id: 'bird_owl',
      species: 'Barn Owl',
      breedGroup: 'Avian · Nocturnal Raptor',
      animalGroup: 'bird',
      icon: 'eye',
      category: 'mundane',
      diet: 'Mice & Fresh Poultry',
      costUSD: 320,
      annualCostUSD: 280,
      lifespan: 18,
      desc: 'Heart-faced white raptor whose flight is dead silent even in narrow hallways.',
      quirks: [
        'Rotates its pale face 180 degrees whenever floorboards creak behind you.',
        'Swallows pests silently and leaves neat pellets beside boots.',
        'Only wakes fully once streetlights flicker on.'
      ]
    },
    {
      id: 'bird_canary',
      species: 'Coal-Mine Canary',
      breedGroup: 'Avian · Hazard Sentinel',
      animalGroup: 'bird',
      icon: 'music',
      category: 'mundane',
      diet: 'Millet & Canary Seed',
      costUSD: 40,
      annualCostUSD: 55,
      lifespan: 10,
      desc: 'Bright saffron songbird prized by old miners for sensing stale air and hidden poison.',
      quirks: [
        'Breaks into urgent trills whenever gas leaks or damp rot spread.',
        'Sings bright morning scales even in dreary tenement winters.',
        'Hops furiously against cage bars when tainted air drifts inside.'
      ]
    },
    {
      id: 'bird_cockatoo',
      species: 'Sulphur Cockatoo',
      breedGroup: 'Avian · Chaotic Crest',
      animalGroup: 'bird',
      icon: 'zap',
      category: 'mundane',
      diet: 'Tropical Seed & Veg',
      costUSD: 450,
      annualCostUSD: 290,
      lifespan: 50,
      desc: 'Loud, crest-flaring white parrot with bolt-cutter beak and toddler-level emotional needs.',
      quirks: [
        'Dances violently to rainstorms while shredding cardboard boxes.',
        'Screams like a haunted steam whistle if ignored for too long.',
        'Unscrews cabinet hinges out of sheer boredom.'
      ]
    },

    // SMALL MAMMALS, REPTILES & AQUATICS (6 Species)
    {
      id: 'small_ferret',
      species: 'Albino Ferret',
      breedGroup: 'Mustelid · Pipe Runner',
      animalGroup: 'small_reptile',
      icon: 'squirrel',
      category: 'mundane',
      diet: 'Poultry Paste & Carnivore Kibble',
      costUSD: 65,
      annualCostUSD: 110,
      lifespan: 9,
      desc: 'Hyperactive snow-white noodle thief that stashes loose change inside sofa linings.',
      quirks: [
        'Darts into radiator vents and emerges wearing cobwebs.',
        'Sleeps curled deeply inside coat pockets while you walk.',
        'Builds secret hoards of thimbles, silver coins, and socks.'
      ]
    },
    {
      id: 'reptile_corn_snake',
      species: 'Copper Corn Snake',
      breedGroup: 'Reptile · Docile Serpent',
      animalGroup: 'small_reptile',
      icon: 'disc',
      category: 'mundane',
      diet: 'Thawed Pinky Mice',
      costUSD: 55,
      annualCostUSD: 75,
      lifespan: 19,
      desc: 'Calm, ember-patterned serpent that weaves peacefully through warm fingers.',
      quirks: [
        'Flicks its tongue over handwritten letters as if tasting secrets.',
        'Coils motionless around your wrist while you read.',
        'Sheds translucent parchment skins whole every few months.'
      ]
    },
    {
      id: 'reptile_ball_python',
      species: 'Obsidian Ball Python',
      breedGroup: 'Reptile · Quiet Constrictor',
      animalGroup: 'small_reptile',
      icon: 'circle-dot',
      category: 'mundane',
      diet: 'Small Rodents',
      costUSD: 120,
      annualCostUSD: 110,
      lifespan: 26,
      desc: 'Heavy-bodied midnight python that curls into a calm, warm knot around restless hands.',
      quirks: [
        'Fasts stubbornly unless its moss hide stays misted to perfection.',
        'Rests quietly across your collarbone during evening radio broadcasts.',
        'Periscopes softly toward shadows moving under doors.'
      ]
    },
    {
      id: 'small_rabbit',
      species: 'Dutch Lop Rabbit',
      breedGroup: 'Lagomorph · Hearth Bunny',
      animalGroup: 'small_reptile',
      icon: 'heart',
      category: 'mundane',
      diet: 'Timothy Hay & Greens',
      costUSD: 50,
      annualCostUSD: 95,
      lifespan: 10,
      desc: 'Velvet-eared black-and-white rabbit that thumps warnings against midnight footsteps.',
      quirks: [
        'Thumps one hind foot sharply whenever someone lies near the hutch.',
        'Nibbles stray telephone cords if left unsupervised.',
        'Flops sideways onto warm rugs in sudden dramatic naps.'
      ]
    },
    {
      id: 'reptile_tarantula',
      species: 'Goliath Tarantula',
      breedGroup: 'Arachnid · Terrarium Oddity',
      animalGroup: 'small_reptile',
      icon: 'bug',
      category: 'mundane',
      diet: 'Crickets & Roaches',
      costUSD: 85,
      annualCostUSD: 50,
      lifespan: 18,
      desc: 'Velvet-leg amber spider that turns nosy guests pale on first sight.',
      quirks: [
        'Weaves ghostly silk carpets across cork bark after midnight.',
        'Sits utterly motionless for days before teleporting in silence.',
        'Clears unwanted suitors and gossips out of your parlor within seconds.'
      ]
    },
    {
      id: 'aquatic_moor',
      species: 'Black Moor Goldfish',
      breedGroup: 'Aquatic · Contemplative Bowl',
      animalGroup: 'small_reptile',
      icon: 'droplets',
      category: 'mundane',
      diet: 'Sinking Bloodworm Flakes',
      costUSD: 25,
      annualCostUSD: 45,
      lifespan: 11,
      desc: 'Velvet-black telescope-eyed goldfish turning slow ink circles under desk lamp glow.',
      quirks: [
        'Gathers bubbles along the glass rim whenever storms gather.',
        'Stares solemnly with bulbous ink eyes while you balance ledgers.',
        'Calms frayed nerves through pure silent repetition.'
      ]
    }
  ];

  // --- 2. Exotic Menagerie & Black-Market Specimens (10 Templates) ---
  const EXOTIC_PET_TEMPLATES = [
    // LICENSED / LEGAL EXOTICS (5)
    {
      id: 'exotic_fennec',
      species: 'Fennec Desert Fox',
      breedGroup: 'Exotic Canid · Licensed',
      animalGroup: 'exotic_legal',
      icon: 'flame',
      category: 'exotic',
      contraband: false,
      diet: 'Insects, Poultry & Fruit',
      costUSD: 1400,
      annualCostUSD: 620,
      lifespan: 13,
      desc: 'Lantern-eared sand fox with frantic dusk sprints and velvet cream fur.',
      quirks: [
        'Swivels giant ears toward whispers three rooms away.',
        'Buries brass earrings neatly beneath potted ferns.',
        'Draws crowds of admirers whenever spotted in a carrier.'
      ]
    },
    {
      id: 'exotic_gliders',
      species: 'Sugar Glider Pair',
      breedGroup: 'Marsupial · Colony Pair',
      animalGroup: 'exotic_legal',
      icon: 'wind',
      category: 'exotic',
      contraband: false,
      diet: 'Nectar, Mealworms & Fruit',
      costUSD: 650,
      annualCostUSD: 340,
      lifespan: 12,
      desc: 'Two pocket-sized gliding marsupials that chirp softly inside flannel pouches.',
      quirks: [
        'Sail noiselessly from bookshelves straight onto your collar.',
        'Bark like tiny wind-up toys at 2:00 AM until fed apple slices.',
        'Refuse to leave your scarf during bleak autumn commutes.'
      ]
    },
    {
      id: 'exotic_monitor',
      species: 'Savannah Monitor Lizard',
      breedGroup: 'Exotic Reptile · Armored',
      animalGroup: 'exotic_legal',
      icon: 'shield',
      category: 'exotic',
      contraband: false,
      diet: 'Whole Prey, Eggs & Crabs',
      costUSD: 780,
      annualCostUSD: 680,
      lifespan: 16,
      desc: 'Heavy-clawed, slate-scaled prehistorian that patrols warm floorboards like a small dinosaur.',
      quirks: [
        'Hisses like leaking steam pipes if startled before warming up.',
        'Sheds tough armored scales sought after by curious apothecaries.',
        'Follows meat tongs with frighteningly clever precision.'
      ]
    },
    {
      id: 'exotic_capuchin',
      species: 'Capuchin Monkey',
      breedGroup: 'Exotic Primate · Clever Thief',
      animalGroup: 'exotic_legal',
      icon: 'hand',
      category: 'exotic',
      contraband: false,
      diet: 'Nuts, Fresh Produce & Mash',
      costUSD: 2800,
      annualCostUSD: 1100,
      lifespan: 34,
      desc: 'Nimble-fingered primate capable of unlocking latches, turning pages, and lifting loose wallets.',
      quirks: [
        'Unscrews medicine jars just to see what rattles inside.',
        'Picks lint—and occasionally pocket watches—off unsuspecting guests.',
        'Throws tantrums if denied nightly puzzle boxes.'
      ]
    },
    {
      id: 'exotic_lynx',
      species: 'Siberian Lynx',
      breedGroup: 'Exotic Feline · Tufted Stalker',
      animalGroup: 'exotic_legal',
      icon: 'cat',
      category: 'exotic',
      contraband: false,
      diet: 'Prime Raw Venison & Fowl',
      costUSD: 3200,
      annualCostUSD: 1550,
      lifespan: 16,
      desc: 'Snow-pawed wildcat with ink-tipped ear tufts that treats municipal ordinances with contempt.',
      quirks: [
        'Leaps silently onto top wardrobes to survey every doorway.',
        'Drops cold winter silence into any argument the moment it growls.',
        'Tears heavy rope toys apart in three deliberate minutes.'
      ]
    },

    // CONTRABAND / HIGH-RISK EXOTICS (5)
    {
      id: 'exotic_wolf',
      species: 'Gray Timber Wolf',
      breedGroup: 'Contraband Apex · Pack Alpha',
      animalGroup: 'exotic_contraband',
      icon: 'shield-alert',
      category: 'exotic',
      contraband: true,
      diet: 'Raw Butcher Cuts & Marrow',
      costUSD: 2600,
      annualCostUSD: 1800,
      lifespan: 13,
      desc: 'Yellow-eyed forest predator raised from an illicit trapline; fiercely loyal only to one packmate.',
      quirks: [
        'Clears hostile debt collectors off the porch without barking once.',
        'Paces the perimeter fence whenever fog rolls off the river.',
        'Tests authority if obedience slips below firm discipline.'
      ]
    },
    {
      id: 'exotic_viper',
      species: 'Gaboon Bush Viper',
      breedGroup: 'Contraband Venomous · Lethal',
      animalGroup: 'exotic_contraband',
      icon: 'skull',
      category: 'exotic',
      contraband: true,
      diet: 'Live Rats & Quail',
      costUSD: 1650,
      annualCostUSD: 520,
      lifespan: 15,
      desc: 'Velvet-geometric ambush viper housing two-inch fangs and lucrative neurotoxic venom.',
      quirks: [
        'Vanishes motionless among autumn-colored leaf litter.',
        'Underworld apothecaries pay handsomely for carefully milked vials.',
        'One clumsy slip during cleaning can turn fatal.'
      ]
    },
    {
      id: 'exotic_croc',
      species: 'Nile Crocodile Hatchling',
      breedGroup: 'Contraband Reptile · River Maw',
      animalGroup: 'exotic_contraband',
      icon: 'waves',
      category: 'exotic',
      contraband: true,
      diet: 'Whole Fish & Raw Meats',
      costUSD: 1200,
      annualCostUSD: 1350,
      lifespan: 45,
      desc: 'Armored river sovereign smuggled inside a crate; outgrows bathtubs with terrifying speed.',
      quirks: [
        'Rests half-submerged in flooded basement basins watching heels.',
        'Bellows deep sub-bass rumbles that rattle porcelain dishes.',
        'Inspires sheer dread among municipal housing inspectors.'
      ]
    },
    {
      id: 'exotic_panther',
      species: 'Black Leopard (Panther)',
      breedGroup: 'Contraband Apex · Midnight Cat',
      animalGroup: 'exotic_contraband',
      icon: 'moon',
      category: 'exotic',
      contraband: true,
      diet: 'Whole Carcass Cuts',
      costUSD: 5200,
      annualCostUSD: 2600,
      lifespan: 15,
      desc: 'Smuggled melanistic leopard whose rosette spots appear only beneath direct noon sunlight.',
      quirks: [
        'Moves through dark hallways like liquid ink given muscle.',
        'Turns heads across the entire city—and guarantees gossip.',
        'Requires iron obedience to remain harmless around visitors.'
      ]
    },
    {
      id: 'exotic_eagle_owl',
      species: 'Eurasian Eagle-Owl',
      breedGroup: 'Contraband Raptor · Night Sovereign',
      animalGroup: 'exotic_contraband',
      icon: 'feather',
      category: 'exotic',
      contraband: true,
      diet: 'Rabbits & Whole Prey',
      costUSD: 1950,
      annualCostUSD: 780,
      lifespan: 28,
      desc: 'Six-foot-wingspan nocturnal monarch with fiery orange eyes and iron talons.',
      quirks: [
        'Hunts roof rats and stray nocturnal prowlers across neighboring blocks.',
        'Glares down from high rafters with ancient imperial disdain.',
        'Fetches bizarre midnight trophies from parklands.'
      ]
    }
  ];

  // --- 3. Supernatural & Mythic Familiars (13 Templates: Real Mythology + Original Horrors) ---
  const SUPERNATURAL_PET_TEMPLATES = [
    // REAL-WORLD MYTHOLOGY (7)
    {
      id: 'black_shuck',
      species: 'Black Shuck (Barghest)',
      mythOrigin: 'English Folklore · Real Mythology',
      animalGroup: 'supernatural',
      mythicClass: 'mythology',
      icon: 'flame',
      category: 'supernatural',
      diet: 'Charred Marrow & Grave Dust',
      costShillings: 12,
      annualCostUSD: 40,
      lifespan: 70,
      desc: 'Massive coal-coated churchyard hound whose single saucer eye smolders like dying forge embers.',
      quirks: [
        'Bays silently outside locked doors to scatter hostile muggers and curses.',
        'Leaves scorched paw-prints that smell faintly of wet peat and sulfur.',
        'Lowers the temperature of any threshold where malice lingers.'
      ],
      omen: 'Stray dogs across three blocks lay flat on their bellies as it passed.',
      powerName: 'Soul-Hound Ward',
      powerDesc: 'Patrols the night threshold to purge threats, boost Vitality & retrieve grave Shillings.'
    },
    {
      id: 'cat_sith',
      species: 'Cat Sìth (Fairy Feline)',
      mythOrigin: 'Celtic / Scottish Myth · Real Mythology',
      animalGroup: 'supernatural',
      mythicClass: 'mythology',
      icon: 'cat',
      category: 'supernatural',
      diet: 'Silver-Bowled Cream & Tea',
      costShillings: 10,
      annualCostUSD: 30,
      lifespan: 95,
      desc: 'Arch-backed obsidian feline bearing a crisp white medallion across its chest and old fairy bargains.',
      quirks: [
        'Walks upright on two paws whenever nobody looks directly at it.',
        'Laps warm milk strictly from silver saucers left beside the hearth.',
        'Blesses respectful keepers with hidden shillings—yet remembers every slight.'
      ],
      omen: 'Nine burnt matches arranged themselves beside the saucer overnight.',
      powerName: 'Sìth Hearth Blessing',
      powerDesc: 'Bestows ancient fairy fortune (+Shillings & Happiness) when well-fed and honored.'
    },
    {
      id: 'kitsune_bi',
      species: 'Kitsune-bi (Foxfire Kit)',
      mythOrigin: 'Japanese Folklore · Real Mythology',
      animalGroup: 'supernatural',
      mythicClass: 'mythology',
      icon: 'sparkles',
      category: 'supernatural',
      diet: 'Fried Tofu & Lantern Spark',
      costShillings: 14,
      annualCostUSD: 50,
      lifespan: 120,
      desc: 'Silver-russet fox kit balancing a pale blue will-o\'-the-wisp flame cleanly above its brush.',
      quirks: [
        'Sprouts subtle phantom tail shadows as its resonance climbs.',
        'Barks sharply whenever a disguised entity speaks in your presence.',
        'Warms frozen fingertips without burning paper or silk.'
      ],
      omen: 'Its pale tail-fire cast two distinct shadows on opposing walls.',
      powerName: 'Foxfire Veil-Piercing',
      powerDesc: 'Unmasks hidden Mimics/Entities among acquaintances or sharpens Illusion/Looks.'
    },
    {
      id: 'tsuchinoko',
      species: 'Tsuchinoko / Lindworm Wyrmling',
      mythOrigin: 'Japanese & Germanic Myth · Real Mythology',
      animalGroup: 'supernatural',
      mythicClass: 'mythology',
      icon: 'coins',
      category: 'supernatural',
      diet: 'Honeyed Wine & Copper Coins',
      costShillings: 9,
      annualCostUSD: 20,
      lifespan: 80,
      desc: 'Squat, horned treasure-serpent that snores inside velvet violin cases and hoards tarnished silver.',
      quirks: [
        'Rolls sideways like a weighted hoop when startled by thunder.',
        'Sheds iridescent scales that municipal pawnshops mistake for antique gold.',
        'Swallows dropped buttons only to cough up older minted coins.'
      ],
      omen: 'A strange metallic chime echoed inside its empty cedar box.',
      powerName: 'Scale-Hoard Transmutation',
      powerDesc: 'Sheds lucky treasure scales—yielding local currency and Paranormal Shillings.'
    },
    {
      id: 'huginn_kin',
      species: 'Huginn-Kin (Valravn Crow)',
      mythOrigin: 'Norse Mythology · Real Mythology',
      animalGroup: 'supernatural',
      mythicClass: 'mythology',
      icon: 'feather',
      category: 'supernatural',
      diet: 'Inkwell Drops & Raw Heart',
      costShillings: 11,
      annualCostUSD: 25,
      lifespan: 110,
      desc: 'Oil-iridescent war-crow whose tongue drips wet black ink and whispers dead men\'s gossip.',
      quirks: [
        'Taps secret initials into dust along mirror frames.',
        'Follows rivals through fog to memorize where they hide.',
        'Speaks single sharp warnings in dead dialects.'
      ],
      omen: 'Feathers shed onto your pillow dried into legible cipher runes.',
      powerName: 'Valravn Whisper-Flight',
      powerDesc: 'Spies across the city to grant Smarts, Occult insight, and street intelligence.'
    },
    {
      id: 'domovoi',
      species: 'Domovoi (Hearth-Kin)',
      mythOrigin: 'Slavic Folklore · Real Mythology',
      animalGroup: 'supernatural',
      mythicClass: 'mythology',
      icon: 'home',
      category: 'supernatural',
      diet: 'Warm Bread, Salt & Porridge',
      costShillings: 8,
      annualCostUSD: 0,
      lifespan: 150,
      desc: 'Palm-sized bearded hearth spirit wearing wool scraps, living happily behind kitchen radiators.',
      quirks: [
        'Tightens loose floorboards and mends frayed shoelaces overnight.',
        'Braid-tangles neglected pet fur if bread and salt go unoffered.',
        'Rattles soup spoons whenever bad weather or bailiffs approach.'
      ],
      omen: 'A saucer of fresh salt was neatly swept into a protective circle by morning.',
      powerName: 'Hearth-Kin Mending',
      powerDesc: 'Repairs misfortune, eases Sanity & Vitality strain, and guards domestic shelter.'
    },
    {
      id: 'cerberus_whelp',
      species: 'Cerberus Hound-Whelp',
      mythOrigin: 'Greek Mythology · Real Mythology',
      animalGroup: 'supernatural',
      mythicClass: 'mythology',
      icon: 'shield-check',
      category: 'supernatural',
      diet: 'Honey Cakes & Smoked Ribs',
      costShillings: 16,
      annualCostUSD: 90,
      lifespan: 100,
      desc: 'Three-headed black terrier pup whose middle head naps peacefully while the outer two argue.',
      quirks: [
        'Requires three collars—yet somehow tangles only one leash.',
        'Licks tears away with three different warm tongues during grief.',
        'Growls at open hospital doors when death draws near.'
      ],
      omen: 'All six eyes locked onto the basement drain at precisely 3:00 AM.',
      powerName: 'Three-Maw Threshold Watch',
      powerDesc: 'Stands guard between sleep and death, restoring Sanity & guarding Vitality.'
    },

    // COMPLETELY ORIGINAL TLL HORRORS (6)
    {
      id: 'porcelain_lapdog',
      species: 'The Porcelain Lapdog',
      mythOrigin: 'Terrible Little Lives · Original Entity',
      animalGroup: 'supernatural',
      mythicClass: 'original',
      icon: 'heart-crack',
      category: 'supernatural',
      diet: 'Warm Candlewax & Rainwater',
      costShillings: 9,
      annualCostUSD: 0,
      lifespan: 99,
      desc: 'Cracked bisque-china spaniel whose painted glass eyes blink slowly and weep warm tallow when scratched.',
      quirks: [
        'Hairline fractures widen silently whenever misfortune misses you.',
        'Rattles like cold teacups when picked up, yet weighs like sleeping muscle.',
        'Refuses to face away from locked closets.'
      ],
      omen: 'A fresh hairline crack appeared along its glazed snout overnight.',
      powerName: 'Fracture Absolution',
      powerDesc: 'Takes an active Curse or Ailment fracture onto its china body to shield its keeper.'
    },
    {
      id: 'static_moths',
      species: 'Static Moth Choir',
      mythOrigin: 'Terrible Little Lives · Original Entity',
      animalGroup: 'supernatural',
      mythicClass: 'original',
      icon: 'radio',
      category: 'supernatural',
      diet: 'Dried Lavender & Moonlight',
      costShillings: 6,
      annualCostUSD: 10,
      lifespan: 40,
      desc: 'Seven violet-winged moths sealed in an apothecary jar whose wings hum tomorrow\'s dead frequencies.',
      quirks: [
        'Arrange themselves into eye silhouettes whenever someone lies.',
        'Harmonize faintly with broken transistor radios during blackouts.',
        'Glow pale indigo when hidden shillings lie nearby.'
      ],
      omen: 'The moths spelled a three-digit number in wing-dust against the glass.',
      powerName: 'Tomorrow\'s Frequency',
      powerDesc: 'Tunes into static signals to reveal hidden Shillings, Occult lore & mental focus.'
    },
    {
      id: 'hollow_hound',
      species: 'Hollow-Coat Hound',
      mythOrigin: 'Terrible Little Lives · Original Entity',
      animalGroup: 'supernatural',
      mythicClass: 'original',
      icon: 'ghost',
      category: 'supernatural',
      diet: 'Cold Tea & Grave Fog',
      costShillings: 10,
      annualCostUSD: 0,
      lifespan: 80,
      desc: 'Weightless translucent greyhound knitted from winter rain and rib-shaped mist.',
      quirks: [
        'Leaves faint frost ferns across hardwood planks where it curls.',
        'Passes cleanly through bedroom doors without waiting for knobs.',
        'Smells faintly of petrichor and cold church brass.'
      ],
      omen: 'Your hallway mirror reflected two silent hounds standing beside you.',
      powerName: 'Veil-Scent Hunt',
      powerDesc: 'Tracks unseen anomalies to expose Mimics or dig up buried Shillings.'
    },
    {
      id: 'brass_magpie',
      species: 'Brass-Tongue Magpie',
      mythOrigin: 'Terrible Little Lives · Original Entity',
      animalGroup: 'supernatural',
      mythicClass: 'original',
      icon: 'key-round',
      category: 'supernatural',
      diet: 'Watch Oil & Silver Filings',
      costShillings: 11,
      annualCostUSD: 15,
      lifespan: 90,
      desc: 'Featherless clockwork-boned corvid whose hinged brass beak clicks out lock combinations in morse.',
      quirks: [
        'Ticks rhythmically inside its chest whenever money changes hands.',
        'Drops skeleton keys of houses that haven\'t been built yet.',
        'Polishes copper coins until your face bends strangely inside them.'
      ],
      omen: 'It spat a damp antique 1913 silver dime neatly onto your ledger.',
      powerName: 'Cipher-Beak Retrieval',
      powerDesc: 'Clicks open forgotten caches—bringing substantial cash and Paranormal Shillings.'
    },
    {
      id: 'velvet_limpet',
      species: 'Velvet Limpet (Whisper-Snail)',
      mythOrigin: 'Terrible Little Lives · Original Entity',
      animalGroup: 'supernatural',
      mythicClass: 'original',
      icon: 'eye',
      category: 'supernatural',
      diet: 'Damp Moss & Prick of Blood',
      costShillings: 7,
      annualCostUSD: 5,
      lifespan: 60,
      desc: 'Fist-sized pearl-shelled garden snail that writes legible silver trails across mirror glass after midnight.',
      quirks: [
        'Leaves tiny mathematical theorems etched in drying silver slime.',
        'Nuzzles fingertips softly before demanding one faint drop of warmth.',
        'Hums a low bell tone when occult rituals succeed.'
      ],
      omen: 'Mirror frost spelled a warning not to trust Thursday\'s courier.',
      powerName: 'Silver Script Bargain',
      powerDesc: 'Trades a trace of Vitality for a potent surge of Occult knowledge & Smarts.'
    },
    {
      id: 'pendulum_cat',
      species: 'Pendulum Cat (Chrono-Tabby)',
      mythOrigin: 'Terrible Little Lives · Original Entity',
      animalGroup: 'supernatural',
      mythicClass: 'original',
      icon: 'clock',
      category: 'supernatural',
      diet: 'Black Coffee Drops & Sardines',
      costShillings: 13,
      annualCostUSD: 25,
      lifespan: 99,
      desc: 'Brindled velvet tabby whose tail swings strictly 60 beats per minute like a grandfather clock.',
      quirks: [
        'Stops ticking only when someone in the house holds their breath.',
        'Purring in steady 60-BPM rhythm arrests spiralling panic.',
        'Rewinds dropped coins to land strictly heads-up.'
      ],
      omen: 'Every clock in the apartment stopped except its swinging tail.',
      powerName: 'Metronome Stasis',
      powerDesc: 'Stabilizes frayed nerves with steady temporal purrs (+Sanity & +Happiness).'
    }
  ];

  const ALL_PET_TEMPLATES = [
    ...MUNDANE_PET_TEMPLATES,
    ...EXOTIC_PET_TEMPLATES,
    ...SUPERNATURAL_PET_TEMPLATES
  ];

  const PET_NAMES = [
    'Barnaby', 'Ophelia', 'Salem', 'Mortimer', 'Spindle', 'Corvus',
    'Grimm', 'Bramble', 'Lucian', 'Pebble', 'Cinder', 'Hesper',
    'Wednesday', 'Balthazar', 'Thistle', 'Nyx', 'Obsidian', 'Soot',
    'Gargoyle', 'Echo', 'Moth', 'Bones', 'Whisper', 'Gulliver',
    'Vesper', 'Onyx', 'Marrow', 'Sable', 'belladonna', 'Caspian'
  ];

  function getCountryMultiplier(character) {
    const country = (character && window.COUNTRIES_DATA && window.COUNTRIES_DATA[character.countryCode])
      || (window.COUNTRIES_DATA && window.COUNTRIES_DATA.USA)
      || { wageMultiplier: 1.0 };
    return country.wageMultiplier || 1.0;
  }

  function findPetTemplate(pet) {
    if (!pet) return null;
    if (pet.templateId) {
      const byId = ALL_PET_TEMPLATES.find(t => t.id === pet.templateId);
      if (byId) return byId;
    }
    return ALL_PET_TEMPLATES.find(t => t.species === pet.species) || null;
  }

  // Ensure legacy or freshly generated pets have the full stat schema
  function ensurePetStats(pet) {
    if (!pet) return null;
    const tpl = findPetTemplate(pet);
    if (!pet.templateId && tpl) pet.templateId = tpl.id;
    if (!pet.animalGroup) pet.animalGroup = tpl ? tpl.animalGroup : (pet.category === 'supernatural' ? 'supernatural' : 'dog');
    if (!pet.breedGroup) pet.breedGroup = tpl ? tpl.breedGroup : (pet.category === 'supernatural' ? 'Occult Familiar' : 'Domestic Companion');
    if (!pet.mythOrigin && tpl && tpl.mythOrigin) pet.mythOrigin = tpl.mythOrigin;
    if (!pet.mythicClass && tpl && tpl.mythicClass) pet.mythicClass = tpl.mythicClass;
    if (!pet.diet) pet.diet = tpl ? tpl.diet : 'Standard Rations';
    if (pet.contraband === undefined) pet.contraband = tpl ? !!tpl.contraband : false;
    if (!pet.powerName && tpl && tpl.powerName) pet.powerName = tpl.powerName;
    if (!pet.powerDesc && tpl && tpl.powerDesc) pet.powerDesc = tpl.powerDesc;

    if (typeof pet.health !== 'number') pet.health = 90;
    if (typeof pet.affection !== 'number') pet.affection = 70;
    if (typeof pet.hunger !== 'number') pet.hunger = 20;
    if (typeof pet.enrichment !== 'number') pet.enrichment = 75;
    if (typeof pet.obedience !== 'number') pet.obedience = tpl && tpl.obedienceBonus ? Math.min(100, 55 + tpl.obedienceBonus) : (pet.category === 'exotic' ? 40 : 58);
    if (typeof pet.supernaturalBond !== 'number') pet.supernaturalBond = pet.category === 'supernatural' ? 60 : 0;
    if (typeof pet.wildness !== 'number') pet.wildness = pet.category === 'exotic' ? (pet.contraband ? 68 : 42) : 0;
    if (!pet.temperament) {
      const temp = window.getRandomElement ? window.getRandomElement(PET_TEMPERAMENTS) : PET_TEMPERAMENTS[0];
      pet.temperament = temp;
    }
    if (!pet.actionsDone || typeof pet.actionsDone !== 'object') {
      pet.actionsDone = {};
    }
    if (pet.powerUsedThisYear === undefined) pet.powerUsedThisYear = false;
    if (!Array.isArray(pet.learnedPhrases)) pet.learnedPhrases = [];
    if (typeof pet.smuggled !== 'boolean') pet.smuggled = false;
    return pet;
  }

  function generatePetFromTemplate(template, character = null) {
    const rawName = window.getRandomElement ? window.getRandomElement(PET_NAMES) : 'Barnaby';
    const name = rawName.charAt(0).toUpperCase() + rawName.slice(1);
    const mult = getCountryMultiplier(character);
    const temp = window.getRandomElement ? window.getRandomElement(PET_TEMPERAMENTS) : PET_TEMPERAMENTS[0];
    const startObedience = template.category === 'exotic'
      ? Math.floor(Math.random() * 20) + 32
      : Math.floor(Math.random() * 25) + 48 + (template.obedienceBonus || 0);

    return {
      id: 'pet_' + Date.now() + '_' + Math.floor(Math.random() * 10000),
      templateId: template.id,
      name,
      species: template.species,
      breedGroup: template.breedGroup,
      animalGroup: template.animalGroup,
      mythOrigin: template.mythOrigin || null,
      mythicClass: template.mythicClass || null,
      type: template.category,
      category: template.category,
      contraband: !!template.contraband,
      diet: template.diet || 'Standard Rations',
      icon: template.icon,
      age: template.category === 'supernatural' ? Math.floor(Math.random() * 3) : 0,
      maxAge: template.lifespan + Math.floor(Math.random() * 5) - 2,
      alive: true,
      deathCause: null,
      health: Math.floor(Math.random() * 16) + 84,
      affection: Math.floor(Math.random() * 22) + 60,
      hunger: Math.floor(Math.random() * 18) + 12,
      enrichment: Math.floor(Math.random() * 20) + 70,
      obedience: Math.min(100, startObedience),
      supernaturalBond: template.category === 'supernatural' ? Math.floor(Math.random() * 25) + 55 : 0,
      wildness: template.category === 'exotic' ? (template.contraband ? 68 : 42) : 0,
      temperament: temp,
      costLocal: Math.round((template.costUSD || 0) * mult),
      costShillings: template.costShillings || 0,
      annualCostLocal: Math.round((template.annualCostUSD || 0) * mult),
      desc: template.desc,
      quirk: window.getRandomElement ? window.getRandomElement(template.quirks) : template.quirks[0],
      omen: template.omen || null,
      powerName: template.powerName || null,
      powerDesc: template.powerDesc || null,
      powerUsedThisYear: false,
      learnedPhrases: [],
      smuggled: false,
      actionsDone: {}
    };
  }

  function generateRandomPet(category = 'mundane', character = null, subFilter = 'all') {
    let pool = category === 'supernatural'
      ? SUPERNATURAL_PET_TEMPLATES
      : (category === 'exotic' ? EXOTIC_PET_TEMPLATES : MUNDANE_PET_TEMPLATES);

    if (subFilter && subFilter !== 'all') {
      const sub = pool.filter(t => t.animalGroup === subFilter || t.mythicClass === subFilter);
      if (sub.length > 0) pool = sub;
    }

    const template = window.getRandomElement ? window.getRandomElement(pool) : pool[0];
    return generatePetFromTemplate(template, character);
  }

  function generatePetCatalogBatch(character = null) {
    const pickUnique = (templates, count) => {
      const copy = [...templates];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy.slice(0, count).map(t => generatePetFromTemplate(t, character));
    };

    // Domestic mix ensures variety across Dogs, Cats, Birds, Small/Reptile
    const dogs = pickUnique(MUNDANE_PET_TEMPLATES.filter(t => t.animalGroup === 'dog'), 2);
    const cats = pickUnique(MUNDANE_PET_TEMPLATES.filter(t => t.animalGroup === 'cat'), 2);
    const birds = pickUnique(MUNDANE_PET_TEMPLATES.filter(t => t.animalGroup === 'bird'), 2);
    const smalls = pickUnique(MUNDANE_PET_TEMPLATES.filter(t => t.animalGroup === 'small_reptile'), 2);

    // Exotics mix: legal + contraband
    const legalExotics = pickUnique(EXOTIC_PET_TEMPLATES.filter(t => !t.contraband), 3);
    const contrabandExotics = pickUnique(EXOTIC_PET_TEMPLATES.filter(t => t.contraband), 2);

    // Supernatural mix: Real-world mythology + Original TLL horrors
    const mythPets = pickUnique(SUPERNATURAL_PET_TEMPLATES.filter(t => t.mythicClass === 'mythology'), 3);
    const origPets = pickUnique(SUPERNATURAL_PET_TEMPLATES.filter(t => t.mythicClass === 'original'), 3);

    return {
      mundane: [...dogs, ...cats, ...birds, ...smalls],
      exotic: [...legalExotics, ...contrabandExotics],
      supernatural: [...mythPets, ...origPets]
    };
  }

  function getExoticPermitCost(character) {
    return Math.round(1200 * getCountryMultiplier(character));
  }

  function checkPetAdoptionEligibility(pet, character, allowSmuggle = false) {
    if (!pet || !character) return { allowed: false, reason: 'Unavailable.' };
    ensurePetStats(pet);
    const fmt = (amt) => window.formatMoney ? window.formatMoney(amt, character.countryCode) : `$${amt}`;
    const livingPets = (character.pets || []).filter(p => p.alive !== false).length;
    if (livingPets >= 6) {
      return { allowed: false, reason: 'Household at capacity (max 6 living companions).' };
    }
    if (character.institution && character.institution.active) {
      return { allowed: false, reason: 'Cannot keep companions while confined.' };
    }

    const housing = character.housing || (character.age < 18 ? 'family_home' : 'tenement_apartment');
    if (pet.category === 'exotic') {
      if (housing === 'homeless' || housing === 'squalor_room') {
        return { allowed: false, reason: 'Requires stable tenement or family housing for exotic containment.' };
      }
      if (!character.exoticPermit && !allowSmuggle) {
        return {
          allowed: false,
          needsPermit: true,
          canSmuggle: true,
          reason: pet.contraband
            ? 'Contraband specimen (No Exotic Permit — must obtain permit or smuggle)'
            : 'Requires Exotic Keeper Permit (or illegal broker deal)'
        };
      }
    } else if (housing === 'homeless' && (pet.animalGroup === 'dog' || pet.animalGroup === 'cat')) {
      return { allowed: false, reason: 'Cannot house larger domestic breeds while homeless.' };
    }

    const effectiveCost = allowSmuggle && !character.exoticPermit
      ? Math.round((pet.costLocal || 0) * 1.15)
      : (pet.costLocal || 0);

    if (effectiveCost > 0 && (character.money || 0) < effectiveCost) {
      return { allowed: false, reason: `Needs ${fmt(effectiveCost)}.` };
    }
    if (pet.costShillings > 0 && (character.shillings || 0) < pet.costShillings) {
      return { allowed: false, reason: `Needs ${pet.costShillings} s.` };
    }
    if (pet.category === 'supernatural') {
      const occ = (character.stats && character.stats.occult) || 0;
      if (occ < 12) {
        return { allowed: false, reason: `Requires 12% Occult (${occ}%).` };
      }
    }

    return { allowed: true, effectiveCost };
  }

  function purchaseExoticPermit(character) {
    if (!character) return { success: false, reason: 'No active mortal record.' };
    if (character.exoticPermit) {
      return { success: false, reason: 'You already hold a valid Municipal Exotic Keeper Permit.' };
    }
    if (character.age < 16) {
      return { success: false, reason: 'Municipal permits require applicants to be at least Age 16.' };
    }
    const cost = getExoticPermitCost(character);
    if ((character.money || 0) < cost) {
      const fmt = window.formatMoney ? window.formatMoney(cost, character.countryCode) : `$${cost}`;
      return { success: false, reason: `An Exotic Keeper Permit costs ${fmt}.` };
    }
    character.money -= cost;
    character.exoticPermit = true;
    return {
      success: true,
      title: 'Exotic Keeper Permit Issued',
      message: `Municipal Clerks stamped your Exotic Keeper Permit after inspecting containment blueprints. You can now house exotic species legally.`,
      effects: { money: -cost, happiness: 3 }
    };
  }

  function applyPetStatEffect(character, stat, amount) {
    if (!character) return;
    if (character.stats && typeof character.stats[stat] === 'number') {
      character.stats[stat] = Math.max(0, Math.min(100, character.stats[stat] + amount));
    }
    if (typeof character[stat] === 'number') {
      character[stat] = Math.max(0, Math.min(100, character[stat] + amount));
    }
  }

  function bumpCount(pet, key, maxLimit) {
    pet.actionsDone = pet.actionsDone || {};
    const cur = pet.actionsDone[key] || 0;
    if (cur >= maxLimit) return { ok: false, count: cur };
    pet.actionsDone[key] = cur + 1;
    return { ok: true, count: cur + 1 };
  }

  // --- Species-Specific Action Catalog Builder ---
  function getPetActionsForPet(pet, character) {
    if (!pet) return [];
    ensurePetStats(pet);
    const fmt = (usd) => {
      const val = Math.max(5, Math.round(usd * getCountryMultiplier(character)));
      return window.formatMoney ? window.formatMoney(val, character?.countryCode) : `$${val}`;
    };

    const actions = [];
    const done = pet.actionsDone || {};

    // 1. Proper Diet Feeding
    actions.push({
      id: 'feed_regular',
      label: `Serve ${pet.diet}`,
      desc: `Replenish satiety and soothe appetite. (${done.fed || 0}/5)`,
      icon: 'drumstick',
      toneClass: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
      disabled: (done.fed || 0) >= 5
    });

    actions.push({
      id: 'feed_specialty',
      label: pet.category === 'supernatural' ? 'Offer Eclipse Tallow / Silver Feast' : `Serve Gourmet Delicacy (${fmt(18)})`,
      desc: pet.category === 'supernatural'
        ? `Deepens Resonance & Occult link (free or 1 s.). (${done.fedSpecial || 0}/2)`
        : `High-grade cut that boosts Health & Bond. (${done.fedSpecial || 0}/2)`,
      icon: 'sparkles',
      toneClass: pet.category === 'supernatural'
        ? 'text-purple-400 border-purple-500/30 bg-purple-500/10'
        : 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      disabled: (done.fedSpecial || 0) >= 2
    });

    // 2. Class-Specific Meaningful Activities
    const grp = pet.animalGroup;

    if (grp === 'dog') {
      actions.push(
        {
          id: 'dog_walk',
          label: pet.templateId === 'dog_bloodhound' || pet.templateId === 'dog_dachshund' ? 'Scent-Trail Fog Walk' : 'Walk Through City Fog',
          desc: `Exercise, find lost bills/curios & boost Vitality. (${done.walked || 0}/3)`,
          icon: 'footprints',
          toneClass: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
          disabled: (done.walked || 0) >= 3
        },
        {
          id: 'dog_drill',
          label: 'Obedience & Guard Drill',
          desc: `Trains command discipline (+Obedience) & deters crime. (${done.drilled || 0}/3)`,
          icon: 'shield',
          toneClass: 'text-sky-400 border-sky-500/30 bg-sky-500/10',
          disabled: (done.drilled || 0) >= 3
        },
        {
          id: 'dog_groom',
          label: 'Brush Coat & Cuddle',
          desc: `Builds deep loyalty, Happiness & Sanity comfort. (${done.petted || 0}/4)`,
          icon: 'heart',
          toneClass: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
          disabled: (done.petted || 0) >= 4
        }
      );
    } else if (grp === 'cat') {
      actions.push(
        {
          id: 'cat_purr',
          label: 'Purr Therapy & Hearth Rest',
          desc: `Calms dread, restores Sanity & deepens Bond. (${done.petted || 0}/4)`,
          icon: 'heart',
          toneClass: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
          disabled: (done.petted || 0) >= 4
        },
        {
          id: 'cat_prowl',
          label: 'Mouse Hunt & Window Watch',
          desc: `Clears household vermin & recovers dropped coins. (${done.walked || 0}/3)`,
          icon: 'eye',
          toneClass: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
          disabled: (done.walked || 0) >= 3
        },
        {
          id: 'cat_play',
          label: pet.templateId === 'cat_sphynx' ? 'Fit Knit Sweater & Play' : 'Feather Wand & Catnip Play',
          desc: `Prevents boredom and builds agility (+Enrichment). (${done.drilled || 0}/3)`,
          icon: 'zap',
          toneClass: 'text-sky-400 border-sky-500/30 bg-sky-500/10',
          disabled: (done.drilled || 0) >= 3
        }
      );
    } else if (grp === 'bird') {
      actions.push(
        {
          id: 'bird_mimic',
          label: 'Teach Phrase / Mimicry Drill',
          desc: `Teaches words or songs (+Obedience & +Smarts). (${done.drilled || 0}/3)`,
          icon: 'message-circle',
          toneClass: 'text-sky-400 border-sky-500/30 bg-sky-500/10',
          disabled: (done.drilled || 0) >= 3
        },
        {
          id: 'bird_forage',
          label: 'Send Scavenging / Dusk Flight',
          desc: `Flies rooftops to return coins, keys, or mice. (${done.walked || 0}/3)`,
          icon: 'feather',
          toneClass: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
          disabled: (done.walked || 0) >= 3
        },
        {
          id: 'bird_plumage',
          label: 'Perch Care & Hazard Watch',
          desc: `Soothes plumage (+Enrichment) & checks foul air. (${done.petted || 0}/3)`,
          icon: 'shield-check',
          toneClass: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
          disabled: (done.petted || 0) >= 3
        }
      );
    } else if (grp === 'small_reptile') {
      actions.push(
        {
          id: 'reptile_habitat',
          label: pet.templateId === 'aquatic_moor' ? 'Cycle Water & Clean Bowl' : 'Mist Terrarium / Clean Bedding',
          desc: `Crucial habitat maintenance (+Health & +Enrichment). (${done.drilled || 0}/3)`,
          icon: 'droplets',
          toneClass: 'text-teal-400 border-teal-500/30 bg-teal-500/10',
          disabled: (done.drilled || 0) >= 3
        },
        {
          id: 'reptile_handle',
          label: pet.templateId === 'aquatic_moor' ? 'Quiet Contemplative Watch' : 'Gentle Handling / Coil Session',
          desc: `Builds trust and lowers pulse (+Sanity, +Bond). (${done.petted || 0}/4)`,
          icon: 'heart',
          toneClass: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
          disabled: (done.petted || 0) >= 4
        },
        {
          id: 'small_tunnel',
          label: pet.templateId === 'small_ferret' || pet.templateId === 'small_rabbit' ? 'Floorboard Hide-and-Seek' : 'Shed Watch & Enrichment',
          desc: `Ferrets/rabbits unearth hidden change; reptiles relax. (${done.walked || 0}/3)`,
          icon: 'search',
          toneClass: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
          disabled: (done.walked || 0) >= 3
        }
      );
    } else if (pet.category === 'exotic') {
      actions.push(
        {
          id: 'exotic_condition',
          label: 'Handler Conditioning Drill',
          desc: `Builds Obedience (${pet.obedience}%) & lowers Wildness (${pet.wildness}%). (${done.drilled || 0}/3)`,
          icon: 'shield',
          toneClass: 'text-sky-400 border-sky-500/30 bg-sky-500/10',
          disabled: (done.drilled || 0) >= 3
        },
        {
          id: 'exotic_extract',
          label: pet.templateId === 'exotic_viper'
            ? 'Milk Venom Vial (High Risk)'
            : (pet.templateId === 'exotic_capuchin' ? 'Street Pocket Trick' : 'Gather Exotic Yield / Molt'),
          desc: `Monetize specimen or trick (needs high Obedience or risks injury). (${done.extracted || 0}/2)`,
          icon: 'flask-conical',
          toneClass: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
          disabled: (done.extracted || 0) >= 2
        },
        {
          id: 'exotic_showcase',
          label: 'Promenade / Menagerie Showcase',
          desc: `Boosts Looks & prestige (+Happiness); unpermitted beasts draw heat. (${done.walked || 0}/2)`,
          icon: 'crown',
          toneClass: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
          disabled: (done.walked || 0) >= 2
        }
      );
      if (character && !character.exoticPermit) {
        actions.push({
          id: 'buy_permit',
          label: `File Exotic Keeper Permit (${fmt(1200)})`,
          desc: 'Legalizes exotic housing and stops municipal confiscation fines.',
          icon: 'file-check',
          toneClass: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
          disabled: false
        });
      }
    } else if (pet.category === 'supernatural') {
      actions.push(
        {
          id: 'familiar_power',
          label: pet.powerName || 'Invoke Familiar Power',
          desc: pet.powerUsedThisYear
            ? 'Already invoked this year (renews next year).'
            : (pet.powerDesc || 'Channel your familiar\'s unique supernatural ability.'),
          icon: 'wand-sparkles',
          toneClass: 'text-purple-300 border-purple-500/40 bg-purple-500/15',
          disabled: !!pet.powerUsedThisYear
        },
        {
          id: 'commune',
          label: 'Veil Communion & Omen Reading',
          desc: `Deepens Occult & Resonance (-2% Sanity trade). (${done.communed || 0}/3)`,
          icon: 'eye',
          toneClass: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
          disabled: (done.communed || 0) >= 3
        },
        {
          id: 'familiar_offering',
          label: 'Tribute & Hearth Cuddle',
          desc: `Restores Bond & calms the household atmosphere. (${done.petted || 0}/4)`,
          icon: 'flame',
          toneClass: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
          disabled: (done.petted || 0) >= 4
        }
      );
    }

    // 3. Veterinary / Apothecary Checkup
    const vetCostLabel = pet.category === 'exotic' ? fmt(240) : (pet.category === 'supernatural' ? fmt(150) : fmt(110));
    actions.push({
      id: 'vet',
      label: pet.category === 'supernatural' ? `Summon Night Apothecary (${vetCostLabel})` : `Veterinary Clinic Visit (${vetCostLabel})`,
      desc: `Restores Health to 100% and clears maladies. (${done.vet || 0}/2)`,
      icon: 'stethoscope',
      toneClass: 'text-teal-400 border-teal-500/30 bg-teal-500/10',
      disabled: (done.vet || 0) >= 2
    });

    // 4. Release / Rehome / Banish
    actions.push({
      id: 'rehome',
      label: pet.category === 'supernatural' ? 'Sever Familiar Pact' : (pet.category === 'exotic' ? 'Surrender to Sanctuary' : 'Rehome Companion'),
      desc: pet.category === 'supernatural'
        ? 'Dismiss the entity cleanly back across the veil.'
        : 'Give this companion to a verified shelter or new keeper.',
      icon: 'log-out',
      toneClass: 'text-red-400 border-red-500/30 bg-red-500/10',
      disabled: false
    });

    return actions;
  }

  // --- Unique Familiar Powers Resolver ---
  function invokeFamiliarPower(pet, character) {
    if (pet.powerUsedThisYear) {
      return { success: false, reason: `${pet.name} has already expended its ${pet.powerName || 'power'} this year.` };
    }
    pet.powerUsedThisYear = true;
    const tid = pet.templateId || '';
    const effects = {};
    let message = '';

    if (tid === 'black_shuck') {
      const shil = 2 + (pet.supernaturalBond >= 80 ? 2 : 0);
      character.shillings = (character.shillings || 0) + shil;
      applyPetStatEffect(character, 'vitality', 4);
      effects.shillings = shil;
      effects.vitality = 4;
      message = `${pet.name} paced the dark perimeter with glowing ember eyes, scattering lurking threats and digging up ${shil} ancient graveyard Shillings.`;
    } else if (tid === 'cat_sith') {
      const shil = pet.hunger > 75 ? 1 : (3 + Math.floor(Math.random() * 3));
      character.shillings = (character.shillings || 0) + shil;
      applyPetStatEffect(character, 'happiness', 5);
      effects.shillings = shil;
      effects.happiness = 5;
      message = `${pet.name} bowed beside the radiator and placed ${shil} cold silver Shillings neatly inside your shoe as a fairy hearth-blessing.`;
    } else if (tid === 'kitsune_bi' || tid === 'hollow_hound') {
      // Sniff for hidden mimics among kin/friends
      const kinPool = [
        ...(character.kin?.friends || []),
        ...(character.kin?.parents || []),
        ...(character.kin?.siblings || []),
        ...(character.kin?.lovers || [])
      ].filter(p => p && p.alive);
      const hiddenEntity = kinPool.find(p => p.entityType && p.entityType !== 'human' && !p.isRevealed);
      if (hiddenEntity) {
        hiddenEntity.suspicion = 100;
        hiddenEntity.isRevealed = true;
        applyPetStatEffect(character, 'occult', 5);
        effects.occult = 5;
        message = `${pet.name} bristled violently and fixed its gaze on ${hiddenEntity.name} (${hiddenEntity.role})! Its veil-sight tore away the illusion—${hiddenEntity.name} is an unmasked ${hiddenEntity.entityType.replace('_', ' ')}!`;
      } else {
        applyPetStatEffect(character, 'looks', 3);
        applyPetStatEffect(character, 'occult', 4);
        effects.looks = 3;
        effects.occult = 4;
        message = `${pet.name} circled your silhouette with pale ghostly fire, confirming your immediate circle harbors no unmasked mimics today (+3% Looks, +4% Occult).`;
      }
    } else if (tid === 'tsuchinoko' || tid === 'brass_magpie') {
      const cash = Math.round((85 + Math.floor(Math.random() * 140)) * getCountryMultiplier(character));
      const shil = 2;
      character.money = (character.money || 0) + cash;
      character.shillings = (character.shillings || 0) + shil;
      effects.money = cash;
      effects.shillings = shil;
      message = tid === 'brass_magpie'
        ? `${pet.name} clicked its hinged brass beak over a sealed brick alcove—revealing ${window.formatMoney ? window.formatMoney(cash, character.countryCode) : '$' + cash} and ${shil} Paranormal Shillings!`
        : `${pet.name} shed an iridescent hoard-scale worth ${window.formatMoney ? window.formatMoney(cash, character.countryCode) : '$' + cash} alongside ${shil} Paranormal Shillings!`;
    } else if (tid === 'huginn_kin') {
      applyPetStatEffect(character, 'smarts', 5);
      applyPetStatEffect(character, 'occult', 4);
      effects.smarts = 5;
      effects.occult = 4;
      message = `${pet.name} returned from rooftops slick with rain and tapped secret neighborhood whispers into your desk blotter (+5% Smarts, +4% Occult).`;
    } else if (tid === 'domovoi') {
      const saved = Math.round(120 * getCountryMultiplier(character));
      character.money = (character.money || 0) + saved;
      applyPetStatEffect(character, 'sanity', 6);
      applyPetStatEffect(character, 'happiness', 5);
      effects.money = saved;
      effects.sanity = 6;
      effects.happiness = 5;
      message = `${pet.name} silently patched drafts, tuned radiator valves, and swept ash into wards—saving ${window.formatMoney ? window.formatMoney(saved, character.countryCode) : '$' + saved} and lifting household spirits.`;
    } else if (tid === 'cerberus_whelp') {
      applyPetStatEffect(character, 'sanity', 7);
      applyPetStatEffect(character, 'vitality', 5);
      effects.sanity = 7;
      effects.vitality = 5;
      message = `${pet.name}'s three heads took turns keeping midnight watch over your doorway, driving back night-terrors and restoring steady vigor.`;
    } else if (tid === 'porcelain_lapdog') {
      const activeCurses = (character.consequences || []).filter(c => c.active !== false);
      if (activeCurses.length > 0 && typeof window.resolveConsequence === 'function') {
        const target = activeCurses[0];
        window.resolveConsequence(character, target.id);
        pet.health = Math.max(25, pet.health - 18);
        applyPetStatEffect(character, 'sanity', 5);
        effects.sanity = 5;
        message = `A sharp hairline crack rang across ${pet.name}'s porcelain chest—the figurine absorbed your burden (${target.label}) into its own glaze! (-18% Pet Integrity, +5% Sanity).`;
      } else {
        applyPetStatEffect(character, 'sanity', 5);
        applyPetStatEffect(character, 'occult', 3);
        effects.sanity = 5;
        effects.occult = 3;
        message = `${pet.name} sat motionless facing the bedroom threshold, soaking ambient dread out of the wallpaper (+5% Sanity, +3% Occult).`;
      }
    } else if (tid === 'static_moths') {
      character.shillings = (character.shillings || 0) + 2;
      applyPetStatEffect(character, 'smarts', 4);
      applyPetStatEffect(character, 'occult', 4);
      effects.shillings = 2;
      effects.smarts = 4;
      effects.occult = 4;
      message = `Inside its glass jar, ${pet.name} pulsed tomorrow's dead-channel frequencies—revealing 2 hidden Shillings tucked behind the skirting board (+4% Smarts, +4% Occult).`;
    } else if (tid === 'velvet_limpet') {
      applyPetStatEffect(character, 'vitality', -3);
      applyPetStatEffect(character, 'occult', 7);
      applyPetStatEffect(character, 'smarts', 5);
      effects.vitality = -3;
      effects.occult = 7;
      effects.smarts = 5;
      message = `${pet.name} nuzzled your thumb for a pinprick drop of warmth and inscribed bright silver insights across your mirror (+7% Occult, +5% Smarts, -3% Vitality).`;
    } else if (tid === 'pendulum_cat') {
      applyPetStatEffect(character, 'sanity', 9);
      applyPetStatEffect(character, 'happiness', 5);
      effects.sanity = 9;
      effects.happiness = 5;
      message = `${pet.name}'s tail swung in immaculate 60-BPM tempo while its purr synchronized your breathing—dissolving spiral anxiety (+9% Sanity, +5% Happiness).`;
    } else {
      character.shillings = (character.shillings || 0) + 1;
      applyPetStatEffect(character, 'occult', 4);
      effects.shillings = 1;
      effects.occult = 4;
      message = `${pet.name} answered your call from the shadow threshold, leaving 1 Shilling behind (+4% Occult).`;
    }

    pet.supernaturalBond = Math.min(100, (pet.supernaturalBond || 50) + 8);
    pet.affection = Math.min(100, pet.affection + 5);
    return {
      success: true,
      title: `${pet.powerName || 'Familiar Power'}: ${pet.name}`,
      message,
      effects
    };
  }

  // --- Master Pet Action Execution ---
  function performPetAction(pet, character, actionId) {
    if (!pet || !pet.alive) return { success: false, reason: 'This companion has already departed.' };
    ensurePetStats(pet);
    const mult = getCountryMultiplier(character);
    const fmt = (val) => window.formatMoney ? window.formatMoney(val, character?.countryCode) : `$${val}`;
    const effects = {};

    if (actionId === 'buy_permit') {
      return purchaseExoticPermit(character);
    }

    if (actionId === 'rehome') {
      pet.alive = false;
      pet.deathCause = pet.category === 'supernatural'
        ? 'Banished cleanly across the veil.'
        : (pet.category === 'exotic' ? 'Transferred to an accredited sanctuary.' : 'Rehomed to a vetted household.');
      const msg = pet.category === 'supernatural'
        ? `You spoke the closing cadence and severed your pact with ${pet.name}. Cold mist dissolved over the floorboards.`
        : `You gently surrendered ${pet.name} into safe keeping, ensuring they will be fed and cared for.`;
      applyPetStatEffect(character, 'happiness', -4);
      return {
        success: true,
        rehomed: true,
        title: pet.category === 'supernatural' ? `Severed Pact with ${pet.name}` : `Rehomed ${pet.name}`,
        message: msg,
        effects: { happiness: -4 }
      };
    }

    if (actionId === 'feed_regular') {
      const res = bumpCount(pet, 'fed', 5);
      if (!res.ok) return { success: false, reason: `${pet.name} is completely satisfied right now!` };
      pet.hunger = Math.max(0, pet.hunger - 38);
      pet.health = Math.min(100, pet.health + 5);
      pet.affection = Math.min(100, pet.affection + 6);
      applyPetStatEffect(character, 'happiness', 3);
      effects.happiness = 3;
      return {
        success: true,
        title: `Fed ${pet.name}`,
        message: `You served a fresh portion of ${pet.diet}. ${pet.name} devoured it cleanly and settled down beside you.`,
        effects
      };
    }

    if (actionId === 'feed_specialty') {
      const res = bumpCount(pet, 'fedSpecial', 2);
      if (!res.ok) return { success: false, reason: `${pet.name} has already enjoyed its specialty meals this year.` };
      if (pet.category === 'supernatural') {
        pet.hunger = Math.max(0, pet.hunger - 50);
        pet.supernaturalBond = Math.min(100, (pet.supernaturalBond || 50) + 12);
        pet.affection = Math.min(100, pet.affection + 10);
        applyPetStatEffect(character, 'occult', 4);
        effects.occult = 4;
        return {
          success: true,
          title: `Ritual Nourishment: ${pet.name}`,
          message: `You prepared an offering of eclipse tallow and silver-bowled cream. ${pet.name}'s eyes flared briefly as its bond tightened (+12% Resonance, +4% Occult).`,
          effects
        };
      }
      const cost = Math.max(6, Math.round(18 * mult));
      if ((character.money || 0) < cost) {
        pet.actionsDone.fedSpecial -= 1;
        return { success: false, reason: `You need ${fmt(cost)} for gourmet pet provisions.` };
      }
      character.money -= cost;
      pet.hunger = Math.max(0, pet.hunger - 55);
      pet.health = Math.min(100, pet.health + 10);
      pet.affection = Math.min(100, pet.affection + 12);
      pet.enrichment = Math.min(100, pet.enrichment + 10);
      applyPetStatEffect(character, 'happiness', 5);
      effects.money = -cost;
      effects.happiness = 5;
      return {
        success: true,
        title: `Gourmet Feast for ${pet.name}`,
        message: `${pet.name} savored the prime gourmet cut and broth, gleaming with renewed vitality (+Health, +Bond).`,
        effects
      };
    }

    if (actionId === 'vet') {
      const res = bumpCount(pet, 'vet', 2);
      if (!res.ok) return { success: false, reason: `${pet.name} has already undergone maximum checkups this year.` };
      const baseUSD = pet.category === 'exotic' ? 240 : (pet.category === 'supernatural' ? 150 : 110);
      const cost = Math.max(25, Math.round(baseUSD * mult));
      if ((character.money || 0) < cost) {
        pet.actionsDone.vet -= 1;
        return { success: false, reason: `Checkup costs ${fmt(cost)}.` };
      }
      character.money -= cost;
      pet.health = 100;
      pet.affection = Math.min(100, pet.affection + 8);
      applyPetStatEffect(character, 'happiness', 4);
      effects.money = -cost;
      effects.happiness = 4;
      const msg = pet.category === 'supernatural'
        ? `An old night-apothecary smudged myrrh across ${pet.name}, sealing cracks and restoring its spectral vigor.`
        : `The specialist ran full diagnostics, trimmed claws, and treated ${pet.name} back to 100% physical health.`;
      return { success: true, title: `Checkup Complete: ${pet.name}`, message: msg, effects };
    }

    // Dogs
    if (actionId === 'dog_walk') {
      const res = bumpCount(pet, 'walked', 3);
      if (!res.ok) return { success: false, reason: `${pet.name} is worn out from long walks this year.` };
      pet.enrichment = Math.min(100, pet.enrichment + 22);
      pet.health = Math.min(100, pet.health + 5);
      pet.affection = Math.min(100, pet.affection + 6);
      applyPetStatEffect(character, 'vitality', 3);
      applyPetStatEffect(character, 'happiness', 4);
      effects.vitality = 3;
      effects.happiness = 4;
      const scentBonus = (pet.templateId === 'dog_bloodhound' || pet.templateId === 'dog_dachshund') ? 0.52 : 0.28;
      let msg = `You walked ${pet.name} through rain-washed streets and misty parklands. Crisp air lifted your spirits.`;
      if (Math.random() < scentBonus) {
        const cash = Math.max(5, Math.round((14 + Math.floor(Math.random() * 24)) * mult));
        character.money = (character.money || 0) + cash;
        effects.money = cash;
        msg = `Following an intriguing scent trail near old cellar grates, ${pet.name} pawed out a damp envelope holding ${fmt(cash)}!`;
      }
      return { success: true, title: `Walked ${pet.name}`, message: msg, effects };
    }

    if (actionId === 'dog_drill') {
      const res = bumpCount(pet, 'drilled', 3);
      if (!res.ok) return { success: false, reason: `${pet.name}'s training patience is spent for now.` };
      const gain = Math.floor(Math.random() * 7) + 8;
      pet.obedience = Math.min(100, pet.obedience + gain);
      pet.enrichment = Math.min(100, pet.enrichment + 14);
      pet.affection = Math.min(100, pet.affection + 5);
      applyPetStatEffect(character, 'smarts', 2);
      effects.smarts = 2;
      return {
        success: true,
        title: `Guard & Obedience Drill`,
        message: `${pet.name} mastered crisp sit-stay-guard commands at the threshold (+${gain}% Obedience, +2% Smarts).`,
        effects
      };
    }

    if (actionId === 'dog_groom' || actionId === 'cat_purr') {
      const res = bumpCount(pet, 'petted', 4);
      if (!res.ok) return { success: false, reason: `${pet.name} wants quiet nap space right now.` };
      pet.affection = Math.min(100, pet.affection + 10);
      pet.health = Math.min(100, pet.health + 4);
      pet.enrichment = Math.min(100, pet.enrichment + 10);
      applyPetStatEffect(character, 'happiness', 5);
      applyPetStatEffect(character, 'sanity', 5);
      effects.happiness = 5;
      effects.sanity = 5;
      const msg = actionId === 'cat_purr'
        ? `${pet.name} curled warmly over your chest, rumbling steadily until tension dissolved (+5% Sanity, +5% Happiness).`
        : `You brushed ${pet.name}'s coat thoroughly and shared quiet hearthside warmth (+5% Sanity, +10% Bond).`;
      return { success: true, title: `Soothing Time with ${pet.name}`, message: msg, effects };
    }

    // Cats
    if (actionId === 'cat_prowl') {
      const res = bumpCount(pet, 'walked', 3);
      if (!res.ok) return { success: false, reason: `${pet.name} has finished its patrol for the season.` };
      pet.enrichment = Math.min(100, pet.enrichment + 20);
      pet.affection = Math.min(100, pet.affection + 5);
      applyPetStatEffect(character, 'happiness', 3);
      effects.happiness = 3;
      let msg = `${pet.name} patrolled baseboards and attic rafters, clearing pests silently.`;
      if (Math.random() < 0.35) {
        const tip = Math.max(4, Math.round(12 * mult));
        character.money = (character.money || 0) + tip;
        effects.money = tip;
        msg = `${pet.name} cornered two mice behind the radiator—and dragged out ${fmt(tip)} wedged behind a baseboard!`;
      }
      return { success: true, title: `Prowl & Hunt: ${pet.name}`, message: msg, effects };
    }

    if (actionId === 'cat_play') {
      const res = bumpCount(pet, 'drilled', 3);
      if (!res.ok) return { success: false, reason: `${pet.name} is completely tuckered out!` };
      pet.enrichment = Math.min(100, pet.enrichment + 26);
      pet.affection = Math.min(100, pet.affection + 7);
      pet.obedience = Math.min(100, pet.obedience + 4);
      applyPetStatEffect(character, 'happiness', 5);
      effects.happiness = 5;
      const msg = pet.templateId === 'cat_sphynx'
        ? `You dressed ${pet.name} in a freshly mended wool sweater and played feather chase across the rug!`
        : `${pet.name} performed acrobatic leaps after the feather wand before collapsing contentedly in a sunbeam.`;
      return { success: true, title: `Playtime with ${pet.name}`, message: msg, effects };
    }

    // Birds
    if (actionId === 'bird_mimic') {
      const res = bumpCount(pet, 'drilled', 3);
      if (!res.ok) return { success: false, reason: `${pet.name} refuses to repeat another syllable today.` };
      const phrases = ['"Lock the cellar."', '"Who knocked?"', '"Pay the ferryman."', '"Rain before dawn."', '"Check the latch."'];
      const learned = window.getRandomElement ? window.getRandomElement(phrases) : phrases[0];
      if (!pet.learnedPhrases.includes(learned)) pet.learnedPhrases.push(learned);
      pet.obedience = Math.min(100, pet.obedience + 9);
      pet.enrichment = Math.min(100, pet.enrichment + 20);
      applyPetStatEffect(character, 'smarts', 3);
      applyPetStatEffect(character, 'happiness', 4);
      effects.smarts = 3;
      effects.happiness = 4;
      return {
        success: true,
        title: `Vocal Training: ${pet.name}`,
        message: `${pet.name} tilted its head and imitated your cadence flawlessly: ${learned} (+3% Smarts, +4% Happiness).`,
        effects
      };
    }

    if (actionId === 'bird_forage') {
      const res = bumpCount(pet, 'walked', 3);
      if (!res.ok) return { success: false, reason: `${pet.name} is resting its wings.` };
      pet.enrichment = Math.min(100, pet.enrichment + 22);
      pet.affection = Math.min(100, pet.affection + 6);
      const isCorvid = pet.templateId === 'bird_crow' || pet.templateId === 'bird_raven';
      if (isCorvid || Math.random() < 0.45) {
        const loot = Math.max(5, Math.round((10 + Math.floor(Math.random() * 20)) * mult));
        character.money = (character.money || 0) + loot;
        effects.money = loot;
        return {
          success: true,
          title: `Roof-Forage Return`,
          message: `${pet.name} circled back at dusk clutching shiny foil, lost coins, and trinkets worth ${fmt(loot)}!`,
          effects
        };
      }
      applyPetStatEffect(character, 'happiness', 4);
      effects.happiness = 4;
      return {
        success: true,
        title: `Dusk Flight: ${pet.name}`,
        message: `${pet.name} glided gracefully above the foggy eaves and returned straight to your shoulder.`,
        effects
      };
    }

    if (actionId === 'bird_plumage') {
      const res = bumpCount(pet, 'petted', 3);
      if (!res.ok) return { success: false, reason: `${pet.name}'s feathers are spotless right now.` };
      pet.health = Math.min(100, pet.health + 7);
      pet.enrichment = Math.min(100, pet.enrichment + 16);
      applyPetStatEffect(character, 'sanity', 4);
      effects.sanity = 4;
      return {
        success: true,
        title: `Plumage & Hazard Check`,
        message: `You cleaned ${pet.name}'s perch and watched its steady pulse; air in the rooms remains clear and calm (+4% Sanity).`,
        effects
      };
    }

    // Small Mammals, Reptiles & Aquatics
    if (actionId === 'reptile_habitat') {
      const res = bumpCount(pet, 'drilled', 3);
      if (!res.ok) return { success: false, reason: `Habitat parameters are already calibrated for now.` };
      pet.health = Math.min(100, pet.health + 10);
      pet.enrichment = Math.min(100, pet.enrichment + 18);
      applyPetStatEffect(character, 'smarts', 2);
      effects.smarts = 2;
      return {
        success: true,
        title: `Habitat Maintenance`,
        message: `Temperature, humidity, and clean substrate restored ${pet.name} to thriving comfort (+10% Pet Health, +2% Smarts).`,
        effects
      };
    }

    if (actionId === 'reptile_handle') {
      const res = bumpCount(pet, 'petted', 4);
      if (!res.ok) return { success: false, reason: `${pet.name} prefers quiet burrow/water rest now.` };
      pet.affection = Math.min(100, pet.affection + 8);
      pet.enrichment = Math.min(100, pet.enrichment + 12);
      applyPetStatEffect(character, 'sanity', 5);
      applyPetStatEffect(character, 'happiness', 3);
      effects.sanity = 5;
      effects.happiness = 3;
      return {
        success: true,
        title: `Calm Bonding: ${pet.name}`,
        message: `Quiet stillness beside ${pet.name} lowered your heartbeat and steadied ragged thoughts (+5% Sanity).`,
        effects
      };
    }

    if (actionId === 'small_tunnel') {
      const res = bumpCount(pet, 'walked', 3);
      if (!res.ok) return { success: false, reason: `${pet.name} curled up asleep in its bedding.` };
      pet.enrichment = Math.min(100, pet.enrichment + 24);
      pet.affection = Math.min(100, pet.affection + 6);
      if (pet.templateId === 'small_ferret' || Math.random() < 0.4) {
        const cash = Math.max(4, Math.round((8 + Math.floor(Math.random() * 14)) * mult));
        character.money = (character.money || 0) + cash;
        effects.money = cash;
        return {
          success: true,
          title: `Floorboard Stash Found!`,
          message: `${pet.name} squeezed behind the parlor skirting and dragged out ${fmt(cash)} from its secret coin stash!`,
          effects
        };
      }
      applyPetStatEffect(character, 'happiness', 4);
      effects.happiness = 4;
      return {
        success: true,
        title: `Play & Tunneling: ${pet.name}`,
        message: `${pet.name} explored cardboard mazes enthusiastically (+24% Enrichment, +4% Happiness).`,
        effects
      };
    }

    // Exotics
    if (actionId === 'exotic_condition') {
      const res = bumpCount(pet, 'drilled', 3);
      if (!res.ok) return { success: false, reason: `${pet.name} cannot handle more handler drills this year.` };
      pet.obedience = Math.min(100, pet.obedience + 11);
      pet.wildness = Math.max(10, (pet.wildness || 50) - 9);
      pet.enrichment = Math.min(100, pet.enrichment + 16);
      applyPetStatEffect(character, 'vitality', 2);
      effects.vitality = 2;
      return {
        success: true,
        title: `Exotic Conditioning`,
        message: `Steady tongs, feeding cues, and enclosure training reinforced control over ${pet.name} (+11% Obedience, -9% Wildness).`,
        effects
      };
    }

    if (actionId === 'exotic_extract') {
      const res = bumpCount(pet, 'extracted', 2);
      if (!res.ok) return { success: false, reason: `${pet.name} needs recovery before another extraction/trick.` };
      const successRate = 0.45 + (pet.obedience / 200) + (pet.affection / 400);
      if (pet.contraband && Math.random() > successRate) {
        applyPetStatEffect(character, 'vitality', -10);
        applyPetStatEffect(character, 'sanity', -4);
        pet.wildness = Math.min(100, (pet.wildness || 50) + 10);
        effects.vitality = -10;
        effects.sanity = -4;
        return {
          success: true,
          title: `Handler Mishap!`,
          message: `${pet.name} struck faster than your reflexes! You required urgent bandaging before the bloodied room settled (-10% Vitality, -4% Sanity).`,
          effects
        };
      }
      const payout = Math.round((pet.templateId === 'exotic_viper' ? 280 : (pet.templateId === 'exotic_capuchin' ? 140 : 190)) * mult);
      character.money = (character.money || 0) + payout;
      effects.money = payout;
      return {
        success: true,
        title: pet.templateId === 'exotic_viper' ? `Venom Vial Harvested` : `Exotic Yield Collected`,
        message: `Underworld apothecaries / street collectors paid ${fmt(payout)} for ${pet.name}'s rare specimen yield!`,
        effects
      };
    }

    if (actionId === 'exotic_showcase') {
      const res = bumpCount(pet, 'walked', 2);
      if (!res.ok) return { success: false, reason: `Public appearances exhausted ${pet.name}'s patience.` };
      pet.enrichment = Math.min(100, pet.enrichment + 18);
      if (!character.exoticPermit && pet.contraband && Math.random() < 0.35) {
        const fine = Math.round(650 * mult);
        character.money = Math.max(0, (character.money || 0) - fine);
        effects.money = -fine;
        return {
          success: true,
          title: `Municipal Patrol Spot-Check!`,
          message: `An inspector recognized ${pet.species} as an unpermitted contraband animal and issued an immediate ${fmt(fine)} fine!`,
          effects
        };
      }
      applyPetStatEffect(character, 'looks', 3);
      applyPetStatEffect(character, 'happiness', 6);
      effects.looks = 3;
      effects.happiness = 6;
      return {
        success: true,
        title: `Menagerie Promenade`,
        message: `Onlookers stared in awe and whispered reverence as you strolled past with ${pet.name} (+3% Looks, +6% Happiness).`,
        effects
      };
    }

    // Supernatural Actions
    if (actionId === 'familiar_power') {
      return invokeFamiliarPower(pet, character);
    }

    if (actionId === 'familiar_offering') {
      const res = bumpCount(pet, 'petted', 4);
      if (!res.ok) return { success: false, reason: `${pet.name} retreated silently into wall shadows.` };
      pet.affection = Math.min(100, pet.affection + 9);
      pet.supernaturalBond = Math.min(100, (pet.supernaturalBond || 50) + 7);
      applyPetStatEffect(character, 'happiness', 4);
      applyPetStatEffect(character, 'sanity', 4);
      applyPetStatEffect(character, 'occult', 2);
      effects.happiness = 4;
      effects.sanity = 4;
      effects.occult = 2;
      return {
        success: true,
        title: `Quiet Accord with ${pet.name}`,
        message: `${pet.name} leaned its cool spectral form against your palm, bringing eerie nocturnal calm (+4% Sanity, +2% Occult).`,
        effects
      };
    }

    if (actionId === 'commune') {
      if (pet.category !== 'supernatural') {
        return { success: false, reason: `${pet.name} is an ordinary creature and tilts its head quizzically.` };
      }
      const res = bumpCount(pet, 'communed', 3);
      if (!res.ok) return { success: false, reason: `Your mind hums dangerously; no more Veil communion this year.` };
      pet.supernaturalBond = Math.min(100, (pet.supernaturalBond || 50) + 12);
      applyPetStatEffect(character, 'occult', 6);
      applyPetStatEffect(character, 'sanity', -2);
      effects.occult = 6;
      effects.sanity = -2;
      const omens = [
        `You locked eyes with ${pet.name} and traded silent syllables. A static chorus warned you which doors to bolt at twilight.`,
        `${pet.name}'s pupils split like glass prisms, showing drowned stone steps beneath the river (+6% Occult, -2% Sanity).`,
        `A cold draft spun the curtains while ${pet.name} pressed its brow to yours, leaving sharp antique memories behind.`
      ];
      return {
        success: true,
        title: `Veil Communion: ${pet.name}`,
        message: window.getRandomElement ? window.getRandomElement(omens) : omens[0],
        effects
      };
    }

    return { success: false, reason: 'Action not recognized.' };
  }

  // Legacy wrapper compatibility
  function feedPet(pet, character, choice = 'regular') {
    return performPetAction(pet, character, choice === 'regular' ? 'feed_regular' : 'feed_specialty');
  }
  function cuddlePet(pet, character) {
    ensurePetStats(pet);
    if (pet.animalGroup === 'cat') return performPetAction(pet, character, 'cat_purr');
    if (pet.animalGroup === 'bird') return performPetAction(pet, character, 'bird_plumage');
    if (pet.animalGroup === 'small_reptile') return performPetAction(pet, character, 'reptile_handle');
    if (pet.category === 'supernatural') return performPetAction(pet, character, 'familiar_offering');
    return performPetAction(pet, character, 'dog_groom');
  }
  function strollPet(pet, character) {
    ensurePetStats(pet);
    if (pet.animalGroup === 'cat') return performPetAction(pet, character, 'cat_prowl');
    if (pet.animalGroup === 'bird') return performPetAction(pet, character, 'bird_forage');
    if (pet.animalGroup === 'small_reptile') return performPetAction(pet, character, 'small_tunnel');
    if (pet.category === 'exotic') return performPetAction(pet, character, 'exotic_showcase');
    if (pet.category === 'supernatural') return performPetAction(pet, character, 'familiar_power');
    return performPetAction(pet, character, 'dog_walk');
  }
  function communeWithPet(pet, character) {
    return performPetAction(pet, character, 'commune');
  }
  function takePetToVet(pet, character) {
    return performPetAction(pet, character, 'vet');
  }

  // --- Annual Tick Simulation for Pets ---
  function tickPetsYear(character) {
    if (!character || !character.pets || !Array.isArray(character.pets)) return [];
    const logs = [];
    const mult = getCountryMultiplier(character);
    const fmt = (val) => window.formatMoney ? window.formatMoney(val, character.countryCode) : `$${val}`;

    character.pets.forEach(pet => {
      if (!pet.alive) return;
      ensurePetStats(pet);

      pet.age += 1;
      pet.actionsDone = {};
      pet.powerUsedThisYear = false;
      pet.hunger = Math.min(100, (pet.hunger || 0) + 28);
      pet.enrichment = Math.max(0, (pet.enrichment || 70) - 18);

      // Annual upkeep
      const upkeep = pet.annualCostLocal || Math.round((pet.annualCostUSD || 0) * mult);
      if (character.age >= 10 && upkeep > 0) {
        if ((character.money || 0) >= upkeep) {
          character.money -= upkeep;
        } else {
          pet.hunger = Math.min(100, pet.hunger + 15);
          pet.health = Math.max(15, pet.health - 8);
        }
      }

      // Neglect & Boredom penalties
      if (pet.hunger > 72) {
        pet.health = Math.max(10, pet.health - 14);
        pet.affection = Math.max(5, pet.affection - 10);
      }
      if (pet.enrichment < 25) {
        pet.affection = Math.max(5, pet.affection - 6);
        if (pet.category === 'exotic') {
          pet.wildness = Math.min(100, (pet.wildness || 50) + 8);
        }
      }

      // Exotic permit / confiscation check for smuggled contraband
      if (pet.category === 'exotic' && !character.exoticPermit) {
        const inspectChance = pet.contraband ? 0.14 : 0.06;
        if (Math.random() < inspectChance) {
          if ((pet.wildness || 50) > 75 && Math.random() < 0.4) {
            pet.alive = false;
            pet.deathCause = 'Confiscated by Municipal Wildlife Enforcement.';
            applyPetStatEffect(character, 'happiness', -10);
            logs.push(`[WILDLIFE SEIZURE] Unpermitted inspectors raided your housing and seized ${pet.name} (${pet.species}) (-10% Happiness).`);
            return;
          } else {
            const fine = Math.round(450 * mult);
            character.money = Math.max(0, (character.money || 0) - fine);
            logs.push(`[EXOTIC CITATION] Municipal officers discovered your unpermitted ${pet.species}, ${pet.name}, and fined you ${fmt(fine)}.`);
          }
        }
      }

      // Exotic wildness mishap if badly neglected
      if (pet.category === 'exotic' && pet.contraband && pet.obedience < 30 && pet.hunger > 75 && Math.random() < 0.25) {
        applyPetStatEffect(character, 'vitality', -6);
        logs.push(`[EXOTIC INCIDENT] Half-starved and unruly, ${pet.name} lashed out in its enclosure (-6% Vitality). Feed and drill your exotic!`);
      }

      // Cat Sìth starvation omen vs Domovoi hearth care
      if (pet.category === 'supernatural' && pet.hunger > 85 && pet.supernaturalBond < 35 && Math.random() < 0.35) {
        applyPetStatEffect(character, 'sanity', -5);
        logs.push(`[UNNOURISHED FAMILIAR] Starved of offerings, ${pet.name} scraped hollow warnings into your bedroom wall (-5% Sanity).`);
      }

      // Passive annual perks for well-bonded companions
      if (pet.affection >= 75 && pet.health >= 65) {
        if (pet.animalGroup === 'cat' && Math.random() < 0.4) {
          applyPetStatEffect(character, 'sanity', 2);
        } else if (pet.animalGroup === 'dog' && pet.obedience >= 65 && Math.random() < 0.35) {
          applyPetStatEffect(character, 'happiness', 2);
        } else if (pet.templateId === 'bird_canary' && Math.random() < 0.35) {
          applyPetStatEffect(character, 'vitality', 1);
        }
      }

      // Mortality check
      let deathRisk = 0.015;
      if (pet.age >= (pet.maxAge || 15)) {
        deathRisk = 0.32 + (pet.age - pet.maxAge) * 0.16;
      }
      if (pet.health < 25) deathRisk += 0.28;

      if (Math.random() < deathRisk) {
        pet.alive = false;
        if (pet.category === 'supernatural') {
          pet.deathCause = 'Dissolved back into the shadow veil leaving behind cold stardust.';
          logs.push(`[FAMILIAR DEPARTURE] ${pet.name} (${pet.species}) dissolved quietly into midnight mist, returning across the veil.`);
        } else {
          pet.deathCause = 'Passed away peacefully after a long companionship.';
          logs.push(`[COMPANION LOSS] Your beloved ${pet.species}, ${pet.name}, passed away at age ${pet.age} (-12% Happiness).`);
        }
        applyPetStatEffect(character, 'happiness', -12);
      } else {
        if (pet.category === 'supernatural' && pet.omen && Math.random() < 0.45) {
          logs.push(`[COMPANION OMEN] ${pet.name} (${pet.species}): ${pet.omen}`);
        } else if (pet.category === 'exotic') {
          logs.push(`[MENAGERIE] ${pet.name} (${pet.species}, Age ${pet.age}) paced its enclosure cleanly (Bond ${pet.affection}%).`);
        } else {
          logs.push(`[COMPANION] ${pet.name} (${pet.species}, Age ${pet.age}) kept faithful company beside you.`);
        }
      }
    });

    return logs;
  }

  window.MUNDANE_PET_TEMPLATES = MUNDANE_PET_TEMPLATES;
  window.EXOTIC_PET_TEMPLATES = EXOTIC_PET_TEMPLATES;
  window.SUPERNATURAL_PET_TEMPLATES = SUPERNATURAL_PET_TEMPLATES;
  window.ALL_PET_TEMPLATES = ALL_PET_TEMPLATES;
  window.ensurePetStats = ensurePetStats;
  window.generateRandomPet = generateRandomPet;
  window.generatePetCatalogBatch = generatePetCatalogBatch;
  window.getExoticPermitCost = getExoticPermitCost;
  window.checkPetAdoptionEligibility = checkPetAdoptionEligibility;
  window.purchaseExoticPermit = purchaseExoticPermit;
  window.getPetActionsForPet = getPetActionsForPet;
  window.performPetAction = performPetAction;
  window.feedPet = feedPet;
  window.cuddlePet = cuddlePet;
  window.strollPet = strollPet;
  window.communeWithPet = communeWithPet;
  window.takePetToVet = takePetToVet;
  window.tickPetsYear = tickPetsYear;
})();
