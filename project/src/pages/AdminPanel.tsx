import React, { useState } from 'react';
import { 
  Users, 
  Trophy, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Download, 
  Upload,
  BarChart3,
  Calendar,
  Target
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import CreateChallengeModal from '../components/CreateChallengeModal';

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const { challenges, submissions, leaderboard } = useData();
  const [activeTab, setActiveTab] = useState<'overview' | 'challenges' | 'users' | 'submissions'>('overview');
  const [showCreateModal, setShowCreateModal] = useState(false);

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Access Denied
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            You need admin privileges to access this page.
          </p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Users',
      value: leaderboard.length.toString(),
      icon: Users,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      label: 'Active Challenges',
      value: challenges.filter(c => c.status === 'active').length.toString(),
      icon: Target,
      color: 'from-green-500 to-emerald-500'
    },
    {
      label: 'Total Submissions',
      value: submissions.length.toString(),
      icon: Upload,
      color: 'from-purple-500 to-pink-500'
    },
    {
      label: 'Avg Score',
      value: '87.5%',
      icon: BarChart3,
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'challenges', label: 'Challenges', icon: Target },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'submissions', label: 'Submissions', icon: Upload },
  ];

  const { deleteChallenge } = useData();
  const handleDeleteChallenge = async (challengeId: string) => {
    if (window.confirm('Are you sure you want to delete this challenge?')) {
      try {
        await deleteChallenge(challengeId);
        toast.success('Challenge deleted successfully');
      } catch (err) {
        toast.error('Failed to delete challenge');
      }
    }
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
            <Settings className="w-8 h-8" />
            Admin Panel
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage challenges, users, and platform analytics
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
          <div className="border-b border-slate-200 dark:border-slate-700">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-slate-600 dark:text-slate-400">New user registration</span>
                        <span className="text-slate-500 text-xs">2m ago</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-slate-600 dark:text-slate-400">Challenge submission</span>
                        <span className="text-slate-500 text-xs">5m ago</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-slate-600 dark:text-slate-400">New challenge created</span>
                        <span className="text-slate-500 text-xs">1h ago</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => setShowCreateModal(true)}
                        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Create Challenge
                      </button>
                      <button
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors flex items-center gap-2"
                        onClick={() => {
                          // CSV export logic
                          const headers = [
                            'Submission ID', 'Challenge ID', 'User ID', 'User Name', 'User Email', 'File Name', 'File URL', 'Score', 'Status', 'Feedback', 'Submitted At'
                          ];
                          const rows = submissions.map(s => [
                            s.id,
                            s.challengeId,
                            s.userId,
                            s.userName || '',
                            s.userEmail || '',
                            s.fileName,
                            s.fileUrl,
                            s.score,
                            s.status,
                            s.feedback,
                            s.submittedAt instanceof Date ? s.submittedAt.toISOString() : ''
                          ]);
                          const csvContent = [headers, ...rows]
                            .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
                            .join('\n');
                          const blob = new Blob([csvContent], { type: 'text/csv' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'recent_submissions.csv';
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        }}
                      >
                        <Download className="w-4 h-4" />
                        Export Data
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Challenges Tab */}
            {activeTab === 'challenges' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Manage Challenges</h3>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Create Challenge
                  </button>
                </div>

                <div className="space-y-4">
                  {challenges.map((challenge) => (
                    <div key={challenge.id} className="border border-slate-200 dark:border-slate-700 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-slate-900 dark:text-white">{challenge.title}</h4>
                          <p className="text-slate-600 dark:text-slate-400">{challenge.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteChallenge(challenge.id)}
                            className="p-2 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-slate-500 dark:text-slate-400">Status:</span>
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                            challenge.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                            challenge.status === 'upcoming' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                          }`}>
                            {challenge.status}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 dark:text-slate-400">Difficulty:</span>
                          <span className="ml-2 font-medium text-slate-900 dark:text-white">{challenge.difficulty}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 dark:text-slate-400">Points:</span>
                          <span className="ml-2 font-medium text-slate-900 dark:text-white">{challenge.points}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 dark:text-slate-400">Submissions:</span>
                          <span className="ml-2 font-medium text-slate-900 dark:text-white">{challenge.submissionCount}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">User Management</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 dark:bg-slate-700/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">User</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Points</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Challenges</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">Last Active</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      {leaderboard.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                          <td className="px-4 py-3">
                            <div>
                              <div className="font-medium text-slate-900 dark:text-white">{user.name}</div>
                              <div className="text-sm text-slate-500 dark:text-slate-400">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{user.totalPoints.toLocaleString()}</td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{user.challengesCompleted}</td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-400 text-sm">
                            {formatDistanceToNow(user.lastActive, { addSuffix: true })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Submissions Tab */}
            {activeTab === 'submissions' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-6">Recent Submissions</h3>
                <div className="overflow-x-auto mb-8">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-white">Challenge</th>
                        <th className="px-4 py-2 text-left text-white">File</th>
                        <th className="px-4 py-2 text-left text-white">Submitted</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.map((sub) => {
                        const challenge = challenges.find(c => c.id === sub.challengeId);
                        return (
                          <tr key={sub.id} className="border-b border-slate-100 dark:border-slate-700">
                            <td className="px-4 py-2 text-white">{challenge ? challenge.title : sub.challengeId}</td>
                            <td className="px-4 py-2 text-white">
                              <a href={sub.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:underline">
                                {sub.fileName}
                              </a>
                            </td>
                            <td className="px-4 py-2 text-white">{formatDistanceToNow(sub.submittedAt, { addSuffix: true })}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateChallengeModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
    </div>
  );
};

export default AdminPanel;