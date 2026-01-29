import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import * as AC from '@bacons/apple-colors';
import { PeriodEntry, loadPeriodEntries } from '@/utils/storage';
import {
  calculateCycleLength,
  calculateAveragePeriodLength,
  predictNextPeriods,
  daysBetween,
} from '@/utils/cycle-calculations';
import { StatCard } from '@/components/stat-card';
import { useFocusEffect } from '@react-navigation/native';

export default function InsightsScreen() {
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

  const avgCycleLength = calculateCycleLength(entries);
  const avgPeriodLength = calculateAveragePeriodLength(entries);
  const predictions = predictNextPeriods(entries, 3);

  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  const lastPeriod = sortedEntries[0]
    ? new Date(sortedEntries[0].startDate)
    : null;

  const daysSinceLastPeriod = lastPeriod
    ? daysBetween(lastPeriod, new Date())
    : null;

  const formatDateString = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 16, gap: 24 }}
    >
      {entries.length === 0 ? (
        <View
          style={{
            backgroundColor: AC.secondarySystemGroupedBackground,
            borderRadius: 16,
            borderCurve: 'continuous',
            padding: 32,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: AC.secondaryLabel, fontSize: 16, textAlign: 'center' }}>
            Start logging your periods to see insights and predictions
          </Text>
        </View>
      ) : (
        <>
          <View style={{ gap: 12 }}>
            <Text style={{ color: AC.label, fontSize: 22, fontWeight: '700' }}>Statistics</Text>

            <View style={{ gap: 12 }}>
              <StatCard
                title="Average Cycle Length"
                value={`${avgCycleLength}`}
                subtitle="days"
              />

              <StatCard
                title="Average Period Length"
                value={`${avgPeriodLength}`}
                subtitle="days"
              />

              {daysSinceLastPeriod !== null && (
                <StatCard
                  title="Days Since Last Period"
                  value={`${daysSinceLastPeriod}`}
                  subtitle={lastPeriod ? formatDateString(lastPeriod) : ''}
                />
              )}

              <StatCard
                title="Total Periods Logged"
                value={`${entries.length}`}
              />
            </View>
          </View>

          {predictions.length > 0 && (
            <View style={{ gap: 12 }}>
              <Text style={{ color: AC.label, fontSize: 22, fontWeight: '700' }}>Predictions</Text>

              <View
                style={{
                  backgroundColor: AC.secondarySystemGroupedBackground,
                  borderRadius: 16,
                  borderCurve: 'continuous',
                  padding: 16,
                  gap: 12,
                }}
              >
                {predictions.map((date, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingVertical: 8,
                    }}
                  >
                    <View>
                      <Text style={{ color: AC.label, fontSize: 16, fontWeight: '500' }}>
                        Period {index + 1}
                      </Text>
                      <Text style={{ color: AC.secondaryLabel, fontSize: 14 }}>
                        In {daysBetween(new Date(), date)} days
                      </Text>
                    </View>
                    <Text style={{ color: AC.systemPink, fontSize: 16, fontWeight: '600' }}>
                      {formatDateString(date)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {sortedEntries.length > 0 && (
            <View style={{ gap: 12 }}>
              <Text style={{ color: AC.label, fontSize: 22, fontWeight: '700' }}>History</Text>

              <View
                style={{
                  backgroundColor: AC.secondarySystemGroupedBackground,
                  borderRadius: 16,
                  borderCurve: 'continuous',
                  padding: 16,
                  gap: 12,
                }}
              >
                {sortedEntries.slice(0, 10).map((entry, index) => {
                  const startDate = new Date(entry.startDate);
                  const endDate = entry.endDate ? new Date(entry.endDate) : startDate;
                  const length = daysBetween(startDate, endDate) + 1;

                  return (
                    <View
                      key={entry.id}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingVertical: 8,
                        borderBottomWidth: index < sortedEntries.slice(0, 10).length - 1 ? 1 : 0,
                        borderBottomColor: AC.separator,
                      }}
                    >
                      <View>
                        <Text style={{ color: AC.label, fontSize: 16, fontWeight: '500' }}>
                          {formatDateString(startDate)}
                        </Text>
                        <Text style={{ color: AC.secondaryLabel, fontSize: 14 }}>
                          {length} {length === 1 ? 'day' : 'days'}
                        </Text>
                      </View>
                      {entry.endDate && entry.endDate !== entry.startDate && (
                        <Text style={{ color: AC.tertiaryLabel, fontSize: 14 }}>
                          to {formatDateString(endDate)}
                        </Text>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}
