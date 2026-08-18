import { createContext, PropsWithChildren, useContext, useMemo } from "react";
import type { Repositories } from "@/domains/Repositories";
import { SupabaseAlertRepo } from "./supabase/SupabaseAlertRepo";
import { SupabaseCategoryRepo } from "./supabase/SupabaseCategoryRepo";
import { SupabaseCityUpdateRepo } from "./supabase/SupabaseCityUpdateRepo";
import { SupabaseCompanyRepo } from "./supabase/SupabaseCompanyRepo";
import { SupabaseEventRepo } from "./supabase/SupabaseEventRepo";
import { SupabaseHomeRepo } from "./supabase/SupabaseHomeRepo";
import { SupabaseJobRepo } from "./supabase/SupabaseJobRepo";
import { SupabaseNewsRepo } from "./supabase/SupabaseNewsRepo";
import { SupabasePromotionRepo } from "./supabase/SupabasePromotionRepo";
import { SupabaseUsefulServiceRepo } from "./supabase/SupabaseUsefulServiceRepo";
import { SupabaseAppVersionRepo } from "./supabase/SupabaseAppVersionRepo";
import { SupabaseClassifiedRepo } from "./supabase/SupabaseClassifiedRepo";
import { SupabaseLostFoundRepo } from "./supabase/SupabaseLostFoundRepo";

const RepositoryContext = createContext<Repositories | null>(null);

export function RepositoryProvider({ children }: PropsWithChildren) {
  const repositories = useMemo<Repositories>(
    () => ({
      homeRepo: new SupabaseHomeRepo(),
      companyRepo: new SupabaseCompanyRepo(),
      eventRepo: new SupabaseEventRepo(),
      newsRepo: new SupabaseNewsRepo(),
      categoryRepo: new SupabaseCategoryRepo(),
      promotionRepo: new SupabasePromotionRepo(),
      jobRepo: new SupabaseJobRepo(),
      alertRepo: new SupabaseAlertRepo(),
      cityUpdateRepo: new SupabaseCityUpdateRepo(),
      usefulServiceRepo: new SupabaseUsefulServiceRepo(),
      appVersionRepo: new SupabaseAppVersionRepo(),
      classifiedRepo: new SupabaseClassifiedRepo(),
      lostFoundRepo: new SupabaseLostFoundRepo(),
    }),
    [],
  );

  return (
    <RepositoryContext.Provider value={repositories}>
      {children}
    </RepositoryContext.Provider>
  );
}

export function useRepositories() {
  const repositories = useContext(RepositoryContext);
  if (!repositories)
    throw new Error("useRepositories must be used inside RepositoryProvider");
  return repositories;
}
