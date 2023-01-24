import { Container } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import BlogInfo from './components/BlogInfo';
import BlogList from './components/BlogList';
import LoginForm from './components/LoginForm';
import Notification from './components/Notification';
import UserBlogInfo from './components/UserBlogInfo';
import UserList from './components/UserList';

import blogService from './services/blogs';
import loginService from './services/login';
import userService from './services/user';

import { setBlogs } from './reducers/blogsReducer';
import { removeMessage, setMessage } from './reducers/notificationReducer';
import { setUser } from './reducers/userReducer';

import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';

const App = () => {
  const user = useSelector(({ blogs, notification, user }) => user);
  const dispatch = useDispatch();

  const byLikes = (b1, b2) => (b2.likes > b1.likes ? 1 : -1);

  useEffect(() => {
    blogService
      .getAll()
      .then((blogs) => dispatch(setBlogs(blogs.sort(byLikes))));
  }, []);

  useEffect(() => {
    const userFromStorage = userService.getUser();
    if (userFromStorage) {
      dispatch(setUser(userFromStorage));
    }
  }, []);

  const login = async (username, password) => {
    loginService
      .login({
        username,
        password,
      })
      .then((user) => {
        dispatch(setUser(user));
        userService.setUser(user);
        notify(`${user.name} logged in!`);
      })
      .catch(() => {
        notify('wrong username/password', 'alert');
      });
  };

  const notify = (message, type = 'info') => {
    dispatch(setMessage({ message, type }));
    setTimeout(() => {
      dispatch(removeMessage());
    }, 5000);
  };

  const logout = () => {
    dispatch(setUser(null));
    userService.clearUser();
    notify('good bye!');
  };

  if (user === null) {
    return (
      <>
        <Notification />
        <LoginForm onLogin={login} />
      </>
    );
  }
  const CurrentUserInfo = () => {
    return (
      <div>
        <Link to={'/blog'}>blog</Link> <Link to={'/user'}>user</Link>{' '}
        {user.name} logged in
        <button onClick={logout}>logout</button>
      </div>
    );
  };
  return (
    <Container>
      <div>
        <Router>
          <h2>blogs</h2>
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <Notification />
                  <CurrentUserInfo />
                  <BlogList />
                </div>
              }
            />
            <Route
              path="/blog"
              element={
                <div>
                  <Notification />
                  <CurrentUserInfo />
                  <BlogList />
                </div>
              }
            />
            <Route
              path="/user"
              element={
                <div>
                  <CurrentUserInfo />
                  <UserList />
                </div>
              }
            />
            <Route
              path="/user/:id"
              element={
                <div>
                  <CurrentUserInfo />
                  <UserBlogInfo />
                </div>
              }
            />
            <Route
              path="/blog/:id"
              element={
                <div>
                  <CurrentUserInfo />
                  <BlogInfo />
                </div>
              }
            />
          </Routes>
        </Router>
      </div>
    </Container>
  );
};

export default App;
