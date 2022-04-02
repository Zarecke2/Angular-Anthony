'use strict'
require('dotenv').config();


import * as express from 'express';
import { ues_table } from 'libs/models/ue';
import { user_table } from 'libs/models/users';
import { Types } from 'mongoose';


const router = express.Router();




export default router;