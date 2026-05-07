import { getPayoff } from "./payoff.js";

export function createSimulation({ strategyA, strategyB, payoff, noise = 0 }) {
  let historyA = [];
  let historyB = [];
  let scoreA = 0;
  let scoreB = 0;
  let round = 0;

  function step() {
    let moveA = strategyA(historyA, historyB);
    let moveB = strategyB(historyB, historyA);

    if (Math.random() < noise) {
      moveA = moveA === "C" ? "D" : "C";
    }

    if (Math.random() < noise) {
      moveB = moveB === "C" ? "D" : "C";
    }
    const [gainA, gainB] = getPayoff(moveA, moveB, payoff);

    scoreA += gainA;
    scoreB += gainB;

    historyA.push(moveA);
    historyB.push(moveB);

    round++;

    return {
      round,
      moveA,
      moveB,
      scoreA,
      scoreB,
    };
  }

  return { step };
}
