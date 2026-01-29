import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PeriodEntry {
  id: string;
  startDate: string;
  endDate?: string;
}

const STORAGE_KEY = '@period_tracker_data';

export async function savePeriodEntries(entries: PeriodEntry[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error('Error saving period entries:', error);
  }
}

export async function loadPeriodEntries(): Promise<PeriodEntry[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading period entries:', error);
    return [];
  }
}
