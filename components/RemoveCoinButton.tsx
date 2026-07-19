"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface RemoveCoinButtonProps {
  coinId: string;
  coinName: string;
}

export default function RemoveCoinButton({ coinId, coinName }: RemoveCoinButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    if (typeof window === "undefined") return;
    const email = localStorage.getItem("pulseboard_user_email");

    if (!email) {
      alert("No operator email found. Cannot remove default coins.");
      return;
    }

    const confirmRemove = confirm(`Are you sure you want to stop tracking ${coinName}?`);
    if (!confirmRemove) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from("user_coins")
        .delete()
        .eq("user_email", email.trim().toLowerCase())
        .eq("coin_id", coinId);

      if (error) throw error;

      // Refresh server-side data to redraw dashboard price grid
      router.refresh();
    } catch (err) {
      console.error("Error removing tracked coin:", err);
      alert("Failed to remove coin from tracking list.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleRemove}
      disabled={loading}
      className="p-1 rounded-full text-text-muted/40 hover:text-danger hover:bg-background border border-transparent hover:border-border-hairline-soft transition-all cursor-pointer shrink-0"
      title={`Stop tracking ${coinName}`}
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <X className="w-3.5 h-3.5" />
      )}
    </button>
  );
}
