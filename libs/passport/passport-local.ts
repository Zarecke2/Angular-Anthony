require('dotenv').config();

import { Strategy } from 'passport-local';
import { user_table, comparePassword } from '../models/users';
import { omit } from 'underscore';

export function PASSPORTLOCAL(passport) {
    passport.use(new Strategy({ usernameField: 'email', passwordField: 'password' },
        function (username, password, done) {
            const uname = String(username);
            const pass = String(password);

            if (uname === undefined || uname === '' || uname === null || pass === undefined || pass === '' || pass === null) {
                return done(new Error('incorrectPassword'), false);
            }

            user_table.findOne({ email: uname }) //possiblité de se connecter avec le mail
                .exec((err, user) => {
                    if (err) {
                        return done(err, false);
                    } else if (!user) {
                        return done(new Error('accountUnknowed'));
                    } else {
                        comparePassword(pass, user.password, (err2, isMatch) => {
                            if (err2) {
                                return done(err2, false);
                            }
                            if (!isMatch) {
                                return done(new Error('incorrectPassword'), false);
                            } else {
                                delete user.password;
                                return done(null, omit(user, '_password'));
                            }
                        });
                    }

                });
        }));
}
