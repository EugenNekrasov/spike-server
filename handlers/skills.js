import { ResponseAction } from '../models/response-action.js';
import { URL } from 'url';

export async function userSkillsHandler(db, request) {
  switch (request.method) {
    case 'GET':
      const url = new URL('http://localhost/' + request.url);
      
      if (!url.searchParams.has('userId')) {
        return db
        .all('SELECT * FROM user_skills')
        .then((result) => new ResponseAction(200, result));
      }

      const userId = url.searchParams.get('userId');

      return db
        .all(`select * from user_skills where user_id = ${userId}`)
        .then(skills => {
          return skills.length > 0
            ? new ResponseAction(200, skills)
            : new ResponseAction(404);
        })
    default:
      return Promise.resolve(new ResponseAction(405));
  }
}
