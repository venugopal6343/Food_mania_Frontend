export const apiEndpoints = {
  auth: {
    login: '/api/v1/auth/login',
    signup: '/api/v1/auth/signup'
  },
  categories: {
    list: '/api/v1/categories'
  },
  menu: {
    list: '/api/v1/menu-items',
    byId: (id: string) => `/api/v1/menu-items/${id}`
  },
  cart: {
    root: '/api/v1/cart',
    items: '/api/v1/cart/items',
    item: (cartItemId: string) => `/api/v1/cart/items/${cartItemId}`
  },
  orders: {
    checkout: '/api/v1/orders/checkout',
    list: '/api/v1/orders',
    byId: (id: string) => `/api/v1/orders/${id}`
  },
  users: {
    me: '/api/v1/users/me'
  },
  admin: {
    dashboardSummary: '/api/v1/admin/dashboard/summary',
    menuItems: '/api/v1/admin/menu-items',
    menuItem: (id: string) => `/api/v1/admin/menu-items/${id}`,
    menuItemStock: (id: string) => `/api/v1/admin/menu-items/${id}/stock`,
    menuItemImages: '/api/v1/admin/menu-items/images',
    orders: '/api/v1/admin/orders',
    orderStatus: (id: string) => `/api/v1/admin/orders/${id}/status`
  }
} as const;
