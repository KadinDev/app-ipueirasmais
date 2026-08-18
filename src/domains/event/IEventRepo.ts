import type { Event } from "./Event";

export interface IEventRepo {
  list(categorySlug?: string | null): Promise<Event[]>;
  findById(id: string): Promise<Event | null>;
}
