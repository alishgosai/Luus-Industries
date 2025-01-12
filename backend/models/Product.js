import { db } from '../services/firebaseAdmin.js';

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
    model = null; // We'll need to fetch the model from the database
  } else if (typeof productData === 'object' && productData.product_id && productData.model) {
    productId = productData.product_id;
    model = productData.model;
  } else {
    throw new Error('Invalid product data format');
  }

  try {
    // Find the product (read-only operation, allowed by rules)
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

    // Check if user exists
    const userDoc = await db.collection(USERS_COLLECTION).doc(userId).get();
    if (!userDoc.exists) {
      throw new Error('User not found');
    }

    // Check if the product is already registered to the user
    const existingUserProductQuery = await db.collection(USER_PRODUCTS_COLLECTION)
      .where('userId', '==', userId)
      .where('productId', '==', productDoc.id)
      .limit(1)
      .get();

    if (!existingUserProductQuery.empty) {
      throw new Error('Product already registered to this user');
    }

    // Create a new document in the userProducts collection (allowed by rules)
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
    const productDoc = await db.collection(PRODUCTS_COLLECTION).doc(productId).get();
    if (!productDoc.exists) {
      throw new Error('Product not found');
    }
    return { id: productDoc.id, ...productDoc.data() };
  } catch (error) {
    console.error('Error in getProductDetails:', error);
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
        userProducts.push({
          userProductId: doc.id,
          ...userProductData,
          productDetails: productDoc.data()
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
  getUserProducts
};
