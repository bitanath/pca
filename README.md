# Principal Components Analysis in the browser

A library to compute Principal Components from a given matrix of data.

Use the global PCA object to compute stuff.

### Get it from below, or utilize pca.min.js from this repository

`https://cdn.apptools.tech/pca.min.js`

## Samples

Determine the deviation matrix from data (Data-mean)
```js
var matrix = PCA.computeDeviationMatrix([[1,2,3],[2,5,4],[3,4,6]]);
//Outputs the following deviation matrix for the given example
// [
//     [-1, -1.6666666666666665, -1.333333333333333],
//     [
//         0,
//         1.3333333333333335, -0.33333333333333304
//     ],
//     [
//         1,
//         0.3333333333333335,
//         1.666666666666667
//     ]
// ]
```

Then calculate the deviation sum of squares and variance covariance matrix from this 

```js
var C = PCA.computeVarianceCovariance(PCA.computeDeviationScores(matrix),false); //compute variance for population and not sample, use true to compute for sample and not population
//Outputs the following Variance Covariance Matrix
// [
//     [
//         0.6666666666666666,
//         0.6666666666666666,
//         1
//     ],
//     [
//         0.6666666666666666,
//         1.5555555555555556,
//         0.7777777777777777
//     ],
//     [
//         1,
//         0.7777777777777777,
//         1.5555555555555554
//     ]
// ]
```

Then, calculate the eigenvectors and use it to compute adjusted data from the reduced eigenvectors. Eliminate low variance explaining vectors and feed it into the function to generate the final, adjusted dataset.

```js
var vectors = PCA.computeSVD(C); //returns [{eigenvalue:n,vector:[array]}]
//Outputs the following Singular Value Decomposition formatted by eigenvalues and unit vectors for a given value
// [{
//         "eigenvalue": 2.948821334907717,
//         "vector": [
//             0.4623445500670477,
//             0.5904931455695707,
//             0.6614796762249409
//         ]
//     },
//     {
//         "eigenvalue": 0.82895644287006,
//         "vector": [
//             0.20931620720588442, -0.7976003572490669,
//             0.5657034519225638
//         ]
//     },
//     {
//         "eigenvalue": 0,
//         "vector": [-0.8616404368553292,
//             0.12309149097933254,
//             0.49236596391733106
//         ]
//     }
// ]
var adjustedData = PCA.computeAdjustedData([[1,2,3],[2,5,4],[3,4,6]],vectors[0].vector,vectors[1].vector); //selects data using the first 2 principal components from above example
//{
//     "finalWithoutMean": [
//         [
//             0.19913512615789314,
//             0.23724316938932855,
//             0.2891756784289814
//         ],
//         [
//             0.3563872447166794, -1.2237596710343752,
//             0.9296175960127827
//         ]
//     ],
//     "finalWithMean": [
//         [
//             2.199135126157893,
//             3.903909836055995,
//             4.622509011762315
//         ],
//         [
//             2.3563872447166796,
//             2.442906995632291,
//             5.262950929346116
//         ]
//     ]
// }
```

Finally, in case you want to skip all these steps, and simply get the principal component, or select the first principal component alone:

```js
var vectors = PCA.getEigenVectors([[1,2,3],[2,5,4],[3,4,6]]); //Get top eigenvectors (principal components)
//Simply gets the eigenvectors without the intermediate steps
// [{
//         "eigenvalue": 2.948821334907717,
//         "vector": [
//             0.4623445500670477,
//             0.5904931455695707,
//             0.6614796762249409
//         ]
//     },
//     {
//         "eigenvalue": 0.82895644287006,
//         "vector": [
//             0.20931620720588442, -0.7976003572490669,
//             0.5657034519225638
//         ]
//     },
//     {
//         "eigenvalue": 0,
//         "vector": [-0.8616404368553292,
//             0.12309149097933254,
//             0.49236596391733106
//         ]
//     }
// ]
var adjustedData = PCA.analyseTopResult([[1,2,3],[2,5,4],[3,4,6]]); //Get adjusted data using only the first eigenvector
// {
//     "finalWithoutMean": [
//         [
//             0.19913512615789314,
//             0.23724316938932855,
//             0.2891756784289814
//         ]
//     ],
//     "finalWithMean": [
//         [
//             2.199135126157893,
//             3.903909836055995,
//             4.622509011762315
//         ]
//     ]
// }
```

Utilizes the awesome numeric.js library with some modifications for performing the Singular Value Decomposition of a Matrix. Below is their copyright notice.

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