import { db } from '../firebase.config';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export async function submitWarrantyForm(formData, imageUri) {
    try {
        let imageUrl = null;
        if (imageUri) {
            const response = await fetch(imageUri);
            const blob = await response.blob();
            const imageRef = ref(storage, `warranty_images/${Date.now()}`);
            await uploadBytes(imageRef, blob);
            imageUrl = await getDownloadURL(imageRef);
        }

        const warrantyFormsCollection = collection(db, 'warrantyForms');
        const docRef = await addDoc(warrantyFormsCollection, {
            ...formData,
            imageUrl,
            timestamp: new Date()
        });

        await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                service_id: 'YOUR_EMAILJS_SERVICE_ID',
                template_id: 'YOUR_EMAILJS_TEMPLATE_ID',
                user_id: 'YOUR_EMAILJS_USER_ID',
                template_params: {
                    to_email: 'alishgosai@gmail.com',
                    from_name: formData.name,
                    message: JSON.stringify(formData),
                    image_url: imageUrl
                }
            })
        });

        console.log('Document written with ID: ', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Error submitting form:', error);
        throw error;
    }
}

