import { Router } from "express";
import { createFinancialAccount , getAllFinancialAccounts , getFinancialAccountById , updateFinancialAccount , deleteFinancialAccount} from "../controllers/financialAccounts";

const router = Router();

router.post('/', createFinancialAccount);
router.get('/', getAllFinancialAccounts);
router.get('/:id', getFinancialAccountById);
router.put('/:id', updateFinancialAccount);
router.delete('/:id', deleteFinancialAccount);

export default router;