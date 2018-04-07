var PCA = (function () {

    /**
     * The first step is to subtract the mean and center data
     * 
     * @param {Array} matrix - data in an mXn matrix format
     * @returns 
     */
    function computeDeviationMatrix(matrix) {
        var unit = unitSquareMatrix(matrix.length);
        return subtract(matrix, scale(multiply(unit, matrix), 1 / matrix.length));
    }
    /**
     * Computes variance from deviation
     * 
     * @param {Array} deviation - data minus mean as calculated from computeDeviationMatrix
     * @returns 
     */
    function computeDeviationScores(deviation) {
        var devSumOfSquares = multiply(transpose(deviation), deviation);
        return devSumOfSquares;
    }
    /**
     * Calculates the var covar square matrix using either population or sample
     * 
     * @param {Array} devSumOfSquares 
     * @param {boolean} sample - true/false whether data is from sample or not
     * @returns 
     */
    function computeVarianceCovariance(devSumOfSquares, sample) {
        var varianceCovariance;
        if (sample)
            varianceCovariance = scale(devSumOfSquares, 1 / (devSumOfSquares.length - 1));
        else
            varianceCovariance = scale(devSumOfSquares, 1 / (devSumOfSquares.length));
        return varianceCovariance;
    }
    /**
     * Matrix is the deviation sum of squares as computed earlier
     * 
     * @param {Array} matrix - output of computeDeviationScores
     * @returns 
     */
    function computeSVD(matrix) {
        var result = svd(matrix);
        console.log(result)
        var eigenvectors = result.U;
        var eigenvalues = result.S;
        var results = eigenvalues.map(function (value, i) {
            var obj = {};
            obj.eigenvalue = value;
            obj.vector = eigenvectors.map(function (vector, j) {
                return -1*vector[i]; //HACK prevent completely negative vectors
            });
            return obj;
        });
        return results;
    }
    /**
     * Get reduced dataset after removing some eigenvectors
     * 
     * @param {Array} data - deviation data (as output of computeDeviationMatrix)
     * @param {rest} vectors - eigenvectors selected as part of process
     * @returns 
     */
    function computeAdjustedData(data, ...vectors) {        
        var devMatrix = computeDeviationMatrix(data);
        var transposedVectors = transpose(vectors);
        var finalWithoutMean = multiply(vectors, devMatrix);
        var unit = unitSquareMatrix(data.length);
        var avgData = scale(multiply(unit, data),-1/data.length);
        var reducedData = avgData.filter(function(d,i){
            return i<finalWithoutMean.length
        });
        console.log('avg data and reduced data',avgData,reducedData);
        console.log('final without mean',finalWithoutMean);
        var finalWithMean = subtract(finalWithoutMean, reducedData);
        return {
            finalWithoutMean: finalWithoutMean,
            finalWithMean: finalWithMean
        };
    }

    function getEigenVectors(data) {
     return computeSVD(computeVarianceCovariance(computeDeviationScores(computeDeviationMatrix(data)),false));
    }

    function analyseTopResult(data){
        var eigenVectors = getEigenVectors(data);
        var sorted = eigenVectors.sort(function(a,b){
            return b.eigenvalue - a.eigenvalue;
        });
        console.log('Sorted Vectors',sorted);
        var selected = sorted[0].vector;
        return computeAdjustedData(data,selected);
    }
    /**
     * Multiplies AxB, where A and B are matrices of nXm and mXn dimensions
     * @param {} a 
     * @param {*} b 
     */
    function multiply(a, b) {
        if (!a[0] || !b[0] || !a.length || !b.length) {
            throw new Error('Both A and B should be matrices');
        }

        if (b.length !== a[0].length) {
            throw new Error('Columns in A should be the same as the number of rows in B');
        }
        var product = [];

        for (var i = 0; i < a.length; i++) {
            product[i] = []; //initialize a new row
            for (var j = 0; j < b[0].length; j++) {
                for (var k = 0; k < a[0].length; k++) {
                    (product[i])[j] = !!(product[i])[j] ? (product[i])[j] + (a[i])[k] * (b[k])[j] : (a[i])[k] * (b[k])[j];
                }
            }
        }
        return product;
    }
    /**
     * Utility function to subtract matrix b from a
     * 
     * @param {any} a 
     * @param {any} b 
     * @returns 
     */
    function subtract(a, b) {
        if (!(a.length === b.length && a[0].length === b[0].length))
            throw new Error('Both A and B should have the same dimensions');
        var result = [];
        for (var i = 0; i < a.length; i++) {
            result[i] = [];
            for (var j = 0; j < b[0].length; j++) {
                (result[i])[j] = (a[i])[j] - (b[i])[j];
            }
        }
        return result;
    }
    /**
     * Multiplies a matrix into a factor
     * 
     * @param {any} matrix 
     * @param {any} factor 
     * @returns 
     */
    function scale(matrix, factor) {
        var result = [];
        for (var i = 0; i < matrix.length; i++) {
            result[i] = [];
            for (var j = 0; j < matrix[0].length; j++) {
                (result[i])[j] = (matrix[i])[j] * factor;
            }
        }
        return result;
    }

    function unitSquareMatrix(rows) {
        var result = [];
        for (var i = 0; i < rows; i++) {
            result[i] = [];
            for (var j = 0; j < rows; j++) {
                (result[i])[j] = 1;
            }
        }
        return result;
    }

    function transpose(matrix) {
        var operated = clone(matrix);
        return operated[0].map(function (_, c) {
            return matrix.map(function (r) {
                return r[c];
            });
        });
    }

    function clone(arr) {
        var string = JSON.stringify(arr);
        var result = JSON.parse(string);
        return result;
    }

    return {
        computeDeviationScores: computeDeviationScores,
        computeDeviationMatrix: computeDeviationMatrix,
        computeSVD: computeSVD,
        computeVarianceCovariance: computeVarianceCovariance,
        computeAdjustedData: computeAdjustedData,
        getEigenVectors:getEigenVectors,
        analyseTopResult:analyseTopResult,
        transpose:transpose,
        multiply:multiply,
        clone:clone,
        scale:scale
    }
})();