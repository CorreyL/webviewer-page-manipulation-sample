import React, { useRef, useEffect, useState } from 'react';
import WebViewer from '@pdftron/webviewer';
import FileList from './FileList/FileList';
import PageSplit from './PageSplit/PageSplit';
import './App.css';

const App = () => {
  const viewer = useRef(null);

  const [ wvInstance, setWvInstance ] = useState(null);
  const [ showPageSplitModal, setShowPageSplitModal ] = useState(false);

  const togglePageSplitModal = (toggle) => {
    setShowPageSplitModal(toggle);
  };

  // if using a class, equivalent of componentDidMount 
  useEffect(() => {
    WebViewer(
      {
        path: '/webviewer/lib',
        initialDoc: '/files/PDFTRON_about.pdf',
      },
      viewer.current,
    ).then((instance) => {
      const { docViewer } = instance;

      docViewer.on('documentLoaded', () => {
        setWvInstance(instance);
      });
    });
  }, [ setWvInstance ]);

  return (
    <div className="App">
      <FileList
        togglePageSplitModal = {togglePageSplitModal}
        wvInstance={wvInstance}
      />
      <PageSplit
        handleClose={() => setShowPageSplitModal(false)}
        show={showPageSplitModal}
      />
      <div className="webviewer" ref={viewer}></div>
    </div>
  );
};

export default App;
