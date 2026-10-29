// Runs once, on the first start with an empty data volume.
// Payload connects as this user, which can only read/write its own database (not root).
const { MONGO_DB, MONGO_USER, MONGO_PASSWORD } = process.env

db.getSiblingDB(MONGO_DB).createUser({
  user: MONGO_USER,
  pwd: MONGO_PASSWORD,
  roles: [{ role: 'readWrite', db: MONGO_DB }],
})
