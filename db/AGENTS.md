# AGENTS Guidelines

These rules define how coding agents should work in this repository.

## Goal

Maintain a predictable MongoDB + Mongo Express stack that can be consumed by Payload CMS.

## Required Platform Versions

- Docker Engine >= 29 (BuildKit-capable baseline)
- MongoDB image major: Latest patch of major nehmen (mit updateverhalten: floats) (currently docker version: mongo:7)
- Mongo Express image: mongo-express:latest

## Database and GUI Policy

- Database must be MongoDB (never Postgres in this repo)
- Preferred MongoDB image tag: mongo:<latest-stable-major> für dev / für prod exact version (currently mongo:7.0.8)
- Preferred DB GUI image tag: mongo-express:latest

Current compose pin in this repository: mongo:8 and mongo-express:latest.

## Compose Policy

Use docker-compose.yml as the active stack file for MongoDB + Mongo Express unless the user explicitly requests a separate dev/prod split.

## Security and Auth Policy

- Keep secrets out of git
- Use environment variables for credentials and secrets

## Tooling Policy

- Biome is the global linting and formatting standard
- New formatting/lint setup should default to Biome
- Avoid introducing parallel formatter/linter stacks unless explicitly required

## Agent Behavior

When making changes:

1. Prefer explicit version constraints matching this document
2. Do not switch database engine away from MongoDB
3. Keep mongo-express as the default GUI instead of pgAdmin
4. Keep the stack consumable by an external Payload app

If a requested change conflicts with these rules, the agent should call out the conflict and propose a compliant alternative.
