module.exports = {
  types: [
    { name: 'feat \t New feature', value: 'feat' },
    { name: 'fix \t Bug fix', value: 'fix' },
    {
      name: 'test \t Add, update, or pass tests',
      value: 'test',
    },
    { name: 'refactor \t Refactor code', value: 'refactor' },
    { name: 'wrench \t Add or update configuration', value: 'config' },
    {
      name: 'style \t Add or update the UI and style files',
      value: 'style',
    },
    { name: 'docs \t Change Documentation', value: 'docs' },
    { name: 'perf \t Improves performance', value: 'perf' },
    {
      name: 'security \t Fix or prevent security issue',
      value: 'security',
    },
    { name: 'upgrade \t Upgrade dependency', value: 'upgrade' },
    { name: 'plus \t New dependency', value: 'plus' },
    { name: 'minus \t Remove dependency', value: 'minus' },
  ],
  skipQuestions: ['body', 'footer'],
  scopes: ['api', 'ui'],
  allowCustomScopes: true,
  subjectLimit: 100,
};
