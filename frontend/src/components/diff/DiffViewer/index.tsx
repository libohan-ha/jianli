import React from 'react';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer-continued';

interface DiffViewerProps {
  original: string;
  modified: string;
  splitView?: boolean;
  showDiffOnly?: boolean;
}

const customStyles = {
  variables: {
    light: {
      diffViewerBackground: '#ffffff',
      diffViewerColor: '#374151',
      addedBackground: '#DAFBE1',
      addedColor: '#116329',
      removedBackground: '#FFEBE9',
      removedColor: '#CF222E',
      wordAddedBackground: '#DAFBE1',
      wordRemovedBackground: '#FFEBE9',
      addedGutterBackground: '#DAFBE1',
      removedGutterBackground: '#FFEBE9',
      gutterBackground: '#f8f9fa',
      gutterBackgroundDark: '#f1f2f3',
      highlightBackground: '#FFF8C5',
      highlightGutterBackground: '#FFF8C5',
      codeFoldGutterBackground: '#f8f9fa',
      codeFoldBackground: '#f8f9fa',
      emptyLineBackground: '#f8f9fa',
      gutterColor: '#6B7280',
      addedGutterColor: '#116329',
      removedGutterColor: '#CF222E',
      codeFoldContentColor: '#6B7280',
      diffViewerTitleBackground: '#f8f9fa',
      diffViewerTitleColor: '#374151',
      diffViewerTitleBorderColor: '#E5E7EB',
    },
  },
  line: {
    padding: '4px 8px',
    fontSize: '14px',
    lineHeight: '1.5',
  },
  gutter: {
    minWidth: '40px',
    padding: '0 8px',
    fontSize: '12px',
  },
  contentText: {
    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
  },
};

export const DiffViewer: React.FC<DiffViewerProps> = ({
  original,
  modified,
  splitView = true,
  showDiffOnly = false,
}) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      <div className="grid grid-cols-2 border-b border-gray-100">
        <div className="px-6 py-4 bg-gradient-to-r from-red-50 to-red-50/50 text-sm font-semibold text-red-700 border-r border-gray-100 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          原始简历
        </div>
        <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-green-50/50 text-sm font-semibold text-green-700 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          优化后简历
        </div>
      </div>
      <div className="max-h-[600px] overflow-auto">
        <ReactDiffViewer
          oldValue={original}
          newValue={modified}
          splitView={splitView}
          compareMethod={DiffMethod.WORDS}
          styles={customStyles}
          showDiffOnly={showDiffOnly}
          useDarkTheme={false}
          leftTitle=""
          rightTitle=""
        />
      </div>
    </div>
  );
};

export default DiffViewer;