import { Model, QueryFilter } from 'mongoose';

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function paginate<T>(
  model: Model<T>,
  filter: QueryFilter<T>,
  page: number,
  limit: number,
  sort: Record<string, 1 | -1> = { createdAt: -1 },
  projection?: string,
): Promise<PaginatedResult<T>> {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    model
      .find(filter, projection)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec(),
    model.countDocuments(filter).exec(),
  ]);

  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
}
