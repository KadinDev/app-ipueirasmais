import type { Job } from "./Job";

export type IJobRepo = {
  list: (categorySlug?: string | null) => Promise<Job[]>;
};
