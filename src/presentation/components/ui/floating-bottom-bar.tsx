import React from "react";
import { View, Pressable, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SvgIcon, IconName } from "./svg-icon";

export type TabKey = "home" | "discover" | "search" | "favorites";

interface FloatingBottomBarProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
}

interface TabItem {
  key: TabKey;
  label: string;
  icon: IconName;
}

const TABS: TabItem[] = [
  { key: "home", label: "Home", icon: "home" },
  { key: "discover", label: "Discover", icon: "discover" },
  { key: "search", label: "Search", icon: "search" },
  { key: "favorites", label: "My List", icon: "plus" },
];

export function FloatingBottomBar({ activeTab, onSelectTab }: FloatingBottomBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      className="absolute bottom-0 left-0 right-0 items-center"
      style={{ paddingBottom: Math.max(insets.bottom, 12) + 6 }}
    >
      <View className="h-16 w-11/12 max-w-sm flex-row items-center justify-around rounded-full border border-border/60 bg-[#06181F]/95 px-2 backdrop-blur-md shadow-lg shadow-black/60">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <Pressable
              key={tab.key}
              onPress={() => onSelectTab(tab.key)}
              hitSlop={8}
              className="flex-1 items-center justify-center py-1"
            >
              <SvgIcon name={tab.icon} size={22} color={isActive ? "#F5B83D" : "#8DA1A8"} />
              <Text
                className={`mt-1 font-geist text-[10px] ${
                  isActive ? "font-geist-semibold text-accent" : "text-muted-foreground"
                }`}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
