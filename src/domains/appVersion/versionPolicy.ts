import type { AppVersionConfig } from "./AppVersionConfig";

export type UpdateStatus = "none" | "optional" | "required";

function numericParts(version: string) {
  const core = version.trim().replace(/^v/i, "").split(/[+-]/, 1)[0];
  if (!core || !core.split(".").every((part) => /^\d+$/.test(part))) {
    return null;
  }

  return core
    .split(".")
    .map((part) => Number.parseInt(part, 10))
    .map((part) => (Number.isFinite(part) && part >= 0 ? part : 0));
}

export function compareVersions(left: string, right: string) {
  const leftParts = numericParts(left);
  const rightParts = numericParts(right);
  if (!leftParts || !rightParts) return 0;
  const length = Math.max(leftParts.length, rightParts.length);

  for (let index = 0; index < length; index += 1) {
    const difference = (leftParts[index] ?? 0) - (rightParts[index] ?? 0);
    if (difference !== 0) return difference > 0 ? 1 : -1;
  }

  return 0;
}

export function getUpdateStatus(
  installedVersion: string,
  config: AppVersionConfig,
): UpdateStatus {
  if (
    !numericParts(installedVersion) ||
    !numericParts(config.latestVersion) ||
    !numericParts(config.minimumVersion)
  ) {
    return "none";
  }

  if (
    config.updateRequired ||
    compareVersions(config.minimumVersion, installedVersion) > 0
  ) {
    return "required";
  }

  return compareVersions(config.latestVersion, installedVersion) > 0
    ? "optional"
    : "none";
}
