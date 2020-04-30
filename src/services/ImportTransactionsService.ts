import csvParse from 'csv-parse';
import fs from 'fs';
import Transaction from '../models/Transaction';

async function loadCSV(filePath: string): Promise<string[][]> {
  const readCSVStream = fs.createReadStream(filePath);

  const parseStream = csvParse({
    from_line: 2,
    ltrim: true,
    rtrim: true,
  });

  const parseCSV = readCSVStream.pipe(parseStream);

  const lines: string[][] = [];

  parseCSV.on('data', line => {
    lines.push(line);
  });

  await new Promise(resolve => {
    parseCSV.on('end', resolve);
  });

  return lines;
}

interface Response {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class ImportTransactionsService {
  async execute(filePath: string): Promise<Response[]> {
    const data = await loadCSV(filePath);
    const importedTransactions = data.map(([title, type, value, category]) => ({
      title,
      value: Number(value),
      type: type as 'income' | 'outcome',
      category,
    }));

    return importedTransactions;
  }
}

export default ImportTransactionsService;
