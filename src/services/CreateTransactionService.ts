import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import FindOrCreateCategoryService from './FindOrCreateCategoryService';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    if (value <= 0) throw new Error('Invalid value');

    const transactionRepository = getCustomRepository(TransactionsRepository);
    const balance = await transactionRepository.getBalance();
    if (type === 'outcome' && value > balance.total) {
      throw new AppError('Insufficient balance for this transaction');
    }

    const findOrCreateCategory = new FindOrCreateCategoryService();
    const persistedCategory = await findOrCreateCategory.execute({
      title: category,
    });

    if (!persistedCategory) {
      throw new AppError('Invalid category name.');
    }

    const transaction = transactionRepository.create({
      title,
      type,
      value,
      category: persistedCategory,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
