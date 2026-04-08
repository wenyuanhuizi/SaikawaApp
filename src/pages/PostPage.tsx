import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Linking,
  Share,
} from 'react-native';
import TopBar from '../components/common/TopBar';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
import ImageViewer from 'react-native-image-zoom-viewer';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  useTheme,
  useNavigation,
  NavigationProp,
} from '@react-navigation/native';
import {RootStackParamList} from '../NavigationManager';
import {MAX_CONTENT_WIDTH, moderateScale, isTablet} from '../utils/responsive';

const CLOUD_FRONT_URL = 'https://dwtzamkwegvv2.cloudfront.net/';

type Post = {
  postID: string;
  title: string;
  date: string;
  imageKeys: string[];
  description: string;
};

function PostPage() {
  const {colors} = useTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [currentImages, setCurrentImages] = useState<{url: string}[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [initialDeepLinkHandled, setInitialDeepLinkHandled] = useState(false);

  const handleDeepLink = (url: string | null) => {
    if (url && url.startsWith('saikawalab://post/')) {
      const postID = url.split('/post/')[1];
      if (postID) {
        navigation.navigate('SinglePostPage', {postID});
      } else {
        console.error('Invalid deep link: postID not found');
      }
    }
  };

  useEffect(() => {
    const initializePosts = async () => {
      try {
        await fetchPosts(1);
      } catch (error) {
        console.error('Error initializing posts:', error);
      }
    };

    initializePosts();

    // Check and handle the initial deep link when the app starts
    const checkInitialURL = async () => {
      const initialURL = await Linking.getInitialURL();
      if (initialURL) {
        handleDeepLink(initialURL);
      }
      setInitialDeepLinkHandled(true); // Ensure this happens only once
    };

    if (!initialDeepLinkHandled) {
      checkInitialURL();
    }

    // Listener for new deep link events
    const urlSubscription = Linking.addEventListener('url', event => {
      handleDeepLink(event.url);
    });

    return () => {
      urlSubscription.remove();
    };
  }, [initialDeepLinkHandled]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setHasMore(true);
    setPage(1);
    await fetchPosts(1, true);
    setRefreshing(false);
  };

  const fetchPosts = async (pageNumber: number, prepend = false) => {
    console.log(`Fetching posts for page: ${pageNumber}`);
    try {
      setLoadingMore(true);

      const response = await fetch(
        `https://api1-dot-saikawalab-427516.uc.r.appspot.com/api/v1/posts?page=${pageNumber}&limit=2`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        setPosts(prevPosts => {
          const updatedPosts = prepend
            ? [...data, ...prevPosts] // Prepend new posts to the top
            : [...prevPosts, ...data]; // Append new posts to the bottom

          // Deduplicate posts by postID
          const uniquePosts = updatedPosts.filter(
            (post, index, self) =>
              index === self.findIndex(t => t.postID === post.postID),
          );

          return uniquePosts;
        });

        if (!prepend) {
          setPage(pageNumber + 1); // Increment page only for scroll (not refresh)
        }
      } else if (!prepend) {
        setHasMore(false); // Stop loading more if no new data
      }

      setLoading(false);
      setLoadingMore(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
      setLoadingMore(false);
      if (refreshing) setPosts([]); // Clear posts on error during refresh
    }
  };

  const loadMorePosts = () => {
    if (!loadingMore && hasMore) {
      fetchPosts(page, false);
    }
  };

  const openViewer = (imageKeys: string[], index: number) => {
    const imageUrls = imageKeys.map(imageKey => ({
      url: `${CLOUD_FRONT_URL}${imageKey}`,
    }));
    setCurrentImages(imageUrls);
    setCurrentIndex(index);
    setVisible(true);
  };

  const toggleDescription = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const sharePost = async (postID: string) => {
    const appLink = `saikawalab://post/${postID}`;
    const fallbackAppStoreLink = `https://apps.apple.com/us/app/saikawalab/id1234567890`; // TODO: Replace with your App Store link

    try {
      await Share.share({
        message: `Check out this post: ${appLink}\nIf you don't have the app, download it here: ${fallbackAppStoreLink}`,
      });
      console.log('Post shared successfully');
    } catch (error) {
      console.error('Error sharing the post:', error);
    }
  };

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

  const renderItem = ({item}: {item: Post}) => (
    <View key={item.postID} style={styles.postCard}>
      <View style={styles.header}>
        <Text style={[styles.title, {color: colors.primary}]}>
          {item.title}
        </Text>
        <Icon
          name="share-social-outline"
          size={24}
          style={{color: colors.primary}}
          onPress={() => sharePost(item.postID)}
        />
      </View>
      <View style={styles.imageContainer}>
        {Array.isArray(item.imageKeys) && item.imageKeys.length > 0 ? (
          <SwiperFlatList
            showPagination
            paginationDefaultColor="gray"
            paginationActiveColor={colors.primary}
            paginationStyleItem={{width: 6, height: 6}}
            data={item.imageKeys}
            renderItem={({item: imageKey, index}) => {
              const imageUrl = `${CLOUD_FRONT_URL}${imageKey}`;
              return (
                <TouchableOpacity
                  key={`${item.postID}-${imageKey}-${index}`}
                  onPress={() => openViewer(item.imageKeys, index)}>
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
      <TouchableOpacity
        onPress={() => toggleDescription(item.postID)}
        style={styles.descriptionContainer}>
        <Text
          style={styles.description}
          numberOfLines={expandedId === item.postID ? undefined : 2}>
          {item.description}
        </Text>
      </TouchableOpacity>
      <Text style={styles.date}>{formatDate(item.date)}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TopBar />
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={item => item.postID}
        onEndReached={loadMorePosts}
        onEndReachedThreshold={0.2} // Adjust threshold for better triggering
        ListFooterComponent={
          loadingMore && hasMore ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : null
        }
        refreshControl={
          // Add RefreshControl here
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.text}
          />
        }
      />
      {visible && (
        <Modal visible={visible} transparent={true}>
          {/* Outer view ensures full-screen black background */}
          <View style={{flex: 1, backgroundColor: 'black'}}>
            <SafeAreaView style={{flex: 1}}>
              {/* This container centers the ImageViewer and applies the upward shift */}
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  transform: [{translateY: -45}],
                }}>
                <ImageViewer
                  imageUrls={currentImages}
                  index={currentIndex}
                  onSwipeDown={() => setVisible(false)}
                  enableSwipeDown={true}
                  saveToLocalByLongPress={false}
                />
              </View>
            </SafeAreaView>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  postCard: {
    overflow: 'hidden',
    marginBottom: 10,
    maxWidth: MAX_CONTENT_WIDTH,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  title: {
    fontFamily: 'DMSans-Bold',
    fontSize: moderateScale(16),
    paddingVertical: 2.5,
  },
  imageContainer: {
    height: isTablet ? 420 : 300,
    width: '100%',
  },
  image: {
    width: MAX_CONTENT_WIDTH,
    height: isTablet ? 420 : 300,
  },
  descriptionContainer: {
    marginHorizontal: 15,
    marginTop: 10,
  },
  description: {
    fontSize: moderateScale(14),
  },
  date: {
    marginHorizontal: 15,
    marginTop: 5,
    fontSize: moderateScale(12),
    color: '#666',
    textAlign: 'left',
  },
});

export default PostPage;
