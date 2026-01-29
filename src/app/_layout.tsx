import { ThemeProvider } from "@/components/theme-provider";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs as WebTabs } from "expo-router/tabs";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { Platform, useWindowDimensions } from "react-native";

export default function Layout() {
  return (
    <ThemeProvider>
      <TabsLayout />
    </ThemeProvider>
  );
}

function TabsLayout() {
  if (process.env.EXPO_OS === "web") {
    return <WebTabsLayout />;
  } else {
    return <NativeTabsLayout />;
  }
}

function WebTabsLayout() {
  const { width } = useWindowDimensions();
  const isMd = width >= 768;
  const isLg = width >= 1024;

  return (
    <WebTabs
      screenOptions={{
        headerShown: false,
        ...(isMd
          ? {
              tabBarPosition: "left",
              tabBarVariant: "material",
              tabBarLabelPosition: isLg ? undefined : "below-icon",
            }
          : {
              tabBarPosition: "bottom",
            }),
      }}
    >
      <WebTabs.Screen
        name="(calendar)"
        options={{
          title: "Calendar",
          tabBarIcon: (props) => <MaterialIcons {...props} name="calendar-today" />,
        }}
      />
      <WebTabs.Screen
        name="(insights)"
        options={{
          title: "Insights",
          tabBarIcon: (props) => <MaterialIcons {...props} name="insights" />,
        }}
      />
    </WebTabs>
  );
}

function NativeTabsLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="(calendar)">
        <NativeTabs.Trigger.Label>Calendar</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          {...Platform.select({
            ios: { sf: { default: "calendar", selected: "calendar.badge.clock" } },
            default: {
              src: <NativeTabs.Trigger.VectorIcon family={MaterialIcons} name="calendar-today" />,
            },
          })}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(insights)">
        <NativeTabs.Trigger.Label>Insights</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          {...Platform.select({
            ios: { sf: "chart.bar.fill" },
            default: {
              src: <NativeTabs.Trigger.VectorIcon family={MaterialIcons} name="insights" />,
            },
          })}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
