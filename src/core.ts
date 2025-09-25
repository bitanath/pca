import { unitSquareMatrix, subtract, scale, multiply, transpose, format } from "./utils.js";
import type { Matrix, Vector, EigenObject } from "./type.js";

import { svd } from "./svd.js";

/**
 * The first step is to subtract the mean and center data
 *
 * @param {Matrix} matrix - data in an mXn matrix format
 * @returns
 */
export function computeDeviationMatrix(matrix:Matrix):Matrix {
  let unit = unitSquareMatrix(matrix.length);
  return subtract(matrix, scale(multiply(unit, matrix), 1 / matrix.length));
}

/**
 * Computes variance from deviation
 *
 * @param {Matrix} deviation - data minus mean as calculated from computeDeviationMatrix
 * @returns
 */
export function computeDeviationScores(deviation:Matrix):Matrix {
  let devSumOfSquares = multiply(transpose(deviation), deviation);
  return devSumOfSquares;
}

/**
 * Calculates the var covar square matrix using either population or sample
 *
 * @param {Matrix} devSumOfSquares
 * @param {boolean} sample - true/false whether data is from sample or not
 * @returns
 */
export function computeVarianceCovariance(devSumOfSquares:Matrix, sample:boolean):Matrix {
  let varianceCovariance;
  if (sample){
    varianceCovariance = scale( devSumOfSquares, 1 / (devSumOfSquares.length - 1));
  }
  else{
    varianceCovariance = scale(devSumOfSquares, 1 / devSumOfSquares.length);
  } 
  return varianceCovariance;
}

/**
 * Matrix is the deviation sum of squares as computed earlier
 *
 * @param {Matrix} matrix - output of computeDeviationScores
 * @returns
 */
export function computeSVD(matrix:Matrix):EigenObject[] {
  let result = svd(matrix);
  let eigenvectors = result.U;
  let eigenvalues = result.S;
  let results = eigenvalues.map(function (value, i) {
        let obj:EigenObject = {
            eigenvalue: value,
            eigenvector: eigenvectors.map(function (vector) {
                return -1 * vector[i]!; //HACK prevent completely negative vectors
            })
        };
        return obj;
  });
  return results;
}

/**
 * Get reduced dataset after removing some dimensions
 *
 * @param {Matrix} data - initial matrix started out with
 * @param {EigenObject[]} vectorObjs - eigenvectors selected as part of process
 * @returns
 */
export function computeAdjustedData(data:Matrix, ...vectorObjs:EigenObject[]) {
  //NOTE: no need to transpose vectors since they're already in row normal form
  let vectors = vectorObjs.map(function (v) {
    return v.eigenvector;
  });
  let matrixMinusMean = computeDeviationMatrix(data);
  let adjustedData = multiply(vectors, transpose(matrixMinusMean));
  let unit = unitSquareMatrix(data.length);
  let avgData = scale(multiply(unit, data), -1 / data.length); //NOTE get the averages to add back

  let formattedAdjustData = format(adjustedData, 2);
  return {
    adjustedData: adjustedData,
    formattedAdjustedData: formattedAdjustData,
    avgData: avgData,
    selectedVectors: vectors,
  };
}

/**
 * Get original data set from reduced data set (decompress)
 * @param {Matrix} adjustedData = formatted or unformatted adjusted data
 * @param {Matrix} vectors = selectedVectors
 * @param {Matrix} avgData = avgData
 */
export function computeOriginalData(adjustedData:Matrix, vectors:Matrix, avgData:Matrix) {
  let originalWithoutMean = transpose(
    multiply(transpose(vectors), adjustedData)
  );
  let originalWithMean = subtract(originalWithoutMean, avgData);
  let formattedData = format(originalWithMean, 2);
  return {
    originalData: originalWithMean,
    formattedOriginalData: formattedData,
  };
}

/**
 * Get percentage explained, or loss
 * @param {EigenObject[]} vectors
 * @param {EigenObject[]} selected
 */
export function computePercentageExplained(vectors:EigenObject[], ...selected:EigenObject[]) {
  let total = vectors.map(v=>v.eigenvalue).reduce((a, b)=>a+b);
  let explained = selected.map(v=>v.eigenvalue).reduce((a, b)=>a+b);
  return explained / total;
}

/**
 * 
 * @param {Matrix} data 
 * @returns {EigenObject[]} eigen values and vectors in the matrix
 */
export function getEigenVectors(data:Matrix):EigenObject[] {
  return computeSVD(
    computeVarianceCovariance(computeDeviationScores(computeDeviationMatrix(data)), false)
  );
}

export function analyseTopResult(data:Matrix) {
  let eigenVectors = getEigenVectors(data);
  let sorted = eigenVectors.sort(function (a, b) {
    return b.eigenvalue - a.eigenvalue;
  });
  let selected = sorted[0]!;
  return computeAdjustedData(data, selected);
}
