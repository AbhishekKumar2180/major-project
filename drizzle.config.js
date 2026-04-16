export default {
  schema: "./utils/schema.js",
  out: "./drizzle",
  driver: 'better-sqlite',
  dbCredentials: {
    url: "sqlite.db"
  }
};