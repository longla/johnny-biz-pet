import { motion } from "framer-motion";
import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

const SitterSignaturePage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const signatureRef = useRef<SignatureCanvas>(null);

  const resetSignature = () => {
    signatureRef.current?.clear();
    setHasSignature(false);
  };

  const handleSubmit = async () => {
    if (!hasSignature || !signatureRef.current) {
      alert("Please provide your signature before saving.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Get signature as base64 data URL
      const signatureDataURL = signatureRef.current.toDataURL();

      const response = await fetch("/api/save-sitter-signature", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          signature: signatureDataURL,
        }),
      });

      if (response.ok) {
        setIsCompleted(true);
      } else {
        const error = await response.json();
        alert(`Error saving signature: ${error.message}`);
      }
    } catch (error) {
      console.error("Error saving signature:", error);
      alert("Failed to save signature. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4 text-center"
        >
          <div className="text-green-600 text-6xl mb-4">✓</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Signature Saved Successfully!
          </h1>
          <p className="text-gray-600 mb-6">
            Your signature has been saved and will be used in all future waiver
            PDFs.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Homepage
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl"
        >
          {/* Header */}
          <div className="bg-blue-600 text-white p-6 rounded-t-lg">
            <h1 className="text-2xl md:text-3xl font-bold text-center">
              Sitter Signature Setup
            </h1>
            <p className="text-center mt-2 text-blue-100">
              Sign once to be used in all future waiver PDFs
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Please provide your signature below:
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  This signature will be automatically added to all future
                  customer waiver PDFs. You only need to do this once.
                </p>
              </div>

              {/* Signature Section */}
              <div className="space-y-4">
                <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="border border-gray-300 rounded bg-white">
                      <SignatureCanvas
                        ref={signatureRef}
                        onEnd={() => {
                          if (
                            signatureRef.current &&
                            !signatureRef.current.isEmpty()
                          ) {
                            setHasSignature(true);
                          }
                        }}
                        canvasProps={{
                          width: 400,
                          height: 150,
                          className: "signature-canvas",
                        }}
                      />
                    </div>

                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={resetSignature}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        Clear Signature
                      </button>
                    </div>

                    <p className="text-xs text-gray-500 text-center max-w-md">
                      Draw your signature in the box above using your mouse or
                      finger. This will be your official signature for all
                      waiver documents.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <button
                  onClick={handleSubmit}
                  disabled={!hasSignature || isSubmitting}
                  className={`px-8 py-3 rounded-lg font-semibold text-white transition-colors ${
                    hasSignature && !isSubmitting
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      Saving Signature...
                    </>
                  ) : (
                    "Save Signature"
                  )}
                </button>
              </div>

              {!hasSignature && (
                <p className="text-center text-sm text-red-600">
                  Please provide your signature before saving.
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SitterSignaturePage;
