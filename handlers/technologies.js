import { ResponseAction } from '../models/response-action.js';

export function technologiesHandler(db, request) {
  switch (request.method) {
    case 'GET':
      return db
        .all('SELECT * FROM technologies')
        .then(string => new ResponseAction(200, string));
    default:
      return Promise.resolve(new ResponseAction(405));
  }
}
