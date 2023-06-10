const generateIndexPage = require('../generateIndexPage'); // Replace with the actual path to your function

// Remove extra whitespace and newlines from a string
const formatString = (str) => {
  return str.replace(/\s+/g, ' ').trim();
};

// TODO: Update this test.
describe('generateIndexPage', () => {
  it('should generate index page for Todo model', async () => {
    const singularModelName = 'todo';
    const pluralModelName = 'todos';
    const options = ['title:string', 'is_completed:boolean'];
    const output = formatString(await generateIndexPage(singularModelName, pluralModelName, options));

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
    const pluralModelName = 'users';
    const options = ['name:string', 'email:string', 'is_active:boolean'];
    const output = formatString(await generateIndexPage(singularModelName, pluralModelName, options));

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
});
