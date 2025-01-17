import { db, admin } from '../services/firebaseAdmin.js';

const PRODUCTS_COLLECTION = 'products';
const USER_PRODUCTS_COLLECTION = 'userProducts';
const USERS_COLLECTION = 'users';

export async function scanAndRegisterProduct(productData, userId) {
  console.log(`Attempting to scan and register product. Product Data: ${JSON.stringify(productData)}, User ID: ${userId}`);

  if (!productData || !userId) {
    throw new Error('Invalid product data or user ID');
  }

  let productId, model;

  if (typeof productData === 'string' && productData.startsWith('PROD_')) {
    productId = productData;
    model = null;
  } else if (typeof productData === 'object' && productData.product_id && productData.model) {
    productId = productData.product_id;
    model = productData.model;
  } else {
    throw new Error('Invalid product data format');
  }

  try {
    let productQuery = db.collection(PRODUCTS_COLLECTION).where('product_id', '==', productId);
    
    if (model) {
      productQuery = productQuery.where('model', '==', model);
    }

    const productSnapshot = await productQuery.limit(1).get();

    if (productSnapshot.empty) {
      throw new Error(`Scanned product does not exist in the database. Product ID: ${productId}`);
    }

    const productDoc = productSnapshot.docs[0];
    const productData = productDoc.data();

    const userDoc = await db.collection(USERS_COLLECTION).doc(userId).get();
    if (!userDoc.exists) {
      throw new Error('User not found');
    }

    const existingUserProductQuery = await db.collection(USER_PRODUCTS_COLLECTION)
      .where('userId', '==', userId)
      .where('productId', '==', productDoc.id)
      .limit(1)
      .get();

    if (!existingUserProductQuery.empty) {
      throw new Error('Product already registered to this user');
    }

    const userProductRef = db.collection(USER_PRODUCTS_COLLECTION).doc();
    await userProductRef.set({
      userId: userId,
      productId: productDoc.id,
      registeredAt: new Date(),
      productName: productData.name,
      productModel: productData.model,
    });

    console.log(`Product registered to user. User Product ID: ${userProductRef.id}, User ID: ${userId}`);

    return {
      id: userProductRef.id,
      productId: productDoc.id,
      ...productData,
      registeredBy: userId,
      registeredAt: new Date()
    };

  } catch (error) {
    console.error('Error in scanAndRegisterProduct:', error);
    throw error;
  }
}


export async function getProductDetails(productId) {
  try {
    console.log(`Attempting to fetch product details for ID: ${productId}`);
    
    let productDoc;
    if (typeof productId === 'string') {
      productDoc = await db.collection(PRODUCTS_COLLECTION).doc(productId).get();
    } else if (typeof productId === 'object' && productId.product_id) {
      const productQuery = await db.collection(PRODUCTS_COLLECTION)
        .where('product_id', '==', productId.product_id)
        .limit(1)
        .get();
      
      if (!productQuery.empty) {
        productDoc = productQuery.docs[0];
      }
    } else {
      throw new Error(`Invalid product ID format: ${JSON.stringify(productId)}`);
    }

    if (!productDoc || !productDoc.exists) {
      console.log(`No product found for ID: ${JSON.stringify(productId)}`);
      throw new Error('Product not found');
    }

    const productData = productDoc.data();
    console.log(`Product data retrieved: ${JSON.stringify(productData)}`);

    // Generate a signed URL for the image if it exists
    if (productData.qrCodePath) {
      const bucket = admin.storage().bucket();
      const file = bucket.file(productData.qrCodePath);
      const [signedUrl] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 15 * 60 * 1000, // URL expires in 15 minutes
      });
      productData.imageUrl = signedUrl;
      console.log(`Generated signed URL for image: ${signedUrl}`);
    } else {
      productData.imageUrl = null;
      console.log('No qrCodePath found for the product');
    }

    return { id: productDoc.id, ...productData };
  } catch (error) {
    console.error('Error in getProductDetails:', error);
    throw error;
  }
}


export async function registerProduct(productId, userId) {
  console.log(`Attempting to register product. Product ID: ${productId}, User ID: ${userId}`);

  if (!productId || !userId) {
      throw new Error('Invalid product ID or user ID');
  }

  try {
      // Check if the product exists
      const productDoc = await db.collection(PRODUCTS_COLLECTION).doc(productId).get();
      if (!productDoc.exists) {
          throw new Error('Product not found');
      }

      // Check if user exists
      const userDoc = await db.collection(USERS_COLLECTION).doc(userId).get();
      if (!userDoc.exists) {
          throw new Error('User not found');
      }

      // Check if the product is already registered to the user
      const existingUserProductQuery = await db.collection(USER_PRODUCTS_COLLECTION)
          .where('userId', '==', userId)
          .where('productId', '==', productId)
          .limit(1)
          .get();

      if (!existingUserProductQuery.empty) {
          throw new Error('Product already registered to this user');
      }

      // Create a new document in the userProducts collection
      const userProductRef = db.collection(USER_PRODUCTS_COLLECTION).doc();
      const productData = productDoc.data();
      await userProductRef.set({
          userId: userId,
          productId: productId,
          registeredAt: new Date(),
          productName: productData.name,
          productModel: productData.model,
      });

      console.log(`Product registered to user. User Product ID: ${userProductRef.id}, User ID: ${userId}`);

      return {
          id: userProductRef.id,
          productId: productId,
          ...productData,
          registeredBy: userId,
          registeredAt: new Date()
      };

  } catch (error) {
      console.error('Error in registerProduct:', error);
      throw error;
  }
}


export async function getUserProducts(userId) {
  try {
    const userProductsQuery = db.collection(USER_PRODUCTS_COLLECTION)
      .where('userId', '==', userId);
    const userProductsSnapshot = await userProductsQuery.get();

    const userProducts = [];
    for (const doc of userProductsSnapshot.docs) {
      const userProductData = doc.data();
      const productDoc = await db.collection(PRODUCTS_COLLECTION).doc(userProductData.productId).get();
      if (productDoc.exists) {
        const productData = productDoc.data();
        if (productData.qrCodePath) {
          const bucket = admin.storage().bucket();
          const file = bucket.file(productData.qrCodePath);
          const [signedUrl] = await file.getSignedUrl({
            action: 'read',
            expires: Date.now() + 15 * 60 * 1000, // URL expires in 15 minutes
          });
          productData.imageUrl = signedUrl;
        } else {
          productData.imageUrl = null;
        }
        userProducts.push({
          userProductId: doc.id,
          ...userProductData,
          productDetails: productData
        });
      }
    }

    return userProducts;
  } catch (error) {
    console.error('Error in getUserProducts:', error);
    throw error;
  }
}

export default {
  scanAndRegisterProduct,
  getProductDetails,
  getUserProducts,
  registerProduct
};