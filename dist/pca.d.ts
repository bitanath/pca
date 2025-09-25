type Matrix = number[][];
type Vector = number[];
type Number = number;
type EigenObject = {
    eigenvalue: Number;
    eigenvector: Vector;
};

/**
 * The first step is to subtract the mean and center data
 *
 * @param {Matrix} matrix - data in an mXn matrix format
 * @returns
 */
declare function computeDeviationMatrix(matrix: Matrix): Matrix;
/**
 * Computes variance from deviation
 *
 * @param {Matrix} deviation - data minus mean as calculated from computeDeviationMatrix
 * @returns
 */
declare function computeDeviationScores(deviation: Matrix): Matrix;
/**
 * Calculates the var covar square matrix using either population or sample
 *
 * @param {Matrix} devSumOfSquares
 * @param {boolean} sample - true/false whether data is from sample or not
 * @returns
 */
declare function computeVarianceCovariance(devSumOfSquares: Matrix, sample: boolean): Matrix;
/**
 * Matrix is the deviation sum of squares as computed earlier
 *
 * @param {Matrix} matrix - output of computeDeviationScores
 * @returns
 */
declare function computeSVD(matrix: Matrix): EigenObject[];
/**
 * Get reduced dataset after removing some dimensions
 *
 * @param {Matrix} data - initial matrix started out with
 * @param {EigenObject[]} vectorObjs - eigenvectors selected as part of process
 * @returns
 */
declare function computeAdjustedData(data: Matrix, ...vectorObjs: EigenObject[]): {
    adjustedData: Matrix;
    formattedAdjustedData: Matrix;
    avgData: Matrix;
    selectedVectors: Vector[];
};
/**
 * Get original data set from reduced data set (decompress)
 * @param {Matrix} adjustedData = formatted or unformatted adjusted data
 * @param {Matrix} vectors = selectedVectors
 * @param {Matrix} avgData = avgData
 */
declare function computeOriginalData(adjustedData: Matrix, vectors: Matrix, avgData: Matrix): {
    originalData: Matrix;
    formattedOriginalData: Matrix;
};
/**
 * Get percentage explained, or loss
 * @param {EigenObject[]} vectors
 * @param {EigenObject[]} selected
 */
declare function computePercentageExplained(vectors: EigenObject[], ...selected: EigenObject[]): number;
/**
 *
 * @param {Matrix} data
 * @returns {EigenObject[]} eigen values and vectors in the matrix
 */
declare function getEigenVectors(data: Matrix): EigenObject[];
declare function analyseTopResult(data: Matrix): {
    adjustedData: Matrix;
    formattedAdjustedData: Matrix;
    avgData: Matrix;
    selectedVectors: Vector[];
};

declare const PCACore_analyseTopResult: typeof analyseTopResult;
declare const PCACore_computeAdjustedData: typeof computeAdjustedData;
declare const PCACore_computeDeviationMatrix: typeof computeDeviationMatrix;
declare const PCACore_computeDeviationScores: typeof computeDeviationScores;
declare const PCACore_computeOriginalData: typeof computeOriginalData;
declare const PCACore_computePercentageExplained: typeof computePercentageExplained;
declare const PCACore_computeSVD: typeof computeSVD;
declare const PCACore_computeVarianceCovariance: typeof computeVarianceCovariance;
declare const PCACore_getEigenVectors: typeof getEigenVectors;
declare namespace PCACore {
  export {
    PCACore_analyseTopResult as analyseTopResult,
    PCACore_computeAdjustedData as computeAdjustedData,
    PCACore_computeDeviationMatrix as computeDeviationMatrix,
    PCACore_computeDeviationScores as computeDeviationScores,
    PCACore_computeOriginalData as computeOriginalData,
    PCACore_computePercentageExplained as computePercentageExplained,
    PCACore_computeSVD as computeSVD,
    PCACore_computeVarianceCovariance as computeVarianceCovariance,
    PCACore_getEigenVectors as getEigenVectors,
  };
}

export { PCACore as default };
