import React, { Component } from 'react';
import { Query } from "react-apollo";
import CartBody from './cartBody.js'
import gql from "graphql-tag";

const FEED_QUERY = gql`
{
  pizzaSizes {
    name
    maxToppings
    toppings {
      pizzaSize {
        name
      }
      topping {
        name
        price
      }
      defaultSelected
    }
    basePrice
  }
}
`

const Cart = () => (
  <Query
    query={FEED_QUERY}
  >
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;

      return (
        <CartBody pizza={data.pizzaSizes}/>
      )
    }}
  </Query>
);

export default Cart