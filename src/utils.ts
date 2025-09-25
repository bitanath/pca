import { assertValidMatrices,assertValidMatrix } from "./assert.js";
import type { Matrix } from "./type.js";

/**
 * Formats the given matrix to a specified precision for neatness
 * @param {Matrix} data 
 * @param {number} precision 
 */
export function format(data:Matrix, precision:number):Matrix {
    let TEN = Math.pow(10, precision || 2);
    return data.map(function (d, i) {
        return d.map(function (n) {
            return Math.round(n * TEN) / TEN;
        })
    })
}

/**
 * Deep Clones a matrix
 * @param {Matrix} arr 
 */
export function clone(arr:Matrix):Matrix{
    let string = JSON.stringify(arr);
    let result = JSON.parse(string);
    return result;
}

/**
 * Multiplies AxB, where A and B are matrices of nXm and mXn dimensions
 * @param {Matrix} a
 * @param {Matrix} b
 */
export function multiply(a:Matrix, b:Matrix):Matrix {
    assertValidMatrices(a, b, "a", "b")
    
    const aRows = a.length;
    const aCols = a[0]!.length;
    const bRows = b.length;
    const bCols = b[0]!.length;

    const result: Matrix = Array.from({ length: aRows }, () => Array(bCols).fill(0));
    for (let i = 0; i < aRows; i++) {
        const aRow = a[i];
        for (let k = 0; k < aCols; k++) {
            const aVal = aRow![k];
            const bRow = b[k];
            for (let j = 0; j < bCols; j++) {
                result[i]![j]! += aVal! * bRow![j]!;
            }
        }
    }
    return result;
}

/**
 * Utility function to subtract matrix b from a
 *
 * @param {Matrix} a
 * @param {Matrix} b
 * @returns
 */
export function subtract(a:Matrix, b:Matrix):Matrix {
    assertValidMatrix(a,"a")
    assertValidMatrix(b,"b")
    const aRows = a.length;
    const aCols = a[0]!.length;
    const bRows = b.length;
    const bCols = b[0]!.length;
    if (!(aRows === bRows && aCols === bCols))
        throw new Error("Both A and B should have the same dimensions");
    const result: Matrix = Array.from({ length: aRows }, () => Array(bCols).fill(0));
    for (var i = 0; i < aRows; i++) {
        for (var j = 0; j < bCols; j++) {
            result[i]![j]! = a[i]![j]! - b[i]![j]!;
        }
    }
    return result;
}
/**
 * Multiplies a matrix into a factor
 *
 * @param {Matrix} matrix
 * @param {number} factor
 * @returns
 */
export function scale(matrix:Matrix, factor:number):Matrix {
    assertValidMatrix(matrix,"a")
    const aRows = matrix.length;
    const aCols = matrix[0]!.length;
    const result: Matrix = Array.from({ length: aRows }, () => Array(aCols).fill(0));
    for (var i = 0; i < aRows; i++) {
        for (var j = 0; j < aCols; j++) {
            result[i]![j]! = matrix[i]![j]! * factor;
        }
    }
    return result;
}

/**
 * Generates a unit square matrix
 * @param {number} rows = number of rows to fill
 */
export function unitSquareMatrix(rows:number):Matrix {
    const result: Matrix = Array.from({ length: rows }, () => Array(rows).fill(0));
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < rows; j++) {
            result[i]![j]! = 1;
        }
    }
    return result;
}
/**
 * Transposes a matrix, converts rows to columns
 * @param {Matrix} matrix = matrix to be copied and transposed, op does not take place in-place
 */
export function transpose(matrix:Matrix,inplace:Boolean=false):Matrix {
    if(inplace){
        const operated = clone(matrix);
        assertValidMatrix(operated,"a")
        let transposed = operated[0]!.map(function (m, c) {
          return matrix.map(function (r) {
            return r[c]!;
          });
        });
        return transposed;
    }else{
        assertValidMatrix(matrix,"a")
        let transposed = matrix[0]!.map(function (m, c) {
          return matrix.map(function (r) {
            return r[c]!;
          });
        });
        return transposed;
    }
}
