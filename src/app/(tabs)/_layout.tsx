import { Tabs } from "expo-router";
import { CustomTabBar } from "@/presentation/components/ui/custom-tab-bar";

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen
        name="discover"
        options={{
          title: "Discover",
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarStyle: { display: "none" },
        }}
      />
    </Tabs>
  );
}
