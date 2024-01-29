const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList } = require('graphql');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'your_db_user',
  host: 'localhost',
  database: 'website_monitoring',
  password: 'your_db_password',
  port: 5432,
});

const WebsiteType = new GraphQLObjectType({
  name: 'Website',
  fields: () => ({
    id: { type: GraphQLString },
    url: { type: GraphQLString },
    status: { type: GraphQLString },
    lastCheckedAt: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    websites: {
      type: new GraphQLList(WebsiteType),
      resolve: async () => {
        const result = await pool.query('SELECT * FROM websites');
        return result.rows;
      },
    },
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
});

const app = express();

app.use('/graphql', graphqlHTTP({ schema, graphiql: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
