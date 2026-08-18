import type { Banner } from "@/domains/banner/Banner";
import type { Alert } from "@/domains/alert/Alert";
import type { Category } from "@/domains/category/Category";
import type { CityUpdate } from "@/domains/cityUpdate/CityUpdate";
import type { Company } from "@/domains/company/Company";
import type { Event } from "@/domains/event/Event";
import type { Job } from "@/domains/job/Job";
import type { News } from "@/domains/news/News";
import type { AppNotification } from "@/domains/notification/Notification";
import type { Promotion } from "@/domains/promotion/Promotion";
import type { AppVersionConfig } from "@/domains/appVersion/AppVersionConfig";
import type { PharmacyDuty } from "@/domains/usefulService/PharmacyDuty";
import type { UsefulService } from "@/domains/usefulService/UsefulService";
import type { Classified } from "@/domains/classified/Classified";
import type { LostFound } from "@/domains/lostFound/LostFound";

type Row = Record<string, any>;

function contactValue(row: Row, kind: string) {
  const contacts = Array.isArray(row.contacts) ? row.contacts : [];
  return (
    contacts.find((contact: Row) => contact.kind === kind)?.value ??
    row[kind] ??
    null
  );
}

function mapCompanyHours(row: Row) {
  const hours = Array.isArray(row.hours) ? row.hours : [];
  return hours.map((item: Row) => ({
    dayOfWeek: item.day_of_week,
    opensAt: item.opens_at,
    closesAt: item.closes_at,
    isClosed: item.is_closed,
    note: item.note,
  }));
}

export function mapCompany(row: Row): Company {
  return {
    id: row.id,
    cityId: row.city_id,
    categoryId: row.category_id,
    categoryName: row.category_name,
    categorySlug: row.category_slug,
    name: row.name,
    slug: row.slug,
    description: row.description,
    rating: row.rating,
    ratingCount: row.rating_count,
    neighborhood: row.neighborhood,
    addressLine: row.address_line,
    latitude: row.latitude,
    longitude: row.longitude,
    logoUrl: row.logo_url,
    coverUrl: row.cover_url,
    createdAt: row.created_at,
    placementType: row.placement_type,
    isFeatured: Boolean(row.is_featured || row.placement_type === "featured"),
    placementPriority:
      row.placement_priority == null ? null : Number(row.placement_priority),
    whatsapp: contactValue(row, "whatsapp"),
    phone: contactValue(row, "phone"),
    instagram: contactValue(row, "instagram"),
    mapsUrl: contactValue(row, "maps"),
    hours: mapCompanyHours(row),
  };
}

export function mapEvent(row: Row): Event {
  return {
    id: row.id,
    cityId: row.city_id,
    categoryId: row.category_id,
    categoryName: row.category_name,
    categorySlug: row.category_slug,
    title: row.title,
    slug: row.slug,
    description: row.description,
    venueName: row.venue_name,
    addressLine: row.address_line,
    neighborhood: row.neighborhood,
    latitude: row.latitude,
    longitude: row.longitude,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    isFree: Boolean(row.is_free),
    priceLabel: row.price_label,
    ticketUrl: row.ticket_url,
    whatsapp: row.whatsapp,
    coverUrl: row.cover_url,
    createdAt: row.created_at,
    placementType: row.placement_type,
    isFeatured: Boolean(
      row.is_featured || row.placement_type === "event_featured",
    ),
    showAddToCalendar: row.show_add_to_calendar,
  };
}

export function mapNews(row: Row): News {
  return {
    id: row.id,
    cityId: row.city_id,
    categoryId: row.category_id,
    categoryName: row.category_name,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    body: row.body,
    coverUrl: row.cover_url,
    publishedAt: row.published_at,
  };
}

export function mapBanner(row: Row): Banner {
  return {
    id: row.id,
    cityId: row.city_id,
    title: row.title,
    subtitle: row.subtitle,
    imageUrl: row.image_url,
    actionLabel: row.action_label,
    actionUrl: row.action_url,
    notes: row.notes,
    isActiveBackgroundImage: row.is_active_background_image,
  };
}

export function mapNotification(row: Row): AppNotification {
  return {
    id: row.id,
    cityId: row.city_id,
    title: row.title,
    body: row.body,
    entityType: row.entity_type,
    entityId: row.entity_id,
    imageUrl: row.image_url,
    publishedAt: row.published_at,
  };
}

export function mapPromotion(row: Row): Promotion {
  return {
    id: row.id,
    cityId: row.city_id,
    companyId: row.company_id,
    categoryId: row.category_id,
    categoryName: row.category_name,
    categorySlug: row.category_slug,
    title: row.title,
    slug: row.slug,
    description: row.description,
    oldPriceCents: row.old_price_cents,
    newPriceCents: row.new_price_cents,
    priceLabel: row.price_label,
    validUntil: row.valid_until,
    whatsapp: row.whatsapp,
    imageUrl: row.image_url,
    companyName: row.company_name,
    companyIsFeatured: Boolean(row.company_is_featured),
    manualPriority: row.manual_priority ?? 100,
    publishedAt: row.published_at,
    createdAt: row.created_at,
  };
}

export function mapJob(row: Row): Job {
  return {
    id: row.id,
    cityId: row.city_id,
    companyId: row.company_id,
    categoryId: row.category_id,
    categoryName: row.category_name,
    categorySlug: row.category_slug,
    title: row.title,
    slug: row.slug,
    companyName: row.company_name,
    locationLabel: row.location_label,
    contractType: row.contract_type,
    salaryLabel: row.salary_label,
    description: row.description,
    requirements: row.requirements,
    applicationUrl: row.application_url,
    whatsapp: row.whatsapp,
    manualPriority: row.manual_priority ?? 100,
    publishedAt: row.published_at,
    createdAt: row.created_at,
  };
}

export function mapAlert(row: Row): Alert {
  return {
    id: row.id,
    cityId: row.city_id,
    title: row.title,
    slug: row.slug,
    summary: row.summary,
    body: row.body,
    importance: row.importance ?? "normal",
    affectedAreas: row.affected_areas,
    expectedResolution: row.expected_resolution,
    publishedAt: row.published_at,
    createdAt: row.created_at,
  };
}

export function mapCityUpdate(row: Row): CityUpdate {
  return {
    id: row.id,
    cityId: row.city_id,
    relatedEntityType: row.related_entity_type,
    relatedEntityId: row.related_entity_id,
    categoryId: row.category_id,
    categoryName: row.category_name,
    categorySlug: row.category_slug,
    title: row.title,
    slug: row.slug,
    summary: row.summary,
    body: row.body,
    imageUrl: row.image_url,
    manualPriority: row.manual_priority ?? 100,
    publishedAt: row.published_at,
    createdAt: row.created_at,
  };
}

export function mapCategory(row: Row): Category {
  return {
    id: row.id,
    cityId: row.city_id,
    kind: row.kind,
    name: row.name,
    slug: row.slug,
    iconName: row.icon_name,
    colorHex: row.color_hex,
  };
}

export function mapPharmacyDuty(row: Row): PharmacyDuty {
  return {
    shiftId: row.shift_id,
    cityId: row.city_id,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    note: row.note ?? null,
    pharmacyId: row.pharmacy_id,
    companyId: row.company_id ?? null,
    name: row.name,
    slug: row.slug,
    whatsapp: row.whatsapp ?? null,
    phone: row.phone ?? null,
    addressLine: row.address_line ?? null,
    neighborhood: row.neighborhood ?? null,
    latitude: row.latitude ?? null,
    longitude: row.longitude ?? null,
    logoUrl: row.logo_url ?? null,
    manualPriority: row.manual_priority ?? 100,
  };
}

export function mapUsefulService(row: Row): UsefulService {
  const validServiceTypes = new Set([
    "pharmacy",
    "hospital",
    "samu",
    "police",
    "firefighters",
    "city_hall",
    "enel",
    "cagece",
    "other",
  ]);

  return {
    id: row.id,
    cityId: row.city_id,
    serviceType: validServiceTypes.has(row.service_type)
      ? row.service_type
      : "other",
    name: row.name,
    phone: row.phone ?? null,
    whatsapp: row.whatsapp ?? null,
    addressLine: row.address_line ?? null,
    latitude: row.latitude ?? null,
    longitude: row.longitude ?? null,
    note: row.note ?? null,
    manualPriority: row.manual_priority ?? 100,
    createdAt: row.created_at ?? null,
    updatedAt: row.updated_at ?? null,
  };
}

export function mapAppVersionConfig(row: Row): AppVersionConfig {
  return {
    id: row.id,
    platform: row.platform,
    latestVersion: row.latest_version,
    minimumVersion: row.minimum_version,
    message: row.message,
    androidUrl: row.android_url ?? null,
    iosUrl: row.ios_url ?? null,
    updateRequired: Boolean(row.update_required),
    updatedAt: row.updated_at,
  };
}

export function mapLostFound(row: Row): LostFound {
  return {
    id: row.id,
    cityId: row.city_id,
    title: row.title,
    slug: row.slug,
    itemType: row.item_type,
    description: row.description,
    contactLabel: row.contact_label,
    imageUrl: row.image_url,
    occurredAt: row.occurred_at,
    manualPriority: Number(row.manual_priority ?? 0),
    publishedAt: row.published_at,
    createdAt: row.created_at,
  };
}

export function mapClassified(row: Row): Classified {
  return {
    id: row.id,
    cityId: row.city_id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    priceLabel: row.price_label,
    whatsapp: row.whatsapp,
    coverUrl: row.cover_url,
    photo1Url: row.photo_1_url,
    photo2Url: row.photo_2_url,
    photo3Url: row.photo_3_url,
    validUntil: row.valid_until,
    manualPriority: Number(row.manual_priority ?? 0),
    publishedAt: row.published_at,
    createdAt: row.created_at,
  };
}
