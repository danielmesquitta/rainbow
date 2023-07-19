import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { DefaultLayout } from '~/layouts/DefaultLayout';

const Home = lazy(() => import('~/pages/Home'));
const Success = lazy(() => import('~/pages/Success'));

export const Router: React.FC = () => {
  return (
    <Suspense>
      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/success" element={<Success />} />
        </Route>
      </Routes>
    </Suspense>
  );
};
