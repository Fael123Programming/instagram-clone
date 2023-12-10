import { getDoc, getDocs, doc, collection, query, orderBy } from "firebase/firestore";
import { firestore } from "../../firebaseConfig";
import { getAuth } from "firebase/auth";
import { USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE } from "../constants";

export function fetchUser() {
    return ((dispatch) => {
        const docRef = doc(firestore, 'users', getAuth().currentUser.uid);
        getDoc(docRef)
            .then((snapshot) => {
                if (snapshot.exists) {
                    const userData = snapshot.data();
                    dispatch({type: USER_STATE_CHANGE, currentUser: userData});
                } else {
                    console.log('User does not exist');
                }
            });
    });
}

export function fetchUserPosts() {
    return (dispatch => {
        const userPostsCollection = collection(firestore, 'posts', getAuth().currentUser.uid, 'userPosts');
        const theQuery = query(userPostsCollection, orderBy('creationTimestamp'));
        getDocs(theQuery)
            .then(snapshot => {
                if (!snapshot.empty) {
                    const posts = snapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return {id, ...data};
                    });
                    dispatch({type: USER_POSTS_STATE_CHANGE, posts});
                } else {
                    console.log('There are not any post for the current user');
                }
            });
    });
}
