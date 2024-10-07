const MAX_LEVEL = 500;

const calculateExperienceForLevel = (level) => {
  if (level <= 1) return 0;
  if (level > MAX_LEVEL) return Infinity;
  return Math.floor(100 * Math.pow(level, 1.5));
};

const calculateLevel = (experience) => {
  if (experience < 100) return 1;
  let level = 1;
  while (level < MAX_LEVEL && calculateExperienceForLevel(level + 1) <= experience) {
    level++;
  }
  return level;
};

const calculateExperienceProgress = (experience, level) => {
  const currentLevelExp = calculateExperienceForLevel(level);
  const nextLevelExp = calculateExperienceForLevel(level + 1);
  return experience - currentLevelExp;
};

const calculateExperienceNeeded = (level) => {
  if (level >= MAX_LEVEL) return Infinity;
  return calculateExperienceForLevel(level + 1) - calculateExperienceForLevel(level);
};

const calculateExperiencePercentage = (experience, level) => {
  const currentLevelExp = calculateExperienceForLevel(level);
  const nextLevelExp = calculateExperienceForLevel(level + 1);
  return ((experience - currentLevelExp) / (nextLevelExp - currentLevelExp)) * 100;
};

export {
  MAX_LEVEL,
  calculateExperienceForLevel,
  calculateLevel,
  calculateExperienceProgress,
  calculateExperienceNeeded,
  calculateExperiencePercentage
};