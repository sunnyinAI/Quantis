// Indian currency formatter
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format number in Indian system (1,23,456)
export const formatNumber = (num) => {
  if (!num) return '0';
  return new Intl.NumberFormat('en-IN').format(num);
};

// Format date as "14 Apr 2026"
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

// Days until expiry
export const daysUntilExpiry = (expiryDate) => {
  if (!expiryDate) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  return Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
};

// Days until due
export const daysUntilDue = (dueDate) => {
  if (!dueDate) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return Math.ceil((due - now) / (1000 * 60 * 60 * 24));
};

// Get expiry status
export const getExpiryStatus = (expiryDate) => {
  const days = daysUntilExpiry(expiryDate);
  if (days === null) return null;
  if (days < 0) return { status: 'expired', label: 'Expired', color: 'red' };
  if (days === 0) return { status: 'today', label: 'Expires today', color: 'red' };
  if (days <= 3) return { status: 'critical', label: `${days}d left`, color: 'red' };
  if (days <= 7) return { status: 'warning', label: `${days}d left`, color: 'yellow' };
  return { status: 'ok', label: `${days}d left`, color: 'green' };
};

// Get Monday of week
export const getMonday = (date = new Date()) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split('T')[0];
};

// Format week range
export const formatWeekRange = (weekStart) => {
  const start = new Date(weekStart);
  const end = new Date(weekStart);
  end.setDate(end.getDate() + 6);
  const startStr = start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  const endStr = end.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  return `${startStr} – ${endStr}`;
};

export const getCurrentMonth = () => new Date().toISOString().slice(0, 7);
export const formatMonth = (m) => {
  if (!m) return '';
  const [year, month] = m.split('-');
  return new Date(year, month - 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
};
