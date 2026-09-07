import { APIsConfig } from "@/infra/config/api";

const { baseURL } = APIsConfig.TVMaze;

export const manufactureApiUrl = (path: string): string => {
  const sanitizedPath = path.startsWith("/") ? path.slice(1) : path;
  return `${baseURL}/${sanitizedPath}`;
};
