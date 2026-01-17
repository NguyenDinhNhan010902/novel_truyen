import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import NovelsPage from './pages/Novels';

import NovelForm from './pages/NovelForm';
import ChapterList from './pages/ChapterList';
import ChapterForm from './pages/ChapterForm';

import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="novels" element={<NovelsPage />} />
            <Route path="novels/new" element={<NovelForm />} />
            <Route path="novels/:id/edit" element={<NovelForm />} />
            <Route path="novels/:id/chapters" element={<ChapterList />} />
            <Route path="novels/:id/chapters/new" element={<ChapterForm />} />
            <Route path="novels/:id/chapters/:chapterId" element={<ChapterForm />} />
            {/* Add more routes here */}
            <Route path="*" element={<div style={{ padding: '2rem' }}>404 - Not Found</div>} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
