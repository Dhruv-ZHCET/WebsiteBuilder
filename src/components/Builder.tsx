import { useState } from "react";
import Header from "./Header";
import ProgressBar from "./ProgressBar";
import IndustrySelection from "./steps/IndustrySelection";
import CompanyDetails from "./steps/CompanyDetails";
import ColorTheme from "./steps/ColorTheme";
import ProductManagement from "./steps/ProductManagement";
import ContentCustomization from "./steps/ContentCustomization";
import NavigationButtons from "./NavigationButtons";
import {
  WebsiteData,
  IndustryTemplate,
  ColorTheme as ColorThemeType,
} from "../types";
import { websiteAPI } from "../utils/api";

const steps = [
  "Industry",
  "Company Details",
  "Color Theme",
  "Products",
  "Content",
  "Review & Generate",
];

const initialWebsiteData: WebsiteData = {
  industry: "",
  company: {
    name: "",
    tagline: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    websiteName: "",
  },
  products: [],
  colorTheme: {
    id: "",
    name: "",
    primary: "",
    secondary: "",
    accent: "",
    background: "",
    text: "",
    preview: "",
  },
  content: {
    heroTitle: "",
    heroSubtitle: "",
    aboutTitle: "",
    aboutContent: "",
    servicesTitle: "",
    contactTitle: "",
    footerText: "",
  },
};

export default function Builder() {
  const [currentStep, setCurrentStep] = useState(0);
  const [websiteData, setWebsiteData] =
    useState<WebsiteData>(initialWebsiteData);
  const [_, setIsGenerating] = useState(false);
  const [generatedWebsite, setGeneratedWebsite] = useState<any>(null);

  const handleIndustrySelect = (industry: IndustryTemplate) => {
    setWebsiteData((prev) => ({
      ...prev,
      industry: industry.id,
      content: {
        ...prev.content,
        heroTitle: `Welcome to ${prev.company.name || "Your Business"}`,
        heroSubtitle: `Professional ${industry.name.toLowerCase()} services you can trust`,
        aboutTitle: "About Us",
        aboutContent: `We are a trusted ${industry.name.toLowerCase()} business committed to providing excellent service to our community.`,
        servicesTitle: "Our Services",
        contactTitle: "Contact Us",
        footerText: `© 2024 ${
          prev.company.name || "Your Company"
        }. All rights reserved.`,
      },
    }));
  };

  const handleCompanyDetailsChange = (company: typeof websiteData.company) => {
    setWebsiteData((prev) => ({
      ...prev,
      company,
      content: {
        ...prev.content,
        heroTitle: `Welcome to ${company.name || "Your Business"}`,
        footerText: `© 2024 ${
          company.name || "Your Company"
        }. All rights reserved.`,
      },
    }));
  };

  const handleColorThemeSelect = (theme: ColorThemeType) => {
    setWebsiteData((prev) => ({ ...prev, colorTheme: theme }));
  };

  const handleProductsChange = (products: typeof websiteData.products) => {
    setWebsiteData((prev) => ({ ...prev, products }));
  };

  const handleContentChange = (content: typeof websiteData.content) => {
    setWebsiteData((prev) => ({ ...prev, content }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return websiteData.industry !== "";
      case 1:
        return (
          websiteData.company.name &&
          websiteData.company.email &&
          websiteData.company.phone
        );
      case 2:
        return websiteData.colorTheme.id !== "";
      case 3:
        return true;
      case 4:
        return websiteData.content.heroTitle && websiteData.content.aboutTitle;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleGenerateWebsite();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handlePreview = () => {
    alert(
      "Preview functionality would show a mockup of the website with current data."
    );
  };

  const handleSave = () => {
    alert("Draft saved successfully!");
  };

  const handleGenerateWebsite = async () => {
    setIsGenerating(true);
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await websiteAPI.generateWebsite(websiteData, authToken);
      setGeneratedWebsite(response.data);
    } catch (error) {
      console.error("Error generating website:", error);
      alert("Error generating website. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadWebsite = async () => {
    if (!generatedWebsite?.websiteId) return;

    try {
      const response = await websiteAPI.downloadWebsite(
        generatedWebsite.websiteId
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${websiteData.company.name || "website"}.zip`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading website:", error);
      alert("Error downloading website. Please try again.");
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <IndustrySelection
            selectedIndustry={websiteData.industry}
            onSelect={handleIndustrySelect}
            onPreview={() => {}}
          />
        );
      case 1:
        return (
          <CompanyDetails
            companyDetails={websiteData.company}
            onChange={handleCompanyDetailsChange}
          />
        );
      case 2:
        return (
          <ColorTheme
            selectedTheme={websiteData.colorTheme.id}
            onSelect={handleColorThemeSelect}
          />
        );
      case 3:
        return (
          <ProductManagement
            products={websiteData.products}
            onChange={handleProductsChange}
          />
        );
      case 4:
        return (
          <ContentCustomization
            content={websiteData.content}
            onChange={handleContentChange}
          />
        );
      case 5:
        return (
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {generatedWebsite
                  ? "Website Generated Successfully!"
                  : "Review Your Website"}
              </h2>
              <p className="text-lg text-gray-600">
                {generatedWebsite
                  ? "Your website has been generated. Preview it below or download the code."
                  : "Review all the information before generating your website"}
              </p>
            </div>
            {!generatedWebsite ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
                <h3 className="text-xl font-semibold mb-4">Website Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Industry</h4>
                    <p className="text-gray-600 capitalize">
                      {websiteData.industry}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Company</h4>
                    <p className="text-gray-600">{websiteData.company.name}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Color Theme
                    </h4>
                    <p className="text-gray-600">
                      {websiteData.colorTheme.name}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Products</h4>
                    <p className="text-gray-600">
                      {websiteData.products.length} products
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">Website Preview</h3>
                    <button
                      onClick={handleDownloadWebsite}
                      className="flex items-center space-x-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <span>Download Code</span>
                    </button>
                  </div>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <iframe
                      src={generatedWebsite.previewUrl}
                      className="w-full h-96"
                      title="Website Preview"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <ProgressBar
        currentStep={currentStep}
        totalSteps={steps.length}
        steps={steps}
      />
      <main className="pb-24">{renderCurrentStep()}</main>
      <NavigationButtons
        currentStep={currentStep}
        totalSteps={steps.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onPreview={handlePreview}
        onSave={handleSave}
        canProceed={canProceed()}
      />
    </div>
  );
}
