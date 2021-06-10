require('dotenv').config();

module.exports = {
  settting: {
    env: process.env.NODE_ENV || "development",
    port: process.env.PORT || 3000
  },
  db: {
    connection: process.env.DB_CONNECTION || "mongoDB",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 27017,
    user: process.env.DB_USERNAME || "",
    password: process.env.DB_PASSWORD || "",
    collection: process.env.DB_COLLECTION || "sample",
    connectionURL: function() {
      return `mongodb://${this.host}:${this.port}/${this.collection}`;
    } 
  },
  site: {
    RECORDS_PER_PAGE: 20,
    PAGE_RECORD_MAX_LIMIT: 500,
    AVAILABLE_RECORDS_SLICES_PER_PAGE: [20, 50, 100, 500]
  },
  security: {
    bcryptRounds: 10,
    jwtTokenSecret: '32465613136128sdnbsdfsdjasjsjd123617373973nsdfkjdfjsdf',
    jwtExpiration: 43200
  },
  session: {
    secret: process.env.SESSION_SECRET || "randomSecret",
    httpOnly: process.env.SESSION_HTTP_ONLY || true,
    maxAge: process.env.SESSION_MAX_AGE || 3600
  },
}