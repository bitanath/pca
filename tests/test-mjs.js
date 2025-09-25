import PCA from '../dist/pca.mjs';
console.log('ESM:', typeof PCA.computeDeviationMatrix);
console.log('Available methods:', Object.keys(PCA));