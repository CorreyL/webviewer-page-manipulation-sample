import React, { useEffect, useState } from 'react';

import './FileList.css';

const FileList = (props) => {
  const { wvInstance } = props;

  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    if (wvInstance) {
      setLoading(false);
    }
  }, [ wvInstance ]);

  const inputDirectory = '/files/';
  const fileList = [
    'demo',
    'PDFTRON_about',
    'quote',
  ];

  if (loading) {
    return <div>Loading...</div>
  }

  const handleOnClick = (fileName) => {
    wvInstance.loadDocument(`${inputDirectory}${fileName}.pdf`);
  };

  return (
    <div id='file-list'>
      {
        fileList.map((fileName, idx) => (
          <div
            key={`file_${idx}`}
            onClick={() => handleOnClick(fileName)}
          >
            {`${fileName}.pdf`}
          </div>
        ))
      }
    </div>
  );
};

export default FileList;
