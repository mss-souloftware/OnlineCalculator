/**
 * Scientific calculator engine — a real expression evaluator, not a guess.
 *
 * The keypad builds a human-readable expression string (e.g. "2×sin(30)+π")
 * which this module tokenizes, converts to Reverse Polish Notation with the
 * shunting-yard algorithm, then evaluates. Keeping the parser here (pure, no
 * UI) mirrors the rest of the calculatorEngine: the component only renders.
 *
 * Supported: + − × ÷ ^, parentheses, factorial (!), percent (%), constants
 * π and e, scientific notation (1.5e3), implicit multiplication (2π, 3(4)),
 * and functions sin/cos/tan, asin/acos/atan, ln, log (base 10), √, exp, abs.
 * Trig respects the angle mode (degrees or radians).
 */

export type AngleMode = "deg" | "rad";

export interface EvalResult {
  /** The computed value, or null when the expression is empty or incomplete. */
  value: number | null;
  /** A human-readable message when the expression is invalid, else null. */
  error: string | null;
}

type BinaryOp = "+" | "-" | "*" | "/" | "^" | "neg" | "mod" | "nPr" | "nCr" | "root";

type Token =
  | { type: "num"; value: number }
  | { type: "op"; op: BinaryOp }
  | { type: "postfix"; op: "!" | "%" | "recip" }
  | { type: "fn"; name: FnName }
  | { type: "lparen" }
  | { type: "rparen" };

type FnName =
  | "sin"
  | "cos"
  | "tan"
  | "asin"
  | "acos"
  | "atan"
  | "sinh"
  | "cosh"
  | "tanh"
  | "asinh"
  | "acosh"
  | "atanh"
  | "ln"
  | "log"
  | "sqrt"
  | "exp"
  | "abs";

const FUNCTIONS: Record<string, FnName> = {
  sin: "sin",
  cos: "cos",
  tan: "tan",
  asin: "asin",
  acos: "acos",
  atan: "atan",
  sinh: "sinh",
  cosh: "cosh",
  tanh: "tanh",
  asinh: "asinh",
  acosh: "acosh",
  atanh: "atanh",
  ln: "ln",
  log: "log",
  sqrt: "sqrt",
  exp: "exp",
  abs: "abs",
};

const PRECEDENCE: Record<string, number> = {
  "+": 2,
  "-": 2,
  "*": 3,
  "/": 3,
  mod: 3,
  nPr: 4,
  nCr: 4,
  neg: 5,
  "^": 6,
  root: 6,
};

const RIGHT_ASSOCIATIVE = new Set(["^", "root", "neg"]);

/** Normalises the display symbols (× ÷ −) into characters the lexer reads. */
function normalize(expr: string): string {
  return expr.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");
}

/** Splits a normalised expression into tokens, inserting implicit "×". */
function tokenize(src: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  // Whether an implicit multiplication should precede the next value, i.e. the
  // previous token closes a value (number, constant, ")", "!" or "%").
  const lastClosesValue = () => {
    const prev = tokens[tokens.length - 1];
    return (
      prev !== undefined &&
      (prev.type === "num" || prev.type === "rparen" || prev.type === "postfix")
    );
  };

  while (i < src.length) {
    const ch = src[i];

    if (ch === " ") {
      i++;
      continue;
    }

    // Reciprocal (1/x), entered as a postfix "⁻¹".
    if (src.startsWith("⁻¹", i)) {
      tokens.push({ type: "postfix", op: "recip" });
      i += 2;
      continue;
    }

    // "√" is the square-root function when followed by "(" (the √ key inserts
    // "√("), but a binary nth-root operator between two values (the ʸ√x key).
    if (ch === "√") {
      let k = i + 1;
      while (k < src.length && src[k] === " ") k++;
      if (src[k] === "(") {
        if (lastClosesValue()) tokens.push({ type: "op", op: "*" });
        tokens.push({ type: "fn", name: "sqrt" });
      } else if (lastClosesValue()) {
        tokens.push({ type: "op", op: "root" });
      } else {
        tokens.push({ type: "fn", name: "sqrt" });
      }
      i++;
      continue;
    }

    // Numbers, including a decimal part and scientific notation (1.5e3, 2e-4).
    if (/[0-9.]/.test(ch)) {
      let j = i;
      let seenDot = false;
      while (j < src.length && /[0-9.]/.test(src[j])) {
        if (src[j] === ".") {
          if (seenDot) throw new Error("Invalid number");
          seenDot = true;
        }
        j++;
      }
      // Exponent: only when "e"/"E" is directly followed by an optional sign
      // and at least one digit, so a trailing "e" stays the constant.
      if (j < src.length && (src[j] === "e" || src[j] === "E")) {
        const sign = src[j + 1] === "+" || src[j + 1] === "-" ? 1 : 0;
        if (/[0-9]/.test(src[j + 1 + sign] ?? "")) {
          j += 1 + sign;
          while (j < src.length && /[0-9]/.test(src[j])) j++;
        }
      }
      const value = Number(src.slice(i, j));
      if (!Number.isFinite(value)) throw new Error("Invalid number");
      if (lastClosesValue()) tokens.push({ type: "op", op: "*" });
      tokens.push({ type: "num", value });
      i = j;
      continue;
    }

    // π — Euler-style constants are lexed as plain numbers.
    if (ch === "π") {
      if (lastClosesValue()) tokens.push({ type: "op", op: "*" });
      tokens.push({ type: "num", value: Math.PI });
      i++;
      continue;
    }

    // Identifiers: a function name, or the constant "e".
    if (/[a-zA-Z]/.test(ch)) {
      let j = i;
      while (j < src.length && /[a-zA-Z]/.test(src[j])) j++;
      const word = src.slice(i, j);
      if (word === "mod") {
        tokens.push({ type: "op", op: "mod" });
      } else if (word === "P") {
        tokens.push({ type: "op", op: "nPr" });
      } else if (word === "C") {
        tokens.push({ type: "op", op: "nCr" });
      } else if (word === "e") {
        if (lastClosesValue()) tokens.push({ type: "op", op: "*" });
        tokens.push({ type: "num", value: Math.E });
      } else if (FUNCTIONS[word]) {
        if (lastClosesValue()) tokens.push({ type: "op", op: "*" });
        tokens.push({ type: "fn", name: FUNCTIONS[word] });
      } else {
        throw new Error(`Unknown symbol "${word}"`);
      }
      i = j;
      continue;
    }

    if (ch === "(") {
      if (lastClosesValue()) tokens.push({ type: "op", op: "*" });
      tokens.push({ type: "lparen" });
      i++;
      continue;
    }
    if (ch === ")") {
      tokens.push({ type: "rparen" });
      i++;
      continue;
    }
    if (ch === "!") {
      tokens.push({ type: "postfix", op: "!" });
      i++;
      continue;
    }
    if (ch === "%") {
      tokens.push({ type: "postfix", op: "%" });
      i++;
      continue;
    }

    if (ch === "+" || ch === "-" || ch === "*" || ch === "/" || ch === "^") {
      const prev = tokens[tokens.length - 1];
      const unaryContext =
        prev === undefined ||
        prev.type === "op" ||
        prev.type === "fn" ||
        prev.type === "lparen";
      if (ch === "-" && unaryContext) {
        tokens.push({ type: "op", op: "neg" });
      } else if (ch === "+" && unaryContext) {
        // Unary plus is a no-op; skip it.
      } else {
        tokens.push({ type: "op", op: ch });
      }
      i++;
      continue;
    }

    throw new Error(`Unexpected character "${ch}"`);
  }

  return tokens;
}

/** Shunting-yard: tokens → Reverse Polish Notation. */
function toRpn(tokens: Token[]): Token[] {
  const output: Token[] = [];
  const stack: Token[] = [];

  for (const token of tokens) {
    switch (token.type) {
      case "num":
        output.push(token);
        break;
      case "postfix":
        // Postfix unary (! and %) binds to the value already emitted.
        output.push(token);
        break;
      case "fn":
        stack.push(token);
        break;
      case "op": {
        // Prefix unary minus binds to the operand on its right, so it never
        // pops the operator to its left (this makes 2^-3 and 3√-27 parse, while
        // -3^2 still binds as -(3^2) because ^ later out-ranks neg on the stack).
        if (token.op === "neg") {
          stack.push(token);
          break;
        }
        while (stack.length) {
          const top = stack[stack.length - 1];
          if (top.type === "fn") {
            output.push(stack.pop()!);
            continue;
          }
          if (top.type === "op") {
            const higher = PRECEDENCE[top.op] > PRECEDENCE[token.op];
            const equalLeft =
              PRECEDENCE[top.op] === PRECEDENCE[token.op] &&
              !RIGHT_ASSOCIATIVE.has(token.op);
            if (higher || equalLeft) {
              output.push(stack.pop()!);
              continue;
            }
          }
          break;
        }
        stack.push(token);
        break;
      }
      case "lparen":
        stack.push(token);
        break;
      case "rparen": {
        let matched = false;
        while (stack.length) {
          const top = stack.pop()!;
          if (top.type === "lparen") {
            matched = true;
            break;
          }
          output.push(top);
        }
        if (!matched) throw new Error("Mismatched parentheses");
        // A function immediately before the "(" applies to its result.
        const top = stack[stack.length - 1];
        if (top && top.type === "fn") output.push(stack.pop()!);
        break;
      }
    }
  }

  while (stack.length) {
    const top = stack.pop()!;
    if (top.type === "lparen") throw new Error("Mismatched parentheses");
    output.push(top);
  }

  return output;
}

const toRadians = (x: number, angle: AngleMode) =>
  angle === "deg" ? (x * Math.PI) / 180 : x;
const fromRadians = (x: number, angle: AngleMode) =>
  angle === "deg" ? (x * 180) / Math.PI : x;

function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) {
    throw new Error("Factorial needs a whole number ≥ 0");
  }
  if (n > 170) throw new Error("Number too large"); // 171! overflows to Infinity
  let result = 1;
  for (let k = 2; k <= n; k++) result *= k;
  return result;
}

/** Permutations nPr = n! / (n−r)!, built up iteratively to limit overflow. */
function permutations(n: number, r: number): number {
  if (!Number.isInteger(n) || !Number.isInteger(r) || n < 0 || r < 0 || r > n) {
    throw new Error("nPr needs whole numbers with n ≥ r ≥ 0");
  }
  let result = 1;
  for (let k = 0; k < r; k++) result *= n - k;
  return result;
}

/** Combinations nCr = nPr / r!, using the smaller of r and n−r for stability. */
function combinations(n: number, r: number): number {
  if (!Number.isInteger(n) || !Number.isInteger(r) || n < 0 || r < 0 || r > n) {
    throw new Error("nCr needs whole numbers with n ≥ r ≥ 0");
  }
  const k = Math.min(r, n - r);
  let result = 1;
  for (let i = 0; i < k; i++) result = (result * (n - i)) / (i + 1);
  return Math.round(result);
}

/** The a-th root of b. Returns the real negative root for odd roots of a < 0. */
function nthRoot(a: number, b: number): number {
  if (a === 0) throw new Error("Cannot take the 0th root");
  if (b < 0 && Number.isInteger(a) && Math.abs(a % 2) === 1) {
    return -Math.pow(-b, 1 / a);
  }
  return Math.pow(b, 1 / a);
}

function applyFunction(name: FnName, x: number, angle: AngleMode): number {
  switch (name) {
    case "sin":
      return Math.sin(toRadians(x, angle));
    case "cos":
      return Math.cos(toRadians(x, angle));
    case "tan":
      return Math.tan(toRadians(x, angle));
    case "asin":
      return fromRadians(Math.asin(x), angle);
    case "acos":
      return fromRadians(Math.acos(x), angle);
    case "atan":
      return fromRadians(Math.atan(x), angle);
    case "sinh":
      return Math.sinh(x);
    case "cosh":
      return Math.cosh(x);
    case "tanh":
      return Math.tanh(x);
    case "asinh":
      return Math.asinh(x);
    case "acosh":
      return Math.acosh(x);
    case "atanh":
      return Math.atanh(x);
    case "ln":
      return Math.log(x);
    case "log":
      return Math.log10(x);
    case "sqrt":
      return Math.sqrt(x);
    case "exp":
      return Math.exp(x);
    case "abs":
      return Math.abs(x);
  }
}

/** Evaluates an RPN token stream to a single number. */
function evalRpn(rpn: Token[], angle: AngleMode): number {
  const stack: number[] = [];

  for (const token of rpn) {
    if (token.type === "num") {
      stack.push(token.value);
      continue;
    }
    if (token.type === "fn") {
      const a = stack.pop();
      if (a === undefined) throw new Error("Incomplete expression");
      stack.push(applyFunction(token.name, a, angle));
      continue;
    }
    if (token.type === "postfix") {
      const a = stack.pop();
      if (a === undefined) throw new Error("Incomplete expression");
      if (token.op === "!") {
        stack.push(factorial(a));
      } else if (token.op === "%") {
        stack.push(a / 100);
      } else {
        if (a === 0) throw new Error("Cannot divide by zero");
        stack.push(1 / a);
      }
      continue;
    }
    if (token.type === "op") {
      if (token.op === "neg") {
        const a = stack.pop();
        if (a === undefined) throw new Error("Incomplete expression");
        stack.push(-a);
        continue;
      }
      const b = stack.pop();
      const a = stack.pop();
      if (a === undefined || b === undefined) {
        throw new Error("Incomplete expression");
      }
      switch (token.op) {
        case "+":
          stack.push(a + b);
          break;
        case "-":
          stack.push(a - b);
          break;
        case "*":
          stack.push(a * b);
          break;
        case "/":
          if (b === 0) throw new Error("Cannot divide by zero");
          stack.push(a / b);
          break;
        case "^":
          stack.push(Math.pow(a, b));
          break;
        case "mod":
          if (b === 0) throw new Error("Cannot divide by zero");
          stack.push(a % b);
          break;
        case "nPr":
          stack.push(permutations(a, b));
          break;
        case "nCr":
          stack.push(combinations(a, b));
          break;
        case "root":
          stack.push(nthRoot(a, b));
          break;
      }
    }
  }

  if (stack.length !== 1) throw new Error("Incomplete expression");
  return stack[0];
}

/**
 * Evaluates a display expression. Returns `{ value: null, error: null }` for an
 * empty input so the UI can stay quiet until there's something to compute.
 */
export function evaluate(expression: string, angle: AngleMode): EvalResult {
  const trimmed = expression.trim();
  if (!trimmed) return { value: null, error: null };

  try {
    const rpn = toRpn(tokenize(normalize(trimmed)));
    const value = evalRpn(rpn, angle);
    if (Number.isNaN(value)) throw new Error("Math error");
    if (!Number.isFinite(value)) throw new Error("Number too large");
    return { value, error: null };
  } catch (err) {
    return { value: null, error: err instanceof Error ? err.message : "Error" };
  }
}
