import * as fs from 'fs';

function generateCSV(rows: number): string {
  const header = 'first_name,last_name,email\n';
  let csvData = header;

  for (let i = 1; i <= rows; i++) {
    const firstName = `Test_${i}`;
    const lastName = `Test_${i}`;
    const email = `test_email_${i}@tests.com`;

    csvData += `${firstName},${lastName},${email}\n`;
  }

  return csvData;
}

function saveCSVToFile(rows: number): void {
  const csvData = generateCSV(rows);
  const filePath = './public/uploads/test_accounts.csv';

  fs.writeFileSync(filePath, csvData, 'utf-8');

  console.log(`CSV file with ${rows} rows has been created: ${filePath}`);
}

const numberOfRows: number = parseInt(process.argv[2], 10) || 10; 

saveCSVToFile(numberOfRows);
