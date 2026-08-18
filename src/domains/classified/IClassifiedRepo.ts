import type { Classified } from "./Classified";

export type IClassifiedRepo = {
  list(): Promise<Classified[]>;
};
