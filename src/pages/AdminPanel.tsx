import React, { useState } from 'react';
import {
  Users, Trophy, Settings, Plus, Edit, Trash2, Download, Upload,
  BarChart3, Target
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import CreateChallengeModal from '../components/CreateChallengeModal';

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const { challenges, submissions, leaderboard, deleteChallenge } = useData();
  const [activeTab, setActiveTab] = useState<'overview' | 'challenges' | 'users' | 'submissions'>('overview');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editChallenge, setEditChallenge] = useState(null);

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Access Denied
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
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
    { id: 'submissions', label: 'Submissions', icon: Upload }
  ];

  const handleDeleteChallenge = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this challenge?')) {
      try {
        await deleteChallenge(id);
        toast.success('Challenge deleted');
      } catch (err) {
        toast.error('Error deleting challenge');
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Settings className="w-8 h-8" />
            Admin Panel
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage challenges, users, and platform insights
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow border border-slate-200 dark:border-slate-700"
            >
              <div className={`w-12 h-12 mb-4 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {stat.value}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
            <nav className="flex whitespace-nowrap space-x-6 px-4 sm:px-6 py-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-3 text-sm font-medium flex items-center gap-2 transition ${
                    activeTab === tab.id
                      ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Dynamic Content */}
          <div className="p-4 sm:p-6">
            {activeTab === 'overview' && (
              <div className="grid gap-6 md:grid-cols-2">
                {/* Left: Activity */}
                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl">
                  <h3 className="text-base font-semibold mb-3 text-slate-900 dark:text-white">Recent Activity</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-300">New user registration</span>
                      <span className="text-xs text-slate-400">2m ago</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-300">Challenge submission</span>
                      <span className="text-xs text-slate-400">5m ago</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-300">New challenge created</span>
                      <span className="text-xs text-slate-400">1h ago</span>
                    </div>
                  </div>
                </div>

                {/* Right: Quick Actions */}
                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl space-y-4">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">Quick Actions</h3>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <Plus className="w-4 h-4" />
                    Create Challenge
                  </button>
                  <button
                    onClick={() => {
                      const headers = ['Submission ID', 'Challenge ID', 'User ID', 'User Name', 'User Email', 'File Name', 'File URL', 'Score', 'Status', 'Feedback', 'Submitted At'];
                      const rows = submissions.map(s => [
                        s.id, s.challengeId, s.userId, s.userName || '', s.userEmail || '',
                        s.fileName, s.fileUrl, s.score, s.status, s.feedback,
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
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition"
                  >
                    <Download className="w-4 h-4" />
                    Export Data
                  </button>
                </div>
              </div>
            )}

            {/* Challenges */}
            {activeTab === 'challenges' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">Manage Challenges</h3>
                  <button
                    onClick={() => {
                      setEditChallenge(null);
                      setShowCreateModal(true);
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    New
                  </button>
                </div>
                <div className="space-y-4">
                  {challenges.map((challenge) => (
                    <div key={challenge.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-base font-semibold text-slate-900 dark:text-white">{challenge.title}</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{challenge.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            className="p-1 hover:text-blue-600"
                            onClick={() => {
                              setEditChallenge(challenge);
                              setShowCreateModal(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteChallenge(challenge.id)} className="p-1 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Users */}
            {activeTab === 'users' && (
              <div className="overflow-auto">
                <table className="min-w-[600px] w-full text-sm text-left">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      <th className="px-4 py-2">User</th>
                      <th className="px-4 py-2">Points</th>
                      <th className="px-4 py-2">Challenges</th>
                      <th className="px-4 py-2">Last Active</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map(user => (
                      <tr key={user.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30">
                        <td className="px-4 py-2">
                          <div className="font-medium text-slate-900 dark:text-white">{user.name}</div>
                          <div className="text-xs text-slate-500">{user.email}</div>
                        </td>
                        <td className="px-4 py-2">{user.totalPoints}</td>
                        <td className="px-4 py-2">{user.challengesCompleted}</td>
                        <td className="px-4 py-2">{formatDistanceToNow(user.lastActive, { addSuffix: true })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Submissions */}
            {activeTab === 'submissions' && (
              <div className="overflow-auto">
                <table className="min-w-[600px] w-full text-sm">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      <th className="px-4 py-2">Challenge</th>
                      <th className="px-4 py-2">File</th>
                      <th className="px-4 py-2">Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map(sub => {
                      const challenge = challenges.find(c => c.id === sub.challengeId);
                      return (
                        <tr key={sub.id} className="border-b border-slate-200 dark:border-slate-700">
                          <td className="px-4 py-2">{challenge?.title || 'Unknown'}</td>
                          <td className="px-4 py-2">
                            <a href={sub.fileUrl} className="text-blue-500 hover:underline" target="_blank" rel="noreferrer">{sub.fileName}</a>
                          </td>
                          <td className="px-4 py-2">{formatDistanceToNow(sub.submittedAt, { addSuffix: true })}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      <CreateChallengeModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setEditChallenge(null);
        }}
        challenge={editChallenge}
      />
    </div>
  );
};

export default AdminPanel;
