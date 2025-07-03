// FeaturedChallenges section component
import { useData } from '../contexts/DataContext';

const FeaturedChallenges: React.FC = () => {
  const { challenges } = useData();
  // Show only first 4 active challenges
  const featured = challenges.filter(c => c.status === 'active').slice(0, 4);
  const navigate = useNavigate();

  return (
    <div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {featured.map((challenge) => (
          <div key={challenge.id} className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 flex flex-col justify-between border border-slate-100 dark:border-slate-700">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{challenge.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 line-clamp-3">{challenge.description}</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {challenge.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 text-xs rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">{tag}</span>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs font-semibold px-2 py-1 rounded bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
              </span>
              <button
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline text-sm"
                onClick={() => navigate(`/challenge/${challenge.id}`)}
              >
                View Challenge
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <button
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          onClick={() => navigate('/all-challenges')}
        >
          View All Challenges
        </button>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Trophy, 
  Users, 
  Download, 
  Upload, 
  Award, 
  Clock, 
  Target,
  ChevronRight,
  Play
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from '../components/AuthModal';

const Landing: React.FC = () => {
  const { user, login } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);
  const navigate = useNavigate();

  const features = [
    {
      icon: Download,
      title: 'Download Datasets',
      description: 'Access real-world datasets from Google Drive with one click'
    },
    {
      icon: Target,
      title: 'Solve Challenges',
      description: 'Complete data analysis tasks with clear instructions and objectives'
    },
    {
      icon: Upload,
      title: 'Submit Solutions',
      description: 'Upload your analysis files and get instant feedback'
    },
    {
      icon: Award,
      title: 'Earn Points',
      description: 'Get scored automatically and climb the leaderboard'
    },
    {
      icon: Trophy,
      title: 'Win Badges',
      description: 'Unlock achievements for accuracy, speed, and consistency'
    },
    {
      icon: Users,
      title: 'Compete Globally',
      description: 'Challenge data scientists from around the world'
    }
  ];

  const stats = [
    { value: '10K+', label: 'Active Users' },
    { value: '500+', label: 'Challenges' },
    { value: '50K+', label: 'Submissions' },
    { value: '95%', label: 'Satisfaction' }
  ];


  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-indigo-600/10" />
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                HACKETHON <span className="text-2xl font-normal text-slate-600 dark:text-slate-300 ml-2"></span>
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto">
              The ultimate AI-powered platform for data analysis challenges. 
              Learn, compete, and master data science skills with real-world datasets.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {user ? (
                <Link
                  to="/dashboard"
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold text-lg flex items-center gap-2 group"
                >
                  Go to Dashboard
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold text-lg flex items-center gap-2 group"
                >
                  Start Your Journey
                  <Play className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
              {/* Admin Login Button */}
              <button
                onClick={() => { setShowAdminModal(true); setAdminError(''); setAdminPassword(''); }}
                className="px-8 py-4 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all duration-200 font-semibold text-lg flex items-center gap-2"
              >
                Admin Login
              </button>
              <Link
                to="/leaderboard"
                className="px-8 py-4 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 font-semibold text-lg"
              >
                View Leaderboard
              </Link>
            </div>
          </motion.div>
          {/* Admin Login Modal */}
          {showAdminModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 w-full max-w-sm relative">
                <button
                  className="absolute top-2 right-2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                  onClick={() => setShowAdminModal(false)}
                >
                  ×
                </button>
                <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white text-center">Admin Login</h2>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  placeholder="Enter admin password"
                  value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleAdminLogin(); }}
                  autoFocus
                />
                {adminError && <div className="text-red-500 text-sm mb-2 text-center">{adminError}</div>}
                <button
                  className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold text-lg transition-all duration-200 disabled:opacity-60"
                  onClick={handleAdminLogin}
                  disabled={adminLoading}
                >
                  {adminLoading ? 'Logging in...' : 'Login as Admin'}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Featured Challenges Section */}
      <section className="py-12 px-4 bg-gradient-to-br from-blue-50/60 to-purple-50/60 dark:from-slate-800/60 dark:to-slate-900/60">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Join thousands of data scientists in our Professional Data Analysis Hackathon Platform</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Start your journey by solving real-world challenges and climb the leaderboard!</p>
          </motion.div>
          <FeaturedChallenges />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Join thousands of data scientists in our gamified learning platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Ready to Sprint Through Data?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
              Join our community of data enthusiasts and start building your skills today.
            </p>
            
            {!user && (
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold text-lg"
              >
                Get Started Free
              </button>
            )}
          </motion.div>
        </div>
      </section>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );

  // Admin login handler
  function handleAdminLogin() {
    setAdminError('');
    if (adminPassword === 'admin123') {
      setAdminLoading(true);
      // Simulate login as admin
      login('admin@datasprint.com', 'admin123').then(() => {
        setAdminLoading(false);
        setShowAdminModal(false);
        navigate('/admin');
      }).catch(() => {
        setAdminLoading(false);
        setAdminError('Login failed.');
      });
    } else {
      setAdminError('Incorrect password.');
    }
  }
};

export default Landing;