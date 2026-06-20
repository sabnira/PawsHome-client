import { createUserWithEmailAndPassword, FacebookAuthProvider, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { auth } from "../firebase/firebase.config";



// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);



const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const googleProvider = new GoogleAuthProvider()
    const facebookProvider = new FacebookAuthProvider();
    const axiosPublic = useAxiosPublic()


    const createUser = (email, password) => {
        setLoading(true)
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const signIn = (email, password) => {
        setLoading(true)
        return signInWithEmailAndPassword(auth, email, password)
    }

    const signInWithGoogle = () => {
        setLoading(true)
        return signInWithPopup(auth, googleProvider)
    }

    const signInWithFacebook = () => {
        setLoading(true)
        return signInWithPopup(auth, facebookProvider)
    }

    const logOut = async () => {
        setLoading(true)
        return signOut(auth)
    }

    const updateUserProfile = (name, photo) => {
        return updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: photo,
        })
    }



    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);

            // if(currentUser){
            //     //get token and store client
            //     const userInfo = { email: currentUser.email}
            //     axiosPublic.post('jwt', userInfo)
            //     .then(res => {
            //         if(res.data.token) {
            //             localStorage.setItem('access-token', res.data.token)
            //             setLoading(false)
            //         }
            //     })
            // }
            // else{

            //     localStorage.removeItem('access-token')
            //     setLoading(false)
            // }

            // setLoading(false);
        })
        return () => {
            unsubscribe();
        }
    }, [axiosPublic]);


    const authInfo = {
        user,
        setUser,
        loading,
        setLoading,
        createUser,
        signIn,
        signInWithGoogle,
        signInWithFacebook,
        logOut,
        updateUserProfile
    }

    return (
        <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
    );
};

export default AuthProvider;