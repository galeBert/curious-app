const { UserInputError } = require('apollo-server-express')
const { db } = require('../../utility/admin')
const fbAuthContext = require('../../utility/fbAuthContext')

module.exports = {
    Mutation: {
        async createComment(_, { postId, text }, context) {
            const { username } = await fbAuthContext(context)

            const postDocument =  db.doc(`/posts/${postId}`)
            const commentDocument = db.collection(`/posts/${postId}/comments`)
            

            if(text.trim() === ''){
                throw new UserInputError("Kamu tidak bisa membuat comment tanpa text")
            }

            try {
                const newComment = {
                    owner: username,                                                              
                    createdAt: new Date().toISOString(),
                    text,
            
                }
    
                await postDocument.get()
                        .then(doc => {
                            if(!doc.exists){
                                throw new UserInputError('Postingan Tidak ditemukan/sudah di hapus')
                            }
                            else {
                                 doc.ref.update( { commentCount: doc.data().commentCount + 1 } );
                                return commentDocument.add(newComment)
                            }
                        })
                        .then(doc => {
                            console.log(doc.id);
                            newComment.id = doc.id
                            doc.update({ id: doc.id })
                        })
                        return newComment
            }
            catch(err){
                console.log(err);
                throw new Error(err)
            }
        },
        async deleteComment(_, {  postId, commentId }, context) {
            const { username } = await fbAuthContext(context)
            const postDocument =  db.doc(`/posts/${postId}`)
            const commentDocument = db.doc(`/posts/${postId}/comments/${commentId}`)
        if(username){
            try{
                let posts;
                await db.doc(`/posts/${postId}`).get()
                .then(doc => {
                    console.log(doc.data());
                    if(!doc.exists){
                        throw new UserInputError('Postingan Tidak ditemukan/sudah dihapus')
                    }
                    else {
                        return commentDocument.get()
                    }
                })
                .then(doc => {
                    if(!doc.exists){
                        throw new UserInputError('comment tidak ditemukan/atau sudah dihapus')
                    }
                    if(doc.data().owner !== username){
                        throw new UserInputError('Unauthorized! Anda menghapus comment yang bukan milik anda!')
                    } else {
                         commentDocument.delete()
                         return postDocument.get()
                    }
                })
                .then(doc => {
                    return doc.ref.update( { commentCount: doc.data().commentCount - 1 } );
                })
                return ( "Comment Terhapus")
            }
            catch(err){
                console.log("ini error", err);
                throw new Error(err)
            }
        }
           
            

        }
    }
}