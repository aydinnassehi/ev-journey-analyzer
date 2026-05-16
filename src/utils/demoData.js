/**
 * Generate synthetic EV journey data for demo purposes.
 * Based on realistic UK driving patterns.
 *
 * Key: distances match the actual start/end locations.
 * SOC depletion matches consumption.
 */

// Grouped by city/area so commutes stay local
const CITIES = {
  London: [
    { addr: '10 Downing St, Westminster, London SW1A 2AA', lat: 51.5034, lng: -0.1276 },
    { addr: 'Camden Town, London NW1 8AH', lat: 51.5390, lng: -0.1426 },
    { addr: 'Shoreditch, London E1 6PP', lat: 51.5245, lng: -0.0781 },
    { addr: 'King\'s Cross, London WC1X 9AB', lat: 51.5316, lng: -0.1232 },
    { addr: 'Canary Wharf, London E14 5AB', lat: 51.5054, lng: -0.0235 },
    { addr: 'Richmond, London TW9 1TA', lat: 51.4613, lng: -0.3037 },
    { addr: 'Greenwich, London SE10 8QY', lat: 51.4826, lng: 0.0077 },
    { addr: 'Brixton, London SW2 1JX', lat: 51.4613, lng: -0.1150 },
    { addr: 'Wimbledon, London SW19 1EA', lat: 51.4214, lng: -0.2064 },
    { addr: 'Stratford, London E20 1EJ', lat: 51.5434, lng: -0.0030 },
    { addr: 'Hampstead, London NW3 1PT', lat: 51.5557, lng: -0.1779 },
    { addr: 'Battersea, London SW11 1BN', lat: 51.4790, lng: -0.1570 },
  ],
  'Greater London': [
    { addr: 'Croydon, London CR0 1LP', lat: 51.3762, lng: -0.0982 },
    { addr: 'Croydon Central, CR0 4RR', lat: 51.3720, lng: -0.0995 },
    { addr: 'Lewisham, London SE13 6AD', lat: 51.4419, lng: -0.0114 },
    { addr: 'Ilford, London IG1 1LA', lat: 51.5563, lng: 0.0740 },
    { addr: 'Bromley, London BR1 1LT', lat: 51.4058, lng: -0.0143 },
  ],
  Manchester: [
    { addr: 'Spinningfields, Manchester M3 3AE', lat: 53.4808, lng: -2.2523 },
    { addr: 'Northern Quarter, Manchester M4 1SN', lat: 53.4835, lng: -2.2354 },
    { addr: 'Salford Quays, Manchester M50 3AZ', lat: 53.4719, lng: -2.2966 },
    { addr: 'Didsbury, Manchester M20 2LY', lat: 53.4176, lng: -2.2260 },
    { addr: 'Altrincham, Manchester WA14 1AR', lat: 53.3828, lng: -2.3528 },
    { addr: 'Stockport, Manchester SK1 1EE', lat: 53.4106, lng: -2.1575 },
  ],
  Birmingham: [
    { addr: 'Birmingham City Centre, B2 4QA', lat: 52.4814, lng: -1.8998 },
    { addr: 'Edgbaston, Birmingham B15 2TT', lat: 52.4548, lng: -1.9200 },
    { addr: 'Solihull, Birmingham B91 3AT', lat: 52.4118, lng: -1.7776 },
    { addr: 'Sutton Coldfield, Birmingham B72 1DS', lat: 52.5600, lng: -1.8240 },
    { addr: 'Moseley, Birmingham B13 8HE', lat: 52.4560, lng: -1.8880 },
  ],
  Bristol: [
    { addr: 'Clifton, Bristol BS8 1TH', lat: 51.4648, lng: -2.6197 },
    { addr: 'Bristol Temple Meads, BS1 6QF', lat: 51.4490, lng: -2.5815 },
    { addr: 'Bishop\'s Road, Bristol BS6 5AD', lat: 51.4610, lng: -2.6030 },
    { addr: 'Totterdown, Bristol BS4 3EY', lat: 51.4350, lng: -2.5750 },
  ],
  Edinburgh: [
    { addr: 'Princes Street, Edinburgh EH2 2AN', lat: 55.9533, lng: -3.1883 },
    { addr: 'Leith, Edinburgh EH6 6SA', lat: 55.9761, lng: -3.1705 },
    { addr: 'Stockbridge, Edinburgh EH3 7AB', lat: 55.9610, lng: -3.2000 },
    { addr: 'Morningside, Edinburgh EH10 4DS', lat: 55.9280, lng: -3.2070 },
  ],
  Oxford: [
    { addr: 'Oxford City Centre, OX1 1PE', lat: 51.7520, lng: -1.2577 },
    { addr: 'Headington, Oxford OX3 0BP', lat: 51.7610, lng: -1.2090 },
    { addr: 'Cowley, Oxford OX4 1PL', lat: 51.7340, lng: -1.2290 },
  ],
  Cambridge: [
    { addr: 'Cambridge CB2 1TN', lat: 52.2053, lng: 0.1218 },
    { addr: 'Cambridge North, CB5 8PH', lat: 52.2230, lng: 0.1310 },
    { addr: 'Huntingdon, PE29 3NF', lat: 52.3310, lng: -0.1900 },
  ],
};

// Inter-city routes with realistic distances (miles)
const INTER_CITY_ROUTES = [
  { from: 'London', to: 'Manchester', dist: [195, 215] },
  { from: 'London', to: 'Birmingham', dist: [105, 120] },
  { from: 'London', to: 'Bristol', dist: [105, 120] },
  { from: 'London', to: 'Oxford', dist: [55, 70] },
  { from: 'London', to: 'Cambridge', dist: [60, 75] },
  { from: 'London', to: 'Edinburgh', dist: [385, 410] },
  { from: 'Manchester', to: 'Birmingham', dist: [90, 105] },
  { from: 'Manchester', to: 'Edinburgh', dist: [295, 315] },
  { from: 'Birmingham', to: 'Bristol', dist: [80, 95] },
  { from: 'Birmingham', to: 'Oxford', dist: [65, 80] },
  { from: 'Bristol', to: 'Oxford', dist: [60, 75] },
  { from: 'Oxford', to: 'Cambridge', dist: [70, 85] },
  { from: 'Greater London', to: 'London', dist: [15, 35] },
  { from: 'London', to: 'Greater London', dist: [15, 35] },
];

const CATEGORIES = ['Commute', 'Commute', 'Commute', 'Commute', 'Leisure', 'Shopping', 'Errands', 'Trip'];

// Polestar 2 battery capacity in kWh (usable)
const BATTERY_KWH = 69;

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Haversine distance in miles between two lat/lng points.
 */
function haversineMiles(lat1, lng1, lat2, lng2) {
  const R = 3958.8; // Earth radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Look up the distance range between two cities, or null if no route defined.
 */
function getInterCityDist(fromCity, toCity) {
  if (fromCity === toCity) return null;
  const route = INTER_CITY_ROUTES.find(
    (r) => (r.from === fromCity && r.to === toCity) || (r.from === toCity && r.to === fromCity)
  );
  return route ? route.dist : null;
}

export function generateDemoData(numTrips = 120) {
  const journeys = [];
  let odometer = 15000;
  let soc = 85; // start at 85% - realistic after overnight charge
  const startDate = new Date('2025-06-01T00:00:00');

  const cityNames = Object.keys(CITIES);

  // Pick 1-2 home base cities (most trips originate here)
  const homeCity = pick(cityNames);
  const secondaryCity = Math.random() < 0.3 ? pick(cityNames.filter((c) => c !== homeCity)) : null;

  for (let i = 0; i < numTrips; i++) {
    // Advance date by 1-3 days
    startDate.setDate(startDate.getDate() + Math.floor(randomBetween(1, 3)));

    const category = pick(CATEGORIES);

    let startLoc, endLoc, distance, fromCity, toCity;

    if (category === 'Trip') {
      // Long trip between cities
      toCity = pick(cityNames.filter((c) => c !== homeCity));
      fromCity = homeCity;
      const distRange = getInterCityDist(fromCity, toCity);
      distance = distRange
        ? randomBetween(distRange[0], distRange[1])
        : randomBetween(80, 350);

      startLoc = pick(CITIES[fromCity]);
      endLoc = pick(CITIES[toCity]);
    } else if (category === 'Leisure') {
      // Could be local or a short trip nearby
      if (Math.random() < 0.3) {
        // Short inter-city leisure
        toCity = pick(cityNames.filter((c) => c !== homeCity));
        fromCity = homeCity;
        const distRange = getInterCityDist(fromCity, toCity);
        distance = distRange
          ? randomBetween(distRange[0] * 0.3, distRange[1] * 0.6)
          : randomBetween(30, 120);
        startLoc = pick(CITIES[fromCity]);
        endLoc = pick(CITIES[toCity]);
      } else {
        // Local leisure - within same city
        fromCity = toCity = Math.random() < 0.7 ? homeCity : (secondaryCity || homeCity);
        const pool = CITIES[fromCity];
        startLoc = pick(pool);
        do {
          endLoc = pick(pool);
        } while (endLoc.addr === startLoc.addr && pool.length > 1);
        // Intra-city distance
        distance = randomBetween(5, 30);
      }
    } else {
      // Commute, Shopping, Errands - all within the same city
      fromCity = toCity = Math.random() < 0.75 ? homeCity : (secondaryCity || homeCity);
      const pool = CITIES[fromCity];

      startLoc = pick(pool);
      do {
        endLoc = pick(pool);
      } while (endLoc.addr === startLoc.addr && pool.length > 1);

      // Use actual haversine distance, clamped to realistic range for category
      const realDist = haversineMiles(
        startLoc.lat, startLoc.lng,
        endLoc.lat, endLoc.lng
      );

      switch (category) {
        case 'Commute':
          distance = Math.max(realDist, randomBetween(5, 25));
          break;
        case 'Shopping':
          distance = Math.max(realDist, randomBetween(3, 15));
          break;
        case 'Errands':
          distance = Math.max(realDist, randomBetween(2, 10));
          break;
        default:
          distance = realDist;
      }
    }

    // Ensure distance is reasonable
    distance = Math.max(1, Math.min(distance, 420));

    // Polestar 2 efficiency: ~140-190 Wh/mi
    // Highway trips use more energy, city trips less
    let efficiency;
    if (distance > 100) efficiency = randomBetween(150, 190); // highway
    else if (distance > 30) efficiency = randomBetween(145, 180);
    else efficiency = randomBetween(140, 175); // city

    const consumption = (distance * efficiency) / 1000;

    // SOC: deplete by consumption, but can recharge between trips
    // Realistic: overnight charging brings SOC back up
    const socUsed = (consumption / BATTERY_KWH) * 100;
    const socStartRounded = Math.round(Math.min(98, Math.max(10, soc)));
    const socEndRounded = Math.round(Math.max(5, socStartRounded - socUsed));

    // After each trip, simulate possible charging
    if (Math.random() < 0.7) {
      soc = Math.min(98, socEndRounded + Math.round(randomBetween(10, 60)));
    } else {
      soc = socEndRounded;
    }

    // Departure time - weighted toward morning and evening
    let hour;
    const timeRoll = Math.random();
    if (timeRoll < 0.35) hour = Math.floor(randomBetween(6, 9));
    else if (timeRoll < 0.65) hour = Math.floor(randomBetween(16, 19));
    else if (timeRoll < 0.85) hour = Math.floor(randomBetween(11, 15));
    else hour = Math.floor(randomBetween(9, 16));

    const startMin = Math.floor(randomBetween(0, 59));

    // Duration: factor in distance and speed
    // City: ~25 mph avg, highway: ~60 mph avg
    let avgSpeedMph;
    if (distance > 100) avgSpeedMph = randomBetween(50, 70);
    else if (distance > 30) avgSpeedMph = randomBetween(35, 55);
    else avgSpeedMph = randomBetween(20, 35);

    const durationMin = Math.round((distance / avgSpeedMph) * 60 * randomBetween(0.9, 1.3));

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
      socStart: socStartRounded,
      socEnd: socEndRounded,
      startOdometer: Math.round((odometer - distance) * 100) / 100,
      endOdometer: Math.round(odometer * 100) / 100,
      startLat: startLoc.lat + randomBetween(-0.005, 0.005),
      startLng: startLoc.lng + randomBetween(-0.005, 0.005),
      endLat: endLoc.lat + randomBetween(-0.005, 0.005),
      endLng: endLoc.lng + randomBetween(-0.005, 0.005),
      comments: '',
      duration: durationMin,
      efficiency: Math.round(efficiency),
      avgSpeed: Math.round(avgSpeedMph * 100) / 100,
      socDelta: socStartRounded - socEndRounded,
    });
  }

  return journeys;
}
