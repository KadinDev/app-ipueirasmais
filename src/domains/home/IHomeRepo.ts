import type { HomePayload } from "./HomePayload";

export interface IHomeRepo {
  getHome(): Promise<HomePayload>;
}
