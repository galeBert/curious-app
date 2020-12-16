const { UserInputError } = require('apollo-server-express')
const encrypt = require('bcrypt')
const config = require('../../utility/config')
const { db } = require('../../utility/admin')
const firebase = require('firebase')
const { validateRegisterInput, validateLoginInput } = require('../../utility/validator')

firebase.initializeApp(config)


module.exports = {
   Mutation : {
    async login(_, { username, password } ){

        const { valid, errors } = validateLoginInput(username, password)
            if(!valid) throw new UserInputError("Errors", { errors })

        try{
            const { id, email, createdAt } = await db.doc(`users/${username}`).get()
                                                .then(doc => {
                                                    if(!doc.exists){
                                                       throw new UserInputError('Username tidak ditemukan', {
                                                        errors : {username: 'username tidak ditemukan'}
                                                       })
                                                    } else {
                                                        return db.data()
                                                    }
                                                })
            const token = await firebase.auth().signInWithEmailAndPassword(email, password)
                            .then( data => data.user.getIdToken() )
                            .then( idToken => idToken)
            
            return {
                username,
                id,
                email,
                createdAt,
                token
            }
        }
        catch(err){
            if(err.code ==="auth/wrong-password"){
                throw new UserInputError("password anda salah!")
            }
            if (err.code === 'auth/invalid-email') {
                throw new UserInputError("pengguna tidak ditemukan")
            }
            throw new Error(err)
        }
       },
    //    async login(_, args){
    //     const { username, password } = args
    //     console.log(username, password);

    //     const { valid, errors } = validateLoginInput(username, password)

    //         if(!valid) throw new UserInputError("Errors", { errors })

    //     let logIn = {
    //         username,
    //     }

    //     try{
    //         await db.doc(`users/${username}`).get()
    //         .then(doc => {
    //             if(!doc.exists){
    //                 return firebase.auth().signInWithEmailAndPassword(username, password)
    //             }
    //             else {
    //                 logIn.createdAt = doc.data().createdAt
    //                 logIn.email = doc.data().email
    //                 logIn.profilePicture = doc.data().profilePicture
    //                 return firebase.auth().signInWithEmailAndPassword(logIn.email, password)
    //             }
    //         })
    //         .then(data => {
    //             logIn.id = data.user.uid
    //             return data.user.getIdToken()
    //         })
    //         .then(idToken => {
    //             logIn.token = idToken
    //         })
    //         console.log(logIn);
    //         return logIn
    //     }
    //     catch(err){
    //         if(err.code ==="auth/wrong-password"){
    //             throw new UserInputError("password anda salah!")
    //         }
    //         if (err.code === 'auth/invalid-email') {
    //             throw new UserInputError("pengguna tidak ditemukan")
    //         }
    //         console.log(err.code)
    //         throw new Error(err)
    //     }
    //    },


       async registerUser( _, args, content, info){
            const { registerInput: { username, email, password, confirmPassword } } = args;

            console.log(username, email, password, confirmPassword);

            //TODO: cek apakah datausers sudah pernah daftar ke fire store
           // TODO: simpan data yang user input ke firestore
            //TODO: daftarkan user dengan data yang diinput ke firestore Auth
            
            //TODO: cek apakan user menginput data dengan benar -> BUat validator function

            const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword)

            if(!valid) throw new UserInputError("Errors", { errors })

            let newUser = {
                username,
                email,
                createdAt: new Date().toISOString(),
                profilePicture: "link ke foto profile",
            }

            const hash = await encrypt.hash(password, 12)

            try {
                await db.doc(`users/${username}`).get()
                    .then(doc => {
                        if(doc.exist){
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
            catch(err){
                console.log(err)
                throw new Error(err)
            }
        }
    }
}