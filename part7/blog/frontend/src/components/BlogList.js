import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { appendBlogs, setBlogs } from '../reducers/blogsReducer';
import { removeMessage, setMessage } from '../reducers/notificationReducer';
import blogService from '../services/blogs';
import Blog from './Blog';
import NewBlogForm from './NewBlogForm';
import Togglable from './Togglable';

const BlogList = () => {
  const user = useSelector(({ blogs, notification, user }) => user);
  const blogs = useSelector(({ blogs, notification, user }) => blogs);
  const dispatch = useDispatch();

  const blogFormRef = useRef();
  const byLikes = (b1, b2) => (b2.likes > b1.likes ? 1 : -1);

  const likeBlog = async (id) => {
    const toLike = blogs.find((b) => b.id === id);
    const liked = {
      ...toLike,
      likes: (toLike.likes || 0) + 1,
      user: toLike.user.id,
    };

    blogService.update(liked.id, liked).then((updatedBlog) => {
      notify(`you liked '${updatedBlog.title}' by ${updatedBlog.author}`);
      const updatedBlogs = blogs
        .map((b) => (b.id === id ? updatedBlog : b))
        .sort(byLikes);
      dispatch(setBlogs(updatedBlogs));
    });
  };

  const removeBlog = (id) => {
    const toRemove = blogs.find((b) => b.id === id);

    const ok = window.confirm(
      `remove '${toRemove.title}' by ${toRemove.author}?`
    );

    if (!ok) {
      return;
    }

    blogService.remove(id).then(() => {
      const updatedBlogs = blogs.filter((b) => b.id !== id).sort(byLikes);
      dispatch(setBlogs(updatedBlogs));
    });
  };
  const notify = (message, type = 'info') => {
    dispatch(setMessage({ message, type }));
    setTimeout(() => {
      dispatch(removeMessage());
    }, 5000);
  };

  const createBlog = async (blog) => {
    blogService
      .create(blog)
      .then((createdBlog) => {
        notify(
          `a new blog '${createdBlog.title}' by ${createdBlog.author} added`
        );
        dispatch(appendBlogs(createdBlog));
        blogFormRef.current.toggleVisibility();
      })
      .catch((error) => {
        notify('creating a blog failed: ' + error.response.data.error, 'alert');
      });
  };
  return (
    <>
      <Togglable buttonLabel="new note" ref={blogFormRef}>
        <NewBlogForm onCreate={createBlog} />
      </Togglable>

      <div id="blogs">
        {blogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            likeBlog={likeBlog}
            removeBlog={removeBlog}
            user={user}
          />
        ))}
      </div>
    </>
  );
};

export default BlogList;
