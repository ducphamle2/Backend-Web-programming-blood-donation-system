module.exports = {
  development: {
    username: "",
    password: "",
    database: "",
    host: "127.0.0.1",
    dialect: "postgres",
    port: 5432,
    define: {
      freezeTableName: true
    }
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: "postgres",
    define: {
      freezeTableName: true
    }
  }
};
