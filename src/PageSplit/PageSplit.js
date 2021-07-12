import React, { useState } from 'react';

import './PageSplit.css';

const extractionTypes = {
  newDocument: 'new-document',
  mergeDocument: 'mergeDocument',
};

const PageSplit = (props) => {
  const {
    handleClose,
    show,
    totalPageCount,
    extractPagesToNewDocument,
    extractPagesAndMergeToExistingDocument,
    currentDoc,
    fileList,
  } = props;
  const [ extractionType, setExtractionType ] = useState(extractionTypes.newDocument);
  const [ pagesToExtract, setPagesToExtract ] = useState('1');
  const [ docToMergeWith, setDocToMergeWith ] = useState(null);
  const showHideClassName = show
    ? 'block'
    : 'none';

  const parsePagesToExtractToNewDocument = () => {
    const pages = getPageArrayFromString(totalPageCount, pagesToExtract);
    if (extractionType === extractionTypes.newDocument) {
      extractPagesToNewDocument(pages);
    } else if (extractionType === extractionTypes.mergeDocument) {
      extractPagesAndMergeToExistingDocument(pages, docToMergeWith);
    }
    handleClose();
  };

  return (
    <div className={`modal display-${showHideClassName}`}>
      <section className='modal-main'>
        <div>
          <input
            type='text'
            value={pagesToExtract}
            onChange={(event) => setPagesToExtract(event.target.value)}
          />
        </div>
        <div>
          <div onChange={(event) => setExtractionType(event.target.value)}>
            <input type='radio' value={extractionTypes.newDocument} name='extraction-type' defaultChecked/>
            <span>Extract Pages To New Document</span>
            <input type='radio' value={extractionTypes.mergeDocument} name='extraction-type'/>
            <span>Extract Pages and Merge To Existing Document</span>
          </div>
          {
            extractionType === extractionTypes.mergeDocument
            && (
              <div
                onChange={(event) => setDocToMergeWith(event.target.value)}
              >
                <hr/>
                {
                  fileList
                    .filter(filename => currentDoc.indexOf(filename))
                    .map((filename, idx) => (
                      <div
                        key={`merge-with-${filename}-${idx}`}
                      >
                        <input type='radio' value={filename} name='extraction-type'/>
                        <span>{`${filename}.pdf`}</span>
                      </div>
                    ))
                }
                <hr/>
              </div>
            )
          }
          <button
            type='button'
            onClick={parsePagesToExtractToNewDocument}
            disabled={
              extractionType === extractionTypes.mergeDocument
              && !docToMergeWith
            }
          >
            Extract Pages
          </button>
          <button type='button' onClick={handleClose}>
            Close Modal
          </button>
        </div>
      </section>
    </div>
  );
};

export default PageSplit;

/**
 * Modified version of the functions implemented here:
 * https://github.com/PDFTron/webviewer-ui/blob/7.3/src/helpers/getPageArrayFromString.js
 *
 * Note that PageLabels implementation has been stripped out, as this PoC app
 * assumes that all Page Labels correspond to their Page Numbers
 */
const getPageArrayFromString = (totalPages, customInput) => {
  const pagesToPrint = [];

  // User has provided no input, assume every page is desired
  if (!customInput) {
    for (let i = 1; i <= totalPages; i++) {
      pagesToPrint.push(parseInt(i, 10));
    }
    return pagesToPrint;
  }

  const pageGroups = customInput.split(',');
  pageGroups.forEach(pageGroup => {
    const range = pageGroup.split('-');
    const isSinglePage = range.length === 1;
    const isRangeOfPages = range.length === 2;

    if (isSinglePage) {
      pagesToPrint.push(parseInt(range[0], 10));
    } else if (isRangeOfPages) {
      const start = range[0];
      let end;

      if (range[1] === '') {
        // range like 4- means page 4 to the end of the document
        end = totalPages;
      } else {
        end = range[1];
      }

      for (let i = start; i <= end; i++) {
        pagesToPrint.push(parseInt(i, 10));
      }
    }
  });

  return pagesToPrint
    .filter((pageNumber, index, pagesToPrint) => {
      const isUnique = pagesToPrint.indexOf(pageNumber) === index;
      const isValidPageNumber = pageNumber > 0 && pageNumber <= totalPages;
      return isUnique && isValidPageNumber;
    })
    .sort((a, b) => a - b);
};
