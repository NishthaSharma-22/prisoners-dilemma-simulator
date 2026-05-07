export function getPayoff(moveA, moveB, { T, R, P, S }) {
  if (moveA === "C" && moveB === "C") return [R, R];
  if (moveA === "C" && moveB === "D") return [S, T];
  if (moveA === "D" && moveB === "C") return [T, S];
  return [P, P];
}
