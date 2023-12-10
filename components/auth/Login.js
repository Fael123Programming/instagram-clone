import React, { Component } from 'react';
import { View, Button, TextInput } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
        };
        this.onSignIn = this.onSignIn.bind(this);
    }
  
    onSignIn() {
        const { email, password } = this.state;
        signInWithEmailAndPassword(getAuth(), email, password)
            .then((result) => console.log(result))
            .catch((error) => console.log(error));
    }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
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
                    onPress={() => this.onSignIn()}
                    title='Sign In'
                />
                <Button
                    onPress={() => this.props.navigation.goBack()}
                    title='Back'
                />
            </View>
        );
    }
};