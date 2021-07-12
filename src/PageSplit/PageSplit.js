import React from 'react';

import './PageSplit.css';

const PageSplit = (props) => {
  const { handleClose, show } = props;
  const showHideClassName = show
    ? 'block'
    : 'none';

  return (
    <div className={`modal display-${showHideClassName}`}>
      <section className='modal-main'>
        <div>
          <input type='text'/>
        </div>
        <div>
          <button type='button' onClick={handleClose}>
            Close Modal
          </button>
        </div>
      </section>
    </div>
  );
};

export default PageSplit;
