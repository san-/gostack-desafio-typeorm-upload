import { Router } from 'express';

// import TransactionsRepository from '../repositories/TransactionsRepository';
import multer from 'multer';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import GetTransactionsWithBalanceService from '../services/GetTransactionsWithBalanceService';
// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

import uploadConfig from '../config/upload';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
const upload = multer(uploadConfig);
transactionsRouter.get('/', async (request, response) => {
  const getTransactionsWithBalance = new GetTransactionsWithBalanceService();
  const transactionsWithBalance = await getTransactionsWithBalance.execute();
  return response.json(transactionsWithBalance);
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;
  const createTransaction = new CreateTransactionService();

  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category,
  });
  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const deleteTransaction = new DeleteTransactionService();
  await deleteTransaction.execute({ id });
  return response.status(204).send();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const importTransactions = new ImportTransactionsService();
    const { filename: csvFilename } = request.file;
    const transactions = await importTransactions.execute({ csvFilename });
    return response.json(transactions);
  },
);

export default transactionsRouter;
