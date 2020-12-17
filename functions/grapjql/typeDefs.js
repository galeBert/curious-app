const gql = require('graphql-tag')

module.exports = gql`
    type Post {
        id: ID!
        owner: String!
        text: String!
        createdAt: String!
        commentCount: Int!
        likeCount: Int!
        comments: [Comment]
    }
    type User {
        id: ID!
        username: String!
        email: String!
        createdAt: String!
        profilePicture: String
        token: String!
    }
    type Comment {
        id: ID!
        createdAt: String!
        owner: String!
        text: String!
    }

    type Query {
        getPosts: [Post]!
        getPost(id: String!): Post!
    }
    input RegisterInput {
        username: String!
        password: String!
        confirmPassword: String!
        email: String!
    }

    type Mutation {
        #users mutation
    registerUser(registerInput: RegisterInput ): User!
    login(username: String!, password:String! ): User!

    createPost(text: String!): Post!
    deletePost(id: ID!): String!
    likePost(postId: ID!): Post!

    createComment(postId: ID!, text: String!): Comment!
    deleteComment(postId: ID!, commentId: ID!): String!

}
`