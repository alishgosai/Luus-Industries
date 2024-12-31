// components/ServiceWarrantyForm.js
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ServiceWarrantyForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        businessName: '',
        location: '',
        productModel: '',
        serialNumber: '',
        purchasedFrom: '',
        purchaseDate: '',
        location2: '',
        problemDescription: ''
    });

    const handleSubmit = () => {
        console.log('Form submitted:', formData);
    };

    return (
        <ScrollView style={styles.content}>
            {/* Categories */}
           

            {/* Form Fields */}
            <View style={styles.form}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Name*</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="First/Surname"
                        placeholderTextColor="#666"
                        value={formData.name}
                        onChangeText={(text) => setFormData({ ...formData, name: text })}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email*</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="example@email"
                        placeholderTextColor="#666"
                        keyboardType="email-address"
                        value={formData.email}
                        onChangeText={(text) => setFormData({ ...formData, email: text })}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Phone Number*</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Mobile/Landline"
                        placeholderTextColor="#666"
                        keyboardType="phone-pad"
                        value={formData.phone}
                        onChangeText={(text) => setFormData({ ...formData, phone: text })}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Business Name*</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Business Name"
                        placeholderTextColor="#666"
                        value={formData.businessName}
                        onChangeText={(text) => setFormData({ ...formData, businessName: text })}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Location*</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="City/Postcode"
                        placeholderTextColor="#666"
                        value={formData.location}
                        onChangeText={(text) => setFormData({ ...formData, location: text })}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Product Model*</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="What is the Model Code?"
                        placeholderTextColor="#666"
                        value={formData.productModel}
                        onChangeText={(text) => setFormData({ ...formData, productModel: text })}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Serial Number*</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="What is the Serial Number?"
                        placeholderTextColor="#666"
                        value={formData.serialNumber}
                        onChangeText={(text) => setFormData({ ...formData, serialNumber: text })}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Purchased From</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Which Dealer did you purchased from?"
                        placeholderTextColor="#666"
                        value={formData.purchasedFrom}
                        onChangeText={(text) => setFormData({ ...formData, purchasedFrom: text })}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Purchased Date</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="When did you purchased form?"
                        placeholderTextColor="#666"
                        value={formData.purchaseDate}
                        onChangeText={(text) => setFormData({ ...formData, purchaseDate: text })}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Location*</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="City/Postcode"
                        placeholderTextColor="#666"
                        value={formData.location2}
                        onChangeText={(text) => setFormData({ ...formData, location2: text })}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Problem Description*</Text>
                    <TextInput
                        style={[styles.input, styles.messageInput]}
                        placeholder="What seems to be the problem?"
                        placeholderTextColor="#666"
                        multiline
                        numberOfLines={4}
                        value={formData.problemDescription}
                        onChangeText={(text) => setFormData({ ...formData, problemDescription: text })}
                    />
                </View>

                {/* Image Attachment Options */}
                <Text style={styles.label}>Attach Image</Text>
                <View style={styles.attachmentOptions}>
                    <TouchableOpacity style={styles.attachmentButton}>
                        <Icon name="camera-outline" size={24} color="#87CEEB" />
                        <Text style={styles.attachmentText}>Take Photo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.attachmentButton}>
                        <Icon name="document-outline" size={24} color="#87CEEB" />
                        <Text style={styles.attachmentText}>Import from Files</Text>
                    </TouchableOpacity>
                </View>

                {/* Submit Button */}
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitText}>Submit</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        backgroundColor: '#000',
    },
    categories: {
        padding: 16,
    },
    introText: {
        color: '#FFF',
        marginBottom: 16,
        lineHeight: 20,
    },
    form: {
        padding: 16,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        color: '#FFF',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#1C1C1C',
        borderRadius: 4,
        padding: 12,
        color: '#FFF',
    },
    messageInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    attachmentOptions: {
        flexDirection: 'column',
        gap: 12,
        marginTop: 8,
    },
    attachmentButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    attachmentText: {
        color: '#87CEEB',
    },
    submitButton: {
        backgroundColor: '#87CEEB',
        padding: 16,
        borderRadius: 4,
        alignItems: 'center',
        marginTop: 24,
    },
    submitText: {
        color: '#000',
        fontWeight: '500',
    }
});