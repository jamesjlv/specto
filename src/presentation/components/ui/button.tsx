import { Pressable, Text, ActivityIndicator } from "react-native";
import { SvgIcon, IconName } from "./svg-icon";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  icon?: IconName;
  loading?: boolean;
  className?: string;
  disabled?: boolean;
}

export function AppButton({
  title,
  onPress,
  variant = "primary",
  icon,
  loading = false,
  className = "",
  disabled = false,
}: ButtonProps) {
  const isPrimary = variant === "primary";
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      hitSlop={6}
      android_ripple={{
        color: isPrimary ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.08)",
        borderless: false,
      }}
      className={`h-12 flex-row items-center justify-center rounded-full px-6 active:opacity-85 ${
        isPrimary ? "bg-[#FAC554]" : "border border-white/20 bg-[#0B2027]"
      } ${isDisabled ? "opacity-50" : ""} ${className}`}
    >
      {loading ? (
        <ActivityIndicator size="small" color={isPrimary ? "#02141B" : "#F5F7F8"} />
      ) : (
        <>
          {icon && (
            <SvgIcon name={icon} size={18} color={isPrimary ? "#02141B" : "#F5F7F8"} style={{ marginRight: 8 }} />
          )}

          <Text
            className={`font-geist-semibold text-[16px] leading-[20px] ${
              isPrimary ? "text-[#02141B]" : "text-[#F5F7F8]"
            }`}
            style={{
              includeFontPadding: false,
            }}
          >
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
}
