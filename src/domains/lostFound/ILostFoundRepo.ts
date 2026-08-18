import type { LostFound, LostFoundItemType } from "./LostFound";

export type ILostFoundRepo = {
  list(itemType?: LostFoundItemType | null): Promise<LostFound[]>;
};
