import { View, Text } from "react-native";
import { AppButton } from "./button";
import { SvgIcon, IconName } from "./svg-icon";

interface StateFeedbackProps {
  icon?: IconName;
  title: string;
  description: string;
  actionTitle?: string;
  onAction?: () => void;
}

export function StateFeedback({ icon = "search", title, description, actionTitle, onAction }: StateFeedbackProps) {
  return (
    <View className="flex-1 items-center justify-center px-6">
      <View className="mb-2 size-12 items-center justify-center rounded-full bg-card border border-white/10">
        <SvgIcon name={icon} size={22} color="#8DA1A8" />
      </View>

      <Text className="text-center font-geist-semibold text-base leading-5 text-[#FDFDFC]">{title}</Text>

      <Text className="mt-2 text-center font-geist text-xs leading-4 text-[#7D8790]">{description}</Text>

      {actionTitle && onAction && (
        <View className="mt-4 w-60">
          <AppButton title={actionTitle} onPress={onAction} variant="secondary" className="h-10" icon="search" />
        </View>
      )}
    </View>
  );
}
