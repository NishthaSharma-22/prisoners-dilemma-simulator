export function analyze(result) {
  const { historyA, historyB, scoreA, scoreB } = result;

  const coopA = historyA.filter((m) => m === "C").length;
  const coopB = historyB.filter((m) => m === "C").length;

  return {
    scoreA,
    scoreB,
    cooperationA: coopA / historyA.length,
    cooperationB: coopB / historyB.length,
    winner: scoreA > scoreB ? "A" : scoreB > scoreA ? "B" : "Tie",
  };
}
