import type { Banner } from "../banner/Banner";
import type { Company } from "../company/Company";
import type { Event } from "../event/Event";
import type { News } from "../news/News";
import type { AppNotification } from "../notification/Notification";

export type HappeningNowSummary = {
  promotionsCount: number;
  todayEventsCount: number;
  jobsCount: number;
  alertsCount: number;
  updatesCount: number;
  pharmacyDutyCount: number;
};

export type HomePayload = {
  city: {
    id: string;
    name: string;
    state_code: string;
    slug: string;
  } | null;
  happeningNow: HappeningNowSummary;
  superBanners: Banner[];
  homeCompanies: Company[];
  homeEvents: Event[];
  latestNews: News[];
  notifications: AppNotification[];
};
