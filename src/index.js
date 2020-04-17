import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {ApolloProvider} from "react-apollo";
import {createHttpLink} from "apollo-link-http";
import {InMemoryCache} from "apollo-cache-inmemory";
import {ApolloClient} from "apollo-boost";

import {persistor, store} from './redux/store';
import {resolvers, typeDefs} from "./graphql/resolvers";
import {default as data} from "./graphql/initial-data";

import './index.css';
import {default as App} from "./App/App.container";

// To create a connection to Backend
const httpLink = createHttpLink({
    uri: "https://crwn-clothing.com"
});

// For caching
const cache = new InMemoryCache();

// For client
const client = new ApolloClient({
    link: httpLink,
    cache,
    typeDefs,
    resolvers
});

client.writeData({
    data
});

ReactDOM.render(
    <ApolloProvider client={client}>
        <Provider store={store}>
            <BrowserRouter>
                <PersistGate persistor={persistor}>
                    <App/>
                </PersistGate>
            </BrowserRouter>
        </Provider>
    </ApolloProvider>,
    document.getElementById('root')
);
