import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    FlatList,
    StyleSheet,
    Pressable,
} from 'react-native';
import { connect } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Feed = props => {
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    let posts = [];
    if (props.usersLoaded === props.following.length) {
      for (let i = 0; i < props.following.length; i++) {
        const user = props.users.find(el => el.uid === props.following[i]);
        if (user != undefined) {
          posts = [...posts, ...user.posts];
        }
      }
      posts.sort((x, y) => x.creationTimestamp - y.creationTimestamp);
      setPosts(posts);
    }
  }, [props.usersLoaded]);
  
  const renderItem = ({item}) => {
    return <View style={styles.postContainer}>
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
      <Pressable
        onPress={() => props.navigation.navigate('Comment', {
          postId: item.id,
          uid: item.user.uid
        })}
      >
        <MaterialCommunityIcons name={'comment-outline'} color={'blue'} size={26}/>
      </Pressable>
    </View>
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
  users: store.usersState.users,
  usersLoaded: store.usersState.usersLoaded
});

export default connect(mapStateToProps, null)(Feed);