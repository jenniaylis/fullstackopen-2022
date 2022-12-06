const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
    {
        author: "Nalle Puh",
        title: "Tarinoita Puolenhehtaarin metsästä",
        url: "www.google.com",
        likes: 8,
        id: 1
      },
      {
        author: "Peter Pan",
        title: "Mikä on Mikä-mikä-maa",
        url: "www.google.com",
        likes: 4,
        id: 2
      },
      {
        author: "muumimamma",
        title: "maailman parhaat pannarit",
        url: "google.com",
        likes: 5,
        id: 3
      },
      {
        author: "teletappi",
        title: "missä on nuunuu",
        url: "google.com",
        likes: 0,
        id: 4
      }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[2])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[3])
    await blogObject.save()
})

// testing that blogs are returned as json
test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

// testing that there is right amount of blog objects
test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
})

test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs')
  const contents = response.body.map(r => r.title)
  expect(contents).toContain(
    'maailman parhaat pannarit'
  )
})

test('identifier is id not _id', async() => {
    const doc = await Blog.findOne({})
    let mykeys = Object.keys(doc.toObject())
    console.log('keys', mykeys) // keys [ '_id', 'title', 'author', 'url', 'likes', '__v' ]

    const dok = await Blog.updateMany( {}, { $rename: { "_id": "id" } } ) // comes with following error: MongoServerError: Performing an update on the path '_id' would modify the immutable field '_id'

    let myNewKeys = Object.keys(dok.toObject())
    console.log('new keys', myNewKeys)

    const response = await api.get('/api/blogs')
    console.log('response',response.body) // these id:s are in format of 'id'
    const identifiers = response.body.map(id => id.id)
    console.log('identifiers', identifiers)
    expect(identifiers).toBeDefined()
})

afterAll(() => {
  mongoose.connection.close()
})