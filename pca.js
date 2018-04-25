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

var SVD = (function(){
    function calculate(matrix){
        var iterations= 50;
        var rows = matrix.length;
        var columns = matrix[0].length;
        if(rows<columns)
        return false;
        var array = clone(matrix);
        var unit = fill(rows,columns,0);

    }
    function distance(a,b){
        return Math.sqrt(Math.pow(a,2)+Math.pow(b,2));
    }
    function householder(array,rows,columns){
        var vector1 = [],vector2=[],hg=0.0,hf=0.0,hh=0.0,i=0,j=0,k=0,x=0,y=0;
        var square = fill([columns,columns],0);
        for(i=0;i<columns;i++){
            var sum = 0;
            vector1[i] = 0;
            for(j=i;j<rows;j++){
                sum+=(array[i][j]*array[j][i])
            }
            if(sum<=0.00000001)
            hg=0;
            else{
                 hf = array[i][i]; //get diagonal element of array
                hg = hf>=0.0?-Math.sqrt(sum):Math.sqrt(sum);
                 hh = hf*hg-sum;
                array[i][i] = hf-hg;
                for(j=i+1;j<columns;j++){
                    sum = 0.0;
                    //first sum
                    for(k=i;k<rows;k++)
                        sum += array[k][i]*array[k][j];
                    //alter hf
                    hf= sum/hh;
                    //second sum
                    for(k=i;k<rows;k++)
                    array[k][j]+=hf*array[k][i];
                }
            }
            vector2[i] = hg;
            sum = 0.0;
            for(j=i+1;j<columns;j++)
            sum = sum+Math.pow(array[i][j],2);

            if(sum<=0.00000001)
            hg = 0.0;
            else{
                hf = array[i][i+1];
                hg = hf>=0.0?-Math.sqrt(sum):Math.sqrt(sum);
                hh = hf*hg - sum;
                array[i][i+1] = hf-hg;

                for(j=i+1;j<columns;j++)
                vector1[j] = array[i][j]/hh;
                for(j=i+1;j<rows;j++){
                    sum=0.0;
                    for(k=i+1;k<columns;k++){
                        sum+= array[j][k]*array[i][k]
                    }
                    for(k=i+1;k<columns;k++){
                        array[j][k] += sum*vector1[k]
                    }
                }
            }
            var y = Math.abs(vector1[i])+Math.abs(vector2[i]);
            if(y>x)
            x=y;
        }
        
        function rhst(){
            var index = i+1;
            for(i=columns-1;i>0;i+=-1){
                if(hg!==0){
                    hh = hg*vector1[i][i+1];
                    for(j=index;j<columns;j++)
                    square[j][i] = array[i][j]/hh;
                    for(j=index;j<columns;j++){
                        sum = 0.0
                        for (k=i+1;k<columns;k++)
                        sum += array[i][k]*square[k][j];
                        for (k=i+1;k<columns;k++)
                        square[k][j]+=(sum*square[k][i])
                    }
                }
                //convert to diagonal matrix
                for(j=index;j<columns;j++){
                    square[i][j] = 0;
                    square[j][i]=0;
                }
                square[i][i] = 1;
                hg = vector1[i];
                index = i;
            }
        }

        function lhst(){
            for (i=columns-1; i != -1; i+= -1)
            {	
                var index= i+1;
                hg= vector2[i]
                for (j=index; j < columns; j++) 
                    array[i][j] = 0;
                if (hg !== 0.0)
                {
                    hh= array[i][i]*hg
                    for (j=index; j < columns; j++)
                    {
                        sum=0.0
                        for (k=index; k < rows; k++) sum += array[k][i]*array[k][j];
                        hf= sum/hh
                        for (k=i; k < rows; k++) array[k][j]+=hf*array[k][i];
                    }
                    for (j=i; j < rows; j++) array[j][i] = array[j][i]/hg;
                }
                else
                    for (j=i; j < rows; j++) array[j][i] = 0;
                array[i][i] += 1;
            }
        }
        function diagonalize(){
            var precision = precision * x;
            for(k=columns-1;k!= -1;k+=-1){
                for(var iteration=0;iteration<iterations;iteration++){
                    var test_convergence = false;
                    for(var l=k;l!=-1;l+=-1){
                        if(Math.abs(vector1[l]<=precision)){
                            test_convergence=true;
                            break;
                        }
                    }
                    if(!test_convergence){
                        
                    }
                }
            }
        }

        
    }

    function fill(rows,columns,value){
        var result = [];
        for(var i=0;i<rows;i++){
            result[i] = [];            
            for(var j=0;j<columns;j++){
                result[i][j] = value;             
            }
        }
        return result;
    }
    
    function clone(arr) {
        var string = JSON.stringify(arr);
        var result = JSON.parse(string);
        return result;
    }
})();