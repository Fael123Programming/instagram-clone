import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    FlatList,
    StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import PressableIcon from '../util/PressableIcon';
import LikePressableIcon from '../util/LikePressableIcon';

const Feed = props => {
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    if (props.usersFollowingLoaded === props.following.length && props.following.length !== 0) {
      props.feed.sort((x, y) => x.creationTimestamp - y.creationTimestamp);
      setPosts(props.feed);
    }
  }, [props.usersFollowingLoaded, props.feed]);

  if (posts == undefined) {
    return null;
  }

  const renderItem = ({item}) => {
    if (item.currentUserLike == undefined) {
      return null;
    }
    return (
      <View style={styles.postContainer}>
        <View style={styles.postUserImageContainer}>
          <Image
            source={require('../../assets/unknown-user.png')}
            style={styles.postUserImage}
          />
          <Text style={styles.authorName}>{item.user.name}</Text>
        </View>
        <Image
          source={{uri: item.imageURL}}
          style={styles.postImage}
        />
        <View
        style={{flex: 1, flexDirection: 'row', padding: 5}}>
          <LikePressableIcon
            liked={item.currentUserLike}
            uid={item.user.uid}
            postId={item.id}
          />
          <PressableIcon
            icon={'comment-outline'}
            iconPressed={'comment'}
            color={'blue'}
            onPress={() => props.navigation.navigate('Comment', {
              postId: item.id,
              uid: item.user.uid
            })}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.postsContainer}>
        <FlatList
          numColumns={1}
          horizontal={false}
          data={posts}
          renderItem={renderItem}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40
  },
  userInfoContainer: {
    margin: 20
  }, 
  postsContainer: {
    flex: 1,
  },
  postImage: {
    flex: 1,
    aspectRatio: 1/1
  },
  postContainer: {
    flex: 1/3,
    marginTop: 10
  },
  authorName: {
    flex: 1
  },
  postUserImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    margin: 5
  },
  postUserImageContainer: {
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center'
  }
});

const mapStateToProps = store => ({
  currentUser: store.userState.currentUser,
  following: store.userState.following,
  feed: store.usersState.feed,
  usersFollowingLoaded: store.usersState.usersFollowingLoaded
});

export default connect(mapStateToProps, null)(Feed);