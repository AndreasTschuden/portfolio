// Credentials come from db/.env (see .env.template), never from this file.
const { MONGO_APP_DB, MONGO_APP_USER, MONGO_APP_PASSWORD } = process.env

db.getSiblingDB(MONGO_APP_DB).createUser({
  user: MONGO_APP_USER,
  pwd: MONGO_APP_PASSWORD,
  roles: [{ role: 'readWrite', db: MONGO_APP_DB }],
})
