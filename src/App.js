import React, { useRef, useEffect, useState } from 'react';
import WebViewer from '@pdftron/webviewer';
import FileList from './FileList/FileList';
import PageSplit from './PageSplit/PageSplit';
import './App.css';

const App = () => {
  const viewer = useRef(null);

  const [ wvInstance, setWvInstance ] = useState(null);
  const [ showPageSplitModal, setShowPageSplitModal ] = useState(false);
  const [ currentDoc, setCurrentDoc ] = useState('PDFTRON_about.pdf');
  const [ totalPageCount, setTotalPageCount ] = useState(null);

  const fileList = [
    'demo',
    'PDFTRON_about',
    'quote',
  ];

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
        setTotalPageCount(docViewer.getPageCount());
        setWvInstance(instance);
      });
    });
  }, [ setWvInstance ]);

  const extractPagesToNewDocument = async (pagesToExtract) => {
    const { docViewer, annotManager } = wvInstance;
    const doc = docViewer.getDocument();
    const annotList = annotManager.getAnnotationsList().filter(annot => pagesToExtract.indexOf(annot.PageNumber) > -1);
    const xfdfString = await annotManager.exportAnnotations({ annotList });

    const data = await doc.extractPages(pagesToExtract, xfdfString);
    const arr = new Uint8Array(data);

    //optionally save the blob to a file or upload to a server
    const blob = new Blob([arr], { type: 'application/pdf' });
    const filename = 'split-pages-to-new.pdf';
    wvInstance.loadDocument(blob, { extension: 'pdf', filename });
    setCurrentDoc(filename);
  };

  const extractPagesAndMergeToExistingDocument = async (pagesToExtract, docToMergeWith) => {
    const { annotManager, CoreControls, docViewer } = wvInstance;
    const doc = await CoreControls.createDocument(`/files/${docToMergeWith}.pdf`);
    const originalDoc = docViewer.getDocument();

    const pageIndexToInsert = doc.getPageCount() + 1;

    await doc.insertPages(originalDoc, pagesToExtract, pageIndexToInsert);
    const xfdfString = await annotManager.exportAnnotations();
    const data = await doc.getFileData({ xfdfString });
    const arr = new Uint8Array(data);
    const blob = new Blob([arr], { type: 'application/pdf' });
    const filename = 'split-pages-merged-to-existing-document.pdf';
    wvInstance.loadDocument(blob, { extension: 'pdf', filename });
    setCurrentDoc(filename);
  };

  return (
    <div className="App">
      <FileList
        togglePageSplitModal = {togglePageSplitModal}
        wvInstance={wvInstance}
        setCurrentDoc={setCurrentDoc}
        currentDoc={currentDoc}
        fileList={fileList}
      />
      <PageSplit
        handleClose={() => setShowPageSplitModal(false)}
        show={showPageSplitModal}
        totalPageCount={totalPageCount}
        extractPagesToNewDocument={extractPagesToNewDocument}
        extractPagesAndMergeToExistingDocument={extractPagesAndMergeToExistingDocument}
        currentDoc={currentDoc}
        fileList={fileList}
      />
      <div className="webviewer" ref={viewer}></div>
    </div>
  );
};

export default App;
