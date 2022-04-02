'use strict'
require('dotenv').config();


import * as express from 'express';
import { ues_table } from 'libs/models/ue';
import { user_table } from 'libs/models/users';
import { Types } from 'mongoose';


const router = express.Router();

router.post('/test', (req, res, next) => {
    console.log('req.body', req.body);
    new ues_table({
        _id: (new Types.ObjectId).toHexString(),
        "Formation": "Licence",
        "Semestre": 1,
        "Ref": "UEinfo1.3",
        "Intitulé": "BASES DE PROGRAMMATION",
        "Statut": "obligatoire",
        "h/CM": 12,
        "h/TD": 24,
        "h/TP": 12,
        "Effectif": 301,
        "grCM": 1,
        "grTD": 8,
        "grTP": 19
    }).save().then((value) => {
        ues_table.find({}, (err, ues) => {
            if (err) {
                console.log('err append', err);
            } else if (!ues?.length) {
                return next(new Error('Pas due trouvées !!'))
            } else {
                new user_table({
                    _id: (new Types.ObjectId).toHexString(),
                    user_name: "Anonyth",
                    email: req.body.email,
                    password: req.body.password,
                    ues_inscrit: [{
                        ue: ues[0]?._id,
                        groupe_cm: 1,
                        groupe_td: 1,
                        groupe_tp: 1
                    }]
                }).save().then((value) => {
                    res.send({user: value, ue: ues[0]});
                }).catch((err) => {
                    return next(new Error(err));
                })
            }
        });
    }).catch((err) => {
        return next(new Error(err));
    });
});


router.post('/signin', (req, res, next) => {
    // { email: string, password: string }
    // new enseignants_table({name: 'TEST', _id: (new Types.ObjectId).toHexString()}).save().then((value) => {
    //     console.log('yes !')
    //     res.send({message: 'yeaaaaaaaaaah !!'});
    // }).catch((err) => {
    //     return next(new Error(err));
    // })
});

export default router;
