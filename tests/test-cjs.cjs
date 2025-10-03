const PCA = require('../dist/pca.cjs');
console.log('CJS:', typeof PCA.computeDeviationMatrix);
console.log('Available methods:', Object.keys(PCA));