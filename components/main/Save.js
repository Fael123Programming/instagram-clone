import React, { useState } from 'react';
import { View, Image, TextInput, Button } from 'react-native';
import { firestore, storage } from '../../firebaseConfig';
import { getDownloadURL, ref } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { generateUniqueRandomName } from '../util/Algorithms';
import { uploadBytes } from 'firebase/storage';
import { serverTimestamp, collection, addDoc } from 'firebase/firestore';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser, fetchUserPosts } from '../../redux/actions';

const Save = ({navigation, route, fetchUserPosts}) => {
    const [caption, setCaption] = useState('');

    const uploadImageAndSavePost = async () => {
        const uri = route.params.image;
        const response = await fetch(uri);
        const blob = await response.blob();
        const postName = generateUniqueRandomName();
        const postPath = `post/${getAuth().currentUser.uid}/${postName}`;
        const imageRef = ref(storage, postPath);
        uploadBytes(imageRef, blob)
            .then(success => {
                getDownloadURL(imageRef).then(url => {
                        savePost(url);
                    }
                ).catch(error => console.log(`Could not get download url due to error '${error}'`));
            })
            .catch(error => console.log(`'${postName}' was not uploaded due to error '${error}'`));
    };

    const savePost = (imageURL) => {
        const userPostsCollection = collection(firestore, 'posts', getAuth().currentUser.uid, 'userPosts'); 
        addDoc(userPostsCollection, {
            imageURL,
            caption,
            creationTimestamp: serverTimestamp()
        }).catch(error => console.log(`Could not write post document due to error '${error}'`));
    };

    const uploadImageSavePostAndPopToTop = async () => {
        await uploadImageAndSavePost();
        fetchUserPosts();
        navigation.popToTop();
    };

    return (
        <View style={{flex: 1}}>
            <Image
                source={{uri: route.params.image}}
                resizeMode={'contain'}
                style={{flex: 2, margin: 10}}
            />
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <TextInput
                    placeholder={'Write a caption...'}
                    onChangeText={caption => setCaption(caption)}
                />
            </View>
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Button
                    title={'Save'}
                    onPress={uploadImageSavePostAndPopToTop}
                />
            </View>
        </View>
    );
}

const mapDispatchProps = (dispatch) => bindActionCreators({fetchUser, fetchUserPosts}, dispatch);

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
});

export default connect(mapStateToProps, mapDispatchProps)(Save);