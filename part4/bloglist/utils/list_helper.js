const dummy = _blogs => {
  return 1
}

const totalLikes = blogs => {
  const likes = blogs.reduce((_likes, blog) => _likes + blog.likes, 0)

  return likes
}

const favoriteBlog = blogs => {
  if (blogs.length === 0) {
    return {}
  }

  let favoriteBlog = blogs[0]

  for (const blog of blogs) {
    if (blog.likes > favoriteBlog.likes) {
      favoriteBlog = blog
    }
  }

  let { _id, __v, url, ...favorite } = favoriteBlog

  return favorite
}

const mostBlogs = blogs => {
  if (blogs.length === 0) {
    return { author: '', blogs: 0 }
  }

  const authors = {}
  for (const blog of blogs) {
    if (blog.author in authors) {
      authors[blog.author] += 1
    } else {
      authors[blog.author] = 1
    }
  }

  const authorWithMostBlogs = Object.keys(authors).reduce((a, b) =>
    authors[a] > authors[b] ? a : b
  )

  return { author: authorWithMostBlogs, blogs: authors[authorWithMostBlogs] }
}

const mostLikes = blogs => {
  if (blogs.length === 0) {
    return { author: '', likes: 0 }
  }

  const authors = {}
  for (const blog of blogs) {
    if (blog.author in authors) {
      authors[blog.author] += blog.likes
    } else {
      authors[blog.author] = blog.likes
    }
  }

  const authorWithMostLikes = Object.keys(authors).reduce((a, b) =>
    authors[a].likes > authors[b].likes ? a : b
  )

  return { author: authorWithMostLikes, likes: authors[authorWithMostLikes] }
}

const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url:
      'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url:
      'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url:
      'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
]

module.exports = {
  blogs,
  dummy,
  mostBlogs,
  mostLikes,
  totalLikes,
  favoriteBlog,
}
