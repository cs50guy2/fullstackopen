const Blog = require('../models/blogs');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const initialBlogs = [
  {
    'title': 'Adventures of Harry',
    'author': 'harry poooter',
    'url': 'https://example.com',
    'likes': 4,
  },
  {
    'title': 'Adventures of Harry Returns',
    'author': 'harry poooter',
    'url': 'https://example.com',
    'likes': 4,
  },
  {
    'title': 'Adventures of Harry Forever',
    'author': 'harry poooter',
    'url': 'https://example.com',
    'likes': 4,
  }
];

// const nonExistingId = async () => {
//   const note = new Note({ content: 'willremovethissoon', date: new Date() })
//   await note.save()
//   await note.remove()

//   return note._id.toString()
// }

const blogsInDb = async () => {
  const blogs = await Blog.find({});

  return blogs.map(blog => blog.toJSON());
};
const usersInDb = async () => {
  const users = await User.find({});

  return users.map(user => user.toJSON());
};

const newUser = async (username, name, password) => {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({ username: username, name, passwordHash });
  await user.save();
};

const newBlog = async (user, { title, author, url, likes }) => {

  const blog = new Blog({ title, author, url, likes,users:user._id.toString() });
  await blog.save();

  user.blogs = user.blogs.concat(blog._id);
  await user.save();

};


module.exports = {
  initialBlogs, blogsInDb, usersInDb, newUser, newBlog
};