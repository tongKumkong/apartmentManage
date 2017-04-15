/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';

export default function(app) {
  // Insert routes below
  app.use('/api/history-waters', require('./api/history-water'));
  app.use('/api/history-electrics', require('./api/history-electric'));
  app.use('/api/readers', require('./api/reader'));
  app.use('/api/commands', require('./api/command'));
  app.use('/api/rooms', require('./api/room'));
  app.use('/api/buildings', require('./api/building'));
  app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth').default);

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      res.sendFile(path.resolve(`${app.get('appPath')}/index.html`));
    });
}
