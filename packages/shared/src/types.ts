export interface User {
  id: number;
  phone: string;
  name: string;
  language: 'en' | 'hi';
  dark_mode: number;
  dietary_pref: string;
  family_size: number;
  monthly_budget: number;
  created_at?: string;
}

export interface GroceryList {
  id: number;
  user_id: number;
  name: string;
  share_code?: string;
  created_at: string;
  item_count?: number;
  checked_count?: number;
}

export interface GroceryItem {
  id: number;
  list_id: number;
  name: string;
  name_hi?: string;
  quantity: number;
  unit: string;
  category: string;
  is_checked: number;
  is_recurring: number;
  notes?: string;
  added_by?: number;
  created_at: string;
}

export interface PantryItem {
  id: number;
  user_id: number;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  storage_zone: string;
  expiry_date?: string;
  purchase_date?: string;
  purchase_price?: number;
  created_at: string;
}

export interface Transaction {
  id: number;
  user_id: number;
  amount: number;
  type: 'expense' | 'income';
  category: string;
  description?: string;
  date: string;
  payment_method: string;
  created_at: string;
}

export interface Bill {
  id: number;
  user_id: number;
  name: string;
  amount: number;
  due_date: string;
  is_recurring: number;
  recurrence: string;
  is_paid: number;
  category: string;
  created_at?: string;
}

export interface Subscription {
  id: number;
  user_id: number;
  name: string;
  amount: number;
  billing_cycle: string;
  renewal_date?: string;
  category: string;
  is_active: number;
}

export interface MealPlan {
  id: number;
  user_id: number;
  week_start: string;
  plan_json: MealPlanData;
  created_at: string;
}

export interface MealPlanData {
  days: MealDay[];
  shopping_list?: ShoppingListItem[];
  estimated_cost?: number;
}

export interface MealDay {
  date: string;
  meals: {
    breakfast?: Meal;
    lunch?: Meal;
    dinner?: Meal;
  };
}

export interface Meal {
  name: string;
  name_hi?: string;
  cuisine?: string;
  time_mins?: number;
  ingredients?: string[];
  recipe_steps?: string[];
  uses_pantry?: boolean;
}

export interface ShoppingListItem {
  name: string;
  quantity: number;
  unit: string;
  category: string;
}

export interface FinanceSummary {
  month: string;
  budget: number;
  total_expense: number;
  total_income: number;
  budget_used_pct: number;
  by_category: { category: string; total: number }[];
  upcoming_bills: Bill[];
  subscriptions_monthly: number;
}

export interface PriceResult {
  platform: string;
  name: string;
  color: string;
  textColor: string;
  delivery_time: string;
  min_order: number;
  available: boolean;
  price?: number;
  mrp?: number;
  discount?: number;
  discount_pct?: number;
  is_best?: boolean;
}

export interface PriceComparison {
  item: string;
  query: string;
  quantity: number;
  unit: string;
  results: PriceResult[];
}

export interface MandiResult {
  mandi: string;
  state: string;
  min_price: number;
  max_price: number;
  modal_price: number;
  prev_price: number;
  change_pct: number;
  unit: string;
  date: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
