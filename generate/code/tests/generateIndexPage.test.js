const generateIndexPage = require('../generateIndexPage'); // Replace with the actual path to your function

// Remove extra whitespace and newlines from a string
const formatString = (str) => {
  return str.replace(/\s+/g, ' ').trim();
};

describe('generateIndexPage', () => {
  it('should generate index page for Todo model', async () => {
    const singularModelName = 'todo';
    const pluralModelName = 'todos';
    const options = ['title:string', 'is_completed:boolean'];
    const output = formatString(await generateIndexPage(singularModelName, pluralModelName, options));

    const expectedOutputStart = `
    import { GetServerSideProps } from "next";
    import { Todo, todoMetadata as modelMetadata } from "@deps/db/models/todo";
    import Link from "next/link";
    import { getKnex } from "@deps/db";
    
    interface TodosPageProps {
      todos: Todo[];
    }
    
    const TodosPage = ({ todos }: TodosPageProps) => {
    `;

    // Check that the output begins with the expected string
    expect(output.startsWith(formatString(expectedOutputStart))).toBe(true);

    const expectedOutputEnd = `
    export const getServerSideProps: GetServerSideProps = async () => {
      const knex = getKnex();
      const todosFromKnex = await knex("todos");
      const todos = todosFromKnex.map((todo: Todo) => ({
        ...todo,
        created_at: todo.created_at?.toISOString(),
        updated_at: todo.updated_at?.toISOString(),
      }));
    
      return {
        props: {
          todos,
        },
      };
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
    import { GetServerSideProps } from "next";
    import { User, userMetadata as modelMetadata } from "@deps/db/models/user";
    import Link from "next/link";
    import { getKnex } from "@deps/db";
    
    interface UsersPageProps {
      users: User[];
    }
    
    const UsersPage = ({ users }: UsersPageProps) => {
    `;

    // Check that the output begins with the expected string
    expect(output.startsWith(formatString(expectedOutputStart))).toBe(true);

    const expectedOutputEnd = `
    export const getServerSideProps: GetServerSideProps = async () => {
      const knex = getKnex();
      const usersFromKnex = await knex("users");
      const users = usersFromKnex.map((user: User) => ({
        ...user,
        created_at: user.created_at?.toISOString(),
        updated_at: user.updated_at?.toISOString(),
      }));
    
      return {
        props: {
          users,
        },
      };
    };
    
    export default UsersPage;
  `;

    // Check that the output ends with the expected string
    expect(output.endsWith(formatString(expectedOutputEnd))).toBe(true);
  });
});
