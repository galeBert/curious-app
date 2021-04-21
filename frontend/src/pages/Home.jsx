import React, { useContext } from 'react'
import { useQuery, gql } from '@apollo/client';
import PostCard from '../Post/PostCard'
import { Skeleton  } from 'antd';
import { UserContext } from './authContext';
import Navbar from '../component/NavBar'

const GET_ALL_POSTS = gql`
    query{
      getPosts{
        id
        text
        owner
        createdAt
        likeCount
        commentCount
      }
    }
`



  
function Home() {

  
  
  const {state, setState} = useContext(UserContext)
  console.log("ini statenya", state);
  
    const { loading, error, data } = useQuery(GET_ALL_POSTS)
    console.log(loading, data);

    let images = [];
  for (let i = 0; i < 3; i++) {
     images.push(<Skeleton avatar paragraph={{ rows: 3 }} style={{marginBottom: 30}} key={i} />) 
  }


    if(error) return <p>Error</p>

    return (
        <div>
          <Navbar />
          {loading ? images : <PostCard posts={data? data.getPosts : data  } token={state.token} loading={loading}/>}
        </div>
    )
}

export default Home