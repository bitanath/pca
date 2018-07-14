# Principal Components Analysis in node or the browser

A JS library to compute Principal Components from a given matrix of data. Use in either node.js or the browser.

Use by accessing the singleton PCA, and by the methods as described below.

## How to use the API

All methods are exposed through `PCA` global variable

Say you have data for marks of a class 4 students in 3 examinations on the same subject:

```
Student 1: 40,50,60
Student 2: 50,70,60
Student 3: 80,70,90
Student 4: 50,60,80
```

You want to examine whether it is possible to come up with a single descriptive set of scores which explains performance across the class. Alternatively, whether it would make sense to replace 3 exams with just one (and reduce stress on students).


First get the set of eigenvectors and eigenvalues (principal components and adjusted loadings)
```js
var data = [[40,50,60],[50,70,60],[80,70,90],[50,60,80]];
var vectors = PCA.getEigenVectors(data);
//Outputs 
// [{
//     "eigenvalue": 520.0992658908312,
//     "vector": [0.744899700771276, 0.2849796479974595, 0.6032503924724023]
// }, {
//     "eigenvalue": 78.10455398035167,
//     "vector": [0.2313199078283626, 0.7377809866160473, -0.6341689964277106]
// }, {
//     "eigenvalue": 18.462846795484058,
//     "vector": [0.6257919271076777, -0.6119361208615616, -0.4836513702572988]
// }]
```

Now you'd need to find a set of eigenvectors that would explain a decent amount of variance across your exams (thus telling you if 1 test or 2 tests would suffice instead of three)

```js
var first = PCA.computePercentageExplained(vectors,vectors[0])
// 0.8434042149581044
var topTwo = PCA.computePercentageExplained(vectors,vectors[0],vectors[1])
// 0.9700602484397556
```

So if you wanted to have 97% certainty, that someone wouldn't just flunk out accidentally, you'd take 2 exams. But let's say you just wanted to take 1, explaining 84% of variance is good enough. And instead of taking the examination again, you just wanted a normalized score

```js
var adData = PCA.computeAdjustedData(data,vectors[0])
// {
//     "adjustedData": [
//         [-22.27637101744241, -9.127781049780463, 31.316721747529886, 0.08743031969298887]
//     ],
//     "formattedAdjustedData": [
//         [-22.28, -9.13, 31.32, 0.09]
//     ],
//     "avgData": [
//         [-55, -62.5, -72.5],
//         [-55, -62.5, -72.5],
//         [-55, -62.5, -72.5],
//         [-55, -62.5, -72.5]
//     ],
//     "selectedVectors": [
//         [0.744899700771276, 0.2849796479974595, 0.6032503924724023]
//     ]
// }
```

The adjustedData is centered (mean = 0), but you could always set the mean to something like 50, to get scores of `[-22.27637101744241, -9.127781049780463, 31.316721747529886, 0.08743031969298887].map(score=>Math.round(score+50))` equal to `[28, 41, 81, 50]` , and that's how well your students would have done, in the order of students.

### Other cool stuff that's possible

#### Compression (lossy):
```js
var compressed = adData.formattedAdjustedData;
//[
//         [-22.28, -9.13, 31.32, 0.09]
//     ]
var uncompressed = PCA.computeOriginalData(compressed,adData.selectedVectors,adData.avgData);
//uncompressed.formattedOriginalData (lossy since 2 eigenvectors are removed)
// [
//     [38.4, 56.15, 59.06],
//     [48.2, 59.9, 66.99],
//     [78.33, 71.43, 91.39],
//     [55.07, 62.53, 72.55]
// ]
```

Compare this to the original data to understand just how lossy the compression was
```
//Original Data
[
    [40, 50, 60],
    [50, 70, 60],
    [80, 70, 90],
    [50, 60, 80]
]
//Uncompressed Data
[
    [38.4, 56.15, 59.06],
    [48.2, 59.9, 66.99],
    [78.33, 71.43, 91.39],
    [55.07, 62.53, 72.55]
]
```
## List of Methods


#### computeDeviationMatrix(data) 
Find centered matrix from original data

#### computeDeviationScores(centeredMatrix)
Find deviation from mean for values in matrix

#### computeSVD(deviationScores)
Singular Value Decomposition of matrix

#### computePercentageExplained(allvectors, ...selected)
Find percentage explained variance by selected vectors as opposed to the whole

#### computeOriginalData(compressedData,selectedVectors,avgData)
Get original data from the adjusted data after selecting a few eigenvectors

#### computeVarianceCovariance(devSumOfSquares,isSample)
Get variance covariance matrix from the data, adjust n by one if the data is from a sample

#### computeAdjustedData(initialData, ...selectedVectors)
Get adjusted data using principal components as selected

#### getEigenVectors(initialData)
Get the principal components of data using the steps outlined above.

#### analyseTopResult(initialData)
Same as computeAdjustedData(initialData,vectors[0]). Selecting only the top eigenvector which explains the most variance.

#### transpose(A)
Utility function to transpose a matrix A to A(T)

#### multiply(A,B)
Utility function to multiply AXB

#### clone(A)
Utility function to clone a matrix A

#### scale(A,n)
Utility function to scale all elements in A by a factor of n

## Dependencies

Also utilizes some code from the awesome numeric.js library with some modifications for performing the Singular Value Decomposition of a Matrix, the original code of which was written in C from [http://www.public.iastate.edu/~dicook/JSS/paper/code/svd.c](http://www.public.iastate.edu/~dicook/JSS/paper/code/svd.c). Below is their copyright notice.

```
Numeric Javascript
Copyright (C) 2011 by Sébastien Loisel

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so.
```

`LICENSE: MIT`