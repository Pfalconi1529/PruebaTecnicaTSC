import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
  // 1. Ignorar directorios de build y dependencias
  {
    ignores: ["node_modules/", "dist/", "coverage/"],
  },
  
  // 2. Configuración Recomendada de TypeScript.
  // tseslint.config() ya devuelve un array iterable, por eso lo usamos directamente.
  ...tseslint.configs.recommended,
  
  // 3. Configuración Específica del Proyecto
  {
    files: ["**/*.ts"],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        project: './tsconfig.json', // Es importante para la revisión de tipos
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      // Reglas personalizadas (puedes añadir aquí las tuyas)
      "semi": ["error", "always"],
      "quotes": ["error", "single"],
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
    }
  }
);