import React from 'react';
import { X, Download, ExternalLink } from 'lucide-react';

interface TemplatePreviewProps {
  templateId: string;
  templateName: string;
  isOpen: boolean;
  onClose: () => void;
  previewData?: any;
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  templateId,
  templateName,
  isOpen,
  onClose,
  previewData
}) => {
  if (!isOpen) return null;

  const getTemplateHTML = (templateId: string) => {
    const templates = {
      pharmacy: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <header style="background: linear-gradient(135deg, #3B82F6, #1E40AF); color: white; padding: 1rem 0;">
            <nav style="max-width: 1200px; margin: 0 auto; padding: 0 20px; display: flex; justify-content: space-between; align-items: center;">
              <h1 style="margin: 0; font-size: 1.5rem;">HealthCare Pharmacy</h1>
              <ul style="list-style: none; display: flex; gap: 2rem; margin: 0; padding: 0;">
                <li><a href="#" style="color: white; text-decoration: none;">Home</a></li>
                <li><a href="#" style="color: white; text-decoration: none;">Products</a></li>
                <li><a href="#" style="color: white; text-decoration: none;">Services</a></li>
                <li><a href="#" style="color: white; text-decoration: none;">Contact</a></li>
              </ul>
            </nav>
          </header>
          
          <section style="background: linear-gradient(135deg, #3B82F6, #1E40AF); color: white; padding: 80px 20px; text-align: center;">
            <h1 style="font-size: 3rem; margin-bottom: 1rem;">Your Trusted Pharmacy Partner</h1>
            <p style="font-size: 1.2rem; margin-bottom: 2rem; max-width: 600px; margin-left: auto; margin-right: auto;">Professional healthcare services and medications delivered with care and expertise.</p>
            <button style="background: #60A5FA; color: #1F2937; padding: 12px 30px; border: none; border-radius: 5px; font-size: 1.1rem; cursor: pointer;">Order Now</button>
          </section>
          
          <section style="padding: 80px 20px;">
            <div style="max-width: 1200px; margin: 0 auto;">
              <h2 style="text-align: center; font-size: 2.5rem; margin-bottom: 3rem; color: #3B82F6;">Our Services</h2>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
                <div style="background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); text-align: center;">
                  <h3>Prescription Services</h3>
                  <p>Professional prescription filling and consultation</p>
                </div>
                <div style="background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); text-align: center;">
                  <h3>Health Consultations</h3>
                  <p>Expert health advice and medication guidance</p>
                </div>
                <div style="background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); text-align: center;">
                  <h3>Home Delivery</h3>
                  <p>Convenient delivery of medications to your door</p>
                </div>
              </div>
            </div>
          </section>
          
          <footer style="background: #1F2937; color: white; text-align: center; padding: 2rem 0;">
            <p>© 2024 HealthCare Pharmacy. All rights reserved.</p>
          </footer>
        </div>
      `,
      cosmetics: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <header style="background: linear-gradient(135deg, #EC4899, #DB2777); color: white; padding: 1rem 0;">
            <nav style="max-width: 1200px; margin: 0 auto; padding: 0 20px; display: flex; justify-content: space-between; align-items: center;">
              <h1 style="margin: 0; font-size: 1.5rem;">Glamour Beauty</h1>
              <ul style="list-style: none; display: flex; gap: 2rem; margin: 0; padding: 0;">
                <li><a href="#" style="color: white; text-decoration: none;">Home</a></li>
                <li><a href="#" style="color: white; text-decoration: none;">Products</a></li>
                <li><a href="#" style="color: white; text-decoration: none;">Beauty Tips</a></li>
                <li><a href="#" style="color: white; text-decoration: none;">Contact</a></li>
              </ul>
            </nav>
          </header>
          
          <section style="background: linear-gradient(135deg, #EC4899, #DB2777); color: white; padding: 80px 20px; text-align: center;">
            <h1 style="font-size: 3rem; margin-bottom: 1rem;">Unleash Your Natural Beauty</h1>
            <p style="font-size: 1.2rem; margin-bottom: 2rem; max-width: 600px; margin-left: auto; margin-right: auto;">Premium cosmetics and beauty products to enhance your natural glow.</p>
            <button style="background: #F472B6; color: #1F2937; padding: 12px 30px; border: none; border-radius: 5px; font-size: 1.1rem; cursor: pointer;">Shop Now</button>
          </section>
          
          <section style="padding: 80px 20px;">
            <div style="max-width: 1200px; margin: 0 auto;">
              <h2 style="text-align: center; font-size: 2.5rem; margin-bottom: 3rem; color: #EC4899;">Our Services</h2>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
                <div style="background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); text-align: center;">
                  <h3>Beauty Consultation</h3>
                  <p>Personalized beauty advice and product recommendations</p>
                </div>
                <div style="background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); text-align: center;">
                  <h3>Makeup Services</h3>
                  <p>Professional makeup application for special events</p>
                </div>
                <div style="background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); text-align: center;">
                  <h3>Skincare Analysis</h3>
                  <p>Comprehensive skin analysis and treatment plans</p>
                </div>
              </div>
            </div>
          </section>
          
          <footer style="background: #1F2937; color: white; text-align: center; padding: 2rem 0;">
            <p>© 2024 Glamour Beauty. All rights reserved.</p>
          </footer>
        </div>
      `,
      education: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <header style="background: linear-gradient(135deg, #10B981, #059669); color: white; padding: 1rem 0;">
            <nav style="max-width: 1200px; margin: 0 auto; padding: 0 20px; display: flex; justify-content: space-between; align-items: center;">
              <h1 style="margin: 0; font-size: 1.5rem;">Excellence Academy</h1>
              <ul style="list-style: none; display: flex; gap: 2rem; margin: 0; padding: 0;">
                <li><a href="#" style="color: white; text-decoration: none;">Home</a></li>
                <li><a href="#" style="color: white; text-decoration: none;">Courses</a></li>
                <li><a href="#" style="color: white; text-decoration: none;">Admissions</a></li>
                <li><a href="#" style="color: white; text-decoration: none;">Contact</a></li>
              </ul>
            </nav>
          </header>
          
          <section style="background: linear-gradient(135deg, #10B981, #059669); color: white; padding: 80px 20px; text-align: center;">
            <h1 style="font-size: 3rem; margin-bottom: 1rem;">Empowering Future Leaders</h1>
            <p style="font-size: 1.2rem; margin-bottom: 2rem; max-width: 600px; margin-left: auto; margin-right: auto;">Quality education and innovative learning experiences for academic excellence.</p>
            <button style="background: #34D399; color: #1F2937; padding: 12px 30px; border: none; border-radius: 5px; font-size: 1.1rem; cursor: pointer;">Apply Now</button>
          </section>
          
          <section style="padding: 80px 20px;">
            <div style="max-width: 1200px; margin: 0 auto;">
              <h2 style="text-align: center; font-size: 2.5rem; margin-bottom: 3rem; color: #10B981;">Our Programs</h2>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
                <div style="background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); text-align: center;">
                  <h3>Course Catalog</h3>
                  <p>Comprehensive range of academic and professional courses</p>
                </div>
                <div style="background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); text-align: center;">
                  <h3>Online Learning</h3>
                  <p>Flexible online classes and digital learning resources</p>
                </div>
                <div style="background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); text-align: center;">
                  <h3>Student Support</h3>
                  <p>Dedicated support services and academic guidance</p>
                </div>
              </div>
            </div>
          </section>
          
          <footer style="background: #1F2937; color: white; text-align: center; padding: 2rem 0;">
            <p>© 2024 Excellence Academy. All rights reserved.</p>
          </footer>
        </div>
      `
    };

    return templates[templateId as keyof typeof templates] || templates.pharmacy;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{templateName} Template Preview</h2>
            <p className="text-gray-600">Preview of the {templateName.toLowerCase()} website template</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              <ExternalLink className="w-4 h-4" />
              <span>Open in New Tab</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div 
              className="w-full bg-white"
              dangerouslySetInnerHTML={{ __html: getTemplateHTML(templateId) }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatePreview;