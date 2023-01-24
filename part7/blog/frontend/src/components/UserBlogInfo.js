import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useResource } from '../hooks';

const UserBlogInfo = () => {
  const id = useParams().id;
  const [userBlogs, userBlogsService] = useResource(
    `http://localhost:3003/api/users/${id}`
  );

  // if (userBlogs.length === 0) {
  //   return null;
  // }
  if (!userBlogs) {
    return null;
  }

  console.log('userBlogs :>> ', userBlogs);
  return (
    <div>
      <h2>{userBlogs.name}</h2>
      <b>added blogs</b>
      <List>
        {userBlogs.blogs.map((blog) => {
          return (
            // <li key={blog.id}>{blog.title}</li>
            <ListItem key={blog.id} component="div" disablePadding>
              <ListItemButton>
                <ListItemText primary={blog.title} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </div>
  );
};

export default UserBlogInfo;
