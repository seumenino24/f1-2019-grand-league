// 🏁 F1 2019 Grand Prix League — Ranking System
// Sistema de Pontos + ELO

// ==============================
// 📊 CONFIG
// ==============================

const BASE_ELO = 1000;
const K_FACTOR = 32;

// Pontuação oficial F1 2019 (Top 10)
const racePoints = [
  25, // P1
  18, // P2
  15, // P3
  12, // P4
  10, // P5
  8,  // P6
  6,  // P7
  4,  // P8
  2,  // P9
  1   // P10
];

// ==============================
// 👥 PILOTOS (20)
// ==============================

let drivers = [
  "Hamilton",
  "Bottas",
  "Vettel",
  "Leclerc",
  "Verstappen",
  "Gasly",
  "Sainz",
  "Norris",
  "Ricciardo",
  "Hülkenberg",
  "Alonso",
  "Stroll",
  "Perez",
  "Magnussen",
  "Grosjean",
  "Raikkonen",
  "Giovinazzi",
  "Russell",
  "Kubica",
  "Albon"
];

// ==============================
// 🧠 BANCO DE DADOS FAKE
// ==============================

let ranking = {};

drivers.forEach(name => {
  ranking[name] = {
    elo: BASE_ELO,
    points: 0,
    wins: 0,
    podiums: 0,
    races: 0
  };
});

// ==============================
// 🏁 FUNÇÃO — REGISTRAR CORRIDA
// ==============================

function registerRace(results) {
  // results = array com ordem de chegada
  // Ex: ["Hamilton", "Vettel", "Verstappen", ...]

  results.forEach((driver, position) => {
    const data = ranking[driver];

    // Corridas
    data.races++;

    // Pontos F1
    if (position < racePoints.length) {
      data.points += racePoints[position];
    }

    // Wins / Podiums
    if (position === 0) data.wins++;
    if (position < 3) data.podiums++;
  });

  // ==============================
  // 🧠 ELO CALCULATION
  // ==============================

  for (let i = 0; i < results.length; i++) {
    for (let j = i + 1; j < results.length; j++) {

      let driverA = ranking[results[i]];
      let driverB = ranking[results[j]];

      let expectedA = 1 / (1 + Math.pow(10, (driverB.elo - driverA.elo) / 400));
      let expectedB = 1 / (1 + Math.pow(10, (driverA.elo - driverB.elo) / 400));

      driverA.elo += K_FACTOR * (1 - expectedA);
      driverB.elo += K_FACTOR * (0 - expectedB);
    }
  }

  console.log("Corrida registrada com sucesso 🏁");
}

// ==============================
// 📊 CLASSIFICAÇÃO POR PONTOS
// ==============================

function getStandingsByPoints() {
  return Object.entries(ranking)
    .sort((a, b) => b[1].points - a[1].points);
}

// ==============================
// 🧠 CLASSIFICAÇÃO POR ELO
// ==============================

function getStandingsByElo() {
  return Object.entries(ranking)
    .sort((a, b) => b[1].elo - a[1].elo);
}

// ==============================
// 🖥️ MOSTRAR NO CONSOLE
// ==============================

function showTable(type = "points") {

  let table = type === "elo"
    ? getStandingsByElo()
    : getStandingsByPoints();

  console.table(
    table.map(([name, data]) => ({
      Driver: name,
      Points: data.points,
      ELO: Math.round(data.elo),
      Wins: data.wins,
      Podiums: data.podiums,
      Races: data.races
    }))
  );
}

// ==============================
// 🧪 EXEMPLO DE USO
// ==============================

registerRace([
  "Hamilton",
  "Verstappen",
  "Leclerc",
  "Vettel",
  "Bottas",
  "Sainz",
  "Norris",
  "Ricciardo",
  "Perez",
  "Raikkonen",
  "Albon",
  "Gasly",
  "Stroll",
  "Magnussen",
  "Grosjean",
  "Hülkenberg",
  "Giovinazzi",
  "Russell",
  "Kubica",
  "Alonso"
]);

showTable("points");
showTable("elo");