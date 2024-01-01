/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const logger = require("firebase-functions/logger");
const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");
const {onDocumentCreated, onDocumentDeleted} = require("firebase-functions/v2/firestore");
const { ServerValue } = require("firebase-admin/database");

initializeApp();

exports.addLike = onDocumentCreated('/posts/{creatorId}/userPosts/{postId}/likes/{userId}', async (event) => {
    await getFirestore()
    .collection('posts')
    .doc(event.params.creatorId)
    .collection('userPosts')
    .doc(event.params.postId)
    .update({
        likesCount: ServerValue.increment(1)
    });
});

exports.removeLike = onDocumentDeleted('/posts/{creatorId}/userPosts/{postId}/likes/{userId}', async (event) => {
    await getFirestore()
    .collection('posts')
    .doc(event.params.creatorId)
    .collection('userPosts')
    .doc(event.params.postId)
    .update({
        likesCount: ServerValue.increment(-1)
    });
});