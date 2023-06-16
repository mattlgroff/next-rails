const generateIndexPage = require('../generateIndexPage'); // Replace with the actual path to your function
const pluralize = require('pluralize');

// Remove extra whitespace and newlines from a string
const formatString = (str) => {
  return str.replace(/\s+/g, ' ').trim();
};

// TODO: Update this test.
describe.skip('generateIndexPage', () => {
  it('should generate index page for Todo model', async () => {
    const singularModelName = 'todo';
    const pluralModelName = pluralize(singularModelName);
    const options = ['title:string', 'is_completed:boolean'];
    const dbType = 'pg';
    const primaryKeyType = 'uuid';
    const output = formatString(
      await generateIndexPage(singularModelName, pluralModelName, options, dbType, primaryKeyType)
    );

    const expectedOutputStart = `
    import fs from 'fs';
    import path from 'path';
    import { GetServerSideProps } from "next";
    import { Todo, todoMetadata as modelMetadata } from "@/db/models/todo";
    import Link from "next/link";
    import { getKnex } from "@/db";
    
    interface TodosPageProps {
      todos: Todo[];
      tables: Record<string, string>;
    }
    
    const TodosPage = ({ todos, tables }: TodosPageProps) => {
    `;

    // Check that the output begins with the expected string
    expect(output.startsWith(formatString(expectedOutputStart))).toBe(true);

    const expectedOutputEnd = `
    export const getServerSideProps: GetServerSideProps = async () => {
      try {
        const knex = getKnex();
        const todosFromKnex = await knex("todos");
        const todos = todosFromKnex.map((todo: Todo) => ({
          ...todo,
          created_at: todo.created_at?.toISOString(),
          updated_at: todo.updated_at?.toISOString(),
        }));

        const filePath = path.join(process.cwd(), 'src/db/schema.json');
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const tables = JSON.parse(fileContent);    
      
        return {
          props: {
            todos,
            tables,
          },
        };
      } catch (error) {
        console.error(error);
        return {
          props: {
            todos: [],
            tables: {},
          },
        };
      }
    };
    
    export default TodosPage;
    `;

    // Check that the output ends with the expected string
    expect(output.endsWith(formatString(expectedOutputEnd))).toBe(true);
  });

  it('should generate index page for User model', async () => {
    const singularModelName = 'user';
    const pluralModelName = pluralize(singularModelName);
    const options = ['name:string', 'email:string', 'is_active:boolean'];
    const dbType = 'pg';
    const primaryKeyType = 'uuid';
    const output = formatString(
      await generateIndexPage(singularModelName, pluralModelName, options, dbType, primaryKeyType)
    );

    const expectedOutputStart = `
    import fs from 'fs';
    import path from 'path';
    import { GetServerSideProps } from "next";
    import { User, userMetadata as modelMetadata } from "@/db/models/user";
    import Link from "next/link";
    import { getKnex } from "@/db";
    
    interface UsersPageProps {
      users: User[];
      tables: Record<string, string>;
    }
    
    const UsersPage = ({ users, tables }: UsersPageProps) => {
    `;

    // Check that the output begins with the expected string
    expect(output.startsWith(formatString(expectedOutputStart))).toBe(true);

    const expectedOutputEnd = `
    export const getServerSideProps: GetServerSideProps = async () => {
      try {
        const knex = getKnex();
        const usersFromKnex = await knex("users");
        const users = usersFromKnex.map((user: User) => ({
          ...user,
          created_at: user.created_at?.toISOString(),
          updated_at: user.updated_at?.toISOString(),
        }));

        const filePath = path.join(process.cwd(), 'src/db/schema.json');
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const tables = JSON.parse(fileContent);    
      
        return {
          props: {
            users,
            tables,
          },
        };
      } catch (error) {
        console.error(error);
        return {
          props: {
            users: [],
            tables: {},
          },
        };
      }
    };
    
    export default UsersPage;
  `;

    // Check that the output ends with the expected string
    expect(output.endsWith(formatString(expectedOutputEnd))).toBe(true);
  });

  it('should generate index page for ResourceAllocation model', async () => {
    const singularModelName = 'resource_allocation';
    const pluralModelName = pluralize(singularModelName);
    const options = ['resource_id:uuid', 'allocation_id:uuid', 'amount:number'];
    const dbType = 'pg';
    const primaryKeyType = 'uuid';
    const output = formatString(
      await generateIndexPage(singularModelName, pluralModelName, options, dbType, primaryKeyType)
    );

    const expectedOutputStart = `
    import fs from 'fs';
    import path from 'path';
    import { GetServerSideProps } from "next";
    import { ResourceAllocation, resourceAllocationMetadata as modelMetadata } from "@/db/models/resourceAllocation";
    import Link from "next/link";
    import { getKnex } from "@/db";
    
    interface ResourceAllocationsPageProps {
      resourceAllocations: ResourceAllocation[];
      tables: Record<string, string>;
    }
    
    const ResourceAllocationsPage = ({ resourceAllocations, tables }: ResourceAllocationsPageProps) => {
    `;

    // Check that the output begins with the expected string
    expect(output.startsWith(formatString(expectedOutputStart))).toBe(true);

    const expectedOutputEnd = `
    export const getServerSideProps: GetServerSideProps = async () => {
      try {
        const knex = getKnex();
        const resourceAllocationsFromKnex = await knex("resource_allocations");
        const resourceAllocations = resourceAllocationsFromKnex.map((resourceAllocation: ResourceAllocation) => ({
          ...resourceAllocation,
          created_at: resourceAllocation.created_at?.toISOString(),
          updated_at: resourceAllocation.updated_at?.toISOString(),
        }));
    
        const filePath = path.join(process.cwd(), 'src/db/schema.json');
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const tables = JSON.parse(fileContent);
    
        return {
          props: {
            resourceAllocations,
            tables,
          },
        };
      } catch (error) {
        console.error(error);
        return {
          props: {
            resourceAllocations: [],
            tables: {},
          },
        };
      }
    };
    
    export default ResourceAllocationsPage;
    `;

    // Check that the output ends with the expected string
    expect(output.endsWith(formatString(expectedOutputEnd))).toBe(true);
  });
});
