import type { CityUpdate } from "./CityUpdate";

export type ICityUpdateRepo = {
  list: (categorySlug?: string | null) => Promise<CityUpdate[]>;
};
