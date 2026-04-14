export const formatCurrency = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  if (!num) return '0';
  return new Intl.NumberFormat('en-IN').format(num);
};

export const formatDate = (dateStr: string | undefined | null): string => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
};

export const daysUntilExpiry = (expiryDate: string | null | undefined): number | null => {
  if (!expiryDate) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
};

export const daysUntilDue = (dueDate: string | null | undefined): number | null => {
  if (!dueDate) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
};

export type ExpiryStatus = {
  status: 'expired' | 'today' | 'critical' | 'warning' | 'ok';
  label: string;
  color: 'red' | 'yellow' | 'green';
};

export const getExpiryStatus = (expiryDate: string | null | undefined): ExpiryStatus | null => {
  const days = daysUntilExpiry(expiryDate);
  if (days === null) return null;
  if (days < 0)  return { status: 'expired',  label: 'Expired',        color: 'red'    };
  if (days === 0) return { status: 'today',   label: 'Expires today',  color: 'red'    };
  if (days <= 3)  return { status: 'critical', label: `${days}d left`, color: 'red'    };
  if (days <= 7)  return { status: 'warning',  label: `${days}d left`, color: 'yellow' };
  return { status: 'ok', label: `${days}d left`, color: 'green' };
};

export const getMonday = (date: Date = new Date()): string => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split('T')[0];
};

export const formatWeekRange = (weekStart: string): string => {
  const start = new Date(weekStart);
  const end = new Date(weekStart);
  end.setDate(end.getDate() + 6);
  const startStr = start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  const endStr = end.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  return `${startStr} – ${endStr}`;
};

export const getCurrentMonth = (): string => new Date().toISOString().slice(0, 7);

export const formatMonth = (m: string): string => {
  if (!m) return '';
  const [year, month] = m.split('-');
  return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-IN', {
    month: 'long', year: 'numeric',
  });
};
