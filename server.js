var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
type Query {
  quoteOfTheDay: String
  random: Float!
  rollDice(numDice: Int!, numSides: Int): [Int]
}
`);

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
type RandomDie {
  numSides: Int!
  rollOnce: Int!
  roll(numRolls: Int!): [Int]
}

type Mutation {
  setMessage(message: String): String
}

type Query {
  getDie(numSides: Int): RandomDie
}
`);

// This class implements the RandomDie GraphQL type
class RandomDie {
  constructor(numSides) {
    this.numSides = numSides;
  }

  rollOnce() {
    return 1 + Math.floor(Math.random() * this.numSides);
  }

  roll({ numRolls }) {
    var output = [];
    for (var i = 0; i < numRolls; i++) {
      output.push(this.rollOnce());
    }
    return output;
  }
}

// The root provides the top-level API endpoints
var root = {
  getDie: function ({ numSides }) {
    return new RandomDie(numSides || 6);
  },
  setMessage: function ({message}) {
    console.log(message);
    return true;
  },
}

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');