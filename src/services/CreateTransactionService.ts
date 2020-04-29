import { getCustomRepository, getRepository } from 'typeorm';

// import AppError from '../errors/AppError';

import TransactionRepository from '../repositories/TransactionsRepository';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

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
    const transactionRepository = getCustomRepository(TransactionRepository);
    const categoryRepository = getRepository(Category);

    const transaction = transactionRepository.create({
      title,
      value,
      type,
    });

    const categoryExists = await categoryRepository.findOne({
      where: { title: category },
    });

    if (categoryExists) {
      transaction.category_id = categoryExists.id;
    } else {
      const newCategory = await categoryRepository.create({
        title: category,
      });
      await categoryRepository.save(newCategory);
      transaction.category_id = newCategory.id;
    }

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
