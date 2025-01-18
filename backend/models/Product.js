import { db, admin } from '../services/firebaseAdmin.js';

const PRODUCTS_COLLECTION = 'products';
const USER_PRODUCTS_COLLECTION = 'userProducts';
const USERS_COLLECTION = 'users';

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

export async function checkProductRegistration(userId, productId) {
  try {
    console.log(`Checking registration for user ${userId} and product ${productId}`);
    const existingRegistration = await db.collection(USER_PRODUCTS_COLLECTION)
      .where('userId', '==', userId)
      .where('productId', '==', productId)
      .limit(1)
      .get();

    const isRegistered = !existingRegistration.empty;
    console.log(`Registration check result: ${isRegistered ? 'Already registered' : 'Not registered'}`);

    return { 
      isRegistered, 
      message: isRegistered ? 'Product already registered' : 'Product not registered',
      newlyRegistered: false
    };
  } catch (error) {
    console.error('Error in checkProductRegistration:', error);
    throw error;
  }
}

export async function registerUserProduct(userId, productId) {
  try {
    console.log(`Attempting to register product ${productId} for user ${userId}`);

    const registrationCheck = await checkProductRegistration(userId, productId);
    if (registrationCheck.isRegistered) {
      return registrationCheck;
    }

    // Check if the user exists
    const userDoc = await db.collection(USERS_COLLECTION).doc(userId).get();
    if (!userDoc.exists) {
      console.log(`User ${userId} not found`);
      throw new Error('User not found');
    }

    // Check if the product exists
    const productDoc = await db.collection(PRODUCTS_COLLECTION).doc(productId).get();
    if (!productDoc.exists) {
      console.log(`Product ${productId} not found`);
      throw new Error('Product not found');
    }

    // Check if the user has already registered this product
    const existingRegistration = await db.collection(USER_PRODUCTS_COLLECTION)
      .where('userId', '==', userId)
      .where('productId', '==', productId)
      .limit(1)
      .get();

    if (!existingRegistration.empty) {
      console.log(`Product ${productId} already registered for user ${userId}`);
      return { 
        success: true, 
        newlyRegistered: false, 
        message: 'Product already registered' 
      };
    }

    // Register the product to the user
    const userProductRef = await db.collection(USER_PRODUCTS_COLLECTION).add({
      userId: userId,
      productId: productId,
      registeredAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`Product registered to user. User Product ID: ${userProductRef.id}, User ID: ${userId}`);

    return {
      success: true,
      isRegistered: true,
      userProductId: userProductRef.id,
      newlyRegistered: true,
      message: 'Product registered successfully'
    };

  } catch (error) {
    console.error('Error in registerUserProduct:', error);
    throw error;
  }
}

export async function deleteUserProduct(userId, userProductId) {
  try {
    console.log(`Attempting to delete user product ${userProductId} for user ${userId}`);

    // Check if the user product exists and belongs to the user
    const userProductRef = db.collection(USER_PRODUCTS_COLLECTION).doc(userProductId);
    const userProductDoc = await userProductRef.get();

    if (!userProductDoc.exists) {
      console.log(`User product ${userProductId} not found in the database`);
      throw new Error('User product not found');
    }

    const userProductData = userProductDoc.data();
    console.log(`User product data:`, userProductData);

    if (userProductData.userId !== userId) {
      console.log(`User ${userId} does not own product ${userProductId}. Owner is ${userProductData.userId}`);
      throw new Error('User does not own this product');
    }

    // Delete the user product
    await userProductRef.delete();

    console.log(`User product ${userProductId} deleted successfully`);
    return { success: true, message: 'User product deleted successfully' };

  } catch (error) {
    console.error('Error in deleteUserProduct:', error);
    throw error;
  }
}

export default {
  getProductDetails,
  getUserProducts,
  registerUserProduct,
  checkProductRegistration,
  deleteUserProduct,
};

