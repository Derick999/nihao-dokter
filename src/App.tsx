import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import FloatingAiButton from './components/FloatingAiButton';
import NihaoAIWidget from './components/NihaoAIWidget';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Artikel from './pages/Artikel';
import Layanan from './pages/Layanan';
import Login from './pages/Login';
import Register from './pages/Register';
import { DoctorProfile } from './data/doctors';
import { getStoredUser, logoutUser, StoredUser } from './utils/auth';

export default function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}

function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);
  const [activeDoctor, setActiveDoctor] = useState<{ name: string; img: string } | null>(null);
  const [isDoctorChatOpen, setIsDoctorChatOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);

  useEffect(() => {
    setCurrentUser(getStoredUser());
  }, [location.pathname]);

  const requireLogin = () => {
    const user = getStoredUser();
    setCurrentUser(user);

    if (!user) {
      navigate('/login');
      return false;
    }

    return true;
  };

  const handleOpenChat = (doctor: { name: string; img: string } | DoctorProfile) => {
    if (!requireLogin()) {
      return;
    }

    setActiveDoctor(doctor);
    setIsAiOpen(false);
    setIsDoctorChatOpen(true);
  };

  const handleOpenAi = () => {
    if (!requireLogin()) {
      return;
    }

    setIsDoctorChatOpen(false);
    setIsAiOpen(true);
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setIsAiOpen(false);
    setIsDoctorChatOpen(false);
    navigate('/');
  };

  const handleAuthSuccess = () => {
    setCurrentUser(getStoredUser());
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans">
      {!isAuthPage && (
        <Navbar currentUser={currentUser} onLogout={handleLogout} />
      )}
      <Routes>
        <Route path="/" element={<Home onOpenChat={handleOpenChat} />} />
        <Route path="/layanan" element={<Layanan onOpenChat={handleOpenChat} />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/artikel" element={<Artikel />} />
        <Route path="/login" element={<Login onAuthSuccess={handleAuthSuccess} />} />
        <Route path="/register" element={<Register onAuthSuccess={handleAuthSuccess} />} />
      </Routes>
      {!isAuthPage && (
        <>
          <Footer onOpenChat={handleOpenChat} />
          <FloatingAiButton onClick={handleOpenAi} />
          <ChatWidget doctor={activeDoctor} isOpen={isDoctorChatOpen} onClose={() => setIsDoctorChatOpen(false)} />
          <NihaoAIWidget
            isOpen={isAiOpen}
            onClose={() => setIsAiOpen(false)}
            onSelectDoctor={(doctor) => handleOpenChat(doctor)}
          />
        </>
      )}
    </div>
  );
}
