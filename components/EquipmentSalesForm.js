import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert,
    ActivityIndicator,
    Linking,
    ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { submitEquipmentSalesForm } from '../Services/ServiceForm';

const isImageFile = (fileName) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
    return imageExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
};

export default function EquipmentSalesForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        businessName: '',
        businessType: '',
        requiredDate: '',
        problemDescription: '',
        image: null,
        fileName: null
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
// Validate required fields
const requiredFields = ['name', 'email', 'businessName', 'businessType', 'requiredDate', 'problemDescription'];
const emptyFields = requiredFields.filter(field => !formData[field]);

if (emptyFields.length > 0) {
    Alert.alert('', 'Please fill all the required fields.');
    return;
}

        setIsLoading(true);
        try {
            const result = await submitEquipmentSalesForm(formData);
            console.log('Form submitted successfully:', result);
            Alert.alert('Success', 'Your equipment sales inquiry has been submitted successfully.');
            // Reset form data here if needed
        } catch (error) {
            console.error('Error submitting form:', error);
            Alert.alert('Error', 'Failed to submit form. Please try again later.');
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
                setFormData(prevState => ({ 
                    ...prevState, 
                    image: resizedUri,
                    fileName: 'Photo_' + new Date().toISOString() + '.jpg'
                }));
            } else {
                throw new Error('No photo taken');
            }
        } catch (error) {
            console.error('Error taking photo:', error);
            Alert.alert('Error', `Failed to take photo: ${error.message}`);
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
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.7,
            });

            if (!result.canceled && result.assets && result.assets[0].uri) {
                const resizedUri = await resizeImage(result.assets[0].uri);
                setFormData(prevState => ({ 
                    ...prevState, 
                    image: resizedUri,
                    fileName: result.assets[0].fileName || 'imported_file'
                }));
            } else {
                throw new Error('File selection was cancelled or failed');
            }
        } catch (error) {
            console.error('Error importing file:', error);
            Alert.alert('Error', `Failed to import file: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangeImage = () => {
        Alert.alert(
            'Change File',
            'How would you like to change the file?',
            [
                {
                    text: 'Take Photo',
                    onPress: handleTakePhoto
                },
                {
                    text: 'Choose from Library',
                    onPress: handleImportFile
                },
                {
                    text: 'Cancel',
                    style: 'cancel'
                }
            ]
        );
    };

    const handleRemoveImage = () => {
        Alert.alert(
            'Remove File',
            'Are you sure you want to remove this file?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Remove',
                    onPress: () => setFormData(prevState => ({ ...prevState, image: null, fileName: null }))
                }
            ]
        );
    };

    const requestCameraPermission = async () => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            
            if (status !== 'granted') {
                Alert.alert(
                    'Permission Denied',
                    'Sorry, we need camera permissions to make this work!',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Open Settings', onPress: () => Linking.openSettings() }
                    ]
                );
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
            Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
            return false;
        }
        return true;
    };

    const resizeImage = async (uri) => {
        try {
            const fileInfo = await FileSystem.getInfoAsync(uri);
            console.log('Original file size:', fileInfo.size);
            
            // If file size is greater than 1MB, resize it
            if (fileInfo.size > 1024 * 1024) {
                console.log('Image needs resizing');
                const resizedUri = await ImageManipulator.manipulateAsync(
                    uri,
                    [{ resize: { width: 800 } }],
                    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
                );
                console.log('Resized image uri:', resizedUri.uri);
                return resizedUri.uri;
            }
            return uri;
        } catch (error) {
            console.error('Error resizing image:', error);
            return uri;
        }
    };

    return (
        <ScrollView style={styles.container}>
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
                    <Text style={styles.label}>Business Type*</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="What is the type/industry?"
                        placeholderTextColor="#666"
                        value={formData.businessType}
                        onChangeText={(text) => setFormData({ ...formData, businessType: text })}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Required Date*</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="When do you need it?"
                        placeholderTextColor="#666"
                        value={formData.requiredDate}
                        onChangeText={(text) => setFormData({ ...formData, requiredDate: text })}
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
                            <Text style={[styles.attachmentText, isLoading && styles.disabledText]}>Choose File</Text>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    attachmentButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1C1C1C',
        padding: 10,
        borderRadius: 4,
        flex: 1,
        marginHorizontal: 4,
    },
    attachmentText: {
        color: '#87CEEB',
        marginLeft: 8,
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
        borderRadius: 4,
    },
    fileActionText: {
        color: '#87CEEB',
        marginLeft: 8,
    },
    loadingContainer: {
        marginTop: 16,
        alignItems: 'center',
    },
    disabledText: {
        color: '#666',
    }
});
