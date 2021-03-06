import React, { useEffect, useState } from 'react';

import './FileList.css';

const FileList = (props) => {
  const {
    wvInstance,
    togglePageSplitModal,
    setCurrentDoc,
    currentDoc,
    fileList,
  } = props;

  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    if (wvInstance) {
      setLoading(false);
    }
  }, [ wvInstance ]);

  const inputDirectory = '/files/';

  if (loading) {
    return <div>Loading...</div>
  }

  const handleOnClick = (fileName) => {
    wvInstance.loadDocument(`${inputDirectory}${fileName}.pdf`);
    setCurrentDoc(`${fileName}.pdf`);
  };

  return (
    <div id='file-list'>
      <div>Current: {currentDoc}</div>
      {
        fileList.map((fileName, idx) => (
          <div
            className='filename'
            key={`file_${idx}`}
            onClick={() => handleOnClick(fileName)}
          >
            {`${fileName}.pdf`}
          </div>
        ))
      }
      <button onClick={() => togglePageSplitModal(true)}>Split Pages</button>
    </div>
  );
};

export default FileList;
