const { ApolloServer, gql } = require('apollo-server')
// const { v1: uuid } = require('uuid')

const Author = require('./models/author')
const Book = require('./models/book')

const mongoose = require('mongoose')

const MONGO_URI = `mongodb+srv://fullstack:rinald085@cluster0.hozjg.mongodb.net/library-app?retryWrites=true&w=majority`

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch(error => {
    console.log('Error connection to MongoDB:', error.message)
  })

const typeDefs = gql`
  type Author {
    id: ID!
    name: String!
    born: Int
    bookCount: Int!
  }

  type Book {
    id: ID!
    title: String!
    author: Author!
    published: Int!
    genres: [String!]!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String = null, genre: String = null): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addAuthor(name: String!): Author
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    editAuthor(name: String!, setBornTo: Int!): Author
  }
`

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: () => Book.find({}).populate('author'),
    allAuthors: () => Author.find({}),
  },
  Author: {
    bookCount: root => Book.find({ author: root }).countDocuments(),
  },
  Mutation: {
    addAuthor: (_, args) => {
      const author = new Author({ ...args, bookCount: 0 })
      return author.save()
    },
    addBook: async (_, { author, ...args }) => {
      const _author = await Author.find({ name: author })
      console.log(_author)

      const book = new Book({ ...args, author: _author[0]._id })
      return book.save()
    },
    editAuthor: (_, { name, setBornTo: born }) => {
      const author = authors.find(author => author.name === name)

      if (!author) {
        return null
      }

      const updatedAuthor = { ...author, born }
      authors = authors.map(author =>
        author.name === name ? updatedAuthor : author
      )

      return updatedAuthor
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
