import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import Blog, { AddBlog } from './Blog';

describe('when rendering Blog component', () => {
  const mockHandler = jest.fn();
  const blog = {
    title: 'Adventures of Harry Forever',
    author: 'harry poooter',
    url: 'https://example.com',
    likes: 4,
  };
  blog.users = [{ username: 'testuser2' }];
  const username = 'testuser';

  beforeEach(() => {
    render(
      <Blog
        blog={blog}
        currentUsername={username}
        likeBlog={mockHandler}
        removeBlog={mockHandler}
      />
    );
  });

  it('displays title and author', () => {
    const element = screen.getByText(
      'Adventures of Harry Forever harry poooter'
    );
    expect(element).toBeDefined();
  });

  it('does not display likes', () => {
    const element = screen.queryByText(/likes/i);
    expect(element).toBeNull();
  });
  it('does not display url', () => {
    const element = screen.queryByText(/http/i);
    expect(element).toBeNull();
  });
});
describe('when clicking on view button', () => {
  const mockHandler = jest.fn();
  const blog = {
    title: 'Adventures of Harry Forever',
    author: 'harry poooter',
    url: 'https://example.com',
    likes: 4,
  };
  blog.users = [{ username: 'testuser2' }];
  const username = 'testuser';

  beforeEach(async () => {
    render(
      <Blog
        blog={blog}
        currentUsername={username}
        likeBlog={mockHandler}
        removeBlog={mockHandler}
      />
    );
    const button = screen.getByText('view');
    await userEvent.click(button);
  });
  it('displays likes and urls', async () => {
    const element = screen.getAllByText(/likes/i);
    const element2 = screen.getByText(/http/i);
    expect(element).toBeDefined();
    expect(element2).toBeDefined();
  });
  it('increases likes count twice when clicking on likes button twice', async () => {
    const button = screen.getByText('likes');
    await userEvent.click(button);
    await userEvent.click(button);
    expect(mockHandler.mock.calls).toHaveLength(2);
  });
});
describe('when rendering Addblog component', () => {
  it('submits form with correct details', async () => {
    const createBlog = jest.fn();

    render(<AddBlog createBlog={createBlog} />);
    const inputTitle = screen.getByPlaceholderText('enter title');
    const inputAuthor = screen.getByPlaceholderText('enter author');
    const inputUrl = screen.getByPlaceholderText('enter url');
    const createButton = screen.getByText('create');
    await userEvent.type(inputTitle, 'new title');
    await userEvent.type(inputAuthor, 'new author');
    await userEvent.type(inputUrl, 'http://url.com');
    await userEvent.click(createButton);
    expect(createBlog.mock.calls).toHaveLength(1);
    expect(createBlog.mock.lastCall[0].title).toEqual('new title');
    expect(createBlog.mock.lastCall[0].author).toEqual('new author');
    expect(createBlog.mock.lastCall[0].url).toEqual('http://url.com');
  });
});
