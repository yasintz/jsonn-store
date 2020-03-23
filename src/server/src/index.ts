import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import express from 'express';
import passport from 'passport';
import route from '@server/route';
import applyErrorHandlers from '@server/middleware/error-handler';
import ServerContext from '@server/context';
import passportService from '@server/services/passport.service';

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    callback(null, true);
  },
};

class App {
  express: express.Express;

  constructor() {
    this.createExpress();
    this.loadExpressConfiguration();
    passportService.useAll();
    this.applyRoutes();
    this.applyErrorHandler();
  }

  private createExpress = () => {
    this.express = express();
  };

  private loadExpressConfiguration = () => {
    this.express
      .disable('x-powered-by')
      // eslint-disable-next-line
      .use(express.static(process.env.RAZZLE_PUBLIC_DIR!))
      .use(express.json({ limit: '50mb' }))
      .use(express.urlencoded({ limit: '50mb', extended: false }))
      .use(cors(corsOptions))
      .use(
        session({
          secret: ServerContext.SESSION_SECRET_KEY,
          cookie: { maxAge: 60000 },
          resave: false,
          saveUninitialized: false,
        }),
      )
      .use(passport.initialize())
      .use(passport.session())
      .use(bodyParser.json());
  };

  private applyRoutes = () => {
    route(this.express);
  };

  private applyErrorHandler = () => {
    applyErrorHandlers(this.express);
  };
}

export default new App();
