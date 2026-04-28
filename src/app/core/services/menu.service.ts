import { Injectable, inject, signal } from '@angular/core';
import { Observable, finalize, tap } from 'rxjs';
import { apiEndpoints } from '../../configs/api-endpoints';
import { CategoryResponse, MenuFilters, MenuItemResponse } from '../models/menu.models';
import { BaseHttpService } from './base-http.service';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private readonly http = inject(BaseHttpService);
  private readonly categoriesState = signal<CategoryResponse[]>([]);
  private readonly menuItemsState = signal<MenuItemResponse[]>([]);
  private readonly loadingState = signal(false);

  readonly categories = this.categoriesState.asReadonly();
  readonly menuItems = this.menuItemsState.asReadonly();
  readonly loading = this.loadingState.asReadonly();

  loadCategories(): Observable<CategoryResponse[]> {
    return this.http.get<CategoryResponse[]>(apiEndpoints.categories.list).pipe(
      tap((categories) => this.categoriesState.set(categories))
    );
  }

  loadMenu(filters: MenuFilters = {}): Observable<MenuItemResponse[]> {
    this.loadingState.set(true);

    return this.http.get<MenuItemResponse[]>(apiEndpoints.menu.list, { params: { ...filters } }).pipe(
      tap((items) => this.menuItemsState.set(items)),
      finalize(() => this.loadingState.set(false))
    );
  }
}
