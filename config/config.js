module.exports = {
  development: {
    host: process.env.DATABASE_HOST || 'mysql', // it should be 'mysql' not 'localhost' !!!!!!
    user: 'root',
    password: 'password',
    database: 'db',
    port: process.env.DATABASE_PORT || 3306
  },
  production: {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'testapi'
  }
};