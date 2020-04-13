import {gql} from "apollo-boost";
import {addItemToCart, getCartItemCount} from "./cart.utils";

// Extending the type mutation from graphql
// Extending the type Item from graphql backend gives additional properties to the existing object
// Extending mutation gives power to update the local cache or the database
export const typeDefs = gql`
    extend type Item {
        quantity: Int
    }
    extend type Mutation {
        ToggleCartHidden: Boolean!,
        AddItemToCart(Item: Item!): [Item]!
    }
`;

// @client specifies that the data is to be fetched from local
// Getting cart hidden status from local cache
const GET_CART_HIDDEN = gql`
    {
        cartHidden @client
    }
`;

// Getting cart items from local cache
const GET_CART_ITEMS = gql`
    {
        cartItems @client
    }
`;

// Getting cart item count from cartItems in the local cache
const GET_ITEM_COUNT = gql`
    {
        itemCount @client
    }
`;

export const resolvers = {
    Mutation: {
        toggleCartHidden: (_root, _args, {cache}) => {
            // Getting the current value of hidden
            const {cartHidden} = cache.readQuery({
                query: GET_CART_HIDDEN
            });

            // Similar to that of setState
            // Writing the opposite of current hidden into the cache
            cache.writeQuery({
                query: GET_CART_HIDDEN,
                data: {cartHidden: !cartHidden}
            });

            return !cartHidden;
        },
        addItemToCart: (_root, {item}, {cache}) => {
            // First get the cart items from current cache
            const {cartItems} = cache.readQuery({
                query: GET_CART_ITEMS
            });

            const newCartItems = addItemToCart(cartItems, item);

            // Updating item count in the cart
            cache.writeQuery({
                query: GET_ITEM_COUNT,
                data: {
                    itemCount: getCartItemCount(newCartItems)
                }
            });

            // Writing to local cache
            cache.writeQuery({
                query: GET_CART_ITEMS,
                data: {
                    cartItems: newCartItems
                }
            });
        }
    }
};
