import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, TrendingUp, Bell } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const AnimatedDashboardPreview = () => {
  const { isDarkMode } = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
      },
    },
  };

  const jiggleVariants = {
    animate: {
      x: [0, -2, 2, -2, 0],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatDelay: 3,
      },
    },
  };

  const floatVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: 'loop',
      },
    },
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
      },
    },
  };

  const stats = [
    { label: 'Total Tasks', value: '24', icon: CheckCircle, color: 'text-indigo-600' },
    { label: 'In Progress', value: '8', icon: Clock, color: 'text-yellow-500' },
    { label: 'Completed', value: '16', icon: CheckCircle, color: 'text-green-500' },
  ];

  return (
    <motion.div
      className={`relative h-96 rounded-2xl overflow-hidden ${isDarkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 40% 40%, rgba(99, 102, 241, 0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.3) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: 'loop',
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-8 h-full flex flex-col justify-between">
        {/* Header with jigging notification */}
        <motion.div className="flex items-center justify-between" variants={itemVariants}>
          <div>
            <motion.h3 className="text-lg font-bold text-gray-900 dark:text-white" variants={jiggleVariants}>
              Dashboard
            </motion.h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Welcome back!
            </p>
          </div>
          <motion.div
            className="relative"
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatDelay: 2,
            }}
          >
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <Bell size={20} className="text-indigo-600" />
            </div>
            <motion.div
              className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                duration: 1,
                repeat: Infinity,
              }}
            />
          </motion.div>
        </motion.div>

        {/* Stats cards with floating and pulsing */}
        <motion.div className="grid grid-cols-3 gap-3" variants={containerVariants}>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-white/70'} backdrop-blur-sm border ${isDarkMode ? 'border-gray-600/50' : 'border-white/50'}`}
                variants={itemVariants}
                animate={index === 1 ? 'animate' : 'initial'}
                whileHover={{ scale: 1.05 }}
                custom={index}
              >
                <motion.div
                  className="flex items-center gap-2 mb-2"
                  animate={index === 0 ? 'animate' : 'initial'}
                  variants={floatVariants}
                >
                  <Icon size={16} className={stat.color} />
                  <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {stat.label}
                  </span>
                </motion.div>
                <motion.p
                  className="text-xl font-bold text-gray-900 dark:text-white"
                  animate={index === 2 ? 'animate' : 'initial'}
                  variants={pulseVariants}
                >
                  {stat.value}
                </motion.p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Progress bar with animation */}
        <motion.div variants={itemVariants} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Weekly Progress
            </span>
            <span className="text-xs font-bold text-indigo-600">67%</span>
          </div>
          <motion.div
            className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600"
              initial={{ width: 0 }}
              animate={{ width: '67%' }}
              transition={{
                duration: 1.5,
                delay: 0.8,
                ease: 'easeOut',
              }}
            />
          </motion.div>
        </motion.div>

        {/* Floating particles */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-indigo-400 rounded-full opacity-50"
            initial={{
              x: Math.random() * 100,
              y: Math.random() * 100,
            }}
            animate={{
              x: Math.random() * 300,
              y: Math.random() * 300,
              opacity: [0.3, 0.6, 0],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              repeatType: 'loop',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default AnimatedDashboardPreview;
