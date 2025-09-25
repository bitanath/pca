import * as PCACore from './src/core';

// For browser global
if (typeof window !== 'undefined') {
  (window as any).PCA = PCACore;
}

// Default export for require('pca-js')
export default PCACore;
