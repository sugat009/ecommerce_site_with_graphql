import React from 'react';
import {graphql} from "react-apollo";
import {gql} from "apollo-boost";
import {flowRight} from "lodash";

import CartIcon from "./cart-icon.component";

const TOGGLE_CART_HIDDEN = gql`
    mutation ToggleCartHidden {
        toggleCartHidden @client
    }
`;

const GET_ITEM_COUNT = gql`
    {
        itemCount @client
    }
`;

const CartIconContainer = ({data: {itemCount}, toggleCartHidden}) => {
    return (
        <CartIcon toggleCartHidden={toggleCartHidden} itemCount={itemCount}/>
    );
};

// Using this HOC pattern as opposed to the component nesting patter for a cleaner code
// NOTE: apollo team discontinued their compose() function so, flowRight() function from
// Lodash package is being used which is similar
// The graphql() function takes in the mutation or query and gives them as props to the
// wrapping component
// The query output is given as {data:}
// whereas the mutation is given not as the name mentioned in the mutation definition but
// as mutate so below code needes a configuration to change the name to our preferred name
export default flowRight(
    graphql(GET_ITEM_COUNT),
    graphql(TOGGLE_CART_HIDDEN, {name: 'toggleCartHidden'})
)(CartIconContainer);
