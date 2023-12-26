import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    FlatList,
    StyleSheet,
    Alert,
    Button
} from 'react-native';
import { connect } from 'react-redux';
import { getAuth, signOut } from 'firebase/auth';
import { firestore } from '../../firebaseConfig';
import { 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  collection, 
  orderBy, 
  deleteDoc, 
  setDoc 
} from 'firebase/firestore';

const Profile = (props) => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    const uid = props.route.params.uid;
    if (uid === getAuth().currentUser.uid) {
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
              console.log('There are no posts for the current user');
          }
      });
    }
    if (props.following.indexOf(props.route.params.uid) !== -1) {
      setFollowing(true);
    } else {
      setFollowing(false);
    }
  }, [props.route.params.uid, props.following, props.posts]);

  const renderItem = ({item}) => (
    <View style={styles.postImageContainer}>
      <Image
        source={{uri: item?.imageURL}}
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

  const doSignOut = async _ => {
    await signOut(getAuth());
  };

  const handleFollow = async _ => {
    if (!following) {
      await addFollowingDoc();
    } else {
      await deleteFollowingDoc();
    }
    setFollowing(!following);
  };

  const addFollowingDoc = async _ => {
    const followingDoc = doc(firestore, 'following', getAuth().currentUser.uid, 'userFollowing', props.route.params.uid);
    await setDoc(followingDoc, {});
  };

  const deleteFollowingDoc = async _ => {
    const followingDoc = doc(firestore, 'following', getAuth().currentUser.uid, 'userFollowing', props.route.params.uid);
    await deleteDoc(followingDoc);
  };

  return (
    <View style={styles.container}>
        <View>
          <View>
            <Text>{user?.name}</Text>
          </View>
          <View>
            <Text>{user?.email}</Text>
          </View>
          {
            props.route.params.uid !== getAuth().currentUser.uid ? (
              <View>
                <Button
                  title={following ? 'Following' : 'Follow'}
                  onPress={handleFollow}
                  color={following ? 'grey' : 'blue'}
                />
              </View>
            ) : (
              <View>
                <Button
                  title='Logout'
                  onPress={askSignOut}
                  color={'red'}
                />
              </View>
            )
          }
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
    marginTop: 40,
    margin: 5
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
  posts: store.userState.posts,
  following: store.userState.following
});

export default connect(mapStateToProps, null)(Profile);