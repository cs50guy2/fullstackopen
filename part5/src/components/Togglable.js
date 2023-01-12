import PropTypes from 'prop-types';
import { forwardRef, useImperativeHandle, useState } from 'react';

const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? 'none' : '' };
  const showWhenVisible = { display: visible ? '' : 'none' };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(ref, () => ({
    toggleVisibility,
  }));

  Togglable.propTypes = {
    buttonLabel: PropTypes.string.isRequired,
  };

  Togglable.displayName = 'Toggable';

  return (
    <div>
      <div style={hideWhenVisible}>
        <button type="button" onClick={toggleVisibility}>
          {props.buttonLabel}
        </button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button type="button" onClick={toggleVisibility}>
          cancel
        </button>
      </div>
    </div>
  );
});

export default Togglable;
