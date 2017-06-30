const databaseClient = require('then-redis').createClient({
  host: 'redis-15864.c11.us-east-1-2.ec2.cloud.redislabs.com',
  port: '15864',
  password: 'D4tH0cB0n9'
});

module.exports = {
  databaseClient
}
