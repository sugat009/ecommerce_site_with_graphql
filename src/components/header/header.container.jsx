import React from 'react';
import {Query} from "react-apollo";
import {gql} from "apollo-boost";
import Header from "./header.component";

// @client specifies that the data is to be fetched from local
const GET_CART_HIDDEN = gql`
    {
        cartHidden @client
        currentUser @client
    }
`;

const HeaderContainer = () => {
    return (
        <Query query={GET_CART_HIDDEN}>
            {
                ({data: {cartHidden, currentUser}}) => <Header
                    hidden={cartHidden}
                    currentUser={currentUser}
                />
            }
        </Query>
    );
};

export default HeaderContainer;