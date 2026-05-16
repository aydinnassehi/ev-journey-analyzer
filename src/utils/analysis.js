/**
 * Analyze journey data and compute insights
 */

export function analyzeJourneys(journeys, settings) {
  if (!journeys.length) return null;

  const sorted = [...journeys].sort((a, b) => a.startDate - b.startDate);

  // Basic stats
  const totalDistance = journeys.reduce((sum, j) => sum + j.distance, 0);
  const totalEnergy = journeys.reduce((sum, j) => sum + j.consumption, 0);
  const avgEfficiency = totalDistance > 0 ? (totalEnergy / totalDistance) * 1000 : 0;
  const avgTripDistance = totalDistance / journeys.length;
  const avgTripDuration = journeys.reduce((sum, j) => sum + j.duration, 0) / journeys.length;

  // Date range
  const firstDate = sorted[0].startDate;
  const lastDate = sorted[sorted.length - 1].startDate;
  const daysSpan = Math.max(1, Math.ceil((lastDate - firstDate) / (1000 * 60 * 60 * 24)));

  // CO2 savings
  const gridCO2 = settings?.gridCO2 || 212; // g CO2/kWh
  const petrolCO2 = settings?.petrolCO2 || 404; // g CO2/mile
  const co2Saved = (totalDistance * petrolCO2) - (totalEnergy * gridCO2);
  const co2SavedKg = co2Saved / 1000;

  // Category breakdown
  const categories = {};
  journeys.forEach(j => {
    categories[j.category] = (categories[j.category] || 0) + 1;
  });

  // Location frequency
  const locations = {};
  journeys.forEach(j => {
    const normalizeAddr = (addr) => addr.split(',')[0].trim();
    const startKey = normalizeAddr(j.startAddress);
    const endKey = normalizeAddr(j.endAddress);
    locations[startKey] = (locations[startKey] || 0) + 1;
    locations[endKey] = (locations[endKey] || 0) + 1;
  });
  const topLocations = Object.entries(locations)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  // Daily stats (for charts)
  const dailyStats = computeDailyStats(journeys);
  const monthlyStats = computeMonthlyStats(journeys);
  const hourlyStats = computeHourlyStats(journeys);
  const weekdayStats = computeWeekdayStats(journeys);

  // Efficiency trends
  const efficiencyByMonth = computeEfficiencyByMonth(journeys);

  // SOC analysis
  const socStats = {
    avgStart: journeys.reduce((s, j) => s + j.socStart, 0) / journeys.length,
    avgEnd: journeys.reduce((s, j) => s + j.socEnd, 0) / journeys.length,
    minEnd: Math.min(...journeys.map(j => j.socEnd)),
    maxStart: Math.max(...journeys.map(j => j.socStart)),
    avgDelta: journeys.reduce((s, j) => s + j.socDelta, 0) / journeys.length,
  };

  // Speed stats
  const avgSpeed = journeys.reduce((s, j) => s + j.avgSpeed, 0) / journeys.length;
  const maxSpeed = Math.max(...journeys.map(j => j.avgSpeed));

  // Cost estimate
  // UK DfT average: 36.7 mpg (imperial gallon = 4.546 litres)
  // So average car uses 4.546/36.7 = 0.124 litres/mile
  const UK_AVG_MPG = 36.7;
  const IMPERIAL_GALLON_LITRES = 4.546;
  const litresPerMile = IMPERIAL_GALLON_LITRES / UK_AVG_MPG; // ~0.124 L/mi

  const elecCostPerKwh = settings?.elecCost || 0.28;
  const petrolCostPerLitre = settings?.petrolCost || 1.43;
  const petrolCostPerMile = petrolCostPerLitre * litresPerMile;
  const electricityCost = totalEnergy * elecCostPerKwh;
  const petrolEquivalent = totalDistance * petrolCostPerMile;
  const savings = petrolEquivalent - electricityCost;

  return {
    tripCount: journeys.length,
    totalDistance: Math.round(totalDistance * 10) / 10,
    totalEnergy: Math.round(totalEnergy * 10) / 10,
    avgEfficiency: Math.round(avgEfficiency),
    avgTripDistance: Math.round(avgTripDistance * 10) / 10,
    avgTripDuration: Math.round(avgTripDuration),
    daysSpan,
    co2SavedKg: Math.round(co2SavedKg),
    categories,
    topLocations,
    dailyStats,
    monthlyStats,
    hourlyStats,
    weekdayStats,
    efficiencyByMonth,
    socStats: {
      avgStart: Math.round(socStats.avgStart * 10) / 10,
      avgEnd: Math.round(socStats.avgEnd * 10) / 10,
      minEnd: socStats.minEnd,
      maxStart: socStats.maxStart,
      avgDelta: Math.round(socStats.avgDelta * 10) / 10,
    },
    avgSpeed: Math.round(avgSpeed),
    maxSpeed: Math.round(maxSpeed),
    electricityCost: Math.round(electricityCost * 100) / 100,
    petrolEquivalent: Math.round(petrolEquivalent * 100) / 100,
    savings: Math.round(savings * 100) / 100,
    firstDate,
    lastDate,
    carName: settings?.carName || 'EV',
  };
}

function computeDailyStats(journeys) {
  const daily = {};
  journeys.forEach(j => {
    const key = j.startDate.toISOString().split('T')[0];
    if (!daily[key]) daily[key] = { distance: 0, energy: 0, count: 0 };
    daily[key].distance += j.distance;
    daily[key].energy += j.consumption;
    daily[key].count += 1;
  });
  return Object.entries(daily)
    .map(([date, stats]) => ({ date, ...stats }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function computeMonthlyStats(journeys) {
  const monthly = {};
  journeys.forEach(j => {
    const key = j.startDate.toISOString().slice(0, 7);
    const label = j.startDate.toLocaleString('default', { month: 'short', year: '2-digit' });
    if (!monthly[key]) monthly[key] = { label, distance: 0, energy: 0, count: 0 };
    monthly[key].distance += j.distance;
    monthly[key].energy += j.consumption;
    monthly[key].count += 1;
  });
  return Object.values(monthly).sort((a, b) => a.label.localeCompare(b.label));
}

function computeHourlyStats(journeys) {
  const hourly = Array(24).fill(0);
  journeys.forEach(j => {
    const hour = j.startDate.getHours();
    hourly[hour]++;
  });
  return hourly.map((count, hour) => ({ hour, count }));
}

function computeWeekdayStats(journeys) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weekday = Array(7).fill(0);
  journeys.forEach(j => {
    weekday[j.startDate.getDay()]++;
  });
  return days.map((name, i) => ({ name, count: weekday[i] }));
}

function computeEfficiencyByMonth(journeys) {
  const monthly = {};
  journeys.forEach(j => {
    const key = j.startDate.toISOString().slice(0, 7);
    const label = j.startDate.toLocaleString('default', { month: 'short', year: '2-digit' });
    if (!monthly[key]) monthly[key] = { label, distance: 0, energy: 0 };
    monthly[key].distance += j.distance;
    monthly[key].energy += j.consumption;
  });
  return Object.values(monthly)
    .map(m => ({
      label: m.label,
      efficiency: m.distance > 0 ? Math.round((m.energy / m.distance) * 1000) : 0,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
