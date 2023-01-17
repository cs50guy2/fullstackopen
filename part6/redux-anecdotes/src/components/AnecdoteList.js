import { connect, useDispatch, useSelector } from "react-redux";
import { addVote } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";
import Filter from "./Filter";

const AnecdoteList = (props) => {
  const anecdotes = useSelector(({ anecdotes, notification }) => anecdotes);
  const filter = useSelector(({ anecdotes, notification, filter }) => filter);
  const dispatch = useDispatch();
  const vote = (id) => {
    console.log("vote", id);
    // dispatch(addVote(id));
    props.addVote(id);
  };
  const notify = (content) => {
    // dispatch(setNotification(`you voted '${content}'`, 3));
    props.setNotification(`you voted '${content}'`, 3);
  };
  const byVotes = (a, b) => (a.votes < b.votes ? 1 : -1);
  const obj = [...props.anecdotes].sort(byVotes);

  return (
    <>
      <h2>Anecdotes</h2>
      <Filter />
      {obj
        .filter((anecdote) =>
          props.filter ? anecdote.content.includes(props.filter) : true
        )
        .map((anecdote) => (
          <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
              has {anecdote.votes}
              <button
                onClick={() => {
                  vote(anecdote.id);
                  notify(anecdote.content);
                }}
              >
                vote
              </button>
            </div>
          </div>
        ))}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    anecdotes: state.anecdotes.filter((anecdote) =>
      state.filter ? anecdote.content.includes(state.filter) : true
    ),
    // notification: state.notification,
    // filter: state.filter,
  };
};

const mapDispatchToProps = { addVote, setNotification };

const ConnectedAnecdoteList = connect(
  mapStateToProps,
  mapDispatchToProps
)(AnecdoteList);
export default ConnectedAnecdoteList;
