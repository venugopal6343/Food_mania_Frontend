import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { environment } from '../../../../configs/environment';
import { CartLineResponse } from '../../../../core/models/cart.models';
import { CategoryResponse, MenuFilters, MenuItemResponse, SpiceLevel } from '../../../../core/models/menu.models';
import { PaymentProvider } from '../../../../core/models/order.models';
import { AdminDashboardService } from '../../../../core/services/admin-dashboard.service';
import { AppMessageService } from '../../../../core/services/app-message.service';
import { AuthService } from '../../../../core/services/auth.service';
import { CartService } from '../../../../core/services/cart.service';
import { MenuService } from '../../../../core/services/menu.service';
import { OrderService } from '../../../../core/services/order.service';
import { ProfileService } from '../../../../core/services/profile.service';
import { GenericTableComponent } from '../../../../shared/components/generic-table/generic-table.component';
import { TableColumn } from '../../../../shared/components/generic-table/generic-table.models';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { StatusPillComponent, StatusTone } from '../../../../shared/components/status-pill/status-pill.component';
import { InrCurrencyPipe } from '../../../../shared/pipes/inr-currency.pipe';

type TableRow = Record<string, unknown>;

interface DashboardMetric {
  label: string;
  value: string;
  detail: string;
}

@Component({
  selector: 'fm-main-dashboard-page',
  standalone: true,
  imports: [GenericTableComponent, InrCurrencyPipe, ModalComponent, StatusPillComponent],
  templateUrl: './main-dashboard.page.html',
  styleUrl: './main-dashboard.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainDashboardPageComponent implements OnInit {
  readonly auth = inject(AuthService);
  readonly menu = inject(MenuService);
  readonly cart = inject(CartService);
  readonly orders = inject(OrderService);
  readonly profile = inject(ProfileService);
  readonly adminDashboard = inject(AdminDashboardService);

  private readonly messages = inject(AppMessageService);
  private readonly brokenImages = signal<Set<string>>(new Set());
  private readonly money = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: environment.defaultCurrency,
    maximumFractionDigits: 0
  });

  readonly activeCategory = signal('all');
  readonly searchTerm = signal('');
  readonly spiceLevel = signal<SpiceLevel | ''>('');
  readonly cartOpen = signal(false);
  readonly checkoutOpen = signal(false);
  readonly actionLoading = signal(false);
  readonly checkoutLoading = signal(false);
  readonly paymentProvider = signal<PaymentProvider>('RAZORPAY');
  readonly sandboxPaymentToken = signal('tok_sandbox_success');

  readonly isUser = computed(() => this.auth.session()?.role === 'ROLE_USER');
  readonly categories = computed(() => [
    { id: 'all', name: 'all', displayName: 'All', description: 'All menu items' } satisfies CategoryResponse,
    ...this.menu.categories()
  ]);

  readonly filteredItems = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();

    return this.menu.menuItems().filter((item) => {
      if (!term) {
        return true;
      }

      return `${item.name} ${item.description} ${item.categoryDisplayName}`.toLowerCase().includes(term);
    });
  });

  readonly metrics = computed<DashboardMetric[]>(() => {
    if (this.auth.isAdmin()) {
      const summary = this.adminDashboard.summary();
      return [
        {
          label: 'Total Users',
          value: String(summary?.totalUsers ?? 0),
          detail: 'Registered accounts'
        },
        {
          label: 'Available Items',
          value: `${summary?.availableMenuItems ?? 0}/${summary?.totalMenuItems ?? this.menu.menuItems().length}`,
          detail: 'Menu stock visibility'
        },
        {
          label: 'Revenue',
          value: this.money.format(summary?.totalRevenue ?? 0),
          detail: 'Successful payments'
        }
      ];
    }

    return [
      {
        label: 'Menu Items',
        value: String(this.menu.menuItems().length),
        detail: 'Available for this session'
      },
      {
        label: 'Cart Items',
        value: String(this.cart.cart().totalItems),
        detail: this.money.format(this.cart.cart().totalAmount)
      },
      {
        label: 'Orders',
        value: String(this.orders.orders().length),
        detail: 'Placed by this account'
      }
    ];
  });

  readonly orderRows = computed<TableRow[]>(() =>
    this.orders.orders().slice(0, 6).map((order) => ({
      orderNumber: order.orderNumber || 'Pending',
      status: order.orderStatus,
      payment: order.paymentStatus,
      total: order.totalAmount,
      createdAt: this.formatDate(order.createdAt)
    }))
  );

  readonly orderColumns: TableColumn<TableRow>[] = [
    { key: 'orderNumber', label: 'Order' },
    { key: 'status', label: 'Status' },
    { key: 'payment', label: 'Payment' },
    {
      key: 'total',
      label: 'Total',
      align: 'end',
      formatter: (value) => this.money.format(Number(value ?? 0))
    },
    { key: 'createdAt', label: 'Created', align: 'end' }
  ];

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.menu.loadCategories().subscribe({ error: () => undefined });
    this.refreshMenu();

    if (this.auth.isAdmin()) {
      this.adminDashboard.loadSummary().subscribe({ error: () => undefined });
      return;
    }

    this.profile.loadMe().subscribe({ error: () => undefined });
    this.cart.loadCart().subscribe({ error: () => undefined });
    this.orders.loadOrders().subscribe({ error: () => undefined });
  }

  refreshMenu(): void {
    this.menu.loadMenu(this.apiFilters()).subscribe({ error: () => undefined });
  }

  refreshAdminSummary(): void {
    this.adminDashboard.loadSummary().subscribe({ error: () => undefined });
  }

  refreshOrders(): void {
    this.orders.loadOrders().subscribe({ error: () => undefined });
  }

  setCategory(category: string): void {
    this.activeCategory.set(category);
    this.refreshMenu();
  }

  setSpiceLevel(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.spiceLevel.set(value as SpiceLevel | '');
    this.refreshMenu();
  }

  setSearchTerm(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  setPaymentProvider(event: Event): void {
    this.paymentProvider.set((event.target as HTMLSelectElement).value as PaymentProvider);
  }

  setPaymentToken(event: Event): void {
    this.sandboxPaymentToken.set((event.target as HTMLInputElement).value);
  }

  addToCart(item: MenuItemResponse): void {
    if (!this.isUser()) {
      this.messages.show('Admin accounts can inspect menu data. Use a user account for cart actions.', 'warning');
      return;
    }

    this.actionLoading.set(true);
    this.cart.addItem(item.id, 1).pipe(
      finalize(() => this.actionLoading.set(false))
    ).subscribe({
      next: () => {
        this.cartOpen.set(true);
        this.messages.show(`${item.name} added to cart.`, 'success');
      },
      error: () => undefined
    });
  }

  updateQuantity(line: CartLineResponse, nextQuantity: number): void {
    const quantity = Math.max(1, Math.min(50, nextQuantity));

    this.cart.updateItem(line.cartItemId, quantity).subscribe({
      next: () => this.messages.show('Cart updated.', 'success'),
      error: () => undefined
    });
  }

  removeLine(line: CartLineResponse): void {
    this.cart.removeItem(line.cartItemId).subscribe({
      next: () => this.messages.show(`${line.name} removed.`, 'info'),
      error: () => undefined
    });
  }

  clearCart(): void {
    this.cart.clearCart().subscribe({
      next: () => this.messages.show('Cart cleared.', 'info'),
      error: () => undefined
    });
  }

  checkout(): void {
    if (this.cart.cart().totalItems === 0) {
      this.messages.show('Add at least one item before checkout.', 'warning');
      return;
    }

    this.checkoutLoading.set(true);
    this.orders.checkout({
      provider: this.paymentProvider(),
      sandboxPaymentToken: this.sandboxPaymentToken(),
      currency: environment.defaultCurrency
    }).pipe(
      finalize(() => this.checkoutLoading.set(false))
    ).subscribe({
      next: (order) => {
        this.messages.show(`Order ${order.orderNumber} placed successfully.`, 'success');
        this.checkoutOpen.set(false);
        this.cartOpen.set(false);
        this.cart.loadCart().subscribe({ error: () => undefined });
        this.orders.loadOrders().subscribe({ error: () => undefined });
      },
      error: () => undefined
    });
  }

  markImageBroken(itemId: string): void {
    this.brokenImages.update((ids) => new Set(ids).add(itemId));
  }

  hasImage(item: MenuItemResponse): boolean {
    return Boolean(item.imageUrl) && !this.brokenImages().has(item.id);
  }

  initials(name: string): string {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('');
  }

  statusTone(status: string): StatusTone {
    return switchStatusTone(status);
  }

  private apiFilters(): MenuFilters {
    return {
      category: this.activeCategory() === 'all' ? undefined : this.activeCategory(),
      spiceLevel: this.spiceLevel() || undefined
    };
  }

  private formatDate(value: string): string {
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(value));
  }
}

function switchStatusTone(status: string): StatusTone {
  switch (status) {
    case 'SUCCESS':
    case 'DELIVERED':
      return 'success';
    case 'PENDING':
    case 'PREPARING':
    case 'CREATED':
    case 'INITIATED':
      return 'warning';
    case 'FAILED':
    case 'CANCELLED':
      return 'danger';
    case 'OUT_FOR_DELIVERY':
      return 'info';
    case 'MILD':
      return 'success';
    case 'MEDIUM':
      return 'warning';
    case 'HOT':
    case 'EXTRA_HOT':
      return 'danger';
    default:
      return 'neutral';
  }
}
