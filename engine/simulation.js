import { getPayoff } from "./payoff.js";

export function runSimulation({ rounds, strategyA, strategyB, payoff }) {
  let historyA = [];
  let historyB = [];

  let scoreA = 0;
  let scoreB = 0;

  for (let i = 0; i < rounds; i++) {
    const moveA = strategyA(historyA, historyB);
    const moveB = strategyB(historyB, historyA);

    const [gainA, gainB] = getPayoff(moveA, moveB, payoff);

    scoreA += gainA;
    scoreB += gainB;

    historyA.push(moveA);
    historyB.push(moveB);
  }

  return {
    scoreA,
    scoreB,
    historyA,
    historyB,
  };

  runOneRound();
  wait;
  runOneRound();
  wait;
}
