import { type BookingRequest, type Sitter } from '@/core/types';

export function calculateBookingCost(booking: BookingRequest, sitter: Sitter) {
  const nights = (new Date(booking.end_date).getTime() - new Date(booking.start_date).getTime()) / (1000 * 60 * 60 * 24);
  const baseRate = (sitter.base_rate_cents || 0) * nights;

  const addOnsCost = booking.booking_addons?.reduce((total, addon) => {
    const sitterAddon = sitter.sitter_addons?.find(sa => sa.id === addon.sitter_addons.id);
    return total + (sitterAddon?.price_cents || 0);
  }, 0) || 0;

  const applicableDiscount = sitter.sitter_discounts?.reduce((bestDiscount: { id: string; min_days: number; percentage: number; } | null, currentDiscount) => {
    if (nights >= currentDiscount.min_days && (!bestDiscount || currentDiscount.min_days > bestDiscount.min_days)) {
      return currentDiscount;
    }
    return bestDiscount;
  }, null);

  const discountPercentage = applicableDiscount ? applicableDiscount.percentage : 0;
  const discount = (baseRate * discountPercentage) / 100;

  const totalCost = baseRate + addOnsCost - discount;

  return {
    baseRate,
    addOnsCost,
    discount,
    totalCost,
  };
}
