import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

// firebase init
const config = {
    apiKey: "AIzaSyCexHIXYI_K9860XAwFEsLDXriCAneA0Gk",
    authDomain: "wargamesgif.firebaseapp.com",
    databaseURL: "https://wargamesgif.firebaseio.com",
    projectId: "wargamesgif",
    storageBucket: "wargamesgif.appspot.com",
    messagingSenderId: "691948399965"
}
firebase.initializeApp(config)

// firebase utils
const firestore = firebase.firestore
const db = firebase.firestore()
const auth = firebase.auth()
const currentUser = auth.currentUser
//console.log(messaging)

// date issue fix according to firebase
// const settings = {
//     timestampsInSnapshots: true
// }
// db.settings(settings)

// firebase collections
const usersCollection = db.collection('users')
const gifsCollection = db.collection('gifs')

export {
    firestore,
    db,
    auth,
    currentUser,
    usersCollection,
    gifsCollection
}
