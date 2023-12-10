import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity
} from 'react-native';
import { firestore } from '../../firebaseConfig';
import { collection, where, query, getDocs } from 'firebase/firestore';

export default function Search({navigation}) {
    const [users, setUsers] = useState([]);

    const fetchUsers = searchString => {
        const usersCollection = collection(firestore, 'users');
        const matchedNamesQuery = query(usersCollection, where('name', '>=', searchString));
        getDocs(matchedNamesQuery).then(snapshot => {
            let users = snapshot.docs.map(doc => {
                const data = doc.data();
                const id = doc.id;
                return {id, ...data};
            });
            setUsers(users);
        })
    };

    const visitUserProfile = uid => {
        navigation.navigate('Profile', {uid: uid});
    };

    const renderItem = ({item}) => (
        <TouchableOpacity
            onPress={_ => visitUserProfile(item.id)}
        >
            <Text>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={{flex: 1, margin: 10}}>
            <TextInput
                placeholder='Type a name...'
                onChangeText={fetchUsers}
            />
            <FlatList
                numColumns={1}
                horizontal={false}
                data={users}
                renderItem={renderItem}
            />
        </View>
    )
}
