/**
 * Production keys.
 * @description Production keys must be set as enviroment variables (Google App Engine).
 * @param {string} mongoURI - mongodb database uri.
 */
module.exports = {
  mongoURI: process.env.MONGO_URI,
};
