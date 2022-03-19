import { ResponseAction } from '../models/response-action.js';

export async function userHandler(db, request) {
  const userId = request.url.match(/.+?(\d+)/)?.[1];

  switch (request.method) {
    case 'GET':
      if (userId === undefined) {
        return Promise.resolve(new ResponseAction(422, 'Invalid user id'));
      }
      return db
        .get(`SELECT * FROM users WHERE id = ${userId}`)
        .then((user) =>
          user ? new ResponseAction(200, user) : new ResponseAction(404)
        );
    case 'DELETE':
      if (userId === undefined) {
        return Promise.resolve(new ResponseAction(422, 'Invalid user id'));
      }
      return db
        .run(`DELETE FROM users WHERE id = ${userId}`)
        .then(() => new ResponseAction(200));
    case 'POST':
      if (request.headers?.['content-type'] !== 'application/json') {
        return Promise.resolve(new ResponseAction(415));
      }

      const buffer = [];

      for await (const chunk of request) {
        buffer.push(chunk);
      }

      let payload;

      try {
        payload = JSON.parse(Buffer.concat(buffer).toString());
      } catch (error) {
        return Promise.resolve(new ResponseAction(422, 'JSON parse error'));
      }

      if (!payload.name) {
        return Promise.resolve(
          new ResponseAction(422, 'There are missed properties')
        );
      }

      return db.run(`INSERT INTO 'users' (name) VALUES ("${payload.name}")`)
        .then(
          (result) => new ResponseAction(200, result.lastID),
          (error) => new ResponseAction(500, error.message)
        );
    default:
      return Promise.resolve(new ResponseAction(405));
  }
}
