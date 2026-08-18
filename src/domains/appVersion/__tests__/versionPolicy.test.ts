import type { AppVersionConfig } from "../AppVersionConfig";
import { compareVersions, getUpdateStatus } from "../versionPolicy";

const config: AppVersionConfig = {
  id: "version-1",
  platform: "android",
  latestVersion: "1.10.0",
  minimumVersion: "1.5.0",
  message: "Atualize o aplicativo.",
  androidUrl: "https://play.google.com/store/apps/details?id=test",
  iosUrl: null,
  updateRequired: false,
  updatedAt: "2026-08-14T00:00:00Z",
};

describe("app version policy", () => {
  it("compares semantic numeric parts instead of comparing text", () => {
    expect(compareVersions("1.10.0", "1.9.0")).toBe(1);
    expect(compareVersions("1.0", "1.0.0")).toBe(0);
    expect(compareVersions("2.0.0", "10.0.0")).toBe(-1);
  });

  it("requests an optional update below the latest version", () => {
    expect(getUpdateStatus("1.9.0", config)).toBe("optional");
  });

  it("requires an update below the minimum version", () => {
    expect(getUpdateStatus("1.4.9", config)).toBe("required");
  });

  it("honors the explicit required flag", () => {
    expect(
      getUpdateStatus("1.10.0", { ...config, updateRequired: true }),
    ).toBe("required");
  });

  it("does not prompt users already on the latest version", () => {
    expect(getUpdateStatus("1.10.0", config)).toBe("none");
  });

  it("fails safely when a version is malformed", () => {
    expect(getUpdateStatus("development", config)).toBe("none");
    expect(
      getUpdateStatus("1.0.0", { ...config, minimumVersion: "invalid" }),
    ).toBe("none");
  });
});
