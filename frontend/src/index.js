import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { setContext } from 'apollo-link-context'

// Importing styles
import './index.css'

// Importing components
import App from './App'

const  authLink = setContext(() => {
  const token = localStorage.getItem('tokeeen');
  
  return {
    headers: {
      Authorization: token ?  `Bearer ${token}` : ''
    }
  }
})

const httpLink = from([
  new HttpLink({ uri: 'http://localhost:5000/curios-app-albert/us-central1/graphql' })
])
const client = new ApolloClient({
  link:  authLink.concat(httpLink),
  cache: new InMemoryCache()
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
)