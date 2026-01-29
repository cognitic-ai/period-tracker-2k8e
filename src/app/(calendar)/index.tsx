import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import * as AC from '@bacons/apple-colors';
import { Calendar } from '@/components/calendar';
import { PeriodEntry, loadPeriodEntries, savePeriodEntries } from '@/utils/storage';
import { daysUntilNextPeriod, formatDate, isDateInPeriod } from '@/utils/cycle-calculations';
import { useFocusEffect } from '@react-navigation/native';

export default function CalendarScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [entries, setEntries] = useState<PeriodEntry[]>([]);

  const loadData = async () => {
    const data = await loadPeriodEntries();
    setEntries(data);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const handleDatePress = (date: Date) => {
    setSelectedDate(date);
    const isPeriod = isDateInPeriod(date, entries);

    if (isPeriod) {
      Alert.alert(
        'Remove Period Day',
        'Do you want to remove this day from your period?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Remove',
            style: 'destructive',
            onPress: () => removePeriodDay(date),
          },
        ]
      );
    } else {
      Alert.alert(
        'Log Period',
        'Mark this day as part of your period?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Log',
            onPress: () => addPeriodDay(date),
          },
        ]
      );
    }
  };

  const addPeriodDay = async (date: Date) => {
    const dateStr = formatDate(date);

    // Check if this date is adjacent to an existing period
    let updated = false;
    const newEntries = entries.map(entry => {
      const start = new Date(entry.startDate);
      const end = entry.endDate ? new Date(entry.endDate) : start;

      const dayBefore = new Date(start);
      dayBefore.setDate(dayBefore.getDate() - 1);

      const dayAfter = new Date(end);
      dayAfter.setDate(dayAfter.getDate() + 1);

      if (formatDate(dayBefore) === dateStr) {
        updated = true;
        return { ...entry, startDate: dateStr };
      }

      if (formatDate(dayAfter) === dateStr) {
        updated = true;
        return { ...entry, endDate: dateStr };
      }

      return entry;
    });

    if (!updated) {
      newEntries.push({
        id: Date.now().toString(),
        startDate: dateStr,
        endDate: dateStr,
      });
    }

    await savePeriodEntries(newEntries);
    setEntries(newEntries);
  };

  const removePeriodDay = async (date: Date) => {
    const dateStr = formatDate(date);

    const newEntries = entries
      .map(entry => {
        if (entry.startDate === dateStr && entry.endDate === dateStr) {
          return null;
        }

        if (entry.startDate === dateStr) {
          const newStart = new Date(entry.startDate);
          newStart.setDate(newStart.getDate() + 1);
          return { ...entry, startDate: formatDate(newStart) };
        }

        if (entry.endDate === dateStr) {
          const newEnd = new Date(entry.endDate);
          newEnd.setDate(newEnd.getDate() - 1);
          return { ...entry, endDate: formatDate(newEnd) };
        }

        // If it's in the middle, split the entry
        const start = new Date(entry.startDate);
        const end = entry.endDate ? new Date(entry.endDate) : start;
        const target = new Date(dateStr);

        if (target > start && entry.endDate && target < end) {
          const dayBefore = new Date(target);
          dayBefore.setDate(dayBefore.getDate() - 1);
          return { ...entry, endDate: formatDate(dayBefore) };
        }

        return entry;
      })
      .filter(Boolean) as PeriodEntry[];

    await savePeriodEntries(newEntries);
    setEntries(newEntries);
  };

  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const daysUntil = daysUntilNextPeriod(entries);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 16, gap: 24 }}
    >
      {daysUntil !== null && (
        <View
          style={{
            backgroundColor: AC.systemPink,
            borderRadius: 16,
            borderCurve: 'continuous',
            padding: 20,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'white', fontSize: 48, fontWeight: '700', fontVariant: ['tabular-nums'] }}>
            {daysUntil}
          </Text>
          <Text style={{ color: 'white', fontSize: 18, fontWeight: '500' }}>
            days until next period
          </Text>
        </View>
      )}

      <View
        style={{
          backgroundColor: AC.secondarySystemGroupedBackground,
          borderRadius: 16,
          borderCurve: 'continuous',
          padding: 16,
          gap: 16,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Pressable onPress={goToPreviousMonth} style={{ padding: 8 }}>
            <Text style={{ color: AC.systemBlue, fontSize: 18, fontWeight: '600' }}>‹</Text>
          </Pressable>

          <Text style={{ color: AC.label, fontSize: 18, fontWeight: '600' }}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </Text>

          <Pressable onPress={goToNextMonth} style={{ padding: 8 }}>
            <Text style={{ color: AC.systemBlue, fontSize: 18, fontWeight: '600' }}>›</Text>
          </Pressable>
        </View>

        <Calendar
          currentDate={currentDate}
          entries={entries}
          selectedDate={selectedDate}
          onDatePress={handleDatePress}
        />
      </View>

      <View style={{ gap: 12 }}>
        <Text style={{ color: AC.label, fontSize: 16, fontWeight: '600' }}>Legend</Text>
        <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: AC.systemPink,
              }}
            />
            <Text style={{ color: AC.secondaryLabel, fontSize: 14 }}>Period</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: AC.systemPink + '40',
              }}
            />
            <Text style={{ color: AC.secondaryLabel, fontSize: 14 }}>Predicted</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: AC.systemBlue,
              }}
            />
            <Text style={{ color: AC.secondaryLabel, fontSize: 14 }}>Today</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
