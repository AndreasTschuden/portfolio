db = db.getSiblingDB('portfoliodb')
db.createUser({
  user: 'tschudea',
  pwd: 'swIolexlvLv0oMIPSUfY',
  roles: [{ role: 'readWrite', db: 'portfoliodb' }],
})
