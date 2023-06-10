import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';

type IndexPageProps = {
  tables: {
    [key: string]: any;
  };
};

const IndexPage: FunctionComponent<IndexPageProps> = ({ tables }) => (
  <div className="flex flex-col min-h-screen container">
    <nav className="flex items-center space-x-4 lg:space-x-6 m-6">
      <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
          home
      </Link>
      {Object.keys(tables).map((table) => (
        <Link href={`/${table}`} key={table} className="text-sm font-medium transition-colors hover:text-primary">
            {table}
        </Link>
      ))}
    </nav>
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-4xl">Welcome to Next.js, initialized via Next-Rails</h1>

      {Object.keys(tables).length === 0 && (
        <h3 className="mb-8 text-2xl">No tables found in your database schema yet. Try scaffolding and migrating.</h3>
      )}

      <div className="grid grid-cols-2 gap-8">
        {Object.keys(tables).map((table) => (
          <Link href={`/${table}`} key={table}>
            <div className="mb-4 rounded border-2 border-blue-500 bg-white px-8 pb-8 pt-6 shadow-md">
              <h2 className="mb-4 text-2xl">{table}</h2>
              <ul className="ml-5 list-disc">
                {Object.keys(tables[table]).map((column) => (
                  <li key={column}>{column}</li>
                ))}
              </ul>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 text-lg">
        <p>
          For more information, please refer to the documentation on
          <a className="mx-2 text-blue-500 underline" href="https://nextjs.org/" target="_blank" rel="noreferrer">
            Next.js
          </a>
          and the
          <a
            className="mx-2 text-blue-500 underline"
            href="https://www.npmjs.com/package/next-rails"
            target="_blank"
            rel="noreferrer"
          >
            next-rails
          </a>
          npm package.
        </p>
      </div>

      <div className="mt-8 text-lg">
        Try scaffolding a new model:
        <pre className="mt-4 rounded bg-gray-100 p-4">
          <code>npx next-rails generate scaffold User name:string email:string</code>
        </pre>
        <pre className="mt-4 rounded bg-gray-100 p-4">
          <code>npx next-rails generate scaffold Post title:string body:text user:references</code>
        </pre>
        <div className="mt-4">
          Then, run the migrations:
          <pre className="mt-4 rounded bg-gray-100 p-4">
            <code>npx next-rails db:migrate</code>
          </pre>
          Refresh this page to see your new schema.
          <br />
          For a list of all the commands see your README.md or check out the documentation on the
          <a
            className="mx-2 text-blue-500 underline"
            href="https://www.npmjs.com/package/next-rails"
            target="_blank"
            rel="noreferrer"
          >
            next-rails
          </a>
          npm package.
        </div>
      </div>
    </div>
  </div>
);

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const filePath = path.join(process.cwd(), 'src/db/schema.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const tables = JSON.parse(fileContent);

    return { props: { tables } };
  } catch (err) {
    return { props: { tables: {} } };
  }
};

export default IndexPage;
