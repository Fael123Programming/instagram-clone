import React, { useState } from 'react';
import {
    Pressable
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function PressableIcon(props) {
    const [icon, setIcon] = useState(props.icon);
    const [color, setColor] = useState('gray');

    return (
        <Pressable
            onPress={props.onPress}
            onPressIn={_ => {
                setIcon(props.iconPressed);
                setColor(props.color);
            }}
            onPressOut={_ => {
                setIcon(props.icon);
                setColor('gray');
            }}
        >
            <MaterialCommunityIcons 
                name={icon} 
                color={color} 
                size={26}
            />
        </Pressable>
    );
};