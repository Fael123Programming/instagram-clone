import React, { Component } from 'react';
import { View, Button, TextInput } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { firestore } from '../../firebaseConfig';

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            name: ''
        };
        this.onSignUp = this.onSignUp.bind(this);
    }
  
    onSignUp() {
        const { email, password, name } = this.state;
        createUserWithEmailAndPassword(getAuth(), email, password)
            .then((result) => {
                setDoc(doc(firestore, 'users', getAuth().currentUser.uid), {email, name})
                    .then((result) => {
                        console.log(`New user created: ${email}`);
                        console.log(result);
                    }).catch((error) => console.log(error));
                console.log(result);
            }).catch((error) => console.log(error));
        
    }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <TextInput
                    placeholder='name'
                    onChangeText={(name) => this.setState({name})}
                />
                <TextInput
                    placeholder='email'
                    onChangeText={(email) => this.setState({email})}
                />
                <TextInput
                    placeholder='password'
                    onChangeText={(password) => this.setState({password})}
                    secureTextEntry={true}
                />
                <Button
                    onPress={() => this.onSignUp()}
                    title='Sign Up'
                />
                <Button
                    onPress={() => this.props.navigation.goBack()}
                    title='Back'
                />
            </View>
        );
    }
};