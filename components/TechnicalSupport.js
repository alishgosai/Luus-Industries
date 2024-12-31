import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TechnicalSupportForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        businessName: '',
        location: '',
        message: '',
    });

    const handleSubmit = () => {
        console.log('Form submitted:', formData);
        // Add your form submission logic here
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.introText}>
                    To get in touch with us, please complete the below form and a member of our team will contact you shortly
                </Text>

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
                    <Text style={styles.label}>Message*</Text>
                    <TextInput
                        style={[styles.input, styles.messageInput]}
                        placeholder="Describe your problem here!"
                        placeholderTextColor="#666"
                        multiline
                        numberOfLines={4}
                        value={formData.message}
                        onChangeText={(text) => setFormData({ ...formData, message: text })}
                    />
                </View>

                <Text style={styles.label}>Attach Image</Text>
                <View style={styles.attachmentOptions}>
                    <TouchableOpacity style={styles.attachmentButton}>
                        <Ionicons name="camera-outline" size={24} color="#87CEEB" />
                        <Text style={styles.attachmentText}>Take Photo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.attachmentButton}>
                        <Ionicons name="document-outline" size={24} color="#87CEEB" />
                        <Text style={styles.attachmentText}>Import from Files</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitText}>Submit</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    form: {
        padding: 16,
    },
    introText: {
        color: '#FFF',
        marginBottom: 16,
        lineHeight: 20,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        color: '#FFF',
        marginBottom: 8,
        fontSize: 16,
    },
    input: {
        backgroundColor: '#1C1C1C',
        borderRadius: 4,
        padding: 12,
        color: '#FFF',
        fontSize: 16,
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
        fontSize: 16,
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
        fontSize: 16,
        fontWeight: 'bold',
    },
});