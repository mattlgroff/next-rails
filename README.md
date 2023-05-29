# Next Rails CLI

A CLI for generating a Next.js app with Rails like features. Currently all options are opinionated and there is no way to customize the options. This may change in the future.

- Next.js 13.14.4 ✅
- TypeScript ✅
- ESLint ✅
- Tailwind CSS ✅
- Knex ✅
- PostgreSQL ✅
- Prettier ✅
- Husky ❌
- Lint Staged ❌

✅ = Implemented
❌ = Not Implemented (Yet)

The lofty goal of this would be to generate scaffold for Next.js pages & api routes, models (typescript interfaces), migrations, seeds, and tests.

There are some ESLint & Prettier configurations built in that are opinionated. These may be configurable in the future.

## Installation

```bash
npm install -g next-rails
```

or use `npx` to run the CLI without installing it globally, which also ensures the latest version is used:

```bash
npx next-rails
```

## Usage

```bash
next-rails [command] [options]
```

## Commands

### `new` ✅

```bash
next-rails new [options] <app-name>
```

Creates a new Next.js app using the [create-next-app](https://www.npmjs.com/package/create-next-app) package with some default options. Currently the following options are set:

```bash
create-next-app --ts --eslint --no-app --use-npm --src-dir --import-alias "@deps/*" --tailwind
```

### `generate` ❌

#### `next-rails generate model <model-name> [options]`

```bash
next-rails generate model <model-name> [options]
```

Generates a new model with the given name. The model will be created in the `models` folder and will be imported into the `db` file. The model will be created with the following default fields:

- `id` - `DataTypes.UUID` - `primaryKey: true`
- `createdAt` - `DataTypes.DATE`
- `updatedAt` - `DataTypes.DATE`

#### `next-rails generate scaffold <model-name> [options]` ❌

```bash
next-rails generate scaffold <controller-name> [options]
```

Generates a new model with the given name. The model will be created in the `models` folder and will be imported into the `db` file. The model will be created with the following default fields:

- `id` - `DataTypes.UUID` - `primaryKey: true`
- `createdAt` - `DataTypes.DATE`
- `updatedAt` - `DataTypes.DATE`

Generates CRUD routes for the model in the `pages/api` folder.
GET `/api/<model-name>` - Returns all items.
GET `/api/<model-name>/:id` - Returns a single item.
POST `/api/<model-name>` - Creates a new item.
PUT `/api/<model-name>/:id` - Updates a item.
DELETE `/api/<model-name>/:id` - Deletes a item.

Generates CRUD pages for the model in the `pages/<model-name>` folder.

- `pages/<model-name>/index.tsx` - Displays a list of items.
- `pages/<model-name>/[id].tsx` - Displays a single item.
- `pages/<model-name>/new.tsx` - Displays a form to create a new item.
- `pages/<model-name>/[id]/edit.tsx` - Displays a form to update a item.

### `migration:generate` ✅

#### `next-rails migration generate --name <migration-name>`

```bash
next-rails migration:generate --name <migration-name>
```

Generates a new migration with the given name. The migration will be created in the `src/db/migrations` folder.

### `db:migrate` ✅

```bash
next-rails db:migrate
```

Runs all pending migrations.

### `db:migrate:up` ✅

```bash
next-rails db:migrate:up
```

Runs the next pending migration.

### `db:migrate:down` ✅

```bash
next-rails db:migrate:down
```

Rolls back the last migration.

### `seed:generate` ✅

#### `next-rails seed:generate --name <seed-name>`

```bash
next-rails seed:generate --name <seed-name>
```

Generates a new seed with the given name. The seed will be created in the `src/db/seeds` folder.

### `db:seed` ✅

```bash
next-rails db:seed
```

Runs all seeds.
