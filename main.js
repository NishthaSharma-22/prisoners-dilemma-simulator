import { createSimulation } from "./engine/stepSimulation.js";
import { Strategies } from "./strategies/index.js";
import { updateLeaderboard, loadLeaderboard } from "./utils/leaderboard.js";

// dropdown setup
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
    noise
  });

  const rowA = document.getElementById("rowA");
  const rowB = document.getElementById("rowB");
  const output = document.getElementById("output");

  rowA.innerHTML = "";
  rowB.innerHTML = "";

  let final;

  for (let i = 0; i < rounds; i++) {
    const result = sim.step();
    final = result;

    rowA.appendChild(createCircle(result.moveA));
    rowB.appendChild(createCircle(result.moveB));

    // auto scroll
    rowA.scrollLeft = rowA.scrollWidth;
    rowB.scrollLeft = rowB.scrollWidth;

    await new Promise((r) => setTimeout(r, speed));
  }

  // show result
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
`;

  // ✅ ADD THIS PART (leaderboard update)
  updateLeaderboard(
    strategyASelect.value,
    strategyBSelect.value,
    final.scoreA,
    final.scoreB,
  );

  renderLeaderboard();
  renderChart();
};

// leaderboard render
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

// simple chart (needs Chart.js in HTML)
let chart;

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
