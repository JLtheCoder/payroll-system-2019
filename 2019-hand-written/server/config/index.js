module.exports = {
  port:  process.env.PORT || 8081,
  databaseUrl: process.env.DATABASE_URL,
  isProduction: process.env.NODE_ENV === 'production'
};
