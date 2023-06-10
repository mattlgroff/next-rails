const generateShowPage = require('../generateShowPage');

// Remove extra whitespace and newlines from a string
const formatString = (str) => {
  return str.replace(/\s+/g, ' ').trim();
};

// TODO: Fix this test
describe.skip('generateShowPage', () => {
  it('should generate show page for Todo model', async () => {
    const singularModelName = 'todo';
    const pluralModelName = 'todos';
    const options = ['title:string', 'is_completed:boolean'];
    const output = formatString(await generateShowPage(singularModelName, pluralModelName, options));

    const expectedOutputStart = `
    import { GetServerSideProps } from "next";
    import { Todo, todoMetadata as modelMetadata } from "@/db/models/todo";
    import Link from "next/link";
    import { getKnex } from "@/db";
    import { useRouter } from 'next/router';
    
    interface ShowTodoPageProps {
      todo: Todo;
    }
    
    const ShowTodoPage = ({ todo }: ShowTodoPageProps) => {
    `;

    // Check that the output begins with the expected string
    expect(output.startsWith(formatString(expectedOutputStart))).toBe(true);

    const expectedOutputEnd = `
    export const getServerSideProps: GetServerSideProps = async (context) => {
      const knex = getKnex();
      const todo = await knex("todos").where('id', context.params?.id).first();
    
      if (!todo) {
        return {
          notFound: true,
        };
      }
    
      const serializedTodo = {
        ...todo,
        created_at: todo.created_at?.toISOString(),
        updated_at: todo.updated_at?.toISOString(),
      };
    
      return {
        props: {
          todo: serializedTodo,
        },
      };
    };
    
    export default ShowTodoPage;
    `;

    // Check that the output ends with the expected string
    expect(output.endsWith(formatString(expectedOutputEnd))).toBe(true);
  });

  it('should generate show page for User model', async () => {
    const singularModelName = 'user';
    const pluralModelName = 'users';
    const options = ['name:string', 'email:string', 'is_active:boolean'];
    const output = formatString(await generateShowPage(singularModelName, pluralModelName, options));

    const expectedOutputStart = `
    import { GetServerSideProps } from "next";
    import { User, userMetadata as modelMetadata } from "@/db/models/user";
    import Link from "next/link";
    import { getKnex } from "@/db";
    import { useRouter } from 'next/router';
    
    interface ShowUserPageProps {
      user: User;
    }
    
    const ShowUserPage = ({ user }: ShowUserPageProps) => {
    `;

    // Check that the output begins with the expected string
    expect(output.startsWith(formatString(expectedOutputStart))).toBe(true);

    const expectedOutputEnd = `
    export const getServerSideProps: GetServerSideProps = async (context) => {
      const knex = getKnex();
      const user = await knex("users").where('id', context.params?.id).first();
    
      if (!user) {
        return {
          notFound: true,
        };
      }
    
      const serializedUser = {
        ...user,
        created_at: user.created_at?.toISOString(),
        updated_at: user.updated_at?.toISOString(),
      };
    
      return {
        props: {
          user: serializedUser,
        },
      };
    };
    
    export default ShowUserPage;
    `;

    // Check that the output ends with the expected string
    expect(output.endsWith(formatString(expectedOutputEnd))).toBe(true);
  });
});
