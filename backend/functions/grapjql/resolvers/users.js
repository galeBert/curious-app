const { UserInputError } = require('apollo-server-express')
const encrypt = require('bcrypt')
const config = require('../../utility/config')
const { db } = require('../../utility/admin')
const firebase = require('firebase')
const { validateRegisterInput, validateLoginInput } = require('../../utility/validator')





module.exports = {
    Mutation: {
        async login(_, { username, password }) {
            const { valid, errors } = validateLoginInput(username, password)
            if (!valid) throw new UserInputError("Errors", { errors })

            let userList = db
                .collection(`users`)
                .where('email', '==', username)
                .limit(1)

            let nama;
            
            try {
                let list;
                await db.doc(`/users/${username}`).get()
                    .then(doc => {
                        if (!doc.exists) {
                            return userList.get()
                                .then(data => {
                                    data.forEach(doc => {
                                        return nama = doc.data().username
                                    })
                                    return db.doc(`/users/${nama}`).get()
                                        .then(doc => {
                                            if (!doc.exists) {
                                                throw new UserInputError('username/email tidak ditemukan', {
                                                    errors: { username: "username/email tidak ditemukan" }
                                                })
                                            } else {
                                                list = doc.data()
                                            }
                                        })
                                })
                        } else {
                            list = doc.data()
                        }
                    })
                    
                    const { email } =  list
                    
                const token = await firebase.auth().signInWithEmailAndPassword(email, password)
                    .then(data => data.user.getIdToken())
                    .then(idToken => idToken)

                return {
                    ...list,
                    token
                }
            }
            catch (err) {
                if (err.code === "auth/wrong-password") {
                    throw new UserInputError("password anda salah!")
                }
                if (err.code === 'auth/invalid-email') {
                    throw new UserInputError("pengguna tidak ditemukan")
                }
                throw new Error(err)
            }
        },
        async googlecheckDatabase(_, { username } ) {
            let isLoggedin = false
                try{
                    await db.doc(`/users/${username}`).get()
                        .then(doc => {
                            if(doc.exists){
                                isLoggedin = true
                            }
                        })

                        return isLoggedin

                } catch(err) {
                    console.log(err);
                }

        },
        async googleLogin(_, args) {
            console.log("masuk backend!",args);
            const { displayName, username, email, profilePicture, mobileNumber, birthday, gender, id} = args
            try{
                let data = {
                    displayName,
                    username,
                    email,
                    profilePicture,
                    mobileNumber,
                    birthday,
                    gender,
                    id,
                    createdAt: new Date().toISOString()
                }
                await db.doc(`/users/${displayName}`).set(data)

                return token
            } catch(err){
                console.log(err);
            }

        },


        async registerUser(_, args, content, info) {
            const { registerInput: { mobileNumber, email, password, gender, birthday, username } } = args;

            console.log(args);

            const { valid, errors } = validateRegisterInput(mobileNumber, email, password, gender, birthday, username)

            if (!valid) throw new UserInputError("Errors", { errors })

            let newUser = {
                username,
                email,
                mobileNumber,
                gender,
                birthday,
                createdAt: new Date().toISOString(),
                profilePicture: "https://firebasestorage.googleapis.com/v0/b/curios-app-albert.appspot.com/o/Blank.jpg?alt=media",
            }

            const hash = await encrypt.hash(password, 12)

            try {
                await db.doc(`users/${username}`).get()
                    .then(doc => {
                        if (doc.exists) {
                            throw new UserInputError("username tidak tersedia")
                        }
                        else return firebase.auth().createUserWithEmailAndPassword(email, password)
                    })
                    .then(data => {
                        newUser.id = data.user.uid
                        return data.user.getIdToken()
                    })
                    .then(idToken => {
                        newUser.token = idToken

                        const saveUserData = {
                            id: newUser.id,
                            username,
                            email,
                            mobileNumber,
                            gender,
                            birthday,
                            createdAt: new Date().toISOString(),
                            profilePicture: newUser.profilePicture,
                            _private: []
                        }
                        saveUserData._private.push({
                            hash,
                            lastUpdate: new Date().toISOString()
                        })

                        return db.doc(`/users/${username}`).set(saveUserData)
                    })
                console.log(newUser);
                return newUser
            }
            catch (err) {
                console.log(err)
                throw new Error(err)
            }
        }
    }
}