const { AuthenticationError } = require('apollo-server-express');
const { admin, db } = require('./admin')

module.exports = async (context) => {
    const authHeader = context.req.headers.authorization;
    console.log(authHeader);

    if(authHeader){
        //Bearer [token]
        const token = authHeader.split('Bearer ')[1]

        if(token){
        try {
            let user;
                await admin.auth().verifyIdToken(token)
                    .then(decodedToken => {
                        user = decodedToken
                        return db.collection('users').where("id", "==", user.uid).get()
                    })
                    .then(data => {
                        user.username = data.docs[0].data().username
                    })
    
                return user
            
        }
        catch(err){
            console.log(err);
            throw new AuthenticationError(err)
        }
    }
    throw new Error('Authorization header harus berformat "Bearer [token}')
}
throw new Error('Authorization Bearer tidak Ditemukan')
}
