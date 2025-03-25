import React from "react";

const TermsOfUseComponent: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Terms of Use</h1>
      <p className="mb-4">
        Welcome to Paws At Home! These terms and conditions outline the rules and
        regulations for the use of our website and services.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">
        1. Acceptance of Terms
      </h2>
      <p className="mb-4">
        By accessing and using our services, you accept and agree to be bound by
        these Terms of Use. If you do not agree, please do not use our services.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">2. Use of Services</h2>
      <p className="mb-4">
        You agree to use Paws At Home responsibly and in compliance with all
        applicable laws and regulations. Any misuse of the service may result in
        termination of access.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">
        3. User Responsibilities
      </h2>
      <p className="mb-4">
        Users are responsible for maintaining the security of their accounts and
        personal information. Paws At Home is not responsible for any data loss or unauthorized
        access.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">
        4. Intellectual Property
      </h2>
      <p className="mb-4">
        All content, trademarks, and logos on Paws At Home are the property of their
        respective owners. Unauthorized use is strictly prohibited.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">5. Termination</h2>
      <p className="mb-4">
        We reserve the right to suspend or terminate your access to our services
        if you violate these terms.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">6. Changes to Terms</h2>
      <p className="mb-4">
        Paws At Home may update these Terms of Use from time to time. Continued use
        of our services constitutes acceptance of any changes.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">7. Contact Us</h2>
      <p className="mb-4">
        If you have any questions about these Terms of Use, please contact us at{" "}
        <a href="mailto:hello@pawsathome.com" className="text-blue-500">
          hello@pawsathome.com
        </a>
        .
      </p>
    </div>
  );
};

export default TermsOfUseComponent;
