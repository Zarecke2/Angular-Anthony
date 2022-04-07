
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User, user_table } from '../models/users'
import { readFileSync } from 'fs';
import { join } from 'path';

const distFolder = process.cwd().indexOf('www') === -1? join(process.cwd(), 'www'): process.cwd();

export function PASSPORTJWT(passport) {
  const publicKEY = readFileSync(join(distFolder, 'config/public.pem'), 'utf8');

  passport.use(new Strategy({
    jwtFromRequest : ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: publicKEY,
    ignoreExpiration: false,
    algorithms: ['RS256'],
    passReqToCallback: true
  }, (request, jwt_payload, done) => {
      user_table.findOne({email: jwt_payload.email})
      //.select('-_snowToken -updatedAt -u_entity -_authorized -sys_updated_on -sys_id -_browsers')
      .exec((err, user) => {
        if (err) {
          return done(new Error(err.message), false);
        } else if (!user) {
          return done(new Error('invalid_token'), false);
        } else {
          if (request.sessionID !== jwt_payload.sessionID) {
            return done(new Error('invalid_token'), false);
          } else {
            delete user?.password;
            return done(null, user, jwt_payload.sessionID);
          }
        }
      })
    }
  ));
}
