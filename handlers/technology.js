import { ResponseAction } from '../models/response-action.js';

export async function techologyHandler(db, request) {
  const technologyId = request.url.match(/.+?(\d+)/)?.[1];

  switch (request.method) {
    case 'DELETE':
      if (technologyId === undefined) {
        return Promise.resolve(new ResponseAction(422, 'Invalid technology id'));
      }
      return db
        .run(`DELETE FROM technologies WHERE id = ${technologyId}`)
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

      if (!payload.name || !payload.typeId) {
        return Promise.resolve(
          new ResponseAction(422, 'There are missed properties')
        );
      }

      return db.run(`insert into technologies (name, type_id) values ("${payload.name}",${payload.typeId})`)
        .then(
          (result) => new ResponseAction(200, result.lastID),
          (error) => new ResponseAction(500, error.message)
        );
    default:
      return Promise.resolve(new ResponseAction(405));
  }
}
