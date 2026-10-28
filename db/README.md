# MongoDB + Mongo Express Stack for Payload

This repository provides a Docker stack with MongoDB and Mongo Express that can be used by a separate Payload app.

## Images

- MongoDB: mongo:8 (stable major)
- GUI: mongo-express:latest

## Start

Run:

```bash
docker compose up -d
```

Services:

- MongoDB: localhost:27017
- Mongo Express: http://localhost:8181

## Connection Strings for Payload

Use one of these in your Payload app:

- Root/admin user:
  mongodb://root:rootpassword@localhost:27017/myDB01?authSource=admin
- App user (created by init script):
  mongodb://appuser:password123@localhost:27017/myDB01?authSource=myDB01

## Create Users and Roles (Docker Exec Style)

Use mongosh inside the running MongoDB container.

```bash
docker compose exec mongo mongosh -u root -p CHANGE_ME_STRONG_MONGO_PASSWORD --authenticationDatabase admin
```

Or with plain docker exec:

```bash
docker exec -it mongodb mongosh -u root -p CHANGE_ME_STRONG_MONGO_PASSWORD --authenticationDatabase admin
```

Then run:

```javascript
use myDB01

// Read-only user
db.createUser({
  user: "app_readonly",
  pwd: "CHANGE_ME_READONLY_PASSWORD",
  roles: [{ role: "read", db: "myDB01" }]
})

// Read-write user
db.createUser({
  user: "app_readwrite",
  pwd: "CHANGE_ME_READWRITE_PASSWORD",
  roles: [{ role: "readWrite", db: "myDB01" }]
})

// DB admin-style user (DB-level admin privileges on myDB01)
db.createUser({
  user: "app_dbadmin",
  pwd: "CHANGE_ME_DBADMIN_PASSWORD",
  roles: [{ role: "dbAdmin", db: "myDB01" }]
})
```

Optional direct one-liner format:

```bash
docker compose exec mongo mongosh -u root -p CHANGE_ME_STRONG_MONGO_PASSWORD --authenticationDatabase admin --eval "db = db.getSiblingDB('myDB01'); db.createUser({user: 'app_readwrite2', pwd: 'CHANGE_ME_PASSWORD', roles: [{role: 'readWrite', db: 'myDB01'}]});"
```

check

```bash
docker compose exec mongo mongosh -u root -p CHANGE_ME_STRONG_MONGO_PASSWORD --authenticationDatabase admin --eval "db = db.getSiblingDB('myDB01'); db.getUsers()"
```



## Notes

- The app user is created by mongo-init/init.js on first container initialization.
- If you change user/password/db values, remove the Docker volume and recreate containers so init runs again.

## WiredTiger Startup Warning

MongoDB may print this warning at startup:

```text
The server generated these startup warnings when booting
2026-04-20T08:22:54.221+00:00: Using the XFS filesystem is strongly recommended with the WiredTiger storage engine. See http://dochub.mongodb.org/core/prodnotes-filesystem
```

This is a performance recommendation, not a startup failure. The container can still run on other filesystems in development.

For production, prefer running MongoDB data on XFS for WiredTiger.

jdbc

```text
jdbc:mongodb://appuser:password123@localhost:27017/myDB01?authSource=myDB01
jdbc:mongodb://appuser:password123@localhost:27017/myDB01?authSource=myDB01
```

LInks

<https://www.mongodb.com/docs/sql-interface/dbeaver/connect/>

<https://www.mongodb.com/try/download/jdbc-driver>