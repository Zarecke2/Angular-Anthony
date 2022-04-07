import { Router } from 'express';
import Backend from './backend';
import Admin from './admin'
import Auth from './auth'

const router = Router();

router.use('/backend', Backend); 
router.use('/admin', Admin)
router.use('/auth', Auth)

export default router;
