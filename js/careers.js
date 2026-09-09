// Career & Employment Registry for Terrible Little Lives (Mundane & Paranormal)

const MUNDANE_CAREERS = [
  {
    id: "fast_food",
    title: "Fast Food Crew / Fry Cook",
    minAge: 16,
    baseSalaryUSD: 18000,
    minSmarts: 0,
    stress: 15,
    desc: "Long hours behind burning oil fryers and rude drive-thru customers. It pays minimum wage, but it buys groceries."
  },
  {
    id: "barista",
    title: "Coffee Shop Barista",
    minAge: 17,
    baseSalaryUSD: 24000,
    minSmarts: 25,
    stress: 10,
    desc: "Steaming oat milk and making espresso art while morning commuters rush past under grey city rain."
  },
  {
    id: "delivery_driver",
    title: "App Delivery Courier",
    minAge: 18,
    baseSalaryUSD: 30000,
    minSmarts: 20,
    stress: 20,
    desc: "Navigating nocturnal city gridlock on a scooter with food bags. You see weird things on deserted side streets at 2 AM."
  },
  {
    id: "office_data_clerk",
    title: "Corporate Data Entry Clerk",
    minAge: 19,
    baseSalaryUSD: 42000,
    minSmarts: 50,
    stress: 25,
    desc: "Staring into dual Excel spreadsheets in a fluorescent-lit cubicle farm. Mind-numbing routine, but safe from the dark."
  },
  {
    id: "software_qa",
    title: "Software QA Tester",
    minAge: 20,
    baseSalaryUSD: 58000,
    minSmarts: 65,
    stress: 20,
    desc: "Finding bugs in enterprise cloud software. Sometimes you catch corrupted memory buffers that look like faces."
  },
  {
    id: "registered_nurse",
    title: "Hospital ER Registered Nurse",
    minAge: 22,
    baseSalaryUSD: 75000,
    minSmarts: 70,
    stress: 35,
    desc: "Treating overdoses, car wrecks, and trauma. Night shifts in the ICU where heart monitors beep in the silent ward."
  },
  {
    id: "forensic_accountant",
    title: "Senior Financial Analyst",
    minAge: 24,
    baseSalaryUSD: 92000,
    minSmarts: 80,
    stress: 30,
    desc: "Tracking multi-million dollar corporate transactions and offshore trusts that occasionally fund things that don't exist."
  }
];

const PARANORMAL_CAREERS = [
  {
    id: "morgue_cleaner",
    title: "Nocturnal Mortuary Custodian",
    minAge: 18,
    payoutShillings: 45,
    minOccult: 10,
    sanityCost: 5,
    desc: "Mopping tile floors and stainless steel drainage tables after autopsies. Sometimes the refrigerated drawers rattle."
  },
  {
    id: "urban_streamer",
    title: "Abandoned Sites Livestreamer",
    minAge: 16,
    payoutShillings: 60,
    minOccult: 15,
    sanityCost: 8,
    desc: "Entering condemned sanitariums and drainage tunnels with a gimbal and night-vision cam. Chat donates in Shillings."
  },
  {
    id: "darkweb_transcriber",
    title: "Dark Web Occult Archiver",
    minAge: 18,
    payoutShillings: 90,
    minOccult: 25,
    sanityCost: 12,
    desc: "Transcribing audio files recovered from missing hikers and leaked military hydrophones. The distortion whispers."
  },
  {
    id: "estate_watchman",
    title: "Cursed Property Night Watchman",
    minAge: 20,
    payoutShillings: 130,
    minOccult: 35,
    sanityCost: 15,
    desc: "Spending dusk till dawn guarding foreclosed houses where previous families vanished. Bring salt and cold iron."
  },
  {
    id: "relic_courier",
    title: "Black Market Antiquities Courier",
    minAge: 21,
    payoutShillings: 180,
    minOccult: 45,
    sanityCost: 18,
    desc: "Transporting lead-lined cases across international train stations without opening the seals or looking at the contents."
  },
  {
    id: "exorcist_assistant",
    title: "Independent Exorcist Apprentice",
    minAge: 22,
    payoutShillings: 260,
    minOccult: 60,
    sanityCost: 25,
    desc: "Holding down thrashing victims in basement rituals while speaking ancient Hebrew and Latin backwards. Lethal danger."
  }
];

function getAdjustedSalary(baseUSD, countryCode) {
  const country = window.COUNTRIES_DATA[countryCode] || window.COUNTRIES_DATA.USA;
  return Math.round(baseUSD * country.currency.rate);
}

window.MUNDANE_CAREERS = MUNDANE_CAREERS;
window.PARANORMAL_CAREERS = PARANORMAL_CAREERS;
window.getAdjustedSalary = getAdjustedSalary;
