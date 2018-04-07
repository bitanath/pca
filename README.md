# Principal Components Analysis in the browser

A library to compute Principal Components from a given matrix of data.

Use the global PCA object to compute stuff.

## Samples

Determine the deviation matrix from data (Data-mean)
```js
var matrix = PCA.computeDeviationMatrix([[1,2,3],[2,5,4],[3,4,6]]);
```

Then calculate the deviation sum of squares and variance covariance matrix from this 

```js
var C = PCA.computeVarianceCovariance(PCA.computeDeviationScores(matrix),false); //compute variance for population and not sample
```

Then, calculate the eigenvectors and use it to compute adjusted data from the reduced eigenvectors. Eliminate low variance explaining vectors and feed it into the function to generate the final, adjusted dataset.

```js
var vectors = PCA.computeSVD(C); //returns [{eigenvalue:n,vector:[array]}]
var adjustedData = PCA.computeAdjustedData([[1,2,3],[2,5,4],[3,4,6]],vectors[0].vector,vectors[1].vector); //select the first 2 principal components
```

Finally, in case you want to skip all these steps, and simply get the principal component, or select the first principal component alone:

```js
var vectors = PCA.getEigenVectors([[1,2,3],[2,5,4],[3,4,6]]); //Get top eigenvectors

var adjustedData = PCA.analyseTopResult([[1,2,3],[2,5,4],[3,4,6]]); //Get adjusted data using only the first eigenvector
```

Utilizes the awesome numeric.js library with some modifications. Below is their copyright notice.

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