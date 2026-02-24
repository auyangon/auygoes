import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the CSV file (assumes it's in the project root)
const csvPath = path.join(__dirname, '../academic_calendar_spring2026.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// Parse CSV lines
const lines = csvContent.trim().split('\n');
// Skip header line (event,startDate,endDate)

const events = [];

for (let i = 1; i < lines.length; i++) {
  const values = lines[i].split(',');
  const eventName = values[0];
  const startDateStr = values[1];
  const endDateStr = values[2];

  const start = new Date(startDateStr);
  const end = new Date(endDateStr);

  // Expand to each day in the range
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    events.push({
      date: dateStr,
      title: eventName,
      description:
        d.getTime() === start.getTime()
          ? `Start of ${eventName}`
          : d.getTime() === end.getTime()
          ? `End of ${eventName}`
          : `${eventName} (day)`,
      type: 'academic',
    });
  }
}

// Write JSON to src/data (create folder if needed)
const outputDir = path.join(__dirname, '../src/data');
const outputPath = path.join(outputDir, 'academicEvents.json');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(events, null, 2));
console.log(`✅ Academic events saved to ${outputPath}`);