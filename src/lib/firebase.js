// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  getDoc,
  addDoc,
  serverTimestamp,
  orderBy,
  runTransaction,
  deleteDoc,
  updateDoc,
} from "firebase/firestore/lite";
import { useEffect } from "react";
import useStore from "store";
import shallow from "zustand/shallow";
import { getPostScore, getUpvotePercentage } from "./helpers";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAG-Y2bhX7ox41XO_FuU-GbN7T8JT4RMJs",
  authDomain: "reddit-clone-ab818.firebaseapp.com",
  projectId: "reddit-clone-ab818",
  storageBucket: "reddit-clone-ab818.appspot.com",
  messagingSenderId: "137070986396",
  appId: "1:137070986396:web:95e87fbef5401191475959",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export const getTimestamp = serverTimestamp;

export async function signupUser({ username, email, password }) {
  const userCreds = await createUserWithEmailAndPassword(auth, email, password);
  await createUser({
    user: userCreds.user,
    username,
  });
}

export async function createUser({ user, username }) {
  const userDoc = doc(db, "users", user.uid);
  await setDoc(userDoc, {
    uid: user.uid,
    username,
    email: user.email,
  });
}

export async function checkIfUsernameTaken(username) {
  const col = collection(db, "users");
  const q = query(col, where("username", "==", username));
  const { empty } = await getDocs(q);
  return empty || "Username taken";
}

export function useAuthUser() {
  const [setUser, resetUser] = useStore(
    (s) => [s.setUser, s.resetUser],
    shallow
  );

  useEffect(() => {
    async function getUser(user) {
      if (!user) {
        resetUser();
      } else {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setUser(userDoc.data());
        } else {
          resetUser();
        }
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      getUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, [setUser, resetUser]);
}

export async function logOut() {
  return await signOut(auth);
}

export async function loginUser({ email, password }) {
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function createPost(post) {
  const postsCol = collection(db, "posts");
  const { id } = await addDoc(postsCol, post);
  const postDoc = doc(db, "posts", id);
  const newPost = await getDoc(postDoc);
  return { id, ...newPost.data() };
}

export async function startStream(postId) {
  const id = postId;
  const postDoc = doc(db, "posts", id);
  await updateDoc(postDoc, {
    stream: true,
  });
  const updatePost = await getDoc(postDoc);
  return { id, ...updatePost.data() };
}

export async function stopStream(postId) {
  const id = postId;
  const postDoc = doc(db, "posts", id);
  await updateDoc(postDoc, {
    stream: false,
  });
  const updatePost = await getDoc(postDoc);
  return { id, ...updatePost.data() };
}

export async function getDocuments(ref) {
  const snap = await getDocs(ref);
  const docs = snap.docs.map((doc) => ({
    id: doc.id,
    reference: doc.ref,
    ...doc.data(),
  }));
  return docs;
}

export async function getPost(postId) {
  const postRef = doc(db, "posts", postId);
  const postDoc = await getDoc(postRef);
  return postDoc.exists() ? { id: postDoc.id, ...postDoc.data() } : null;
}

export async function getPosts() {
  const col = collection(db, "posts");
  const q = query(col, orderBy("score", "desc"));
  const posts = await getDocuments(q);
  return posts;
}

export async function getPostsByUsername(username) {
  const col = collection(db, "posts");
  const q = query(col, where("author.username", "==", username));
  const posts = await getDocuments(q);
  return posts;
}

export async function getPostsByCategory(category) {
  const col = collection(db, "posts");
  const q = query(
    col,
    orderBy("score", "desc"),
    where("category", "==", category)
  );
  const posts = await getDocuments(q);
  return posts;
}

export async function deletePost(postId) {
  const docRef = doc(db, "posts", postId);
  const deletedPost = await deleteDoc(docRef);
  return deletedPost;
}

export async function createComment(comment) {
  const col = collection(db, "posts", comment.postId, "comments");
  const newComment = await addDoc(col, comment);
  return newComment;
}

export async function getCommentsByPostId(postId) {
  const col = collection(db, "posts", postId, "comments");
  const q = query(col, orderBy("created", "desc"));
  const comments = await getDocuments(q);
  return comments;
}

export async function deleteComment({ postId, commentId }) {
  const docRef = doc(db, "posts", postId, "comments", commentId);
  const deletedDoc = await deleteDoc(docRef);
  return deletedDoc;
}

export async function addView(postId) {
  const postRef = doc(db, "posts", postId);
  await runTransaction(db, async (transaction) => {
    const postDoc = await transaction.get(postRef);
    if (postDoc.exists()) {
      const newViewCount = postDoc.data().views + 1;
      transaction.update(postRef, { views: newViewCount });
    }
  });
}

export async function getCommentCount(postId) {
  const col = collection(db, "posts", postId, "comments");
  const { size } = await getDocs(col);
  return size;
}

export async function toggleVote(vote) {
  const { postId, userId, value } = vote;
  const postRef = doc(db, "posts", postId);
  await runTransaction(db, async (transaction) => {
    const postDoc = await transaction.get(postRef);
    if (postDoc.exists()) {
      const votes = { ...postDoc.data().votes };
      const isUnvote = votes[userId] === value;
      if (isUnvote) {
        delete votes[userId];
      } else {
        votes[userId] = value;
      }
      const upvotePercentage = getUpvotePercentage(votes);
      const score = getPostScore(votes);
      transaction.update(postRef, { votes, score, upvotePercentage });
    }
  });
}

export async function createSafe(user, safeaddress) {
  const usersafe = collection(db, "users", user.uid);
  const newSafe = usersafe.update(safeaddress);
  return newSafe;
}