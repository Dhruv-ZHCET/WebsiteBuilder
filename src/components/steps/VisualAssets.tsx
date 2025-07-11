import React, { useState, useCallback } from 'react';
import { VisualAssets, CloudinaryImage } from '../../types';
import { Upload, X, Image, CheckCircle, AlertCircle, Eye, Loader } from 'lucide-react';
import { uploadAPI } from '../../utils/api';

interface VisualAssetsProps {
  visualAssets: VisualAssets;
  onChange: (assets: VisualAssets) => void;
}

const VisualAssetsStep: React.FC<VisualAssetsProps> = ({ visualAssets, onChange }) => {
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleHeroImageUpload = useCallback(async (files: FileList) => {
    const file = files[0];
    if (!file || !file.type.startsWith('image/')) {
      alert('Please upload only image files');
      return;
    }

    setIsUploading(true);
    try {
      const response = await uploadAPI.uploadHeroImage(file);
      const imageData = response.data.image;
      
      onChange({ 
        ...visualAssets, 
        heroBackground: imageData.optimizedUrl 
      });
    } catch (error) {
      console.error('Error uploading hero image:', error);
      alert('Failed to upload hero image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, [visualAssets, onChange]);

  const handleLogoUpload = useCallback(async (files: FileList) => {
    const file = files[0];
    if (!file || !file.type.startsWith('image/')) {
      alert('Please upload only image files');
      return;
    }

    setIsUploading(true);
    try {
      const response = await uploadAPI.uploadLogo(file);
      const imageData = response.data.image;
      
      onChange({ 
        ...visualAssets, 
        logo: imageData.optimizedUrl 
      });
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert('Failed to upload logo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, [visualAssets, onChange]);

  const handleDrop = useCallback((e: React.DragEvent, type: 'hero' | 'logo') => {
    e.preventDefault();
    setDragOver(null);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      if (type === 'hero') {
        handleHeroImageUpload(files);
      } else {
        handleLogoUpload(files);
      }
    }
  }, [handleHeroImageUpload, handleLogoUpload]);

  const handleDragOver = useCallback((e: React.DragEvent, type: string) => {
    e.preventDefault();
    setDragOver(type);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(null);
  }, []);

  const removeImage = (type: 'hero' | 'logo') => {
    if (type === 'hero') {
      onChange({ ...visualAssets, heroBackground: '' });
    } else {
      onChange({ ...visualAssets, logo: undefined });
    }
  };

  const UploadZone = ({ 
    type, 
    title, 
    description, 
    required = false,
    currentFile = '',
    onUpload
  }: {
    type: 'hero' | 'logo';
    title: string;
    description: string;
    required?: boolean;
    currentFile?: string;
    onUpload: (files: FileList) => void;
  }) => {
    const hasFile = !!currentFile;

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              {title}
              {required && <span className="text-red-500 ml-1">*</span>}
            </h3>
            <p className="text-gray-600 text-sm">{description}</p>
          </div>
          {hasFile && (
            <div className="flex items-center text-green-600">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Uploaded</span>
            </div>
          )}
        </div>

        {/* Upload Zone */}
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 relative ${
            dragOver === type
              ? 'border-indigo-500 bg-indigo-50'
              : hasFile
              ? 'border-green-300 bg-green-50'
              : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
          }`}
          onDrop={(e) => handleDrop(e, type)}
          onDragOver={(e) => handleDragOver(e, type)}
          onDragLeave={handleDragLeave}
        >
          {isUploading ? (
            <div className="space-y-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
                <Loader className="w-6 h-6 text-indigo-600 animate-spin" />
              </div>
              <div>
                <p className="text-gray-700 font-medium">Uploading to Cloudinary...</p>
                <p className="text-gray-500 text-sm">Please wait while we process your image</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${
                hasFile ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                {hasFile ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <Upload className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <div>
                <p className="text-gray-700 font-medium">
                  {hasFile ? 'Upload a new image' : 'Drop your image here'}
                </p>
                <p className="text-gray-500 text-sm">or click to browse</p>
                <p className="text-gray-400 text-xs mt-1">
                  Powered by Cloudinary - Automatic optimization included
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files && onUpload(e.target.files)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Current Image Preview */}
        {hasFile && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Current Image:</h4>
            <div className="relative group max-w-xs">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={currentFile}
                  alt={`${title} preview`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                  <button
                    onClick={() => setPreviewImage(currentFile)}
                    className="p-2 bg-white rounded-full text-gray-700 hover:text-indigo-600 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeImage(type)}
                    className="p-2 bg-white rounded-full text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Upload Visual Assets
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Upload your brand's key visual assets. These images will be automatically optimized 
          and used throughout your website to create a unique and professional appearance.
        </p>
      </div>

      <div className="space-y-8">
        {/* Hero Background */}
        <UploadZone
          type="hero"
          title="Hero Background Image"
          description="A high-quality image that will be the main background of your homepage hero section"
          required={true}
          currentFile={visualAssets.heroBackground}
          onUpload={handleHeroImageUpload}
        />

        {/* Logo Upload */}
        <UploadZone
          type="logo"
          title="Company Logo"
          description="Upload your company logo (optional) - will be automatically optimized for web use"
          required={false}
          currentFile={visualAssets.logo}
          onUpload={handleLogoUpload}
        />
      </div>

      {/* Requirements & Tips */}
      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-6 h-6 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Cloudinary Integration Benefits</h3>
            <ul className="text-blue-800 space-y-2 text-sm">
              <li>• <strong>Automatic Optimization:</strong> Images are automatically compressed and optimized</li>
              <li>• <strong>Multiple Formats:</strong> Served in the best format for each browser (WebP, AVIF, etc.)</li>
              <li>• <strong>Responsive Images:</strong> Automatically resized for different screen sizes</li>
              <li>• <strong>Fast Delivery:</strong> Global CDN ensures fast loading worldwide</li>
              <li>• <strong>Hero Background:</strong> Recommended minimum 1920x1080px for best quality</li>
              <li>• <strong>Logo:</strong> PNG format with transparent background works best</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Validation Status */}
      <div className="mt-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Hero Background Image</span>
              {visualAssets.heroBackground ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Complete</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Required</span>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Company Logo</span>
              {visualAssets.logo ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Uploaded</span>
                </div>
              ) : (
                <div className="flex items-center text-gray-400">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Optional</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 bg-white bg-opacity-20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-opacity-30 transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualAssetsStep;