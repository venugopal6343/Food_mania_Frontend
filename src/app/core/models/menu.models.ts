import { IsoInstant, Uuid } from './api.models';

export type SpiceLevel = 'MILD' | 'MEDIUM' | 'HOT' | 'EXTRA_HOT';
export type CategoryName = 'VEG' | 'NON_VEG' | 'VEGAN' | string;

export interface CategoryResponse {
  id: Uuid;
  name: CategoryName;
  displayName: string;
  description: string;
}

export interface MenuItemResponse {
  id: Uuid;
  name: string;
  description: string;
  price: number;
  categoryName: CategoryName;
  categoryDisplayName: string;
  spiceLevel: SpiceLevel;
  imageUrl: string;
  available: boolean;
  createdAt: IsoInstant;
  updatedAt: IsoInstant;
}

export interface MenuItemRequest {
  name: string;
  description: string;
  price: number;
  categoryName: CategoryName;
  spiceLevel: SpiceLevel;
  imageUrl: string;
  available?: boolean;
}

export interface StockUpdateRequest {
  available: boolean;
}

export interface MenuFilters {
  category?: string;
  spiceLevel?: SpiceLevel | '';
  minPrice?: number | null;
  maxPrice?: number | null;
}
