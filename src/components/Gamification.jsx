import { useState, useEffect } from 'react';
import { useAuthStore } from '../store';
import { getStudentGamification } from '../services/firestoreService';
import { Trophy, Star, Target, Zap, Award, TrendingUp } from 'lucide-react';

const Gamification = ({ courseId, enrollmentId }) => {
  const { user } = useAuthStore();
  const [gamification, setGamification] = useState({
    level: 1,
    points: 0,
    streak: 0,
    badges: [],
    achievements: [],
  });

  useEffect(() => {
    loadGamification();
  }, [enrollmentId]);

  const loadGamification = async () => {
    try {
      const data = await getStudentGamification(user.uid, courseId);
      setGamification(data || {
        level: 1,
        points: 0,
        streak: 0,
        badges: [],
        achievements: [],
      });
    } catch (error) {
      console.error('Error loading gamification:', error);
    }
  };

  const getLevelProgress = () => {
    const pointsForNextLevel = gamification.level * 100;
    const currentLevelPoints = gamification.points % 100;
    return (currentLevelPoints / pointsForNextLevel) * 100;
  };

  const badges = [
    { id: 'first_lesson', name: 'First Steps', icon: '🎯', description: 'Complete your first lesson' },
    { id: 'quiz_master', name: 'Quiz Master', icon: '🧠', description: 'Score 100% on a quiz' },
    { id: 'week_warrior', name: 'Week Warrior', icon: '⚡', description: 'Complete a full week' },
    { id: 'streak_7', name: '7 Day Streak', icon: '🔥', description: 'Learn for 7 days straight' },
    { id: 'assignment_ace', name: 'Assignment Ace', icon: '📝', description: 'Submit all assignments on time' },
    { id: 'helper', name: 'Helpful Hand', icon: '🤝', description: 'Help other students' },
  ];

  return (
    <div className="space-y-4">
      {/* Level and Points */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold">Level {gamification.level}</h3>
            <p className="text-blue-100">{gamification.points} XP</p>
          </div>
          <Trophy size={48} className="text-yellow-300" />
        </div>
        <div className="w-full bg-white/20 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-yellow-400 to-yellow-200 h-3 rounded-full transition-all duration-500"
            style={{ width: `${getLevelProgress()}%` }}
          />
        </div>
        <p className="text-sm text-blue-100 mt-2">
          {Math.ceil((gamification.level * 100) - (gamification.points % 100))} XP to next level
        </p>
      </div>

      {/* Streak */}
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold text-white mb-1">Daily Streak</h4>
            <p className="text-gray-400 text-sm">Keep learning every day!</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-1">🔥</div>
            <p className="text-2xl font-bold text-white">{gamification.streak}</p>
            <p className="text-xs text-gray-400">days</p>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Award size={20} className="text-yellow-400" />
          Badges Earned
        </h4>
        <div className="grid grid-cols-3 gap-3">
          {badges.map((badge) => {
            const earned = gamification.badges?.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`p-3 rounded-xl border text-center transition-all ${
                  earned
                    ? 'border-yellow-500/50 bg-yellow-500/10'
                    : 'border-white/10 bg-white/5 opacity-50'
                }`}
                title={badge.description}
              >
                <div className="text-3xl mb-1">{badge.icon}</div>
                <p className="text-xs text-white font-medium">{badge.name}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Star size={20} className="text-purple-400" />
          Recent Achievements
        </h4>
        {gamification.achievements && gamification.achievements.length > 0 ? (
          <div className="space-y-2">
            {gamification.achievements.slice(0, 5).map((achievement, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
              >
                <Zap size={18} className="text-yellow-400" />
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{achievement.title}</p>
                  <p className="text-gray-400 text-xs">{achievement.description}</p>
                </div>
                <span className="text-green-400 text-sm font-semibold">+{achievement.points} XP</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-4">Complete lessons to earn achievements!</p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 text-center">
          <Target size={24} className="text-blue-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{gamification.lessonsCompleted || 0}</p>
          <p className="text-sm text-gray-400">Lessons Done</p>
        </div>
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 text-center">
          <TrendingUp size={24} className="text-green-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{gamification.quizzesPassed || 0}</p>
          <p className="text-sm text-gray-400">Quizzes Passed</p>
        </div>
      </div>
    </div>
  );
};

export default Gamification;
