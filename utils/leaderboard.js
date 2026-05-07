const KEY = "ipd_leaderboard";

export function loadLeaderboard() {
  return JSON.parse(localStorage.getItem(KEY)) || {};
}

export function saveLeaderboard(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function updateLeaderboard(strategyA, strategyB, scoreA, scoreB) {
  const board = loadLeaderboard();

  if (!board[strategyA]) board[strategyA] = { total: 0, games: 0 };
  if (!board[strategyB]) board[strategyB] = { total: 0, games: 0 };

  board[strategyA].total += scoreA;
  board[strategyA].games += 1;

  board[strategyB].total += scoreB;
  board[strategyB].games += 1;

  saveLeaderboard(board);
}
