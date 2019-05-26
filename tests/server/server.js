const path = require('path');
const fastify = require('fastify')({
  logger: {
    prettyPrint: true,
  },
});
const config = require('./serverConfig');

fastify.register(require('fastify-sensible'));
fastify.register(require('fastify-static'), {
  root: path.resolve(__dirname, '../dist'),
});

fastify.get('/', (req, res) => {
  res.header('Content-Type', 'text/html');
  res.sendFile('index.html');
});

const start = async () => {
  try {
    await fastify.listen(config.port);
    fastify.log.info(
      `Fastify server listening on ${fastify.server.address().port}`,
    );
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
