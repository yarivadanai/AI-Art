import type { LongFunctionTemplate } from "./code-templates";

export const LONG_FUNCTIONS_EXT_1: LongFunctionTemplate[] = [
  // 1. Dijkstra's shortest path
  {
    code: `function dijkstra(graph, start, end) {
  const dist = {};
  const prev = {};
  const visited = new Set();
  const nodes = Object.keys(graph);
  for (const node of nodes) {
    dist[node] = Infinity;
    prev[node] = null;
  }
  dist[start] = 0;
  while (true) {
    let u = null;
    let minDist = Infinity;
    for (const node of nodes) {
      if (!visited.has(node) && dist[node] < minDist) {
        minDist = dist[node];
        u = node;
      }
    }
    if (u === null || u === end) break;
    visited.add(u);
    for (const [neighbor, weight] of graph[u]) {
      const alt = dist[u] + weight;
      if (alt < dist[neighbor]) {
        dist[neighbor] = alt;
        prev[neighbor] = u;
      }
    }
  }
  const path = [];
  let curr = end;
  while (curr !== null) {
    path.unshift(curr);
    curr = prev[curr];
  }
  if (path[0] !== start) return JSON.stringify({ path: [], distance: -1 });
  return JSON.stringify({ path: path, distance: dist[end] });
}`,
    language: "javascript",
    inputDescription: 'Weighted graph adjacency list, start="A", end="E"',
    inputValue: '{ A: [["B",4],["C",2]], B: [["D",3],["E",1]], C: [["B",1],["D",5]], D: [["E",2]], E: [] }, "A", "E"',
    expectedOutput: '{"path":["A","C","B","E"],"distance":4}',
    options: [
      '{"path":["A","C","B","E"],"distance":4}',
      '{"path":["A","B","E"],"distance":5}',
      '{"path":["A","C","B","D","E"],"distance":8}',
      '{"path":["A","C","B","E"],"distance":5}',
    ],
    correctOptionIndex: 0,
  },
  // 2. Knapsack 0/1 with item tracking
  {
    code: `function knapsack(capacity, items) {
  const n = items.length;
  const dp = Array(n + 1).fill(null).map(() => Array(capacity + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    const w = items[i - 1].weight;
    const v = items[i - 1].value;
    for (let j = 0; j <= capacity; j++) {
      dp[i][j] = dp[i - 1][j];
      if (j >= w && dp[i - 1][j - w] + v > dp[i][j]) {
        dp[i][j] = dp[i - 1][j - w] + v;
      }
    }
  }
  const selected = [];
  let j = capacity;
  for (let i = n; i >= 1; i--) {
    if (dp[i][j] !== dp[i - 1][j]) {
      selected.unshift(items[i - 1].name);
      j -= items[i - 1].weight;
    }
  }
  const totalWeight = items.filter(it => selected.includes(it.name))
    .reduce((s, it) => s + it.weight, 0);
  return JSON.stringify({
    maxValue: dp[n][capacity],
    selected: selected,
    totalWeight: totalWeight
  });
}`,
    language: "javascript",
    inputDescription: "capacity=10, items with name/weight/value",
    inputValue: '10, [{name:"A",weight:3,value:4},{name:"B",weight:4,value:5},{name:"C",weight:5,value:7},{name:"D",weight:2,value:3}]',
    expectedOutput: '{"maxValue":14,"selected":["A","C","D"],"totalWeight":10}',
    options: [
      '{"maxValue":14,"selected":["A","C","D"],"totalWeight":10}',
      '{"maxValue":12,"selected":["B","C"],"totalWeight":9}',
      '{"maxValue":15,"selected":["A","B","C"],"totalWeight":12}',
      '{"maxValue":14,"selected":["B","C","D"],"totalWeight":11}',
    ],
    correctOptionIndex: 0,
  },
  // 3. Longest Common Subsequence with reconstruction
  {
    code: `function longestCommonSubseq(str1, str2) {
  const m = str1.length;
  const n = str2.length;
  const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  let lcs = "";
  let i = m, j = n;
  while (i > 0 && j > 0) {
    if (str1[i - 1] === str2[j - 1]) {
      lcs = str1[i - 1] + lcs;
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }
  const ratio = (lcs.length * 2) / (m + n);
  const roundedRatio = Math.round(ratio * 1000) / 1000;
  return JSON.stringify({
    lcs: lcs,
    length: lcs.length,
    similarity: roundedRatio
  });
}`,
    language: "javascript",
    inputDescription: 'Two strings: "ABCBDAB" and "BDCAB"',
    inputValue: '"ABCBDAB", "BDCAB"',
    expectedOutput: '{"lcs":"BDAB","length":4,"similarity":0.667}',
    options: [
      '{"lcs":"BDAB","length":4,"similarity":0.667}',
      '{"lcs":"BCAB","length":4,"similarity":0.667}',
      '{"lcs":"BDA","length":3,"similarity":0.5}',
      '{"lcs":"BDAB","length":4,"similarity":0.571}',
    ],
    correctOptionIndex: 0,
  },
  // 4. Topological sort with cycle detection
  {
    code: `function topologicalSort(graph) {
  const inDegree = {};
  const nodes = Object.keys(graph);
  for (const node of nodes) {
    if (!(node in inDegree)) inDegree[node] = 0;
    for (const neighbor of graph[node]) {
      if (!(neighbor in inDegree)) inDegree[neighbor] = 0;
      inDegree[neighbor]++;
    }
  }
  const queue = [];
  for (const node of nodes) {
    if (inDegree[node] === 0) queue.push(node);
  }
  queue.sort();
  const result = [];
  let processedEdges = 0;
  while (queue.length > 0) {
    const node = queue.shift();
    result.push(node);
    for (const neighbor of graph[node]) {
      inDegree[neighbor]--;
      processedEdges++;
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
        queue.sort();
      }
    }
  }
  const hasCycle = result.length !== nodes.length;
  const levels = {};
  if (!hasCycle) {
    const depth = {};
    for (const node of result) {
      depth[node] = 0;
      for (const n2 of nodes) {
        if (graph[n2].includes(node)) {
          depth[node] = Math.max(depth[node], depth[n2] + 1);
        }
      }
      levels[node] = depth[node];
    }
  }
  return JSON.stringify({
    order: result,
    hasCycle: hasCycle,
    processedEdges: processedEdges,
    levels: levels
  });
}`,
    language: "javascript",
    inputDescription: 'DAG: { A: ["C"], B: ["C","D"], C: ["E"], D: ["E"], E: [] }',
    inputValue: '{ A: ["C"], B: ["C","D"], C: ["E"], D: ["E"], E: [] }',
    expectedOutput: '{"order":["A","B","C","D","E"],"hasCycle":false,"processedEdges":5,"levels":{"A":0,"B":0,"C":1,"D":1,"E":2}}',
    options: [
      '{"order":["A","B","C","D","E"],"hasCycle":false,"processedEdges":5,"levels":{"A":0,"B":0,"C":1,"D":1,"E":2}}',
      '{"order":["B","A","D","C","E"],"hasCycle":false,"processedEdges":5,"levels":{"A":0,"B":0,"C":1,"D":1,"E":2}}',
      '{"order":["A","B","C","D","E"],"hasCycle":false,"processedEdges":4,"levels":{"A":0,"B":0,"C":1,"D":1,"E":2}}',
      '{"order":["A","B","C","D","E"],"hasCycle":true,"processedEdges":5,"levels":{}}',
    ],
    correctOptionIndex: 0,
  },
  // 5. Run-Length Encoding/Decoding with statistics
  {
    code: `function runLengthAnalysis(input) {
  const encoded = [];
  let i = 0;
  while (i < input.length) {
    let count = 1;
    while (i + count < input.length && input[i + count] === input[i]) {
      count++;
    }
    encoded.push([input[i], count]);
    i += count;
  }
  let encodedStr = "";
  for (const pair of encoded) {
    if (pair[1] === 1) {
      encodedStr += pair[0];
    } else {
      encodedStr += pair[1] + pair[0];
    }
  }
  let decoded = "";
  let j = 0;
  while (j < encodedStr.length) {
    let numStr = "";
    while (j < encodedStr.length && encodedStr[j] >= '0' && encodedStr[j] <= '9') {
      numStr += encodedStr[j];
      j++;
    }
    const repeatCount = numStr.length > 0 ? parseInt(numStr, 10) : 1;
    if (j < encodedStr.length) {
      decoded += encodedStr[j].repeat(repeatCount);
      j++;
    }
  }
  const maxRun = Math.max(...encoded.map(p => p[1]));
  const uniqueChars = new Set(input).size;
  const compressionRatio = Math.round((encodedStr.length / input.length) * 1000) / 1000;
  return JSON.stringify({
    encoded: encodedStr,
    decoded: decoded,
    maxRun: maxRun,
    uniqueChars: uniqueChars,
    compressionRatio: compressionRatio
  });
}`,
    language: "javascript",
    inputDescription: 'Input string: "aaabbbccddddea"',
    inputValue: '"aaabbbccddddea"',
    expectedOutput: '{"encoded":"3a3b2c4dea","decoded":"aaabbbccddddea","maxRun":4,"uniqueChars":5,"compressionRatio":0.714}',
    options: [
      '{"encoded":"3a3b2c4dea","decoded":"aaabbbccddddea","maxRun":4,"uniqueChars":5,"compressionRatio":0.714}',
      '{"encoded":"3a3b2c4d1e1a","decoded":"aaabbbccddddea","maxRun":4,"uniqueChars":5,"compressionRatio":0.857}',
      '{"encoded":"3a3b2c4dea","decoded":"aaabbbccddddea","maxRun":4,"uniqueChars":5,"compressionRatio":0.667}',
      '{"encoded":"3a3b2c4dea","decoded":"aaabbbccddddea","maxRun":3,"uniqueChars":5,"compressionRatio":0.714}',
    ],
    correctOptionIndex: 0,
  },
  // 6. Matrix chain multiplication (DP)
  {
    code: `function matrixChainOrder(dims) {
  const n = dims.length - 1;
  const dp = Array(n).fill(null).map(() => Array(n).fill(0));
  const split = Array(n).fill(null).map(() => Array(n).fill(0));
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i < n - len + 1; i++) {
      const j = i + len - 1;
      dp[i][j] = Infinity;
      for (let k = i; k < j; k++) {
        const cost = dp[i][k] + dp[k + 1][j] + dims[i] * dims[k + 1] * dims[j + 1];
        if (cost < dp[i][j]) {
          dp[i][j] = cost;
          split[i][j] = k;
        }
      }
    }
  }
  function buildParens(i, j) {
    if (i === j) return "M" + (i + 1);
    return "(" + buildParens(i, split[i][j]) + " x " + buildParens(split[i][j] + 1, j) + ")";
  }
  const order = buildParens(0, n - 1);
  const naiveCost = dims[0] * dims[1] * dims[2];
  let totalNaive = 0;
  for (let i = 0; i < n - 1; i++) {
    totalNaive += dims[0] * dims[i + 1] * dims[i + 2];
  }
  const savings = totalNaive - dp[0][n - 1];
  return JSON.stringify({
    minCost: dp[0][n - 1],
    parenthesization: order,
    savings: savings
  });
}`,
    language: "javascript",
    inputDescription: "Matrix dimensions: [10, 30, 5, 60]",
    inputValue: "[10, 30, 5, 60]",
    expectedOutput: '{"minCost":4500,"parenthesization":"((M1 x M2) x M3)","savings":0}',
    options: [
      '{"minCost":4500,"parenthesization":"((M1 x M2) x M3)","savings":0}',
      '{"minCost":9000,"parenthesization":"(M1 x (M2 x M3))","savings":0}',
      '{"minCost":4500,"parenthesization":"(M1 x (M2 x M3))","savings":0}',
      '{"minCost":6000,"parenthesization":"((M1 x M2) x M3)","savings":3000}',
    ],
    correctOptionIndex: 0,
  },
  // 7. Convex hull (Graham scan)
  {
    code: `function convexHull(points) {
  function cross(O, A, B) {
    return (A[0] - O[0]) * (B[1] - O[1]) - (A[1] - O[1]) * (B[0] - O[0]);
  }
  const pts = points.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  if (pts.length <= 1) return JSON.stringify({ hull: pts, perimeter: 0, area: 0 });
  const lower = [];
  for (const p of pts) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
      lower.pop();
    }
    lower.push(p);
  }
  const upper = [];
  for (let i = pts.length - 1; i >= 0; i--) {
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], pts[i]) <= 0) {
      upper.pop();
    }
    upper.push(pts[i]);
  }
  lower.pop();
  upper.pop();
  const hull = lower.concat(upper);
  let perimeter = 0;
  for (let i = 0; i < hull.length; i++) {
    const j = (i + 1) % hull.length;
    const dx = hull[j][0] - hull[i][0];
    const dy = hull[j][1] - hull[i][1];
    perimeter += Math.sqrt(dx * dx + dy * dy);
  }
  let area = 0;
  for (let i = 0; i < hull.length; i++) {
    const j = (i + 1) % hull.length;
    area += hull[i][0] * hull[j][1];
    area -= hull[j][0] * hull[i][1];
  }
  area = Math.abs(area) / 2;
  return JSON.stringify({
    hull: hull,
    vertexCount: hull.length,
    area: area,
    perimeter: Math.round(perimeter * 100) / 100
  });
}`,
    language: "javascript",
    inputDescription: "Array of 2D points",
    inputValue: "[[0,0],[1,1],[2,2],[0,2],[2,0],[1,0],[0,1]]",
    expectedOutput: '{"hull":[[0,0],[2,0],[2,2],[0,2]],"vertexCount":4,"area":4,"perimeter":8}',
    options: [
      '{"hull":[[0,0],[2,0],[2,2],[0,2]],"vertexCount":4,"area":4,"perimeter":8}',
      '{"hull":[[0,0],[1,0],[2,0],[2,2],[0,2],[0,1]],"vertexCount":6,"area":4,"perimeter":8}',
      '{"hull":[[0,0],[2,0],[2,2],[0,2]],"vertexCount":4,"area":4,"perimeter":8.83}',
      '{"hull":[[0,0],[2,0],[2,2],[0,2]],"vertexCount":4,"area":2,"perimeter":8}',
    ],
    correctOptionIndex: 0,
  },
  // 8. Huffman encoding frequency analysis
  {
    code: `function huffmanAnalysis(text) {
  const freq = {};
  for (const ch of text) {
    freq[ch] = (freq[ch] || 0) + 1;
  }
  const entries = Object.entries(freq).sort((a, b) => {
    if (a[1] !== b[1]) return a[1] - b[1];
    return a[0].localeCompare(b[0]);
  });
  const heap = entries.map(e => ({ ch: e[0], freq: e[1], left: null, right: null }));
  while (heap.length > 1) {
    heap.sort((a, b) => a.freq - b.freq);
    const left = heap.shift();
    const right = heap.shift();
    heap.push({
      ch: null,
      freq: left.freq + right.freq,
      left: left,
      right: right
    });
  }
  const codes = {};
  function traverse(node, prefix) {
    if (!node) return;
    if (node.ch !== null) {
      codes[node.ch] = prefix || "0";
      return;
    }
    traverse(node.left, prefix + "0");
    traverse(node.right, prefix + "1");
  }
  traverse(heap[0], "");
  let totalBits = 0;
  for (const ch in codes) {
    totalBits += codes[ch].length * freq[ch];
  }
  const fixedBits = text.length * Math.ceil(Math.log2(Object.keys(freq).length));
  const sortedCodes = {};
  for (const key of Object.keys(codes).sort()) {
    sortedCodes[key] = codes[key];
  }
  return JSON.stringify({
    frequencies: freq,
    codes: sortedCodes,
    totalBits: totalBits,
    fixedBits: fixedBits
  });
}`,
    language: "javascript",
    inputDescription: 'Input string: "aabbc"',
    inputValue: '"aabbc"',
    expectedOutput: '{"frequencies":{"a":2,"b":2,"c":1},"codes":{"a":"11","b":"0","c":"10"},"totalBits":8,"fixedBits":10}',
    options: [
      '{"frequencies":{"a":2,"b":2,"c":1},"codes":{"a":"11","b":"0","c":"10"},"totalBits":8,"fixedBits":10}',
      '{"frequencies":{"a":2,"b":2,"c":1},"codes":{"a":"0","b":"10","c":"11"},"totalBits":9,"fixedBits":10}',
      '{"frequencies":{"a":2,"b":2,"c":1},"codes":{"a":"11","b":"0","c":"10"},"totalBits":10,"fixedBits":10}',
      '{"frequencies":{"a":2,"b":2,"c":1},"codes":{"a":"11","b":"0","c":"10"},"totalBits":8,"fixedBits":15}',
    ],
    correctOptionIndex: 0,
  },
  // 9. Sieve of Eratosthenes with prime gap analysis
  {
    code: `function primeAnalysis(limit) {
  const sieve = new Array(limit + 1).fill(true);
  sieve[0] = false;
  sieve[1] = false;
  for (let i = 2; i * i <= limit; i++) {
    if (sieve[i]) {
      for (let j = i * i; j <= limit; j += i) {
        sieve[j] = false;
      }
    }
  }
  const primes = [];
  for (let i = 2; i <= limit; i++) {
    if (sieve[i]) primes.push(i);
  }
  const gaps = [];
  let maxGap = 0;
  let maxGapStart = 0;
  for (let i = 1; i < primes.length; i++) {
    const gap = primes[i] - primes[i - 1];
    gaps.push(gap);
    if (gap > maxGap) {
      maxGap = gap;
      maxGapStart = primes[i - 1];
    }
  }
  const twinPrimes = [];
  for (let i = 1; i < primes.length; i++) {
    if (primes[i] - primes[i - 1] === 2) {
      twinPrimes.push([primes[i - 1], primes[i]]);
    }
  }
  const avgGap = gaps.length > 0 ? Math.round((gaps.reduce((s, g) => s + g, 0) / gaps.length) * 1000) / 1000 : 0;
  return JSON.stringify({
    count: primes.length,
    largest: primes[primes.length - 1],
    maxGap: maxGap,
    maxGapAfter: maxGapStart,
    twinPrimeCount: twinPrimes.length,
    avgGap: avgGap
  });
}`,
    language: "javascript",
    inputDescription: "Upper limit for prime sieve: 50",
    inputValue: "50",
    expectedOutput: '{"count":15,"largest":47,"maxGap":6,"maxGapAfter":23,"twinPrimeCount":6,"avgGap":3.214}',
    options: [
      '{"count":15,"largest":47,"maxGap":4,"maxGapAfter":23,"twinPrimeCount":6,"avgGap":3.214}',
      '{"count":15,"largest":47,"maxGap":4,"maxGapAfter":23,"twinPrimeCount":5,"avgGap":3.214}',
      '{"count":15,"largest":47,"maxGap":6,"maxGapAfter":23,"twinPrimeCount":6,"avgGap":3.214}',
      '{"count":14,"largest":47,"maxGap":4,"maxGapAfter":23,"twinPrimeCount":6,"avgGap":3.214}',
    ],
    correctOptionIndex: 2,
  },
  // 10. Longest Increasing Subsequence with path
  {
    code: `function longestIncreasingSubseq(arr) {
  const n = arr.length;
  const dp = new Array(n).fill(1);
  const prev = new Array(n).fill(-1);
  let maxLen = 1;
  let maxIdx = 0;
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (arr[j] < arr[i] && dp[j] + 1 > dp[i]) {
        dp[i] = dp[j] + 1;
        prev[i] = j;
      }
    }
    if (dp[i] > maxLen) {
      maxLen = dp[i];
      maxIdx = i;
    }
  }
  const lis = [];
  let idx = maxIdx;
  while (idx !== -1) {
    lis.unshift(arr[idx]);
    idx = prev[idx];
  }
  let numLIS = 0;
  const count = new Array(n).fill(1);
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (arr[j] < arr[i]) {
        if (dp[j] + 1 === dp[i]) {
          count[i] += count[j];
        }
      }
    }
  }
  for (let i = 0; i < n; i++) {
    if (dp[i] === maxLen) numLIS += count[i];
  }
  return JSON.stringify({
    length: maxLen,
    subsequence: lis,
    totalCount: numLIS
  });
}`,
    language: "javascript",
    inputDescription: "Array: [3, 1, 4, 1, 5, 9, 2, 6]",
    inputValue: "[3, 1, 4, 1, 5, 9, 2, 6]",
    expectedOutput: '{"length":4,"subsequence":[3,4,5,9],"totalCount":10}',
    options: [
      '{"length":4,"subsequence":[3,4,5,9],"totalCount":10}',
      '{"length":4,"subsequence":[1,4,5,9],"totalCount":10}',
      '{"length":4,"subsequence":[3,4,5,9],"totalCount":5}',
      '{"length":3,"subsequence":[3,5,9],"totalCount":4}',
    ],
    correctOptionIndex: 0,
  },
  // 11. Merge sort with inversion count
  {
    code: `function mergeSortCount(arr) {
  let inversions = 0;
  let comparisons = 0;
  function mergeSort(a) {
    if (a.length <= 1) return a;
    const mid = Math.floor(a.length / 2);
    const left = mergeSort(a.slice(0, mid));
    const right = mergeSort(a.slice(mid));
    return merge(left, right);
  }
  function merge(left, right) {
    const result = [];
    let i = 0, j = 0;
    while (i < left.length && j < right.length) {
      comparisons++;
      if (left[i] <= right[j]) {
        result.push(left[i]);
        i++;
      } else {
        result.push(right[j]);
        inversions += left.length - i;
        j++;
      }
    }
    while (i < left.length) {
      result.push(left[i]);
      i++;
    }
    while (j < right.length) {
      result.push(right[j]);
      j++;
    }
    return result;
  }
  const sorted = mergeSort(arr);
  const isSorted = sorted.every((v, i) => i === 0 || sorted[i - 1] <= v);
  return JSON.stringify({
    sorted: sorted,
    inversions: inversions,
    comparisons: comparisons,
    isSorted: isSorted
  });
}`,
    language: "javascript",
    inputDescription: "Array: [5, 3, 8, 1, 2]",
    inputValue: "[5, 3, 8, 1, 2]",
    expectedOutput: '{"sorted":[1,2,3,5,8],"inversions":7,"comparisons":8,"isSorted":true}',
    options: [
      '{"sorted":[1,2,3,5,8],"inversions":7,"comparisons":8,"isSorted":true}',
      '{"sorted":[1,2,3,5,8],"inversions":6,"comparisons":7,"isSorted":true}',
      '{"sorted":[1,2,3,5,8],"inversions":7,"comparisons":7,"isSorted":true}',
      '{"sorted":[1,2,3,5,8],"inversions":5,"comparisons":8,"isSorted":true}',
    ],
    correctOptionIndex: 0,
  },
  // 12. Floyd-Warshall all-pairs shortest paths
  {
    code: `function floydWarshall(n, edges) {
  const INF = 999999;
  const dist = Array(n).fill(null).map(() => Array(n).fill(INF));
  const next = Array(n).fill(null).map(() => Array(n).fill(-1));
  for (let i = 0; i < n; i++) {
    dist[i][i] = 0;
    next[i][i] = i;
  }
  for (const [u, v, w] of edges) {
    dist[u][v] = w;
    next[u][v] = v;
  }
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
          next[i][j] = next[i][k];
        }
      }
    }
  }
  function getPath(u, v) {
    if (next[u][v] === -1) return [];
    const path = [u];
    let curr = u;
    while (curr !== v) {
      curr = next[curr][v];
      path.push(curr);
    }
    return path;
  }
  const path02 = getPath(0, 2);
  let diameter = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (dist[i][j] < INF && dist[i][j] > diameter) {
        diameter = dist[i][j];
      }
    }
  }
  return JSON.stringify({
    dist: dist,
    path0to2: path02,
    diameter: diameter
  });
}`,
    language: "javascript",
    inputDescription: "n=4, directed edges [from, to, weight]",
    inputValue: "4, [[0,1,3],[0,3,7],[1,2,2],[2,3,1],[3,1,2]]",
    expectedOutput: '{"dist":[[0,3,5,6],[999999,0,2,3],[999999,3,0,1],[999999,2,4,0]],"path0to2":[0,1,2],"diameter":6}',
    options: [
      '{"dist":[[0,3,5,6],[999999,0,2,3],[999999,3,0,1],[999999,2,4,0]],"path0to2":[0,1,2],"diameter":6}',
      '{"dist":[[0,3,5,6],[999999,0,2,3],[999999,3,0,1],[999999,2,4,0]],"path0to2":[0,3,1,2],"diameter":6}',
      '{"dist":[[0,3,5,7],[999999,0,2,3],[999999,3,0,1],[999999,2,4,0]],"path0to2":[0,1,2],"diameter":7}',
      '{"dist":[[0,3,5,6],[999999,0,2,3],[999999,3,0,1],[999999,2,4,0]],"path0to2":[0,1,2],"diameter":5}',
    ],
    correctOptionIndex: 0,
  },
  // 13. Polynomial evaluation and derivative
  {
    code: `function polynomialOps(coeffs, x) {
  const degree = coeffs.length - 1;
  let value = 0;
  for (let i = 0; i < coeffs.length; i++) {
    value += coeffs[i] * Math.pow(x, i);
  }
  const deriv = [];
  for (let i = 1; i < coeffs.length; i++) {
    deriv.push(coeffs[i] * i);
  }
  let derivValue = 0;
  for (let i = 0; i < deriv.length; i++) {
    derivValue += deriv[i] * Math.pow(x, i);
  }
  const integral = [0];
  for (let i = 0; i < coeffs.length; i++) {
    integral.push(Math.round((coeffs[i] / (i + 1)) * 10000) / 10000);
  }
  let integralAtX = 0;
  for (let i = 0; i < integral.length; i++) {
    integralAtX += integral[i] * Math.pow(x, i);
  }
  integralAtX = Math.round(integralAtX * 10000) / 10000;
  const secondDeriv = [];
  for (let i = 1; i < deriv.length; i++) {
    secondDeriv.push(deriv[i] * i);
  }
  let secondDerivValue = 0;
  for (let i = 0; i < secondDeriv.length; i++) {
    secondDerivValue += secondDeriv[i] * Math.pow(x, i);
  }
  return JSON.stringify({
    value: value,
    derivative: derivValue,
    secondDerivative: secondDerivValue,
    integralAtX: integralAtX,
    degree: degree
  });
}`,
    language: "javascript",
    inputDescription: "Coefficients [2, -3, 1] (= 2 - 3x + x^2), x = 3",
    inputValue: "[2, -3, 1], 3",
    expectedOutput: '{"value":2,"derivative":3,"secondDerivative":2,"integralAtX":1.4991,"degree":2}',
    options: [
      '{"value":2,"derivative":3,"secondDerivative":2,"integralAtX":1.4991,"degree":2}',
      '{"value":2,"derivative":3,"secondDerivative":2,"integralAtX":2.5,"degree":2}',
      '{"value":2,"derivative":6,"secondDerivative":2,"integralAtX":1.4991,"degree":2}',
      '{"value":11,"derivative":3,"secondDerivative":2,"integralAtX":1.4991,"degree":2}',
    ],
    correctOptionIndex: 0,
  },
  // 14. Kadane's algorithm extended with subarray tracking
  {
    code: `function maxSubarrayAnalysis(arr) {
  let maxSum = arr[0];
  let currentSum = arr[0];
  let start = 0, end = 0, tempStart = 0;
  for (let i = 1; i < arr.length; i++) {
    if (currentSum + arr[i] < arr[i]) {
      currentSum = arr[i];
      tempStart = i;
    } else {
      currentSum = currentSum + arr[i];
    }
    if (currentSum > maxSum) {
      maxSum = currentSum;
      start = tempStart;
      end = i;
    }
  }
  const subarray = arr.slice(start, end + 1);
  let minSum = arr[0];
  let curMin = arr[0];
  for (let i = 1; i < arr.length; i++) {
    curMin = Math.min(arr[i], curMin + arr[i]);
    minSum = Math.min(minSum, curMin);
  }
  const totalSum = arr.reduce((a, b) => a + b, 0);
  const maxCircular = Math.max(maxSum, totalSum - minSum);
  const average = Math.round((maxSum / subarray.length) * 1000) / 1000;
  return JSON.stringify({
    maxSum: maxSum,
    subarray: subarray,
    start: start,
    end: end,
    maxCircular: maxCircular,
    avgOfMax: average
  });
}`,
    language: "javascript",
    inputDescription: "Array: [-2, 1, -3, 4, -1, 2, 1, -5, 4]",
    inputValue: "[-2, 1, -3, 4, -1, 2, 1, -5, 4]",
    expectedOutput: '{"maxSum":6,"subarray":[4,-1,2,1],"start":3,"end":6,"maxCircular":6,"avgOfMax":1.5}',
    options: [
      '{"maxSum":6,"subarray":[4,-1,2,1],"start":3,"end":6,"maxCircular":6,"avgOfMax":1.5}',
      '{"maxSum":6,"subarray":[4,-1,2,1],"start":3,"end":6,"maxCircular":7,"avgOfMax":1.5}',
      '{"maxSum":7,"subarray":[4,-1,2,1,4],"start":3,"end":8,"maxCircular":7,"avgOfMax":2}',
      '{"maxSum":6,"subarray":[4,-1,2,1],"start":3,"end":6,"maxCircular":6,"avgOfMax":2}',
    ],
    correctOptionIndex: 0,
  },
  // 15. Radix sort with bucket history
  {
    code: `function radixSortAnalysis(arr) {
  if (arr.length === 0) return JSON.stringify({ sorted: [], passes: 0, bucketHistory: [] });
  const max = Math.max(...arr);
  let divisor = 1;
  const sorted = arr.slice();
  const bucketHistory = [];
  let passes = 0;
  while (Math.floor(max / divisor) > 0) {
    const buckets = Array(10).fill(null).map(() => []);
    for (const num of sorted) {
      const digit = Math.floor(num / divisor) % 10;
      buckets[digit].push(num);
    }
    const bucketSizes = buckets.map(b => b.length);
    bucketHistory.push(bucketSizes);
    let idx = 0;
    for (let d = 0; d < 10; d++) {
      for (const num of buckets[d]) {
        sorted[idx] = num;
        idx++;
      }
    }
    divisor *= 10;
    passes++;
  }
  let isSorted = true;
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] < sorted[i - 1]) {
      isSorted = false;
      break;
    }
  }
  return JSON.stringify({
    sorted: sorted,
    passes: passes,
    bucketHistory: bucketHistory,
    isSorted: isSorted
  });
}`,
    language: "javascript",
    inputDescription: "Array: [170, 45, 75, 90, 802, 24, 2, 66]",
    inputValue: "[170, 45, 75, 90, 802, 24, 2, 66]",
    expectedOutput: '{"sorted":[2,24,45,66,75,90,170,802],"passes":3,"bucketHistory":[[2,0,2,0,1,2,1,0,0,0],[2,0,1,0,1,0,1,2,0,1],[6,1,0,0,0,0,0,0,1,0]],"isSorted":true}',
    options: [
      '{"sorted":[2,24,45,66,75,90,170,802],"passes":3,"bucketHistory":[[2,0,2,0,1,2,1,0,0,0],[2,0,1,0,1,0,1,2,0,1],[6,1,0,0,0,0,0,0,1,0]],"isSorted":true}',
      '{"sorted":[2,24,45,66,75,90,170,802],"passes":3,"bucketHistory":[[2,0,2,0,1,2,1,0,0,0],[2,0,1,0,1,0,1,2,0,1],[6,1,0,0,0,0,0,0,1,0]],"isSorted":false}',
      '{"sorted":[2,24,45,66,75,90,170,802],"passes":4,"bucketHistory":[[2,0,2,0,1,2,1,0,0,0],[2,0,1,0,1,0,1,2,0,1],[6,1,0,0,0,0,0,0,1,0],[8,0,0,0,0,0,0,0,0,0]],"isSorted":true}',
      '{"sorted":[2,24,45,66,75,90,170,802],"passes":3,"bucketHistory":[[2,0,2,0,1,2,1,0,0,0],[1,0,2,0,1,0,1,2,0,1],[6,1,0,0,0,0,0,0,1,0]],"isSorted":true}',
    ],
    correctOptionIndex: 0,
  },
  // 16. Balanced parentheses with multiple bracket types
  {
    code: `function bracketAnalysis(input) {
  const stack = [];
  const openBrackets = { '(': ')', '[': ']', '{': '}' };
  const closeBrackets = { ')': '(', ']': '[', '}': '{' };
  let maxDepth = 0;
  let currentDepth = 0;
  const errors = [];
  const depthHistory = [];
  let totalPairs = 0;
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (ch in openBrackets) {
      stack.push({ char: ch, index: i });
      currentDepth++;
      if (currentDepth > maxDepth) maxDepth = currentDepth;
      depthHistory.push(currentDepth);
    } else if (ch in closeBrackets) {
      if (stack.length === 0) {
        errors.push({ type: "unmatched-close", char: ch, index: i });
      } else if (openBrackets[stack[stack.length - 1].char] !== ch) {
        errors.push({
          type: "mismatch",
          expected: openBrackets[stack[stack.length - 1].char],
          got: ch,
          index: i
        });
        stack.pop();
        currentDepth--;
      } else {
        stack.pop();
        totalPairs++;
        currentDepth--;
      }
      depthHistory.push(currentDepth);
    }
  }
  while (stack.length > 0) {
    const item = stack.pop();
    errors.push({ type: "unmatched-open", char: item.char, index: item.index });
  }
  return JSON.stringify({
    isValid: errors.length === 0,
    maxDepth: maxDepth,
    totalPairs: totalPairs,
    errorCount: errors.length,
    depthHistory: depthHistory
  });
}`,
    language: "javascript",
    inputDescription: 'Bracket string: "{[()()]}"',
    inputValue: '"{[()()]}"',
    expectedOutput: '{"isValid":true,"maxDepth":3,"totalPairs":4,"errorCount":0,"depthHistory":[1,2,3,2,3,2,1,0]}',
    options: [
      '{"isValid":true,"maxDepth":3,"totalPairs":4,"errorCount":0,"depthHistory":[1,2,3,2,3,2,1,0]}',
      '{"isValid":true,"maxDepth":4,"totalPairs":4,"errorCount":0,"depthHistory":[1,2,3,2,3,2,1,0]}',
      '{"isValid":true,"maxDepth":3,"totalPairs":4,"errorCount":0,"depthHistory":[1,2,3,4,3,2,1,0]}',
      '{"isValid":true,"maxDepth":3,"totalPairs":3,"errorCount":0,"depthHistory":[1,2,3,2,3,2,1,0]}',
    ],
    correctOptionIndex: 0,
  },
  // 17. String pattern matching (KMP algorithm)
  {
    code: `function kmpSearch(text, pattern) {
  function buildLPS(pat) {
    const lps = new Array(pat.length).fill(0);
    let len = 0;
    let i = 1;
    while (i < pat.length) {
      if (pat[i] === pat[len]) {
        len++;
        lps[i] = len;
        i++;
      } else {
        if (len !== 0) {
          len = lps[len - 1];
        } else {
          lps[i] = 0;
          i++;
        }
      }
    }
    return lps;
  }
  const lps = buildLPS(pattern);
  const matches = [];
  let i = 0, j = 0;
  let totalComparisons = 0;
  while (i < text.length) {
    totalComparisons++;
    if (text[i] === pattern[j]) {
      i++;
      j++;
    }
    if (j === pattern.length) {
      matches.push(i - j);
      j = lps[j - 1];
    } else if (i < text.length && text[i] !== pattern[j]) {
      if (j !== 0) {
        j = lps[j - 1];
      } else {
        i++;
      }
    }
  }
  return JSON.stringify({
    matches: matches,
    count: matches.length,
    lpsArray: lps,
    comparisons: totalComparisons
  });
}`,
    language: "javascript",
    inputDescription: 'text="ABABDABACDABABCABAB", pattern="ABABCABAB"',
    inputValue: '"ABABDABACDABABCABAB", "ABABCABAB"',
    expectedOutput: '{"matches":[10],"count":1,"lpsArray":[0,0,1,2,0,1,2,3,4],"comparisons":21}',
    options: [
      '{"matches":[10],"count":1,"lpsArray":[0,0,1,2,0,1,2,3,4],"comparisons":21}',
      '{"matches":[10],"count":1,"lpsArray":[0,0,1,2,0,1,2,3,4],"comparisons":19}',
      '{"matches":[10],"count":1,"lpsArray":[0,1,0,1,0,0,1,0,1],"comparisons":21}',
      '{"matches":[9,10],"count":2,"lpsArray":[0,0,1,2,0,1,2,3,4],"comparisons":21}',
    ],
    correctOptionIndex: 0,
  },
  // 18. Sparse matrix multiplication
  {
    code: `function sparseMatMul(matA, rowsA, colsA, matB, rowsB, colsB) {
  const sparseA = {};
  for (let i = 0; i < rowsA; i++) {
    for (let j = 0; j < colsA; j++) {
      if (matA[i][j] !== 0) {
        if (!sparseA[i]) sparseA[i] = {};
        sparseA[i][j] = matA[i][j];
      }
    }
  }
  const sparseB = {};
  for (let i = 0; i < rowsB; i++) {
    for (let j = 0; j < colsB; j++) {
      if (matB[i][j] !== 0) {
        if (!sparseB[i]) sparseB[i] = {};
        sparseB[i][j] = matB[i][j];
      }
    }
  }
  const result = Array(rowsA).fill(null).map(() => Array(colsB).fill(0));
  let multiplications = 0;
  for (const i in sparseA) {
    for (const k in sparseA[i]) {
      if (sparseB[k]) {
        for (const j in sparseB[k]) {
          result[i][j] += sparseA[i][k] * sparseB[k][j];
          multiplications++;
        }
      }
    }
  }
  let nonZeroCount = 0;
  for (let i = 0; i < rowsA; i++) {
    for (let j = 0; j < colsB; j++) {
      if (result[i][j] !== 0) nonZeroCount++;
    }
  }
  const density = Math.round((nonZeroCount / (rowsA * colsB)) * 1000) / 1000;
  return JSON.stringify({
    result: result,
    multiplications: multiplications,
    nonZeroCount: nonZeroCount,
    density: density
  });
}`,
    language: "javascript",
    inputDescription: "Two 3x3 matrices with sparse entries",
    inputValue: "[[1,0,2],[0,3,0],[0,0,4]], 3, 3, [[0,1,0],[5,0,0],[0,0,3]], 3, 3",
    expectedOutput: '{"result":[[0,1,6],[15,0,0],[0,0,12]],"multiplications":4,"nonZeroCount":4,"density":0.444}',
    options: [
      '{"result":[[0,1,6],[15,0,0],[0,0,12]],"multiplications":4,"nonZeroCount":4,"density":0.444}',
      '{"result":[[0,1,6],[15,0,0],[0,0,12]],"multiplications":6,"nonZeroCount":4,"density":0.444}',
      '{"result":[[0,1,6],[15,0,0],[0,0,12]],"multiplications":4,"nonZeroCount":3,"density":0.333}',
      '{"result":[[0,1,2],[15,0,0],[0,0,12]],"multiplications":4,"nonZeroCount":4,"density":0.444}',
    ],
    correctOptionIndex: 0,
  },
  // 19. Coin change with path reconstruction
  {
    code: `function coinChangeAnalysis(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  const usedCoin = new Array(amount + 1).fill(-1);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i && dp[i - coin] + 1 < dp[i]) {
        dp[i] = dp[i - coin] + 1;
        usedCoin[i] = coin;
      }
    }
  }
  if (dp[amount] === Infinity) {
    return JSON.stringify({ minCoins: -1, coins: [], breakdown: {} });
  }
  const selected = [];
  let remaining = amount;
  while (remaining > 0) {
    selected.push(usedCoin[remaining]);
    remaining -= usedCoin[remaining];
  }
  selected.sort((a, b) => a - b);
  const breakdown = {};
  for (const c of selected) {
    breakdown[c] = (breakdown[c] || 0) + 1;
  }
  const ways = new Array(amount + 1).fill(0);
  ways[0] = 1;
  for (const coin of coins) {
    for (let i = coin; i <= amount; i++) {
      ways[i] += ways[i - coin];
    }
  }
  return JSON.stringify({
    minCoins: dp[amount],
    coins: selected,
    breakdown: breakdown,
    totalWays: ways[amount]
  });
}`,
    language: "javascript",
    inputDescription: "coins=[1, 5, 10, 25], amount=36",
    inputValue: "[1, 5, 10, 25], 36",
    expectedOutput: '{"minCoins":3,"coins":[1,10,25],"breakdown":{"1":1,"10":1,"25":1},"totalWays":24}',
    options: [
      '{"minCoins":3,"coins":[1,10,25],"breakdown":{"1":1,"10":1,"25":1},"totalWays":24}',
      '{"minCoins":3,"coins":[1,10,25],"breakdown":{"1":1,"10":1,"25":1},"totalWays":20}',
      '{"minCoins":4,"coins":[1,5,5,25],"breakdown":{"1":1,"5":2,"25":1},"totalWays":24}',
      '{"minCoins":3,"coins":[1,10,25],"breakdown":{"1":1,"10":1,"25":1},"totalWays":36}',
    ],
    correctOptionIndex: 0,
  },
  // 20. Depth-first search with connected components analysis
  {
    code: `function connectedComponents(n, edges) {
  const adj = Array(n).fill(null).map(() => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }
  const visited = new Array(n).fill(false);
  const componentOf = new Array(n).fill(-1);
  const components = [];
  let componentId = 0;
  function dfs(node, comp) {
    visited[node] = true;
    componentOf[node] = comp;
    const members = [node];
    const stack = [node];
    while (stack.length > 0) {
      const curr = stack.pop();
      for (const neighbor of adj[curr]) {
        if (!visited[neighbor]) {
          visited[neighbor] = true;
          componentOf[neighbor] = comp;
          members.push(neighbor);
          stack.push(neighbor);
        }
      }
    }
    return members.sort((a, b) => a - b);
  }
  for (let i = 0; i < n; i++) {
    if (!visited[i]) {
      const members = dfs(i, componentId);
      components.push(members);
      componentId++;
    }
  }
  const sizes = components.map(c => c.length).sort((a, b) => b - a);
  const largestComponent = components.reduce((max, c) => c.length > max.length ? c : max, []);
  let totalEdgesInLargest = 0;
  for (const node of largestComponent) {
    for (const neighbor of adj[node]) {
      if (componentOf[neighbor] === componentOf[largestComponent[0]]) {
        totalEdgesInLargest++;
      }
    }
  }
  totalEdgesInLargest = totalEdgesInLargest / 2;
  return JSON.stringify({
    count: components.length,
    sizes: sizes,
    largest: largestComponent,
    edgesInLargest: totalEdgesInLargest
  });
}`,
    language: "javascript",
    inputDescription: "n=7 nodes, edges as pairs",
    inputValue: "7, [[0,1],[1,2],[2,0],[3,4],[5,6]]",
    expectedOutput: '{"count":3,"sizes":[3,2,2],"largest":[0,1,2],"edgesInLargest":3}',
    options: [
      '{"count":3,"sizes":[3,2,2],"largest":[0,1,2],"edgesInLargest":3}',
      '{"count":3,"sizes":[3,2,2],"largest":[0,1,2],"edgesInLargest":2}',
      '{"count":2,"sizes":[3,4],"largest":[3,4,5,6],"edgesInLargest":2}',
      '{"count":3,"sizes":[2,2,3],"largest":[0,1,2],"edgesInLargest":3}',
    ],
    correctOptionIndex: 0,
  },
];
