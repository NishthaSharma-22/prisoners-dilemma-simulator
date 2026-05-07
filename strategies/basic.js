export const basicStrategies = {
  alwaysCooperate: () => "C",

  alwaysDefect: () => "D",

  random: () => (Math.random() < 0.5 ? "C" : "D"),

  titForTat: (myHistory, opponentHistory) => {
    if (opponentHistory.length === 0) return "C";
    return opponentHistory[opponentHistory.length - 1];
  },

  grimTrigger: (myHistory, opponentHistory) => {
    if (opponentHistory.includes("D")) return "D";
    return "C";
  },

  forgivingTitForTat: (myHistory, opponentHistory) => {
    if (opponentHistory.length === 0) return "C";

    const last = opponentHistory[opponentHistory.length - 1];

    if (last === "D") {
      return Math.random() < 0.3 ? "C" : "D";
    }

    return "C";
  },

  suspiciousTFT: (myHistory, opponentHistory) => {
    if (opponentHistory.length === 0) return "D";

    return opponentHistory[opponentHistory.length - 1];
  },

  pavlov: (myHistory, opponentHistory) => {
    if (myHistory.length === 0) return "C";

    const lastMy = myHistory[myHistory.length - 1];
    const lastOpp = opponentHistory[opponentHistory.length - 1];

    if (lastMy === lastOpp) {
      return lastMy; 
    } else {
      return lastMy === "C" ? "D" : "C";
    }
  },

  detective: (myHistory, opponentHistory) => {
    const testMoves = ["C", "D", "C", "C"];

    if (myHistory.length < 4) {
      return testMoves[myHistory.length];
    }

    if (opponentHistory.includes("D")) {
      return opponentHistory[opponentHistory.length - 1];
    }

    return "D";
  },
};
