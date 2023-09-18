import fastify from 'fastify';
import fastifyPlugin from 'fastify-plugin';
// import DatabaseMemory from './database-memory.mjs';
import DatabasePostgres from './database-postgres.mjs';

const server = fastify();

// Register a plugin to parse JSON bodies
server.register(fastifyPlugin((instance, opts, done) => {
  instance.addContentTypeParser('application/json', { parseAs: 'string' }, (req, body, done) => {
    try {
      done(null, JSON.parse(body));
    } catch (err) {
      err.statusCode = 400;
      done(err, undefined);
    }
  });

  done();
}));


const database = new DatabasePostgres();


server.setErrorHandler((error, request, reply) => {
  reply.status(error.statusCode || 500).send({
    statusCode: error.statusCode || 500,
    error: error.name || 'Internal Server Error',
    message: error.message || 'An error occurred on the server.',
  });
});


server.post('/fotos', {
  schema: {
    body: {
      type: 'object',
      required: ['title', 'description', 'size'],
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        size: { type: 'number' },
      },
    },
  },
}, async (request, reply) => {

  const { title, description, size } = request.body;

 
  const foto = {
    title,
    description,
    size,
  };


  await database.create(foto);


  reply.status(201).send();
});


server.get('/fotos', async (request) => {
const search = request.query.search

console.log(search)
  const fotos = await database.list(search);


  return fotos;
});


server.put('/fotos/:id', async (request, reply) => {

  const fotoId = request.params.id;


  const { title, description, size } = request.body;


  await database.update(fotoId, {
    title,
    description,
    size,
  });


  reply.status(204).send();
});


server.delete('/fotos/:id', async (request, reply) => {

  const fotoId = request.params.id;


  await database.delete(fotoId);


  reply.status(204).send();
});


async function start() {
  try {
    await server.listen({
      host: '0.0.0.0',
      port: process.env.PORT ?? 3333,
    });
    console.log('Server is running on port 3333');
  } catch (err) {
    console.error('Error starting the server:', err);
    process.exit(1);
  }
}

start();