import eienjs from '@eienjs/eslint-config';

export default eienjs({
  markdown: true,
  typescript: {
    tsconfigPath: 'tsconfig.json',
    erasableSyntaxOnly: {
      parameterProperties: false,
    },
  },
});
