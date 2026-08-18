import type {
  AppPlatform,
  AppVersionConfig,
} from "./AppVersionConfig";

export type IAppVersionRepo = {
  getConfig: (
    platform: Exclude<AppPlatform, "all">,
  ) => Promise<AppVersionConfig | null>;
};
