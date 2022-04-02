'user strict'
require('dotenv').config();


import * as express from 'express';
import { enseignants_table } from 'libs/models/enseignant';
import { Types } from 'mongoose';


const router = express.Router();

router.get('/test', (req, res, next) => {
    console.log("salut les loosers");
    new enseignants_table({name: 'TEST', _id: (new Types.ObjectId).toHexString()}).save().then((value) => {
        console.log('yes !')
        res.send({message: 'yeaaaaaaaaaah !!'});
    }).catch((err) => {
        return next(new Error(err));
    })
});

export default router;