const { UserInputError } = require('apollo-server-express')
const { db } = require('../../utility/admin')
const fbAuthContext = require('../../utility/fbAuthContext')

const app = require('../../utility/config')


module.exports = {
    Query: {
        async getPosts() {
            try {
            const posts = [];
                await db.collection('posts').orderBy("createdAt").get()
                .then(data => {
                     data.forEach(doc => {
                         posts.push({
                            id: doc.data().id,
                            text: doc.data().text,
                            owner: doc.data().owner,
                            createdAt: doc.data().createdAt,
                            position: {
                                longtitude: doc.data().position.longtitude,
                                latitude: doc.data().position.latitude,
                            },
                            likeCount: doc.data().likeCount,
                            commentCount: doc.data().commentCount,
                          })            
                        })
                    })
                    return posts
            } catch (err) {
                console.log(err)
                    throw new Error(err)
            }
        },
        async getMutedPosts(_, { postId }, context) {
            const posts = []
            const { username } = await fbAuthContext(context)
            const mutedDocument = db.collection(`posts`)
                .where("owner", "==", username)

            try {
                await mutedDocument.get()
                    .then(data => {
                        return data.docs.forEach(doc => {
                            console.log(doc);
                        })
                    })

            } catch (error) {

            }
        },
        async getPost(_, { id }, context) {
            const { username } = await fbAuthContext(context)

            const postDocument = db.doc(`/posts/${id}`)
            const commentCollection = db.collection(`/posts/${id}/comments`)
            const likeCollection = db.collection(`/posts/${id}/likes`)
            if (username) {
                try {
                    let post;

                    await postDocument.get()
                        .then(doc => {
                            if (!doc.exists) {
                                throw new UserInputError('Postingan tidak ditemukan')
                            } else {
                                post = doc.data()
                                post.comments = []
                                post.likes = []

                                return commentCollection.orderBy('createdAt', 'asc').get()
                            }
                        })
                        .then(docs => {
                            docs.forEach(doc => {
                                post.comments.push(doc.data())
                            })
                            return likeCollection.get()
                        })
                        .then(data => {
                            data.forEach(doc => {
                                post.likes.push(doc.data())
                            })
                        })
                    return post
                }
                catch (err) {
                    console.log(err)
                    throw new Error(err)
                }
            }
        }
    },
    Mutation: {
        async uploadPhoto(_, { photoUrl }) {
            try {
                const storageRef = app.storage().ref()
                const fileRef = storageRef.child()
                fileRef.put(photoUrl).then(() => {
                    console.log("file Uploaded!");
                }
                )

                return "berhasil"
            } catch (err) {
                console.log(err);
            }
        },
        async createPost(_, { text, media, position: { latitude, longtitude } }, context) {
            const user = await fbAuthContext(context)

            if (user) {
                try {
                    const newPost = {
                        owner: user.username,
                        text,
                        media,
                        position: {
                            latitude,
                            longtitude,
                        },
                        createdAt: new Date().toISOString(),
                        likeCount: 0,
                        commentCount: 0
                    }
                    await db.collection('posts').add(newPost)
                        .then(doc => {
                            newPost.id = doc.id
                            doc.update({ id: doc.id })
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
        async deletePost(_, { id }, context) {
            const user = await fbAuthContext(context)
            try {
                await db.doc(`/posts/${id}`).get()
                    .then(doc => {
                        if (!doc.exists) {
                            throw new UserInputError('Postingan tidak ditemukan')
                        }
                        if (doc.data().owner !== user.username) {
                            throw new UserInputError('Unauthorized! Anda menghapus postingan yang bukan milik anda!')
                        } else {
                            db.doc(`/posts/${id}`).delete()
                        }
                    })
                return ("Post Terhapus")
            }
            catch (err) {
                console.log(err);
                throw new Error(err)
            }

        },
        async likePost(_, { postId }, context) {
            const { username } = await fbAuthContext(context)
            const postDocument = db.doc(`/posts/${postId}`)
            const likesDocument = db.collection(`/posts/${postId}/likes`)

            try {
                const { isLiked, likeId } = await likesDocument.where("owner", "==", username).limit(1).get()
                    .then(data => {
                        const isLiked = data.empty
                        let likeId = '';

                        if (!data.empty) {
                            likeId = data.docs[0].id
                        }
                        console.log("atas", isLiked, likeId);
                        return {
                            isLiked,
                            likeId
                        }
                    })
                let post;
                await postDocument.get()
                    .then(doc => {
                        if (!isLiked) {
                            doc.ref.update({ likeCount: doc.data().likeCount - 1 })
                            db.doc(`/posts/${postId}/likes/${likeId}`).delete()
                            post = doc.data()
                            post.likeCount--
                        } else {
                            doc.ref.update({ likeCount: doc.data().likeCount + 1 })
                            likesDocument.add({ owner: username, createdAt: new Date().toISOString() })
                                .then(data => {
                                    data.update({ id: data.id })
                                })
                            post = doc.data()
                            post.likeCount++
                        }
                    })
                console.log(post);
                return post

            } catch (err) {
                console.log(err);
                throw new Error(err)
            }
        },
        async mutePost(_, { postId }, context) {
            const { username } = await fbAuthContext(context)
            const postDocument = db.doc(`/posts/${postId}`)
            const muteDocument = db.collection(`/posts/${postId}/muted`)
            let post;

            try {
                const { isMuted, muteId } = await muteDocument.where("owner", "==", username).limit(1).get()
                    .then(data => {
                        const isMuted = data.empty
                        let muteId = '';

                        if (!data.empty) {
                            muteId = data.docs[0].id
                        }
                        console.log("atas", isMuted, muteId);
                        return {
                            isMuted,
                            muteId
                        }
                    })


                await postDocument.get()
                    .then(doc => {
                        if (!isMuted) {
                            db.doc(`/posts/${postId}/muted/${muteId}`).delete()
                        } else {
                            muteDocument.add({ owner: username, createdAt: new Date().toISOString(), postId })
                                .then(data => {
                                    data.update({ id: data.id })
                                })
                        }
                    })
                return "muted gan"

            } catch (error) {

            }


        }
    }
}