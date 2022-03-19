import { ResponseAction } from '../models/response-action.js';

export async function userSkillHandler(db, request) {
  const skillId = request.url.match(/.+?(\d+)/)?.[1];

  switch (request.method) {
    case 'DELETE':
      if (skillId === undefined) {
        return Promise.resolve(new ResponseAction(422, 'Invalid skill id'));
      }
      return db
        .run(`DELETE FROM user_skills WHERE id = ${skillId}`)
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

      if (!payload.userId || !payload.skillId) {
        return Promise.resolve(
          new ResponseAction(422, 'There are missed properties')
        );
      }

      return db.run(`INSERT INTO 'user_skills' (user_id, skill_id) VALUES (${payload.userId}, ${payload.skillId})`)
        .then(
          (result) => new ResponseAction(200, result.lastID),
          (error) => new ResponseAction(500, error.message)
        );
    default:
      return Promise.resolve(new ResponseAction(405));
  }
}
