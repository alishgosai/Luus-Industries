import { db } from '../services/firebaseAdmin.js';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDoc, getDocs, query, where } from 'firebase/firestore';

export class SparePart {
  constructor(id, name, imageUrl, price, productDetails, suits, partId) {
    this.id = id;
    this.name = name;
    this.imageUrl = imageUrl;
    this.price = price;
    this.productDetails = productDetails;
    this.suits = suits;
    this.partId = partId;
  }

  static async create(data) {
    const docRef = await db.collection('spare_parts').add({
      name: data.name,
      imageUrl: data.imageUrl,
      price: data.price,
      productDetails: data.productDetails,
      suits: data.suits,
      partId: data.partId
    });
    return new SparePart(
      docRef.id,
      data.name,
      data.imageUrl,
      data.price,
      data.productDetails,
      data.suits,
      data.partId
    );
  }

  static async findById(id) {
    const docSnap = await db.collection('spare_parts').doc(id).get();
    if (docSnap.exists) {
      const data = docSnap.data();
      return new SparePart(
        docSnap.id,
        data.name,
        data.imageUrl,
        data.price,
        data.productDetails,
        data.suits,
        data.partId
      );
    }
    return null;
  }

  static async findAll() {
    const snapshot = await db.collection('spare_parts').get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return new SparePart(
        doc.id,
        data.name,
        data.imageUrl,
        data.price,
        data.productDetails,
        data.suits,
        data.partId
      );
    });
  }

  static async findBySuitableModel(modelType) {
    const snapshot = await db.collection('spare_parts')
      .where('suits', 'array-contains', modelType)
      .get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return new SparePart(
        doc.id,
        data.name,
        data.imageUrl,
        data.price,
        data.productDetails,
        data.suits,
        data.partId
      );
    });
  }

  static async search(query) {
    const snapshot = await db.collection('spare_parts').get();
    return snapshot.docs
      .map(doc => {
        const data = doc.data();
        return new SparePart(
          doc.id,
          data.name,
          data.imageUrl,
          data.price,
          data.productDetails,
          data.suits,
          data.partId
        );
      })
      .filter(part => 
        part.name.toLowerCase().includes(query.toLowerCase()) ||
        part.productDetails.toLowerCase().includes(query.toLowerCase()) ||
        part.partId.toLowerCase().includes(query.toLowerCase())
      );
  }

  static async searchBySuits(query) {
    const snapshot = await db.collection('spare_parts').get();
    return snapshot.docs
      .map(doc => {
        const data = doc.data();
        return new SparePart(
          doc.id,
          data.name,
          data.imageUrl,
          data.price,
          data.productDetails,
          data.suits,
          data.partId
        );
      })
      .filter(part => 
        part.suits && part.suits.toLowerCase().includes(query.toLowerCase())
      );
  }

  async update(data) {
    await db.collection('spare_parts').doc(this.id).update({
      name: data.name,
      imageUrl: data.imageUrl,
      price: data.price,
      productDetails: data.productDetails,
      suits: data.suits,
      partId: data.partId
    });
    Object.assign(this, data);
  }

  async delete() {
    await db.collection('spare_parts').doc(this.id).delete();
  }
}

