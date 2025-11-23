"use client";

import { ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface CartIconProps {
  userId?: number;
}

export default function CartIcon({ userId }: CartIconProps) {
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (userId) {
      fetchCartCount();
    }
  }, [userId]);

  const fetchCartCount = async () => {
    try {
      const res = await fetch(`/api/cart?userId=${userId}`);
      if (res.ok) {
        const items = await res.json();
        setCartCount(items.length);
      }
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  const handleClick = () => {
    if (userId) {
      router.push("/cart");
    } else {
      router.push("/login");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
    >
      <ShoppingCart className="w-6 h-6" />
      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {cartCount}
        </span>
      )}
    </button>
  );
}
