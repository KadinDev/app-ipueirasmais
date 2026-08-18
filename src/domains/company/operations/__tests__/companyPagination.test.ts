import type { Company } from "../../Company";
import {
  COMPANY_PAGE_SIZE,
  COMPANY_REQUEST_SIZE,
  flattenCompanyPages,
  getNextCompanyOffset,
} from "../companyPagination";

function company(position: number): Company {
  return {
    id: `company-${position}`,
    cityId: "city-1",
    categoryId: null,
    categoryName: null,
    categorySlug: null,
    name: `Empresa ${position}`,
    slug: `empresa-${position}`,
    placementType: "basic",
    isFeatured: false,
  };
}

function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, index) =>
    company(start + index),
  );
}

describe("company pagination", () => {
  it("requests one extra row while exposing pages of exactly 20", () => {
    expect(COMPANY_PAGE_SIZE).toBe(20);
    expect(COMPANY_REQUEST_SIZE).toBe(21);
    expect(flattenCompanyPages([range(1, 21)])).toHaveLength(20);
  });

  it("calculates offsets 0, 20 and 40 without skipping records", () => {
    expect(getNextCompanyOffset(range(1, 21), 0)).toBe(20);
    expect(getNextCompanyOffset(range(21, 41), 20)).toBe(40);
    expect(getNextCompanyOffset(range(41, 45), 40)).toBeUndefined();
  });

  it("combines more than 20 companies without duplicates", () => {
    const result = flattenCompanyPages([
      range(1, 21),
      range(21, 41),
      range(41, 45),
    ]);

    expect(result).toHaveLength(45);
    expect(new Set(result.map((item) => item.id)).size).toBe(45);
    expect(result[0].id).toBe("company-1");
    expect(result[19].id).toBe("company-20");
    expect(result[20].id).toBe("company-21");
    expect(result[44].id).toBe("company-45");
  });

  it("removes duplicated ids defensively if the backend data changes", () => {
    const result = flattenCompanyPages([
      range(1, 21),
      [company(20), ...range(21, 39)],
    ]);

    expect(result.filter((item) => item.id === "company-20")).toHaveLength(1);
  });
});
