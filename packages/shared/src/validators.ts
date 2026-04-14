export const isValidIndianPhone = (phone: string): boolean =>
  /^[6-9]\d{9}$/.test(phone);

export const isValidOtp = (otp: string): boolean =>
  /^\d{6}$/.test(otp);

export const isValidAmount = (amount: number): boolean =>
  typeof amount === 'number' && amount > 0 && isFinite(amount);

export const sanitizePhone = (phone: string): string =>
  phone.replace(/\D/g, '').slice(-10);
