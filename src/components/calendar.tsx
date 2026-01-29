import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import * as AC from '@bacons/apple-colors';
import { PeriodEntry } from '@/utils/storage';
import { isDateInPeriod, isDatePredicted, isSameDay } from '@/utils/cycle-calculations';

interface CalendarProps {
  currentDate: Date;
  entries: PeriodEntry[];
  selectedDate: Date | null;
  onDatePress: (date: Date) => void;
}

export function Calendar({ currentDate, entries, selectedDate, onDatePress }: CalendarProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();

  const days: (Date | null)[] = [];

  // Add empty slots for days before the month starts
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(null);
  }

  // Add all days in the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <View style={{ gap: 8 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        {weekDays.map(day => (
          <View key={day} style={{ width: 40, alignItems: 'center' }}>
            <Text style={{ color: AC.secondaryLabel, fontSize: 12, fontWeight: '600' }}>
              {day}
            </Text>
          </View>
        ))}
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {days.map((day, index) => {
          if (!day) {
            return <View key={`empty-${index}`} style={{ width: 40, height: 40, margin: 2 }} />;
          }

          const isToday = isSameDay(day, today);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isPeriod = isDateInPeriod(day, entries);
          const isPredicted = isDatePredicted(day, entries);

          return (
            <Pressable
              key={day.toISOString()}
              onPress={() => onDatePress(day)}
              style={({ pressed }) => ({
                width: 40,
                height: 40,
                margin: 2,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isPeriod
                  ? AC.systemPink
                  : isPredicted
                  ? AC.systemPink + '40'
                  : isSelected
                  ? AC.systemGray5
                  : 'transparent',
                borderWidth: isToday ? 2 : 0,
                borderColor: AC.systemBlue,
                opacity: pressed ? 0.6 : 1,
              })}
            >
              <Text
                style={{
                  color: isPeriod ? 'white' : AC.label,
                  fontSize: 16,
                  fontWeight: isToday || isSelected ? '600' : '400',
                }}
              >
                {day.getDate()}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
