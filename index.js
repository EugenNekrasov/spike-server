import { createServer } from 'http';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { userSkillsHandler } from './handlers/skills.js';
import { userSkillHandler } from './handlers/skill.js';
import { userHandler } from './handlers/user.js';
import { usersHandler } from './handlers/users.js';
import { technologiesHandler } from './handlers/technologies.js';
import { ResponseAction } from './models/response-action.js';
import { techologyHandler } from './handlers/technology.js';

function requestHandler(db) {
  return async function (request, response) {
    let result;

    if (request.url.match(/^\/api\/users$/)) {
      result = await usersHandler(db, request.method);
    } else if (request.url.match(/^\/api\/user/)) {     
      result = await userHandler(db, request);
    } else if (request.url.match(/^\/api\/skills/)) {
      result = await userSkillsHandler(db, request);
    } else if (request.url.match(/^\/api\/skill/)) {
      result = await userSkillHandler(db, request);
    } else if (request.url.match(/^\/api\/technologies$/)) {
      result = await technologiesHandler(db, request);
    } else if (request.url.match(/^\/api\/technology/)) {
      result = await techologyHandler(db, request);
    } else {
      result = new ResponseAction(404);   
    }

    response.writeHead(result.code);
    if (result.body) {
      response.write(JSON.stringify(result.body));
    }
    response.end();
  };
}

console.info('Application has started');

const db = await open({
  driver: sqlite3.Database,
  filename: './core.db',
  mode: sqlite3.OPEN_READWRITE,
});

console.info('Database has been connected');

const server = createServer(requestHandler(db));

server.on('error', (error) => {
  db.close();
  console.error('Server error: %s', error);
});
server.listen(8080);

({ message }) => console.error('Database connection error: %s', message);
