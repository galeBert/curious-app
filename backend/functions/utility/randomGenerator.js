const { db } = require('./admin')
const { benda, warna, adj} = require('./database')

module.exports = async (postId, username) => {
    let bendanya = benda[Math.floor(Math.random() * Math.floor(51))]
    let warnanya = warna[Math.floor(Math.random() * Math.floor(30))];
    let adjnya = adj[Math.floor(Math.random() * Math.floor(50))];
    console.log("wdwdwd",bendanya, warnanya);
    let generateName = `${adjnya} ${warnanya.nama} ${bendanya}`


    const imageUrl = `https://firebasestorage.googleapis.com/v0/b/curios-app-albert.appspot.com/o/random-avatar%2F${bendanya}.png?alt=media`;

    let dataDisp;

    let commentList = db
        .collection(`/posts/${postId}/comments`)
        .where('owner', '==', username)
        .limit(1)

    try {
        let object = {}
        await commentList.get()
            .then(data => {
                data.forEach(doc => {
                     return dataDisp = doc.data()
                })
                if (data.empty) {
                        object.displayName = generateName
                        object.photoProfile = imageUrl
                        object.colorCode = warnanya.warna
                    
                } else {
                    object.displayName = dataDisp.displayName
                    object.photoProfile = dataDisp.photoProfile
                    object.colorCode = dataDisp.colorCode
                }
            })

        return object

    }
    catch (err) {
        console.log(err);
        throw new Error(err)
    }
} 