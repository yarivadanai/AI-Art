export interface BugTemplate {
  code: string;
  language: string;
  bugLine: number; // 1-indexed line number
  bugDescription: string;
  options: string[];
  correctOptionIndex: number;
}

export interface RecursiveTemplate {
  code: string;
  language: string;
  inputN: number;
  expectedOutput: number;
}

export interface AssemblyTemplate {
  code: string;
  expectedEax: number;
  options: [number, number, number, number];
  correctOptionIndex: number;
}

export interface LongFunctionTemplate {
  code: string;
  language: string;
  inputDescription: string;
  inputValue: string;
  expectedOutput: string;
  options: [string, string, string, string];
  correctOptionIndex: number;
}

// ─── Bug-finding templates ───────────────────────────────────────────────────

export const BUG_TEMPLATES: BugTemplate[] = [
  {
    code: `function safeAdd(a, b) {
  // Check if addition would overflow 32-bit signed integer
  const MAX_INT = 2147483647;
  if (a + b > MAX_INT) {
    throw new RangeError("Integer overflow");
  }
  return a + b;
}`,
    language: "javascript",
    bugLine: 4,
    bugDescription: "The overflow check itself overflows: if a and b are both large positive integers, a + b may already overflow before the comparison. Should check via MAX_INT - a < b instead.",
    options: ["Line 3: MAX_INT value is wrong for 32-bit signed integers", "Line 4: the overflow check itself can overflow before the comparison executes", "Line 6: throw should use TypeError not RangeError", "Line 8: return should cast to Int32"],
    correctOptionIndex: 1,
  },
  {
    code: `function mergeOverlapping(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const last = merged[merged.length - 1];
    if (intervals[i][0] <= last[1]) {
      last[1] = intervals[i][1];
    } else {
      merged.push(intervals[i]);
    }
  }
  return merged;
}`,
    language: "javascript",
    bugLine: 7,
    bugDescription: "When merging overlapping intervals, the code always takes the new interval's end (intervals[i][1]) instead of taking the maximum of the two ends. If the current interval is entirely contained within the last merged interval, this incorrectly shrinks it. Should be: last[1] = Math.max(last[1], intervals[i][1])",
    options: ["Line 2: sort comparator should also compare end values", "Line 6: should check intervals[i][0] < last[1] (strict less-than)", "Line 7: should use Math.max(last[1], intervals[i][1]) instead of direct assignment", "Line 9: should clone the interval before pushing"],
    correctOptionIndex: 2,
  },
  {
    code: `function binarySearch(arr, target) {
  let lo = 0, hi = arr.length - 1;
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return arr[lo] === target ? lo : -1;
}
function findInsertPos(sorted, val) {
  let lo = 0, hi = sorted.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (sorted[mid] < val) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}
function countInRange(sorted, low, high) {
  return findInsertPos(sorted, high) - findInsertPos(sorted, low);
}`,
    language: "javascript",
    bugLine: 21,
    bugDescription: "countInRange uses findInsertPos(sorted, high) which finds the first position >= high, so it EXCLUDES the value 'high' itself. For an inclusive upper bound, should use findInsertPos(sorted, high + 1) or a separate upperBound function. The range [low, high] misses elements equal to high.",
    options: ["Line 4: mid calculation can overflow for very large arrays", "Line 3: while condition should be lo <= hi for correctness", "Line 21: high bound is exclusive — misses elements equal to high", "Line 15: unsigned right shift is wrong for negative indices"],
    correctOptionIndex: 2,
  },
  {
    code: `function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  if (Array.isArray(obj)) return obj.map(item => deepClone(item));
  const cloned = {};
  for (const key in obj) {
    cloned[key] = deepClone(obj[key]);
  }
  return cloned;
}`,
    language: "javascript",
    bugLine: 7,
    bugDescription: "for...in iterates over inherited prototype properties, not just own properties. Should use Object.hasOwn(obj, key) or hasOwnProperty check to avoid cloning inherited properties.",
    options: ["Line 2: should check for undefined as well as null", "Line 5: map doesn't preserve sparse array holes", "Line 7: for...in includes inherited prototype properties without hasOwnProperty check", "Line 6: should use Object.create(Object.getPrototypeOf(obj))"],
    correctOptionIndex: 2,
  },
  {
    code: `function throttle(fn, interval) {
  let lastCall = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastCall > interval) {
      lastCall = now;
      return fn.apply(this, args);
    }
  };
}`,
    language: "javascript",
    bugLine: 5,
    bugDescription: "Uses > instead of >= for the time comparison. When exactly 'interval' ms have passed, the function won't fire. Should be >= to match the standard throttle contract of 'at most once per interval'.",
    options: ["Line 2: lastCall should be initialized to -Infinity", "Line 5: should be >= instead of > to fire at exact interval boundary", "Line 7: fn.apply loses the arrow function context", "Line 6: lastCall should be set after fn executes, not before"],
    correctOptionIndex: 1,
  },
  {
    code: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  const merged = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      merged.push(left[i++]);
    } else {
      merged.push(right[j++]);
    }
  }
  return merged;
}`,
    language: "javascript",
    bugLine: 15,
    bugDescription: "The remaining elements of the non-exhausted array are not appended — after the while loop, any leftover elements in left or right are lost",
    options: ["Line 3: mid should use ceil instead of floor", "Line 9: comparison should use <=", "Line 15: missing concat of remaining left and right elements", "Line 2: base case should be length === 0"],
    correctOptionIndex: 2,
  },
  {
    code: `function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(args);
    }, delay);
  };
}`,
    language: "javascript",
    bugLine: 6,
    bugDescription: "fn(args) passes the args array as a single argument instead of spreading them. Should be fn(...args) or fn.apply(this, args)",
    options: ["Line 4: clearTimeout should be called after setTimeout", "Line 5: setTimeout should use bind", "Line 6: fn(args) should be fn(...args)", "Line 7: delay should be converted to number"],
    correctOptionIndex: 2,
  },
  {
    code: `function flattenDepth(arr, depth = 1) {
  if (depth <= 0) return arr.slice();
  return arr.reduce((acc, val) => {
    if (Array.isArray(val)) {
      acc.push(...flattenDepth(val, depth - 1));
    } else {
      acc.push(val);
    }
    return acc;
  }, []);
}
function unique(arr) {
  return [...new Set(arr)];
}
function intersection(a, b) {
  const setB = new Set(b);
  return unique(a.filter(x => setB.has(x)));
}
function difference(a, b) {
  const setB = new Set(b);
  return a.filter(x => !setB.has(x));
}
function symmetricDiff(a, b) {
  return difference(a, b).concat(difference(b, a));
}`,
    language: "javascript",
    bugLine: 23,
    bugDescription: "symmetricDiff doesn't deduplicate its output. difference(a,b) preserves all elements from 'a' not in 'b' including duplicates. For example, symmetricDiff([1,1,2],[2,3]) returns [1,1,3] instead of [1,3]. Should wrap result in unique().",
    options: ["Line 2: slice() doesn't deep-copy nested arrays", "Line 5: spread operator fails on deeply nested arrays", "Line 16: filter creates new array unnecessarily", "Line 23: symmetricDiff doesn't deduplicate — difference preserves duplicate elements from its first argument"],
    correctOptionIndex: 3,
  },
  {
    code: `function throttle(fn, limit) {
  let inThrottle = false;
  return function(...args) {
    if (inThrottle) return;
    fn.apply(this, args);
    inThrottle = true;
    setTimeout(() => {
      inThrottle = true;
    }, limit);
  };
}`,
    language: "javascript",
    bugLine: 8,
    bugDescription: "inThrottle should be set to false in the setTimeout callback to re-enable the function. Setting it to true keeps it permanently throttled after the first call",
    options: ["Line 4: should check !inThrottle", "Line 5: apply is unnecessary", "Line 8: should set inThrottle to false, not true", "Line 6: inThrottle should be set after setTimeout"],
    correctOptionIndex: 2,
  },
  {
    code: `function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[0];
  const left = [];
  const right = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  return [...quickSort(left), pivot, ...quickSort(right)];
}`,
    language: "javascript",
    bugLine: 6,
    bugDescription: "Loop starts at i = 0 instead of i = 1, including the pivot element in the partitioning. The pivot ends up in the right array and is also placed in the middle, causing infinite recursion for arrays with duplicate values equal to the pivot",
    options: ["Line 3: pivot should be median element", "Line 6: loop should start at i = 1 to skip pivot", "Line 7: should use <= for stability", "Line 13: pivot should not be spread separately"],
    correctOptionIndex: 1,
  },
  {
    code: `function debouncedLeading(fn, delay) {
  let timer = null;
  let isLeading = true;
  return function(...args) {
    if (isLeading) {
      fn.apply(this, args);
      isLeading = false;
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      isLeading = true;
    }, delay);
  };
}
// Expected: fires immediately on first call, then waits
// until delay ms of inactivity before allowing next leading call.
// Bug: if called again right at the delay boundary, fn fires
// twice because the trailing timeout resets isLeading before
// the next clearTimeout can cancel it.`,
    language: "javascript",
    bugLine: 9,
    bugDescription: "clearTimeout happens AFTER the leading invocation check. If the timer fires between the isLeading check (line 5) and the clearTimeout (line 9), isLeading gets reset to true and fn fires again immediately. The clearTimeout should come before the isLeading check to prevent the race condition. In practice, this means rapid calls at exactly the delay boundary cause double-firing.",
    options: ["Line 6: apply loses the correct 'this' binding in arrow functions", "Line 9: clearTimeout is called after the leading check — timer can fire between lines 5 and 9 causing double invocation", "Line 11: setTimeout should use bind instead of arrow function", "Line 3: isLeading should be initialized to false and set true on first call"],
    correctOptionIndex: 1,
  },
  {
    code: `function memoize(fn) {
  const cache = {};
  return function(...args) {
    const key = args.toString();
    if (key in cache) {
      return cache[key];
    }
    const result = fn(...args);
    cache[key] = result;
    return cache;
  };
}`,
    language: "javascript",
    bugLine: 10,
    bugDescription: "Returns the entire cache object instead of the computed result. Should be 'return result' instead of 'return cache'",
    options: ["Line 4: toString is not a reliable cache key", "Line 5: should use hasOwnProperty instead of in", "Line 8: should use apply instead of spread", "Line 10: returns cache object instead of result"],
    correctOptionIndex: 3,
  },
  {
    code: `function intersection(arr1, arr2) {
  const set1 = new Set(arr1);
  const result = [];
  for (const item of arr2) {
    if (set1.has(item)) {
      result.push(item);
    }
  }
  return [...new Set(result)];
}
// Bug: the function works correctly for primitives
// but fails for object references
function range(start, end, step) {
  if (step === 0) return [];
  const result = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }
  return result;
}`,
    language: "javascript",
    bugLine: 16,
    bugDescription: "When step is negative (for descending ranges), the condition i < end never terminates or never executes. Should check direction: if step > 0 use i < end, if step < 0 use i > end",
    options: ["Line 14: should also check for undefined step", "Line 16: loop condition doesn't handle negative step", "Line 15: result should be pre-allocated", "Line 17: should use <= instead of <"],
    correctOptionIndex: 1,
  },
  {
    code: `function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn(...args);
    }
    return function(...moreArgs) {
      return curried(...args, ...moreArgs);
    };
  };
}
// Testing:
// const add = curry((a, b, c) => a + b + c);
// add(1)(2)(3) should return 6
function compose(...fns) {
  return function(x) {
    return fns.reduce((acc, fn) => fn(acc), x);
  };
}`,
    language: "javascript",
    bugLine: 16,
    bugDescription: "compose should apply functions right-to-left, but reduce applies them left-to-right. Should use reduceRight instead of reduce",
    options: ["Line 3: should check args.length > fn.length", "Line 6: inner function loses 'this' context", "Line 16: should use reduceRight for right-to-left composition", "Line 15: should validate fns are functions"],
    correctOptionIndex: 2,
  },
  {
    code: `function eventEmitter() {
  const listeners = {};
  return {
    on(event, cb) {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(cb);
    },
    off(event, cb) {
      if (!listeners[event]) return;
      listeners[event] = listeners[event].filter(
        (fn) => fn === cb
      );
    },
    emit(event, ...args) {
      if (!listeners[event]) return;
      listeners[event].forEach((cb) => cb(...args));
    },
  };
}`,
    language: "javascript",
    bugLine: 11,
    bugDescription: "The filter condition fn === cb keeps the callback instead of removing it. Should be fn !== cb to filter out the matching callback",
    options: ["Line 5: should check for duplicate listeners", "Line 11: filter should use !== to remove the callback", "Line 16: forEach should use for...of for safety", "Line 6: push should return unsubscribe function"],
    correctOptionIndex: 1,
  },
];

// ─── Recursive function templates ────────────────────────────────────────────

export const RECURSIVE_TEMPLATES: RecursiveTemplate[] = [
  {
    code: `function f(n) {
  if (n <= 0) return 1;
  if (n === 1) return 2;
  return f(n - 1) * 2 - f(n - 3);
}`,
    language: "javascript",
    inputN: 6,
    expectedOutput: 21,
  },
  {
    code: `function f(n) {
  if (n <= 1) return n;
  if (n % 2 === 0) return f(n - 1) + f(n / 2);
  return 2 * f(n - 1) - 1;
}`,
    language: "javascript",
    inputN: 8,
    expectedOutput: 28,
  },
  {
    code: `function f(n) {
  if (n <= 0) return 1;
  if (n === 1) return 3;
  if (n % 3 === 0) return f(n - 1) * 2 + f(n - 2);
  if (n % 3 === 1) return f(n - 1) - f(n - 3) + n;
  return f(n - 2) * f(n - 3);
}`,
    language: "javascript",
    inputN: 9,
    expectedOutput: 177,
  },
  {
    code: `function f(n) {
  if (n <= 0) return 1;
  if (n === 1) return 2;
  return g(n - 1) + f(n - 2) * 2;
}
function g(n) {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  return f(n - 1) - g(n - 2);
}`,
    language: "javascript",
    inputN: 7,
    expectedOutput: 44,
  },
  {
    code: `function f(n) {
  if (n === 0) return 0;
  if (n === 1) return 1;
  return 3 * f(n - 1) - f(n - 2);
}`,
    language: "javascript",
    inputN: 5,
    expectedOutput: 31,
  },
  {
    code: `function f(n) {
  if (n === 0) return 2;
  if (n === 1) return 3;
  return f(n - 1) * f(n - 2);
}`,
    language: "javascript",
    inputN: 4,
    expectedOutput: 54,
  },
  {
    code: `function f(n) {
  if (n <= 1) return n + 1;
  if (n & 1) return f(n >> 1) + f(n >> 1) + 1;
  return f(n - 1) * 2 - f(n >> 2);
}`,
    language: "javascript",
    inputN: 11,
    expectedOutput: 15,
  },
  {
    code: `function f(n) {
  if (n <= 0) return 2;
  if (n === 1) return 3;
  if (n <= 3) return f(n - 1) + f(n - 2);
  return f(f(n - 3) % n) + n;
}`,
    language: "javascript",
    inputN: 6,
    expectedOutput: 11,
  },
  {
    code: `function f(n) {
  if (n === 1) return 0;
  if (n % 2 === 0) return 1 + f(n / 2);
  return 1 + f(3 * n + 1);
}`,
    language: "javascript",
    inputN: 6,
    expectedOutput: 8,
  },
  {
    code: `function f(n) {
  if (n <= 2) return 1;
  return f(n - 1) + f(n - 3);
}`,
    language: "javascript",
    inputN: 7,
    expectedOutput: 9,
  },
];

// ─── Assembly templates ──────────────────────────────────────────────────────

export const ASSEMBLY_TEMPLATES: AssemblyTemplate[] = [
  // Template 1: Loop with conditional shift and accumulation
  {
    code: `mov eax, 0
mov ebx, 3
mov ecx, 5
.loop:
  cmp ebx, 0
  je .skip
  add eax, ebx
  shl ebx, 1
  and ebx, 0xF
.skip:
  add eax, ecx
  dec ecx
  jnz .loop`,
    expectedEax: 44,
    options: [38, 41, 44, 52],
    correctOptionIndex: 2,
  },
  // Template 2: Loop with odd/even conditional accumulation and LEA
  {
    code: `mov eax, 0
mov ebx, 7
mov ecx, 6
mov edx, 0
.loop:
  test ebx, 1
  jz .even
  add edx, ecx
  jmp .next
.even:
  dec edx
.next:
  shr ebx, 1
  dec ecx
  jnz .loop
lea eax, [edx + edx*2]
add eax, 5`,
    expectedEax: 41,
    options: [36, 38, 41, 47],
    correctOptionIndex: 2,
  },
  // Template 3: Loop with conditional branch, XOR, and final shift
  {
    code: `mov eax, 0
mov ebx, 5
mov ecx, 4
.loop:
  lea edx, [ebx + ecx]
  cmp edx, 7
  jle .small
  add eax, edx
  dec ebx
  jmp .cont
.small:
  xor eax, edx
  inc ebx
.cont:
  dec ecx
  jnz .loop
shl eax, 1
or eax, 1`,
    expectedEax: 29,
    options: [25, 27, 29, 33],
    correctOptionIndex: 2,
  },
  // Template 4: Nested conditional (35>30 → +12=47, 47>40 → xor 0xFF → 208)
  {
    code: `mov eax, 35
mov ebx, 12
cmp eax, 30
jle .no_add
  add eax, ebx
.no_add:
cmp eax, 40
jle .done
  xor eax, 0xFF
.done:`,
    expectedEax: 208,
    options: [47, 196, 208, 255],
    correctOptionIndex: 2,
  },
  // Template 5: Bit manipulation chain (NOT, AND, SHL, XOR)
  {
    code: `mov eax, 0xA5
not eax
and eax, 0xFF
shl eax, 1
xor eax, 0x33`,
    expectedEax: 135,
    options: [90, 131, 135, 180],
    correctOptionIndex: 2,
  },
  // Template 6: Loop with conditional even/odd inside, then fixup
  {
    code: `mov ecx, 8
mov eax, 0
mov ebx, 1
.loop:
  test ecx, 1
  jne .odd
  add eax, ebx
  jmp .next
.odd:
  sub eax, ebx
.next:
  inc ebx
  dec ecx
  jnz .loop
add eax, 20`,
    expectedEax: 16,
    options: [12, 14, 16, 20],
    correctOptionIndex: 2,
  },
  // Template 7: LEA for multiply-add
  {
    code: `mov eax, 5
mov ebx, 3
lea ecx, [eax + ebx*4]
lea eax, [ecx + ecx*2]
sub eax, ebx
shr eax, 2`,
    expectedEax: 12,
    options: [10, 12, 17, 48],
    correctOptionIndex: 1,
  },
  // Template 8: XOR swap and computation
  {
    code: `mov eax, 19
mov ebx, 42
xor eax, ebx
xor ebx, eax
xor eax, ebx
add eax, ebx
shl eax, 1
sub eax, 5`,
    expectedEax: 117,
    options: [112, 117, 119, 122],
    correctOptionIndex: 1,
  },
  // Template 9: Countdown with shift accumulator
  {
    code: `mov eax, 1
mov ecx, 6
.shift:
  shl eax, 1
  dec ecx
  jnz .shift
sub eax, 1
xor eax, 0x1C`,
    expectedEax: 35,
    options: [28, 33, 35, 63],
    correctOptionIndex: 2,
  },
  // Template 10: Multi-register pipeline
  {
    code: `mov eax, 10
mov ebx, 20
mov ecx, 30
mov edx, eax
add edx, ebx
mov eax, ecx
sub eax, ebx
imul ebx, edx, eax
and ebx, 0xFF
mov eax, ebx`,
    expectedEax: 44,
    options: [30, 44, 56, 300],
    correctOptionIndex: 1,
  },
];

// ─── Long function templates ─────────────────────────────────────────────────

export const LONG_FUNCTION_TEMPLATES: LongFunctionTemplate[] = [
  {
    code: `function parseExpr(input) {
  const vars = {};
  const statements = input.split(';');
  for (let s = 0; s < statements.length; s++) {
    const stmt = statements[s].trim();
    if (stmt.length === 0) continue;
    const eqIdx = stmt.indexOf('=');
    if (eqIdx === -1) continue;
    const varName = stmt.substring(0, eqIdx).trim();
    const expr = stmt.substring(eqIdx + 1).trim();
    let result = 0;
    let currentOp = '+';
    let i = 0;
    while (i < expr.length) {
      let token = '';
      while (i < expr.length && expr[i] !== '+'
             && expr[i] !== '-' && expr[i] !== '*') {
        token += expr[i];
        i++;
      }
      token = token.trim();
      let val = 0;
      if (token in vars) {
        val = vars[token];
      } else {
        val = parseInt(token, 10);
      }
      if (currentOp === '+') result += val;
      else if (currentOp === '-') result -= val;
      else if (currentOp === '*') result *= val;
      if (i < expr.length) {
        currentOp = expr[i];
        i++;
      }
    }
    vars[varName] = result;
  }
  const keys = Object.keys(vars).sort();
  const out = {};
  for (const k of keys) out[k] = vars[k];
  return JSON.stringify(out);
}`,
    language: "javascript",
    inputDescription: 'Expression string: "x=3;y=x+5;z=y*2-x"',
    inputValue: '"x=3;y=x+5;z=y*2-x"',
    expectedOutput: '{"x":3,"y":8,"z":13}',
    options: [
      '{"x":3,"y":8,"z":13}',
      '{"x":3,"y":8,"z":16}',
      '{"x":3,"y":8,"z":11}',
      '{"x":3,"y":5,"z":7}',
    ],
    correctOptionIndex: 0,
  },
  {
    code: `function mergeIntervals(intervals) {
  if (intervals.length === 0) {
    return JSON.stringify({ merged: [], totalLength: 0, maxGap: 0 });
  }
  const sorted = intervals.slice().sort((a, b) => {
    if (a[0] !== b[0]) return a[0] - b[0];
    return a[1] - b[1];
  });
  const merged = [sorted[0].slice()];
  let overlapCount = 0;
  for (let i = 1; i < sorted.length; i++) {
    const last = merged[merged.length - 1];
    const curr = sorted[i];
    if (curr[0] <= last[1]) {
      overlapCount++;
      last[1] = Math.max(last[1], curr[1]);
    } else {
      merged.push(curr.slice());
    }
  }
  let totalLength = 0;
  let maxGap = 0;
  for (let i = 0; i < merged.length; i++) {
    totalLength += merged[i][1] - merged[i][0];
    if (i > 0) {
      const gap = merged[i][0] - merged[i - 1][1];
      if (gap > maxGap) maxGap = gap;
    }
  }
  const containedCount = intervals.filter((iv) => {
    return merged.some(
      (m) => m[0] <= iv[0] && m[1] >= iv[1]
             && (m[1] - m[0]) > (iv[1] - iv[0])
    );
  }).length;
  return JSON.stringify({
    merged,
    totalLength,
    maxGap,
    overlapCount,
    containedCount
  });
}`,
    language: "javascript",
    inputDescription: "Array of intervals: [[1,3],[2,6],[8,10],[15,18],[17,20]]",
    inputValue: "[[1,3],[2,6],[8,10],[15,18],[17,20]]",
    expectedOutput: '{"merged":[[1,6],[8,10],[15,20]],"totalLength":12,"maxGap":5,"overlapCount":2,"containedCount":4}',
    options: [
      '{"merged":[[1,6],[8,10],[15,20]],"totalLength":12,"maxGap":5,"overlapCount":2,"containedCount":4}',
      '{"merged":[[1,6],[8,10],[15,20]],"totalLength":12,"maxGap":5,"overlapCount":2,"containedCount":3}',
      '{"merged":[[1,6],[8,10],[15,20]],"totalLength":12,"maxGap":2,"overlapCount":2,"containedCount":4}',
      '{"merged":[[1,6],[8,10],[15,20]],"totalLength":17,"maxGap":5,"overlapCount":2,"containedCount":4}',
    ],
    correctOptionIndex: 0,
  },
  {
    code: `function trieSearch(words, queries) {
  const root = { children: {}, isEnd: false, depth: 0 };

  function insert(word) {
    let node = root;
    for (let i = 0; i < word.length; i++) {
      const ch = word[i];
      if (!node.children[ch]) {
        node.children[ch] = {
          children: {},
          isEnd: false,
          depth: i + 1,
          prefixCount: 0
        };
      }
      node.children[ch].prefixCount++;
      node = node.children[ch];
    }
    node.isEnd = true;
  }

  function search(word) {
    let node = root;
    for (let i = 0; i < word.length; i++) {
      const ch = word[i];
      if (!node.children[ch]) return { found: false, prefixes: 0 };
      node = node.children[ch];
    }
    return { found: node.isEnd, prefixes: node.prefixCount };
  }

  for (const w of words) {
    insert(w);
  }

  const found = [];
  let totalPrefixHits = 0;
  for (const q of queries) {
    const result = search(q);
    if (result.found) {
      found.push(q);
      totalPrefixHits += result.prefixes;
    }
  }
  return JSON.stringify({ matches: found, totalPrefixHits });
}`,
    language: "javascript",
    inputDescription: 'words=["apple","app","ape","bat","bath"], queries=["app","apex","bat","bath","ban"]',
    inputValue: 'words=["apple","app","ape","bat","bath"], queries=["app","apex","bat","bath","ban"]',
    expectedOutput: '{"matches":["app","bat","bath"],"totalPrefixHits":5}',
    options: [
      '{"matches":["app","bat","bath"],"totalPrefixHits":5}',
      '{"matches":["app","bat","bath"],"totalPrefixHits":6}',
      '{"matches":["app","apex","bat","bath"],"totalPrefixHits":7}',
      '{"matches":["app","bat","bath"],"totalPrefixHits":3}',
    ],
    correctOptionIndex: 0,
  },
  {
    code: `function graphColor(adjList) {
  const nodes = Object.keys(adjList).sort();
  const colors = {};
  const order = [];

  // Compute degree for each node
  const degree = {};
  for (const node of nodes) {
    degree[node] = adjList[node].length;
  }

  // Sort by degree descending (Welsh-Powell heuristic)
  const sorted = nodes.slice().sort((a, b) => {
    if (degree[b] !== degree[a]) return degree[b] - degree[a];
    return a.localeCompare(b);
  });

  // Greedy coloring in sorted order
  for (const node of sorted) {
    order.push(node);
    const usedColors = new Set();
    for (const neighbor of adjList[node]) {
      if (colors[neighbor] !== undefined) {
        usedColors.add(colors[neighbor]);
      }
    }
    let color = 0;
    while (usedColors.has(color)) {
      color++;
    }
    colors[node] = color;
  }

  // Compute statistics
  const numColors = Math.max(...Object.values(colors)) + 1;
  const colorGroups = {};
  for (const node of nodes) {
    const c = colors[node];
    if (!colorGroups[c]) colorGroups[c] = [];
    colorGroups[c].push(node);
  }
  const groupSizes = [];
  for (let c = 0; c < numColors; c++) {
    groupSizes.push(colorGroups[c] ? colorGroups[c].length : 0);
  }

  // Verify coloring validity
  let conflicts = 0;
  for (const node of nodes) {
    for (const neighbor of adjList[node]) {
      if (colors[node] === colors[neighbor]) {
        conflicts++;
      }
    }
  }

  return JSON.stringify({
    coloring: colors,
    chromaticBound: numColors,
    groupSizes,
    processingOrder: order,
    conflicts: conflicts / 2
  });
}`,
    language: "javascript",
    inputDescription: 'Adjacency list: { A: ["B","C","D"], B: ["A","C","E"], C: ["A","B","D","E"], D: ["A","C","F"], E: ["B","C","F"], F: ["D","E"] }',
    inputValue: '{ A: ["B","C","D"], B: ["A","C","E"], C: ["A","B","D","E"], D: ["A","C","F"], E: ["B","C","F"], F: ["D","E"] }',
    expectedOutput: '{"coloring":{"C":0,"A":1,"B":2,"D":2,"E":1,"F":0},"chromaticBound":3,"groupSizes":[2,2,2],"processingOrder":["C","A","B","D","E","F"],"conflicts":0}',
    options: [
      '{"coloring":{"C":0,"A":1,"B":2,"D":2,"E":1,"F":0},"chromaticBound":3,"groupSizes":[2,2,2],"processingOrder":["C","A","B","D","E","F"],"conflicts":0}',
      '{"coloring":{"A":0,"B":1,"C":2,"D":1,"E":0,"F":2},"chromaticBound":3,"groupSizes":[2,2,2],"processingOrder":["A","B","C","D","E","F"],"conflicts":0}',
      '{"coloring":{"C":0,"A":1,"B":2,"D":2,"E":1,"F":0},"chromaticBound":3,"groupSizes":[2,2,2],"processingOrder":["C","A","D","B","E","F"],"conflicts":0}',
      '{"coloring":{"C":0,"A":1,"B":2,"D":1,"E":2,"F":0},"chromaticBound":3,"groupSizes":[2,2,2],"processingOrder":["C","A","B","D","E","F"],"conflicts":0}',
    ],
    correctOptionIndex: 0,
  },
  {
    code: `function detectCycle(graph) {
  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = {};
  const parent = {};
  for (const node in graph) {
    color[node] = WHITE;
    parent[node] = null;
  }
  let cyclePath = null;
  function dfs(u) {
    color[u] = GRAY;
    for (const v of graph[u]) {
      if (color[v] === GRAY) {
        const path = [v, u];
        let curr = u;
        while (parent[curr] !== null && parent[curr] !== v) {
          curr = parent[curr];
          path.push(curr);
        }
        path.push(v);
        cyclePath = path.reverse();
        return true;
      }
      if (color[v] === WHITE) {
        parent[v] = u;
        if (dfs(v)) return true;
      }
    }
    color[u] = BLACK;
    return false;
  }
  for (const node in graph) {
    if (color[node] === WHITE) {
      if (dfs(node)) break;
    }
  }
  return JSON.stringify(cyclePath);
}`,
    language: "javascript",
    inputDescription: 'Directed graph: { A: ["B"], B: ["C","D"], C: ["E"], D: ["E"], E: ["B"] }',
    inputValue: '{ A: ["B"], B: ["C","D"], C: ["E"], D: ["E"], E: ["B"] }',
    expectedOutput: '["B","C","E","B"]',
    options: [
      '["B","C","E","B"]',
      '["A","B","C","E","B"]',
      '["B","D","E","B"]',
      '["B","C","D","E","B"]',
    ],
    correctOptionIndex: 0,
  },
  {
    code: `function editDistance(source, target) {
  const m = source.length, n = target.length;
  const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
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
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && source[i - 1] === target[j - 1]) {
      i--; j--;
    } else if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) {
      ops.unshift('replace ' + source[i - 1] + ' with ' + target[j - 1]);
      i--; j--;
    } else if (j > 0 && dp[i][j] === dp[i][j - 1] + 1) {
      ops.unshift('insert ' + target[j - 1]);
      j--;
    } else {
      ops.unshift('delete ' + source[i - 1]);
      i--;
    }
  }
  return JSON.stringify({ distance: dp[m][n], operations: ops });
}`,
    language: "javascript",
    inputDescription: 'source = "kitten", target = "sitting"',
    inputValue: 'source = "kitten", target = "sitting"',
    expectedOutput: '{"distance":3,"operations":["replace k with s","replace e with i","insert g"]}',
    options: [
      '{"distance":3,"operations":["replace k with s","replace e with i","insert g"]}',
      '{"distance":3,"operations":["replace k with s","insert i","replace n with g"]}',
      '{"distance":4,"operations":["replace k with s","replace e with i","delete n","insert g"]}',
      '{"distance":3,"operations":["replace k with s","replace e with i","replace n with g"]}',
    ],
    correctOptionIndex: 0,
  },
  {
    code: `function bstFromPreorder(preorder) {
  function buildBST(arr, min, max, idx) {
    if (idx[0] >= arr.length) return null;
    const val = arr[idx[0]];
    if (val < min || val > max) return null;
    const node = { val, left: null, right: null };
    idx[0]++;
    node.left = buildBST(arr, min, val, idx);
    node.right = buildBST(arr, val, max, idx);
    return node;
  }

  const root = buildBST(preorder, -Infinity, Infinity, [0]);

  function height(node) {
    if (!node) return 0;
    return 1 + Math.max(height(node.left), height(node.right));
  }

  function countNodes(node) {
    if (!node) return 0;
    return 1 + countNodes(node.left) + countNodes(node.right);
  }

  const inorderResult = [];
  function inorder(node) {
    if (!node) return;
    inorder(node.left);
    inorderResult.push(node.val);
    inorder(node.right);
  }
  inorder(root);

  const h = height(root);
  const n = countNodes(root);
  const isBalanced = h <= Math.floor(Math.log2(n)) + 1;

  return JSON.stringify({
    inorder: inorderResult,
    height: h,
    nodeCount: n,
    isBalanced
  });
}`,
    language: "javascript",
    inputDescription: "Preorder traversal of a BST: [5,3,1,4,8,7,9]",
    inputValue: "[5,3,1,4,8,7,9]",
    expectedOutput: '{"inorder":[1,3,4,5,7,8,9],"height":3,"nodeCount":7,"isBalanced":true}',
    options: [
      '{"inorder":[1,3,4,5,7,8,9],"height":3,"nodeCount":7,"isBalanced":true}',
      '{"inorder":[1,3,4,5,7,8,9],"height":3,"nodeCount":7,"isBalanced":false}',
      '{"inorder":[1,3,4,5,7,8,9],"height":4,"nodeCount":7,"isBalanced":false}',
      '{"inorder":[5,3,1,4,8,7,9],"height":3,"nodeCount":7,"isBalanced":true}',
    ],
    correctOptionIndex: 0,
  },
  {
    code: `function slidingWindowMax(nums, k) {
  const deque = [];
  const result = [];
  const maxPositions = [];

  for (let i = 0; i < nums.length; i++) {
    while (deque.length > 0 && deque[0] < i - k + 1) {
      deque.shift();
    }
    while (deque.length > 0 && nums[deque[deque.length - 1]] <= nums[i]) {
      deque.pop();
    }
    deque.push(i);
    if (i >= k - 1) {
      result.push(nums[deque[0]]);
      maxPositions.push(deque[0]);
    }
  }

  let sumOfMaxes = 0;
  for (let i = 0; i < result.length; i++) {
    sumOfMaxes += result[i];
  }

  let maxDiff = 0;
  for (let i = 1; i < result.length; i++) {
    const diff = Math.abs(result[i] - result[i - 1]);
    if (diff > maxDiff) maxDiff = diff;
  }

  const uniqueMaxCount = new Set(result).size;

  return JSON.stringify({
    windowMaxes: result,
    sumOfMaxes,
    maxDiff,
    uniqueMaxCount
  });
}`,
    language: "javascript",
    inputDescription: "nums = [4,3,5,4,3,3,6,7], k = 3",
    inputValue: "nums = [4,3,5,4,3,3,6,7], k = 3",
    expectedOutput: '{"windowMaxes":[5,5,5,4,6,7],"sumOfMaxes":32,"maxDiff":2,"uniqueMaxCount":4}',
    options: [
      '{"windowMaxes":[5,5,5,4,6,7],"sumOfMaxes":32,"maxDiff":2,"uniqueMaxCount":4}',
      '{"windowMaxes":[5,5,5,4,6,7],"sumOfMaxes":32,"maxDiff":3,"uniqueMaxCount":4}',
      '{"windowMaxes":[4,5,5,4,6,7],"sumOfMaxes":31,"maxDiff":2,"uniqueMaxCount":4}',
      '{"windowMaxes":[5,5,5,4,6,7],"sumOfMaxes":32,"maxDiff":2,"uniqueMaxCount":5}',
    ],
    correctOptionIndex: 0,
  },
  {
    code: `function transformMatrix(matrix) {
  const n = matrix.length;

  // Step 1: Rotate 90 degrees clockwise
  let rotated = Array(n).fill(null).map(() => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      rotated[j][n - 1 - i] = matrix[i][j];
    }
  }

  // Step 2: Flip vertically (reverse row order)
  let flipped = [];
  for (let i = n - 1; i >= 0; i--) {
    flipped.push(rotated[i].slice());
  }

  // Step 3: Transpose
  let transposed = Array(n).fill(null).map(() => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      transposed[i][j] = flipped[j][i];
    }
  }

  // Compute diagonal sums
  let mainDiag = 0;
  let antiDiag = 0;
  for (let i = 0; i < n; i++) {
    mainDiag += transposed[i][i];
    antiDiag += transposed[i][n - 1 - i];
  }

  // Flatten and compute checksum
  const flat = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      flat.push(transposed[i][j]);
    }
  }
  let checksum = 0;
  for (let i = 0; i < flat.length; i++) {
    checksum += flat[i] * (i + 1);
  }

  return JSON.stringify({
    result: transposed,
    mainDiag,
    antiDiag,
    checksum
  });
}`,
    language: "javascript",
    inputDescription: "3x3 matrix: [[1,2,3],[4,5,6],[7,8,9]]",
    inputValue: "[[1,2,3],[4,5,6],[7,8,9]]",
    expectedOutput: '{"result":[[9,8,7],[6,5,4],[3,2,1]],"mainDiag":15,"antiDiag":15,"checksum":165}',
    options: [
      '{"result":[[9,8,7],[6,5,4],[3,2,1]],"mainDiag":15,"antiDiag":15,"checksum":165}',
      '{"result":[[7,4,1],[8,5,2],[9,6,3]],"mainDiag":15,"antiDiag":15,"checksum":135}',
      '{"result":[[9,8,7],[6,5,4],[3,2,1]],"mainDiag":15,"antiDiag":15,"checksum":120}',
      '{"result":[[3,6,9],[2,5,8],[1,4,7]],"mainDiag":15,"antiDiag":15,"checksum":165}',
    ],
    correctOptionIndex: 0,
  },
  {
    code: `function hashMapOps(size, operations) {
  const buckets = Array(size).fill(null).map(() => []);
  let totalPuts = 0;
  let totalOverwrites = 0;
  let totalCollisions = 0;

  function put(key, value) {
    const idx = key % size;
    const bucket = buckets[idx];
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        bucket[i][1] = value;
        totalOverwrites++;
        return;
      }
    }
    if (bucket.length > 0) totalCollisions++;
    bucket.push([key, value]);
    totalPuts++;
  }

  function get(key) {
    const idx = key % size;
    const bucket = buckets[idx];
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) return bucket[i][1];
    }
    return null;
  }

  const results = [];
  for (const op of operations) {
    if (op[0] === 'put') {
      put(op[1], op[2]);
    } else if (op[0] === 'get') {
      results.push(get(op[1]));
    }
  }

  let maxChainLen = 0;
  for (let i = 0; i < size; i++) {
    if (buckets[i].length > maxChainLen) {
      maxChainLen = buckets[i].length;
    }
  }

  return JSON.stringify({
    results,
    totalPuts,
    totalOverwrites,
    totalCollisions,
    maxChainLen
  });
}`,
    language: "javascript",
    inputDescription: 'size=4, ops: put(5,"a"), put(9,"b"), put(13,"c"), put(5,"d"), get(9), get(5), get(13)',
    inputValue: 'size=4, operations=[["put",5,"a"],["put",9,"b"],["put",13,"c"],["put",5,"d"],["get",9],["get",5],["get",13]]',
    expectedOutput: '{"results":["b","d","c"],"totalPuts":3,"totalOverwrites":1,"totalCollisions":2,"maxChainLen":3}',
    options: [
      '{"results":["b","d","c"],"totalPuts":3,"totalOverwrites":1,"totalCollisions":2,"maxChainLen":3}',
      '{"results":["b","d","c"],"totalPuts":4,"totalOverwrites":0,"totalCollisions":3,"maxChainLen":4}',
      '{"results":["b","a","c"],"totalPuts":3,"totalOverwrites":1,"totalCollisions":2,"maxChainLen":3}',
      '{"results":["b","d","c"],"totalPuts":3,"totalOverwrites":1,"totalCollisions":3,"maxChainLen":3}',
    ],
    correctOptionIndex: 0,
  },
];
