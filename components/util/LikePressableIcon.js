import React, { useState } from 'react';
import {
    Pressable
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function LikePressableIcon(props) {
    const [liked, setLiked] = useState(props.liked);
    const [icon, setIcon] = useState(props.liked ? 'cards-heart' : 'heart-outline');
    const [color, setColor] = useState(props.liked ? 'red' : 'gray');

    return (
        <Pressable
            onPress={() => {
                setIcon(liked ? 'heart-outline' : 'cards-heart');
                setColor(liked ? 'gray' : 'red');
                setLiked(!liked);
                // Save to database and refresh app state.
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