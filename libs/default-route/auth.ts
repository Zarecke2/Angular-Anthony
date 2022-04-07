'use strict'
require('dotenv').config();


import { sign as jwtSign } from 'jsonwebtoken';
import { existsSync, readFileSync } from 'fs';
import { authenticate } from 'passport';
import { join } from 'path';
import * as rateLimit from 'express-rate-limit';
import * as express from 'express';
import * as crypto from 'crypto';
import { isNull, isUndefined, pick } from 'underscore';
import { user_table } from 'libs/models/users';
import { Types } from 'mongoose';




const distFolder = process.cwd().indexOf('www') === -1 ? join(process.cwd(), 'www') : process.cwd();
const router = express.Router();
// rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: 'Nombre de requêtes dépassé. \\Veuillez attendre 15 minutes avant de renouveller votre demande.' }),
router.post('/login',
    authenticate('local', { session: false, failureFlash: true, failureRedirect: '/menu' }), (req, res, next) => {
        console.log('dans la fonction');
        const privateKEY = readFileSync(join(distFolder, 'config/private.pem'), 'utf8');
        const token = jwtSign({
            _id: req.user['_id'],
            first_name: req.user['first_name'],
            last_name: req.user['last_name'],
            email: req.user['email'],
            role: req.user['role'],
            status: req.user['status'],
            uc: req.user['uc'],
            sessionID: req['sessionID']
        }, privateKEY, { expiresIn: '3days', algorithm: 'RS256' });

        // if (!isNull(req.user['_avatar']) && !isUndefined(req.user['_avatar']) && !isNull(req.user['_avatar'].path_local) && !isUndefined(req.user['_avatar'].path_local) &&
        //   existsSync(req.user['_avatar'].path_local)) {
        //   const base64Code = readFileSync(req.user['_avatar'].path_local).toString('base64');
        //   const prefix = 'data:' + req.user['_avatar'].typeImage + ';base64,';
        //   req.user['_avatar'].path_local = prefix + base64Code;
        // }
        // console.log(req.user['user_name'], 'user-agent', pick(req['useragent'], 'browser', 'version', 'os'))
        res.send({
            token,
            user: req.user
        });
    });

router.get('/profile', (req, res, next) => {
    res.send(req.user);
});


router.post('/signin', (req, res, next) => {
    console.log('req', req.body);
    res.send('ok');
});

router.get('/firstAdmin', (req, res, next) => {
    new user_table({
        _id: (new Types.ObjectId).toHexString(),
        first_name: 'admin',
        last_name: 'admin',
        email: 'admin@admin.com',
        password: 'admin',
        role: 'Admin'
    }).save().then((value) => {
        res.send(value)
    }).catch((err) => {
        return next(new Error(err.message));
    });
});

router.get('/firstAdmin', (req, res, next) => {
    new user_table({
        _id: (new Types.ObjectId).toHexString(),
        first_name: 'admin',
        last_name: 'admin',
        email: 'admin@admin.com',
        password: 'admin',
        role: 'Admin'
    }).save().then((value) => {
        res.send(value)
    }).catch((err) => {
        return next(new Error(err.message));
    });
});



export default router;


