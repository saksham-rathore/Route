import { Metadata } from "next";
import LegalPageContent from "@/components/legal/LegalPageContent";

export const metadata: Metadata = {
  title: "Terms of Service — Route Analytics",
  description:
    "Review the Terms of Service for Route Analytics platform, including acceptable use, data ownership, quotas, and service guarantees.",
};

export default function TermsPage() {
  return <LegalPageContent initialTab="terms" />;
}
