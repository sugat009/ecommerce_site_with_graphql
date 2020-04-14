import React from 'react';
import {Query} from "react-apollo";
import {gql} from "apollo-boost";

import Spinner from "../../components/spinner/spinner.component";
import CollectionPage from "./collection.component";

const GET_COLLECTION_BY_TITLE = gql`
    query getCollectionsByTitle($title: String!) {
        getCollectionsByTitle(title: $title) {
            id
            title
            items {
                id
                name
                price
                imageUrl
            }
        }
    }
`;

const CollectionContainer = ({match}) => {
    return (
        <Query
            query={GET_COLLECTION_BY_TITLE}
            variables={{title: match.params.collectionId}}
        >
            {
                ({loading, data}) => {
                    if (loading) return <Spinner/>;
                    const {getCollectionsByTitle} = data;
                    return <CollectionPage collection={getCollectionsByTitle}/>;
                }
            }
        </Query>
    );
};

export default CollectionContainer;
