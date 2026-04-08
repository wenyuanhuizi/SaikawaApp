import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {RouteProp, NavigationProp} from '@react-navigation/native';
import {RootStackParamList} from '../NavigationManager';
import Icon from 'react-native-vector-icons/Ionicons';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
import ImageViewer from 'react-native-image-zoom-viewer';
import {useTheme} from '@react-navigation/native';
import {MAX_CONTENT_WIDTH, moderateScale, isTablet} from '../utils/responsive';

const CLOUD_FRONT_URL = 'https://dwtzamkwegvv2.cloudfront.net/';

type SinglePostRouteProp = RouteProp<RootStackParamList, 'SinglePostPage'>;

const SinglePostPage: React.FC = () => {
  const route = useRoute<SinglePostRouteProp>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {postID} = route.params;
  const {colors} = useTheme();

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [currentImages, setCurrentImages] = useState<{url: string}[]>([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(
          `https://api1-dot-saikawalab-427516.uc.r.appspot.com/api/v1/posts/${postID}`,
        );

        if (!response.ok) {
          throw new Error(`Error fetching post: ${response.status}`);
        }

        const data = await response.json();
        setPost(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching single post:', error);
        setLoading(false);
      }
    };

    fetchPost();
  }, [postID]);

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const formattedDate = date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return `${formattedDate} ${formattedTime}`;
  };

  const openViewer = (imageKeys: string[], index: number) => {
    const imageUrls = imageKeys.map(imageKey => ({
      url: `${CLOUD_FRONT_URL}${imageKey}`,
    }));
    setCurrentImages(imageUrls);
    setCurrentIndex(index);
    setVisible(true);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Post not found!</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={[styles.title, {color: colors.primary}]}>
            {post.title}
          </Text>
        </View>
        <Text style={styles.date}>{formatDate(post.date)}</Text>
        <View style={styles.imageContainer}>
          {Array.isArray(post.imageKeys) && post.imageKeys.length > 0 ? (
            <SwiperFlatList
              index={Math.min(currentIndex, post.imageKeys.length - 1)}
              onChangeIndex={({index}) => setCurrentIndex(index)}
              showPagination
              paginationDefaultColor="gray"
              paginationActiveColor={colors.primary}
              paginationStyleItem={{width: 6, height: 6}}
              data={post.imageKeys}
              renderItem={({item: imageKey, index}) => {
                const imageUrl = `${CLOUD_FRONT_URL}${imageKey}`;
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => openViewer(post.imageKeys, index)}>
                    <Image source={{uri: imageUrl}} style={styles.image} />
                  </TouchableOpacity>
                );
              }}
            />
          ) : (
            <Text style={{textAlign: 'center', color: 'red'}}>
              No images available
            </Text>
          )}
        </View>
        <Text style={styles.description}>{post.description}</Text>
      </ScrollView>
      {visible && (
        <Modal visible={visible} transparent={true}>
          <ImageViewer
            imageUrls={currentImages}
            index={currentIndex}
            onSwipeDown={() => setVisible(false)}
            enableSwipeDown={true}
            renderHeader={() => (
              <TouchableOpacity
                onPress={() => setVisible(false)}
                style={styles.closeButton}>
                <Icon name="close" size={30} color="white" />
              </TouchableOpacity>
            )}
          />
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 18,
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  title: {
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 10,
  },
  date: {
    fontSize: moderateScale(14),
    color: '#666',
    marginHorizontal: 15,
    marginTop: 5,
  },
  imageContainer: {
    height: isTablet ? 420 : 300,
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: 'center',
    marginTop: 10,
  },
  image: {
    width: MAX_CONTENT_WIDTH,
    height: isTablet ? 420 : 300,
  },
  description: {
    fontSize: moderateScale(16),
    paddingHorizontal: 15,
    paddingTop: 10,
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: 'center',
    width: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
});

export default SinglePostPage;
