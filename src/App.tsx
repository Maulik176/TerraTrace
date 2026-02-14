import { Navigate, Route, HashRouter as Router, Routes } from 'react-router-dom';

import HomePage from './pages/HomePage';
import PlayPage from './pages/PlayPage';
import ResultsPage from './pages/ResultsPage';

function App(): JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/play" element={<PlayPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
