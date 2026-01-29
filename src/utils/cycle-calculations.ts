import { PeriodEntry } from './storage';

export function calculateCycleLength(entries: PeriodEntry[]): number {
  if (entries.length < 2) return 28; // Default cycle length

  const sortedEntries = [...entries].sort((a, b) =>
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  const cycleLengths: number[] = [];
  for (let i = 1; i < sortedEntries.length; i++) {
    const days = daysBetween(
      new Date(sortedEntries[i - 1].startDate),
      new Date(sortedEntries[i].startDate)
    );
    cycleLengths.push(days);
  }

  const avgCycleLength = cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length;
  return Math.round(avgCycleLength);
}

export function calculateAveragePeriodLength(entries: PeriodEntry[]): number {
  const completedEntries = entries.filter(e => e.endDate);
  if (completedEntries.length === 0) return 5; // Default period length

  const lengths = completedEntries.map(e =>
    daysBetween(new Date(e.startDate), new Date(e.endDate!)) + 1
  );

  const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  return Math.round(avgLength);
}

export function predictNextPeriods(entries: PeriodEntry[], count: number = 3): Date[] {
  if (entries.length === 0) return [];

  const cycleLength = calculateCycleLength(entries);
  const sortedEntries = [...entries].sort((a, b) =>
    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  const lastPeriod = new Date(sortedEntries[0].startDate);
  const predictions: Date[] = [];

  for (let i = 1; i <= count; i++) {
    const nextDate = new Date(lastPeriod);
    nextDate.setDate(nextDate.getDate() + (cycleLength * i));
    predictions.push(nextDate);
  }

  return predictions;
}

export function daysBetween(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((date2.getTime() - date1.getTime()) / oneDay));
}

export function daysUntilNextPeriod(entries: PeriodEntry[]): number | null {
  const predictions = predictNextPeriods(entries, 1);
  if (predictions.length === 0) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const nextPeriod = predictions[0];
  nextPeriod.setHours(0, 0, 0, 0);

  return daysBetween(today, nextPeriod);
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();
}

export function isDateInPeriod(date: Date, entries: PeriodEntry[]): boolean {
  return entries.some(entry => {
    const start = new Date(entry.startDate);
    const end = entry.endDate ? new Date(entry.endDate) : start;

    return date >= start && date <= end;
  });
}

export function isDatePredicted(date: Date, entries: PeriodEntry[]): boolean {
  const predictions = predictNextPeriods(entries, 3);
  const periodLength = calculateAveragePeriodLength(entries);

  return predictions.some(predStart => {
    const predEnd = new Date(predStart);
    predEnd.setDate(predEnd.getDate() + periodLength - 1);

    return date >= predStart && date <= predEnd;
  });
}
