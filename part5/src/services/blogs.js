import axios from 'axios';

const baseUrl = '/api/blogs';

let token = null;

const setToken = (newToken) => {
  token = `bearer ${newToken}`;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = async (newObject) => {
  const config = { headers: { Authorization: token } };
  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const deleteId = async (id) => {
  const config = { headers: { Authorization: token } };
  const response = await axios.delete(`${baseUrl}/${id}`, config);
  return response.data;
};

const put = async (newObject) => {
  const config = { headers: { Authorization: token } };

  const updatedBlog = {
    user: newObject.users[0].id,
    likes: newObject.likes,
    author: newObject.author,
    title: newObject.title,
    url: newObject.url,
  };
  const response = await axios.put(
    `${baseUrl}/${newObject.id}`,
    updatedBlog,
    config
  );
  return response.data;
};

export default { setToken, getAll, create, put, deleteId };
