import { type BookingRequest, type Customer, type Pet } from "@/core/types";
import { createClient } from "@/utils/supabase/client";
import {
  Calendar,
  Check,
  Loader,
  Mail,
  MapPin,
  User,
  X,
  type LucideProps,
} from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState, type ElementType } from "react";
import SitterLayout from "../_layout";

type FullBookingRequest = BookingRequest & {
  customers: Customer | null;
  pets: Pet[];
  booking_addons: {
    sitter_addons: {
      id: string;
      name: string;
      price_cents: number;
    };
  }[];
  booking_notes: BookingNote[];
};

type ActionStatus = "idle" | "loading" | "success" | "error";

interface InfoRowProps {
  icon: ElementType<LucideProps>;
  label: string;
  value: string | number | null | undefined;
}

import BookingNotes from "@/components/booking-notes";

// ... (rest of the file)

export default function BookingDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [request, setRequest] = useState<FullBookingRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionStatus, setActionStatus] = useState<ActionStatus>("idle");
  const [actionError, setActionError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const supabase = createClient();

  useEffect(() => {
    if (!id) return;

    const fetchBookingDetails = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          setError("You must be logged in.");
          setLoading(false);
          return;
        }
        setUser(user);

        const { data, error } = await supabase
          .from("booking_requests")
          .select(
            `
                        *,
                        customers (*),
                        booking_pets(pets(*)),
                        booking_addons(sitter_addons(*)),
                        booking_notes(*, user:users(first_name, last_name))
                    `
          )
          .eq("id", id)
          .single();

        if (error) throw error;
        if (!data) throw new Error("Booking not found.");

        if (data.status === "ACCEPTED") {
          const { data: sitterProfile, error: sitterError } = await supabase
            .from("sitters")
            .select("id")
            .eq("user_id", user.id)
            .single();

          if (
            sitterError ||
            !sitterProfile ||
            sitterProfile.id !== data.assigned_sitter_id
          ) {
            setError("You are not authorized to view this booking.");
            setRequest(null);
            setLoading(false);
            return;
          }
        }

        setRequest(data as FullBookingRequest);
      } catch (e: any) {
        setError("Failed to load booking details.");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [id, supabase]);

  const handleAction = async (action: "accept" | "decline") => {
    setActionStatus("loading");
    setActionError(null);

    try {
      const response = await fetch(`/api/sitter/${action}-booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: id }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "An unknown error occurred.");
      }

      setActionStatus("success");
      setTimeout(() => router.push("/sitter"), 2000);
    } catch (e: any) {
      setActionStatus("error");
      setActionError(e.message);
    }
  };

  if (loading) {
    return (
      <SitterLayout>
        <div className="p-10 text-center">
          <Loader className="mx-auto animate-spin text-[#F28C38]" />
        </div>
      </SitterLayout>
    );
  }

  if (error || !request) {
    return (
      <SitterLayout>
        <div className="p-10 text-center text-red-600">
          {error || "Booking not found."}
        </div>
      </SitterLayout>
    );
  }

  const InfoRow = ({ icon: Icon, label, value }: InfoRowProps) => (
    <div className="flex items-center text-gray-700">
      <Icon className="w-5 h-5 mr-3 text-gray-400" />
      <span className="font-medium">{label}:</span>
      <span className="ml-2">{value}</span>
    </div>
  );

  return (
    <SitterLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Booking Details
        </h1>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">
            Customer Information
          </h2>
          <div className="space-y-3">
            <InfoRow icon={User} label="Name" value={request.customers?.name} />
            <InfoRow
              icon={Mail}
              label="Email"
              value={request.customers?.email}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">
            Booking Information
          </h2>
          <div className="space-y-3">
            <InfoRow
              icon={Calendar}
              label="Dates"
              value={`${new Date(
                request.start_date
              ).toLocaleDateString()} - ${new Date(
                request.end_date
              ).toLocaleDateString()}`}
            />
            <InfoRow icon={MapPin} label="County" value={request.county} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">
            Pet Information
          </h2>
          <ul>
            {request.booking_pets?.map(({ pets }) => (
              <li key={pets.id}>
                {pets.name} ({pets.breed})
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">
            Add-ons
          </h2>
          <ul>
            {request.booking_addons?.map(({ sitter_addons }) => (
              <li key={sitter_addons.id}>
                {sitter_addons.name} (${sitter_addons.price_cents / 100})
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">
            Booking Notes
          </h2>
          <BookingNotes
            bookingId={request.id}
            notes={request.booking_notes || []}
            user={user}
          />
        </div>

        {request.status === "PENDING_SITTER_ACCEPTANCE" && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Actions</h2>
            {actionStatus === "idle" && (
              <div className="flex space-x-4">
                <button
                  onClick={() => handleAction("accept")}
                  className="flex-1 bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
                >
                  <Check className="mr-2" /> Accept
                </button>
                <button
                  onClick={() => handleAction("decline")}
                  className="flex-1 bg-red-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center"
                >
                  <X className="mr-2" /> Decline
                </button>
              </div>
            )}
            {actionStatus === "loading" && (
              <div className="text-center">
                <Loader className="mx-auto animate-spin" />
              </div>
            )}
            {actionStatus === "success" && (
              <div className="text-center text-green-600 font-bold">
                Action successful! Redirecting...
              </div>
            )}
            {actionStatus === "error" && (
              <div className="text-center text-red-600 font-bold">
                {actionError}
              </div>
            )}
          </div>
        )}
      </div>
    </SitterLayout>
  );
}
