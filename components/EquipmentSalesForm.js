import React from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function EquipmentSalesForm() {
    return (
        <View style={styles.form}>
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Namefffffff*</Text>
                <TextInput
                    style={styles.input}
                    placeholder="First/Surname"
                    placeholderTextColor="#666"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Email*</Text>
                <TextInput
                    style={styles.input}
                    placeholder="example@email"
                    placeholderTextColor="#666"
                    keyboardType="email-address"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Business Name*</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Business Name"
                    placeholderTextColor="#666"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Business Type*</Text>
                <TextInput
                    style={styles.input}
                    placeholder="What is the type/industry?"
                    placeholderTextColor="#666"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Required Date*</Text>
                <TextInput
                    style={styles.input}
                    placeholder="When do you need it?"
                    placeholderTextColor="#666"
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

            <TouchableOpacity style={styles.submitButton}>
                <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
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
    },
});