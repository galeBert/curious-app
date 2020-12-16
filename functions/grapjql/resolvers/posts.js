const { UserInputError } = require('apollo-server-express')
const { db } = require('../../utility/admin')
const fbAuthContext = require('../../utility/fbAuthContext')

module.exports = {
    Query: {
        async getPosts() {
            const posts = []
            try {
                await db.collection('posts').get()
                    .then(data => {
                        data.forEach(doc => {
                            console.log(doc.data())
                            posts.push({
                                id: doc.data().id,
                                text: doc.data().text,
                                owner: doc.data().owner,
                                createdAt: doc.data().createdAt,
                                likeCount: doc.data().likeCount,
                                commentCount: doc.data().commentCount,
                            })
                        })
                    })

                return posts
            }
            catch (err) {
                console.log(err)
                throw new Error(err)
            }
        },

        async getPosts() {

        }
    },
    Mutation: {
        async createPost(_, { text }, context) {
            const user = await fbAuthContext(context)
            console.log("ini user",user.username);
            // console.log("iniuser",user, "ini context", context);
            if (user) {
                try {
                    const newPost = {
                        owner: user.username,
                        text,
                        createdAt: new Date().toISOString(),
                        likeCount: 0,
                        commentCount: 0
                    }
                    await db.collection('posts').add(newPost)
                        .then(doc => {
                            newPost.id = doc.id
                        })
                        console.log("ini newpost", newPost.id);
                    return newPost
                }
                catch (err) {
                    console.log(err);
                    throw new Error(err)
                }
            }

        },
        async deletePost(_, { id }, context){
            const user = await fbAuthContext(context)
            console.log(user);
            try{
                await db.doc(`/posts/${id}`).get()
                        .then(doc => {
                            if(!doc.exists){
                                throw new UserInputError('Postingan tidak ditemukan')
                            }
                            if(doc.data().owner !== user.username){
                                throw new UserInputError('Unauthorized! Anda menghapus postingan yang bukan milik anda!')
                            } else {
                                 db.doc(`/posts/${id}`).delete()
                            }
                        })
                        return ( "Post Terhapus")
            }
            catch(err){
                console.log(err);
                throw new Error(err)
            }
            
        }
    }
}