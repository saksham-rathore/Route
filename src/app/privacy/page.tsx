import { Metadata } from "next";
import LegalPageContent from "@/components/legal/LegalPageContent";

export const metadata: Metadata = {
  title: "Privacy Policy — Route Analytics",
  description:
    "Understand how Route protects your privacy with cookieless telemetry, zero cross-site profiling, and transparent data processing.",
};

export default function PrivacyPage() {
  return <LegalPageContent initialTab="privacy" />;
}
