import config from './config'
import firebase from "firebase";
require("firebase/firestore");

class Fire {
    constructor(callback) {
        this.init(callback)
    }

    init(callback) {
        !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                callback(null, user)
            } else {
                firebase.auth().signInAnonymously().catch(error => {
                    console.log('error', error)
                    callback(error)
                })
            }
        })
    }

    getLists = (callback) => {
        let ref = firebase.firestore().collection("users").doc(this.uid).collection("lists")
        this.unsubscribe = ref.onSnapshot(snapshot => {
            lists = []

            snapshot.forEach(doc => {
                lists.push({ id: doc.id, ...doc.data()})
            })

            callback(lists)
        })
    }
    

    uploadPhotoAsync = (uri, filename) => {
        return new Promise(async (res, rej) => {
            const response = await fetch(uri);
            const file = await response.blob();

            let upload = firebase
                .storage()
                .ref(filename)
                .put(file);

            upload.on(
                "state_changed",
                snapshot => {},
                err => {
                    rej(err);
                },
                async () => {
                    const url = await upload.snapshot.ref.getDownloadURL();
                    res(url);
                }
            );
        });
    };

    createUser = async user => {
        let remoteUri = null;

        try {
            await firebase.auth().createUserWithEmailAndPassword(user.email, user.password);

            let db = this.firestore.collection("users").doc(this.uid);

            db.set({
                name: user.name,
                email: user.email,
                avatar: null
            });

            if (user.avatar) {
                remoteUri = await this.uploadPhotoAsync(user.avatar, `avatars/${this.uid}`);

                db.set({ avatar: remoteUri }, { merge: true });
            }
        } catch (error) {
            alert("Error: ", error);
        }
    };

    signOut = () => {
        firebase.auth().signOut();
    };

    get firestore() {
        return firebase.firestore();
    }

    get uid() {
        return (firebase.auth().currentUser || {}).uid;
    }

    get timestamp() {
        return Date.now();
    }

    detach = () => {
        this.unsubscribe()
    }
}

export default Fire;