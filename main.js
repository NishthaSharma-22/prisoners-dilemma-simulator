import { createSimulation } from "./engine/stepSimulation.js";
import { Strategies } from "./strategies/index.js";
import { updateLeaderboard, loadLeaderboard } from "./utils/leaderboard.js";

const strategyASelect = document.getElementById("strategyA");
const strategyBSelect = document.getElementById("strategyB");

Object.keys(Strategies).forEach((name) => {
  strategyASelect.add(new Option(name, name));
  strategyBSelect.add(new Option(name, name));
});

function createCircle(move) {
  const div = document.createElement("div");

  div.style.width = "20px";
  div.style.height = "20px";
  div.style.borderRadius = "50%";
  div.style.flexShrink = "0";

  div.style.backgroundColor = move === "C" ? "green" : "red";

  return div;
}

window.run = async function () {
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
    const result = sim.step();
    final = result;

    if (result.moveA === "C") coopA++;
    else defectA++;

    if (result.moveB === "C") coopB++;
    else defectB++;

    rowA.appendChild(createCircle(result.moveA));
    rowB.appendChild(createCircle(result.moveB));

    rowA.scrollLeft = rowA.scrollWidth;
    rowB.scrollLeft = rowB.scrollWidth;

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
Cooperate: ${coopA} (${coopA / rounds * 100}%)
Defect: ${defectA} (${defectA / rounds * 100}%)

    Player B:
Cooperate: ${coopB} (${coopB / rounds * 100}%)
Defect: ${defectB} (${defectB / rounds * 100}%)
`;

  updateLeaderboard(
    strategyASelect.value,
    strategyBSelect.value,
    final.scoreA,
    final.scoreB,
  );

  renderLeaderboard();
  renderChart();
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
        <b>${e.name}</b> —
        Avg: ${e.avg.toFixed(2)} |
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
