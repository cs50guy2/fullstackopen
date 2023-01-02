const { last } = require('lodash');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);


const Blog = require('../models/blogs');
const User = require('../models/user');
const helper = require('./test_helper');


const getUserToken = async (username, password) => {
  const newLogin =   {
    username,
    password
  };
  const response = await api
    .post('/api/login')
    .send(newLogin)
    .expect(200);
  const token = response.body.token;
  return token;
};


beforeEach(async () => {
  await Blog.deleteMany({});

  const user = await User.findOne({});

  for await ( const blog of helper.initialBlogs) {
    await helper.newBlog(user, blog);
  }
});

describe('when there is initially some blogs saved', () => {
  test('correct number of notes are returned as json', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  }, 100000);
  test('id property exists', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    response.body.forEach(element => {
      expect(element.id).toBeDefined();
    });
  });
});

describe('when saving new blog post', () => {
  test('length of blogs is incremented by 1', async () => {
    const newPost = {
      'title': 'Adventures of Harry',
      'author': 'harry poooter',
      'url': 'https://example.com',
      'likes': 4,
    };

    const token = await getUserToken('abcd', 'asdf');
    await api
      .post('/api/blogs')
      .auth(token, { type:'bearer' } )
      .send(newPost)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
  });
  test('without the like property, it defaults to 0', async () => {
    const newPost = {
      'title': 'Adventures of Harry',
      'author': 'harry poooter',
      'url': 'https://example.com',
    };
    const token = await getUserToken('abcd', 'asdf');

    const response = await api
      .post('/api/blogs')
      .auth(token, { type:'bearer' } )
      .send(newPost)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    expect(response.body.likes).toEqual(0);
  });
  test('title property is required', async () => {
    const newPost = {
    // 'title': 'Adventures of Harry',
      'author': 'harry poooter',
      'url': 'https://example.com',
    };
    const token = await getUserToken('abcd', 'asdf');

    await api
      .post('/api/blogs')
      .auth(token, { type:'bearer' } )
      .send(newPost)
      .expect(400);
  // expect(response.body.likes).toEqual(0);
  });
  test('author property is required', async () => {
    const newPost = {
      'title': 'Adventures of Harry',
      // 'author': 'harry poooter',
      'url': 'https://example.com',
    };
    const token = await getUserToken('abcd', 'asdf');
    await api
      .post('/api/blogs')
      .auth(token, { type:'bearer' } )
      .send(newPost)
      .expect(400);
  // expect(response.body.likes).toEqual(0);
  });
});

describe('when deleting a blog post with a token', () => {
  test('correct number of notes are returned as json', async () => {
    const blog = await helper.blogsInDb();
    const lastBlogId = blog.slice(-1)[0].id;

    // console.log('blog :>> ', blog);
    // console.log('lastBlogId :>> ', lastBlogId);
    const token = await getUserToken('root', 'sekret');
    // console.log('token :>> ', token);
    const response = await api
      .delete(`/api/blogs/${lastBlogId}`)
      .auth(token, { type:'bearer' } )
      .expect(204);
    const remainingBlogs = await helper.blogsInDb();

    expect(remainingBlogs).toHaveLength(helper.initialBlogs.length -1);
    remainingBlogs.forEach((ele) => {
      expect(ele).not.toHaveProperty('id', lastBlogId);

    });
  });
}, 100000);
describe('when deleting a blog post without a token', () => {
  test('correct number of notes are returned as json', async () => {
    const blog = await helper.blogsInDb();
    const lastBlogId = blog.slice(-1)[0].id;


    const response = await api
      .delete(`/api/blogs/${lastBlogId}`)
      .expect(401);
    const remainingBlogs = await helper.blogsInDb();

    expect(remainingBlogs).toHaveLength(helper.initialBlogs.length);
  });
}, 100000);


describe('when updating a blog post', () => {
  test('200 status code is returned and field properly updated', async () => {
    const blog = await helper.blogsInDb();
    const lastBlogId = blog.slice(-1)[0].id;
    const updatedPost = {
      'title': 'Adventures of Tom and Jerry',
      'author': 'wb',
      'url': 'https://abc.com',
      'likes': 1
    };
    // console.log('blog :>> ', blog);
    // console.log('lastBlogId :>> ', lastBlogId);

    const response = await api.put(`/api/blogs/${lastBlogId}`)
      .send(updatedPost)
      .expect(200);
    expect(response.body.title).toEqual('Adventures of Tom and Jerry');
    expect(response.body.likes).toBe(1);

  });

}, 100000);

afterAll(() => {
  mongoose.connection.close();
});