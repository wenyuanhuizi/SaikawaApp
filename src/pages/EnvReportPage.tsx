import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {useTheme, useNavigation} from '@react-navigation/native';
import {launchImageLibrary, Asset} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

function EnvReportPage() {
  const {colors} = useTheme();
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('airPollution');
  const [description, setDescription] = useState('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [images, setImages] = useState<Asset[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const CategoryOptions = [
    {label: 'Soil Contamination', value: 'Soil Contamination'},
    {label: 'Air Pollution', value: 'Air Pollution'},
    {label: 'Water Pollution', value: 'Water Pollution'},
    {label: 'Others', value: 'Others'},
  ];

  const handleImagePick = () => {
    launchImageLibrary({mediaType: 'photo', selectionLimit: 0}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.error('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets) {
        setImages(prevImages => [
          ...prevImages,
          ...(response.assets as Asset[]),
        ]);
      }
    });
  };

  const removeImage = (index: number) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const uploadImages = async () => {
    const uploadedImageKeys = [];

    for (let i = 0; i < images.length; i++) {
      const image = images[i];

      if (!image.uri) {
        console.error(`Image at index ${i} has no URI`);
        Alert.alert('Error', `Image ${i + 1} is missing a valid URI.`);
        continue; // Skip this image
      }

      const timestamp = Date.now(); // Get the current timestamp
      const imageKey = `env/${name.replace(/\s/g, '')}_${timestamp}_${i + 1}`;
      const contentType = image.type ? image.type.split('/')[1] : 'jpeg'; // Extract type or default to 'jpeg'

      try {
        // Step 1: Generate presigned URL
        const presignedUrlResponse = await axios.get(
          'https://api1-dot-saikawalab-427516.uc.r.appspot.com/api/v1/generate-presigned-url',
          {params: {imageKey, contentType}},
        );

        const {presignedUrl} = presignedUrlResponse.data;

        // Step 2: Fetch the image file as Blob
        const fileResponse = await fetch(image.uri.replace('file://', ''));
        if (!fileResponse.ok)
          throw new Error(`Failed to fetch file: ${fileResponse.statusText}`);
        const fileBlob = await fileResponse.blob();

        // Step 3: Upload the image to S3
        const uploadResponse = await fetch(presignedUrl, {
          method: 'PUT',
          body: fileBlob,
          headers: {
            'Content-Type': `image/${contentType}`, // Use full MIME type for upload
          },
        });

        if (!uploadResponse.ok) {
          const responseText = await uploadResponse.text();
          throw new Error(
            `Upload failed: ${uploadResponse.status} - ${responseText}`,
          );
        }

        uploadedImageKeys.push(imageKey);
        console.log(`Uploaded successfully: ${imageKey}`);
      } catch (error) {
        console.error(`Error uploading image ${imageKey}:`, error);
        Alert.alert('Error', `Failed to upload image ${imageKey}.`);
        return []; // Halt and return empty array on failure
      }
    }

    return uploadedImageKeys;
  };

  const handleSubmit = async () => {
    if (isSubmitting) return; // Prevent duplicate submissions
    setIsSubmitting(true);

    try {
      // Step 1: Upload Images
      const imageKeys = await uploadImages();
      if (imageKeys.length === 0) {
        throw new Error('No images were uploaded.');
      }

      console.log('Uploaded Image Keys:', imageKeys);

      // Step 2: Submit Metadata
      const payload = {
        name,
        email,
        phone,
        category,
        description,
        imageKeys,
      };

      console.log('Payload:', payload);

      const response = await axios.post(
        'https://api1-dot-saikawalab-427516.uc.r.appspot.com/api/v1/create-env-report',
        payload,
      );

      if (response.status === 201) {
        Alert.alert('Success', 'Your report has been submitted!');
        navigation.goBack(); // Optionally navigate back
      } else {
        throw new Error('Failed to submit the report.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false); // Reset submission state
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={[styles.header, {borderBottomColor: '#ddd'}]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, {color: colors.primary}]}>
            Environmental Reports
          </Text>
        </View>
        <Text style={[styles.label, {color: colors.primary}]}>Name</Text>
        <TextInput
          style={[
            styles.input,
            {borderColor: focusedInput === 'name' ? colors.primary : '#c4bebe'},
          ]}
          placeholder="Full Name..."
          value={name}
          onChangeText={setName}
          onFocus={() => setFocusedInput('name')}
          onBlur={() => setFocusedInput(null)}
        />

        <Text style={[styles.label, {color: colors.primary}]}>Email</Text>
        <TextInput
          style={[
            styles.input,
            {
              borderColor:
                focusedInput === 'email' ? colors.primary : '#c4bebe',
            },
          ]}
          placeholder="example@email.com"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          onFocus={() => setFocusedInput('email')}
          onBlur={() => setFocusedInput(null)}
        />

        <Text style={[styles.label, {color: colors.primary}]}>Phone</Text>
        <TextInput
          style={[
            styles.input,
            {
              borderColor:
                focusedInput === 'phone' ? colors.primary : '#c4bebe',
            },
          ]}
          placeholder="+1 (___) ___-____"
          value={phone}
          onChangeText={setPhone}
          onFocus={() => setFocusedInput('phone')}
          onBlur={() => setFocusedInput(null)}
        />

        <Text style={[styles.label, {color: colors.primary}]}>Category</Text>
        <Dropdown
          style={[
            styles.dropdown,
            {borderColor: focusedInput === 'year' ? colors.primary : '#c4bebe'},
          ]}
          placeholderStyle={{fontSize: 14, color: '#c4bebe'}}
          selectedTextStyle={{fontSize: 14, color: '#050000'}}
          data={CategoryOptions}
          maxHeight={190}
          labelField="label"
          valueField="value"
          placeholder="Select category"
          value={category}
          onChange={item => {
            setCategory(item.value);
            setFocusedInput(null);
          }}
          onFocus={() => setFocusedInput('year')}
        />

        <Text style={[styles.label, {color: colors.primary}]}>
          Upload Pictures
        </Text>
        <View style={styles.imageContainer}>
          {images.map((image, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{uri: image.uri}} style={styles.image} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeImage(index)}>
                <Text style={styles.removeButtonText}>X</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.addButton} onPress={handleImagePick}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.label, {color: colors.primary}]}>Description</Text>
        <TextInput
          style={[
            styles.textArea,
            {
              borderColor:
                focusedInput === 'response' ? colors.primary : '#c4bebe',
            },
          ]}
          placeholder="Please briefly describe what is happening..."
          value={description}
          onChangeText={setDescription}
          multiline
          onFocus={() => setFocusedInput('response')}
          onBlur={() => setFocusedInput(null)}
        />

        <TouchableOpacity
          style={[styles.button, {backgroundColor: colors.primary}]}
          onPress={handleSubmit}
          activeOpacity={0.8}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'white',
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginVertical: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    marginLeft: 15,
    marginTop: 5,
    fontWeight: 'bold',
  },
  dropdown: {
    backgroundColor: '#fff',
    borderWidth: 1,
    padding: 10,
    marginHorizontal: 15,
    borderRadius: 8,
    marginBottom: 16,
  },
  input: {
    padding: 12,
    marginHorizontal: 15,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
  },
  textArea: {
    flex: 1,
    padding: 12,
    marginHorizontal: 15,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    height: 150,
  },
  button: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 10,
    width: 250,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 12,
  },
  addButton: {
    width: 80,
    height: 80,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  addButtonText: {
    fontSize: 24,
    color: '#555',
  },
});

export default EnvReportPage;
