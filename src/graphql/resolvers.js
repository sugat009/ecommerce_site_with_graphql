import {gql} from "apollo-boost";
import {addItemToCart, clearItemFromCart, getCartItemCount, getCartTotal, removeItemFromCart} from "./cart.utils";

// Extending the type mutation from graphql
// Extending the type Item from graphql backend gives additional properties to the existing object
// Extending mutation gives power to update the local cache or the database
export const typeDefs = gql`
    extend type Item {
        quantity: Int
    }

    extend type DateTime {
        nanoseconds: Int!
        seconds: Int!
    }

    extend type User {
        id: ID!
        displayName: String!
        email: String!
        createdAt: DataTime!
    }

    extend type Mutation {
        ToggleCartHidden: Boolean!,
        AddItemToCart(item: Item!): [Item]!
        SetCurrentUser(user: User!): User!
        RemoveItemFromCart(item: Item!): [Item]!
        ClearItemFromCart(item: Item!): [Item]!
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

const GET_CART_TOTAL = gql`
    {
        cartTotal @client
    }
`;

const GET_CURRENT_USER = gql`
    {
        currentUser @client
    }
`;

const updateCartItemsRelatedQueries = (cache, newCartItems) => {
    // Function that is used for updating cart related items after any update to the cart

    // Updating item count in the cart
    cache.writeQuery({
        query: GET_ITEM_COUNT,
        data: {itemCount: getCartItemCount(newCartItems)}
    });

    // Getting cart total after update to the cart
    cache.writeQuery({
        query: GET_CART_TOTAL,
        data: {cartTotal: getCartTotal(newCartItems)}
    });

    // Get new cart items
    cache.writeQuery({
        query: GET_CART_ITEMS,
        data: {cartItems: newCartItems}
    });
};

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

            updateCartItemsRelatedQueries(cache, newCartItems);

            return newCartItems;
        },
        removeItemFromCart: (_root, {item}, {cache}) => {
            const {cartItems} = cache.readQuery({
                query: GET_CART_ITEMS
            });

            const newCartItems = removeItemFromCart(cartItems, item);

            updateCartItemsRelatedQueries(cache, newCartItems);

            return newCartItems;
        },
        clearItemFromCart: (_root, {item}, {cache}) => {
            const {cartItems} = cache.readQuery({
                query: GET_CART_ITEMS
            });

            const newCartItems = clearItemFromCart(cartItems, item);

            updateCartItemsRelatedQueries(cache, newCartItems);

            return newCartItems;
        },
        setCurrentUser: (_root, {user}, {cache}) => {
            cache.writeQuery({
                query: GET_CURRENT_USER,
                data: {
                    currentUser: user
                }
            });

            return user;
        }
    }
};
