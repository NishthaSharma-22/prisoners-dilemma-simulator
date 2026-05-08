import { createSimulation } from "./engine/stepSimulation.js";
import { Strategies } from "./strategies/index.js";
import { updateLeaderboard, loadLeaderboard } from "./utils/leaderboard.js";

const strategyLabels = {
  alwaysCooperate: "Always Cooperate",
  alwaysDefect: "Always Defect",
  random: "Random",
  titForTat: "Tit for Tat",
  grimTrigger: "Grim Trigger",
  forgivingTitForTat: "Forgiving Tit for Tat",
  suspiciousTFT: "Suspicious Tit for Tat",
  pavlov: "Pavlov (Win-Stay Lose-Shift)",
  detective: "Detective",
  learner: "Learning Agent",
};

const strategyASelect = document.getElementById("strategyA");
const strategyBSelect = document.getElementById("strategyB");
const runBtn = document.getElementById("runBtn");
const stopBtn = document.getElementById("stopBtn");
let isRunning = false;
let stopRequested = false;

Object.keys(Strategies).forEach((name) => {
  const label = strategyLabels[name] || name;

  strategyASelect.add(new Option(label, name));
  strategyBSelect.add(new Option(label, name));
});

function createCircle(move, round) {
  const div = document.createElement("div");

  div.style.width = "50px";
  div.style.height = "50px";
  div.style.borderRadius = "50%";
  div.style.flexShrink = "0";

  div.style.display = "flex";
  div.style.alignItems = "center";
  div.style.justifyContent = "center";

  div.style.fontSize = "20px";
  div.style.color = "white";
  div.style.fontWeight = "bold";

  div.style.backgroundColor = move === "C" ? "green" : "red";

  div.textContent = round;

  return div;
}

stopBtn.addEventListener("click", () => {
  stopRequested = true;
});

window.run = async function () {
  if (isRunning) return;
  isRunning = true;
  runBtn.disabled = true;
  stopRequested = false;

  try {
    const rounds = Number(document.getElementById("rounds").value);
    const speed = Number(document.getElementById("speed").value);

    const strategyA = Strategies[strategyASelect.value];
    const strategyB = Strategies[strategyBSelect.value];
    const noise = Number(document.getElementById("noise").value);

    const sim = createSimulation({
      strategyA,
      strategyB,
      payoff: { T: 5, R: 3, P: 1, S: 0 },
      noise,
    });

    const rowA = document.getElementById("rowA");
    const rowB = document.getElementById("rowB");
    const output = document.getElementById("output");

    rowA.innerHTML = "";
    rowB.innerHTML = "";

    let final;

    let coopA = 0;
    let defectA = 0;
    let coopB = 0;
    let defectB = 0;

    for (let i = 0; i < rounds; i++) {
      if (stopRequested) break;
      const result = sim.step();
      final = result;

      if (result.moveA === "C") coopA++;
      else defectA++;

      if (result.moveB === "C") coopB++;
      else defectB++;

      rowA.appendChild(createCircle(result.moveA, i + 1));
      rowB.appendChild(createCircle(result.moveB, i + 1));

      rowA.scrollTo({ left: rowA.scrollWidth });
      rowB.scrollTo({ left: rowB.scrollWidth });
      await new Promise((r) => setTimeout(r, speed));
    }

    output.textContent = `
Final Score:
A: ${final.scoreA}
B: ${final.scoreB}
Winner: ${
      final.scoreA > final.scoreB
        ? "A"
        : final.scoreB > final.scoreA
          ? "B"
          : "Tie"
    }

    Player A:
Cooperate: ${coopA} (${(coopA / rounds) * 100}%)
Defect: ${defectA} (${(defectA / rounds) * 100}%)

    Player B:
Cooperate: ${coopB} (${(coopB / rounds) * 100}%)
Defect: ${defectB} (${(defectB / rounds) * 100}%)
`;

    updateLeaderboard(
      strategyASelect.value,
      strategyBSelect.value,
      final.scoreA,
      final.scoreB,
    );

    renderLeaderboard();
    renderChart();
  } finally {
    isRunning = false;
    runBtn.disabled = false;
    stopBtn.disabled = true;
  }
};
function renderLeaderboard() {
  const board = loadLeaderboard();
  const container = document.getElementById("leaderboard");

  const entries = Object.entries(board).map(([name, data]) => {
    return {
      name,
      avg: data.total / data.games,
      total: data.total,
      games: data.games,
    };
  });

  entries.sort((a, b) => b.avg - a.avg);

  container.innerHTML = entries
    .map(
      (e) => `
      <div>
<b>${strategyLabels[e.name] || e.name}</b>        Avg: ${e.avg.toFixed(2)} |
        Total: ${e.total} |
        Games: ${e.games}
      </div>
    `,
    )
    .join("");
}

// chart - need to complete

function renderChart() {
  const board = loadLeaderboard();

  const labels = [];
  const data = [];

  Object.entries(board).forEach(([name, val]) => {
    labels.push(name);
    data.push(val.total / val.games);
  });

  if (chart) chart.destroy();

  const ctx = document.getElementById("leaderboardChart");

  if (!ctx) return;
  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Average Score",
          data,
        },
      ],
    },
  });
}

renderLeaderboard();
renderChart();
