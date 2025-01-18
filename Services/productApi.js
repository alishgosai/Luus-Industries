import { API_URL } from '../backend/config/api';

const PRODUCT_API_URL = `${API_URL}/api/products`;

const ProductApi = {
  userId: null,

  setUserId: (userId) => {
    console.log('Setting user ID in ProductApi:', userId);
    ProductApi.userId = userId;
  },

  getProductDetails: async (productId, shouldRegister = false) => {
    console.log('Getting product details. Product ID:', productId, 'User ID:', ProductApi.userId);
    try {
      if (!ProductApi.userId) {
        throw new Error('User ID not set');
      }
      if (!productId) {
        throw new Error('Product ID is required');
      }

      const response = await fetch(`${PRODUCT_API_URL}/${productId}`, {
        method: 'POST',
        headers: { 
          'X-User-Id': ProductApi.userId,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ shouldRegister })
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
        imageUrl: data.product.storedImageUrl || data.product.qrCodePath || '/placeholder.png',
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
        specificationsPdfUrl: data.product.storedSpecificationsPdfUrl || null,
        cadDrawingsUrl: data.product.storedCadDrawingsUrl || null,
        registrationDate: data.product.registrationDate || new Date().toISOString(),
        status: data.product.status || 'active'
      };

      console.log('Transformed product details:', transformedData);
      return { 
        success: true, 
        product: transformedData, 
        registered: data.registered,
        registrationMessage: data.registrationMessage
      };
    } catch (error) {
      console.error('Error fetching product details:', error);
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

  deleteUserProduct: async (userProductId) => {
    console.log('Deleting user product. User Product ID:', userProductId, 'User ID:', ProductApi.userId);
    try {
      if (!ProductApi.userId) {
        throw new Error('User ID not set');
      }
      if (!userProductId) {
        throw new Error('User Product ID is required');
      }

      const response = await fetch(`${PRODUCT_API_URL}/user-products/${userProductId}`, {
        method: 'DELETE',
        headers: { 
          'X-User-Id': ProductApi.userId,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      console.log('Product deleted successfully');
      return { success: true, message: data.message };
    } catch (error) {
      console.error('Error deleting user product:', error);
      return { success: false, error: error.message };
    }
  }
};

export default ProductApi;

