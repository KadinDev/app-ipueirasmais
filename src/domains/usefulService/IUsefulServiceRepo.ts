import type { PharmacyDuty } from "./PharmacyDuty";
import type { UsefulService } from "./UsefulService";

export type IUsefulServiceRepo = {
  listPharmacyDuty: () => Promise<PharmacyDuty[]>;
  listUsefulServices: () => Promise<UsefulService[]>;
};
