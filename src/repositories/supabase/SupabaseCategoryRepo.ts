import type { Category } from '@/domains/category/Category';
import type { ICategoryRepo } from '@/domains/category/ICategoryRepo';
import { mapCategory } from './mappers';
import { supabase } from './supabase';

export class SupabaseCategoryRepo implements ICategoryRepo {
  async list(kind: Category['kind']): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('kind', kind)
      .eq('is_active', true)
      .order('sort_order');

    if (error) throw error;
    return (data ?? []).map(mapCategory);
  }
}
