import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    FlatList,
    StyleSheet,
    Pressable,
    Alert
} from 'react-native';
import { connect } from 'react-redux';
import { getAuth, signOut } from 'firebase/auth';
import { firestore } from '../../firebaseConfig';
import { doc, getDoc, getDocs, query, collection, orderBy } from 'firebase/firestore';

const Profile = (props) => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    const uid = props.route.params.uid;
    if (uid == getAuth().currentUser.uid) {
      setUser(props.currentUser);
      setPosts(props.posts);
    } else {
      const docRef = doc(firestore, 'users', uid);
      getDoc(docRef)
          .then(snapshot => {
              if (snapshot.exists) {
                  setUser(snapshot.data());
              } else {
                  console.log('User does not exist');
              }
          });
      const userPostsCollection = collection(firestore, 'posts', uid, 'userPosts');
      const theQuery = query(userPostsCollection, orderBy('creationTimestamp'));
      getDocs(theQuery)
      .then(snapshot => {
          if (!snapshot.empty) {
              const posts = snapshot.docs.map(doc => {
                  const data = doc.data();
                  const id = doc.id;
                  return {id, ...data};
              });
              setPosts(posts);
          } else {
              console.log('There are not any post for the current user');
          }
      });
    }
  }, [props.route.params.uid]);

  const renderItem = ({item}) => (
    <View style={styles.postImageContainer}>
      <Image
        source={{uri: item.imageURL}}
        style={styles.postImage}
      />
    </View>
  );

  const askSignOut = () => {
    Alert.alert('Logout', 'Are you sure?', [
      {
        text: 'Yes',
        onPress: doSignOut
      },
      {
        text: 'No',
        onPress: null
      }
    ]
    );
  };

  const doSignOut = async () => {
    await signOut(getAuth());
  };

  return (
    <View style={styles.container}>
      <View style={[styles.userInfoContainer, {flexDirection: 'row'}]}>
        <View style={{flex: 1}}>
          <Text>{user?.name}</Text>
          <Text>{user?.email}</Text>
        </View>
        <View style={{flex: 1}}>
          <Pressable
            onPress={askSignOut}
          >
            <Text>Logout</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.postsContainer}>
        <FlatList
          numColumns={3}
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
  postImageContainer: {
    flex: 1/3,
    margin: .5
  }
});

const mapStateToProps = store => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts
});

export default connect(mapStateToProps, null)(Profile);