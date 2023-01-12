import { useState } from 'react';

function Blog({ blog, likeBlog, currentUsername, removeBlog }) {
  const [isVisible, setIsVisible] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };
  const addLike = () => {
    likeBlog(blog);
  };
  const deleteBlog = () => {
    const confirm = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}`
    );
    console.log('confirm :>> ', confirm);
    if (confirm) {
      removeBlog(blog.id);
    }
  };
  return (
    <div className="blog" style={blogStyle}>
      {blog.title} {!isVisible ? blog.author : ''}{' '}
      <button type="button" onClick={toggleVisibility}>
        {!isVisible ? 'view' : 'hide'}
      </button>
      {isVisible && (
        <div>
          <br />
          {blog.url}
          <br />
          likes {blog.likes}{' '}
          <button id="likes" type="button" onClick={addLike}>
            likes
          </button>
          <br />
          {blog.author}
        </div>
      )}
      {blog.users[0] && blog.users[0].username === currentUsername && (
        <button type="button" onClick={deleteBlog}>
          remove
        </button>
      )}
    </div>
  );
}

function AddBlog({ createBlog }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const addBlog = (event) => {
    event.preventDefault();
    createBlog({
      title,
      author,
      url,
    });
    setTitle('');
    setAuthor('');
    setUrl('');
  };
  return (
    <form onSubmit={addBlog}>
      <div>
        title:
        <input
          type="text"
          value={title}
          id="title"
          placeholder="enter title"
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        author:
        <input
          type="text"
          value={author}
          id="author"
          placeholder="enter author"
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        url:
        <input
          type="text"
          value={url}
          id="url"
          placeholder="enter url"
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <div>
        <button id="create" type="submit">
          create
        </button>
      </div>
    </form>
  );
}
export default Blog;
export { AddBlog };
