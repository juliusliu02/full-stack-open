const Book = require("./models/book");
const Author = require("./models/author");
const { GraphQLError } = require("graphql/error");
const User = require("./models/user");
const jwt = require("jsonwebtoken");
const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

const resolvers = {
  Author: {
    bookCount: (root) => root.books.length,
  },
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (args.genre) {
        return Book.find({
          genres: args.genre,
        }).populate("author");
      }
      return Book.find({}).populate("author");
    },
    allAuthors: async () => {
      return Author.find({});
    },
    me: (root, args, context) => context.currentUser,
    allGenres: async (root, args) => {
      const allBooks = await Book.find({});
      let genres = [];
      allBooks.map((book) => {
        genres = genres.concat(book.genres);
      });
      return Array.from(new Set(genres));
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      let author;
      try {
        author = await Author.findOne({ name: args.author });
        if (!author) {
          author = new Author({ name: args.author });
          await author.save();
        }
      } catch (error) {
        throw new GraphQLError("Saving author failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.author,
            error,
          },
        });
      }

      const book = new Book({
        title: args.title,
        author: author,
        genres: args.genres,
        published: args.published,
      });

      try {
        await book.save();
      } catch (error) {
        throw new GraphQLError("Saving book failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.title,
            error,
          },
        });
      }

      try {
        await Author.findByIdAndUpdate(author._id, {
          books: author.books.concat(book),
        });
      } catch (error) {
        throw new GraphQLError("Update author failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.author,
            error,
          },
        });
      }

      pubsub.publish("BOOK_ADDED", { bookAdded: book });

      return book;
    },

    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      return Author.findOneAndUpdate(
        { name: args.name },
        { born: args.setBornTo },
        {
          new: true,
          runValidators: true,
        },
      );
    },

    createUser: async (root, args) => {
      const user = new User({ ...args });

      return user.save().catch((err) => {
        throw new GraphQLError("Creating the user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
            error,
          },
        });
      });
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator("BOOK_ADDED"),
    },
  },
};

module.exports = resolvers;
