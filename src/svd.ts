import { assertNotNull, assertDefined, assertMatrixElements } from "./assert.js";
import type { Matrix, Tuple, SVDResult, Vector } from "./type.js";
import { clone } from "./utils.js";

/**
 * Compute the thin SVD from G. H. Golub and C. Reinsch, Numer. Math. 14, 403-420 (1970)
 * @param {Matrix} A 
 * @returns {Matrix} U,S(diagonal matrix of singular values) and Vt
 */
export function svd(A:Matrix):SVDResult {
        //NOTE: Always throw errors if null values encountered
        let temp;
        let prec = Math.pow(2, -52) // assumes double precision
        let tolerance = 1.e-64 / prec;
        let itmax = 50;
        let c = 0;
        let i = 0;
        let j = 0;
        let k = 0;
        let l = 0;
        let u = clone(A);
        let m = u.length;
        assertNotNull(u[0],"u");
        let n = u[0]!.length;

        if (m < n) throw "Need more rows than columns"

        let e = new Array(n); //vector1
        let q = new Array(n); //vector2
        for (i = 0; i < n; i++) e[i] = q[i] = 0.0;
        let v = rep([n, n], 0);

        function pythag(a:number, b:number):number{
            a = Math.abs(a)
            b = Math.abs(b)
            if (a > b)
                return a * Math.sqrt(1.0 + (b * b / a / a))
            else if (b == 0.0)
                return a
            return b * Math.sqrt(1.0 + (a * a / b / b))
        }

        //repeat a value along an s dimensional matrix
        function rep(s:Tuple, v:number, k?:number):Matrix {
            let index_k = assertDefined(k,0)
            let n = s[index_k]!,
                ret = Array(n),
                i;
            if (index_k === s.length - 1) {
                for (i = n - 2; i >= 0; i -= 2) {
                    ret[i + 1] = v;
                    ret[i] = v;
                }
                if (i === -1) {
                    ret[0] = v;
                }
                return ret;
            }
            for (i = n - 1; i >= 0; i--) {
                ret[i] = rep(s, v, index_k + 1);
            }
            return ret;
        }

        //TODO: Householder's reduction to bidiagonal form
        let f = 0.0;
        let g = 0.0;
        let h = 0.0;
        let x = 0.0;
        let y = 0.0;
        let z = 0.0;
        let s = 0.0;

        for (i = 0; i < n; i++) {
            e[i] = g; //vector
            s = 0.0; //sum
            l = i + 1; //stays i+1
            
            for (j = i; j < m; j++){
                assertMatrixElements(u, "u[j, i]", [[j, i]]);
                s += (u[j]![i]! * u[j]![i]!);
            }
                
            if (s <= tolerance)
                g = 0.0;
            else {
                assertMatrixElements(u, "u[i, i]", [[i, i]]);
                f = u[i]![i]!;
                g = Math.sqrt(s);
                if (f >= 0.0) g = -g;
                h = f * g - s
                u[i]![i] = f - g;
                for (j = l; j < n; j++) {
                    s = 0.0
                    for (k = i; k < m; k++){
                        assertMatrixElements(u, "u[k, i], [k, j]", [[k, i], [k, j]]);
                        s += u[k]![i]! * u[k]![j]!
                    }
                    f = s / h
                    for (k = i; k < m; k++)
                        u[k]![j]! += f * u[k]![i]!
                }
            }
            q[i] = g
            s = 0.0
            for (j = l; j < n; j++){
                assertMatrixElements(u, "u[i, j]", [[i, j]]);
                s = s + u[i]![j]! * u[i]![j]!;
            }
                
            if (s <= tolerance)
                g = 0.0
            else {
                f = u[i]![i + 1]!
                g = Math.sqrt(s)
                if (f >= 0.0) g = -g
                h = f * g - s
                assertMatrixElements(u, "u[i, i+1]", [[i, i+1]]);
                u[i]![i + 1] = f - g;
                for (j = l; j < n; j++) e[j] = u[i]![j]! / h
                for (j = l; j < m; j++) {
                    s = 0.0
                    for (k = l; k < n; k++){
                        assertMatrixElements(u, "u[j, k], [i, k]", [[j, k], [i, k]]);
                        s += (u[j]![k]! * u[i]![k]!)
                    }
                        
                    for (k = l; k < n; k++){
                        assertMatrixElements(u, "u[j, k]", [[j, k]]);
                        u[j]![k]! += s * e[k]
                    }
                }
            }
            y = Math.abs(q[i]) + Math.abs(e[i])
            if (y > x)
                x = y
        }

        //TODO: accumulation of right hand transformations
        for (i = n - 1; i != -1; i += -1) {
            if (g != 0.0) {
                assertMatrixElements(u, "u[i, i+1]", [[i, i+1]]);
                h = g * u[i]![i + 1]!
                for (j = l; j < n; j++){
                    assertMatrixElements(u, "u[i, j]", [[i, j]]);
                    v[j]![i]! = u[i]![j]! / h //u is array, v is square of columns
                }
                for (j = l; j < n; j++) {
                    s = 0.0
                    for (k = l; k < n; k++){
                        assertMatrixElements(u, "u[i, k]", [[i, k]]);
                        assertMatrixElements(v, "v[k, j]", [[k, j]]);
                        s += u[i]![k]! * v[k]![j]!
                    }
                    for (k = l; k < n; k++){
                        assertMatrixElements(v, "v[k, j],[k, i]", [[k, j],[k, i]]);
                        v[k]![j]! += (s * v[k]![i]!)
                    }
                }
            }
            for (j = l; j < n; j++) {
                assertMatrixElements(v, "v[i, j],[j, i]", [[i, j],[j, i]]);
                v[i]![j]! = 0;
                v[j]![i]! = 0;
            }
            v[i]![i]! = 1;
            g = e[i]
            l = i
        }

        //TODO: accumulation of left hand transformations
        for (i = n - 1; i != -1; i += -1) {
            l = i + 1
            g = q[i]
            for (j = l; j < n; j++){
                assertMatrixElements(u, "u[i, j]", [[i, j]]);
                u[i]![j]! = 0;
            }
            if (g != 0.0) {
                assertMatrixElements(u, "u[i, i]", [[i, i]]);
                h = u[i]![i]! * g
                for (j = l; j < n; j++) {
                    s = 0.0
                    for (k = l; k < m; k++){
                        assertMatrixElements(u, "u[k, j],[k, i]", [[k, j],[k, i]]);
                        s += u[k]![i]! * u[k]![j]!;
                    } 
                    f = s / h
                    for (k = i; k < m; k++){ 
                        assertMatrixElements(u, "u[k, j],[k, i]", [[k, j],[k, i]]);
                        u[k]![j]! += f * u[k]![i]!;
                    }
                }
                
                for (j = i; j < m; j++){ 
                    assertMatrixElements(u, "u[j, i]", [[j, i]]);
                    u[j]![i]! = u[j]![i]! / g;
                }
            } else{
                for (j = i; j < m; j++){
                    assertMatrixElements(u, "u[j, i]", [[j, i]]);
                    u[j]![i]! = 0;
                } 
            }
            u[i]![i]! += 1;
        }

        //TODO: diagonalization of the bidiagonal form
        prec = prec * x
        for (k = n - 1; k != -1; k += -1) {
            for (let iteration = 0; iteration < itmax; iteration++) { // test f splitting
                let test_convergence = false
                for (l = k; l != -1; l += -1) {
                    if (Math.abs(e[l]) <= prec) {
                        test_convergence = true
                        break
                    }
                    if (Math.abs(q[l - 1]) <= prec)
                        break
                }
                if (!test_convergence) { // cancellation of e[l] if l>0
                    c = 0.0
                    s = 1.0
                    let l1 = l - 1
                    for (i = l; i < k + 1; i++) {
                        f = s * e[i]
                        e[i] = c * e[i]
                        if (Math.abs(f) <= prec)
                            break
                        g = q[i]
                        h = pythag(f, g)
                        q[i] = h
                        c = g / h
                        s = -f / h
                        for (j = 0; j < m; j++) {
                            assertMatrixElements(u, "u[j, l1],[j, i]", [[j, l1],[j, i]]);
                            y = u[j]![l1]!
                            z = u[j]![i]!
                            u[j]![l1]! = y * c + (z * s)
                            u[j]![i]! = -y * s + (z * c)
                        }
                    }
                }
                //TODO: test of convergence
                z = q[k]
                if (l == k) { //convergence
                    if (z < 0.0) { //q[k] is made non-negative
                        q[k] = -z
                        for (j = 0; j < n; j++){
                            assertMatrixElements(v, "v[k, j]", [[j, k]]);
                            v[j]![k]! = -v[j]![k]!
                        }
                    }
                    break //break out of iteration loop and move on to next k value
                }
                if (iteration >= itmax - 1)
                    throw `Error: no convergence for ${iteration} exceeding ${itmax-1}`
                // shift from bottom 2x2 minor
                x = q[l]
                y = q[k - 1]
                g = e[k - 1]
                h = e[k]
                f = ((y - z) * (y + z) + (g - h) * (g + h)) / (2.0 * h * y)
                g = pythag(f, 1.0)
                if (f < 0.0)
                    f = ((x - z) * (x + z) + h * (y / (f - g) - h)) / x
                else
                    f = ((x - z) * (x + z) + h * (y / (f + g) - h)) / x
                // next QR transformation
                c = 1.0
                s = 1.0
                for (i = l + 1; i < k + 1; i++) {
                    g = e[i]
                    y = q[i]
                    h = s * g
                    g = c * g
                    z = pythag(f, h)
                    e[i - 1] = z
                    c = f / z
                    s = h / z
                    f = x * c + g * s
                    g = -x * s + g * c
                    h = y * s
                    y = y * c
                    for (j = 0; j < n; j++) {
                        assertMatrixElements(v, "v[j, i],[j, i-1]", [[j, i-1],[j, i]]);
                        x = v[j]![i - 1]!
                        z = v[j]![i]!
                        v[j]![i - 1]! = x * c + z * s
                        v[j]![i]! = -x * s + z * c
                    }
                    z = pythag(f, h)
                    q[i - 1] = z
                    c = f / z
                    s = h / z
                    f = c * g + s * y
                    x = -s * g + c * y
                    for (j = 0; j < m; j++) {
                        assertMatrixElements(u, "u[j, i],[j, i-1]", [[j, i-1],[j, i]]);
                        y = u[j]![i - 1]!
                        z = u[j]![i]!
                        u[j]![i - 1]! = y * c + z * s
                        u[j]![i]! = -y * s + z * c
                    }
                }
                e[l] = 0.0
                e[k] = f
                q[k] = x
            }
        }

        for (i = 0; i < q.length; i++)
            if (q[i] < prec) q[i] = 0

        //TODO: sort eigenvalues	
        for (i = 0; i < n; i++) {
            for (j = i - 1; j >= 0; j--) {
                if (q[j] < q[i]) {
                    c = q[j]
                    q[j] = q[i]
                    q[i] = c
                    for (k = 0; k < u.length; k++) {
                        assertMatrixElements(u, "u[k, i]", [[k, i],[k, j]]);
                        temp = u[k]![i]!;
                        u[k]![i]! = u[k]![j]!;
                        u[k]![j]! = temp;
                    }
                    for (k = 0; k < v.length; k++) {
                        assertMatrixElements(v, "v[k, i]", [[k, i],[k, j]]);
                        temp = v[k]![i]!;
                        v[k]![i]! = v[k]![j]!;
                        v[k]![j]! = temp;
                    }
                    i = j
                }
            }
        }

        return {
            U: u,
            S: q as Vector,
            V: v
        }
}