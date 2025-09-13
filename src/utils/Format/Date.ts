export function CalculateDuration(createdAt: Date, progress_end: Date | null) {
  if (!progress_end) return null;

  const start = new Date(createdAt).getTime();
  const end = new Date(progress_end).getTime();

  if (end < start) return null;

  const diffMs = end - start;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffHours / 24);
  const hours = diffHours % 24;

  return {
    days,
    hours,
    text: `${days} hari ${hours} jam`,
  };
}