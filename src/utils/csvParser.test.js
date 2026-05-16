import { describe, it, expect } from 'vitest';
import { parseCSV } from './csvParser';

// Helper to create a Blob that mimics a CSV file
function createCSVBlob(content) {
  return new Blob([content], { type: 'text/csv' });
}

describe('csvParser', () => {
  describe('parseCSV', () => {
    it('parses a valid CSV file and returns journey objects', async () => {
      const csv = `Start Date,End Date,Start Address,End Address,Distance in Mile,Consumption in Kwh,Category,Start Latitude,Start Longitude,End Latitude,End Longitude,Start Odometer,End Odometer,Trip Type,SOC Source,SOC Destination,Comments
"2025-07-01, 08:00","2025-07-01, 08:30","Home, London","Work, London","12.5","2.5","Commute","51.5074","-0.1278","51.5074","-0.1278","10000","10012.5","SINGLE","80","70",""`;
      const file = createCSVBlob(csv);
      const journeys = await parseCSV(file);

      expect(journeys).toHaveLength(1);
      expect(journeys[0].distance).toBe(12.5);
      expect(journeys[0].consumption).toBe(2.5);
      expect(journeys[0].category).toBe('Commute');
      expect(journeys[0].socStart).toBe(80);
      expect(journeys[0].socEnd).toBe(70);
    });

    it('parses multiple rows correctly', async () => {
      const csv = `Start Date,End Date,Start Address,End Address,Distance in Mile,Consumption in Kwh,Category,Start Latitude,Start Longitude,End Latitude,End Longitude,Start Odometer,End Odometer,Trip Type,SOC Source,SOC Destination,Comments
"2025-07-01, 08:00","2025-07-01, 08:30","Home","Work","10","1.5","Commute","51.5","0","51.6","0","10000","10010","SINGLE","80","75",""
"2025-07-02, 09:00","2025-07-02, 09:45","Work","Home","10","1.8","Commute","51.6","0","51.5","0","10010","10020","SINGLE","75","70",""`;
      const file = createCSVBlob(csv);
      const journeys = await parseCSV(file);

      expect(journeys).toHaveLength(2);
      expect(journeys[0].id).toBe(0);
      expect(journeys[1].id).toBe(1);
    });

    it('filters out rows with zero distance', async () => {
      const csv = `Start Date,End Date,Start Address,End Address,Distance in Mile,Consumption in Kwh,Category,Start Latitude,Start Longitude,End Latitude,End Longitude,Start Odometer,End Odometer,Trip Type,SOC Source,SOC Destination,Comments
"2025-07-01, 08:00","2025-07-01, 08:30","Home","Work","10","1.5","Commute","51.5","0","51.6","0","10000","10010","SINGLE","80","75",""
"2025-07-01, 09:00","2025-07-01, 09:01","Home","Home","0","0","Commute","51.5","0","51.5","0","10010","10010","SINGLE","75","75",""`;
      const file = createCSVBlob(csv);
      const journeys = await parseCSV(file);

      expect(journeys).toHaveLength(1);
      expect(journeys[0].distance).toBe(10);
    });

    it('handles BOM (byte order mark) in headers', async () => {
      // BOM is the \ufeff character at the start
      const csv = `\ufeffStart Date,End Date,Start Address,End Address,Distance in Mile,Consumption in Kwh,Category,Start Latitude,Start Longitude,End Latitude,End Longitude,Start Odometer,End Odometer,Trip Type,SOC Source,SOC Destination,Comments
"2025-07-01, 08:00","2025-07-01, 08:30","Home","Work","5","0.5","Commute","51.5","0","51.6","0","10000","10005","SINGLE","90","85",""`;
      const file = createCSVBlob(csv);
      const journeys = await parseCSV(file);

      expect(journeys).toHaveLength(1);
      expect(journeys[0].distance).toBe(5);
    });

    it('handles empty lines', async () => {
      const csv = `Start Date,End Date,Start Address,End Address,Distance in Mile,Consumption in Kwh,Category,Start Latitude,Start Longitude,End Latitude,End Longitude,Start Odometer,End Odometer,Trip Type,SOC Source,SOC Destination,Comments

"2025-07-01, 08:00","2025-07-01, 08:30","Home","Work","5","0.5","Commute","51.5","0","51.6","0","10000","10005","SINGLE","90","85",""
`;
      const file = createCSVBlob(csv);
      const journeys = await parseCSV(file);

      expect(journeys).toHaveLength(1);
    });

    it('handles missing optional fields with defaults', async () => {
      const csv = `Start Date,End Date,Start Address,End Address,Distance in Mile,Consumption in Kwh,Category,Start Latitude,Start Longitude,End Latitude,End Longitude,Start Odometer,End Odometer,Trip Type,SOC Source,SOC Destination,Comments
"2025-07-01, 08:00","2025-07-01, 08:30","Home","Work","5","0.5","","51.5","0","51.6","0","10000","10005","","90","85",""`;
      const file = createCSVBlob(csv);
      const journeys = await parseCSV(file);

      expect(journeys[0].category).toBe('Uncategorized');
      expect(journeys[0].tripType).toBe('SINGLE');
    });
  });

  describe('computed fields', () => {
    it('calculates duration in minutes', async () => {
      const csv = `Start Date,End Date,Start Address,End Address,Distance in Mile,Consumption in Kwh,Category,Start Latitude,Start Longitude,End Latitude,End Longitude,Start Odometer,End Odometer,Trip Type,SOC Source,SOC Destination,Comments
"2025-07-01, 08:00","2025-07-01, 09:00","Home","Work","30","5","Commute","51.5","0","51.6","0","10000","10030","SINGLE","80","60",""`;
      const file = createCSVBlob(csv);
      const journeys = await parseCSV(file);

      expect(journeys[0].duration).toBe(60);
    });

    it('calculates efficiency in Wh/mi', async () => {
      const csv = `Start Date,End Date,Start Address,End Address,Distance in Mile,Consumption in Kwh,Category,Start Latitude,Start Longitude,End Latitude,End Longitude,Start Odometer,End Odometer,Trip Type,SOC Source,SOC Destination,Comments
"2025-07-01, 08:00","2025-07-01, 09:00","Home","Work","20","4","Commute","51.5","0","51.6","0","10000","10020","SINGLE","80","60",""`;
      const file = createCSVBlob(csv);
      const journeys = await parseCSV(file);

      // 4 kWh / 20 mi * 1000 = 200 Wh/mi
      expect(journeys[0].efficiency).toBe(200);
    });

    it('calculates average speed in mph', async () => {
      const csv = `Start Date,End Date,Start Address,End Address,Distance in Mile,Consumption in Kwh,Category,Start Latitude,Start Longitude,End Latitude,End Longitude,Start Odometer,End Odometer,Trip Type,SOC Source,SOC Destination,Comments
"2025-07-01, 08:00","2025-07-01, 09:00","Home","Work","60","8","Commute","51.5","0","51.6","0","10000","10060","SINGLE","80","60",""`;
      const file = createCSVBlob(csv);
      const journeys = await parseCSV(file);

      // 60 mi in 60 min = 60 mph
      expect(journeys[0].avgSpeed).toBe(60);
    });

    it('calculates SOC delta', async () => {
      const csv = `Start Date,End Date,Start Address,End Address,Distance in Mile,Consumption in Kwh,Category,Start Latitude,Start Longitude,End Latitude,End Longitude,Start Odometer,End Odometer,Trip Type,SOC Source,SOC Destination,Comments
"2025-07-01, 08:00","2025-07-01, 09:00","Home","Work","10","2","Commute","51.5","0","51.6","0","10000","10010","SINGLE","85","65",""`;
      const file = createCSVBlob(csv);
      const journeys = await parseCSV(file);

      expect(journeys[0].socDelta).toBe(20);
    });

    it('handles invalid SOC values by defaulting to 0', async () => {
      const csv = `Start Date,End Date,Start Address,End Address,Distance in Mile,Consumption in Kwh,Category,Start Latitude,Start Longitude,End Latitude,End Longitude,Start Odometer,End Odometer,Trip Type,SOC Source,SOC Destination,Comments
"2025-07-01, 08:00","2025-07-01, 09:00","Home","Work","10","2","Commute","51.5","0","51.6","0","10000","10010","SINGLE","bad","also bad",""`;
      const file = createCSVBlob(csv);
      const journeys = await parseCSV(file);

      expect(journeys[0].socStart).toBe(0);
      expect(journeys[0].socEnd).toBe(0);
    });
  });

  describe('date parsing', () => {
    it('parses "YYYY-MM-DD, HH:MM" format', async () => {
      const csv = `Start Date,End Date,Start Address,End Address,Distance in Mile,Consumption in Kwh,Category,Start Latitude,Start Longitude,End Latitude,End Longitude,Start Odometer,End Odometer,Trip Type,SOC Source,SOC Destination,Comments
"2025-12-25, 14:30","2025-12-25, 15:00","Home","Work","10","1.5","Commute","51.5","0","51.6","0","10000","10010","SINGLE","80","75",""`;
      const file = createCSVBlob(csv);
      const journeys = await parseCSV(file);

      expect(journeys[0].startDate.getFullYear()).toBe(2025);
      expect(journeys[0].startDate.getMonth()).toBe(11); // December is 11
      expect(journeys[0].startDate.getDate()).toBe(25);
      expect(journeys[0].startDate.getHours()).toBe(14);
      expect(journeys[0].startDate.getMinutes()).toBe(30);
    });

    it('handles missing dates gracefully', async () => {
      const csv = [
        'Start Date,End Date,Start Address,End Address,Distance in Mile,Consumption in Kwh,Category,Start Latitude,Start Longitude,End Latitude,End Longitude,Start Odometer,End Odometer,Trip Type,SOC Source,SOC Destination,Comments',
        ',,Home,Work,10,1.5,Commute,51.5,0,51.6,0,10000,10010,SINGLE,80,75,',
      ].join('\n');
      const file = createCSVBlob(csv);
      const journeys = await parseCSV(file);

      expect(journeys).toHaveLength(1);
      expect(journeys[0].startDate).toBeNull();
      expect(journeys[0].endDate).toBeNull();
      expect(journeys[0].duration).toBe(0);
    });
  });

  describe('error handling', () => {
    it('rejects with non-CSV content', async () => {
      const file = createCSVBlob('not a csv file at all');
      // Papa Parse will still try to parse it, but the result should be empty or have no valid journeys
      const journeys = await parseCSV(file);
      expect(journeys.length).toBe(0);
    });
  });
});
