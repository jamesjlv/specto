import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { FloatingBottomBar, TabKey } from "./floating-bottom-bar";

const TAB_ROUTE_MAP: Record<TabKey, string> = {
  home: "index",
  discover: "discover",
  search: "search",
  favorites: "favorites",
};

export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const currentRouteName = state.routes[state.index]?.name ?? "index";

  if (currentRouteName !== "index") {
    return null;
  }

  return (
    <FloatingBottomBar
      activeTab="home"
      onSelectTab={(tab) => {
        const targetRoute = TAB_ROUTE_MAP[tab];
        if (targetRoute && targetRoute !== currentRouteName) {
          navigation.navigate(targetRoute);
        }
      }}
    />
  );
}
