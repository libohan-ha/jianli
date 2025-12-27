import { createBrowserRouter } from 'react-router-dom';
import {
    AnalyzingPage,
    DiffPage,
    ExportPage,
    HomePage,
    ResultPage,
} from './pages';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/analyzing',
    element: <AnalyzingPage />,
  },
  {
    path: '/result/:id',
    element: <ResultPage />,
  },
  {
    path: '/diff/:id',
    element: <DiffPage />,
  },
  {
    path: '/export/:id',
    element: <ExportPage />,
  },
]);

export default router;