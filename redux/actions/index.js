import { 
    getDoc, 
    getDocs, 
    doc, 
    collection, 
    query, 
    orderBy, 
    onSnapshot 
} from "firebase/firestore";
import { firestore } from "../../firebaseConfig";
import { getAuth } from "firebase/auth";
import { 
    USER_STATE_CHANGE, 
    USERS_STATE_CHANGE, 
    USER_POSTS_STATE_CHANGE,
    USERS_POSTS_STATE_CHANGE, 
    FOLLOWING_USERS_STATE_CHANGE,
    CLEAR_DATA
} from "../constants";

export function fetchUser() {
    return dispatch => {
        const docRef = doc(firestore, 'users', getAuth().currentUser.uid);
        getDoc(docRef)
            .then(snapshot => {
                if (snapshot.exists) {
                    const userData = snapshot.data();
                    dispatch({type: USER_STATE_CHANGE, currentUser: userData});
                }
            });
    };
}

export function fetchUserPosts() {
    return dispatch => {
        const userPostsCollection = collection(firestore, 'posts', getAuth().currentUser.uid, 'userPosts');
        const theQuery = query(userPostsCollection, orderBy('creationTimestamp'));
        onSnapshot(theQuery, snapshot => {
            const posts = snapshot.docs.map(doc => {
                const data = doc.data();
                const id = doc.id;
                return {id, ...data};
            });
            dispatch({type: USER_POSTS_STATE_CHANGE, posts});
        });
        // getDocs(theQuery)
        //     .then(snapshot => {
        //         if (!snapshot.empty) {
        //             const posts = snapshot.docs.map(doc => {
        //                 const data = doc.data();
        //                 const id = doc.id;
        //                 return {id, ...data};
        //             });
        //             dispatch({type: USER_POSTS_STATE_CHANGE, posts});
        //         }
        //     });
    };
}

export function fetchFollowingUsers() {
    return dispatch => {
        const followingUsersCollection = collection(firestore, 'following', getAuth().currentUser.uid, 'userFollowing');
        const theQuery = query(followingUsersCollection);
        onSnapshot(theQuery, snapshot => {
            const following = snapshot.docs.map(doc => doc.id);
            dispatch({ type: FOLLOWING_USERS_STATE_CHANGE, following });
            for (let i = 0; i < following.length; i++) {
                dispatch(fetchUsersData(following[i]));
            }
        });
    };
}

export function fetchUsersData(uid, shouldGetUserPosts=true) {
    return (dispatch, getState) => {
        const found = getState().usersState.users.some(el => el.uid === uid);
        if (!found) {
            const docRef = doc(firestore, 'users', uid);
            getDoc(docRef)
                .then(snapshot => {
                    if (snapshot.exists) {
                        const user = snapshot.data();
                        user.uid = snapshot.id;
                        dispatch({type: USERS_STATE_CHANGE, user});
                    }
                });
            if (shouldGetUserPosts) {
                dispatch(fetchUsersFollowingPosts(uid));
            }
        }
    };
}

export function fetchUsersFollowingPosts(uid) {
    return (dispatch, getState) => {
        const userPostsCollection = collection(firestore, 'posts', uid, 'userPosts');
        const theQuery = query(userPostsCollection, orderBy('creationTimestamp'));
        getDocs(theQuery)
            .then(snapshot => {
                if (!snapshot.empty) {
                    const user = getState().usersState.users.find(el => el.uid === uid);
                    const posts = snapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return {id, ...data, user};
                    });
                    dispatch({type: USERS_POSTS_STATE_CHANGE, posts, uid});
                }
            });
    };
}

export function clearData() {
    return dispatch => {
        dispatch({type: CLEAR_DATA});
    };
}