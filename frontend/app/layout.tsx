import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/navbar";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Clinic Booking",
  description: "Online booking platform for clinics and service businesses",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" className={`${fraunces.variable} ${inter.variable}`}>
      <body
        style={{ fontFamily: "var(--font-body)" }}
        className="bg-[#F5F8F8] text-[#14262A]"
      >
        <AuthProvider>
          <Navbar />
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              classNames: {
                toast: "!rounded-lg !border !border-[#DCE8E7] !bg-white !text-[#14262A] !shadow-[0_1px_2px_rgba(20,38,42,0.04),0_12px_32px_-16px_rgba(20,38,42,0.12)]",
                title: "!text-[14px] !font-medium",
                description: "!text-[13px] !text-[#5C7377]",
                success: "!border-[#1F6E71]/30",
                error: "!border-[#B54634]/30",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}