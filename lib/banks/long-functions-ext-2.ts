import type { LongFunctionTemplate } from "./code-templates";

export const LONG_FUNCTIONS_EXT_2: LongFunctionTemplate[] = [
  // ── 1. Interval Scheduling (Greedy) ──────────────────────────────────────
  {
    code: `function intervalSchedule(intervals) {
  const sorted = intervals.slice().sort((a, b) => {
    if (a[1] !== b[1]) return a[1] - b[1];
    return a[0] - b[0];
  });
  const selected = [sorted[0]];
  let lastEnd = sorted[0][1];
  let rejected = 0;
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i][0] >= lastEnd) {
      selected.push(sorted[i]);
      lastEnd = sorted[i][1];
    } else {
      rejected++;
    }
  }
  let totalCoverage = 0;
  for (let i = 0; i < selected.length; i++) {
    totalCoverage += selected[i][1] - selected[i][0];
  }
  let maxGap = 0;
  for (let i = 1; i < selected.length; i++) {
    const gap = selected[i][0] - selected[i - 1][1];
    if (gap > maxGap) maxGap = gap;
  }
  return JSON.stringify({
    selected,
    count: selected.length,
    rejected,
    totalCoverage,
    maxGap
  });
}`,
    language: "javascript",
    inputDescription: "Array of intervals: [[1,3],[2,5],[4,7],[6,9],[8,10]]",
    inputValue: "[[1,3],[2,5],[4,7],[6,9],[8,10]]",
    expectedOutput: '{"selected":[[1,3],[4,7],[8,10]],"count":3,"rejected":2,"totalCoverage":7,"maxGap":1}',
    options: [
      '{"selected":[[1,3],[4,7],[8,10]],"count":3,"rejected":2,"totalCoverage":7,"maxGap":1}',
      '{"selected":[[1,3],[2,5],[6,9]],"count":3,"rejected":2,"totalCoverage":8,"maxGap":1}',
      '{"selected":[[1,3],[4,7],[8,10]],"count":3,"rejected":2,"totalCoverage":9,"maxGap":1}',
      '{"selected":[[1,3],[4,7],[8,10]],"count":3,"rejected":2,"totalCoverage":7,"maxGap":2}',
    ],
    correctOptionIndex: 0,
  },

  // ── 2. 0/1 Knapsack ─────────────────────────────────────────────────────
  {
    code: `function knapsack01(capacity, items) {
  const n = items.length;
  const dp = Array(n + 1).fill(null).map(() =>
    Array(capacity + 1).fill(0)
  );
  for (let i = 1; i <= n; i++) {
    const w = items[i - 1][0];
    const v = items[i - 1][1];
    for (let j = 0; j <= capacity; j++) {
      dp[i][j] = dp[i - 1][j];
      if (j >= w && dp[i - 1][j - w] + v > dp[i][j]) {
        dp[i][j] = dp[i - 1][j - w] + v;
      }
    }
  }
  const chosen = [];
  let j = capacity;
  for (let i = n; i >= 1; i--) {
    if (dp[i][j] !== dp[i - 1][j]) {
      chosen.unshift(i - 1);
      j -= items[i - 1][0];
    }
  }
  let totalWeight = 0;
  for (const idx of chosen) {
    totalWeight += items[idx][0];
  }
  return JSON.stringify({
    maxValue: dp[n][capacity],
    chosenIndices: chosen,
    totalWeight,
    spaceLeft: capacity - totalWeight
  });
}`,
    language: "javascript",
    inputDescription: "capacity=10, items=[[2,6],[5,12],[3,8],[7,14],[4,10]]",
    inputValue: "capacity=10, items=[[2,6],[5,12],[3,8],[7,14],[4,10]]",
    expectedOutput: '{"maxValue":26,"chosenIndices":[0,1,2],"totalWeight":10,"spaceLeft":0}',
    options: [
      '{"maxValue":26,"chosenIndices":[0,1,2],"totalWeight":10,"spaceLeft":0}',
      '{"maxValue":28,"chosenIndices":[0,2,4],"totalWeight":9,"spaceLeft":1}',
      '{"maxValue":24,"chosenIndices":[1,4],"totalWeight":9,"spaceLeft":1}',
      '{"maxValue":26,"chosenIndices":[0,1,4],"totalWeight":11,"spaceLeft":-1}',
    ],
    correctOptionIndex: 0,
  },

  // ── 3. Huffman Encoding Simulation ───────────────────────────────────────
  {
    code: `function huffmanEncode(text) {
  const freq = {};
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    freq[ch] = (freq[ch] || 0) + 1;
  }
  const entries = Object.keys(freq).sort().map(ch => ({
    ch, freq: freq[ch], code: ""
  }));
  if (entries.length === 1) {
    entries[0].code = "0";
    return JSON.stringify({
      codes: { [entries[0].ch]: "0" },
      totalBits: entries[0].freq,
      originalBits: text.length * 8,
      saved: text.length * 7
    });
  }
  const heap = entries.map(e => ({
    freq: e.freq, leaves: [e]
  }));
  while (heap.length > 1) {
    heap.sort((a, b) => a.freq - b.freq);
    const left = heap.shift();
    const right = heap.shift();
    for (const leaf of left.leaves) leaf.code = "0" + leaf.code;
    for (const leaf of right.leaves) leaf.code = "1" + leaf.code;
    heap.push({
      freq: left.freq + right.freq,
      leaves: left.leaves.concat(right.leaves)
    });
  }
  const codes = {};
  const allLeaves = heap[0].leaves;
  allLeaves.sort((a, b) => a.ch.localeCompare(b.ch));
  for (const leaf of allLeaves) {
    codes[leaf.ch] = leaf.code;
  }
  let totalBits = 0;
  for (const leaf of allLeaves) {
    totalBits += leaf.freq * leaf.code.length;
  }
  const originalBits = text.length * 8;
  return JSON.stringify({
    codes,
    totalBits,
    originalBits,
    saved: originalBits - totalBits
  });
}`,
    language: "javascript",
    inputDescription: 'Text string: "aabbbcccc"',
    inputValue: '"aabbbcccc"',
    expectedOutput: '{"codes":{"a":"10","b":"11","c":"0"},"totalBits":14,"originalBits":72,"saved":58}',
    options: [
      '{"codes":{"a":"10","b":"11","c":"0"},"totalBits":14,"originalBits":72,"saved":58}',
      '{"codes":{"a":"00","b":"01","c":"1"},"totalBits":14,"originalBits":72,"saved":58}',
      '{"codes":{"a":"10","b":"11","c":"0"},"totalBits":16,"originalBits":72,"saved":56}',
      '{"codes":{"a":"10","b":"11","c":"0"},"totalBits":14,"originalBits":64,"saved":50}',
    ],
    correctOptionIndex: 0,
  },

  // ── 4. RSA-like Modular Exponentiation ───────────────────────────────────
  {
    code: `function modPow(base, exp, mod) {
  let result = 1;
  base = base % mod;
  if (base === 0) {
    return JSON.stringify({
      result: 0,
      steps: 0,
      intermediates: [],
      modInverse: 0
    });
  }
  let steps = 0;
  const intermediates = [];
  let b = base;
  let e = exp;
  while (e > 0) {
    if (e % 2 === 1) {
      result = (result * b) % mod;
      intermediates.push(result);
    }
    e = Math.floor(e / 2);
    if (e > 0) {
      b = (b * b) % mod;
    }
    steps++;
  }
  function modPowHelper(base2, exp2, mod2) {
    let r = 1;
    let bb = base2 % mod2;
    while (exp2 > 0) {
      if (exp2 % 2 === 1) r = (r * bb) % mod2;
      exp2 = Math.floor(exp2 / 2);
      bb = (bb * bb) % mod2;
    }
    return r;
  }
  const totient = mod - 1;
  const inverse = modPowHelper(base, totient - 1, mod);
  return JSON.stringify({
    result,
    steps,
    intermediates,
    modInverse: inverse
  });
}`,
    language: "javascript",
    inputDescription: "base=7, exp=13, mod=23",
    inputValue: "base=7, exp=13, mod=23",
    expectedOutput: '{"result":20,"steps":4,"intermediates":[7,17,20],"modInverse":10}',
    options: [
      '{"result":20,"steps":4,"intermediates":[7,17,20],"modInverse":10}',
      '{"result":7,"steps":4,"intermediates":[7,3,20],"modInverse":10}',
      '{"result":20,"steps":13,"intermediates":[7,17,20],"modInverse":10}',
      '{"result":20,"steps":4,"intermediates":[7,17,20],"modInverse":13}',
    ],
    correctOptionIndex: 0,
  },

  // ── 5. Cellular Automaton (Rule 110) ─────────────────────────────────────
  {
    code: `function cellularAutomaton(initialState, rule, generations) {
  function applyRule(left, center, right, ruleNum) {
    const idx = (left << 2) | (center << 1) | right;
    return (ruleNum >> idx) & 1;
  }
  let current = initialState.slice();
  const width = current.length;
  const history = [current.slice()];
  let totalAlive = 0;
  for (let i = 0; i < current.length; i++) {
    totalAlive += current[i];
  }
  for (let gen = 0; gen < generations; gen++) {
    const next = new Array(width).fill(0);
    for (let i = 0; i < width; i++) {
      const left = i > 0 ? current[i - 1] : 0;
      const center = current[i];
      const right = i < width - 1 ? current[i + 1] : 0;
      next[i] = applyRule(left, center, right, rule);
    }
    current = next;
    history.push(current.slice());
    for (let i = 0; i < current.length; i++) {
      totalAlive += current[i];
    }
  }
  const finalAlive = current.reduce((s, v) => s + v, 0);
  return JSON.stringify({
    finalState: current,
    finalAlive,
    totalAlive,
    generations: history.length
  });
}`,
    language: "javascript",
    inputDescription: "initialState=[0,0,1,0,0,0,1,0], rule=110, generations=4",
    inputValue: "initialState=[0,0,1,0,0,0,1,0], rule=110, generations=4",
    expectedOutput: '{"finalState":[1,1,1,0,1,1,1,0],"finalAlive":6,"totalAlive":23,"generations":5}',
    options: [
      '{"finalState":[1,1,1,0,1,1,1,0],"finalAlive":6,"totalAlive":23,"generations":5}',
      '{"finalState":[1,1,0,0,1,1,1,0],"finalAlive":5,"totalAlive":22,"generations":5}',
      '{"finalState":[1,1,1,0,1,1,1,0],"finalAlive":6,"totalAlive":23,"generations":4}',
      '{"finalState":[1,1,1,1,1,1,1,0],"finalAlive":7,"totalAlive":25,"generations":5}',
    ],
    correctOptionIndex: 0,
  },

  // ── 6. Maze Solver (BFS) ─────────────────────────────────────────────────
  {
    code: `function solveMaze(maze, start, end) {
  const rows = maze.length;
  const cols = maze[0].length;
  const visited = Array(rows).fill(null).map(() =>
    Array(cols).fill(false)
  );
  const parent = Array(rows).fill(null).map(() =>
    Array(cols).fill(null)
  );
  const queue = [start];
  visited[start[0]][start[1]] = true;
  const dirs = [[0,1],[1,0],[0,-1],[-1,0]];
  const dirNames = ["R","D","L","U"];
  let explored = 0;
  let found = false;
  while (queue.length > 0) {
    const [r, c] = queue.shift();
    explored++;
    if (r === end[0] && c === end[1]) {
      found = true;
      break;
    }
    for (let d = 0; d < 4; d++) {
      const nr = r + dirs[d][0];
      const nc = c + dirs[d][1];
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
          && maze[nr][nc] === 0 && !visited[nr][nc]) {
        visited[nr][nc] = true;
        parent[nr][nc] = [r, c, dirNames[d]];
        queue.push([nr, nc]);
      }
    }
  }
  if (!found) {
    return JSON.stringify({
      path: [], directions: "", explored, pathLength: 0
    });
  }
  const path = [];
  const directions = [];
  let cr = end[0], cc = end[1];
  while (cr !== start[0] || cc !== start[1]) {
    path.unshift([cr, cc]);
    const p = parent[cr][cc];
    directions.unshift(p[2]);
    cr = p[0];
    cc = p[1];
  }
  path.unshift(start);
  return JSON.stringify({
    path,
    directions: directions.join(""),
    explored,
    pathLength: path.length
  });
}`,
    language: "javascript",
    inputDescription: "maze=[[0,0,1,0],[0,1,0,0],[0,0,0,1],[1,0,0,0]], start=[0,0], end=[3,3]",
    inputValue: "maze=[[0,0,1,0],[0,1,0,0],[0,0,0,1],[1,0,0,0]], start=[0,0], end=[3,3]",
    expectedOutput: '{"path":[[0,0],[1,0],[2,0],[2,1],[2,2],[3,2],[3,3]],"directions":"DDRRDR","explored":10,"pathLength":7}',
    options: [
      '{"path":[[0,0],[1,0],[2,0],[2,1],[2,2],[3,2],[3,3]],"directions":"DDRRDR","explored":10,"pathLength":7}',
      '{"path":[[0,0],[1,0],[2,0],[2,1],[2,2],[3,2],[3,3]],"directions":"DDRRDR","explored":8,"pathLength":7}',
      '{"path":[[0,0],[0,1],[1,1],[2,1],[2,2],[3,2],[3,3]],"directions":"RDDDDR","explored":10,"pathLength":7}',
      '{"path":[[0,0],[1,0],[2,0],[2,1],[2,2],[3,2],[3,3]],"directions":"DDRRDR","explored":10,"pathLength":6}',
    ],
    correctOptionIndex: 0,
  },

  // ── 7. Expression Parser (Recursive Descent) ────────────────────────────
  {
    code: `function parseExpression(expr) {
  let pos = 0;
  let evalCount = 0;
  function parseNum() {
    let sign = 1;
    if (pos < expr.length && expr[pos] === "-") {
      sign = -1;
      pos++;
    }
    let num = 0;
    while (pos < expr.length && expr[pos] >= "0"
           && expr[pos] <= "9") {
      num = num * 10 + parseInt(expr[pos]);
      pos++;
    }
    return sign * num;
  }
  function parseFactor() {
    if (pos < expr.length && expr[pos] === "(") {
      pos++;
      const val = parseExprLevel();
      pos++;
      return val;
    }
    return parseNum();
  }
  function parseTerm() {
    let val = parseFactor();
    while (pos < expr.length
           && (expr[pos] === "*" || expr[pos] === "/")) {
      const op = expr[pos];
      pos++;
      const right = parseFactor();
      evalCount++;
      if (op === "*") val *= right;
      else val = Math.trunc(val / right);
    }
    return val;
  }
  function parseExprLevel() {
    let val = parseTerm();
    while (pos < expr.length
           && (expr[pos] === "+" || expr[pos] === "-")) {
      const op = expr[pos];
      pos++;
      const right = parseTerm();
      evalCount++;
      if (op === "+") val += right;
      else val -= right;
    }
    return val;
  }
  const result = parseExprLevel();
  return JSON.stringify({ result, evalCount });
}`,
    language: "javascript",
    inputDescription: 'Expression: "(3+4)*2-5/(1+4)"',
    inputValue: '"(3+4)*2-5/(1+4)"',
    expectedOutput: '{"result":13,"evalCount":5}',
    options: [
      '{"result":13,"evalCount":5}',
      '{"result":13,"evalCount":4}',
      '{"result":14,"evalCount":5}',
      '{"result":13,"evalCount":6}',
    ],
    correctOptionIndex: 0,
  },

  // ── 8. State Machine Simulation ──────────────────────────────────────────
  {
    code: `function simulateStateMachine(transitions, start, accepts, input) {
  let current = start;
  const stateHistory = [current];
  let accepted = false;
  let transitionCount = 0;
  const visitedStates = new Set();
  visitedStates.add(current);
  let deadEndReached = false;
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    const key = current + "," + ch;
    if (transitions[key] !== undefined) {
      current = transitions[key];
      stateHistory.push(current);
      visitedStates.add(current);
      transitionCount++;
    } else {
      deadEndReached = true;
      break;
    }
  }
  if (!deadEndReached) {
    accepted = accepts.indexOf(current) !== -1;
  }
  const uniqueStates = Array.from(visitedStates).sort();
  return JSON.stringify({
    finalState: current,
    accepted,
    transitionCount,
    stateHistory,
    uniqueStates
  });
}`,
    language: "javascript",
    inputDescription: 'transitions={"q0,a":"q1","q0,b":"q0","q1,a":"q2","q1,b":"q0","q2,a":"q2","q2,b":"q3","q3,a":"q2","q3,b":"q0"}, start="q0", accepts=["q3"], input="aab"',
    inputValue: 'transitions={"q0,a":"q1","q0,b":"q0","q1,a":"q2","q1,b":"q0","q2,a":"q2","q2,b":"q3","q3,a":"q2","q3,b":"q0"}, start="q0", accepts=["q3"], input="aab"',
    expectedOutput: '{"finalState":"q3","accepted":true,"transitionCount":3,"stateHistory":["q0","q1","q2","q3"],"uniqueStates":["q0","q1","q2","q3"]}',
    options: [
      '{"finalState":"q3","accepted":true,"transitionCount":3,"stateHistory":["q0","q1","q2","q3"],"uniqueStates":["q0","q1","q2","q3"]}',
      '{"finalState":"q2","accepted":false,"transitionCount":3,"stateHistory":["q0","q1","q2","q2"],"uniqueStates":["q0","q1","q2"]}',
      '{"finalState":"q3","accepted":true,"transitionCount":3,"stateHistory":["q0","q1","q2","q3"],"uniqueStates":["q0","q1","q3"]}',
      '{"finalState":"q3","accepted":false,"transitionCount":2,"stateHistory":["q0","q1","q3"],"uniqueStates":["q0","q1","q3"]}',
    ],
    correctOptionIndex: 0,
  },

  // ── 9. Convex Hull (Graham Scan) ─────────────────────────────────────────
  {
    code: `function convexHull(points) {
  function cross(O, A, B) {
    return (A[0] - O[0]) * (B[1] - O[1])
         - (A[1] - O[1]) * (B[0] - O[0]);
  }
  const pts = points.slice().sort((a, b) => {
    if (a[0] !== b[0]) return a[0] - b[0];
    return a[1] - b[1];
  });
  const n = pts.length;
  if (n <= 2) {
    return JSON.stringify({
      hull: pts, perimeter: 0, area: 0
    });
  }
  const lower = [];
  for (let i = 0; i < n; i++) {
    while (lower.length >= 2
           && cross(lower[lower.length - 2],
                    lower[lower.length - 1], pts[i]) <= 0) {
      lower.pop();
    }
    lower.push(pts[i]);
  }
  const upper = [];
  for (let i = n - 1; i >= 0; i--) {
    while (upper.length >= 2
           && cross(upper[upper.length - 2],
                    upper[upper.length - 1], pts[i]) <= 0) {
      upper.pop();
    }
    upper.push(pts[i]);
  }
  lower.pop();
  upper.pop();
  const hull = lower.concat(upper);
  let area = 0;
  for (let i = 0; i < hull.length; i++) {
    const j = (i + 1) % hull.length;
    area += hull[i][0] * hull[j][1];
    area -= hull[j][0] * hull[i][1];
  }
  area = Math.abs(area) / 2;
  let perimeter = 0;
  for (let i = 0; i < hull.length; i++) {
    const j = (i + 1) % hull.length;
    const dx = hull[j][0] - hull[i][0];
    const dy = hull[j][1] - hull[i][1];
    perimeter += Math.sqrt(dx * dx + dy * dy);
  }
  perimeter = Math.round(perimeter * 100) / 100;
  return JSON.stringify({ hull, area, perimeter });
}`,
    language: "javascript",
    inputDescription: "points=[[0,0],[1,1],[2,0],[1,2],[0,2]]",
    inputValue: "[[0,0],[1,1],[2,0],[1,2],[0,2]]",
    expectedOutput: '{"hull":[[0,0],[2,0],[1,2],[0,2]],"area":3,"perimeter":7.24}',
    options: [
      '{"hull":[[0,0],[2,0],[1,2],[0,2]],"area":3,"perimeter":7.24}',
      '{"hull":[[0,0],[2,0],[1,2],[0,2]],"area":4,"perimeter":7.24}',
      '{"hull":[[0,0],[1,1],[2,0],[1,2],[0,2]],"area":3,"perimeter":8.47}',
      '{"hull":[[0,0],[2,0],[1,2],[0,2]],"area":3,"perimeter":6.83}',
    ],
    correctOptionIndex: 0,
  },

  // ── 10. Topological Sort (Kahn's Algorithm) ──────────────────────────────
  {
    code: `function topologicalSort(graph) {
  const nodes = Object.keys(graph).sort();
  const inDegree = {};
  for (const node of nodes) {
    inDegree[node] = 0;
  }
  for (const node of nodes) {
    for (const neighbor of graph[node]) {
      inDegree[neighbor] = (inDegree[neighbor] || 0) + 1;
    }
  }
  const queue = [];
  for (const node of nodes) {
    if (inDegree[node] === 0) {
      queue.push(node);
    }
  }
  queue.sort();
  const result = [];
  let processed = 0;
  while (queue.length > 0) {
    const node = queue.shift();
    result.push(node);
    processed++;
    for (const neighbor of graph[node]) {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
        queue.sort();
      }
    }
  }
  const hasCycle = processed !== nodes.length;
  const levels = {};
  if (!hasCycle) {
    const dist = {};
    for (const node of result) {
      dist[node] = 0;
    }
    for (const node of result) {
      for (const neighbor of graph[node]) {
        if (dist[node] + 1 > dist[neighbor]) {
          dist[neighbor] = dist[node] + 1;
        }
      }
    }
    for (const node of result) {
      const lv = dist[node];
      if (!levels[lv]) levels[lv] = [];
      levels[lv].push(node);
    }
  }
  return JSON.stringify({
    order: result,
    hasCycle,
    levels
  });
}`,
    language: "javascript",
    inputDescription: 'graph={ A:["C"], B:["C","D"], C:["E"], D:["E"], E:[] }',
    inputValue: '{ A:["C"], B:["C","D"], C:["E"], D:["E"], E:[] }',
    expectedOutput: '{"order":["A","B","C","D","E"],"hasCycle":false,"levels":{"0":["A","B"],"1":["C","D"],"2":["E"]}}',
    options: [
      '{"order":["A","B","C","D","E"],"hasCycle":false,"levels":{"0":["A","B"],"1":["C","D"],"2":["E"]}}',
      '{"order":["B","A","D","C","E"],"hasCycle":false,"levels":{"0":["A","B"],"1":["C","D"],"2":["E"]}}',
      '{"order":["A","B","C","D","E"],"hasCycle":true,"levels":{}}',
      '{"order":["A","B","C","D","E"],"hasCycle":false,"levels":{"0":["A","B"],"1":["C"],"2":["D"],"3":["E"]}}',
    ],
    correctOptionIndex: 0,
  },

  // ── 11. Bloom Filter Simulation ──────────────────────────────────────────
  {
    code: `function bloomFilter(size, items, queries) {
  const bits = new Array(size).fill(0);
  function hash1(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (h * 31 + str.charCodeAt(i)) % size;
    }
    return h;
  }
  function hash2(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (h * 37 + str.charCodeAt(i)) % size;
    }
    return h;
  }
  function hash3(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (h * 41 + str.charCodeAt(i)) % size;
    }
    return h;
  }
  let bitsSet = 0;
  for (const item of items) {
    const h = [hash1(item), hash2(item), hash3(item)];
    for (const idx of h) {
      if (bits[idx] === 0) {
        bits[idx] = 1;
        bitsSet++;
      }
    }
  }
  const results = [];
  let positives = 0;
  for (const q of queries) {
    const h = [hash1(q), hash2(q), hash3(q)];
    const maybe = h.every(idx => bits[idx] === 1);
    results.push(maybe ? "maybe" : "no");
    if (maybe) positives++;
  }
  return JSON.stringify({
    bitsSet,
    fillRatio: Math.round(bitsSet / size * 100),
    results,
    positives
  });
}`,
    language: "javascript",
    inputDescription: 'size=16, items=["cat","dog","bird"], queries=["cat","fish","dog","ant"]',
    inputValue: 'size=16, items=["cat","dog","bird"], queries=["cat","fish","dog","ant"]',
    expectedOutput: '{"bitsSet":7,"fillRatio":44,"results":["maybe","no","maybe","no"],"positives":2}',
    options: [
      '{"bitsSet":7,"fillRatio":44,"results":["maybe","no","maybe","no"],"positives":2}',
      '{"bitsSet":9,"fillRatio":56,"results":["maybe","maybe","maybe","no"],"positives":3}',
      '{"bitsSet":7,"fillRatio":44,"results":["maybe","no","maybe","maybe"],"positives":3}',
      '{"bitsSet":7,"fillRatio":44,"results":["maybe","no","maybe","no"],"positives":3}',
    ],
    correctOptionIndex: 0,
  },

  // ── 12. LRU Cache Implementation ─────────────────────────────────────────
  {
    code: `function lruCache(capacity, operations) {
  const cache = new Map();
  let hits = 0;
  let misses = 0;
  const evictions = [];
  function get(key) {
    if (cache.has(key)) {
      const val = cache.get(key);
      cache.delete(key);
      cache.set(key, val);
      hits++;
      return val;
    }
    misses++;
    return -1;
  }
  function put(key, value) {
    if (cache.has(key)) {
      cache.delete(key);
    } else if (cache.size >= capacity) {
      const oldest = cache.keys().next().value;
      evictions.push(oldest);
      cache.delete(oldest);
    }
    cache.set(key, value);
  }
  const results = [];
  for (const op of operations) {
    if (op[0] === "get") {
      results.push(get(op[1]));
    } else {
      put(op[1], op[2]);
    }
  }
  const finalKeys = Array.from(cache.keys());
  return JSON.stringify({
    results,
    hits,
    misses,
    evictions,
    finalKeys
  });
}`,
    language: "javascript",
    inputDescription: 'capacity=2, operations=[["put",1,10],["put",2,20],["get",1],["put",3,30],["get",2],["get",3]]',
    inputValue: 'capacity=2, operations=[["put",1,10],["put",2,20],["get",1],["put",3,30],["get",2],["get",3]]',
    expectedOutput: '{"results":[10,-1,30],"hits":2,"misses":1,"evictions":[2],"finalKeys":[1,3]}',
    options: [
      '{"results":[10,-1,30],"hits":2,"misses":1,"evictions":[2],"finalKeys":[1,3]}',
      '{"results":[10,20,30],"hits":3,"misses":0,"evictions":[],"finalKeys":[2,3]}',
      '{"results":[10,-1,30],"hits":2,"misses":1,"evictions":[1],"finalKeys":[2,3]}',
      '{"results":[10,-1,30],"hits":2,"misses":1,"evictions":[2],"finalKeys":[3,1]}',
    ],
    correctOptionIndex: 0,
  },

  // ── 13. Levenshtein Distance with Backtrace ─────────────────────────────
  {
    code: `function levenshtein(source, target) {
  const m = source.length;
  const n = target.length;
  const dp = Array(m + 1).fill(null).map(() =>
    Array(n + 1).fill(0)
  );
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (source[i - 1] === target[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],
          dp[i][j - 1],
          dp[i - 1][j - 1]
        );
      }
    }
  }
  const ops = [];
  let i = m, j = n;
  let matches = 0;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0
        && source[i - 1] === target[j - 1]) {
      matches++;
      i--; j--;
    } else if (i > 0 && j > 0
               && dp[i][j] === dp[i - 1][j - 1] + 1) {
      ops.unshift("sub " + source[i - 1] + "->" + target[j - 1]);
      i--; j--;
    } else if (j > 0
               && dp[i][j] === dp[i][j - 1] + 1) {
      ops.unshift("ins " + target[j - 1]);
      j--;
    } else {
      ops.unshift("del " + source[i - 1]);
      i--;
    }
  }
  return JSON.stringify({
    distance: dp[m][n],
    operations: ops,
    matches
  });
}`,
    language: "javascript",
    inputDescription: 'source="abc", target="aec"',
    inputValue: 'source="abc", target="aec"',
    expectedOutput: '{"distance":1,"operations":["sub b->e"],"matches":2}',
    options: [
      '{"distance":1,"operations":["sub b->e"],"matches":2}',
      '{"distance":2,"operations":["del b","ins e"],"matches":2}',
      '{"distance":1,"operations":["sub b->e"],"matches":1}',
      '{"distance":1,"operations":["ins e"],"matches":2}',
    ],
    correctOptionIndex: 0,
  },

  // ── 14. Longest Common Subsequence ───────────────────────────────────────
  {
    code: `function longestCommonSubsequence(s1, s2) {
  const m = s1.length;
  const n = s2.length;
  const dp = Array(m + 1).fill(null).map(() =>
    Array(n + 1).fill(0)
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  let lcs = "";
  let i = m, j = n;
  while (i > 0 && j > 0) {
    if (s1[i - 1] === s2[j - 1]) {
      lcs = s1[i - 1] + lcs;
      i--; j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }
  const lcsLen = dp[m][n];
  const similarity = Math.round(
    (2 * lcsLen / (m + n)) * 100
  );
  const onlyInS1 = [];
  const onlyInS2 = [];
  let li = 0;
  for (let k = 0; k < s1.length; k++) {
    if (li < lcs.length && s1[k] === lcs[li]) {
      li++;
    } else {
      onlyInS1.push(s1[k]);
    }
  }
  li = 0;
  for (let k = 0; k < s2.length; k++) {
    if (li < lcs.length && s2[k] === lcs[li]) {
      li++;
    } else {
      onlyInS2.push(s2[k]);
    }
  }
  return JSON.stringify({
    lcs,
    length: lcsLen,
    similarity,
    onlyInS1,
    onlyInS2
  });
}`,
    language: "javascript",
    inputDescription: 's1="ABCBDAB", s2="BDCAB"',
    inputValue: 's1="ABCBDAB", s2="BDCAB"',
    expectedOutput: '{"lcs":"BDAB","length":4,"similarity":67,"onlyInS1":["A","C","B"],"onlyInS2":["C"]}',
    options: [
      '{"lcs":"BDAB","length":4,"similarity":67,"onlyInS1":["A","C","B"],"onlyInS2":["C"]}',
      '{"lcs":"BCAB","length":4,"similarity":67,"onlyInS1":["A","D"],"onlyInS2":["D"]}',
      '{"lcs":"BDAB","length":4,"similarity":50,"onlyInS1":["A","C","B"],"onlyInS2":["C"]}',
      '{"lcs":"BDA","length":3,"similarity":50,"onlyInS1":["A","C","B","B"],"onlyInS2":["C","B"]}',
    ],
    correctOptionIndex: 0,
  },

  // ── 15. Run-Length Encoding / Decoding ───────────────────────────────────
  {
    code: `function runLengthCodec(input, mode) {
  function encode(str) {
    if (str.length === 0) return "";
    let encoded = "";
    let count = 1;
    let maxRun = 1;
    let totalRuns = 1;
    for (let i = 1; i < str.length; i++) {
      if (str[i] === str[i - 1]) {
        count++;
      } else {
        encoded += count + str[i - 1];
        if (count > maxRun) maxRun = count;
        totalRuns++;
        count = 1;
      }
    }
    encoded += count + str[str.length - 1];
    if (count > maxRun) maxRun = count;
    return JSON.stringify({
      result: encoded,
      maxRun,
      totalRuns,
      ratio: Math.round(encoded.length / str.length * 100)
    });
  }
  function decode(str) {
    let decoded = "";
    let i = 0;
    let maxRun = 0;
    let totalRuns = 0;
    while (i < str.length) {
      let numStr = "";
      while (i < str.length && str[i] >= "0"
             && str[i] <= "9") {
        numStr += str[i];
        i++;
      }
      const count = parseInt(numStr, 10);
      const ch = str[i];
      i++;
      for (let j = 0; j < count; j++) {
        decoded += ch;
      }
      if (count > maxRun) maxRun = count;
      totalRuns++;
    }
    return JSON.stringify({
      result: decoded,
      maxRun,
      totalRuns,
      length: decoded.length
    });
  }
  if (mode === "encode") return encode(input);
  return decode(input);
}`,
    language: "javascript",
    inputDescription: 'input="aaabbbccddddde", mode="encode"',
    inputValue: 'input="aaabbbccddddde", mode="encode"',
    expectedOutput: '{"result":"3a3b2c5d1e","maxRun":5,"totalRuns":5,"ratio":71}',
    options: [
      '{"result":"3a3b2c5d1e","maxRun":5,"totalRuns":5,"ratio":71}',
      '{"result":"3a3b2c5d1e","maxRun":5,"totalRuns":5,"ratio":100}',
      '{"result":"a3b3c2d5e1","maxRun":5,"totalRuns":5,"ratio":71}',
      '{"result":"3a3b2c5d1e","maxRun":5,"totalRuns":4,"ratio":71}',
    ],
    correctOptionIndex: 0,
  },

  // ── 16. Balanced Parentheses Checker (Multiple Types) ────────────────────
  {
    code: `function checkBalanced(input) {
  const stack = [];
  const matching = { ")": "(", "]": "[", "}": "{" };
  const opening = new Set(["(", "[", "{"]);
  const closing = new Set([")", "]", "}"]);
  const errors = [];
  let maxDepth = 0;
  let currentDepth = 0;
  const depthPerType = { "(": 0, "[": 0, "{": 0 };
  const counts = { "(": 0, ")": 0, "[": 0, "]": 0, "{": 0, "}": 0 };
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (opening.has(ch)) {
      stack.push({ char: ch, pos: i });
      currentDepth++;
      if (currentDepth > maxDepth) maxDepth = currentDepth;
      counts[ch]++;
      depthPerType[ch]++;
    } else if (closing.has(ch)) {
      counts[ch]++;
      if (stack.length === 0) {
        errors.push("unmatched " + ch + " at " + i);
        currentDepth = 0;
      } else if (stack[stack.length - 1].char !== matching[ch]) {
        errors.push("mismatch " + ch + " at " + i);
        stack.pop();
        currentDepth--;
      } else {
        const opened = stack.pop();
        depthPerType[opened.char]--;
        currentDepth--;
      }
    }
  }
  while (stack.length > 0) {
    const unclosed = stack.pop();
    errors.push("unclosed " + unclosed.char + " at " + unclosed.pos);
  }
  return JSON.stringify({
    balanced: errors.length === 0,
    maxDepth,
    errors,
    counts
  });
}`,
    language: "javascript",
    inputDescription: 'input="({[a+b]*c}-(d/e)))"',
    inputValue: '"({[a+b]*c}-(d/e)))"',
    expectedOutput: '{"balanced":false,"maxDepth":3,"errors":["unmatched ) at 17"],"counts":{"(":2,")":3,"[":1,"]":1,"{":1,"}":1}}',
    options: [
      '{"balanced":false,"maxDepth":3,"errors":["unmatched ) at 17"],"counts":{"(":2,")":3,"[":1,"]":1,"{":1,"}":1}}',
      '{"balanced":true,"maxDepth":3,"errors":[],"counts":{"(":2,")":2,"[":1,"]":1,"{":1,"}":1}}',
      '{"balanced":false,"maxDepth":3,"errors":["unmatched ) at 16"],"counts":{"(":2,")":3,"[":1,"]":1,"{":1,"}":1}}',
      '{"balanced":false,"maxDepth":4,"errors":["unmatched ) at 17"],"counts":{"(":2,")":3,"[":1,"]":1,"{":1,"}":1}}',
    ],
    correctOptionIndex: 0,
  },

  // ── 17. Polynomial Multiplication ────────────────────────────────────────
  {
    code: `function polyMultiply(p1, p2) {
  const degree1 = p1.length - 1;
  const degree2 = p2.length - 1;
  const resultDeg = degree1 + degree2;
  const result = new Array(resultDeg + 1).fill(0);
  let multiplications = 0;
  let additions = 0;
  for (let i = 0; i <= degree1; i++) {
    for (let j = 0; j <= degree2; j++) {
      const product = p1[i] * p2[j];
      multiplications++;
      if (result[i + j] !== 0 && product !== 0) {
        additions++;
      }
      result[i + j] += product;
    }
  }
  let nonZeroTerms = 0;
  let sumCoeffs = 0;
  for (let i = 0; i < result.length; i++) {
    if (result[i] !== 0) nonZeroTerms++;
    sumCoeffs += Math.abs(result[i]);
  }
  const formatted = [];
  for (let i = result.length - 1; i >= 0; i--) {
    if (result[i] === 0) continue;
    if (i === 0) formatted.push("" + result[i]);
    else if (i === 1) formatted.push(result[i] + "x");
    else formatted.push(result[i] + "x^" + i);
  }
  return JSON.stringify({
    coefficients: result,
    degree: resultDeg,
    multiplications,
    nonZeroTerms,
    formatted: formatted.join("+")
  });
}`,
    language: "javascript",
    inputDescription: "p1=[1,2,3] (1+2x+3x^2), p2=[4,5] (4+5x)",
    inputValue: "p1=[1,2,3], p2=[4,5]",
    expectedOutput: '{"coefficients":[4,13,22,15],"degree":3,"multiplications":6,"nonZeroTerms":4,"formatted":"15x^3+22x^2+13x+4"}',
    options: [
      '{"coefficients":[4,13,22,15],"degree":3,"multiplications":6,"nonZeroTerms":4,"formatted":"15x^3+22x^2+13x+4"}',
      '{"coefficients":[4,13,22,15],"degree":3,"multiplications":6,"nonZeroTerms":4,"formatted":"4+13x+22x^2+15x^3"}',
      '{"coefficients":[4,13,22,15],"degree":4,"multiplications":6,"nonZeroTerms":4,"formatted":"15x^3+22x^2+13x+4"}',
      '{"coefficients":[5,12,22,15],"degree":3,"multiplications":6,"nonZeroTerms":4,"formatted":"15x^3+22x^2+12x+5"}',
    ],
    correctOptionIndex: 0,
  },

  // ── 18. Newton's Method for Root Finding ─────────────────────────────────
  {
    code: `function newtonMethod(coeffs, guess, maxIter, tol) {
  function evalPoly(c, x) {
    let val = 0;
    for (let i = c.length - 1; i >= 0; i--) {
      val = val * x + c[i];
    }
    return val;
  }
  function derivCoeffs(c) {
    const d = [];
    for (let i = 1; i < c.length; i++) {
      d.push(c[i] * i);
    }
    return d;
  }
  const dc = derivCoeffs(coeffs);
  let x = guess;
  const iterations = [];
  let converged = false;
  let i;
  for (i = 0; i < maxIter; i++) {
    const fx = evalPoly(coeffs, x);
    const dfx = evalPoly(dc, x);
    if (Math.abs(dfx) < 1e-12) break;
    const xNew = x - fx / dfx;
    const roundedX = Math.round(xNew * 10000) / 10000;
    iterations.push(roundedX);
    if (Math.abs(xNew - x) < tol) {
      converged = true;
      x = xNew;
      break;
    }
    x = xNew;
  }
  const finalX = Math.round(x * 10000) / 10000;
  const residual = Math.round(
    Math.abs(evalPoly(coeffs, x)) * 10000
  ) / 10000;
  return JSON.stringify({
    root: finalX,
    iterations: iterations,
    converged,
    residual
  });
}`,
    language: "javascript",
    inputDescription: "coeffs=[-2,0,1] (x^2-2), guess=1, maxIter=10, tol=0.0001",
    inputValue: "coeffs=[-2,0,1], guess=1, maxIter=10, tol=0.0001",
    expectedOutput: '{"root":1.4142,"iterations":[1.5,1.4167,1.4142,1.4142],"converged":true,"residual":0}',
    options: [
      '{"root":1.4142,"iterations":[1.5,1.4167,1.4142,1.4142],"converged":true,"residual":0}',
      '{"root":1.4142,"iterations":[1.5,1.4167,1.4142],"converged":true,"residual":0}',
      '{"root":1.4142,"iterations":[1.5,1.4167,1.4142,1.4142],"converged":false,"residual":0}',
      '{"root":1.5,"iterations":[1.5],"converged":true,"residual":0.25}',
    ],
    correctOptionIndex: 0,
  },

  // ── 19. Deterministic Monte Carlo Pi Estimation ──────────────────────────
  {
    code: `function monteCarloPI(seed, iterations) {
  let state = seed;
  function nextRand() {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  }
  let inside = 0;
  let maxDist = 0;
  let minDist = 2;
  const checkpoints = [];
  for (let i = 0; i < iterations; i++) {
    const x = nextRand();
    const y = nextRand();
    const dist = Math.sqrt(x * x + y * y);
    if (dist <= 1.0) {
      inside++;
    }
    if (dist > maxDist) maxDist = dist;
    if (dist < minDist) minDist = dist;
    if ((i + 1) % 250 === 0) {
      const estimate = 4 * inside / (i + 1);
      checkpoints.push(
        Math.round(estimate * 10000) / 10000
      );
    }
  }
  const piEstimate = 4 * inside / iterations;
  const rounded = Math.round(piEstimate * 10000) / 10000;
  maxDist = Math.round(maxDist * 10000) / 10000;
  minDist = Math.round(minDist * 10000) / 10000;
  return JSON.stringify({
    piEstimate: rounded,
    inside,
    total: iterations,
    checkpoints,
    maxDist,
    minDist
  });
}`,
    language: "javascript",
    inputDescription: "seed=42, iterations=1000",
    inputValue: "seed=42, iterations=1000",
    expectedOutput: '{"piEstimate":3.208,"inside":802,"total":1000,"checkpoints":[3.2,3.176,3.2053,3.208],"maxDist":1.3886,"minDist":0.0377}',
    options: [
      '{"piEstimate":3.208,"inside":802,"total":1000,"checkpoints":[3.2,3.176,3.2053,3.208],"maxDist":1.3886,"minDist":0.0377}',
      '{"piEstimate":3.14,"inside":785,"total":1000,"checkpoints":[3.2,3.16,3.14,3.14],"maxDist":1.41,"minDist":0.02}',
      '{"piEstimate":3.208,"inside":802,"total":1000,"checkpoints":[3.2,3.176,3.2053,3.208],"maxDist":1.4142,"minDist":0.001}',
      '{"piEstimate":3.208,"inside":802,"total":1000,"checkpoints":[3.2,3.176,3.208],"maxDist":1.3886,"minDist":0.0377}',
    ],
    correctOptionIndex: 0,
  },

  // ── 20. Dijkstra's Shortest Path ─────────────────────────────────────────
  {
    code: `function dijkstra(graph, source) {
  const nodes = Object.keys(graph).sort();
  const dist = {};
  const prev = {};
  const visited = {};
  for (const node of nodes) {
    dist[node] = Infinity;
    prev[node] = null;
    visited[node] = false;
  }
  dist[source] = 0;
  let iterations = 0;
  for (let count = 0; count < nodes.length; count++) {
    let u = null;
    let minD = Infinity;
    for (const node of nodes) {
      if (!visited[node] && dist[node] < minD) {
        minD = dist[node];
        u = node;
      }
    }
    if (u === null) break;
    visited[u] = true;
    iterations++;
    for (const [v, w] of graph[u]) {
      if (!visited[v] && dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        prev[v] = u;
      }
    }
  }
  const paths = {};
  for (const node of nodes) {
    if (node === source) continue;
    const path = [];
    let curr = node;
    while (curr !== null) {
      path.unshift(curr);
      curr = prev[curr];
    }
    paths[node] = {
      dist: dist[node] === Infinity ? -1 : dist[node],
      path
    };
  }
  return JSON.stringify({ distances: dist, paths, iterations });
}`,
    language: "javascript",
    inputDescription: 'graph={ A:[["B",4],["C",2]], B:[["D",3]], C:[["B",1],["D",5]], D:[] }, source="A"',
    inputValue: 'graph={ A:[["B",4],["C",2]], B:[["D",3]], C:[["B",1],["D",5]], D:[] }, source="A"',
    expectedOutput: '{"distances":{"A":0,"B":3,"C":2,"D":6},"paths":{"B":{"dist":3,"path":["A","C","B"]},"C":{"dist":2,"path":["A","C"]},"D":{"dist":6,"path":["A","C","B","D"]}},"iterations":4}',
    options: [
      '{"distances":{"A":0,"B":3,"C":2,"D":6},"paths":{"B":{"dist":3,"path":["A","C","B"]},"C":{"dist":2,"path":["A","C"]},"D":{"dist":6,"path":["A","C","B","D"]}},"iterations":4}',
      '{"distances":{"A":0,"B":4,"C":2,"D":7},"paths":{"B":{"dist":4,"path":["A","B"]},"C":{"dist":2,"path":["A","C"]},"D":{"dist":7,"path":["A","B","D"]}},"iterations":4}',
      '{"distances":{"A":0,"B":3,"C":2,"D":6},"paths":{"B":{"dist":3,"path":["A","C","B"]},"C":{"dist":2,"path":["A","C"]},"D":{"dist":6,"path":["A","C","B","D"]}},"iterations":3}',
      '{"distances":{"A":0,"B":3,"C":2,"D":5},"paths":{"B":{"dist":3,"path":["A","C","B"]},"C":{"dist":2,"path":["A","C"]},"D":{"dist":5,"path":["A","C","D"]}},"iterations":4}',
    ],
    correctOptionIndex: 0,
  },
];
