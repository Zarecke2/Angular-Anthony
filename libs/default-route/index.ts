import { Router } from 'express';
import Backend from './backend';
import Admin from './admin'

const router = Router();

router.use('/backend', Backend); 
router.use('/admin', Admin)

export default router;
