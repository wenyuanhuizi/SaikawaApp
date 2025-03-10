module.exports = {
  arrowParens: 'avoid',
  bracketSameLine: true,
  bracketSpacing: false,
  singleQuote: true,
  trailingComma: 'all',
  semi: true,
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  overrides: [
    {
      files: ['*.yml', '*.yaml', '*.json'],
      options: {
        singleQuote: false,
        quoteProps: 'preserve',
      },
    },
  ],
};
