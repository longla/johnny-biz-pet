
import { type BookingRequest } from '@/core/types';
import { Calendar } from 'lucide-react';

interface PaymentBreakdownProps {
  booking: BookingRequest & {
    booking_addons?: {
      price_cents_at_booking: number;
      sitter_addons: {
        id: string;
        name: string;
      };
    }[];
  };
  nights: number;
}

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center text-gray-700">
    <Calendar className="w-5 h-5 mr-3 text-gray-400" />
    <span className="font-medium">{label}:</span>
    <span className="ml-2">{value}</span>
  </div>
);

export default function PaymentBreakdown({ booking, nights }: PaymentBreakdownProps) {
  const baseRate = (booking.base_rate_at_booking_cents || 0) * nights;
  const addOnsCost = booking.booking_addons?.reduce((total, addon) => total + addon.price_cents_at_booking, 0) || 0;
  const discount = booking.discount_applied_cents || 0;
  const totalCost = baseRate + addOnsCost - discount;

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">
        Payment
      </h2>
      <div className="space-y-3">
        <InfoRow
          label="Base Rate"
          value={`$${baseRate ? baseRate / 100 : 'N/A'}`}
        />
        {booking.booking_addons?.map((addon) => (
          <InfoRow
            key={addon.sitter_addons.id}
            label={`Add-on: ${addon.sitter_addons.name}`}
            value={`$${addon.price_cents_at_booking / 100}`}
          />
        ))}
        <InfoRow
          label="Discount"
          value={`-$${discount / 100}`}
        />
        <InfoRow
          label="Total Cost"
          value={`$${totalCost ? totalCost / 100 : 'N/A'}`}
        />
      </div>
    </div>
  );
}
