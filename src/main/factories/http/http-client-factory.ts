import { HttpClient } from "@/data";
import { AxiosHttpClient } from "@/infra";

export const manufactureHttpClient = (): HttpClient => new AxiosHttpClient(12000);
