import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Teams from './pages/Teams';
import CreateTeam from './pages/CreateTeam';
import TeamPayment from './pages/TeamPayment';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/teams" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/create-team" element={<CreateTeam />} />
            <Route path="/teams/:teamId/payment" element={<TeamPayment />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
