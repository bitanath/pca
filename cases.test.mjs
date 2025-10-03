import PCA from './dist/pca.mjs';

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (error) {
    console.log(`✗ ${name}: ${error.message}`);
  }
}

function expect(actual) {
  return {
    toBeCloseTo: (expected, precision = 5) => {
      const diff = Math.abs(actual - expected);
      const threshold = Math.pow(5, -precision);
      if (diff > threshold) {
        throw new Error(`Expected ${actual} to be close to ${expected}`);
      }
    }
  };
}

const testData = [
  [40, 50, 60],
  [50, 70, 60], 
  [80, 70, 90],
  [50, 60, 80]
];

test('ESM computePercentageExplained should match expected values for first', () => {
  const vectors = PCA.getEigenVectors(testData);
  const first = PCA.computePercentageExplained(vectors, vectors[0]);
  expect(first).toBeCloseTo(0.8434042149581044);
});

test('ESM computePercentageExplained should match expected values for top two', () => {
  const vectors = PCA.getEigenVectors(testData);
  const topTwo = PCA.computePercentageExplained(vectors, vectors[0], vectors[1]);
  expect(topTwo).toBeCloseTo(0.9700602484397556);
});

test('ESM getEigenVectors should return expected eigenvalues and vectors', () => {
  const vectors = PCA.getEigenVectors(testData);
  
  expect(vectors[0].eigenvalue).toBeCloseTo(520.0992658908312);
  expect(vectors[1].eigenvalue).toBeCloseTo(78.10455398035167);
  expect(vectors[2].eigenvalue).toBeCloseTo(18.462846795484058);
  
  expect(vectors[0].eigenvector[0]).toBeCloseTo(0.744899700771276);
  expect(vectors[0].eigenvector[1]).toBeCloseTo(0.2849796479974595);
  expect(vectors[0].eigenvector[2]).toBeCloseTo(0.6032503924724023);
});

test('ESM computeAdjustedData should return expected structure', () => {
  const vectors = PCA.getEigenVectors(testData);
  const adData = PCA.computeAdjustedData(testData, vectors[0]);
  
  expect(adData.adjustedData[0][0]).toBeCloseTo(-22.27637101744241);
  expect(adData.adjustedData[0][1]).toBeCloseTo(-9.127781049780463);
  expect(adData.adjustedData[0][2]).toBeCloseTo(31.316721747529886);
  expect(adData.adjustedData[0][3]).toBeCloseTo(0.08743031969298887);
  
  expect(adData.formattedAdjustedData[0][0]).toBeCloseTo(-22.28, 2);
  expect(adData.selectedVectors[0][0]).toBeCloseTo(0.744899700771276);
});

