import { describe, it, expect, vi } from 'vitest';
import { generateDemoData } from './demoData';

describe('generateDemoData', () => {
  it('generates the requested number of trips', () => {
    const journeys = generateDemoData(50);
    expect(journeys).toHaveLength(50);
  });

  it('generates default 120 trips when no count specified', () => {
    const journeys = generateDemoData();
    expect(journeys).toHaveLength(120);
  });

  it('each journey has all required fields', () => {
    const journeys = generateDemoData(5);
    const requiredFields = [
      'id', 'startDate', 'endDate', 'startAddress', 'endAddress',
      'distance', 'consumption', 'category', 'tripType',
      'socStart', 'socEnd', 'startOdometer', 'endOdometer',
      'startLat', 'startLng', 'endLat', 'endLng',
      'duration', 'efficiency', 'avgSpeed', 'socDelta',
    ];

    for (const journey of journeys) {
      for (const field of requiredFields) {
        expect(journey).toHaveProperty(field);
      }
    }
  });

  it('journey IDs are sequential starting from 0', () => {
    const journeys = generateDemoData(10);
    const ids = journeys.map(j => j.id);
    expect(ids).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('all journeys have positive distance', () => {
    const journeys = generateDemoData(30);
    for (const j of journeys) {
      expect(j.distance).toBeGreaterThan(0);
    }
  });

  it('all journeys have positive consumption', () => {
    const journeys = generateDemoData(30);
    for (const j of journeys) {
      expect(j.consumption).toBeGreaterThan(0);
    }
  });

  it('all journeys have valid dates', () => {
    const journeys = generateDemoData(30);
    for (const j of journeys) {
      expect(j.startDate instanceof Date).toBe(true);
      expect(j.endDate instanceof Date).toBe(true);
      expect(j.endDate.getTime()).toBeGreaterThanOrEqual(j.startDate.getTime());
    }
  });

  it('dates progress forward over the dataset', () => {
    const journeys = generateDemoData(50);
    for (let i = 1; i < journeys.length; i++) {
      expect(journeys[i].startDate.getTime())
        .toBeGreaterThan(journeys[i - 1].startDate.getTime());
    }
  });

  it('categories are from the expected set', () => {
    const journeys = generateDemoData(50);
    const validCategories = new Set(['Commute', 'Leisure', 'Shopping', 'Errands', 'Trip']);

    for (const j of journeys) {
      expect(validCategories.has(j.category)).toBe(true);
    }
  });

  it('contains multiple categories', () => {
    const journeys = generateDemoData(100);
    const categories = new Set(journeys.map(j => j.category));
    expect(categories.size).toBeGreaterThan(1);
  });

  it('SOC values are within valid range (0-100)', () => {
    const journeys = generateDemoData(30);
    for (const j of journeys) {
      expect(j.socStart).toBeGreaterThanOrEqual(0);
      expect(j.socStart).toBeLessThanOrEqual(100);
      expect(j.socEnd).toBeGreaterThanOrEqual(0);
      expect(j.socEnd).toBeLessThanOrEqual(100);
      expect(j.socEnd).toBeLessThanOrEqual(j.socStart);
    }
  });

  it('SOC delta equals start minus end', () => {
    const journeys = generateDemoData(30);
    for (const j of journeys) {
      expect(j.socDelta).toBe(j.socStart - j.socEnd);
    }
  });

  it('odometer values are monotonically increasing', () => {
    const journeys = generateDemoData(30);
    for (let i = 1; i < journeys.length; i++) {
      expect(journeys[i].endOdometer).toBeGreaterThan(journeys[i - 1].endOdometer);
    }
  });

  it('odometer start matches previous end', () => {
    const journeys = generateDemoData(30);
    for (let i = 1; i < journeys.length; i++) {
      expect(journeys[i].startOdometer).toBeCloseTo(
        journeys[i - 1].endOdometer, 0
      );
    }
  });

  it('coordinates are within UK range (roughly)', () => {
    const journeys = generateDemoData(30);
    for (const j of journeys) {
      // UK latitude: ~49.9 to ~60.9
      expect(j.startLat).toBeGreaterThan(49);
      expect(j.startLat).toBeLessThan(62);
      expect(j.endLat).toBeGreaterThan(49);
      expect(j.endLat).toBeLessThan(62);
      // UK longitude: ~-8 to ~2
      expect(j.startLng).toBeGreaterThan(-9);
      expect(j.startLng).toBeLessThan(3);
      expect(j.endLng).toBeGreaterThan(-9);
      expect(j.endLng).toBeLessThan(3);
    }
  });

  it('efficiency is within Polestar 2 range (140-190 Wh/mi)', () => {
    const journeys = generateDemoData(30);
    for (const j of journeys) {
      expect(j.efficiency).toBeGreaterThanOrEqual(140);
      expect(j.efficiency).toBeLessThanOrEqual(190);
    }
  });

  it('duration is positive and proportional to distance', () => {
    const journeys = generateDemoData(30);
    for (const j of journeys) {
      expect(j.duration).toBeGreaterThan(0);
      // Duration: city trips ~1.5-3x distance in min, highway trips ~0.8-2x
      expect(j.duration).toBeGreaterThan(j.distance * 0.5);
      expect(j.duration).toBeLessThan(j.distance * 4);
    }
  });

  it('tripType is always SINGLE', () => {
    const journeys = generateDemoData(30);
    for (const j of journeys) {
      expect(j.tripType).toBe('SINGLE');
    }
  });

  it('start and end addresses are different', () => {
    const journeys = generateDemoData(30);
    for (const j of journeys) {
      expect(j.startAddress).not.toBe(j.endAddress);
    }
  });

  it('addresses contain UK location names', () => {
    const journeys = generateDemoData(30);
    const ukIndicators = ['London', 'Manchester', 'Birmingham', 'Bristol', 'Edinburgh', 'Oxford', 'Cambridge'];

    for (const j of journeys) {
      const hasUKAddress = ukIndicators.some(indicator =>
        j.startAddress.includes(indicator) || j.endAddress.includes(indicator)
      );
      expect(hasUKAddress).toBe(true);
    }
  });

  it('departure hours are weighted toward morning and evening', () => {
    const journeys = generateDemoData(200);
    let peakHours = 0;
    for (const j of journeys) {
      const hour = j.startDate.getHours();
      if ((hour >= 6 && hour <= 9) || (hour >= 16 && hour <= 19)) {
        peakHours++;
      }
    }
    // At least 50% should be during peak hours (morning + evening commute)
    expect(peakHours / journeys.length).toBeGreaterThan(0.5);
  });

  it('comments are empty strings', () => {
    const journeys = generateDemoData(30);
    for (const j of journeys) {
      expect(j.comments).toBe('');
    }
  });

  it('distance ranges are appropriate for category', () => {
    const journeys = generateDemoData(200);

    const commutes = journeys.filter(j => j.category === 'Commute');
    const trips = journeys.filter(j => j.category === 'Trip');

    if (commutes.length > 0 && trips.length > 0) {
      const avgCommute = commutes.reduce((s, j) => s + j.distance, 0) / commutes.length;
      const avgTrip = trips.reduce((s, j) => s + j.distance, 0) / trips.length;
      // Trips should be longer than commutes on average
      expect(avgTrip).toBeGreaterThan(avgCommute);
    }
  });
});
