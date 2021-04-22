const gql = require('graphql-tag')

module.exports = gql`
    type Post {
        id: ID
        owner: String
        text: String
        media: [PhotoList]
        createdAt: String
        position: Object
        commentCount: Int
        likeCount: Int
        likes: [Like]
        comments: [Comment]
        muted: [Muted]
    }
    type PhotoList {
        url: String
    }
    input PhotoListInput {
        url: String
    }

    type Object {
        latitude: Float
        longtitude: Float
    }
    type User {
        id: ID!
        username: String!
        email: String!
        createdAt: String
        profilePicture: String
        birthday: String
        mobileNumber: String
        gender: String
        token: String!
    }
    type Like {
        id: ID!
        owner: String!
        createdAt: String!
    }
    type Muted {
        id: ID!
        owner: String!
        createdAt: String!
        postId: ID!
    }
    type Comment {
        id: ID!
        createdAt: String!
        owner: String!
        text: String!
        displayName: String
        photoProfile: String
        colorCode: String
    }
    type Query {
        getPosts: [Post]!
        getPost(id: String!): Post!
        getMutedPosts(postId: String!): Post!
    }

        input RegisterInput {
        username: String!
        password: String!
        birthday: String
        gender: String
        mobileNumber: String
        email: String!
    }

    input Coordinate {
        latitude: Float
        longtitude: Float
    }
    type Mutation {
        #users mutation
    registerUser(registerInput: RegisterInput ): User!
    login(username: String!, password:String! ): User!
    googlecheckDatabase(username: String! ): String!
    googleLogin( 
        displayName:String!
        username: String!
        email: String!
        profilePicture: String!
        mobileNumber: String!
        birthday: String!
        gender: String!
        id: ID!
        token: String!
        ): String!
    
    createPost(text: String, media: [String], position: Coordinate): Post!
    deletePost(id: ID!): String!
    likePost(postId: ID!): Post
    mutePost(postId: ID!): String
    uploadPhoto(photoUrl: String!) : String
    createComment(postId: ID!, text: String!): Comment!
    deleteComment(postId: ID!, commentId: ID!): String!

}
`