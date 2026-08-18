import type { News } from "./News";

export interface INewsRepo {
  list(): Promise<News[]>;
  findById(id: string): Promise<News | null>;
}
