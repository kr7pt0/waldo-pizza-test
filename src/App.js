import React, { Component } from 'react';

import { default as ApolloClient } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import Cart from './Cart'

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


const cache = new InMemoryCache();
const link = new HttpLink({
  uri: 'https://core-graphql.dev.waldo.photos/pizza'
})

const client = new ApolloClient({
  cache,
  link
})

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div className="container">
          <Cart/>
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
