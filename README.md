# NestJS API Template

## Description

This is a template for a NestJS API. It is based on the [Nest](https://github.com/nestjs/nest)

## Requirements

- Node 16.0.0 or later
- Yarn 1.22.10 or later
- MySQL 8.0.25 or later

Optional:

- Docker 25.0.0 or later

## Installation

```bash
$ yarn install
```

## Configuration

Create a `.env` file in the root of the project with the content of the [`.env.example`](.env.example) file.

```bash
cp .env.example .env
```

Edit the `.env` file with the appropriate values.

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Docker for production

```bash
# Build the image
$ docker build -t nest-api-template .

# Run the container
$ docker compose up
```

## Migrations

```bash
# Create a new migration

# Yarn
$ npm_config_migration_name=[nombre_de_la_migracion] yarn run migration:create

# NPM (recommended)
$ npm run migration:create --migration_name=[nombre_de_la_migracion]

# Run the migrations
$ yarn run migration:run

# Revert the migrations
$ yarn run migration:revert
```

## Info

- Author - [fermelli](https://github.com/fermelli)

## Features

- [x] Authentication with JWT
  - [x] Sign up
  - [x] Sign in
  - [x] Me
- [x] Authorization with roles and permissions
  - [x] Permission guard
  - [x] Permission decorator
  - [x] Public decorator
- [x] User management
  - [x] Create user
  - [x] Get users
  - [x] Get by email
  - [x] Get user
  - [x] Delete user
  - [x] Soft delete user
  - [x] Restore user
  - [x] Assign roles
  - [x] Assign permissions
  - [x] Get all permissions (permissions from roles and direct permissions)
- [x] Role management
  - [x] Create role
  - [x] Get roles
  - [x] Get role
  - [x] Update role
  - [x] Delete role
  - [x] Assign permissions
- [x] Permission management
  - [x] Get permissions
  - [x] Get permission
