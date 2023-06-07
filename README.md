# Next Rails CLI

<a href="https://www.npmjs.com/package/next-rails" target="\_parent">
  <img alt="" src="https://img.shields.io/npm/dm/next-rails.svg" />
</a>

A CLI for generating a Next.js app with Rails CLI-like features. 

- Next.js 13.14.4 ✅
- TypeScript ✅
- ESLint ✅
- Tailwind CSS ✅
- Knex ✅
- PostgreSQL w/ PgVector ✅
- Prettier ✅
- Dockerfile for Development ✅
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

### `generate` ✅

#### `next-rails generate model <model-name> [options]` ✅

```bash
next-rails generate model <model-name> [options]
```

Generates a new TypeScript interface representing a model with the given name and options. Note that for the model name, the singular form should be provided (ex: "Post" or "Todo"). This model interface will be created in the src/db/models directory. Each option should be a string in the format 'name:type'. The following types are currently supported:

- string
- integer
- boolean
- date
- text
- vector

The model interface will be created with the following default fields in addition to the fields specified by the options:

- id - string - Represents a UUID.
- createdAt - Date - Represents the timestamp when the record was created.
- updatedAt - Date - Represents the timestamp when the record was last updated.

#### `next-rails generate scaffold <model-name> [options]` ✅

```bash
next-rails generate scaffold <controller-name> [options]
```

Executes the same operations as the model command described above, and additionally generates the following:

1) An API controller for the model in the pages/api directory. This controller handles CRUD operations (Create, Read, Update, Delete) for the model. The routes are as follows: 
* GET /api/plural-model-name/index - Returns all records.
* GET /api/plural-model-name/show/:id - Returns a single record.
* POST /api/plural-model-name/create - Creates a new record.
* PUT /api/plural-model-name/update/:id - Updates a record.
* DELETE /api/plural-model-name/destroy/:id - Deletes a record.

2) A Knex.js migration script in the src/db/migrations directory. This script includes functions to create and drop a database table representing the model. The table will include columns for each field in the model interface, as well as columns for createdAt and updatedAt.
Note that for the model name, the singular form should be provided (ex: "Post" or "Todo"), and the scaffold generator will use a plural form where appropriate. For example, if you generate a scaffold for 'post', the model will be named 'Post', the API controller will be at pages/api/posts.ts, and the migration script will create a table named 'posts'. 

3) Pages for the model in the pages directory. The following pages will be created: 
* /plural-model-name/index.tsx - A page that lists all records. (Index) ✅
* /plural-model-name/:id/index.tsx - A page that displays a single record. (Show) (Delete) ✅
* /plural-model-name/new.tsx - A page that allows you to create a new record. (Create) ❌
* /plural-model-name/:id/edit - A page that allows you to edit a record. (Update) ❌

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
