import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  {
    languageOptions: {
      globals: globals.node, // Use Node.js globals only
    },
  },
  pluginJs.configs.recommended,
];
