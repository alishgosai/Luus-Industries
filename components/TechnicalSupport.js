import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
    Alert,
    ActivityIndicator,
    Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';

const isImageFile = (fileName: string) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
    return imageExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
};

export default function TechnicalSupportForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        businessName: '',
        location: '',
        message: '',
        image: null,
        fileName: null,
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = () => {
        console.log('Form submitted:', formData);
        // Add your form submission logic here
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

            console.log('Camera result:', result);

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

            console.log('File import result:', JSON.stringify(result, null, 2));

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

                <Text style={styles.label}>Attach File</Text>
                {formData.image ? (
                    <View style={styles.fileContainer}>
                        {isImageFile(formData.fileName) ? (
                            <Image source={{ uri: formData.image }} style={styles.selectedImage} />
                        ) : (
                            <View style={styles.fileIconContainer}>
                                <Ionicons name="document-outline" size={50} color="#87CEEB" />
                            </View>
                        )}
                        <Text style={styles.fileName}>{formData.fileName}</Text>
                        <View style={styles.fileActions}>
                            <TouchableOpacity style={styles.fileActionButton} onPress={handleChangeImage}>
                                <Ionicons name="refresh-outline" size={24} color="#87CEEB" />
                                <Text style={styles.fileActionText}>Change</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.fileActionButton} onPress={handleRemoveImage}>
                                <Ionicons name="trash-outline" size={24} color="#FF6347" />
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
                            <Ionicons name="camera-outline" size={24} color={isLoading ? '#666' : '#87CEEB'} />
                            <Text style={[styles.attachmentText, isLoading && styles.disabledText]}>Take Photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.attachmentButton}
                            onPress={handleImportFile}
                            disabled={isLoading}
                        >
                            <Ionicons name="folder-outline" size={24} color={isLoading ? '#666' : '#87CEEB'} />
                            <Text style={[styles.attachmentText, isLoading && styles.disabledText]}>Choose File</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {isLoading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#87CEEB" />
                    </View>
                )}

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
        fontSize: 16,
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
        fontSize: 16,
        fontWeight: 'bold',
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
    },
});

