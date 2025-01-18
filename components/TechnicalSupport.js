import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { submitTechnicalSupportForm } from '../Services/ServiceForm';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomAlert from './CustomAlert';

const isImageFile = (fileName) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
    return imageExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
};

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export default function TechnicalSupportForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        productModel: '',
        serialNumber: '',
        purchaseDate: null,
        problemDescription: '',
        image: null,
        fileName: null
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    const validateForm = () => {
        let newErrors = {};
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!isValidEmail(formData.email)) newErrors.email = 'Invalid email format';
        if (!formData.productModel) newErrors.productModel = 'Product Model is required';
        if (!formData.serialNumber) newErrors.serialNumber = 'Serial Number is required';
        if (!formData.purchaseDate) newErrors.purchaseDate = 'Purchase Date is required';
        if (!formData.problemDescription) newErrors.problemDescription = 'Problem Description is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            setAlertVisible(true);
            setAlertTitle('Form Error');
            setAlertMessage('Please correct the errors in the form.');
            return;
        }

        setIsLoading(true);
        try {
            const submissionData = Object.fromEntries(
                Object.entries(formData).filter(([_, v]) => v != null)
            );

            if (submissionData.purchaseDate) {
                submissionData.purchaseDate = submissionData.purchaseDate.toISOString();
            }

            const result = await submitTechnicalSupportForm(submissionData);
            console.log('Form submitted successfully:', result);
            setAlertVisible(true);
            setAlertTitle('Success');
            setAlertMessage('Your technical support request has been submitted successfully.');
            setFormData({
                name: '',
                email: '',
                productModel: '',
                serialNumber: '',
                purchaseDate: null,
                problemDescription: '',
                image: null,
                fileName: null
            });
            setErrors({});
        } catch (error) {
            console.error('Error submitting form:', error);
            setAlertVisible(true);
            setAlertTitle('Submission Error');
            setAlertMessage(`Failed to submit form: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTakePhoto = async () => {
        const permissionGranted = await requestCameraPermission();
        if (!permissionGranted) return;

        setIsLoading(true);
        try {
            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.7,
            });

            if (!result.canceled && result.assets && result.assets[0].uri) {
                const resizedUri = await resizeImage(result.assets[0].uri);
                const fileName = `photo_${Date.now()}.jpg`;
                setFormData(prevState => ({ 
                    ...prevState, 
                    image: resizedUri,
                    fileName: fileName
                }));
            }
        } catch (error) {
            console.error('Error taking photo:', error);
            setAlertVisible(true);
            setAlertTitle('Camera Error');
            setAlertMessage(`Failed to take photo: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImportFile = async () => {
        const permissionGranted = await requestPermission();
        if (!permissionGranted) return;

        setIsLoading(true);
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.7,
            });

            if (!result.canceled && result.assets && result.assets[0].uri) {
                const resizedUri = await resizeImage(result.assets[0].uri);
                const fileName = result.assets[0].fileName || `imported_${Date.now()}.jpg`;
                setFormData(prevState => ({ 
                    ...prevState, 
                    image: resizedUri,
                    fileName: fileName
                }));
            }
        } catch (error) {
            console.error('Error importing file:', error);
            setAlertVisible(true);
            setAlertTitle('File Import Error');
            setAlertMessage(`Failed to import file: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangeImage = () => {
        setAlertVisible(true);
        setAlertTitle('Change File');
        setAlertMessage('How would you like to change the file?');
    };

    const handleRemoveImage = () => {
        setAlertVisible(true);
        setAlertTitle('Remove File');
        setAlertMessage('Are you sure you want to remove this file?');
    };

    const requestCameraPermission = async () => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            
            if (status !== 'granted') {
                setAlertVisible(true);
                setAlertTitle('Permission Denied');
                setAlertMessage('Sorry, we need camera permissions to make this work!');
                return false;
            }
            return true;
        } catch (error) {
            console.error('Error requesting camera permission:', error);
            return false;
        }
    };

    const requestPermission = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            setAlertVisible(true);
            setAlertTitle('Permission Denied');
            setAlertMessage('Sorry, we need camera roll permissions to make this work!');
            return false;
        }
        return true;
    };

    const resizeImage = async (uri) => {
        try {
            const fileInfo = await FileSystem.getInfoAsync(uri);
            console.log('Original file size:', fileInfo.size);
            
            if (fileInfo.size > 1024 * 1024) {
                console.log('Image needs resizing');
                const resizedImage = await ImageManipulator.manipulateAsync(
                    uri,
                    [{ resize: { width: 800 } }],
                    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
                );
                console.log('Resized image uri:', resizedImage.uri);
                return resizedImage.uri;
            }
            return uri;
        } catch (error) {
            console.error('Error resizing image:', error);
            return uri;
        }
    };

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || formData.purchaseDate;
        setShowDatePicker(false);
        setFormData({ ...formData, purchaseDate: currentDate });
        setErrors({ ...errors, purchaseDate: undefined });
    };

    const renderInput = (label, key, placeholder, isRequired = false, keyboardType = 'default') => (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>{label}{isRequired && '*'}</Text>
            <TextInput
                style={[styles.input, errors[key] && styles.inputError]}
                placeholder={placeholder}
                placeholderTextColor="#666"
                value={formData[key]}
                onChangeText={(text) => {
                    setFormData({ ...formData, [key]: text });
                    setErrors({ ...errors, [key]: undefined });
                }}
                keyboardType={keyboardType}
            />
            {errors[key] && <Text style={styles.errorText}>{errors[key]}</Text>}
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container}>
                <View style={styles.form}>
                    {renderInput('Name', 'name', 'First/Surname', true)}
                    {renderInput('Email', 'email', 'example@email.com', true, 'email-address')}
                    {renderInput('Product Model', 'productModel', 'Enter product model', true)}
                    {renderInput('Serial Number', 'serialNumber', 'Enter serial number', true)}

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Purchase Date*</Text>
                        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
                            <Text style={[styles.dateButtonText, errors.purchaseDate && styles.inputError]}>
                                {formData.purchaseDate ? formData.purchaseDate.toDateString() : 'Select Date'}
                            </Text>
                        </TouchableOpacity>
                        {errors.purchaseDate && <Text style={styles.errorText}>{errors.purchaseDate}</Text>}
                        {showDatePicker && (
                            <DateTimePicker
                                value={formData.purchaseDate || new Date()}
                                mode="date"
                                display="default"
                                onChange={handleDateChange}
                            />
                        )}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Problem Description*</Text>
                        <TextInput
                            style={[styles.input, styles.messageInput, errors.problemDescription && styles.inputError]}
                            placeholder="Describe the issue you're experiencing"
                            placeholderTextColor="#666"
                            multiline
                            numberOfLines={4}
                            value={formData.problemDescription}
                            onChangeText={(text) => {
                                setFormData({ ...formData, problemDescription: text });
                                setErrors({ ...errors, problemDescription: undefined });
                            }}
                        />
                        {errors.problemDescription && <Text style={styles.errorText}>{errors.problemDescription}</Text>}
                    </View>

                    <Text style={styles.label}>Attach File</Text>
                    {formData.image ? (
                        <View style={styles.fileContainer}>
                            {isImageFile(formData.fileName) ? (
                                <Image source={{ uri: formData.image }} style={styles.selectedImage} />
                            ) : (
                                <View style={styles.fileIconContainer}>
                                    <Icon name="document-outline" size={50} color="#87CEEB" />
                                </View>
                            )}
                            <Text style={styles.fileName}>{formData.fileName}</Text>
                            <View style={styles.fileActions}>
                                <TouchableOpacity style={styles.fileActionButton} onPress={handleChangeImage}>
                                    <Icon name="refresh-outline" size={24} color="#87CEEB" />
                                    <Text style={styles.fileActionText}>Change</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.fileActionButton} onPress={handleRemoveImage}>
                                    <Icon name="trash-outline" size={24} color="#FF6347" />
                                    <Text style={[styles.fileActionText, { color: '#FF6347' }]}>Remove</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.attachmentOptions}>
                            <TouchableOpacity 
                                style={styles.attachmentButton}
                                onPress={handleTakePhoto}
                                disabled={isLoading}
                            >
                                <Icon name="camera-outline" size={24} color={isLoading ? '#666' : '#87CEEB'} />
                                <Text style={[styles.attachmentText, isLoading && styles.disabledText]}>Take Photo</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.attachmentButton}
                                onPress={handleImportFile}
                                disabled={isLoading}
                            >
                                <Icon name="folder-outline" size={24} color={isLoading ? '#666' : '#87CEEB'} />
                                <Text style={[styles.attachmentText, isLoading && styles.disabledText]}>Choose Image</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {isLoading && (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#87CEEB" />
                        </View>
                    )}

                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isLoading}>
                        <Text style={styles.submitText}>{isLoading ? 'Submitting...' : 'Submit'}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <CustomAlert
                visible={alertVisible}
                title={alertTitle}
                message={alertMessage}
                onClose={() => setAlertVisible(false)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#000',
    },
    container: {
        flex: 1,
        backgroundColor: '#000',
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
        fontSize: 16,
    },
    input: {
        backgroundColor: '#1C1C1C',
        borderRadius: 8,
        padding: 12,
        color: '#FFF',
        fontSize: 16,
    },
    inputError: {
        borderColor: '#FF6347',
        borderWidth: 1,
    },
    errorText: {
        color: '#FF6347',
        fontSize: 12,
        marginTop: 4,
    },
    messageInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    dateButton: {
        backgroundColor: '#1C1C1C',
        borderRadius: 8,
        padding: 12,
    },
    dateButtonText: {
        color: '#FFF',
        fontSize: 16,
    },
    attachmentOptions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    attachmentButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1C1C1C',
        padding: 12,
        borderRadius: 8,
        flex: 1,
        marginHorizontal: 4,
    },
    attachmentText: {
        color: '#87CEEB',
        marginLeft: 8,
        fontSize: 16,
    },
    submitButton: {
        backgroundColor: '#87CEEB',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 24,
    },
    submitText: {
        color: '#000',
        fontWeight: '500',
        fontSize: 18,
    },
    fileContainer: {
        alignItems: 'center',
        marginTop: 16,
    },
    selectedImage: {
        width: 200,
        height: 200,
        resizeMode: 'cover',
        borderRadius: 8,
    },
    fileIconContainer: {
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1C1C1C',
        borderRadius: 8,
    },
    fileName: {
        color: '#FFF',
        marginTop: 8,
        fontSize: 14,
    },
    fileActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 16,
    },
    fileActionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1C1C1C',
        padding: 10,
        borderRadius: 8,
    },
    fileActionText: {
        color: '#87CEEB',
        marginLeft: 8,
        fontSize: 14,
    },
    loadingContainer: {
        marginTop: 16,
        alignItems: 'center',
    },
    disabledText: {
        color: '#666',
    },
});

