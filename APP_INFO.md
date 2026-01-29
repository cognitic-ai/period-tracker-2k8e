# Period Tracker App

A beautiful, privacy-focused period tracking app built with React Native and Expo.

## Features

### Calendar Tab
- Interactive monthly calendar view
- Tap any day to log or remove period days
- Visual indicators:
  - **Pink circles**: Logged period days
  - **Light pink circles**: Predicted period days
  - **Blue border**: Today's date
- Days until next period countdown card
- Month navigation (previous/next month)
- Automatic period merging (adjacent days are combined)

### Insights Tab
- **Statistics**:
  - Average cycle length
  - Average period length
  - Days since last period
  - Total periods logged

- **Predictions**: Next 3 predicted periods based on your cycle history

- **History**: Last 10 period entries with dates and duration

## How to Use

1. **Log a Period**: Tap any day on the calendar and select "Log" to mark it as a period day
2. **Remove a Day**: Tap a logged period day and select "Remove" to unlog it
3. **View Predictions**: Switch to the Insights tab to see when your next periods are predicted
4. **Track Statistics**: Monitor your cycle patterns in the Insights tab

## Data Storage

All data is stored locally on your device using AsyncStorage. No data is sent to any servers - your privacy is protected.

## Technology Stack

- React Native with Expo
- Expo Router for navigation
- @bacons/apple-colors for beautiful, adaptive theming
- AsyncStorage for local data persistence
- TypeScript for type safety
