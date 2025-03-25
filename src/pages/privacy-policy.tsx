import PrivacyPolicyComponent from "@/components/privacy-policy";
import MainLayout from "../pages/_layouts";

function TermOfUsePage() {
  return (
    <MainLayout
      title="Privacy Policy | QRganiz"
      description="Read the privacy policy for the QRganiz service."
    >
      <PrivacyPolicyComponent />
    </MainLayout>
  );
}

export default TermOfUsePage;
