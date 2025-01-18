import { db, admin } from '../services/firebaseAdmin.js';

const PRODUCTS_COLLECTION = 'products';
const USER_PRODUCTS_COLLECTION = 'userProducts';
const USERS_COLLECTION = 'users';

export async function scanAndRegisterProduct(qrCodeData, userId) {
  console.log(`Attempting to scan and register product. QR Code Data: ${JSON.stringify(qrCodeData)}, User ID: ${userId}`);

  if (!qrCodeData || !userId) {
    throw new Error('Invalid QR code data or user ID');
  }

  let productId;

  try {
    if (typeof qrCodeData === 'string') {
      const parsedData = JSON.parse(qrCodeData);
      productId = parsedData.product_id;
    } else if (typeof qrCodeData === 'object' && qrCodeData.product_id) {
      productId = qrCodeData.product_id;
    } else {
      throw new Error('Invalid QR code data format');
    }

    if (!productId) {
      throw new Error('Product ID not found in QR code data');
    }

    console.log(`Extracted Product ID: ${productId}`);

    // Check if the product exists in the PRODUCTS_COLLECTION
    const productDoc = await db.collection(PRODUCTS_COLLECTION).doc(productId).get();

    if (!productDoc.exists) {
      console.log(`Product not found. Product ID: ${productId}`);
      throw new Error(`Scanned product does not exist in the database. Product ID: ${productId}`);
    }

    // Check if the user exists
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
      const existingUserProduct = existingUserProductQuery.docs[0];
      return {
        success: true,
        userProductId: existingUserProduct.id,
        message: 'Product already registered to this user',
        alreadyRegistered: true
      };
    }

    // Register the product to the user
    const userProductRef = db.collection(USER_PRODUCTS_COLLECTION).doc();
    await userProductRef.set({
      userId: userId,
      productId: productId,
      registeredAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`Product registered to user. User Product ID: ${userProductRef.id}, User ID: ${userId}`);

    return {
      success: true,
      userProductId: userProductRef.id,
      message: 'Product registered successfully',
      newlyRegistered: true
    };

  } catch (error) {
    console.error('Error in scanAndRegisterProduct:', error);
    throw error;
  }
}

export async function getProductDetails(userProductId) {
  try {
    console.log(`Attempting to fetch product details for User Product ID: ${userProductId}`);
    
    const userProductDoc = await db.collection(USER_PRODUCTS_COLLECTION).doc(userProductId).get();

    if (!userProductDoc.exists) {
      throw new Error('User product not found');
    }

    const userProductData = userProductDoc.data();
    const productDoc = await db.collection(PRODUCTS_COLLECTION).doc(userProductData.productId).get();

    if (!productDoc.exists) {
      throw new Error('Product not found');
    }

    const productData = productDoc.data();

    // Generate a signed URL for the image if it exists
    let imageUrl = null;
    if (productData.qrCodePath) {
      const bucket = admin.storage().bucket();
      const file = bucket.file(productData.qrCodePath);
      const [signedUrl] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 15 * 60 * 1000, // URL expires in 15 minutes
      });
      imageUrl = signedUrl;
    }

    return {
      success: true,
      product: {
        id: productDoc.id,
        ...productData,
        imageUrl: imageUrl,
        userProductId: userProductDoc.id,
        registeredAt: userProductData.registeredAt,
      }
    };
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

    return { success: true, products: userProducts };
  } catch (error) {
    console.error('Error in getUserProducts:', error);
    throw error;
  }
}

export async function deleteUserProduct(userId, userProductId) {
  console.log(`Attempting to delete user product. User Product ID: ${userProductId}, User ID: ${userId}`);

  if (!userProductId || !userId) {
    throw new Error('Invalid user product ID or user ID');
  }

  try {
    const userProductRef = db.collection(USER_PRODUCTS_COLLECTION).doc(userProductId);
    const userProductDoc = await userProductRef.get();

    if (!userProductDoc.exists) {
      throw new Error('User product not found');
    }

    if (userProductDoc.data().userId !== userId) {
      throw new Error('Unauthorized: This product does not belong to the user');
    }

    await userProductRef.delete();

    console.log(`User product deleted successfully. User Product ID: ${userProductId}, User ID: ${userId}`);

    return { success: true, message: 'Product successfully deleted' };
  } catch (error) {
    console.error('Error in deleteUserProduct:', error);
    throw error;
  }
}

export default {
  scanAndRegisterProduct,
  getProductDetails,
  getUserProducts,
  deleteUserProduct
};

