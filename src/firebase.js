import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage, ref } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD2UNYtoVj9gLHFtmR3hiDJu0Y3ZmX3TpQ",
  authDomain: "design-blog-bd8e4.firebaseapp.com",
  databaseURL:
    "https://design-blog-bd8e4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "design-blog-bd8e4",
  storageBucket: "design-blog-bd8e4.appspot.com",
  messagingSenderId: "349155623906",
  appId: "1:349155623906:web:750c9b3110e845cf682fbb",
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage();
export const storageRef = ref(storage);
export const db = getDatabase(app);
export const auth = getAuth();
