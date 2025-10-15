// openapi-config.cjs

// Generación automática basada en "tags"
module.exports = {
  schemaFile: 'http://localhost:5286/openapi/v1.json',
  apiFile: './src/services/baseApi.ts',
  apiImport: 'emptySplitApi',
  outputFile: './src/services/generated/api.ts', // Un solo archivo para todos los endpoints
  hooks: { queries: true, lazyQueries: true, mutations: true },
  tag: true, // 👈 ✅ ¡ESTE ES EL CAMBIO CLAVE!
};