const { generateCurrentTimestamp } = require('../index');

describe('generateCurrentTimestamp', () => {
  it('should generate a timestamp in the format YYYYMMDDHHMMSS', () => {
    const timestamp = generateCurrentTimestamp();
    
    // The length should be 14 (4 for the year, 2 for the month, 2 for the day, 2 for the hour, 2 for the minutes, and 2 for the secods)
    expect(timestamp.length).toEqual(14);
    
    // It should be a valid number
    expect(Number.isNaN(Number(timestamp))).toBe(false);
  });
});