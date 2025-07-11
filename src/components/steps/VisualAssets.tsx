import React, { useState, useCallback } from 'react';
import { VisualAssets, UploadedFile } from '../../types';
import { Upload, X, Image, CheckCircle, AlertCircle, Eye } from 'lucide-react';

interface VisualAssetsProps {
  visualAssets: VisualAssets;
  onChange: (assets: VisualAssets) => void;
}

const VisualAssetsStep: React.FC<VisualAssetsProps> = ({ visualAssets, onChange }) => {
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleFileUpload = useCallback(async (files: FileList, type: keyof VisualAssets) => {
    const file = files[0];
    if (!file || !file.type.startsWith('image/')) {
      alert('Please upload only image files');
      return;
    }

    // Simulate upload progress
    const uploadId = `${type}-${Date.now()}`;
    setUploadProgress(prev => ({ ...prev, [uploadId]: 0 }));

    // Create a URL for the uploaded file (in real app, this would be uploaded to server)
    const url = URL.createObjectURL(file);

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setUploadProgress(prev => ({ ...prev, [uploadId]: i }));
    }

    // Update visual assets
    if (type === 'heroBackground') {
      onChange({ ...visualAssets, heroBackground: url });
    } else if (type === 'productImages') {
      onChange({ 
        ...visualAssets, 
        productImages: [...visualAssets.productImages, url] 
      });
    }

    // Clean up progress
    setTimeout(() => {
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[uploadId];
        return newProgress;
      });
    }, 1000);
  }, [visualAssets, onChange]);

  const handleDrop = useCallback((e: React.DragEvent, type: keyof VisualAssets) => {
    e.preventDefault();
    setDragOver(null);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files, type);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent, type: string) => {
    e.preventDefault();
    setDragOver(type);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(null);
  }, []);

  const removeImage = (type: keyof VisualAssets, index?: number) => {
    if (type === 'heroBackground') {
      onChange({ ...visualAssets, heroBackground: '' });
    } else if (type === 'productImages' && index !== undefined) {
      const newImages = visualAssets.productImages.filter((_, i) => i !== index);
      onChange({ ...visualAssets, productImages: newImages });
    }
  };

  const UploadZone = ({ 
    type, 
    title, 
    description, 
    required = false,
    multiple = false,
    currentFiles = []
  }: {
    type: keyof VisualAssets;
    title: string;
    description: string;
    required?: boolean;
    multiple?: boolean;
    currentFiles?: string[];
  }) => {
    const hasFiles = currentFiles.length > 0;
    const isUploading = Object.keys(uploadProgress).some(key => key.startsWith(type));

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
          {hasFiles && (
            <div className="flex items-center text-green-600">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">
                {currentFiles.length} {multiple ? 'files' : 'file'} uploaded
              </span>
            </div>
          )}
        </div>

        {/* Upload Zone */}
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
            dragOver === type
              ? 'border-indigo-500 bg-indigo-50'
              : hasFiles
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
                <Upload className="w-6 h-6 text-indigo-600 animate-bounce" />
              </div>
              <div>
                <p className="text-gray-700 font-medium">Uploading...</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Object.values(uploadProgress)[0] || 0}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${
                hasFiles ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                {hasFiles ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <Upload className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <div>
                <p className="text-gray-700 font-medium">
                  {hasFiles ? 'Upload additional files' : 'Drop your images here'}
                </p>
                <p className="text-gray-500 text-sm">or click to browse</p>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple={multiple}
                onChange={(e) => e.target.files && handleFileUpload(e.target.files, type)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Uploaded Files Preview */}
        {currentFiles.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Uploaded Files:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {currentFiles.map((file, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={file}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                      <button
                        onClick={() => setPreviewImage(file)}
                        className="p-2 bg-white rounded-full text-gray-700 hover:text-indigo-600 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeImage(type, index)}
                        className="p-2 bg-white rounded-full text-gray-700 hover:text-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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
          Upload your brand's visual assets to personalize your website. These images will be 
          used throughout your site to create a unique and professional appearance.
        </p>
      </div>

      <div className="space-y-8">
        {/* Hero Background */}
        <UploadZone
          type="heroBackground"
          title="Hero Background Image"
          description="A high-quality image that will be the main background of your homepage hero section"
          required={true}
          currentFiles={visualAssets.heroBackground ? [visualAssets.heroBackground] : []}
        />

        {/* Product Images */}
        <UploadZone
          type="productImages"
          title="Product Images"
          description="Upload images of your products or services. These will be used in product showcases and galleries"
          required={true}
          multiple={true}
          currentFiles={visualAssets.productImages}
        />

        {/* Logo Upload */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Company Logo</h3>
              <p className="text-gray-600 text-sm">Upload your company logo (optional)</p>
            </div>
          </div>
          
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-indigo-400 hover:bg-gray-50 transition-all duration-200">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <Image className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <p className="text-gray-700 font-medium">Upload your logo</p>
                <p className="text-gray-500 text-sm">PNG, JPG, or SVG format recommended</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files, 'heroBackground')}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Requirements & Tips */}
      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-6 h-6 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Image Requirements & Tips</h3>
            <ul className="text-blue-800 space-y-2 text-sm">
              <li>• <strong>Hero Background:</strong> Minimum 1920x1080px for best quality</li>
              <li>• <strong>Product Images:</strong> Square format (1:1 ratio) works best</li>
              <li>• <strong>File Size:</strong> Maximum 5MB per image</li>
              <li>• <strong>Formats:</strong> JPG, PNG, WebP supported</li>
              <li>• <strong>Quality:</strong> High-resolution images will look better on all devices</li>
              <li>• <strong>Tip:</strong> Use images that reflect your brand's style and quality</li>
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
              <span className="text-gray-700">Product Images</span>
              {visualAssets.productImages.length > 0 ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">{visualAssets.productImages.length} uploaded</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Required</span>
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