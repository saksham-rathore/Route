import { Metadata } from "next";
import LegalPageContent from "@/components/legal/LegalPageContent";

export const metadata: Metadata = {
  title: "Terms and Policies — Route Analytics",
  description:
    "Comprehensive legal agreements, privacy guarantees, telemetry protocols, and cookie notices for Route Analytics.",
};

export default function TermsAndPoliciesPage() {
  return <LegalPageContent initialTab="terms" />;
}
