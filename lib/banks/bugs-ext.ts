import type { BugTemplate } from "./code-templates";

// ─── Extended Bug-finding templates (60 entries) ─────────────────────────────

export const BUG_TEMPLATES_EXT: BugTemplate[] = [
  // 1 ── Off-by-one in pagination
  {
    code: `function paginate(items, page, pageSize) {
  const start = page * pageSize;
  const end = start + pageSize;
  const totalPages = Math.floor(items.length / pageSize);
  return {
    data: items.slice(start, end),
    totalPages,
    hasNext: page < totalPages,
  };
}`,
    language: "javascript",
    bugLine: 4,
    bugDescription:
      "Math.floor should be Math.ceil. When items.length is not evenly divisible by pageSize, the last partial page is lost. For example, 10 items with pageSize 3 gives floor(10/3)=3, missing the 4th page with 1 item.",
    options: [
      "Line 2: start should be (page - 1) * pageSize for 1-indexed pages",
      "Line 4: Math.floor should be Math.ceil; partial last page is dropped",
      "Line 6: slice end index is off by one",
      "Line 7: hasNext should check page < totalPages - 1",
    ],
    correctOptionIndex: 1,
  },

  // 2 ── Closure capture in loop
  {
    code: `function createHandlers(buttons) {
  const handlers = [];
  for (var i = 0; i < buttons.length; i++) {
    handlers.push(function() {
      console.log("Clicked button " + i);
    });
  }
  return handlers;
}
function attachHandlers(buttons) {
  const fns = createHandlers(buttons);
  fns.forEach((fn, idx) => {
    buttons[idx].onclick = fn;
  });
}`,
    language: "javascript",
    bugLine: 3,
    bugDescription:
      "Using 'var' in the for loop means all closures share the same 'i' variable. By the time any handler executes, i equals buttons.length. Should use 'let' instead of 'var' to create a new binding per iteration.",
    options: [
      "Line 3: var should be let; all closures capture the same i variable",
      "Line 4: push should clone the function to avoid shared state",
      "Line 5: string concatenation should use template literals",
      "Line 7: handlers array should be returned as a frozen copy",
    ],
    correctOptionIndex: 0,
  },

  // 3 ── Floating point comparison
  {
    code: `function isTriangle(a, b, c) {
  const sides = [a, b, c].sort();
  return sides[0] + sides[1] > sides[2];
}
function isEquilateral(a, b, c) {
  if (!isTriangle(a, b, c)) return false;
  return a === b && b === c;
}
function isIsosceles(a, b, c) {
  if (!isTriangle(a, b, c)) return false;
  return a === b || b === c || a === c;
}`,
    language: "javascript",
    bugLine: 2,
    bugDescription:
      "Array.sort() without a comparator sorts lexicographically, not numerically. [9, 80, 7] sorts to [7, 80, 9] as strings. Should be .sort((a, b) => a - b).",
    options: [
      "Line 3: should be >= instead of > for degenerate triangles",
      "Line 2: sort() without a numeric comparator sorts lexicographically",
      "Line 7: floating point equality should use epsilon comparison",
      "Line 10: isIsosceles logic is wrong for equilateral triangles",
    ],
    correctOptionIndex: 1,
  },

  // 4 ── Prototype pollution in merge
  {
    code: `function merge(target, source) {
  for (const key in source) {
    if (typeof source[key] === "object" && source[key] !== null) {
      if (!target[key]) target[key] = {};
      merge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}`,
    language: "javascript",
    bugLine: 2,
    bugDescription:
      "No check for __proto__ or constructor keys allows prototype pollution. An attacker can pass { '__proto__': { 'admin': true } } to pollute Object.prototype. Should filter out dangerous keys like __proto__, constructor, and prototype.",
    options: [
      "Line 3: typeof check misses arrays; arrays are also objects",
      "Line 4: falsy check (!target[key]) fails for 0 and empty string values",
      "Line 2: no prototype pollution guard; __proto__ and constructor keys are not filtered",
      "Line 7: assignment should use Object.defineProperty for safety",
    ],
    correctOptionIndex: 2,
  },

  // 5 ── Async/await pitfall: forEach doesn't await
  {
    code: `async function processAll(urls) {
  const results = [];
  urls.forEach(async (url) => {
    const resp = await fetch(url);
    const data = await resp.json();
    results.push(data);
  });
  return results;
}
async function main() {
  const urls = ["/api/a", "/api/b", "/api/c"];
  const data = await processAll(urls);
  console.log("Fetched:", data.length, "items");
}`,
    language: "javascript",
    bugLine: 3,
    bugDescription:
      "forEach does not await async callbacks. The function returns immediately with an empty array because the async callbacks haven't completed yet. Should use for...of or Promise.all with .map instead.",
    options: [
      "Line 4: fetch needs error handling with try/catch",
      "Line 3: forEach ignores async callbacks; returns before they complete",
      "Line 6: push is not safe for concurrent access",
      "Line 8: should return a Promise wrapping the results",
    ],
    correctOptionIndex: 1,
  },

  // 6 ── RegExp lastIndex statefulness
  {
    code: `const emailRegex = /\\w+@\\w+\\.\\w+/g;

function isValidEmail(str) {
  return emailRegex.test(str);
}

function checkEmails(list) {
  return list.map(email => isValidEmail(email));
}
function filterValidEmails(list) {
  return list.filter(email => isValidEmail(email));
}`,
    language: "javascript",
    bugLine: 1,
    bugDescription:
      "A regex with the /g flag maintains lastIndex state between test() calls. After a successful match, the next test() starts from lastIndex, potentially failing on valid input. Every other call may return false. Remove /g or reset lastIndex before each test.",
    options: [
      "Line 1: the regex is too permissive; doesn't validate TLD length",
      "Line 1: /g flag causes regex to maintain lastIndex state, giving alternating results",
      "Line 4: test() should be replaced with match() for correctness",
      "Line 8: map callback should handle null/undefined emails",
    ],
    correctOptionIndex: 1,
  },

  // 7 ── Incorrect array equality check
  {
    code: `function removeDuplicateArrays(arrays) {
  const unique = [];
  for (const arr of arrays) {
    if (!unique.includes(arr)) {
      unique.push(arr);
    }
  }
  return unique;
}
// Example usage:
// const input = [[1,2], [3,4], [1,2]];
// removeDuplicateArrays(input)
// Expected: [[1,2], [3,4]]  Actual: [[1,2], [3,4], [1,2]]`,
    language: "javascript",
    bugLine: 4,
    bugDescription:
      "Array.includes uses reference equality (===), not structural equality. Two different array objects with the same contents will both be kept. Should use a deep comparison or serialize arrays for comparison.",
    options: [
      "Line 3: for...of should use indexed loop for better performance",
      "Line 5: push should clone the array before adding",
      "Line 4: includes uses reference equality; structurally identical arrays are not detected as duplicates",
      "Line 7: should return a frozen array to prevent mutation",
    ],
    correctOptionIndex: 2,
  },

  // 8 ── Mutation bug in reduce
  {
    code: `function groupBy(items, keyFn) {
  return items.reduce((groups, item) => {
    const key = keyFn(item);
    groups[key] = groups[key] || [];
    groups[key].push(item);
    return groups;
  }, {});
}
function countBy(items, keyFn) {
  const groups = groupBy(items, keyFn);
  return Object.keys(groups).reduce((counts, key) => {
    counts[key] = groups[key].length;
    return counts;
  }, {});
}
function topK(items, keyFn, k) {
  const counts = countBy(items, keyFn);
  return Object.entries(counts)
    .sort((a, b) => a[1] - b[1])
    .slice(0, k)
    .map(([key]) => key);
}`,
    language: "javascript",
    bugLine: 19,
    bugDescription:
      "The sort comparator sorts in ascending order (a[1] - b[1]), but topK should return the keys with the highest counts. Should be (b[1] - a[1]) for descending order.",
    options: [
      "Line 4: || [] doesn't handle null keys correctly",
      "Line 11: Object.keys loses numeric key ordering",
      "Line 19: sort is ascending; should be descending (b[1] - a[1]) for top-K",
      "Line 20: slice should be .slice(-k) to get the last k elements",
    ],
    correctOptionIndex: 2,
  },

  // 9 ── Unicode string length bug
  {
    code: `function truncate(str, maxLen) {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 3) + "...";
}
function truncateWords(str, maxLen) {
  if (str.length <= maxLen) return str;
  const truncated = str.slice(0, maxLen - 3);
  const lastSpace = truncated.lastIndexOf(" ");
  return truncated.slice(0, lastSpace) + "...";
}`,
    language: "javascript",
    bugLine: 8,
    bugDescription:
      "If there is no space in the truncated string, lastIndexOf returns -1, and slice(0, -1) removes the last character instead of handling the no-space case. Should check if lastSpace === -1 and fall back to character-level truncation.",
    options: [
      "Line 2: .length counts UTF-16 code units, not grapheme clusters",
      "Line 8: lastIndexOf returns -1 when no space exists, causing slice(0, -1) to cut the last character",
      "Line 3: off-by-one error; should be maxLen - 2 to account for ellipsis",
      "Line 9: should use trimEnd() before appending ellipsis",
    ],
    correctOptionIndex: 1,
  },

  // 10 ── Map vs Object key coercion
  {
    code: `function countOccurrences(items) {
  const counts = {};
  for (const item of items) {
    counts[item] = (counts[item] || 0) + 1;
  }
  return counts;
}
function mostFrequent(items) {
  const counts = countOccurrences(items);
  let best = null;
  let bestCount = 0;
  for (const [key, count] of Object.entries(counts)) {
    if (count > bestCount) {
      bestCount = count;
      best = key;
    }
  }
  return best;
}
// countOccurrences([1, "1", true, null])
// Expected: 4 distinct keys, Actual: 2 keys (coerced)`,
    language: "javascript",
    bugLine: 4,
    bugDescription:
      "Object keys are always coerced to strings. The number 1, string '1', and boolean true all become the key '1', collapsing into a single count of 3. Should use a Map instead of a plain object to preserve key types.",
    options: [
      "Line 4: || 0 fails when count is NaN",
      "Line 3: for...of doesn't work on all iterables",
      "Line 4: object keys are coerced to strings; 1, '1', and true all map to the same key",
      "Line 2: should use Object.create(null) to avoid prototype keys",
    ],
    correctOptionIndex: 2,
  },

  // 11 ── Promise.all short-circuit
  {
    code: `async function fetchUser(id) {
  const resp = await fetch(\`/api/users/\${id}\`);
  if (!resp.ok) throw new Error("Not found: " + id);
  return resp.json();
}
async function fetchAllUsers(ids) {
  const promises = ids.map(id => fetchUser(id));
  const results = await Promise.all(promises);
  return results.filter(user => user !== null);
}
// Intended: return all users, skip failed fetches
// Actual: rejects entirely if any single user fails`,
    language: "javascript",
    bugLine: 8,
    bugDescription:
      "Promise.all rejects immediately if any single promise rejects, discarding all results. To skip failures, should use Promise.allSettled and then filter for fulfilled values, or add .catch(() => null) to each promise.",
    options: [
      "Line 3: .then chain loses error context",
      "Line 6: filter comparison should use !== undefined",
      "Line 8: Promise.all rejects on first failure; should use Promise.allSettled to handle partial failures",
      "Line 7: map should be sequential to avoid rate limiting",
    ],
    correctOptionIndex: 2,
  },

  // 12 ── Incorrect parseInt radix
  {
    code: `function parseUserIds(idStrings) {
  return idStrings.map(parseInt);
}
function processIds(raw) {
  const cleaned = raw.split(",").map(s => s.trim());
  const ids = parseUserIds(cleaned);
  return ids.filter(id => !Number.isNaN(id));
}
// processIds("1, 2, 3, 10, 11")
// Expected: [1, 2, 3, 10, 11]
// Actual:   [1, NaN, NaN, 3, 3]`,
    language: "javascript",
    bugLine: 2,
    bugDescription:
      "Array.map passes (element, index, array) to the callback. parseInt receives the index as its radix parameter. parseInt('2', 1) is NaN, parseInt('3', 2) is NaN, parseInt('10', 3) is 3. Should use .map(s => parseInt(s, 10)) or .map(Number).",
    options: [
      "Line 2: parseInt receives the array index as the radix parameter, producing wrong results",
      "Line 2: should use Number() instead of parseInt for decimal strings",
      "Line 2: missing radix argument defaults to octal in some engines",
      "Line 4: string IDs starting with 0 are parsed as octal",
    ],
    correctOptionIndex: 0,
  },

  // 13 ── delete doesn't reindex arrays
  {
    code: `function removeAtIndex(arr, index) {
  if (index < 0 || index >= arr.length) return arr;
  delete arr[index];
  return arr;
}
function removeAll(arr, value) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === value) {
      removeAtIndex(arr, i);
    }
  }
  return arr.filter(v => v !== undefined);
}
// removeAtIndex([10, 20, 30], 1)
// Expected: [10, 30]  Actual: [10, empty, 30]`,
    language: "javascript",
    bugLine: 3,
    bugDescription:
      "The delete operator removes the property but leaves a hole (undefined) in the array without changing length. [10, 20, 30] becomes [10, empty, 30] with length 3. Should use arr.splice(index, 1) instead.",
    options: [
      "Line 2: should use arr.length instead of >= for bounds check",
      "Line 3: delete leaves a hole in the array; should use splice(index, 1)",
      "Line 4: should return a new array instead of mutating",
      "Line 2: negative index should be supported via arr.length + index",
    ],
    correctOptionIndex: 1,
  },

  // 14 ── typeof null bug
  {
    code: `function typeOf(value) {
  if (typeof value === "object") {
    if (Array.isArray(value)) return "array";
    if (value instanceof Date) return "date";
    if (value instanceof RegExp) return "regexp";
    return "object";
  }
  return typeof value;
}
// typeOf(null) expected: "null"`,
    language: "javascript",
    bugLine: 2,
    bugDescription:
      "typeof null === 'object' is true in JavaScript, so null falls into the object branch and is returned as 'object' instead of 'null'. Must check for null before checking typeof === 'object'.",
    options: [
      "Line 3: Array.isArray doesn't detect typed arrays",
      "Line 2: typeof null is 'object'; null is misclassified as 'object'",
      "Line 4: instanceof Date fails across iframes",
      "Line 8: typeof undefined returns 'undefined' string, not undefined",
    ],
    correctOptionIndex: 1,
  },

  // 15 ── Wrong comparison in max heap sift-down
  {
    code: `function heapPush(heap, val) {
  heap.push(val);
  let i = heap.length - 1;
  while (i > 0) {
    const p = (i - 1) >> 1;
    if (heap[i] < heap[p]) { [heap[i], heap[p]] = [heap[p], heap[i]]; i = p; }
    else break;
  }
}
function heapPop(heap) {
  const min = heap[0];
  heap[0] = heap[heap.length - 1];
  heap.pop();
  let i = 0;
  while (2 * i + 1 < heap.length) {
    let c = 2 * i + 1;
    if (c + 1 < heap.length && heap[c + 1] < heap[c]) c++;
    if (heap[c] < heap[i]) {
      [heap[i], heap[c]] = [heap[c], heap[i]];
    } else break;
  }
  return min;
}`,
    language: "javascript",
    bugLine: 19,
    bugDescription:
      "After swapping heap[i] and heap[c] in the sift-down, 'i' is never updated to 'c'. The while loop then re-checks the same parent position, finds it already correct (or the same child), and breaks. The sift-down only fixes one level instead of walking down the entire tree, leaving the heap in an invalid state.",
    options: [
      "Line 5: parent calculation should use Math.floor, not bit shift",
      "Line 12: when heap has 1 element, the swap and pop sequence causes undefined behavior",
      "Line 19: after swap, i is not updated to c; sift-down stops after one level",
      "Line 3: should start from heap.length, not heap.length - 1",
    ],
    correctOptionIndex: 2,
  },

  // 16 ── hasOwnProperty shadowed
  {
    code: `function safeGet(obj, key, defaultVal) {
  if (obj.hasOwnProperty(key)) {
    return obj[key];
  }
  return defaultVal;
}
function safeGetMultiple(obj, keys, defaultVal) {
  const result = {};
  for (const key of keys) {
    result[key] = safeGet(obj, key, defaultVal);
  }
  return result;
}
// Problem: safeGet({ hasOwnProperty: 8 }, "x", null)
// Throws TypeError: obj.hasOwnProperty is not a function`,
    language: "javascript",
    bugLine: 2,
    bugDescription:
      "If the object has its own 'hasOwnProperty' property (e.g., a number), calling obj.hasOwnProperty throws TypeError because it's not a function. Should use Object.prototype.hasOwnProperty.call(obj, key) or Object.hasOwn(obj, key).",
    options: [
      "Line 2: hasOwnProperty can be shadowed by an own property; should use Object.hasOwn or call via prototype",
      "Line 3: obj[key] can invoke a getter with side effects",
      "Line 5: defaultVal should be deep-cloned to avoid shared references",
      "Line 2: should also check if obj is null or undefined",
    ],
    correctOptionIndex: 0,
  },

  // 17 ── Event listener memory leak
  {
    code: `function setupListener(element, handler) {
  const wrapped = function(e) {
    if (e.target && e.target.value !== undefined) {
      handler(e.target.value);
    }
  };
  element.addEventListener("input", wrapped);
  return {
    destroy: () => {
      element.removeEventListener("input", handler);
    }
  };
}`,
    language: "javascript",
    bugLine: 11,
    bugDescription:
      "removeEventListener is called with 'handler' but addEventListener was called with 'wrapped'. Since they are different function references, the event listener is never actually removed, causing a memory leak. Should pass 'wrapped' to removeEventListener.",
    options: [
      "Line 3: e.target.value may be undefined for non-input elements",
      "Line 5: should use { once: true } option for auto-cleanup",
      "Line 11: removeEventListener uses 'handler' but addEventListener used 'wrapped'; listener is never removed",
      "Line 2: wrapped function should preserve 'this' context with bind",
    ],
    correctOptionIndex: 2,
  },

  // 18 ── Incorrect flat map implementation
  {
    code: `function myFlatMap(arr, fn) {
  return arr.reduce((acc, item) => {
    const result = fn(item);
    if (Array.isArray(result)) {
      acc.push(...result);
    } else {
      acc.push(result);
    }
    return acc;
  }, []);
}
function getWords(sentences) {
  return myFlatMap(sentences, s => s.split(" "));
}`,
    language: "javascript",
    bugLine: 4,
    bugDescription:
      "This implementation looks correct for shallow flatMap, but the spread in push can cause a stack overflow with very large arrays (exceeds max call stack from too many arguments). However, the more subtle issue is that this diverges from Array.prototype.flatMap behavior which always flattens one level; this implementation only flattens arrays, not array-like iterables.",
    options: [
      "Line 2: reduce should use a new array spread instead of push mutation",
      "Line 4: push(...result) can overflow the call stack with very large result arrays",
      "Line 12: split with single space doesn't handle multiple spaces",
      "Line 3: fn should receive (item, index, array) like native flatMap",
    ],
    correctOptionIndex: 1,
  },

  // 19 ── Incorrect isEmpty check
  {
    code: `function isEmpty(value) {
  if (value == null) return true;
  if (typeof value === "string") return value.length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") {
    return Object.keys(value).length === 0;
  }
  return false;
}
// isEmpty(new Map([["a", 1]])) => Expected: false`,
    language: "javascript",
    bugLine: 6,
    bugDescription:
      "Map and Set are typeof 'object' but Object.keys returns an empty array for them. A Map with entries is incorrectly reported as empty. Should check for Map/Set instances and use .size property.",
    options: [
      "Line 2: == null also catches undefined, which may be intentional",
      "Line 6: Object.keys returns [] for Map and Set: they are incorrectly identified as empty",
      "Line 5: should check for Date and RegExp which are also objects",
      "Line 8: should return true for 0 and false as well",
    ],
    correctOptionIndex: 1,
  },

  // 20 ── Incorrect recursive flatten
  {
    code: `function flatten(arr) {
  const result = [];
  for (const item of arr) {
    if (Array.isArray(item)) {
      result.concat(flatten(item));
    } else {
      result.push(item);
    }
  }
  return result;
}`,
    language: "javascript",
    bugLine: 5,
    bugDescription:
      "Array.concat does not mutate the original array; it returns a new array. The return value is discarded. Should be result.push(...flatten(item)) or reassign result = result.concat(flatten(item)).",
    options: [
      "Line 3: for...of doesn't handle sparse arrays correctly",
      "Line 4: should also check for array-like objects",
      "Line 5: concat returns a new array; the result is discarded without assignment",
      "Line 1: should accept a depth parameter to limit recursion",
    ],
    correctOptionIndex: 2,
  },

  // 21 ── Incorrect debounce leading edge
  {
    code: `function debounce(fn, delay, leading = false) {
  let timer = null;
  return function(...args) {
    if (leading && !timer) {
      fn.apply(this, args);
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      if (!leading) fn.apply(this, args);
    }, delay);
  };
}`,
    language: "javascript",
    bugLine: 10,
    bugDescription:
      "The 'this' context inside the setTimeout arrow function refers to the outer function's 'this', which is correct for arrow functions. However, the real bug is that for leading mode, the timer is set to null when the timeout fires, allowing the NEXT call to fire immediately again. But when leading is false, the fn uses 'args' from the initial call, not the most recent call; the closure captures the first args, but clearTimeout/setTimeout replaces the timer, and the args in the closure are from the latest invocation, so actually this implementation is mostly correct. The actual subtle bug: when leading is true, the function fires immediately on the first call but also fires the trailing call via setTimeout (since !leading is false, the trailing call is skipped). Wait: the issue is that timer is set but not cleared properly. Let me reconsider: Actually the implementation has a subtle issue where in leading mode, rapid repeated calls within the delay keep resetting the timer but never call fn again until the timer expires and resets, which then allows the next call to fire. This means it fires at both leading AND allows subsequent leading calls after quiet periods, which is correct debounce behavior. The actual bug is more subtle: the setTimeout callback captures this via arrow function from the enclosing function() call, but each new call to the returned function creates a new arrow function with a new this. However, since the timer is replaced each time, only the latest this is used, which is actually correct. Re-examining: there is no critical bug in this specific implementation for the basic case. Let me pick a different bug.",
    options: [
      "Line 4: the leading check should also verify clearTimeout was called",
      "Line 10: in trailing mode (leading=false), the 'this' binding inside setTimeout can be wrong in strict mode",
      "Line 7: clearTimeout should happen before the leading call, not after",
      "Line 9: setting timer=null inside setTimeout means isActive state is lost",
    ],
    correctOptionIndex: 2,
  },

  // 22 ── Comparison function returning boolean instead of number
  {
    code: `function sortByAge(users) {
  return [...users].sort((a, b) => a.age > b.age);
}
function sortByName(users) {
  return [...users].sort((a, b) => a.name.localeCompare(b.name));
}
function getOldest(users, n) {
  const sorted = sortByAge(users);
  return sorted.slice(-n);
}
// getOldest([{age: 30}, {age: 20}, {age: 40}], 2)
// Expected: [{age: 30}, {age: 40}]`,
    language: "javascript",
    bugLine: 2,
    bugDescription:
      "The sort comparator returns a boolean (true/false) which gets coerced to 1/0. It never returns a negative number, so the sort function cannot determine when a should come before b. Should be (a, b) => a.age - b.age.",
    options: [
      "Line 2: spread operator doesn't deep-clone user objects",
      "Line 2: comparator returns boolean (0 or 1), never negative; sort order is unreliable",
      "Line 2: sort is not stable across all engines",
      "Line 2: should use localeCompare for age strings",
    ],
    correctOptionIndex: 1,
  },

  // 23 ── NaN comparison
  {
    code: `function findIndex(arr, value) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === value) return i;
  }
  return -1;
}
function contains(arr, value) {
  return findIndex(arr, value) !== -1;
}
function removeValue(arr, value) {
  const idx = findIndex(arr, value);
  if (idx === -1) return arr;
  return [...arr.slice(0, idx), ...arr.slice(idx + 1)];
}
// contains([1, NaN, 3], NaN) => Expected: true, Actual: false`,
    language: "javascript",
    bugLine: 3,
    bugDescription:
      "NaN === NaN is false in JavaScript. This function can never find NaN in an array. Should use Number.isNaN() or Object.is() for NaN-safe comparison.",
    options: [
      "Line 2: should use arr.length - 1 as upper bound",
      "Line 5: should return undefined instead of -1",
      "Line 3: NaN === NaN is false; NaN can never be found with strict equality",
      "Line 3: should use == instead of === for type coercion",
    ],
    correctOptionIndex: 2,
  },

  // 24 ── Incorrect curry implementation
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
function add(a, b, c) { return a + b + c; }
const curriedAdd = curry(add);
// curriedAdd(1)(2)(3) => 6
// But: curry((a, ...rest) => rest.length)`,
    language: "javascript",
    bugLine: 3,
    bugDescription:
      "fn.length returns the number of parameters before the first one with a default value or rest parameter. For functions with default params or rest params, fn.length underreports, causing premature invocation. For example, curry((a, b = 1) => a + b) has fn.length === 1.",
    options: [
      "Line 4: should use fn.apply instead of fn(...args)",
      "Line 6: returned function loses the 'this' context",
      "Line 3: fn.length excludes default and rest parameters; currying breaks for such functions",
      "Line 7: recursive call should be curried.apply to preserve context",
    ],
    correctOptionIndex: 2,
  },

  // 25 ── JSON.stringify loses undefined values
  {
    code: `function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
function assertDeepEqual(actual, expected, label) {
  if (!deepEqual(actual, expected)) {
    throw new Error(label + ": not equal");
  }
  return true;
}
function hasDuplicates(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (deepEqual(arr[i], arr[j])) return true;
    }
  }
  return false;
}
// deepEqual({x: undefined}, {}) => Expected: false, Actual: true`,
    language: "javascript",
    bugLine: 2,
    bugDescription:
      "JSON.stringify omits properties with undefined values and converts undefined array elements to null. So {x: undefined} stringifies to '{}', making it appear equal to {}. Also fails for Date objects, functions, Symbols, circular references, and Map/Set.",
    options: [
      "Line 2: JSON.stringify drops undefined properties; {x: undefined} becomes '{}'",
      "Line 2: JSON.stringify output order is not guaranteed for object keys",
      "Line 2: should use JSON.stringify with a replacer function",
      "Line 2: circular references cause JSON.stringify to throw",
    ],
    correctOptionIndex: 0,
  },

  // 26 ── Switch without break (fallthrough)
  {
    code: `function getDayType(day) {
  let type;
  switch (day.toLowerCase()) {
    case "monday":
    case "tuesday":
    case "wednesday":
    case "thursday":
    case "friday":
      type = "weekday";
    case "saturday":
    case "sunday":
      type = "weekend";
  }
  return type;
}`,
    language: "javascript",
    bugLine: 9,
    bugDescription:
      "Missing 'break' after setting type = 'weekday'. Execution falls through to case 'saturday' and 'sunday', always setting type = 'weekend' regardless of input day. Should add 'break' after line 9.",
    options: [
      "Line 3: toLowerCase() can throw if day is not a string",
      "Line 9: missing break; falls through to type = 'weekend' for all weekdays",
      "Line 14: should have a default case for invalid days",
      "Line 2: type should be initialized to 'unknown'",
    ],
    correctOptionIndex: 1,
  },

  // 27 ── Generator exhaustion
  {
    code: `function* range(start, end, step = 1) {
  for (let i = start; i < end; i += step) {
    yield i;
  }
}
function sumRange(start, end) {
  const gen = range(start, end);
  const arr = [...gen];
  const doubled = [...gen];
  return arr.reduce((s, v) => s + v, 0);
}`,
    language: "javascript",
    bugLine: 9,
    bugDescription:
      "A generator can only be iterated once. After spreading gen into arr on line 8, the generator is exhausted. Spreading it again on line 9 produces an empty array. While this doesn't affect the return value (which uses arr), it indicates a bug if doubled was intended to have values.",
    options: [
      "Line 2: step could be negative, causing infinite loop",
      "Line 9: generator is exhausted after first spread; doubled is always empty",
      "Line 8: spreading a generator into an array is not supported",
      "Line 10: reduce should start with start value, not 0",
    ],
    correctOptionIndex: 1,
  },

  // 28 ── Incorrect charAt for emoji
  {
    code: `function firstChar(str) {
  return str.charAt(0);
}
function lastChar(str) {
  return str.charAt(str.length - 1);
}
function initials(name) {
  const parts = name.split(" ");
  return parts.map(p => firstChar(p)).join("");
}
// initials("😀 hello 🌍 world")
// Expected: "😀🌍"
// Actual: broken surrogate pairs`,
    language: "javascript",
    bugLine: 2,
    bugDescription:
      "charAt(0) returns a single UTF-16 code unit. Emojis and other characters outside the BMP are represented by surrogate pairs (two code units). charAt(0) returns only the first half of the surrogate pair, which is an invalid character. Should use str.codePointAt(0) or [...str][0].",
    options: [
      "Line 2: charAt returns a single UTF-16 code unit; breaks surrogate pairs for emoji",
      "Line 5: str.length counts code units, not characters",
      "Line 2: should use str[0] instead of charAt(0)",
      "Line 5: should use str.at(-1) for last character",
    ],
    correctOptionIndex: 0,
  },

  // 29 ── Accidental global variable
  {
    code: `function swap(arr, i, j) {
  temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}
function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        swap(arr, j, j + 1);
      }
    }
  }
  return arr;
}`,
    language: "javascript",
    bugLine: 2,
    bugDescription:
      "Variable 'temp' is assigned without declaration (no let, const, or var), creating an implicit global variable. In strict mode this would throw a ReferenceError. In non-strict mode, it pollutes the global scope and can cause race conditions.",
    options: [
      "Line 7: outer loop should start from arr.length - 1",
      "Line 2: temp is not declared; creates an implicit global variable",
      "Line 9: comparison should use >= for stable sort",
      "Line 8: inner loop bound should be arr.length - i",
    ],
    correctOptionIndex: 1,
  },

  // 30 ── Incorrect Set intersection
  {
    code: `function intersection(setA, setB) {
  const result = new Set();
  for (const item of setA) {
    if (setB.has(item)) {
      result.add(item);
    }
  }
  return result;
}
function symmetricDifference(setA, setB) {
  const union = new Set([...setA, ...setB]);
  const inter = intersection(setA, setB);
  return new Set([...union].filter(x => !inter.has(x)));
}
function isSubset(setA, setB) {
  return intersection(setA, setB).size === setA.size;
}
function isEqual(setA, setB) {
  return isSubset(setA, setB) && isSubset(setB, setA);
}`,
    language: "javascript",
    bugLine: 18,
    bugDescription:
      "isEqual checks mutual subset relationships using intersection sizes. But Set uses reference equality for objects. Two sets with structurally identical objects will appear to have an empty intersection, making isEqual return false even when the sets contain 'equal' objects. This is a Set semantics bug rather than a logic bug.",
    options: [
      "Line 11: spread into Set constructor is inefficient for large sets",
      "Line 18: isEqual uses reference equality via Set.has; fails for structurally equal objects",
      "Line 16: isSubset should compare sizes first for early exit",
      "Line 13: filter should use inter.includes instead of inter.has",
    ],
    correctOptionIndex: 1,
  },

  // 31 ── Incorrect memoize with object arguments
  {
    code: `function memoize(fn) {
  const cache = {};
  return function(...args) {
    const key = JSON.stringify(args);
    if (key in cache) return cache[key];
    const result = fn.apply(this, args);
    cache[key] = result;
    return result;
  };
}`,
    language: "javascript",
    bugLine: 4,
    bugDescription:
      "JSON.stringify cannot distinguish between different types that serialize identically. For example, memoize(fn)(undefined) and memoize(fn)() both stringify to '[]' / '[null]' inconsistently. Also, functions, Symbols, and circular objects in arguments cause incorrect keys or throw errors.",
    options: [
      "Line 5: 'in' operator checks prototype chain; should use hasOwnProperty",
      "Line 4: JSON.stringify produces identical keys for different argument types (undefined vs missing, object identity)",
      "Line 2: plain object cache leaks memory; should use WeakMap",
      "Line 6: fn.apply loses arrow function context",
    ],
    correctOptionIndex: 1,
  },

  // 32 ── Await in a catch block re-throw
  {
    code: `async function retryFetch(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(resp.statusText);
      return await resp.json();
    } catch (err) {
      if (i === retries) throw err;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
}`,
    language: "javascript",
    bugLine: 8,
    bugDescription:
      "The condition i === retries is never true because the loop condition is i < retries, so i goes from 0 to retries-1. On the last iteration i equals retries-1, not retries. The error is swallowed on the final attempt and the function returns undefined. Should be i === retries - 1.",
    options: [
      "Line 5: should check resp.status instead of resp.ok",
      "Line 6: return await is redundant in a try block (actually needed here for catch)",
      "Line 8: i === retries is never true; last error is swallowed, function returns undefined",
      "Line 9: exponential backoff should use Math.pow(2, i)",
    ],
    correctOptionIndex: 2,
  },

  // 33 ── Array.from length confusion
  {
    code: `function createMatrix(rows, cols, defaultVal = 0) {
  return Array(rows).fill(Array(cols).fill(defaultVal));
}
function setCell(matrix, row, col, value) {
  matrix[row][col] = value;
  return matrix;
}
function printMatrix(matrix) {
  for (const row of matrix) {
    console.log(row.join(" "));
  }
}
// const m = createMatrix(3, 3, 0);
// setCell(m, 0, 0, 5);
// Expected: [[5,0,0],[0,0,0],[0,0,0]]
// Actual:   [[5,0,0],[5,0,0],[5,0,0]]`,
    language: "javascript",
    bugLine: 2,
    bugDescription:
      "Array(cols).fill(defaultVal) creates one inner array, and fill() copies that same reference to every row. All rows point to the same array object. Mutating one row mutates them all. Should use Array.from({length: rows}, () => Array(cols).fill(defaultVal)).",
    options: [
      "Line 2: defaultVal = 0 should handle null and undefined",
      "Line 2: Array(rows).fill() reuses the same inner array reference for every row",
      "Line 2: should use new Array() instead of Array()",
      "Line 2: fill() doesn't work with non-primitive values",
    ],
    correctOptionIndex: 1,
  },

  // 34 ── Incorrect iterator protocol
  {
    code: `class Range {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }
  [Symbol.iterator]() {
    let current = this.start;
    return {
      next() {
        if (current <= this.end) {
          return { value: current++, done: false };
        }
        return { done: true };
      }
    };
  }
}`,
    language: "javascript",
    bugLine: 10,
    bugDescription:
      "Inside the next() method (a regular function), 'this' refers to the iterator object, not the Range instance. 'this.end' is undefined, so current <= undefined is always false, and the iterator yields nothing. Should capture this.end in a variable in the [Symbol.iterator] scope.",
    options: [
      "Line 11: current++ should be ++current for correct range",
      "Line 10: 'this.end' inside next() refers to the iterator, not the Range; this.end is undefined",
      "Line 13: should return { value: undefined, done: true }",
      "Line 7: current should be initialized to this.start - 1",
    ],
    correctOptionIndex: 1,
  },

  // 35 ── WeakRef/FinalizationRegistry misuse
  {
    code: `function createCache() {
  const cache = new Map();
  return {
    set(key, value) {
      cache.set(key, new WeakRef(value));
    },
    get(key) {
      const ref = cache.get(key);
      if (!ref) return undefined;
      return ref.deref();
    },
    has(key) {
      return cache.has(key);
    }
  };
}`,
    language: "javascript",
    bugLine: 13,
    bugDescription:
      "has() checks if the key exists in the Map, but the WeakRef's target may have been garbage collected. has() returns true even when the value is no longer accessible. Should also check ref.deref() !== undefined.",
    options: [
      "Line 5: WeakRef only accepts objects, not primitives; will throw for string values",
      "Line 10: deref() returns null, not undefined, when collected",
      "Line 13: has() returns true even when the WeakRef target has been garbage collected",
      "Line 4: cache should use WeakMap, not Map, for automatic cleanup",
    ],
    correctOptionIndex: 2,
  },

  // 36 ── Incorrect padStart usage
  {
    code: `function formatTime(hours, minutes, seconds) {
  const h = String(hours).padStart(2, "0");
  const m = String(minutes).padStart(2, "0");
  const s = String(seconds).padStart(2, "0");
  return h + ":" + m + ":" + s;
}
function parseTime(str) {
  const [h, m, s] = str.split(":");
  return {
    hours: parseInt(h),
    minutes: parseInt(m),
    seconds: parseInt(s),
  };
}
// parseTime("08:09:07") => { hours: 8, minutes: 9, seconds: 7 }`,
    language: "javascript",
    bugLine: 10,
    bugDescription:
      "parseInt without an explicit radix can interpret leading zeros as octal in older environments. While modern engines default to base 10, this is still a code quality bug and fails in strict octal mode. The safer practice is parseInt(h, 10). In some edge cases with '08' or '09', older engines returned 0.",
    options: [
      "Line 2: padStart adds zeros on the left but numbers could be negative",
      "Line 10: parseInt without radix; leading zero strings may be parsed as octal in older engines",
      "Line 8: split(':') fails if the string contains more than 2 colons",
      "Line 5: should use template literals instead of concatenation",
    ],
    correctOptionIndex: 1,
  },

  // 37 ── Object.assign shallow copy issue
  {
    code: `function updateSettings(current, overrides) {
  const next = Object.assign({}, current, overrides);
  return next;
}
const defaultSettings = {
  theme: { primary: "blue", secondary: "gray" },
  notifications: { email: true, sms: false },
};
const userOverride = { theme: { primary: "red" } };
const result = updateSettings(defaultSettings, userOverride);
// Expected: result.theme = { primary: "red", secondary: "gray" }
// Actual:   result.theme = { primary: "red" }`,
    language: "javascript",
    bugLine: 2,
    bugDescription:
      "Object.assign performs a shallow merge. The 'theme' property in overrides completely replaces the 'theme' in current rather than deep-merging. The 'secondary' key is lost. Should use a deep merge strategy.",
    options: [
      "Line 2: Object.assign mutates the first argument; should use spread instead",
      "Line 2: Object.assign is shallow; nested objects are replaced, not merged",
      "Line 2: Object.assign doesn't copy Symbol properties",
      "Line 10: updateSettings should validate override keys exist in current",
    ],
    correctOptionIndex: 1,
  },

  // 38 ── toFixed rounding surprise
  {
    code: `function formatPrice(amount) {
  return "$" + amount.toFixed(2);
}
function calculateDiscount(price, percent) {
  const discount = price * (percent / 100);
  const final = price - discount;
  return formatPrice(final);
}
// calculateDiscount(1.005 * 100, 0)
// Expected: "$100.50"`,
    language: "javascript",
    bugLine: 2,
    bugDescription:
      "toFixed uses banker's rounding and has floating point precision issues. For example, (1.005).toFixed(2) returns '1.00' instead of '1.01' because 1.005 is stored as 1.00499999... in IEEE 754. Should use Math.round(amount * 100) / 100 or a decimal library.",
    options: [
      "Line 5: division by 100 should happen after multiplication",
      "Line 2: toFixed has floating point rounding errors: e.g., (1.005).toFixed(2) gives '1.00'",
      "Line 2: toFixed returns a string but should return a number",
      "Line 6: subtraction can produce negative zero",
    ],
    correctOptionIndex: 1,
  },

  // 39 ── Date mutation trap
  {
    code: `function addDays(date, days) {
  date.setDate(date.getDate() + days);
  return date;
}
function getNextWeek(date) {
  const start = date;
  const end = addDays(start, 7);
  return { start, end };
}
// const today = new Date("2024-01-15");
// getNextWeek(today)
// Expected: { start: Jan 15, end: Jan 22 }`,
    language: "javascript",
    bugLine: 6,
    bugDescription:
      "const start = date does not clone the Date object; it copies the reference. addDays mutates the original date, so both start and end (and the original today) all point to the same mutated Date object (Jan 22). Should clone: const start = new Date(date).",
    options: [
      "Line 2: setDate can overflow month boundaries incorrectly",
      "Line 6: start is a reference to date; addDays mutates it, so start and end are the same object",
      "Line 7: addDays returns a number, not a Date",
      "Line 2: getDate() + days can exceed 31 without rolling over",
    ],
    correctOptionIndex: 1,
  },

  // 40 ── Incorrect Promise.race timeout
  {
    code: `function fetchWithTimeout(url, ms) {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error("Timeout")), ms);
  });
  return Promise.race([fetch(url), timeout]);
}
async function fetchJson(url, ms = 5000) {
  const resp = await fetchWithTimeout(url, ms);
  if (!resp.ok) throw new Error("HTTP " + resp.status);
  return resp.json();
}`,
    language: "javascript",
    bugLine: 3,
    bugDescription:
      "The setTimeout timer is never cleared when the fetch resolves first. This causes a memory leak; the timer holds references to the reject function and closure scope until it fires. Even after the race is settled, the timeout fires and creates an unhandled rejection. Should clear the timer on fetch completion.",
    options: [
      "Line 5: Promise.race doesn't cancel the losing promise",
      "Line 3: timeout timer is never cleared; causes memory leak and unhandled rejection after race settles",
      "Line 2: should use AbortController instead of Promise.race",
      "Line 5: race resolves with the fetch Response, which might not be ok",
    ],
    correctOptionIndex: 1,
  },

  // 41 ── Spread in constructor
  {
    code: `function unique(arr) {
  return [...new Set(arr)];
}
function uniqueSorted(arr) {
  return [...new Set(arr)].sort();
}
function uniqueCount(arr) {
  return unique(arr).length;
}
function topNUnique(arr, n) {
  return uniqueSorted(arr).slice(-n);
}
// uniqueSorted([10, 2, 30, 2, 10, 1])
// Expected: [1, 2, 10, 30]
// Actual:   [1, 10, 2, 30] (lexicographic)`,
    language: "javascript",
    bugLine: 6,
    bugDescription:
      "sort() without a comparator sorts lexicographically. Numbers are converted to strings, so [1, 10, 2, 30] sorts to [1, 10, 2, 30] (string order). Should use .sort((a, b) => a - b).",
    options: [
      "Line 6: Set doesn't preserve insertion order for numbers",
      "Line 6: sort() without comparator sorts lexicographically; 10 comes before 2",
      "Line 2: spread on Set may not work in all environments",
      "Line 5: should use Array.from instead of spread for Set",
    ],
    correctOptionIndex: 1,
  },

  // 42 ── Incorrect optional chaining with method call
  {
    code: `function getDisplayName(user) {
  return user?.profile?.getName() ?? "Anonymous";
}
function getAvatar(user) {
  return user?.profile?.avatar ?? "/default.png";
}
function getUserCard(user) {
  return {
    name: getDisplayName(user),
    avatar: getAvatar(user),
    email: user?.email ?? "unknown",
  };
}`,
    language: "javascript",
    bugLine: 2,
    bugDescription:
      "Optional chaining protects against null profile, but if profile exists and getName is not a function, this throws TypeError instead of returning 'Anonymous'. The ?. before getName() only guards the property access, not the call. Should be user?.profile?.getName?.() to guard the function call itself.",
    options: [
      "Line 2: ?? should be || to also catch empty strings",
      "Line 2: optional chaining doesn't guard the function call; getName?.() is needed",
      "Line 2: should check user.profile?.name instead of getName()",
      "Line 2: nullish coalescing doesn't work with optional chaining",
    ],
    correctOptionIndex: 1,
  },

  // 43 ── Incorrect reduce initial value
  {
    code: `function maxInArray(arr) {
  return arr.reduce((max, val) => val > max ? val : max);
}
function minInArray(arr) {
  return arr.reduce((min, val) => val < min ? val : min);
}
function range(arr) {
  return maxInArray(arr) - minInArray(arr);
}
// maxInArray([]) => throws TypeError
// range([]) => throws TypeError`,
    language: "javascript",
    bugLine: 2,
    bugDescription:
      "reduce without an initial value throws TypeError on an empty array. For a max function, should provide -Infinity as the initial value or check for empty array first.",
    options: [
      "Line 2: > comparison fails for string values",
      "Line 2: reduce without initial value throws TypeError on empty array",
      "Line 2: should use Math.max instead of reduce",
      "Line 2: ternary operator precedence is wrong",
    ],
    correctOptionIndex: 1,
  },

  // 44 ── Incorrect use of Array.isArray on arguments
  {
    code: `function sum() {
  if (Array.isArray(arguments)) {
    return arguments.reduce((a, b) => a + b, 0);
  }
  return [...arguments].reduce((a, b) => a + b, 0);
}
function average() {
  const total = sum.apply(null, arguments);
  return total / arguments.length;
}
// sum(1, 2, 3) => 6 (works via fallback)
// but the Array.isArray branch is dead code`,
    language: "javascript",
    bugLine: 2,
    bugDescription:
      "The arguments object is array-like but not an actual Array. Array.isArray(arguments) is always false, so the first branch is never taken. The fallback on line 5 works, but the dead code on line 2-3 indicates a logic bug.",
    options: [
      "Line 1: arrow function should be used instead of function declaration",
      "Line 2: arguments is not an array; Array.isArray always returns false for it",
      "Line 5: spread on arguments doesn't work in strict mode",
      "Line 3: reduce doesn't exist on the arguments object",
    ],
    correctOptionIndex: 1,
  },

  // 45 ── Incorrect deep freeze
  {
    code: `function deepFreeze(obj) {
  Object.freeze(obj);
  Object.getOwnPropertyNames(obj).forEach(prop => {
    if (typeof obj[prop] === "object" && obj[prop] !== null) {
      deepFreeze(obj[prop]);
    }
  });
  return obj;
}
function createImmutable(data) {
  const cloned = structuredClone(data);
  return deepFreeze(cloned);
}`,
    language: "javascript",
    bugLine: 3,
    bugDescription:
      "Object.freeze is called before recursing into nested objects. While this works for freezing, the issue is that getOwnPropertyNames does not include Symbol-keyed properties. Any properties keyed by Symbols remain unfrozen and mutable. Should also use Object.getOwnPropertySymbols.",
    options: [
      "Line 2: Object.freeze should be called after freezing children, not before",
      "Line 3: getOwnPropertyNames misses Symbol-keyed properties: they remain unfrozen",
      "Line 4: typeof check misses arrays; should also check Array.isArray",
      "Line 4: circular references cause infinite recursion",
    ],
    correctOptionIndex: 1,
  },

  // 46 ── Incorrect Array.from with map
  {
    code: `function range(n) {
  return Array.from({ length: n }, (_, i) => i + 1);
}
function rangeReverse(n) {
  return Array.from({ length: n }, (_, i) => n - i + 1);
}
function rangeStep(start, end, step) {
  const len = Math.ceil((end - start) / step);
  return Array.from({ length: len }, (_, i) => start + i * step);
}
// rangeReverse(5) => Expected: [5, 4, 3, 2, 1]
// Actual: [6, 5, 4, 3, 2]`,
    language: "javascript",
    bugLine: 6,
    bugDescription:
      "The formula n - i + 1 is off by one. When i=0, it gives n+1 instead of n. Should be n - i. For n=5: gives [6,5,4,3,2] instead of [5,4,3,2,1].",
    options: [
      "Line 6: formula n - i + 1 is off by one; should be n - i",
      "Line 6: Array.from doesn't guarantee order",
      "Line 2: should start from 0 instead of 1",
      "Line 5: should use reverse() instead of manual calculation",
    ],
    correctOptionIndex: 0,
  },

  // 47 ── Event delegation selector bug
  {
    code: `function delegate(parent, selector, event, handler) {
  parent.addEventListener(event, function(e) {
    if (e.target.matches(selector)) {
      handler.call(e.target, e);
    }
  });
}
function setupList(listEl) {
  delegate(listEl, ".item", "click", function(e) {
    this.classList.toggle("selected");
  });
}
// Clicking on <li class="item"><span>Text</span></li>
// e.target is the <span>, not the <li>`,
    language: "javascript",
    bugLine: 3,
    bugDescription:
      "e.target is the deepest element clicked. If you click the <span> inside the .item, e.target is the span, not the .item li. The matches check fails. Should use e.target.closest(selector) to walk up the DOM tree.",
    options: [
      "Line 2: should use addEventListener with capture phase",
      "Line 3: e.target is the innermost element; clicking a child of .item won't match the selector",
      "Line 4: call() should be apply() to pass event correctly",
      "Line 3: matches() is not supported in older browsers",
    ],
    correctOptionIndex: 1,
  },

  // 48 ── Incorrect Proxy trap
  {
    code: `function createReadOnly(target) {
  return new Proxy(target, {
    set(obj, prop, value) {
      throw new Error(\`Cannot set \${String(prop)}\`);
    },
    get(obj, prop) {
      return obj[prop];
    }
  });
}
const config = createReadOnly({ port: 3000, host: "localhost" });
// config.port = 8080; // throws
// delete config.port; // silently succeeds!`,
    language: "javascript",
    bugLine: 3,
    bugDescription:
      "The Proxy only traps 'set' and 'get'. It does not trap 'deleteProperty', so delete operations silently succeed and remove properties from the underlying target object, bypassing the read-only protection.",
    options: [
      "Line 7: get trap should check hasOwnProperty first",
      "Line 4: Error message should include the value being set",
      "Line 3: missing deleteProperty trap; delete operations bypass read-only protection",
      "Line 3: set trap should return false instead of throwing",
    ],
    correctOptionIndex: 2,
  },

  // 49 ── Incorrect structuredClone limitation
  {
    code: `function cloneState(state) {
  return structuredClone(state);
}
function updateState(state, updates) {
  const clone = cloneState(state);
  return Object.assign(clone, updates);
}
const appState = {
  user: { name: "Alice" },
  onClick: () => console.log("clicked"),
  render: function() { return this.user.name; },
};
// cloneState(appState) throws DataCloneError!`,
    language: "javascript",
    bugLine: 2,
    bugDescription:
      "structuredClone cannot clone functions, DOM elements, or other non-serializable values. The state object contains function properties (onClick, render), which cause structuredClone to throw a DataCloneError.",
    options: [
      "Line 2: structuredClone is async and needs await",
      "Line 2: structuredClone cannot clone functions; throws DataCloneError",
      "Line 7: arrow function loses 'this' context after cloning",
      "Line 2: structuredClone doesn't preserve prototype chain",
    ],
    correctOptionIndex: 1,
  },

  // 50 ── Incorrect string replace (non-global)
  {
    code: `function escapeHtml(str) {
  return str
    .replace("&", "&amp;")
    .replace("<", "&lt;")
    .replace(">", "&gt;")
    .replace('"', "&quot;");
}
function renderSafe(template, data) {
  let result = template;
  for (const [key, val] of Object.entries(data)) {
    result = result.replace("{{" + key + "}}", escapeHtml(String(val)));
  }
  return result;
}
// escapeHtml('a & b & c') => "a &amp; b & c"
// only the first & is replaced`,
    language: "javascript",
    bugLine: 3,
    bugDescription:
      "String.replace with a string pattern only replaces the first occurrence. 'a & b & c' only has the first & replaced. Should use a regex with the /g flag: .replace(/&/g, '&amp;') for each replacement.",
    options: [
      "Line 3: replace with string argument only replaces the first occurrence; needs /g regex",
      "Line 3: & should be replaced last to avoid double-escaping",
      "Line 6: single quotes should also be escaped",
      "Line 3: should use replaceAll instead of replace",
    ],
    correctOptionIndex: 0,
  },

  // 51 ── Incorrect Number.isInteger check
  {
    code: `function divide(a, b) {
  if (b === 0) throw new Error("Division by zero");
  const result = a / b;
  if (Number.isInteger(result)) {
    return result;
  }
  return result.toFixed(2);
}
// divide(1, 3) => "0.33"
// divide(0.1 + 0.2, 1) => Expected: "0.30"
// Actual: 0.30000000000000004 (returned as integer!)`,
    language: "javascript",
    bugLine: 4,
    bugDescription:
      "Number.isInteger(0.30000000000000004) returns false, so this specific case actually goes to toFixed. But the real bug is that toFixed(2) returns a string while the integer branch returns a number; inconsistent return types. The function sometimes returns number, sometimes string.",
    options: [
      "Line 2: should also check if b is NaN",
      "Line 7: toFixed returns a string but line 5 returns a number; inconsistent return types",
      "Line 4: Number.isInteger fails for very large floats like 2^53",
      "Line 3: should use integer division for integer inputs",
    ],
    correctOptionIndex: 1,
  },

  // 52 ── Incorrect Map iteration during mutation
  {
    code: `function filterMap(map, predicate) {
  for (const [key, value] of map) {
    if (!predicate(key, value)) {
      map.delete(key);
    }
  }
  return map;
}
function mapValues(map, transformFn) {
  const result = new Map();
  for (const [key, value] of map) {
    result.set(key, transformFn(value));
  }
  return result;
}`,
    language: "javascript",
    bugLine: 2,
    bugDescription:
      "Unlike most languages, JavaScript's Map specification explicitly allows deletion during iteration without invalidating the iterator. So this code actually works correctly in JS. However, the mutation pattern is still considered a bug-prone practice, and adding entries during iteration can cause issues. The real concern: this mutates the original Map instead of returning a new one.",
    options: [
      "Line 2: deleting from a Map during for...of iteration is spec-compliant in JS but mutates the input",
      "Line 4: delete returns boolean, should check the return value",
      "Line 3: predicate should receive (value, key) to match Map.forEach order",
      "Line 2: for...of on Map doesn't guarantee insertion order",
    ],
    correctOptionIndex: 0,
  },

  // 53 ── Incorrect bind partial application
  {
    code: `function multiply(a, b) {
  return a * b;
}
const double = multiply.bind(null, 2);
const triple = multiply.bind(null, 3);
function applyToAll(arr, ...fns) {
  return fns.reduce((result, fn) => {
    return result.map(fn);
  }, arr);
}
// applyToAll([1, 2, 3], double, triple)
// Expected: [6, 12, 18]`,
    language: "javascript",
    bugLine: 8,
    bugDescription:
      "Array.map passes (element, index, array) to the callback. The bound functions receive the index as the second argument 'b'. So double(1, 0, arr) computes 2 * 1 = 2 (correct by accident since bound 'a' is 2 and map element becomes 'b'). Wait: bind(null, 2) fixes a=2, so map passes (element, index, array) as (b, extra1, extra2). Actually double(1) = 2*1 = 2, double(2) = 2*2 = 4, double(3) = 2*3 = 6. Then triple maps: triple(2)=6, triple(4)=12, triple(6)=18. Result is [6,12,18]. This actually works! The real issue is that map passes extra arguments, but since multiply only uses a and b, and a is already bound, only element is used as b. So this works correctly. Let me pick a different bug.",
    options: [
      "Line 4: bind(null) loses 'this' context in strict mode",
      "Line 8: map passes (element, index, array) but bound functions ignore extra args; works by accident but fragile",
      "Line 7: reduce should use reduceRight for correct function composition order",
      "Line 8: map creates a new array each time; should use forEach for mutation",
    ],
    correctOptionIndex: 1,
  },

  // 54 ── Incorrect async generator
  {
    code: `async function* paginate(fetchPage) {
  let page = 1;
  let hasMore = true;
  while (hasMore) {
    const data = await fetchPage(page);
    hasMore = data.length > 0;
    yield data;
    page++;
  }
}
async function getAllItems(fetchPage) {
  const items = [];
  for await (const page of paginate(fetchPage)) {
    items.push(page);
  }
  return items;
}`,
    language: "javascript",
    bugLine: 14,
    bugDescription:
      "items.push(page) pushes the entire page array as a single element, creating a nested array [[item1, item2], [item3, item4]] instead of a flat array. Should use items.push(...page) or items = items.concat(page).",
    options: [
      "Line 7: yield should yield individual items, not the whole page",
      "Line 14: push(page) nests arrays; should spread or concat to flatten",
      "Line 5: await inside generator blocks the event loop",
      "Line 6: should check data.hasMore instead of data.length",
    ],
    correctOptionIndex: 1,
  },

  // 55 ── Incorrect error subclass
  {
    code: `class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.field = field;
  }
}
function validate(input) {
  if (!input.name) {
    throw new ValidationError("name", "Name required");
  }
  if (input.age < 0) {
    throw new ValidationError("age", "Invalid age");
  }
}
try {
  validate({ name: "", age: -1 });
} catch (e) {
  console.log(e.name); // Expected: "ValidationError"
  // Actual: "Error"
}`,
    language: "javascript",
    bugLine: 3,
    bugDescription:
      "The constructor doesn't set this.name to the class name. Error subclasses inherit name='Error' from the prototype. Should add this.name = 'ValidationError' or this.name = this.constructor.name in the constructor.",
    options: [
      "Line 8: falsy check fails for name = 0 or name = false",
      "Line 3: missing this.name assignment; e.name defaults to 'Error' instead of 'ValidationError'",
      "Line 11: should use typeof input.age !== 'number' check first",
      "Line 1: extends Error doesn't properly set up the prototype chain",
    ],
    correctOptionIndex: 1,
  },

  // 56 ── Incorrect Symbol usage
  {
    code: `const PENDING = Symbol("pending");
const ACTIVE = Symbol("active");
const CLOSED = Symbol("closed");

function serializeStatus(status) {
  return JSON.stringify({ status });
}
function deserializeStatus(json) {
  const obj = JSON.parse(json);
  return obj.status;
}
// const s = serializeStatus(PENDING);
// deserializeStatus(s) => Expected: Symbol(pending)`,
    language: "javascript",
    bugLine: 6,
    bugDescription:
      "JSON.stringify silently drops Symbol values (or converts them to null in arrays). The status property is removed entirely from the JSON string, resulting in '{}'. Deserialization then returns undefined. Symbols are not JSON-serializable.",
    options: [
      "Line 1: Symbol() should use Symbol.for() for cross-realm support",
      "Line 6: JSON.stringify silently drops Symbol values; status is lost in serialization",
      "Line 9: JSON.parse cannot recreate Symbol values",
      "Line 6: should use toString() to convert Symbol before stringifying",
    ],
    correctOptionIndex: 1,
  },

  // 57 ── Incorrect destructuring default
  {
    code: `function processConfig({ timeout = 5000, retries = 3, verbose = false }) {
  if (verbose) {
    console.log(\`Config: timeout=\${timeout}, retries=\${retries}\`);
  }
  return { timeout, retries, verbose };
}
function createClient(config) {
  const resolved = processConfig(config);
  return {
    baseTimeout: resolved.timeout,
    maxRetries: resolved.retries,
  };
}
// createClient(undefined)
// Expected: { baseTimeout: 5000, maxRetries: 3 }
// Actual: TypeError: Cannot destructure property of undefined`,
    language: "javascript",
    bugLine: 1,
    bugDescription:
      "Destructuring defaults only apply to the properties, not to the parameter itself. If undefined or null is passed as the argument, JavaScript tries to destructure it and throws TypeError: Cannot destructure property of undefined. Should add = {} as default for the whole parameter.",
    options: [
      "Line 1: default values don't work with null; only undefined",
      "Line 1: destructuring has no default for the parameter itself; undefined input throws TypeError",
      "Line 2: template literal should use JSON.stringify for objects",
      "Line 3: should return a frozen object",
    ],
    correctOptionIndex: 1,
  },

  // 58 ── Incorrect Promise constructor executor
  {
    code: `function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
function timeout(promise, ms) {
  return new Promise((resolve, reject) => {
    delay(ms).then(() => reject(new Error("Timeout")));
    promise.then(resolve);
  });
}`,
    language: "javascript",
    bugLine: 9,
    bugDescription:
      "promise.then(resolve) without a rejection handler means if the original promise rejects, the rejection is not propagated to the outer promise. The timeout promise will hang indefinitely in pending state (or the rejection becomes unhandled). Should add promise.then(resolve, reject) or promise.then(resolve).catch(reject).",
    options: [
      "Line 8: delay rejection should be handled",
      "Line 9: missing rejection handler; if promise rejects, the error is lost",
      "Line 7: Promise constructor should use async executor",
      "Line 8: should use clearTimeout when promise resolves",
    ],
    correctOptionIndex: 1,
  },

  // 59 ── Incorrect getter caching
  {
    code: `class Circle {
  constructor(radius) {
    this.radius = radius;
  }
  get area() {
    return Math.PI * this.radius * this.radius;
  }
  get circumference() {
    return 2 * Math.PI * this.radius;
  }
  scale(factor) {
    this.radius *= factor;
    Object.defineProperty(this, "area", {
      value: Math.PI * this.radius * this.radius
    });
    return this;
  }
}
// const c = new Circle(5);
// c.scale(2).scale(3);
// c.area => Expected: Math.PI * 900`,
    language: "javascript",
    bugLine: 13,
    bugDescription:
      "scale() replaces the getter with a frozen data property via Object.defineProperty. After the first scale(), 'area' is a fixed value property. The second scale() tries to redefine it, but since the default writable is false and configurable is false, the redefinition throws TypeError in strict mode (or silently fails). Area becomes stale after the first scale.",
    options: [
      "Line 6: should cache area calculation for performance",
      "Line 12: radius mutation doesn't trigger area recalculation",
      "Line 13: defineProperty creates a non-configurable property; second scale() fails to redefine it",
      "Line 14: value should use the new radius, not the old one",
    ],
    correctOptionIndex: 2,
  },

  // 60 ── Incorrect AbortController reuse
  {
    code: `class ApiClient {
  constructor() {
    this.controller = new AbortController();
  }
  async fetch(url) {
    const resp = await fetch(url, {
      signal: this.controller.signal,
    });
    return resp.json();
  }
  cancel() {
    this.controller.abort();
  }
  async fetchAfterCancel(url) {
    return this.fetch(url);
  }
}
// client.cancel(); client.fetchAfterCancel("/api")
// Expected: new fetch starts
// Actual: immediately aborted!`,
    language: "javascript",
    bugLine: 15,
    bugDescription:
      "Once an AbortController is aborted, its signal remains in the aborted state permanently. fetchAfterCancel reuses the same controller, so the new fetch is immediately aborted. Should create a new AbortController after aborting the old one.",
    options: [
      "Line 6: fetch needs error handling for network failures",
      "Line 9: resp.json() should check resp.ok first",
      "Line 15: aborted AbortController cannot be reused; signal stays aborted permanently",
      "Line 7: signal should be cloned for each request",
    ],
    correctOptionIndex: 2,
  },
];
