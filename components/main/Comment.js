import React, { useState, useEffect } from 'react';
import {
    View,
    ScrollView,
    Image,
    Text,
    StyleSheet,
    FlatList,
    TextInput
} from 'react-native';
import { firestore } from '../../firebaseConfig';
import { 
    collection,
    getDocs,
    query,
    orderBy,
    addDoc,
    serverTimestamp
} from 'firebase/firestore';
import PressableIcon from '../util/PressableIcon';
import { getAuth } from 'firebase/auth';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUsersData } from '../../redux/actions';
import LikePressableIcon from '../util/LikePressableIcon';

const Comment = props => {
    const [comments, setComments] = useState([]);
    const [text, setText] = useState('');
    const [fetchComments, setFetchComments] = useState(true);

    useEffect(() => {
        if (fetchComments) {
            const commentsCollection = collection(firestore, 'posts', props.route.params.uid, 'userPosts', props.route.params.postId, 'comments');
            const theQuery = query(commentsCollection, orderBy('creationTimestamp'));
            getDocs(theQuery)
                .then(snapshot => {
                    let comments = snapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return {id, ...data};
                    });
                    matchUserToComment(comments);
                });
                setFetchComments(false);
        } else {
            matchUserToComment(comments);
        }
    }, [fetchComments, props.users]);

    const matchUserToComment = comments => {
        for (let i = 0; i < comments.length; i++) {
            if (!comments[i].hasOwnProperty('user')) {
                const user = props.users.find(user => user.uid === comments[i].creator);
                if (user) {
                    comments[i].user = user;
                } else {
                    props.fetchUsersData(comments[i].creator, false);
                }
            }
        }
        setComments(comments);
    };

    const renderItem = ({item}) => {
        return (
            <View style={{flexDirection: 'row', margin: 15, alignItems: 'flex-start'}}>
                <Image
                    source={require('../../assets/unknown-user.png')}
                    style={styles.postUserImage}
                />
                <View style={{marginTop: 5, flexDirection: 'row'}}>
                    <View style={{marginRight: 5}}>
                        <Text style={{fontWeight: 'bold'}}>{item?.user?.name}</Text>
                    </View>
                    <Text>{item.text}</Text>
                </View>
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                    <LikePressableIcon
                        liked={false}
                    />
                </View>
            </View>
        );
    };

    const sendComment = async _ => {
        const commentsCollection = collection(firestore, 'posts', props.route.params.uid, 'userPosts', props.route.params.postId, 'comments');
        await addDoc(commentsCollection, {
            creator: getAuth().currentUser.uid,
            text,
            creationTimestamp: serverTimestamp()
        });
        setText('');
        setFetchComments(true);
    };

    return (
        <View style={styles.container}> 
            <FlatList
                style={{backgroundColor: 'white', width: '100%', height: '100%'}}
                numColumns={1}
                horizontal={false}
                data={comments}
                renderItem={renderItem}
            />
            <ScrollView 
                contentContainerStyle={{
                    width: '100%',
                    alignItems: 'flex-end',
                    flexDirection: 'row',
                    padding: 10,
                    backgroundColor: 'white'
                }}
                keyboardDismissMode={'on-drag'}
            >
                <View style={{flex: 1}}>
                    <TextInput
                        placeholder='Add a comment...'
                        onChangeText={text => setText(text)}
                        defaultValue={text}
                        multiline={true}
                        maxLength={400}
                    />
                </View>
                <PressableIcon
                    icon={'send-outline'}
                    iconPressed={'send'}
                    color={'blue'}
                    onPress={sendComment}
                />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-start'
    },
    postUserImage: {
        width: 50,
        height: 50,
        borderRadius: 50,
        margin: 5
    },
});

const mapDispatchProps = dispatch => bindActionCreators({
    fetchUsersData
}, dispatch);

const mapStateToProps = store => ({
    users: store.usersState.users
});

export default connect(mapStateToProps, mapDispatchProps)(Comment);