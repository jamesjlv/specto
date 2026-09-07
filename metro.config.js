import { getDefaultConfig } from "expo/metro-config";
const { withNativewind } = require("nativewind/metro");

const defaultConfig = getDefaultConfig(__dirname);

export default withNativewind(defaultConfig);
