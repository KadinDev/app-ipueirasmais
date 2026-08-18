import type { Company } from "../Company";

export const COMPANY_PAGE_SIZE = 20;
export const COMPANY_REQUEST_SIZE = COMPANY_PAGE_SIZE + 1;

export function getNextCompanyOffset(
  lastPage: Company[],
  currentOffset: number,
) {
  return lastPage.length > COMPANY_PAGE_SIZE
    ? currentOffset + COMPANY_PAGE_SIZE
    : undefined;
}

export function flattenCompanyPages(pages: Company[][]) {
  const seen = new Set<string>();

  return pages.flatMap((page) =>
    page.slice(0, COMPANY_PAGE_SIZE).filter((company) => {
      if (seen.has(company.id)) return false;
      seen.add(company.id);
      return true;
    }),
  );
}
