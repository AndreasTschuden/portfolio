# Deployment – Schritt für Schritt

Diese Anleitung bringt das Portfolio auf einen eigenen Linux-Server: mit HTTPS, Datenbank, Datei-Speicher und Kontaktformular-Mails. Alle Dateien dafür liegen in [`deploy/`](deploy/).

```
Internet ──▶ Traefik :80/:443 ──▶ payload :3000 (Next.js + Payload CMS)
             HTTPS, Let's Encrypt,     ├──▶ mongo      (Datenbank)
             Security-Header,          └──▶ seaweedfs  (S3, Uploads)
             Rate-Limit
```

- Nur **Traefik** ist von außen erreichbar (Port 80 und 443). HTTP wird automatisch auf HTTPS umgeleitet, das Zertifikat holt Traefik selbst von Let's Encrypt und erneuert es auch.
- **MongoDB** und **SeaweedFS** hängen in einem internen Docker-Netz ohne Internetzugang. Uploads (Bilder, CV) liefert Payload unter `/api/<collection>/file/…` aus.
- Payload verbindet sich mit einem eigenen DB-User, der nur die Portfolio-Datenbank lesen und schreiben darf, nicht als root.
- Kontaktformular und Login sind auf etwa 5 Anfragen pro Minute und IP begrenzt (Schutz vor Spam und Passwort-Raten).

---

## 0. Vorher erledigen: geleaktes Passwort

Das Repo ist öffentlich, und in `db/mongo-init/init.js` stand früher ein Passwort im Klartext. Es bleibt in der Git-History für immer lesbar. **Verwende dieses Passwort nirgends mehr** und ändere es überall, wo du es benutzt hast, auch in deiner lokalen Datenbank:

```bash
docker exec -it mongodb mongosh -u root -p --authenticationDatabase admin \
  --eval 'db.getSiblingDB("portfoliodb").changeUserPassword("tschudea", passwordPrompt())'
```

Danach das neue Passwort in deiner lokalen `.env` (`DATABASE_URL`) und in `db/.env` (`MONGO_APP_PASSWORD`) eintragen.

---

## 1. Was du brauchst

| | |
|---|---|
| **Server** | VPS mit Ubuntu 24.04 (z. B. Hetzner, Netcup), **mind. 4 GB RAM** (der Next.js-Build braucht viel Speicher; bei 2 GB siehe Schritt 3.3), 20 GB Disk |
| **Domain** | z. B. `tschuden.at`, bei einem Anbieter, bei dem du DNS-Einträge setzen kannst |
| **Resend-Account** | optional, nur für die Mails aus dem Kontaktformular ([resend.com](https://resend.com), Gratis-Tarif reicht) |
| **SSH-Zugang** | du kannst dich mit `ssh root@<server-ip>` einloggen |

---

## 2. DNS einrichten

Beim Domain-Anbieter einen Eintrag anlegen, der auf die IP des Servers zeigt:

| Typ | Name | Wert |
|---|---|---|
| `A` | `@` (oder leer) | IPv4 des Servers, z. B. `203.0.113.10` |
| `AAAA` | `@` | IPv6 des Servers (nur wenn vorhanden) |

Prüfen, ob der Eintrag schon gilt (kann ein paar Minuten bis Stunden dauern):

```bash
dig +short tschuden.at     # muss die Server-IP ausgeben
```

> Das Setup bedient genau **eine** Domain. `www.tschuden.at` funktioniert damit nicht automatisch.

---

## 3. Server vorbereiten

Auf dem Server einloggen:

```bash
ssh root@<server-ip>
```

### 3.1 System aktualisieren und Firewall

```bash
apt update && apt upgrade -y
apt install -y git ufw
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

### 3.2 Docker installieren

```bash
curl -fsSL https://get.docker.com | sh
docker --version          # muss 29 oder höher sein
docker compose version
```

### 3.3 Swap anlegen (bei weniger als 4 GB RAM)

Ohne Swap bricht der Build auf kleinen Servern mit „out of memory“ ab:

```bash
fallocate -l 4G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

---

## 4. Code holen

```bash
cd /opt
git clone https://github.com/AndreasTschuden/portfolio.git
cd portfolio/deploy
```

---

## 5. Konfiguration (`.env`)

```bash
cp .env.example .env
chmod 600 .env            # nur root darf die Secrets lesen
```

Für die Secrets brauchst du zufällige Werte. Diesen Befehl einfach mehrmals ausführen, er erzeugt jedes Mal einen neuen:

```bash
openssl rand -hex 32
```

Dann `.env` bearbeiten (`nano .env`):

| Variable | Was eintragen |
|---|---|
| `DOMAIN` | deine Domain ohne `https://`, z. B. `tschuden.at` |
| `ACME_EMAIL` | deine E-Mail; Let's Encrypt schreibt dir, falls etwas mit dem Zertifikat nicht stimmt |
| `PAYLOAD_SECRET` | neues Secret |
| `MONGO_ROOT_USER` | `root` lassen |
| `MONGO_ROOT_PASSWORD` | neues Secret |
| `MONGO_DB` / `MONGO_USER` | `portfolio` / `payload` lassen |
| `MONGO_PASSWORD` | neues Secret |
| `S3_BUCKET` | `portfolio` lassen |
| `S3_ACCESS_KEY_ID` | neues Secret (`openssl rand -hex 16` reicht) |
| `S3_SECRET_ACCESS_KEY` | neues Secret |
| `RESEND_*`, `CONTACT_TO_EMAIL` | siehe Schritt 6, sonst leer lassen |

> Secrets **nur aus Buchstaben und Ziffern** (das liefert `openssl rand -hex`). Sonderzeichen wie `@` oder `/` würden die Datenbank-URL kaputt machen.

> Die Mongo-Passwörter werden **nur beim allerersten Start** übernommen. Wenn du sie später änderst, musst du sie auch in der Datenbank ändern (siehe Schritt 0 für den Befehl).

---

## 6. Resend für Kontaktformular-Mails (optional)

Ohne Resend wird jede Nachricht trotzdem gespeichert, du findest sie im Admin unter **Inbox → Contact Submissions**.

1. Auf [resend.com](https://resend.com) einloggen → **Domains → Add Domain** → deine Domain eintragen.
2. Die angezeigten DNS-Einträge (TXT/MX für SPF und DKIM) beim Domain-Anbieter anlegen und auf **Verify** klicken. Bis der Status „Verified“ zeigt, kann es etwas dauern.
3. **API Keys → Create API Key**, Berechtigung **Sending access**, auf deine Domain beschränken.
4. In `.env` eintragen:

   ```
   RESEND_API_KEY=re_…
   RESEND_FROM_EMAIL=kontakt@tschuden.at   # muss auf der verifizierten Domain liegen
   RESEND_FROM_NAME=Andreas Tschuden
   CONTACT_TO_EMAIL=deine.private@adresse.at
   ```

Antwortest du auf eine solche Mail, geht die Antwort direkt an die Person, die das Formular ausgefüllt hat.

---

## 7. Starten

```bash
docker compose up -d --build
```

Der erste Build dauert 3–10 Minuten. Danach prüfen:

```bash
docker compose ps
```

Erwartet: `traefik`, `payload`, `mongo` und `seaweedfs` sind `Up` (`mongo` und `seaweedfs` mit `healthy`), `bucket` ist `Exited (0)`. Das ist richtig so, er legt nur einmal den Speicher-Bucket an.

Logs ansehen, falls etwas nicht stimmt:

```bash
docker compose logs -f payload     # App
docker compose logs -f traefik     # Zertifikat / Routing
```

Nach ungefähr einer Minute sollte `https://<DOMAIN>` mit gültigem Zertifikat laden.

---

## 8. Admin-User anlegen – sofort!

Öffne **direkt nach dem Start** `https://<DOMAIN>/admin` und lege deinen Admin-User an. Solange noch kein User existiert, kann das **jeder** tun, der die Seite zuerst aufruft.

Übernimmst du in Schritt 9 deine lokale Datenbank, ist dein lokaler Admin-User schon dabei. Dann kannst du dich direkt mit den lokalen Zugangsdaten einloggen.

---

## 9. Inhalte von lokal übernehmen (optional)

Statt alles im Admin neu einzutragen, kannst du deine lokale Datenbank und die Uploads auf den Server kopieren. Diese Befehle laufen **auf deinem Mac**, im Projektordner, während die lokale DB (`db/`) und der lokale S3 (`s3bucket/`) laufen.

### 9.1 Lokal exportieren

```bash
mkdir -p transfer

# Datenbank (Passwort = das aus deiner lokalen .env, DATABASE_URL)
docker exec mongodb mongodump --archive --gzip \
  --uri "mongodb://tschudea:<LOKALES_PASSWORT>@localhost:27017/portfoliodb?authSource=portfoliodb" \
  > transfer/portfolio.archive.gz

# Uploads aus dem lokalen S3 (Keys = S3_ACCESS_KEY_ID / S3_SECRET_ACCESS_KEY aus deiner lokalen .env)
docker run --rm -v "$PWD/transfer/media:/data" \
  -e AWS_ACCESS_KEY_ID=<LOKALER_KEY> -e AWS_SECRET_ACCESS_KEY=<LOKALES_SECRET> \
  amazon/aws-cli s3 sync s3://portfolio-bucket /data \
  --endpoint-url http://host.docker.internal:18333

# Auf den Server kopieren
scp -r transfer root@<server-ip>:/opt/portfolio/deploy/
```

### 9.2 Auf dem Server importieren

```bash
cd /opt/portfolio/deploy
set -a; . ./.env; set +a     # Werte aus .env für die folgenden Befehle laden

# Datenbank: lokal heißt sie "portfoliodb", am Server "portfolio"
docker compose exec -T mongo mongorestore --archive --gzip --drop \
  -u "$MONGO_ROOT_USER" -p "$MONGO_ROOT_PASSWORD" --authenticationDatabase admin \
  --nsFrom 'portfoliodb.*' --nsTo "$MONGO_DB.*" \
  < transfer/portfolio.archive.gz

# Uploads ins S3 am Server (über das interne Netz)
docker run --rm --network portfolio_backend -v "$PWD/transfer/media:/data:ro" \
  -e AWS_ACCESS_KEY_ID="$S3_ACCESS_KEY_ID" -e AWS_SECRET_ACCESS_KEY="$S3_SECRET_ACCESS_KEY" \
  amazon/aws-cli s3 sync /data "s3://$S3_BUCKET" --endpoint-url http://seaweedfs:8333

docker compose restart payload
rm -rf transfer               # enthält deine Daten, nicht liegen lassen
```

---

## 10. Updates einspielen

Nach jedem `git push` auf `main`:

```bash
cd /opt/portfolio/deploy
git pull
docker compose up -d --build
docker image prune -f          # alte Images aufräumen
```

Die Seite ist während des Builds weiter erreichbar und nur beim Neustart des Containers ein paar Sekunden weg.

---

## 11. Backups

Alle Daten stecken in zwei Docker-Volumes: `portfolio_mongo-data` und `portfolio_seaweedfs-data`.

```bash
cd /opt/portfolio/deploy
mkdir -p /opt/backups
set -a; . ./.env; set +a

# Datenbank
docker compose exec -T mongo mongodump --archive --gzip \
  -u "$MONGO_ROOT_USER" -p "$MONGO_ROOT_PASSWORD" --authenticationDatabase admin \
  > /opt/backups/mongo-$(date +%F).archive.gz

# Uploads
docker run --rm -v portfolio_seaweedfs-data:/data:ro -v /opt/backups:/backup alpine \
  tar czf /backup/seaweedfs-$(date +%F).tar.gz -C /data .
```

Am besten lädst du die Backups regelmäßig auch auf einen anderen Rechner herunter (`scp root@<server-ip>:/opt/backups/* .`). Ein Backup, das nur auf demselben Server liegt, hilft nicht, wenn der Server weg ist.

---

## 12. Fehlersuche

| Problem | Ursache / Lösung |
|---|---|
| Browser zeigt „Zertifikat ungültig“ (`TRAEFIK DEFAULT CERT`) | Let's Encrypt hat noch kein Zertifikat ausgestellt. `docker compose logs traefik` zeigt den Grund. Meist zeigt der DNS-Eintrag noch nicht auf den Server, oder Port 443 ist gesperrt (Firewall beim Hoster prüfen). |
| `404 page not found` (nur Text) | Traefik findet keine passende Route: `DOMAIN` in `.env` stimmt nicht mit der aufgerufenen Adresse überein, oder `payload` läuft nicht (`docker compose ps`). |
| `Bad Gateway` | `payload` startet gerade oder ist abgestürzt: `docker compose logs payload`. |
| Build bricht ab mit `Killed` / `out of memory` | Zu wenig RAM, Swap anlegen (Schritt 3.3). |
| `required variable … is missing` | In `.env` fehlt ein Pflichtwert. |
| Kontaktformular gibt Fehler `429` | Rate-Limit: mehr als 5 Anfragen pro Minute von derselben IP. Eine Minute warten. |
| Keine Mail vom Kontaktformular | Prüfe `docker compose logs payload` auf „Could not send contact notification“, ob die Domain in Resend „Verified“ ist und ob `RESEND_FROM_EMAIL` auf dieser Domain liegt. |
| DB-Login schlägt nach Passwortänderung fehl | Die Mongo-Passwörter in `.env` gelten nur beim ersten Start. Danach musst du sie in der DB ändern (Schritt 0). |

Alles neu aufsetzen (**löscht alle Daten!**):

```bash
docker compose down -v
```
