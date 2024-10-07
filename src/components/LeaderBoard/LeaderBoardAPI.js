export const fetchLeaderBoard = async (filters) => {
  try {
    const response = await fetch(`http://localhost/api/index.php/leaderboard?timeFrame=${filters.timeFrame}&category=${filters.category}`);
    const data = await response.json();
    return data.leaderboard;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
};