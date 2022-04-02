/***************************************************************************************************
 * Load `$localize` onto the global scope - used if i18n tags appear in Angular templates.
 */
 import '@angular/localize/init';
 /**
  * *** NOTE ON IMPORTING FROM ANGULAR AND NGUNIVERSAL IN THIS FILE ***
  *
  * If your application uses third-party dependencies, you'll need to
  * either use Webpack or the Angular CLI's `bundleDependencies` feature
  * in order to adequately package them for use on the server without a
  * node_modules directory.
  *
  * However, due to the nature of the CLI's `bundleDependencies`, importing
  * Angular in this file will create a different instance of Angular than
  * the version in the compiled application code. This leads to unavoidable
  * conflicts. Therefore, please do not explicitly import from @angular or
  * @nguniversal in this file. You can export any needed resources
  * from your application's main.server.ts file, as seen below with the
  * import for `ngExpressEngine`.
  */



import 'zone.js/dist/zone-node';
import * as express from 'express';
import * as session from 'express-session';
import * as useragent from 'express-useragent';
import * as cors from 'cors';
import { APP_BASE_HREF } from '@angular/common';
require('dotenv').config();

import { ngExpressEngine } from '@nguniversal/express-engine';
import { join } from 'path';
import { AppServerModule } from 'src/app/app.server.module';
import { existsSync, readFileSync } from 'fs';
import { connect as mongoConnect, ConnectOptions, connection as mongoConnection, Types } from 'mongoose';
import routes_api from './libs/default-route'
// import connectMongo from 'connect-mongo';
import { enseignants_table } from 'libs/models/enseignant';

const distFolder = process.cwd().indexOf('www') === -1 ? join(process.cwd(), 'www') : process.cwd();
const domino = require('domino');
// const MongoStore = connectMongo(session)

export function app() {
    const server = express();
    const indexHtml = existsSync(join(distFolder, 'app/index.original.html')) ? 'index.original.html' : 'index';
    const template = readFileSync(join(distFolder, 'app/index.html')).toString();
    const window = domino.createWindow(template);
    // const privateKEY = readFileSync(join(distFolder, 'config/private.pem'), 'utf8');

    server.use(cors());
    server.use(express.json({ limit: '50mb' }));
    server.use(express.urlencoded({ extended: true }));
    server.use(useragent.express());


    const connectionOptions: ConnectOptions = {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true,
        family: 4,
        connectTimeoutMS: 25000
    }

    mongoConnect(process.env.DB_CONNECTION_STRING, process.env.SERVER_ENV !== 'development' ?
        Object.assign({}, connectionOptions, {
            auth: { user: process.env.DB_ACCOUNT, password: process.env.DB_PWD },
            authSource: 'projet_db',
            autoIndex: false
        }) : Object.assign({}, connectionOptions, {
            autoIndex: true
        })
    );

    mongoConnection.on('connected', () => {
        //instruction supplémentaire après connexion
        console.log(`connected to ${process.env.SERVER_ENV} database`);

    });
    mongoConnection.on('error', (err) => {
        console.log('database error: ' + err)
    });
    mongoConnection.on('open', () => {

    });
    // server.use(['/api'], session({
    //     saveUninitialized: true,
    //     resave: false,
    //     store: new MongoStore({
    //       mongooseConnection: mongoConnection,
    //       autoRemove: 'native',
    //       ttl: 14 * 24 * 60 * 60 * 1000 // 14 jours
    //     }),
    //     secret: privateKEY,
    //     name: 'bassl',
    //     cookie: {
    //       httpOnly: true,
    //       secure: false,
    //       signed: true,
    //       encode: () => 'RS256',
    //       path: '/',
    //       sameSite: true,
    //       maxAge: 14 * 24 * 60 * 60 * 1000 // 14 jours
    //     }
    //   }));

    server.use('/api/system', routes_api);

    // global['localStorage'] = new LocalStorage('./scrach');
    global['window'] = window;
    global['self'] = window;
    global['navigator'] = window.navigator;
    global['document'] = window.document;
    global['location'] = window.location;
    global['onpopstate'] = window.onpopstate;
    global['history'] = window.history;
    global['getComputedStyle'] = window.getComputedStyle;

    server.engine('html', ngExpressEngine({
        bootstrap: AppServerModule
    }));

    server.set('view engine', 'html');
    server.get('*.*', express.static(join(distFolder, 'app'), {
        maxAge: '1y'
    }));

    server.get('*', (req, res) => {
        res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
    });

    server.use((err: { message: string; status: number; }, req: express.Request, res: express.Response, next: any) => {
        if (err.message === 'invalid_token' || err.status === 401) {
            res.clearCookie('bassl');
            res.status(401).send('Session expirée. Veuillez vous reconnecter !');
        } else {
            res.status(500).send(err.message);
        }
    });

    return server;
}

function run() {
    const server = app().listen(process.argv[2] || 4000, () => {
        console.log(`Le serveur Express écoute sur http://localhost:${process.argv[2] || process.env['SERVER_PORT'] || 4000}`);
        console.log(`Environnement ${process.env['SERVER_ENV']})`);
    });
}


declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename?.includes('iisnode')) {
    run();
}

export * from './src/main.server';
