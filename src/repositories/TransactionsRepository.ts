import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.createQueryBuilder()
      .select('SUM(value)', 'value')
      .addSelect('type')
      .addGroupBy('type')
      .getRawMany();

    const balance = { income: 0, outcome: 0, total: 0 } as Balance;

    // TODO: trocar para reduce
    transactions.forEach(t => {
      if (t.type === 'income') balance.income = t.value;
      if (t.type === 'outcome') balance.outcome = t.value;
    });

    balance.income = Math.round(balance.income * 100) / 100;
    balance.outcome = Math.round(balance.outcome * 100) / 100;
    balance.total = Math.round((balance.income - balance.outcome) * 100) / 100;
    return balance;
  }
}

export default TransactionsRepository;
