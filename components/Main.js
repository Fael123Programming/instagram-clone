import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { 
    fetchUser, 
    fetchUserPosts, 
    fetchFollowingUsers, 
    clearData 
} from '../redux/actions';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import FeedScreen from './main/Feed';
import SearchScreen from './main/Search';
import ProfileScreen from './main/Profile';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getAuth } from 'firebase/auth';

const Tab = createMaterialBottomTabNavigator();

const EmptyScreen = () => null;

export class Main extends Component {
    componentDidMount() {
        this.props.clearData();
        this.props.fetchUser();
        this.props.fetchUserPosts();
        this.props.fetchFollowingUsers();
    }

    render() {
        return (
            <Tab.Navigator initialRouteName='Feed' labeled={false}>
                <Tab.Screen 
                    name={'Feed'} 
                    component={FeedScreen}
                    options={
                        {
                            tabBarIcon: ({color, size}) => (
                                <MaterialCommunityIcons name={'home'} color={color} size={26}/>
                            )
                        }
                    }
                />
                <Tab.Screen 
                    name={'Search'} 
                    component={SearchScreen}
                    options={
                        {
                            tabBarIcon: ({color, size}) => (
                                <MaterialCommunityIcons name={'magnify'} color={color} size={26}/>
                            )
                        }
                    }
                />
                <Tab.Screen 
                    name={'MainAdd'} 
                    component={EmptyScreen}
                    options={
                        {
                            tabBarIcon: ({color, size}) => (
                                <MaterialCommunityIcons name={'plus-box'} color={color} size={26}/>
                            )
                        }
                    }
                    listeners={({navigation}) => ({
                        tabPress: event => {
                            event.preventDefault();
                            navigation.navigate('Add');
                        }
                    })}
                />
                <Tab.Screen 
                    name={'Profile'} 
                    props={this.props}
                    component={ProfileScreen}
                    options={
                        {
                            tabBarIcon: ({color, size}) => (
                                <MaterialCommunityIcons name={'account-circle'} color={color} size={26}/>
                            )
                        }
                    }
                    listeners={({navigation}) => ({
                        tabPress: event => {
                            event.preventDefault();
                            navigation.navigate('Profile', { uid: getAuth().currentUser.uid });
                        }
                    })}
                />
            </Tab.Navigator>
        );
    }
}

const mapDispatchProps = dispatch => bindActionCreators({
    clearData,
    fetchUser, 
    fetchUserPosts, 
    fetchFollowingUsers
}, dispatch);

const mapStateToProps = store => ({
    currentUser: store.userState.currentUser
});

export default connect(mapStateToProps, mapDispatchProps)(Main);