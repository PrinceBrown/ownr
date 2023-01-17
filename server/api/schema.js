const {
  buildSchema, GraphQLSchema, GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList,
  GraphQLNonNull, GraphQLEnumType, GraphQLInt,
} = require('graphql');

const pool = require('../config/db');

const getCategories = (parent, args, context) => context.pool.query('SELECT category FROM animal_categories')
  .then((res) => res.rows)
  .catch((err) => console.log(err));

const Animals_Categories_Type = new GraphQLObjectType({
  name: 'Animals_Categories',
  fields: () => ({
    id: { type: GraphQLID },
    category: { type: GraphQLString },
  }),
});

const Animal_Photos_Type = new GraphQLObjectType({
  name: 'Animal_Photos',
  fields: () => ({
    id: { type: GraphQLID },
    category_id: { type: GraphQLInt },
    photo_url: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    
    animal_categories: {
      type: new GraphQLList(Animals_Categories_Type),
      async resolve(parent, args, context) {
        try {
          const result = await context.pool.query('SELECT * FROM animal_categories');
          return result.rows;
        } catch (error) {
          console.error(error);
          throw new Error('Error fetching animal categories from the database'); // return an empty array as a default value
        }
      },
    },

    animal_photos_by_category: {
      type: new GraphQLList(Animal_Photos_Type),
      args: {
        category_id: { type: GraphQLInt },
      },
      async resolve(parent, args, context) {
        try {
          const result = await context.pool.query('SELECT * FROM animal_photos WHERE category_id = $1', [args.category_id]);
          return result.rows;
        } catch (error) {
          console.error(error);
          throw new Error('Error fetching animal categories from the database'); // return an empty array as a default value
        }
      },
    },

    animal_photos: {
      type: new GraphQLList(Animal_Photos_Type),
      async resolve(parent, args, context) {
        try {
          const result = await context.pool.query('SELECT * FROM animal_photos');
          return result.rows;
        } catch (error) {
          console.error(error);
          throw new Error('Error fetching animal categories from the database'); // return an empty array as a default value
        }
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
