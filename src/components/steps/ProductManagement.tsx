// ProductManagement.tsx

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
      const file = files[0]; // Only allow 1 image
      const response = await uploadAPI.uploadProductImage(file);
      const newImage: CloudinaryImage = response.data.image;

      if (editingProduct && editingProduct.id === productId) {
        setEditingProduct(prev => prev ? { ...prev, images: [newImage] } : null);
      } else {
        const updatedProducts = products.map(product =>
          product.id === productId ? { ...product, images: [newImage] } : product
        );
        onChange(updatedProducts);
      }
    } catch (error) {
      console.error('Error uploading product image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImages(prev => prev.filter(id => id !== productId));
    }
  };

  const handleRemoveImage = async (productId: string) => {
    if (editingProduct && editingProduct.id === productId) {
      setEditingProduct(prev => prev ? { ...prev, images: [] } : null);
    } else {
      const updatedProducts = products.map(product =>
        product.id === productId ? { ...product, images: [] } : product
      );
      onChange(updatedProducts);
    }
  };

  const handleSaveProduct = (product: Product) => {
    const newProduct = { ...product, images: product.images.slice(0, 1) }; // ensure only one image

    if (product.id) {
      const updatedProducts = products.map(p => p.id === product.id ? newProduct : p);
      onChange(updatedProducts);
    } else {
      const createdProduct = { ...newProduct, id: Date.now().toString() };
      onChange([...products, createdProduct]);
    }

    setEditingProduct(null);
    setShowAddForm(false);
  };

  const handleDeleteProduct = (id: string) => {
    onChange(products.filter(p => p.id !== id));
  };

  const ProductImageUpload = ({ productId, images, onImageUpload, onRemoveImage }: {
    productId: string;
    images: CloudinaryImage[];
    onImageUpload: (files: FileList) => void;
    onRemoveImage: () => void;
  }) => {
    const isUploading = uploadingImages.includes(productId);
    return (
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">Product Image</label>

        {images.length === 0 ? (
          <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-400 hover:bg-gray-50 transition-all duration-200">
            {isUploading ? (
              <Loader className="w-6 h-6 text-indigo-600 animate-spin mx-auto" />
            ) : (
              <>
                <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Click to upload an image (PNG/JPG, max 5MB)</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files && onImageUpload(e.target.files)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </>
            )}
          </div>
        ) : (
          <div className="relative w-32 h-32">
            <img
              src={images[0].optimizedUrl}
              alt="Uploaded"
              className="w-full h-full object-cover rounded-md"
            />
            <button
              onClick={() => setPreviewImage(images[0].url)}
              className="absolute top-1 left-1 p-1 bg-white rounded-full shadow"
            >
              <Eye className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={onRemoveImage}
              className="absolute top-1 right-1 p-1 bg-white rounded-full shadow"
            >
              <X className="w-4 h-4 text-red-500" />
            </button>
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
      onSave(formData); // No longer blocking on image
    };

    return (
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">{product.id ? 'Edit Product' : 'Add Product'}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">SKU *</label>
            <input
              type="text"
              value={formData.sku}
              onChange={(e) => handleChange('sku', e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price *</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => handleChange('price', parseFloat(e.target.value))}
              min="0"
              step="0.01"
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <ProductImageUpload
          productId={formData.id || 'new'}
          images={formData.images}
          onImageUpload={(files) => handleImageUpload(formData.id || 'new', files)}
          onRemoveImage={() => handleRemoveImage(formData.id || 'new')}
        />

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.inStock}
            onChange={(e) => handleChange('inStock', e.target.checked)}
          />
          <span>In Stock</span>
        </label>

        <div className="flex justify-end space-x-3">
          <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-100 rounded-lg">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
            {product.id ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Add Product</span>
        </button>
      </div>

      {showAddForm && (
        <ProductForm
          product={emptyProduct}
          onSave={handleSaveProduct}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {editingProduct && (
        <ProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
          onCancel={() => setEditingProduct(null)}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
        {products.map((product) => (
          <div key={product.id} className="bg-white shadow rounded-xl overflow-hidden">
            <div className="relative aspect-square bg-gray-100">
              {product.images.length ? (
                <img src={product.images[0].optimizedUrl} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Package className="w-12 h-12" />
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-500">SKU: {product.sku}</p>
              <p className="text-gray-700 mt-2 text-sm line-clamp-2">{product.description}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
                <span className={`text-xs px-2 py-1 rounded ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              <div className="flex space-x-2 mt-4">
                <button onClick={() => setEditingProduct(product)} className="text-indigo-600">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 bg-white text-black p-2 rounded-full shadow"
            >
              <X className="w-6 h-6" />
            </button>
            <img src={previewImage} alt="Preview" className="max-w-full max-h-full object-contain rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
