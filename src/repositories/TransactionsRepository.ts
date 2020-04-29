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
    const allIncomeTransactions = await this.find({
      where: { type: 'income' },
    });
    const allOutcomeTransactions = await this.find({
      where: { type: 'outcome' },
    });

    const income = allIncomeTransactions.reduce(
      (inc, transaction) => inc + Number(transaction.value),
      0,
    );

    const outcome = allOutcomeTransactions.reduce(
      (out, transaction) => out + Number(transaction.value),
      0,
    );

    return { income, outcome, total: income - outcome };
  }
}

export default TransactionsRepository;
