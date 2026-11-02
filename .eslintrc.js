// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ['expo', 'plugin:react-native-a11y/ios'],
  ignorePatterns: ['/dist/*'],
  rules: {
    // React Compiler rules that came with SDK 58, the existing code
    // breaks them in a few places, to be fixed separately
    'react-hooks/set-state-in-effect': 'warn',
    'react-hooks/purity': 'warn',
    'react-hooks/static-components': 'warn',
  },
};
