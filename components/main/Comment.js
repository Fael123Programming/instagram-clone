import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Button,
    TextInput
} from 'react-native';
import { firestore } from '../../firebaseConfig';
import { 
    collection,
    getDocs
} from 'firebase/firestore';

export default function Comment(props) {
    const [comments, setComments] = useState([]);
    const [postId, setPostId] = useState('');
    const [text, setText] = useState('');

    useEffect(() => {
        if (props.route.params.postId !== postId) {
            const commentsCollection = collection(firestore, 'posts', props.route.params.uid, props.route.params.postId, 'comments');
            const theQuery = query(commentsCollection, orderBy('creationTimestamp'));
            getDocs(theQuery)
                .then(snapshot => {
                    let comments = snapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return {id, ...data};
                    });
                    setComments(comments);
                    setPostId(props.route.params.postId);
                });
        }
    }, [props.route.params.postId]);

    const renderItem = ({item}) => {
        return <View>
            <Text>{item.text}</Text>
        </View>
    };

    return (
    <View style={styles.container}> 
        <FlatList
            numColumns={1}
            horizontal={false}
            data={comments}
            renderItem={renderItem}
        />
    </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
