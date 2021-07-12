import React from 'react';

import './FileList.css';

const FileList = () => {
  const inputDirectory = '/files/';
  const fileList = [
    'demo',
    'PDFTRON_about',
    'quote',
  ];

  return (
    <div id='file-list'>
      {
        fileList.map((fileName, idx) => (
          <div
            key={`file_${idx}`}
          >
            {`${fileName}.pdf`}
          </div>
        ))
      }
    </div>
  );
};

export default FileList;
