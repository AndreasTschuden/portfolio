# SeaweedFS Docker Compose Setup

## Requirements

### Dockerversion: ^29.2

This setup requires Docker version 29.2 or higher. No specific version is pinned in the `docker-compose.yml` file.

## Services

- **Master**: Metadata server on port 9333
- **Volume**: Data storage on port 8080
- **Filer**: File metadata on port 8888
- **S3**: S3-compatible API on port 8333
- **WebDAV**: WebDAV access on port 7333
- **Admin**: Admin UI on port 23646

## Configuration

All configuration is managed via `.env` file. Update port numbers and image versions there as needed.

## Quick Start

```bash
docker-compose up -d
```

## Access Points

- Master UI: http://localhost:9333
- Filer UI: http://localhost:8888
- S3 Endpoint: http://localhost:8333
- WebDAV: http://localhost:7333
- Admin UI: http://localhost:23646
