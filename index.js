const express = require("express");
const { graphqlHTTP, graphqlExpress } = require("express-graphql");
const schema = require("./schema");
const { ApolloServer, gql } = require("apollo-server-express");
const fetch = require("node-fetch");

const typeDefs = gql`
    type Person {
        facilityId: Int
        exposureId: Int
        facility: Facility
        exposure: Exposure
    }
    type Facility {
        loanDuration: Int
        loanDurationType: String
    }
    type Exposure {
        monthlyPayment: Int
    }
    type Query {
        person(id: Int): Person
    }
    type Mutation {
        person(id: Int): Person
    }
`;

const resolvers = {
    Query: {
        person: (parent, args, context, info) => {
            return fetch(`http://localhost:3000/person/${args.id}`).then((res) => res.json());
        },
    },

    Mutation: {
        person: (parent, args, context, info) => {
            return fetch(`http://localhost:3000/person/${args.id}`).then((res) => res.json());
        },
    },

    Person: {
        exposure(parent) {
            return fetch(`http://localhost:3000/exposure/${parent.exposureId}`).then((res) => res.json());
        },
        facility(parent) {
            return fetch(`http://localhost:3000/facility/${parent.facilityId}`).then((res) => res.json());
        },
    },
};

const apollo = new ApolloServer({ typeDefs, resolvers });

const app = express();

apollo.applyMiddleware({ app });

app.use(
    "/graphql",
    graphqlHTTP({
        schema,
        graphiql: true,
    })
);

app.listen(4100, () => {
    console.log("Server is running on port 4100..");
});
