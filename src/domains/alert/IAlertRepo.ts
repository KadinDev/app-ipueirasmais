import type { Alert } from "./Alert";

export type IAlertRepo = {
  list: () => Promise<Alert[]>;
  findById: (id: string) => Promise<Alert | null>;
};
