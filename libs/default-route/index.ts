import { Router } from 'express';
import Backend from './backend';

const router = Router();

router.use('/backend', Backend); 


export default router;
