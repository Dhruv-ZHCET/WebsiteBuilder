import React, { useState } from 'react';
import { Product, CloudinaryImage } from '../../types';
import { Plus, Edit2, Trash2, Package, DollarSign, Hash, Tag, Upload, X, Eye, Loader } from 'lucide-react';
import { uploadAPI } from '../../utils/api';

interface ProductManagementProps {
  products: Product[];
  onChange: (products: Product[]) => void;
}

const ProductManagement: React.FC<ProductManagementProps> = ({ products, onChange }) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<string[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const emptyProduct: Product = {
    id: '',
    name: '',
    description: '',
    price: 0,
    sku: '',
    category: '',
    images: [],
    inStock: true
  };

  const handleImageUpload = async (productId: string, files: FileList) => {
    if (!files.length) return;

    setUploadingImages(prev => [...prev, productId]);
    
    try {
      const uploadPromises = Array.from(files).map(file => uploadAPI.uploadProductImage(file));
      const responses = await Promise.all(uploadPromises);
      
      const newImages: CloudinaryImage[] = responses.map(response => response.data.image);
      
      // Update the product with new images
      if (editingProduct && editingProduct.id === productId) {
        setEditingProduct(prev => prev ? {
          ...prev,
          images: [...prev.images, ...newImages]
        } : null);
      } else {
        // Update existing product in the list
        const updatedProducts = products.map(product => 
          product.id === productId 
            ? { ...product, images: [...product.images, ...newImages] }
            : product
        );
        onChange(updatedProducts);
      }
    } catch (error) {
      console.error('Error uploading product images:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setUploadingImages(prev => prev.filter(id => id !== productId));
    }
  };

  const handleRemoveImage = async (productId: string, imageIndex: number) => {
    if (editingProduct && editingProduct.id === productId) {
      const updatedImages = editingProduct.images.filter((_, index) => index !== imageIndex);
      setEditingProduct(prev => prev ? { ...prev, images: updatedImages } : null);
    } else {
      const updatedProducts = products.map(product => 
        product.id === productId 
          ? { ...product, images: product.images.filter((_, index) => index !== imageIndex) }
          : product
      );
      onChange(updatedProducts);
    }
  };

  const handleSaveProduct = (product: Product) => {
    if (product.id) {
      // Update existing product
      const updatedProducts = products.map(p => p.id === product.id ? product : p);
      onChange(updatedProducts);
    } else {
      // Add new product
      const newProduct = { ...product, id: Date.now().toString() };
      onChange([...products, newProduct]);
    }
    setEditingProduct(null);
    setShowAddForm(false);
  };

  const handleDeleteProduct = (id: string) => {
    const filteredProducts = products.filter(p => p.id !== id);
    onChange(filteredProducts);
  };

  const ProductImageUpload = ({ productId, images, onImageUpload, onRemoveImage }: {
    productId: string;
    images: CloudinaryImage[];
    onImageUpload: (files: FileList) => void;
    onRemoveImage: (index: number) => void;
  }) => {
    const isUploading = uploadingImages.includes(productId);

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Product Images
          </label>
          <span className="text-xs text-gray-500">
            {images.length}/5 images
          </span>
        </div>

        {/* Upload Zone */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-400 hover:bg-gray-50 transition-all duration-200">
          {isUploading ? (
            <div className="space-y-2">
              <Loader className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
              <p className="text-sm text-gray-600">Uploading to Cloudinary...</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="w-8 h-8 text-gray-400 mx-auto" />
              <div>
                <p className="text-sm text-gray-600">
                  Drop images here or click to browse
                </p>
                <p className="text-xs text-gray-400">
                  PNG, JPG up to 5MB each (max 5 images)
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => e.target.files && onImageUpload(e.target.files)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={images.length >= 5}
              />
            </div>
          )}
        </div>

        {/* Image Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={image.optimizedUrl}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                    <button
                      onClick={() => setPreviewImage(image.url)}
                      className="p-2 bg-white rounded-full text-gray-700 hover:text-indigo-600 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onRemoveImage(index)}
                      className="p-2 bg-white rounded-full text-gray-700 hover:text-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded">
                    Primary
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const ProductForm = ({ product, onSave, onCancel }: {
    product: Product;
    onSave: (product: Product) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState(product);

    const handleChange = (field: keyof Product, value: any) => {
      setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.images.length) {
        alert('Please upload at least one product image');
        return;
      }
      onSave(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          {product.id ? 'Edit Product' : 'Add New Product'}
        </h3>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Package className="w-4 h-4 inline mr-2" />
                Product Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter product name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Hash className="w-4 h-4 inline mr-2" />
                SKU *
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => handleChange('sku', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Product SKU"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-2" />
                Price *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleChange('price', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="w-4 h-4 inline mr-2" />
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Product category"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Describe your product"
            />
          </div>

          {/* Product Images Upload */}
          <ProductImageUpload
            productId={formData.id || 'new'}
            images={formData.images}
            onImageUpload={(files) => handleImageUpload(formData.id || 'new', files)}
            onRemoveImage={(index) => handleRemoveImage(formData.id || 'new', index)}
          />

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.inStock}
                onChange={(e) => handleChange('inStock', e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-gray-700">In Stock</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {product.id ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Product Management
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Add your products with high-quality images, pricing, and descriptions. 
          Images are automatically optimized and delivered via Cloudinary CDN.
        </p>
      </div>

      <div className="mb-6">
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Product</span>
        </button>
      </div>

      {showAddForm && (
        <div className="mb-8">
          <ProductForm
            product={emptyProduct}
            onSave={handleSaveProduct}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {editingProduct && (
        <div className="mb-8">
          <ProductForm
            product={editingProduct}
            onSave={handleSaveProduct}
            onCancel={() => setEditingProduct(null)}
          />
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products added yet</h3>
          <p className="text-gray-500">Add your first product to get started with your catalog.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Product Image */}
              <div className="aspect-square bg-gray-100 relative">
                {product.images.length > 0 ? (
                  <img
                    src={product.images[0].optimizedUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Package className="w-12 h-12" />
                  </div>
                )}
                {product.images.length > 1 && (
                  <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    +{product.images.length - 1} more
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="text-gray-400 hover:text-indigo-600 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                  <div className="flex items-center space-x-2">
                    {product.category && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {product.category}
                      </span>
                    )}
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        product.inStock
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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

export default ProductManagement;