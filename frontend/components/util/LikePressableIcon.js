import React, { useState } from 'react';
import {
    Pressable
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { firestore } from '../../firebaseConfig';
import { getAuth } from 'firebase/auth';
import { doc, deleteDoc, setDoc } from 'firebase/firestore';

export default function LikePressableIcon(props) {
    const [liked, setLiked] = useState(props.liked);
    const [icon, setIcon] = useState(props.liked ? 'cards-heart' : 'heart-outline');
    const [color, setColor] = useState(props.liked ? 'red' : 'gray');

    const dislike = async _ => {
        await deleteDoc(doc(firestore, 'posts', props.uid, 'userPosts', props.postId, 'likes', getAuth().currentUser.uid));
    };

    const like = async _ => {
        await setDoc(doc(firestore, 'posts', props.uid, 'userPosts', props.postId, 'likes', getAuth().currentUser.uid), {});
    };

    return (
        <Pressable
            onPress={async () => {
                if (liked) {
                    await dislike();
                } else {
                    await like();
                }
                setIcon(liked ? 'heart-outline' : 'cards-heart');
                setColor(liked ? 'gray' : 'red');
                setLiked(!liked);
            }}
        >
            <MaterialCommunityIcons
                name={icon} 
                color={color} 
                size={26}
            />
        </Pressable>
    );
}