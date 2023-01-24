import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useResource } from '../hooks';

const BlogInfo = () => {
  const id = useParams().id;
  const input = useRef();
  const [blogInfo, blogInfoService] = useResource(
    `http://localhost:3003/api/blogs/${id}`
  );

  if (!blogInfo) {
    return null;
  }

  const handleComment = (comment) => {
    blogInfoService.addComment({ comment });
  };

  console.log('blogInfo :>> ', blogInfo);
  return (
    <div>
      <h2>{blogInfo.title}</h2>
      <a href={blogInfo.url}>{blogInfo.url}</a>
      <br />
      {`${blogInfo.likes} likes`}
      <button onClick={() => blogInfoService.likeBlog(blogInfo.id)}>
        like
      </button>
      <br />
      {`added by ${blogInfo.user.name}`}
      <div>
        <br />
        <b>comments</b>
        <br />
        <input ref={input} />
        <button
          onClick={(e) => {
            handleComment(input.current.value);
          }}
        >
          add comment
        </button>
        <ul>
          {blogInfo.comments.map((comment) => {
            return <li>{comment}</li>;
          })}
        </ul>
      </div>
    </div>
  );
};

export default BlogInfo;
