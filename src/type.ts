export type Matrix = number[][];
export type Vector = number[];
export type Tuple = [number, number];
export type Number = number;
export type SVDResult = {
    U: Matrix;
    S: Vector;
    V: Matrix;
};
export type EigenObject = {
    eigenvalue:Number,
    eigenvector:Vector
}