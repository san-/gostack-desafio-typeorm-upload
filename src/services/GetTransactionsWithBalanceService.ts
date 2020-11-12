import { getCustomRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface TransactionsWithBalance {
  transactions: Transaction[];
  balance: Balance;
}

class GetTransactionsWithBalanceService {
  public async execute(): Promise<TransactionsWithBalance> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const transactions = await transactionRepository.find();

    const balance = await transactionRepository.getBalance();

    return { transactions, balance };
  }
}

export default GetTransactionsWithBalanceService;
