import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
uri: 'https://your-graphql-endpoint.com/graphql',
cache: new InMemoryCache(),
});