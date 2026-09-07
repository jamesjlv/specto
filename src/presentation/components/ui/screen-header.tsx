import { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { SvgIcon } from "./svg-icon";

export type ShowStatusFilter = "ALL" | "Running" | "Ended" | "To Be Determined";

interface ScreenHeaderProps {
  title?: string;
  onBack?: () => void;
  showFilter?: boolean;
  activeStatus?: ShowStatusFilter;
  onStatusChange?: (status: ShowStatusFilter) => void;
}

export function ScreenHeader({
  title,
  onBack,
  showFilter = false,
  activeStatus = "ALL",
  onStatusChange,
}: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  const statuses: ShowStatusFilter[] = ["ALL", "Running", "Ended", "To Be Determined"];

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.navigate("/(tabs)");
    }
  };

  return (
    <View style={{ paddingTop: insets.top + 12 }} className="z-30 pb-2">
      <View className="flex-row items-center justify-between pl-[10px] pr-4">
        <View className="flex-1 flex-row items-center">
          <Pressable onPress={handleBack} hitSlop={12} className="items-center justify-center active:opacity-70">
            <SvgIcon name="chevron-left" size={24} color="#FDFDFC" />
          </Pressable>

          {title && (
            <Text
              numberOfLines={1}
              className="ml-2 font-geist-semibold text-2xl leading-8 tracking-normal text-[#FDFDFC]"
            >
              {title}
            </Text>
          )}
        </View>

        {showFilter && (
          <Pressable
            hitSlop={12}
            onPress={() => setFilterMenuOpen((prev) => !prev)}
            className="items-center justify-center active:opacity-70"
          >
            <SvgIcon name="filter" size={20} color={activeStatus !== "ALL" || filterMenuOpen ? "#FAC554" : "#FDFDFC"} />
          </Pressable>
        )}
      </View>

      {showFilter && filterMenuOpen && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-2.5 max-h-8 pl-[10px]"
          contentContainerStyle={{ gap: 6, paddingRight: 20 }}
        >
          {statuses.map((status) => {
            const isSelected = activeStatus === status;
            return (
              <Pressable
                key={status}
                onPress={() => {
                  onStatusChange?.(status);
                  setFilterMenuOpen(false);
                }}
                className={`h-7 items-center justify-center rounded-full px-3 ${
                  isSelected ? "bg-accent" : "border border-white/15 bg-card"
                }`}
              >
                <Text
                  className={`font-geist-medium text-[11px] leading-4 ${
                    isSelected ? "text-[#02141B]" : "text-[#FDFDFC]"
                  }`}
                >
                  {status === "ALL" ? "All" : status}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}
