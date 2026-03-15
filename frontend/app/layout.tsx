import { ReactNode } from "react";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { InventoryProvider } from "@/context/InventoryContext";

export const metadata = {
  title: "Bold Stock — Inventory Management",
  description: "Modern inventory management system built with Next.js",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <InventoryProvider>
            {children}
          </InventoryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
