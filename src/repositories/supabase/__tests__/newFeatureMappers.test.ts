import {
  mapCompany,
  mapAppVersionConfig,
  mapPharmacyDuty,
  mapUsefulService,
} from "../mappers";

describe("new public RPC mappers", () => {
  it("maps the company placement priority returned by pagination", () => {
    expect(
      mapCompany({
        id: "company-1",
        city_id: "city-1",
        name: "Empresa",
        slug: "empresa",
        placement_type: "featured",
        placement_priority: "9",
        is_featured: true,
      }),
    ).toMatchObject({
      id: "company-1",
      isFeatured: true,
      placementPriority: 9,
    });
  });

  it("maps pharmacy duty fields from snake_case", () => {
    expect(
      mapPharmacyDuty({
        shift_id: "shift-1",
        city_id: "city-1",
        starts_at: "2026-08-14T18:00:00Z",
        ends_at: "2026-08-15T08:00:00Z",
        pharmacy_id: "pharmacy-1",
        company_id: "company-1",
        name: "Farmácia Central",
        slug: "farmacia-central",
        logo_url: "https://example.com/logo.png",
        manual_priority: 2,
      }),
    ).toMatchObject({
      shiftId: "shift-1",
      cityId: "city-1",
      startsAt: "2026-08-14T18:00:00Z",
      endsAt: "2026-08-15T08:00:00Z",
      pharmacyId: "pharmacy-1",
      companyId: "company-1",
      logoUrl: "https://example.com/logo.png",
      manualPriority: 2,
    });
  });

  it("maps useful services and safely handles an unknown type", () => {
    expect(
      mapUsefulService({
        id: "service-1",
        city_id: "city-1",
        service_type: "unexpected",
        name: "Serviço local",
        created_at: "2026-08-14T00:00:00Z",
        updated_at: "2026-08-14T01:00:00Z",
      }),
    ).toMatchObject({
      id: "service-1",
      cityId: "city-1",
      serviceType: "other",
      createdAt: "2026-08-14T00:00:00Z",
      updatedAt: "2026-08-14T01:00:00Z",
    });
  });

  it("maps version configuration and boolean flags", () => {
    expect(
      mapAppVersionConfig({
        id: "config-1",
        platform: "android",
        latest_version: "1.2.0",
        minimum_version: "1.0.0",
        message: "Nova versão",
        android_url: "https://play.google.com/test",
        ios_url: null,
        update_required: true,
        updated_at: "2026-08-14T00:00:00Z",
      }),
    ).toEqual({
      id: "config-1",
      platform: "android",
      latestVersion: "1.2.0",
      minimumVersion: "1.0.0",
      message: "Nova versão",
      androidUrl: "https://play.google.com/test",
      iosUrl: null,
      updateRequired: true,
      updatedAt: "2026-08-14T00:00:00Z",
    });
  });
});
