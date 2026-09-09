// Name, Lineage, and Lore Generator for Terrible Little Lives

const GOTHIC_DATA = {
  firstNamesMale: [
    "Alasdair", "Ambrose", "Bartholomew", "Caleb", "Enoch", 
    "Gideon", "Jasper", "Lucien", "Malachi", "Mortimer", 
    "Percival", "Silas", "Thaddeus", "Victor", "Vincent"
  ],
  firstNamesFemale: [
    "Agatha", "Beatrix", "Cordelia", "Dorothea", "Edith", 
    "Eleanor", "Gwendolyn", "Lavinia", "Mercy", "Ophelia", 
    "Prudence", "Rowena", "Sybil", "Tabitha", "Vespera"
  ],
  surnames: [
    "Blackwood", "Crowley", "Danvers", "Duskwood", "Grimm", 
    "Harrow", "Knotwood", "Locke", "Marrow", "Morcant", 
    "Nadir", "Oakhaven", "Ravenscroft", "Vane", "Wickham"
  ],
  birthplaces: [
    "Coldwater Sanitarium (Ward 4)",
    "Blackwood Vale, beside the sunken quarry",
    "Dunwich Quay under an amber fog",
    "St. Jude's Orphanage cellar attic",
    "An isolated salt marsh homestead",
    "The keeper's cottage at Hollow Lighthouse",
    "Gallows Hill tenements during a snowstorm"
  ],
  origins: [
    "You were born with teeth already cutting through your gums. The midwife crossed herself and fled.",
    "The house bells rang backwards for an hour when you drew your first breath.",
    "Your twin was born dead, yet the nurse swore she heard two distinct infant cries in the dark.",
    "A murder of crows roosted above your mother's window and refused to take flight for three days.",
    "You were born during an unmapped total eclipse. The tallow candles produced no heat that night.",
    "Found on the doorstep of the parish mortuary wrapped in yellowed salt-stained wool."
  ]
};

function generateCharacter() {
  const isMale = Math.random() > 0.5;
  const firstName = isMale
    ? GOTHIC_DATA.firstNamesMale[Math.floor(Math.random() * GOTHIC_DATA.firstNamesMale.length)]
    : GOTHIC_DATA.firstNamesFemale[Math.floor(Math.random() * GOTHIC_DATA.firstNamesFemale.length)];
  const surname = GOTHIC_DATA.surnames[Math.floor(Math.random() * GOTHIC_DATA.surnames.length)];
  const birthplace = GOTHIC_DATA.birthplaces[Math.floor(Math.random() * GOTHIC_DATA.birthplaces.length)];
  const origin = GOTHIC_DATA.origins[Math.floor(Math.random() * GOTHIC_DATA.origins.length)];

  return {
    name: `${firstName} ${surname}`,
    gender: isMale ? "Male" : "Female",
    birthplace,
    origin,
    age: 0,
    year: 1888 + Math.floor(Math.random() * 20),
    coin: Math.floor(Math.random() * 12) + 5, // Shillings
    stats: {
      vitality: Math.floor(Math.random() * 20) + 75, // 75-95%
      sanity: Math.floor(Math.random() * 20) + 70,   // 70-90%
      occult: Math.floor(Math.random() * 15) + 10,   // 10-25%
      humanity: Math.floor(Math.random() * 10) + 85  // 85-95%
    },
    statusTitle: "Infant",
    isAlive: true,
    deathCause: null
  };
}

window.generateCharacter = generateCharacter;
