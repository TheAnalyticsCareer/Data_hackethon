import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Link } from 'react-router-dom';
import { 
  User, 
  Trophy, 
  Target, 
  Award, 
  Calendar,
  TrendingUp,
  FileText,
  Mail,
  Edit
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow, format, parseISO, isValid } from 'date-fns';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { submissions, leaderboard } = useData();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Please sign in to view your profile
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

  const userRank = leaderboard.find(entry => entry.email === user.email)?.rank || 0;
  // Only count submissions for completed challenges
  const completedChallengeIds = user.acceptedChallenges?.filter(ac => ac.completed).map(ac => ac.challengeId) || [];
  // Calculate total points from completed challenges (used for stats and badges)
  // Use only one declaration for totalPoints
  const totalPoints = completedChallengeIds.length > 0
    ? (challenges => challenges.filter(c => completedChallengeIds.includes(c.id)).reduce((sum, c) => sum + (c.points || 0), 0))(useData().challenges)
    : 0;

  // --- Badge logic (same as dashboard) ---
  let badges = Array.isArray(user.badges) ? [...user.badges] : [];
  // Welcome badge
  if (totalPoints === 0 && !badges.includes('Welcome')) {
    badges.push('Welcome');
  }
  // Bronze badge
  if (totalPoints >= 450 && !badges.includes('Bronze')) {
    badges.push('Bronze');
  }
  // Silver badge
  if (totalPoints >= 1000 && !badges.includes('Silver')) {
    badges.push('Silver');
  }
  // Gold badge
  if (totalPoints >= 2000 && !badges.includes('Gold')) {
    badges.push('Gold');
  }
  // Marathoner badge
  if ((user.acceptedChallenges?.filter(ac => ac.completed).length || 0) >= 10 && !badges.includes('Marathoner')) {
    badges.push('Marathoner');
  }
  // Consistent badge (active in last 3 weeks)
  if (user.joinedAt && (Date.now() - new Date(user.joinedAt).getTime() < 21 * 24 * 60 * 60 * 1000) && !badges.includes('Consistent')) {
    badges.push('Consistent');
  }
  // Early Bird badge (joined in first 7 days of platform, dummy logic)
  if (user.joinedAt && new Date(user.joinedAt).getTime() < new Date('2025-07-08').getTime() && !badges.includes('Early Bird')) {
    badges.push('Early Bird');
  }

  // Count completed challenges (acceptedChallenges with completed: true)
  const completedChallenges = completedChallengeIds.length;

  const stats = [
    {
      label: 'Total Points',
      value: totalPoints.toLocaleString(),
      icon: Trophy,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      label: 'Global Rank',
      value: userRank > 0 ? `#${userRank}` : 'Unranked',
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      label: 'Challenges Completed',
      value: completedChallenges.toString(),
      icon: Target,
      color: 'from-purple-500 to-pink-500'
    },
  ];

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-8">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  {user.name}
                </h1>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-2">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Joined {
                      (() => {
                        let date: Date;
                        if (typeof user.joinedAt === 'string') {
                          date = parseISO(user.joinedAt);
                        } else {
                          date = user.joinedAt;
                        }
                        return isValid(date) ? format(date, 'MMMM yyyy') : 'Unknown';
                      })()
                    }
                  </span>
                </div>
              </div>
            </div>
            
            {/* Edit Profile button removed as requested */}
          </div>
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

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6"
          >
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Award className="w-5  h-5" />
              Badges & Achievements
            </h2>
            <div className="flex flex-wrap gap-3">
              {badges.length > 0 ? (
                badges.map((badge, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-medium"
                  >
                    {badge}
                  </div>
                ))
              ) : (
                <div className="text-slate-500 dark:text-slate-400">No badges yet</div>
              )}
            </div>
          </motion.div>

          {/* Recent Submissions removed as requested */}
        </div>
      </div>
    </div>
  );
};

export default Profile;