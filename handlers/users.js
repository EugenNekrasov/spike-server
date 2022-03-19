import { ResponseAction } from '../models/response-action.js';

export function usersHandler(db, method) {
  switch (method) {
    case 'GET':
      return db
        .all('SELECT * FROM users')
        .then(result => new ResponseAction(200, result));
    default:
      return Promise.resolve(new ResponseAction(405));
  }
}
