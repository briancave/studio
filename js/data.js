// Star Citizen ship data — SCU capacities
const SHIPS = [
  { name: "Aurora CL", scu: 6 },
  { name: "Aurora MR", scu: 3 },
  { name: "Avenger Titan", scu: 12 },
  { name: "Cutlass Black", scu: 46 },
  { name: "Freelancer", scu: 66 },
  { name: "Freelancer MAX", scu: 120 },
  { name: "Constellation Andromeda", scu: 96 },
  { name: "Constellation Taurus", scu: 174 },
  { name: "Caterpillar", scu: 576 },
  { name: "C2 Hercules", scu: 696 },
  { name: "M2 Hercules", scu: 522 },
  { name: "Hull A", scu: 64 },
  { name: "Hull B", scu: 384 },
  { name: "Hull C", scu: 4608 },
  { name: "RAFT", scu: 96 },
  { name: "Mercury Star Runner", scu: 114 },
  { name: "Nomad", scu: 24 },
  { name: "Pisces", scu: 4 },
  { name: "Prospector", scu: 32 },
  { name: "Mustang Alpha", scu: 3 },
  { name: "300i", scu: 8 },
  { name: "315p", scu: 12 },
  { name: "325a", scu: 4 },
  { name: "400i", scu: 42 },
  { name: "600i Explorer", scu: 40 },
  { name: "Corsair", scu: 72 },
  { name: "Spirit C1", scu: 64 },
];

// Sort ships alphabetically
SHIPS.sort((a, b) => a.name.localeCompare(b.name));

// Major trade locations in Star Citizen
const LOCATIONS = [
  // Stanton system — Crusader and moons
  "Port Olisar",
  "Orison",
  "Covalex Hub Gundo",
  "Crusader — Cellin (Gallete Family Farms)",
  "Crusader — Cellin (Hickes Research)",
  "Crusader — Cellin (Terra Mills)",
  "Crusader — Daymar (ArcCorp Mining 141)",
  "Crusader — Daymar (Bountiful Harvest)",
  "Crusader — Daymar (Kudre Ore)",
  "Crusader — Daymar (Shubin Mining SCD-1)",
  "Crusader — Yela (Benson Mining)",
  "Crusader — Yela (Deakins Research)",
  "Crusader — Yela (GrimHEX)",

  // Stanton system — ArcCorp and moons
  "Area 18",
  "Baijini Point",
  "ArcCorp — Lyria (Humboldt Mines)",
  "ArcCorp — Lyria (Loveridge Mineral Reserve)",
  "ArcCorp — Lyria (Shubin Mining SAL-2)",
  "ArcCorp — Lyria (Shubin Mining SAL-5)",
  "ArcCorp — Wala (ArcCorp Mining 045)",
  "ArcCorp — Wala (Samson & Son's Salvage)",
  "ArcCorp — Wala (Shady Glen Farms)",

  // Stanton system — Hurston and moons
  "Lorville",
  "Everus Harbor",
  "Hurston — Aberdeen (HDMS Brecken)",
  "Hurston — Aberdeen (HDMS Stanhope)",
  "Hurston — Arial (HDMS Bezdek)",
  "Hurston — Arial (HDMS Lathan)",
  "Hurston — Ita (HDMS Ryder)",
  "Hurston — Ita (HDMS Woodruff)",
  "Hurston — Magda (HDMS Hahn)",
  "Hurston — Magda (HDMS Perlman)",

  // Stanton system — MicroTech and moons
  "New Babbage",
  "Port Tressler",
  "MicroTech — Calliope (Rayari Anvik)",
  "MicroTech — Calliope (Rayari Kaltag)",
  "MicroTech — Calliope (Shubin Mining SMCa-6)",
  "MicroTech — Calliope (Shubin Mining SMCa-8)",
  "MicroTech — Clio (Rayari Cantwell)",
  "MicroTech — Clio (Rayari McGrath)",
  "MicroTech — Euterpe (Devlin Scrap & Salvage)",

  // Pyro system
  "Pyro — Ruin Station",
  "Pyro — Checkmate Station",
];

LOCATIONS.sort();

// Common trade commodities in Star Citizen
const COMMODITIES = [
  "Agricultural Supplies",
  "Aluminum",
  "Astatine",
  "Beryl",
  "Chlorine",
  "Compboard",
  "Copper",
  "Corundum",
  "Diamond",
  "Distilled Spirits",
  "Fluorine",
  "Gold",
  "Hydrogen",
  "Iodine",
  "Iron",
  "Laranite",
  "Lithium",
  "Medical Supplies",
  "Processed Food",
  "Quartz",
  "Scrap",
  "Stims",
  "Sunset Berries",
  "Titanium",
  "Tungsten",
  "Waste",
];

COMMODITIES.sort();
