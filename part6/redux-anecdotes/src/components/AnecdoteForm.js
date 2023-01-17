import { useRef } from "react";
import { connect, useDispatch } from "react-redux";
import { createAnecdote } from "../reducers/anecdoteReducer";

const AnecdoteForm = (props) => {
  const dispatch = useDispatch();
  const input = useRef();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const content = input.current.value;
    console.log("create anecdote", content);
    // dispatch(createAnecdote(content));
    props.createAnecdote(content);
  };

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input ref={input} />
        </div>
        <button>create</button>
      </form>
    </>
  );
};

const mapDispatchToProps = {
  createAnecdote,
};

export default connect(null, mapDispatchToProps)(AnecdoteForm);
