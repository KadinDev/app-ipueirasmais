import type { Company } from './Company';

export type CompanyListParams = {
  categorySlug?: string | null;
  search?: string | null;
  limit: number;
  offset: number;
};

export interface ICompanyRepo {
  list(params: CompanyListParams): Promise<Company[]>;
  findById(id: string): Promise<Company | null>;
  getRandomFeaturedForNews(cityId: string): Promise<Company | null>;
}
