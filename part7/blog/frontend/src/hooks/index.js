import axios from 'axios';
import { useEffect, useState } from 'react';

export const useField = (type) => {
  const [value, setValue] = useState('');

  const onChange = (event) => {
    setValue(event.target.value);
  };

  return {
    type,
    value,
    onChange,
  };
};

export const useResource = (baseUrl) => {
  const [resources, setResources] = useState(null);
  useEffect(() => {
    const getResource = async () => {
      try {
        const response = await axios.get(baseUrl);
        const data = response.data;
        setResources(data);
      } catch (error) {
        console.log('error :>> ', error);
      }
    };
    getResource();
  }, []);

  const create = async (resource) => {
    const response = await axios.post(baseUrl, resource);
    setResources(resources.concat(response.data));
    return response.data;
  };
  const likeBlog = async (id) => {
    const toLike = { ...resources };
    const liked = {
      ...toLike,
      likes: (toLike.likes || 0) + 1,
      user: toLike.user.id,
    };
    console.log('liked :>> ', liked);

    const update = async (id, newObject) => {
      try {
        const response = await axios.put(baseUrl, newObject);
        return response.data;
      } catch (error) {
        console.log('error :>> ', error);
      }
    };

    const byLikes = (b1, b2) => (b2.likes > b1.likes ? 1 : -1);

    update(liked.id, liked).then((updatedBlog) => {
      // notify(`you liked '${updatedBlog.title}' by ${updatedBlog.author}`);
      // const updatedBlogs = resources
      //   .map((b) => (b.id === id ? updatedBlog : b))
      //   .sort(byLikes);
      setResources(updatedBlog);
    });
  };

  const addComment = async (resource) => {
    const response = await axios.post(`${baseUrl}/comments`, resource);
    setResources(response.data);
    return response.data;
  };
  const service = {
    create,
    likeBlog,
    addComment,
  };

  return [resources, service];
};
