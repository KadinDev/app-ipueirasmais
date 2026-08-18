import type { Category } from './Category';

export interface ICategoryRepo {
  list(kind: Category['kind']): Promise<Category[]>;
}
