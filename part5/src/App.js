import { useEffect, useRef, useState } from 'react';
import Blog, { AddBlog } from './components/Blog';
import Login from './components/Login';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import blogService from './services/blogs';
import loginService from './services/login';

function App() {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    blogService.getAll().then((allBlogs) => setBlogs(allBlogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const currentUser = JSON.parse(loggedUserJSON);
      setUser(currentUser);
      blogService.setToken(currentUser.token);
    }
  }, []);

  const notify = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleUsernameChange = (event) => {
    // console.log(event.target.value);
    console.log('changing username');
    setUsername(event.target.value);
  };
  const handlePasswordChange = (event) => {
    // console.log(event.target.value);
    console.log('changing password');
    setPassword(event.target.value);
  };
  const handleLogin = async (event) => {
    event.preventDefault();
    console.log('logging in with', username, password);

    try {
      const currentUser = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(currentUser)
      );

      blogService.setToken(currentUser.token);
      setUser(currentUser);
      setUsername('');
      setPassword('');
      console.log('currentUser :>> ', currentUser);
    } catch (exception) {
      console.log('exception :>> ', exception);
      notify('wrong credentials', 'alert');
    }
  };
  const handleLogout = (event) => {
    event.preventDefault();
    window.localStorage.removeItem('loggedBlogappUser');
    blogService.setToken(null);
    setUser(null);
  };
  const blogFormRef = useRef();

  const createBlog = async (newBlog) => {
    try {
      const response = await blogService.create(newBlog);
      setBlogs(blogs.concat(response));

      notify(`a new blog ${response.title} by ${response.author} added`);
      blogFormRef.current.toggleVisibility();
    } catch (exception) {
      console.log('exception :>> ', exception);
      notify('fill out all required fields', 'alert');
    }
  };
  const likeBlog = async (blogToUpdate) => {
    try {
      const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 };
      const response = await blogService.put(updatedBlog);
      setBlogs(
        blogs.map((blog) =>
          blog.id !== updatedBlog.id
            ? blog
            : { ...blog, likes: response.likes, users: response.users }
        )
      );
    } catch (exception) {
      console.log('exception :>> ', exception);
    }
  };

  const removeBlog = (id) => {
    blogService.deleteId(id);
    setBlogs(blogs.filter((blog) => blog.id !== id));
  };

  return (
    <div>
      {!user ? (
        <>
          <h2>log in to application</h2>
          <Notification notification={notification} />
          <Login
            username={username}
            password={password}
            changeUsername={handleUsernameChange}
            changePassword={handlePasswordChange}
            submitForm={handleLogin}
          />
        </>
      ) : (
        <>
          <h2>blogs</h2>
          <Notification notification={notification} />

          <p>
            {user.name} logged-in{' '}
            <button type="submit" onClick={handleLogout}>
              logout
            </button>{' '}
          </p>
          <Togglable buttonLabel="create blog" ref={blogFormRef}>
            <h2>create new</h2>
            <AddBlog createBlog={createBlog} />
          </Togglable>
          <br />
          {blogs
            .sort((a, b) => (a.likes < b.likes ? 1 : -1))
            .map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                likeBlog={likeBlog}
                currentUsername={user.username}
                removeBlog={removeBlog}
              />
            ))}
        </>
      )}
    </div>
  );
}

export default App;
