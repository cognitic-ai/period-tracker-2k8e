import React from 'react';
import { View, Text } from 'react-native';
import * as AC from '@bacons/apple-colors';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
}

export function StatCard({ title, value, subtitle }: StatCardProps) {
  return (
    <View
      style={{
        backgroundColor: AC.secondarySystemGroupedBackground,
        borderRadius: 16,
        borderCurve: 'continuous',
        padding: 20,
        gap: 8,
      }}
    >
      <Text style={{ color: AC.secondaryLabel, fontSize: 14, fontWeight: '500' }}>
        {title}
      </Text>
      <Text style={{ color: AC.label, fontSize: 36, fontWeight: '700', fontVariant: ['tabular-nums'] }}>
        {value}
      </Text>
      {subtitle && (
        <Text style={{ color: AC.tertiaryLabel, fontSize: 13 }}>{subtitle}</Text>
      )}
    </View>
  );
}
