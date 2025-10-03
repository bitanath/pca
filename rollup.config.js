import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

export default [
  {
    input: 'index.ts',
    output: [
      { file: 'dist/pca.js', format: 'umd', name: 'PCA' },
      { file: 'dist/pca.cjs', format: 'cjs', name: 'PCA' },
      { file: 'dist/pca.mjs', format: 'es' }
    ],
    plugins: [typescript()]
  },
  {
    input: 'index.ts',
    output: { file: 'dist/pca.d.ts', format: 'es' },
    plugins: [dts()]
  }
];