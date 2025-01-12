import protobuf from 'protobufjs';

export const ProductMessage = protobuf.Root.fromJSON({
  nested: {
    Product: {
      fields: {
        product_id: { type: "string", id: 1 },
        name: { type: "string", id: 2 },
        description: { type: "string", id: 3 },
        category: { type: "string", id: 4 },
        subcategory: { type: "string", id: 5 },
        model: { type: "string", id: 6 },
        specifications: { type: "Specifications", id: 7 },
      }
    },
    Specifications: {
      fields: {
        Cooling: { type: "string", id: 1 },
        Dimensions: { type: "string", id: 2 },
        Materials: { type: "string", id: 3 },
        Safety: { type: "string", id: 4 },
        Wok_Burners: { type: "string", id: 5 }
      }
    }
  }
}).lookupType("Product");

export function decodeBase64(str) {
  try {
    const binaryString = atob(str);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  } catch (error) {
    console.error('Error decoding base64:', error);
    throw new Error('Invalid QR code data');
  }
}

export function validateProductData(data) {
  if (!data || !data.product_id) {
    throw new Error('Invalid product data: missing product_id');
  }
  // Add more validation as needed
  return true;
}

