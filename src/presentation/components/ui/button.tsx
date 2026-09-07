import React from "react";
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

export function AppButton({ title, onPress, variant = "primary", icon, loading = false, className = "" }: ButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      hitSlop={6}
      android_ripple={{
        color: isPrimary ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.08)",
        borderless: false,
      }}
      className={`h-12 flex-row items-center justify-center rounded-full px-6 active:opacity-85 ${
        isPrimary ? "bg-accent" : "border border-border/80 bg-secondary"
      } ${className}`}
    >
      {loading ? (
        <ActivityIndicator size="small" color={isPrimary ? "#02141B" : "#F5F7F8"} />
      ) : (
        <>
          {icon && (
            <SvgIcon name={icon} size={18} color={isPrimary ? "#02141B" : "#F5F7F8"} style={{ marginRight: 8 }} />
          )}
          <Text className={`font-geist-semibold text-base ${isPrimary ? "text-accent-foreground" : "text-foreground"}`}>
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
}
