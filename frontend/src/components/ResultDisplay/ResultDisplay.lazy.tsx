import React, { lazy, Suspense } from 'react';

const LazyResultDisplay = lazy(() => import('./ResultDisplay'));

const ResultDisplay = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyResultDisplay {...props} />
  </Suspense>
);

export default ResultDisplay;
