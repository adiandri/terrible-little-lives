// 100-Gift Catalog & Gifting Engine for Terrible Little Lives
// Features 100 diverse gifts across 5 tiers: Free/Handmade, Everyday Treats, Thoughtful, Luxury, and Occult Relics.

const GIFTS_DATA = [
  // ==========================================
  // TIER 1: FREE / HANDMADE / FOUND (20 Gifts) - Cost: $0
  // ==========================================
  { id: "g_dandelion", name: "Dandelion & Clover Bouquet", tier: "free", baseUSD: 0, category: "nature",
    desc: "A cluster of freshly plucked yellow dandelions tied with yellow sewing thread." },
  { id: "g_origami", name: "Intricate Origami Crane", tier: "free", baseUSD: 0, category: "handmade",
    desc: "Folded from vintage newspaper columns with precise geometric wings." },
  { id: "g_canal_quartz", name: "Water-Carved Canal Quartz", tier: "free", baseUSD: 0, category: "found",
    desc: "A milky white river pebble worn smooth by decades of dark canal currents." },
  { id: "g_pressed_fern", name: "Pressed Maidenhair Fern", tier: "free", baseUSD: 0, category: "nature",
    desc: "Preserved between parchment sheets from an old encyclopedia." },
  { id: "g_mixtape", name: "Rewritable Cassette Mixtape", tier: "free", baseUSD: 0, category: "handmade",
    desc: "Recorded off late-night college radio with handwritten track titles in pencil." },
  { id: "g_poem", name: "Handwritten Stanza Poem", tier: "free", baseUSD: 0, category: "creative",
    desc: "Rhyming verses about winter frost, quiet chimneys, and enduring companionship." },
  { id: "g_carved_whistle", name: "Carved Willow Whistle", tier: "free", baseUSD: 0, category: "handmade",
    desc: "Whittled from fallen birch wood, sounding a soft, melancholic high note." },
  { id: "g_sea_glass", name: "Cobalt Blue Sea Glass", tier: "free", baseUSD: 0, category: "found",
    desc: "Frosted bottle glass tumbled smooth by saltwater waves." },
  { id: "g_crayon_portrait", name: "Crayon Family Portrait", tier: "free", baseUSD: 0, category: "creative",
    desc: "Drawn in waxy charcoal and crimson crayon on the back of a paper grocery sack." },
  { id: "g_friendship_bracelet", name: "Braided Cord Bracelet", tier: "free", baseUSD: 0, category: "handmade",
    desc: "Woven from leftover embroidery floss in interlocking geometric zigzags." },
  { id: "g_lavender_sachet", name: "Dried Lavender Cloth Sachet", tier: "free", baseUSD: 0, category: "handmade",
    desc: "Filled with crushed garden blossoms that release a soothing, calming scent." },
  { id: "g_paper_skull", name: "Papier-Mâché Miniature Skull", tier: "free", baseUSD: 0, category: "creative",
    desc: "Crafted from flour paste and newsprint, painted in matte soot-black." },
  { id: "g_painted_stone", name: "Painted Garden River Stone", tier: "free", baseUSD: 0, category: "handmade",
    desc: "A dark basalt stone painted with a glowing silver crescent moon." },
  { id: "g_fortune_teller", name: "Paper Fortune Origami", tier: "free", baseUSD: 0, category: "creative",
    desc: "Folded paper game predicting bizarre omens and unexpected fortune." },
  { id: "g_bookmark", name: "Botanical Specimen Bookmark", tier: "free", baseUSD: 0, category: "handmade",
    desc: "A pressed crimson maple leaf laminated beneath clear bookbinding film." },
  { id: "g_pinecone", name: "Gilded Sugar Pine Cone", tier: "free", baseUSD: 0, category: "found",
    desc: "Gathered from the city cemetery outskirts, tipped with pale metallic dust." },
  { id: "g_wire_ring", name: "Twisted Copper Wire Ring", tier: "free", baseUSD: 0, category: "handmade",
    desc: "Salvaged from an uncoiled motor and buffed until it glows warm orange." },
  { id: "g_seashell", name: "Spiral Whelk Seashell", tier: "free", baseUSD: 0, category: "found",
    desc: "Holding it to your ear echoes with distant ocean winds and static." },
  { id: "g_clay_figurine", name: "Dried Clay Beast Figurine", tier: "free", baseUSD: 0, category: "handmade",
    desc: "Shaped from muddy ditch clay and dried near the furnace vent." },
  { id: "g_book_clipping", name: "Archived Newspaper Clipping", tier: "free", baseUSD: 0, category: "found",
    desc: "A vintage photograph from 1954 showing the municipal clocktower under heavy fog." },

  // ==========================================
  // TIER 2: EVERYDAY TREATS & CONFECTIONS (25 Gifts) - Cost: $5 - $25
  // ==========================================
  { id: "g_cinnamon_buns", name: "Warm Honey Cinnamon Buns", tier: "treat", baseUSD: 12, category: "food",
    desc: "Freshly glazed from the corner bakery, steaming through parchment wrapping." },
  { id: "g_thermos_coffee", name: "Vintage Thermos of Dark Roast", tier: "treat", baseUSD: 14, category: "food",
    desc: "Steaming chicory blend coffee in a heavy chrome vacuum flask." },
  { id: "g_peppermint_choc", name: "Box of Dark Peppermint Bark", tier: "treat", baseUSD: 15, category: "food",
    desc: "Crushed candy cane embedded in 72% bittersweet cacao squares." },
  { id: "g_vintage_vinyl", name: "Secondhand 45 RPM Vinyl Single", tier: "treat", baseUSD: 18, category: "media",
    desc: "A crackling 1978 soul record with a slightly faded monochrome paper sleeve." },
  { id: "g_arcade_tokens", name: "Heavy Pouch of Arcade Tokens", tier: "treat", baseUSD: 16, category: "leisure",
    desc: "Fifty stamped brass tokens jingling with promise for pinball and fighting cabs." },
  { id: "g_dark_sunglasses", name: "Acetate Cat-Eye Sunglasses", tier: "treat", baseUSD: 20, category: "apparel",
    desc: "Pitch-tinted ultraviolet lenses to shield eyes from harsh fluorescent glare." },
  { id: "g_wool_mittens", name: "Knitted Charcoal Wool Mittens", tier: "treat", baseUSD: 18, category: "apparel",
    desc: "Thick cable-knit wool lined with fleece to ward off bitter winter chill." },
  { id: "g_mystery_novel", name: "Vintage Pulp Mystery Paperback", tier: "treat", baseUSD: 10, category: "books",
    desc: "A yellowed 1960s crime paperback smelling richly of cedar and aged glue." },
  { id: "g_boba_tea", name: "Taro Milk Tea with Brown Sugar Pearls", tier: "treat", baseUSD: 8, category: "food",
    desc: "Chilled sweet tea topped with chewy tapioca boba and sealed in plastic." },
  { id: "g_enamel_pin", name: "Gothic Moth Cloisonné Enamel Pin", tier: "treat", baseUSD: 12, category: "accessories",
    desc: "Polished gold plating depicting a death's-head hawk moth." },
  { id: "g_butter_cookies", name: "Royal Danish Butter Cookie Tin", tier: "treat", baseUSD: 14, category: "food",
    desc: "The classic blue tin filled with sugar-crusted pretzels and vanilla rings." },
  { id: "g_cedar_candle", name: "Hand-Poured Rain & Cedar Candle", tier: "treat", baseUSD: 22, category: "home",
    desc: "Soy wax candle in an amber glass jar smelling like wet moss and timber." },
  { id: "g_silk_scarf", name: "Thrifted Paisley Silk Scarf", tier: "treat", baseUSD: 24, category: "apparel",
    desc: "Soft burgundy silk patterned with intricate teardrop flourishes." },
  { id: "g_gummy_candies", name: "Imported Sour Lingonberry Candies", tier: "treat", baseUSD: 9, category: "food",
    desc: "Chewy sugar-coated berries with a sharp, mouth-puckering bite." },
  { id: "g_pocket_sketchbook", name: "Linen-Bound Pocket Sketchbook", tier: "treat", baseUSD: 15, category: "stationery",
    desc: "Heavyweight toothy cotton paper suitable for ink washes and charcoal." },
  { id: "g_espresso_beans", name: "Bag of Velvet Espresso Roast Beans", tier: "treat", baseUSD: 18, category: "food",
    desc: "Whole beans roasted in iron drums with notes of molasses and smoke." },
  { id: "g_comic_issue1", name: "Reprint of 1953 Horror Comic", tier: "treat", baseUSD: 10, category: "books",
    desc: "Tales of subterranean crypts and vengeful mannequins in bold four-color print." },
  { id: "g_succulent_pot", name: "Potted Haworthia Succulent", tier: "treat", baseUSD: 16, category: "nature",
    desc: "A hardy zebra-striped succulent planted in a hand-thrown terracotta cup." },
  { id: "g_pocket_torch", name: "Brass Keyring Flashlight", tier: "treat", baseUSD: 20, category: "tools",
    desc: "Compact LED bulb casting a crisp beam to illuminate pitch-black alleyways." },
  { id: "g_earmuffs", name: "Plush Velvet Winter Earmuffs", tier: "treat", baseUSD: 17, category: "apparel",
    desc: "Padded in faux shearling to mute the howl of freezing rain." },
  { id: "g_artisanal_jam", name: "Wild Blackberry & Thyme Jam", tier: "treat", baseUSD: 11, category: "food",
    desc: "Simmered in copper cauldrons with unrefined cane sugar." },
  { id: "g_matchbox_car", name: "Die-Cast 1971 Muscle Car Toy", tier: "treat", baseUSD: 8, category: "leisure",
    desc: "Heavy zinc alloy toy car with opening doors and rubber tires." },
  { id: "g_gourmet_chocolates", name: "Artisanal Sea Salt Truffle Box", tier: "treat", baseUSD: 22, category: "food",
    desc: "Twelve ganache truffles dusted with bitter Dutch cocoa powder." },
  { id: "g_fountain_pen_ink", name: "Bottle of Oxford Blue Fountain Ink", tier: "treat", baseUSD: 15, category: "stationery",
    desc: "Deep indigo dye formulated for smooth wet archival calligraphy." },
  { id: "g_playing_cards", name: "Bicycle Vintage Ghost Playing Cards", tier: "treat", baseUSD: 13, category: "leisure",
    desc: "Monochrome deck inverted with jet black pips and silver foil trim." },

  // ==========================================
  // TIER 3: THOUGHTFUL KEEPSAKES & RECREATION (25 Gifts) - Cost: $30 - $120
  // ==========================================
  { id: "g_leather_journal", name: "Embossed Full-Grain Leather Journal", tier: "thoughtful", baseUSD: 45, category: "stationery",
    desc: "Thick deckle-edge paper bound in supple saddle-stitched buffalo leather." },
  { id: "g_cashmere_beanie", name: "Pure Mongolian Cashmere Beanie", tier: "thoughtful", baseUSD: 60, category: "apparel",
    desc: "Incredibly soft ribbed charcoal knit that feels weightless yet warm." },
  { id: "g_polaroid_camera", name: "Vintage Instant Print Camera", tier: "thoughtful", baseUSD: 85, category: "electronics",
    desc: "Boxy analog camera that spits out glossy white-bordered photos in 60 seconds." },
  { id: "g_framed_photo", name: "Archival Brass Framed Portrait", tier: "thoughtful", baseUSD: 40, category: "home",
    desc: "A treasured photograph preserved behind non-reflective museum glass." },
  { id: "g_acoustic_strings", name: "Phosphor Bronze Strings & Bone Picks", tier: "thoughtful", baseUSD: 35, category: "music",
    desc: "Delivering bright, resonant acoustic tone and long sustain." },
  { id: "g_brass_compass", name: "Antiqued Maritime Pocket Compass", tier: "thoughtful", baseUSD: 55, category: "tools",
    desc: "Jeweled needle floating in dampening fluid within an engraved brass lid." },
  { id: "g_vintage_trench", name: "Waterproof Belted Trench Coat", tier: "thoughtful", baseUSD: 110, category: "apparel",
    desc: "Classic double-breasted gabardine coat designed to brave relentless storms." },
  { id: "g_mech_pencil_set", name: "Drafting Mechanical Pencil Set", tier: "thoughtful", baseUSD: 48, category: "stationery",
    desc: "Brushed steel barrels with balanced knurled grips and HB graphite refills." },
  { id: "g_ceramic_teapot", name: "Stoneware Teapot with Infuser", tier: "thoughtful", baseUSD: 52, category: "home",
    desc: "Matte iron-glaze kettle designed for slow Gongfu brewing." },
  { id: "g_english_tea_crate", name: "Crate of Fortnum & Mason Loose Teas", tier: "thoughtful", baseUSD: 65, category: "food",
    desc: "Tin canisters of Queen Anne blend, Smoky Earl Grey, and Ceylon Orange Pekoe." },
  { id: "g_wool_cardigan", name: "Heavy Fisherman's Cable Cardigan", tier: "thoughtful", baseUSD: 95, category: "apparel",
    desc: "Spun from undyed sheep's wool with natural lanolin scent." },
  { id: "g_cologne_rain", name: "Bespoke Perfume: 'Rain & Wet Earth'", tier: "thoughtful", baseUSD: 80, category: "cosmetics",
    desc: "Notes of petrichor, damp granite, vetiver roots, and cold ozone." },
  { id: "g_museum_pass", name: "Annual City Fine Arts & Museum Pass", tier: "thoughtful", baseUSD: 90, category: "experiences",
    desc: "Unlimited admission to contemporary galleries, paleontology stacks, and vaults." },
  { id: "g_noise_headphones", name: "Padded Studio Monitor Headphones", tier: "thoughtful", baseUSD: 115, category: "electronics",
    desc: "Over-ear velvet cups that seal out urban transit rumble completely." },
  { id: "g_silver_signet", name: "Sterling Silver Monogram Signet Ring", tier: "thoughtful", baseUSD: 75, category: "jewelry",
    desc: "Solid 925 silver with a clean rectangular face ready for wax sealing." },
  { id: "g_pocket_knife", name: "Damascus Steel Folding Pocket Knife", tier: "thoughtful", baseUSD: 70, category: "tools",
    desc: "Rosewood handle scales and an undulating forged steel blade with brass bolsters." },
  { id: "g_watercolor_kit", name: "Sennelier French Watercolor Field Kit", tier: "thoughtful", baseUSD: 68, category: "creative",
    desc: "Honey-based pigment pans in an enamel box with a kolinsky sable brush." },
  { id: "g_cinema_pass", name: "Indie Art-House Cinema Season Pass", tier: "thoughtful", baseUSD: 85, category: "experiences",
    desc: "Ticket booklet for midnight film revivals, European dramas, and cult horrors." },
  { id: "g_velvet_blanket", name: "Weighted Midnight Velvet Quilt", tier: "thoughtful", baseUSD: 90, category: "home",
    desc: "Fifteen pounds of glass microbeads encased in tufted midnight blue velvet." },
  { id: "g_leather_satchel", name: "Waxed Canvas & Leather Messenger Bag", tier: "thoughtful", baseUSD: 105, category: "accessories",
    desc: "Water-resistant army duck canvas reinforced with copper rivets." },
  { id: "g_music_box", name: "Hand-Cranked Mahogany Music Box", tier: "thoughtful", baseUSD: 50, category: "home",
    desc: "Plays a poignant 18-note melody from an unreleased lullaby." },
  { id: "g_boardgame", name: "Vintage Wooden Chess & Go Set", tier: "thoughtful", baseUSD: 65, category: "leisure",
    desc: "Carved boxwood pieces resting on a velvet-lined walnut board." },
  { id: "g_fountain_pen", name: "Gold-Nibbed Resin Fountain Pen", tier: "thoughtful", baseUSD: 110, category: "stationery",
    desc: "14k gold nib with smooth piston-fill mechanism gliding across paper." },
  { id: "g_leather_gloves", name: "Cashmere-Lined Kidskin Leather Gloves", tier: "thoughtful", baseUSD: 85, category: "apparel",
    desc: "Supple black kidskin that fits like a second skin against bitter drafts." },
  { id: "g_bonsai_tree", name: "Ten-Year Japanese Juniper Bonsai", tier: "thoughtful", baseUSD: 95, category: "nature",
    desc: "Trained over decades into windswept asymmetry inside a stoneware basin." },

  // ==========================================
  // TIER 4: LUXURY & SPLURGE GIFTS (15 Gifts) - Cost: $180 - $2,500+
  // ==========================================
  { id: "g_smartphone", name: "Flagship High-Performance Smartphone", tier: "luxury", baseUSD: 850, category: "electronics",
    desc: "Sleek titanium chassis, crisp OLED display, and high-resolution camera array." },
  { id: "g_luxury_watch", name: "Swiss Automatic Mechanical Chronograph", tier: "luxury", baseUSD: 1400, category: "jewelry",
    desc: "Exhibition caseback showing oscillating gears, sapphire crystal, and alligator strap." },
  { id: "g_game_console", name: "Next-Gen 4K Entertainment Console", tier: "luxury", baseUSD: 500, category: "electronics",
    desc: "Ultra-fast SSD loading and two haptic feedback wireless controllers." },
  { id: "g_gold_necklace", name: "18k Solid Gold Chain & Locket", tier: "luxury", baseUSD: 650, category: "jewelry",
    desc: "Heavy herringbone gold link supporting an oval locket with secret clasp." },
  { id: "g_record_player", name: "Audiophile Direct-Drive Turntable", tier: "luxury", baseUSD: 450, category: "audio",
    desc: "Carbon-fiber tonearm and magnetic cartridge with warm vacuum-tube preamp." },
  { id: "g_designer_boots", name: "Bespoke Goodyear-Welted Leather Boots", tier: "luxury", baseUSD: 380, category: "apparel",
    desc: "Handcrafted Horween leather that patinas beautifully with decades of wear." },
  { id: "g_diamond_earrings", name: "Platinum Diamond Solitaire Studs", tier: "luxury", baseUSD: 950, category: "jewelry",
    desc: "Brilliant-cut conflict-free diamonds catching the light with blinding clarity." },
  { id: "g_designer_handbag", name: "Italian Calfskin Designer Tote", tier: "luxury", baseUSD: 1200, category: "accessories",
    desc: "Hand-stitched in Milan with minimalist lines and palladium hardware." },
  { id: "g_electric_bike", name: "Matte Black Commuter Electric Bicycle", tier: "luxury", baseUSD: 1600, category: "transport",
    desc: "Integrated battery, quiet hub motor, and hydraulic disc brakes for wet city asphalt." },
  { id: "g_espresso_machine", name: "Dual-Boiler Italian Espresso Machine", tier: "luxury", baseUSD: 1800, category: "home",
    desc: "Commercial rotary pump and saturated grouphead for barista-grade extraction." },
  { id: "g_cabin_getaway", name: "Weekend Mountain Cabin Retreat Voucher", tier: "luxury", baseUSD: 600, category: "experiences",
    desc: "A fully paid weekend sequestered in a remote timber lodge with a roaring fireplace." },
  { id: "g_first_edition_novel", name: "Signed First Edition 1927 Gothic Novel", tier: "luxury", baseUSD: 750, category: "books",
    desc: "Immaculate dust jacket wrapped in Mylar, signed by a long-dead literary master." },
  { id: "g_cashmere_overcoat", name: "Double-Faced Cashmere Overcoat", tier: "luxury", baseUSD: 1100, category: "apparel",
    desc: "Tailored to drape perfectly over shoulders with silky horn buttons." },
  { id: "g_surround_sound", name: "Hi-Fi Atmospheric Tower Speaker Pair", tier: "luxury", baseUSD: 900, category: "audio",
    desc: "Room-filling sonic immersion calibrated for dark ambient music and film." },
  { id: "g_motorcycle", name: "Restored 1974 Vintage Cafe Racer", tier: "luxury", baseUSD: 2800, category: "transport",
    desc: "Air-cooled twin cylinder engine purring with raw mechanical rhythm." },

  // ==========================================
  // TIER 5: OCCULT, GOTHIC & PARANORMAL RELICS (15 Gifts) - Cost: Cash or Shillings!
  // ==========================================
  { id: "g_obsidian_pendant", name: "Carved Obsidian Hex Talisman", tier: "occult", baseUSD: 30, shillingsCost: 1, category: "relic",
    desc: "Volcanic glass carved with unreadable runes that feel unnaturally freezing to the touch." },
  { id: "g_bone_marrow", name: "Jar of Fresh Butcher's Bone Marrow", tier: "occult", baseUSD: 25, shillingsCost: 0, category: "flesh",
    desc: "Thick unrendered marrow bones wrapped in butcher's brown paper and twine." },
  { id: "g_silver_sigil_coin", name: "Silver Coin with the Unblinking Eye", tier: "occult", baseUSD: 40, shillingsCost: 2, category: "relic",
    desc: "Stamped with an eye crest that seems to tilt toward you when looked at from an angle." },
  { id: "g_grave_soil", name: "Glass Vial of 1888 Cemetery Dirt", tier: "occult", baseUSD: 20, shillingsCost: 1, category: "curio",
    desc: "Gathered beneath ancient weeping willows during the darkest phase of the moon." },
  { id: "g_brass_bell", name: "Clapperless Brass Shrine Bell", tier: "occult", baseUSD: 50, shillingsCost: 2, category: "relic",
    desc: "Though it has no iron clapper inside, it chimes in dead silence whenever someone lies." },
  { id: "g_wolfsbane_resin", name: "Wolfsbane Blossom Sealed in Amber Resin", tier: "occult", baseUSD: 35, shillingsCost: 1, category: "botanical",
    desc: "The purple petals are frozen in golden fossilized sap, toxic and beautiful." },
  { id: "g_grimoire_page", name: "Vellum Grimoire Page from 1692", tier: "occult", baseUSD: 75, shillingsCost: 3, category: "texts",
    desc: "Sheepskin vellum bearing sigils to ward off uninvited nocturnal visitors." },
  { id: "g_delay_mirror", name: "Tarnished Mirror with 1-Second Delay", tier: "occult", baseUSD: 90, shillingsCost: 4, category: "anomaly",
    desc: "Your reflection blinks half a second after you do. It cannot be explained by physics." },
  { id: "g_cursed_musicbox", name: "Minor-Key Velvet Music Box", tier: "occult", baseUSD: 60, shillingsCost: 2, category: "relic",
    desc: "Plays an eerie waltz in minor fifths that makes dogs outside whimper and howl." },
  { id: "g_raven_claw", name: "Silver-Capped Taxidermy Raven Claw", tier: "occult", baseUSD: 45, shillingsCost: 1, category: "curio",
    desc: "Clutching a small spherical marble of cloudy black quartz." },
  { id: "g_wax_effigy", name: "Beeswax Effigy with Bound Silk Thread", tier: "occult", baseUSD: 30, shillingsCost: 1, category: "relic",
    desc: "A humanoid figure sculpted from yellow beeswax and bound in knot-magic." },
  { id: "g_phantom_cassette", name: "Phantom Frequency Audio Cassette", tier: "occult", baseUSD: 35, shillingsCost: 2, category: "media",
    desc: "Labeled '3:14 AM Channel 0'. Playing it produces rhythmic sub-bass breathing." },
  { id: "g_bone_dice", name: "Hand-Carved Human Bone Dice Pair", tier: "occult", baseUSD: 65, shillingsCost: 3, category: "curio",
    desc: "Weighted with lead fillings; they roll with a dull, hollow clatter." },
  { id: "g_cemetery_water", name: "Apothecary Bottle of Storm Water", tier: "occult", baseUSD: 20, shillingsCost: 1, category: "curio",
    desc: "Collected from the gutters of an abandoned mausoleum during a thunderstorm." },
  { id: "g_obsidian_blade", name: "Ritual Obsidian Flaked Athame", tier: "occult", baseUSD: 120, shillingsCost: 5, category: "relic",
    desc: "Razor-sharp volcanic glass blade bound with rawhide strips and silver wire." }
];

// Returns a balanced rotating selection of gifts (e.g. 7 gifts)
function getRandomGiftSelection(character, count = 7) {
  const country = window.COUNTRIES_DATA[character.countryCode] || window.COUNTRIES_DATA.USA;
  const mult = country.wageMultiplier || 1.0;

  // Pick 2 free, 2 treat, 2 thoughtful/luxury, 1 occult
  const freePool = GIFTS_DATA.filter(g => g.tier === 'free');
  const treatPool = GIFTS_DATA.filter(g => g.tier === 'treat');
  const midPool = GIFTS_DATA.filter(g => g.tier === 'thoughtful');
  const luxPool = GIFTS_DATA.filter(g => g.tier === 'luxury');
  const occultPool = GIFTS_DATA.filter(g => g.tier === 'occult');

  const shuffle = (arr) => [...arr].sort(() => 0.5 - Math.random());

  const selected = [
    ...shuffle(freePool).slice(0, 2),
    ...shuffle(treatPool).slice(0, 2),
    ...shuffle(midPool).slice(0, 1),
    ...shuffle(luxPool).slice(0, 1),
    ...shuffle(occultPool).slice(0, 1)
  ];

  // If count is higher, top up from treat or thoughtful
  while (selected.length < count) {
    const extra = shuffle([...treatPool, ...midPool])[0];
    if (!selected.find(s => s.id === extra.id)) {
      selected.push(extra);
    }
  }

  // Calculate dynamic local price
  return selected.map(g => {
    const localPrice = g.baseUSD === 0 ? 0 : Math.round(g.baseUSD * mult);
    return {
      ...g,
      localPrice,
      priceFormatted: g.baseUSD === 0 ? "FREE" : window.formatMoney(localPrice, character.countryCode)
    };
  });
}

// Calculate recipient reaction based on gift and recipient identity
function calculateGiftReaction(gift, person, character) {
  const isEntity = person.isRevealed && person.entityType !== 'human';
  let relGain = 10;
  let hapGain = 4;
  let quote = "";
  let occultGain = 0;
  let sanityDelta = 0;
  let loyaltyUpdated = false;

  // 1. RECIPIENT: Unmasked Entity / Anomaly
  if (isEntity) {
    if (gift.tier === 'occult') {
      relGain = 25 + Math.floor(Math.random() * 10);
      hapGain = 6;
      occultGain = 8;
      loyaltyUpdated = true;
      person.loyalty = 'loyal';
      const entityResponses = [
        `"${gift.name}... you understand what we hunger for. The scent of void resonates deeply."`,
        `Their pupils dilated completely black as they accepted ${gift.name}. "Your devotion will be repaid in silver and shadows."`,
        `A low harmonic purr resonated from their throat as they pocketed the relic.`
      ];
      quote = window.getRandomElement(entityResponses);
    } else if (gift.tier === 'free') {
      relGain = 8;
      quote = `They inspected your ${gift.name} with cold curiosity. "A quaint mortal token. We shall preserve it."`;
    } else {
      relGain = 12;
      quote = `They accepted ${gift.name} with an inscrutable tilt of their head. "Mortal luxury... amusing."`;
    }
    return {
      success: true,
      message: `${person.name} received ${gift.name}!\n${quote}`,
      relGain,
      effects: { relationship: relGain, happiness: hapGain, occult: occultGain },
      loyaltyUpdated
    };
  }

  // 2. RECIPIENT: Normal Kin (Parents, Grandparents, Siblings, Friends)
  const isParent = person.role.includes('Father') || person.role.includes('Mother');
  const isGrand = person.role.includes('Grand');
  const isSibling = person.role.includes('Brother') || person.role.includes('Sister');

  // Occult gifts given to normal humans cause distress / suspicion!
  if (gift.tier === 'occult') {
    relGain = -8;
    sanityDelta = -4;
    hapGain = -5;
    if (isParent) {
      quote = `"${person.name} pulled their hand back in horror: 'Where on earth did you get this?! This is morbid and sickening. Throw it away at once!'"`;
    } else if (isGrand) {
      relGain = 10; // Grandparents might recognize folklore
      occultGain = 4;
      sanityDelta = 0;
      quote = `"${person.name} narrowed their eyes and whispered: 'This crest... keep it out of the sight of mirrors, child.'"`;
    } else {
      quote = `"${person.name} recoiled with disgust: 'Why would you give me this?! That is seriously creepy.' (-Closeness)"`;
    }
    return {
      success: true,
      message: `You handed ${gift.name} to ${person.name}.\n${quote}`,
      relGain,
      effects: { relationship: relGain, happiness: hapGain, sanity: sanityDelta, occult: occultGain },
      loyaltyUpdated: false
    };
  }

  // Normal / Luxury / Handmade gifts
  if (gift.tier === 'free') {
    if (isParent) {
      relGain = 16 + Math.floor(Math.random() * 5); // Parents love handmade
      quote = `"${person.name} teared up looking at ${gift.name}: 'Did you make this for me? I will treasure it forever.' (+Closeness)"`;
    } else if (isGrand) {
      relGain = 20 + Math.floor(Math.random() * 6);
      quote = `"${person.name} hugged you tightly: 'Such thoughtful effort means more to me than all the gold in the city.'"`;
    } else if (isSibling) {
      relGain = 12;
      quote = `"${person.name} grinned: 'Hey, this is actually pretty neat. Thanks!'"`;
    } else {
      relGain = 14;
      quote = `"${person.name} smiled warmly: 'That's so sweet of you to think of me!'"`;
    }
  } else if (gift.tier === 'treat') {
    relGain = 14 + Math.floor(Math.random() * 6);
    if (gift.category === 'food') {
      quote = `"${person.name} eagerly unpacked the treat: 'Mmm, this is delicious! Thank you so much.'"`;
    } else {
      quote = `"${person.name} was delighted: 'Oh, I love this! You always know what to get.'"`;
    }
  } else if (gift.tier === 'thoughtful') {
    relGain = 22 + Math.floor(Math.random() * 8);
    hapGain = 6;
    quote = `"${person.name} was blown away by ${gift.name}: 'This is so incredibly generous and thoughtful. I don't even know what to say!'"`;
  } else if (gift.tier === 'luxury') {
    relGain = 32 + Math.floor(Math.random() * 10);
    hapGain = 10;
    quote = `"${person.name}'s jaw dropped looking at ${gift.name}: 'Are you serious?! You spent this much on me?! You are unbelievable!'"`;
  }

  return {
    success: true,
    message: `You presented ${gift.name} to ${person.name}.\n${quote}`,
    relGain,
    effects: { relationship: relGain, happiness: hapGain, sanity: sanityDelta, occult: occultGain },
    loyaltyUpdated: false
  };
}

window.GIFTS_DATA = GIFTS_DATA;
window.getRandomGiftSelection = getRandomGiftSelection;
window.calculateGiftReaction = calculateGiftReaction;
