import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Trophy, 
  Clock, 
  Users, 
  Download, 
  Target,
  TrendingUp,
  Calendar,
  Award,
  Filter,
  ChevronRight,
  Upload
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

const Dashboard: React.FC = () => {
  const { user, acceptChallenge } = useAuth();
  const { leaderboard, challenges, submissions } = useData();
  // Filter submissions for current user
  const mySubmissions = user ? submissions.filter(s => s.userId === user.id) : [];
  // Tab state for switching between all and my challenges
  // (removed unused tab, filterDifficulty, filterStatus, myChallengeIds)
  // (filteredAllChallenges and filteredMyChallenges removed, not used in this file)

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Please sign in to access your dashboard
          </h2>
          <Link
            to="/"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  // ...dashboard content without challenges...

  // Find user in leaderboard for rank and completed challenges
  const leaderboardEntry = leaderboard.find(entry => entry.email === user.email);
  const userRank = leaderboardEntry ? leaderboardEntry.rank : 'Unranked';
  // Count completed challenges by user: acceptedChallenges with completed: true
  const completedChallengeIds = user.acceptedChallenges?.filter(ac => ac.completed).map(ac => ac.challengeId) || [];
  // Calculate total points from completed challenges
  const totalPoints = completedChallengeIds.length > 0
    ? challenges.filter(c => completedChallengeIds.includes(c.id)).reduce((sum, c) => sum + (c.points || 0), 0)
    : 0;

  // Assign and persist badges
  let badges = Array.isArray(user.badges) ? [...user.badges] : [];
  let updated = false;
  // Welcome badge
  if (totalPoints === 0 && !badges.includes('Welcome')) {
    badges.push('Welcome');
    updated = true;
  }
  // Bronze badge
  if (totalPoints >= 450 && !badges.includes('Bronze')) {
    badges.push('Bronze');
    updated = true;
  }
  // Silver badge
  if (totalPoints >= 1000 && !badges.includes('Silver')) {
    badges.push('Silver');
    updated = true;
  }
  // Gold badge
  if (totalPoints >= 2000 && !badges.includes('Gold')) {
    badges.push('Gold');
    updated = true;
  }
  // Marathoner badge
  if ((user.acceptedChallenges?.filter(ac => ac.completed).length || 0) >= 10 && !badges.includes('Marathoner')) {
    badges.push('Marathoner');
    updated = true;
  }
  // Consistent badge (active in last 3 weeks)
  if (user.joinedAt && (Date.now() - new Date(user.joinedAt).getTime() < 21 * 24 * 60 * 60 * 1000) && !badges.includes('Consistent')) {
    badges.push('Consistent');
    updated = true;
  }
  // Early Bird badge (joined in first 7 days of platform, dummy logic)
  if (user.joinedAt && new Date(user.joinedAt).getTime() < new Date('2025-07-08').getTime() && !badges.includes('Early Bird')) {
    badges.push('Early Bird');
    updated = true;
  }
  // Save badges to Firestore if updated
  React.useEffect(() => {
    if (updated) {
      updateDoc(doc(db, 'users', user.email), { badges });
      localStorage.setItem('datasprint_user', JSON.stringify({ ...user, badges }));
    }
    // eslint-disable-next-line
  }, [updated]);

  // Count badges
  const badgeCount = badges.length;

  const stats = [
    {
      label: 'Total Points',
      value: totalPoints.toLocaleString(),
      icon: Trophy,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      label: 'Challenges Completed',
      value: completedChallengeIds.length.toString(),
      icon: Target,
      color: 'from-green-500 to-emerald-500'
    },
    {
      label: 'Current Rank',
      value: userRank === 'Unranked' ? 'Unranked' : `#${userRank}`,
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      label: 'Badges Earned',
      value: badgeCount.toString(),
      icon: Award,
      color: 'from-purple-500 to-pink-500'
    }
  ];

  // Removed unused getDifficultyColor and getStatusColor

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Welcome back, {user.name}! 🚀
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Ready to tackle some data challenges today?
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

        {/* User Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 mb-8"
        >
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5" />
            Your Badges
          </h2>
          <div className="flex flex-wrap gap-3">
            {badges.map((badge, index) => (
              <div
                key={index}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-medium"
              >
                {badge}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Your Submissions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 mb-8"
        >
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Your Submissions
          </h2>
          {mySubmissions.length === 0 ? (
            <div className="text-slate-500 dark:text-slate-400">You have not submitted any solutions yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-black dark:text-white">Challenge</th>
                    <th className="px-4 py-2 text-left text-black dark:text-white">File</th>
                    <th className="px-4 py-2 text-left text-black dark:text-white">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {mySubmissions.map((sub) => {
                    const challenge = challenges.find(c => c.id === sub.challengeId);
                    return (
                      <tr key={sub.id} className="border-b border-slate-100 dark:border-slate-700">
                        <td className="px-4 py-2 text-black dark:text-white">{challenge ? challenge.title : sub.challengeId}</td>
                        <td className="px-4 py-2 text-black dark:text-white">
                          <a href={sub.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-700 dark:text-blue-200 hover:underline">
                            {sub.fileName}
                          </a>
                        </td>
                        <td className="px-4 py-2 text-black dark:text-white">{formatDistanceToNow(sub.submittedAt, { addSuffix: true })}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* ...removed All Challenges / My Challenges section... */}
      </div>
    </div>
  );
};

export default Dashboard;