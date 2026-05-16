/**
 * Generate synthetic EV journey data for demo purposes.
 * Based on realistic UK driving patterns.
 */

const UK_ADDRESSES = [
  // London area
  { addr: '10 Downing St, Westminster, London SW1A 2AA', lat: 51.5034, lng: -0.1276 },
  { addr: 'Camden Town, London NW1 8AH', lat: 51.5390, lng: -0.1426 },
  { addr: 'Shoreditch, London E1 6PP', lat: 51.5245, lng: -0.0781 },
  { addr: 'King\'s Cross, London WC1X 9AB', lat: 51.5316, lng: -0.1232 },
  { addr: 'Canary Wharf, London E14 5AB', lat: 51.5054, lng: -0.0235 },
  { addr: 'Richmond, London TW9 1TA', lat: 51.4613, lng: -0.3037 },
  { addr: 'Greenwich, London SE10 8QY', lat: 51.4826, lng: 0.0077 },
  { addr: 'Brixton, London SW2 1JX', lat: 51.4613, lng: -0.1150 },
  // Manchester
  { addr: 'Spinningfields, Manchester M3 3AE', lat: 53.4808, lng: -2.2523 },
  { addr: 'Northern Quarter, Manchester M4 1SN', lat: 53.4835, lng: -2.2354 },
  { addr: 'Salford Quays, Manchester M50 3AZ', lat: 53.4719, lng: -2.2966 },
  // Birmingham
  { addr: 'Birmingham City Centre, B2 4QA', lat: 52.4814, lng: -1.8998 },
  { addr: 'Edgbaston, Birmingham B15 2TT', lat: 52.4548, lng: -1.9200 },
  // Bristol
  { addr: 'Clifton, Bristol BS8 1TH', lat: 51.4648, lng: -2.6197 },
  { addr: 'Bristol Temple Meads, BS1 6QF', lat: 51.4490, lng: -2.5815 },
  // Edinburgh
  { addr: 'Princes Street, Edinburgh EH2 2AN', lat: 55.9533, lng: -3.1883 },
  { addr: 'Leith, Edinburgh EH6 6SA', lat: 55.9761, lng: -3.1705 },
  // Oxford/Cambridge
  { addr: 'Oxford City Centre, OX1 1PE', lat: 51.7520, lng: -1.2577 },
  { addr: 'Cambridge CB2 1TN', lat: 52.2053, lng: 0.1218 },
];

const CATEGORIES = ['Commute', 'Commute', 'Commute', 'Commute', 'Leisure', 'Shopping', 'Errands', 'Trip'];

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateDemoData(numTrips = 120) {
  const journeys = [];
  let odometer = 15000;
  const startDate = new Date('2025-06-01T00:00:00');

  // Pick 3-4 "home base" locations
  const homeBases = [];
  const usedIndices = new Set();
  const numHomes = 3;
  while (homeBases.length < numHomes) {
    const idx = Math.floor(Math.random() * UK_ADDRESSES.length);
    if (!usedIndices.has(idx)) {
      usedIndices.add(idx);
      homeBases.push(UK_ADDRESSES[idx]);
    }
  }

  for (let i = 0; i < numTrips; i++) {
    // Advance date by 1-3 days
    startDate.setDate(startDate.getDate() + Math.floor(randomBetween(1, 3)));

    // Decide start location — 60% chance from a home base
    const startLoc = Math.random() < 0.6 ? pick(homeBases) : pick(UK_ADDRESSES);

    // Decide end location — 40% chance returning to a home base
    let endLoc;
    if (Math.random() < 0.4) {
      endLoc = pick(homeBases);
    } else {
      endLoc = pick(UK_ADDRESSES);
    }

    // Ensure different locations
    while (endLoc.addr === startLoc.addr) {
      endLoc = pick(UK_ADDRESSES);
    }

    // Distance based on category
    const category = pick(CATEGORIES);
    let distance;
    switch (category) {
      case 'Commute': distance = randomBetween(5, 35); break;
      case 'Leisure': distance = randomBetween(10, 80); break;
      case 'Shopping': distance = randomBetween(3, 20); break;
      case 'Errands': distance = randomBetween(2, 15); break;
      case 'Trip': distance = randomBetween(40, 200); break;
      default: distance = randomBetween(5, 50);
    }

    // Polestar 2 efficiency: ~140-190 Wh/mi depending on conditions
    const efficiency = randomBetween(140, 190);
    const consumption = (distance * efficiency) / 1000;

    // SOC
    const socStart = Math.round(randomBetween(25, 95));
    const socUsed = Math.round((consumption / 69) * 100); // ~69 kWh battery
    const socEnd = Math.max(5, socStart - socUsed);

    // Departure time — weighted toward morning and evening
    let hour;
    const timeRoll = Math.random();
    if (timeRoll < 0.35) hour = Math.floor(randomBetween(6, 9));       // morning commute
    else if (timeRoll < 0.65) hour = Math.floor(randomBetween(16, 19)); // evening commute
    else if (timeRoll < 0.85) hour = Math.floor(randomBetween(11, 15)); // midday
    else hour = Math.floor(randomBetween(9, 16));                       // other

    const startMin = Math.floor(randomBetween(0, 59));
    const durationMin = Math.round(distance * randomBetween(1.5, 3)); // minutes
    const endMin = startMin + durationMin;

    const startDateTime = new Date(startDate);
    startDateTime.setHours(hour, startMin, 0);
    const endDateTime = new Date(startDateTime.getTime() + durationMin * 60000);

    odometer += distance;

    journeys.push({
      id: i,
      startDate: startDateTime,
      endDate: endDateTime,
      startAddress: startLoc.addr,
      endAddress: endLoc.addr,
      distance: Math.round(distance * 100) / 100,
      consumption: Math.round(consumption * 1000) / 1000,
      category,
      tripType: 'SINGLE',
      socStart,
      socEnd,
      startOdometer: Math.round((odometer - distance) * 100) / 100,
      endOdometer: Math.round(odometer * 100) / 100,
      startLat: startLoc.lat + randomBetween(-0.01, 0.01),
      startLng: startLoc.lng + randomBetween(-0.01, 0.01),
      endLat: endLoc.lat + randomBetween(-0.01, 0.01),
      endLng: endLoc.lng + randomBetween(-0.01, 0.01),
      comments: '',
      duration: durationMin,
      efficiency: Math.round(efficiency),
      avgSpeed: Math.round((distance / (durationMin / 60)) * 100) / 100,
      socDelta: socStart - socEnd,
    });
  }

  return journeys;
}
