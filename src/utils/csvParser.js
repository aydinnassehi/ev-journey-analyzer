import Papa from 'papaparse';

/**
 * Parse CSV file and normalize journey data
 * Handles the BMW EV journey log format (and similar formats)
 */
export function parseCSV(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const journeys = normalizeJourneys(results.data);
          resolve(journeys);
        } catch (err) {
          reject(err);
        }
      },
      error: (err) => reject(err),
    });
  });
}

function normalizeJourneys(data) {
  return data.map((row, index) => {
    // Handle BOM and whitespace in headers
    const cleanRow = {};
    for (const [key, value] of Object.entries(row)) {
      cleanRow[key.trim()] = value?.trim() || '';
    }

    // Parse dates - handle format "YYYY-MM-DD, HH:MM"
    const startDate = parseDate(cleanRow['Start Date'] || '');
    const endDate = parseDate(cleanRow['End Date'] || '');

    // Parse numeric fields
    const distance = parseFloat(cleanRow['Distance in Mile'] || cleanRow['Distance'] || '0');
    const consumption = parseFloat(cleanRow['Consumption in Kwh'] || cleanRow['Consumption'] || '0');
    const socStart = parseFloat(cleanRow['SOC Source'] || cleanRow['Start SOC'] || '0');
    const socEnd = parseFloat(cleanRow['SOC Destination'] || cleanRow['End SOC'] || '0');
    const startOdo = parseFloat(cleanRow['Start Odometer'] || '0');
    const endOdo = parseFloat(cleanRow['End Odometer'] || '0');

    // Parse coordinates
    const startLat = parseFloat(cleanRow['Start Latitude'] || '0');
    const startLng = parseFloat(cleanRow['Start Longitude'] || '0');
    const endLat = parseFloat(cleanRow['End Latitude'] || '0');
    const endLng = parseFloat(cleanRow['End Longitude'] || '0');

    return {
      id: index,
      startDate,
      endDate,
      startAddress: cleanRow['Start Address'] || '',
      endAddress: cleanRow['End Address'] || '',
      distance,
      consumption,
      category: cleanRow['Category'] || 'Uncategorized',
      tripType: cleanRow['Trip Type'] || 'SINGLE',
      socStart: isNaN(socStart) ? 0 : socStart,
      socEnd: isNaN(socEnd) ? 0 : socEnd,
      startOdometer: startOdo,
      endOdometer: endOdo,
      startLat: isNaN(startLat) ? 0 : startLat,
      startLng: isNaN(startLng) ? 0 : startLng,
      endLat: isNaN(endLat) ? 0 : endLat,
      endLng: isNaN(endLng) ? 0 : endLng,
      comments: cleanRow['Comments'] || '',
      // Computed fields
      duration: startDate && endDate ? (endDate - startDate) / (1000 * 60) : 0, // minutes
      efficiency: distance > 0 ? (consumption / distance) * 1000 : 0, // Wh/mi
      avgSpeed: distance > 0 && (endDate - startDate) > 0
        ? (distance / ((endDate - startDate) / (1000 * 60 * 60))) : 0, // mph
      socDelta: socStart - socEnd,
    };
  }).filter(j => j.distance > 0); // Filter out invalid entries
}

function parseDate(dateStr) {
  if (!dateStr) return null;
  // Handle "YYYY-MM-DD, HH:MM" format
  const cleaned = dateStr.replace(/\s*,\s*/, 'T');
  const parsed = new Date(cleaned);
  return isNaN(parsed.getTime()) ? null : parsed;
}
