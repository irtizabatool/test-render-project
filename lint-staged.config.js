// eslint-disable-next-line
const micromatch = require('micromatch');

module.exports = {
  '*': allFiles => {
    const match = micromatch(allFiles, ['**/*.js', '**/*.ts']);
    if (!match.length) return [];
    return [`prettier --check ${match.join(' ')}`, `eslint ${match.join(' ')}`];
  },
};
