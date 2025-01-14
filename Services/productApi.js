import { API_URL } from '../backend/config/api';

const PRODUCT_API_URL = `${API_URL}/api/products`;

const ProductApi = {
  userId: null,
  token: null,

  setUserAuth: (userId, token) => {
    console.log('Setting user authentication in ProductApi:', userId);
    ProductApi.userId = userId;
    ProductApi.token = token;
  },

  scanAndRegisterProduct: async (qrCodeData) => {
    console.log('Scanning and registering product. User ID:', ProductApi.userId);
    try {
      if (!ProductApi.userId || !ProductApi.token) {
        throw new Error('User authentication not set');
      }
      const response = await fetch(`${PRODUCT_API_URL}/scan-and-register`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${ProductApi.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ qrCodeData })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      console.log('Product registered successfully:', data);
      return data;
    } catch (error) {
      console.error('Error scanning and registering product:', error);
      return { 
        success: false, 
        error: error.message,
        details: error.stack
      };
    }
  },
  getProductDetails: async (productId) => {
    console.log('Getting product details. Product ID:', productId, 'User ID:', ProductApi.userId);
    try {
      if (!ProductApi.userId) {
        throw new Error('User ID not set');
      }
      if (!productId) {
        throw new Error('Product ID is required');
      }

      const response = await fetch(`${PRODUCT_API_URL}/${productId}`, {
        headers: { 
          'X-User-Id': ProductApi.userId,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      console.log('Raw API response:', JSON.stringify(data, null, 2));

      // Transform the data to match the expected format in ProductDetails
      const transformedData = {
        id: data.product.id,
        name: data.product.name || 'Unknown Product',
        description: data.product.description || 'No description available',
        imageUrl: data.product.qrCodePath || '/placeholder.png',
        category: data.product.category || 'Uncategorized',
        model: data.product.model || 'Unknown Model',
        specifications: [
          { title: 'Category', value: data.product.category || 'N/A' },
          { title: 'Model', value: data.product.model || 'N/A' },
          ...Object.entries(data.product.specifications || {}).map(([key, value]) => ({
            title: key,
            value: value.toString()
          }))
        ],
        warranty: data.product.warranty ? {
          startDate: data.product.warranty.startDate || new Date().toISOString(),
          expireDate: data.product.warranty.expireDate || new Date().toISOString(),
          status: data.product.warranty.status || 'Unknown'
        } : null,
        links: [
          { title: 'User Manual', url: data.product.manualUrl || '#' },
          { title: 'Specifications', url: data.product.specificationsUrl || '#' },
          { title: 'Support', url: data.product.supportUrl || '#' }
        ],
        registrationDate: data.product.registrationDate || new Date().toISOString(),
        status: data.product.status || 'active'
      };

      console.log('Transformed product details:', transformedData);
      return { success: true, product: transformedData };
    } catch (error) {
      console.error('Error fetching product details:', error);
      return { success: false, error: error.message };
    }
  },



  updateProductDetails: async (productId, updateData) => {
    console.log('Updating product details. Product ID:', productId, 'Data:', updateData);
    try {
      if (!ProductApi.userId) {
        throw new Error('User ID not set');
      }
      if (!productId) {
        throw new Error('Product ID is required');
      }

      const response = await fetch(`${PRODUCT_API_URL}/${productId}`, {
        method: 'PATCH',
        headers: { 
          'X-User-Id': ProductApi.userId,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      console.log('Product details updated successfully:', data);
      return data;
    } catch (error) {
      console.error('Error updating product details:', error);
      return { success: false, error: error.message };
    }
  },

  getUserProducts: async () => {
    console.log('Getting user products. User ID:', ProductApi.userId);
    try {
      if (!ProductApi.userId) {
        throw new Error('User ID not set');
      }
      const response = await fetch(`${PRODUCT_API_URL}/user-products`, {
        headers: { 
          'X-User-Id': ProductApi.userId,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      return data;
    } catch (error) {
      console.error('Error fetching user products:', error);
      return { success: false, error: error.message };
    }
  },

  detectQR: async (base64Image) => {
    console.log('Detecting QR code from image');
    try {
      if (!ProductApi.userId) {
        throw new Error('User ID not set');
      }
      const response = await fetch(`${PRODUCT_API_URL}/detect-qr`, {
        method: 'POST',
        headers: {
          'X-User-Id': ProductApi.userId,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64Image }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(JSON.stringify(data) || `HTTP error! status: ${response.status}`);
      }

      if (!data.qrData) {
        throw new Error('No QR code detected in the image');
      }
      return data.qrData;
    } catch (error) {
      console.error('Error detecting QR code:', error);
      throw new Error(error.message || JSON.stringify(error));
    }
  },
};

export default ProductApi;

