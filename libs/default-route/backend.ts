'use strict'
require('dotenv').config();


import * as express from 'express';
import { ues_table } from 'libs/models/ue';
import { user_table } from 'libs/models/users';
import { all_ues } from 'libs/variables';
import { Types } from 'mongoose';
import { extend, omit } from 'underscore';


const router = express.Router();

router.post('/test', (req, res, next) => {
    console.log('req.body', req.body);
    new ues_table({
        _id: (new Types.ObjectId).toHexString(),
        "Formation": "Licence",
        "Semestre": 1,
        "Ref": "UEinfo1.3",
        "Intitule": "BASES DE PROGRAMMATION",
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
                    res.send({ user: value, ue: ues[0] });
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

});

router.get('/get-enseignants', (req, res, next) => {
    user_table.find({}, (err, users) => {
        if (err) {
            console.log('err append', err);
        } else if (!users?.length) {
            return next(new Error('Pas due trouvées !!'))
        } else {
            res.send(users);
        }
    });
});

router.post('/delete-enseignants', (req, res, next) => {
    user_table.deleteOne({ _id: req.body }).then((value) => {
        if (value.deletedCount > 0) {
            res.send({ success: true });
        } else {
            return next(new Error('L\'enseignant n\'a pas été supprimé'))
        }
    }).catch((err) => {
        return next(new Error(err?.message))
    })
});

router.post('/add-enseignant', (req, res, next) => {
    new user_table(extend({}, req.body, { _id: (new Types.ObjectId).toHexString() })).save().then((value) => {
        res.send({ enseignant: value });
    }).catch((err) => {
        return next(new Error(err?.message));
    });
});

router.post('/edit-enseignant', (req, res, next) => {
    user_table.findOne({ _id: req.body?._id }, {}, {}, (err, user) => {
        if (err) {
            return next(new Error(err?.message));
        } else if (!user) {
            return next(new Error('L\'enseignant n\'a pas été trouvé dans la base de données'));
        } else {
            user = extend({}, user, { password: req.body.password })
                .save((err1, value) => {
                    if (err) {
                        return next(new Error(err?.message));
                    } else {
                        res.send({ enseignant: value });
                    }
                });
        }
    });
});


router.get('/get-ues', (req, res, next) => {
    ues_table.find({}, (err, ues) => {
        if (err) {
            console.log('err append', err);
        } else if (!ues?.length) {
            return next(new Error('Pas d\'Ues trouvées !!'))
        } else {
            res.send(ues);
        }
    });
});

router.post('/delete-ue', (req, res, next) => {
    ues_table.deleteOne({ _id: req.body }).then((value) => {
        if (value.deletedCount > 0) {
            res.send({ success: true });
        } else {
            return next(new Error('L\'UE n\'a pas été supprimée'))
        }
    }).catch((err) => {
        return next(new Error(err?.message))
    })
});

router.post('/add-ue', (req, res, next) => {
    new ues_table(extend({}, req.body, { _id: (new Types.ObjectId).toHexString() })).save().then((value) => {
        res.send({ ue: value });
    }).catch((err) => {
        return next(new Error(err?.message));
    });
});

router.post('/edit-ue', (req, res, next) => {
    user_table.findOneAndUpdate({ _id: req.body?._id }, { $set: omit(req.body, '_id') }, {}, (err, ue) => {
        if (err) {
            return next(new Error(err?.message));
        } else if (!ue) {
            return next(new Error('L\'Ue n\'a pas été trouvé dans la base de données'));
        } else {
            res.send({ ue: ue });
        }
    });
});


router.get('/add-all-ue', (req, res, next) => {
    const ues_to_add = all_ues

    ues_table.bulkWrite(ues_to_add.map(ue => ({
        updateOne: {
            filter: {},
            update: {
                $set: { ue },
                $setOnInsert: {
                    _id: (new Types.ObjectId).toHexString()
                  }
            },
            upsert: true
        }
    }))
    );
});








export default router;



