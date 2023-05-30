function generateIndexPage(singularModelName, pluralModelName, options) {
  const modelName = singularModelName.charAt(0).toUpperCase() + singularModelName.slice(1);
  const PascalPluralModelName = pluralModelName.charAt(0).toUpperCase() + pluralModelName.slice(1);

  // Helper function to convert snake_case to Title Case
  function toTitleCase(str) {
    return str.replace('_', ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }

  // Construct the model metadata
  const modelMetadata = {
    id: { label: 'ID', display: (value) => value },
    created_at: { label: 'Created At', display: (value) => value?.toLocaleString() || '' },
    updated_at: { label: 'Updated At', display: (value) => value?.toLocaleString() || '' },
  };

  // Add each option as a field in the metadata
  options.forEach((option) => {
    const [name, type] = option.split(':');
    const label = toTitleCase(name);
    let displayFunction;

    switch (type) {
      case 'boolean':
        displayFunction = (value) => (value ? 'Yes' : 'No');
        break;
      case 'date':
        displayFunction = (value) => (value ? value.toISOString() : '');
        break;
      default:
        displayFunction = (value) => value;
        break;
    }

    modelMetadata[name] = { label: label, display: displayFunction };
  });

  const fields = Object.keys(modelMetadata);

  // Constructing the JSX for each row of data
  const tdJsx = fields
    .map(
      (field) => `
<td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
  {${singularModelName}.${field} !== null && typeof ${singularModelName}.${field} !== 'undefined' ? modelMetadata['${field}'].display(${singularModelName}.${field}) : ""}
</td>
`
    )
    .join('');

  const mapJsx = `
const fieldData = ${pluralModelName}.map(${singularModelName} => (
  <tr key={${singularModelName}.id}>
    ${tdJsx}
    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
      <Link href="/${pluralModelName}/{${singularModelName}.id}">
        Show
      </Link>
    </td>
  </tr>
));
`;

  const viewCode = `
    import { GetServerSideProps } from "next";
    import { ${modelName}, ${singularModelName}Metadata as modelMetadata } from "@deps/db/models/${singularModelName}";
    import Link from "next/link";
    import { getKnex } from "@deps/db";
    
    interface ${PascalPluralModelName}PageProps {
      ${pluralModelName}: ${modelName}[];
    }
    
    const ${PascalPluralModelName}Page = ({ ${pluralModelName} }: ${PascalPluralModelName}PageProps) => {
      ${mapJsx}
      return (
        <div className="mt-3 flow-root">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    ${fields
                      .map(
                        (field) => `
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      ${modelMetadata[field].label}
                    </th>
                    `
                      )
                      .join('')}
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {fieldData}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    };
    
    export const getServerSideProps: GetServerSideProps = async () => {
      const knex = getKnex();
      const ${singularModelName}sFromKnex = await knex("${singularModelName}s");
      const ${singularModelName}s = ${singularModelName}sFromKnex.map((${singularModelName}: ${modelName}) => ({
        ...${singularModelName},
        created_at: ${singularModelName}.created_at?.toISOString(),
        updated_at: ${singularModelName}.updated_at?.toISOString(),
      }));
    
      return {
        props: {
          ${singularModelName}s,
        },
      };
    };
    
    export default ${PascalPluralModelName}Page;
  `;

  return viewCode;
}

module.exports = generateIndexPage;
