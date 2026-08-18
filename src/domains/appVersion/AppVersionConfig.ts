export type AppPlatform = "all" | "android" | "ios";

export type AppVersionConfig = {
  id: string;
  platform: AppPlatform;
  latestVersion: string;
  minimumVersion: string;
  message: string;
  androidUrl: string | null;
  iosUrl: string | null;
  updateRequired: boolean;
  updatedAt: string;
};
