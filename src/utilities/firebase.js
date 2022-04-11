import { initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref, set } from 'firebase/database';
import { useState, useEffect } from 'react';
import { getAuth, GoogleAuthProvider, onIdTokenChanged, signInWithPopup, signOut } from 'firebase/auth';



const firebaseConfig = {
    apiKey: "AIzaSyBmRj0QKgu0Gb3noSVLPb44FHpeyzE5q2Y",
    authDomain: "cs394-tutorial-4f9ed.firebaseapp.com",
    databaseURL: "https://cs394-tutorial-4f9ed-default-rtdb.firebaseio.com",
    projectId: "cs394-tutorial-4f9ed",
    storageBucket: "cs394-tutorial-4f9ed.appspot.com",
    messagingSenderId: "1088485096993",
    appId: "1:1088485096993:web:f713b464ff29cc24002d60",
    measurementId: "G-PJG0NPZ8FT"
  };

const firebase = initializeApp(firebaseConfig);
const database = getDatabase(firebase);
export const signInWithGoogle = () => {
  signInWithPopup(getAuth(firebase), new GoogleAuthProvider());
};

export const useUserState = () => {
  const [user, setUser] = useState();

  useEffect(() => {
    onIdTokenChanged(getAuth(firebase), setUser);
  }, []);

  return [user];
};

// export const useUserState = () => useAuthState(firebase.auth());
const firebaseSignOut = () => signOut(getAuth(firebase));

export { firebaseSignOut as signOut };


export const setData = (path, value) => (
    set(ref(database, path), value)
  );
export const useData = (path, transform) => {
        const [data, setData] = useState();
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState();
      
        useEffect(() => {
          const dbRef = ref(database, path);
          const devMode = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
          if (devMode) { console.log(`loading ${path}`); }
          return onValue(dbRef, (snapshot) => {
            const val = snapshot.val();
            if (devMode) { console.log(val); }
            setData(transform ? transform(val) : val);
            setLoading(false);
            setError(null);
          }, (error) => {
            setData(null);
            setLoading(false);
            setError(error);
          });
        }, [path, transform]);
      
        return [data, loading, error];
      };