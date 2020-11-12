import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';
import { getCustomRepository } from 'typeorm';
import Transaction from '../models/Transaction';

import uploadConfig from '../config/upload';
import CreateTransactionService from './CreateTransactionService';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  csvFilename: string;
}
class ImportTransactionsService {
  async execute({ csvFilename }: Request): Promise<Transaction[]> {
    const transactionRepository = getCustomRepository(TransactionsRepository);

    const csvFilePath = path.resolve(uploadConfig.directory, csvFilename);
    const readCSVStream = fs.createReadStream(csvFilePath);
    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });
    const parseCSV = readCSVStream.pipe(parseStream);

    const lines: string[] = [];

    parseCSV.on('data', async line => {
      lines.push(line);
    });

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    const transactions: TransactionsCSV[] = await Promise.all(
      lines.map(
        async (line): Promise<Transaction> => {
          const [title, type, value, category] = line;
          const transaction = await transactionRepository.execute({
            title,
            type: type as 'income' | 'outcome',
            value: +value,
            category,
          });
          return transaction;
        },
      ),
    );

    return transactions;
  }
}

export default ImportTransactionsService;
