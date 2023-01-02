const _ = require('lodash');

const dummy = () => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => total + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  const maxLikes = blogs.reduce(
    (mostLikes, blog) => (blog.likes > mostLikes ? blog.likes : mostLikes),
    0
  );
  return blogs
    .map((blog) => ({
      title: blog.title,
      author: blog.author,
      likes: blog.likes,
    }))
    .find((blog) => maxLikes === blog.likes);
};

const mostBlogs = (blogs) => {
  const uniqueAuthors = _.uniqBy(blogs, 'author').map((blog) => blog.author);
  const blogsPerAuthor = uniqueAuthors.map(author => ({ author, blogs: blogs.filter(blog => blog.author === author).length }));

  const maxBlogCount = blogsPerAuthor.reduce(
    (count, author) => Math.max(author.blogs, count),
    0
  );
  return blogsPerAuthor.find(blog => blog.blogs === maxBlogCount);
};

const mostLikes = (blogs) => {
  const uniqueAuthors = _.uniqBy(blogs, 'author').map((blog) => blog.author);
  const likesPerAuthor = uniqueAuthors.map(author => ({ author, likes: blogs.filter(blog => blog.author === author).reduce((count, blog) => count + blog.likes,0) }));

  return likesPerAuthor.reduce((popularAuthor, author) => author.likes > popularAuthor.likes ? author : popularAuthor ,{ author: 'zero', likes: 0 });


};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
};
