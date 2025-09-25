import type { Matrix } from "./type.js";

export function assertNotNull<T>(value: T | null | undefined, fieldName: string): asserts value is T {
  if (value == null) {
    throw new Error(`->${fieldName} is null or undefined`);
  }
}

export function assertDefined<T>(value: T | undefined, defaultValue: T): T {
  return typeof value === "undefined" ? defaultValue : value;
}

export function assertMatrixElements(matrix: Matrix, name: string, indices: [number, number?][]): void {
  for (const [row, col] of indices) {
    assertNotNull(matrix[row], `Row ${name}[${row}][${col}]`);
    if (col !== undefined) {
      assertNotNull(matrix[row]![col], `Col ${name}[${row}][${col}]`);
    }
  }
}

export function assertValidMatrix(a:Matrix,aName:string):void{
    if(!a[0] || !a.length){
        throw new Error(`->${aName} should be a valid matrix`);
    }
}

export function assertValidMatrices(a: Matrix, b: Matrix, aName: string, bName: string): void {
  assertValidMatrix(a,aName)
  assertValidMatrix(b,bName)
  
  if (b.length !== a[0]!.length) {
    throw new Error(`Columns in ${aName} should be the same as the number of rows in ${bName}`);
  }
}