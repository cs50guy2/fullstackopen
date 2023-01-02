const blogRouter = require('express').Router();
const Blog = require('../models/blogs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const middleware = require('../utils/middleware');


blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('users',{ username: 1, name: 1 });
  response.json(blogs);
});

blogRouter.post('/', middleware.userExtractor, async (request, response) => {
  // const decodedToken = jwt.verify(request.token, process.env.SECRET);
  // if (!decodedToken.id) {
  //   return response.status(401).json({ error: 'token missing or invalid' });
  // }
  // const user = await User.findById(decodedToken.id);
  const user = request.user;
  console.log('user :>> ', user);

  const blog = new Blog({ ...request.body,users:user._id.toString() });
  const result = await blog.save();

  user.blogs = user.blogs.concat(blog._id);
  await user.save();

  response.status(201).json(result);
  // .catch((error) => console.log('error :>> ', error));
});

blogRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  // const decodedToken = jwt.verify(request.token, process.env.SECRET);
  // if (!decodedToken.id) {
  //   return response.status(401).json({ error: 'token missing or invalid' });
  // }
  // const user = await User.findById(decodedToken.id);

  const user = request.user;
  // await Blog.findByIdAndRemove(request.params.id);
  console.log('user :>> ', user);
  const blog = await Blog.findById(request.params.id);
  console.log('blog :>> ', blog);

  if ( blog && blog.users.toString() === user._id.toString() ) {
    await blog.remove();
    response.status(204).end();
  } else {
    response.status(401).send({ error: 'unable to delete post, user id is not the owner' });
    // throw new Error('unable to delete post, user id doesn\'t match author');

  }
});

blogRouter.put('/:id', async (request, response) => {
  // const blog = new Blog(request.body);
  const blog =   {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes
  };

  const result = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
    runValidators: true,
    context: 'query',
  });
  response.json(result);
});

module.exports = blogRouter;
