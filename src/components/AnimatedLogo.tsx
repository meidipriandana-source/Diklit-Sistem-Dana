import React from 'react';
import { motion } from 'motion/react';
import { User } from 'lucide-react';

export default function AnimatedLogo() {
  return (
    <motion.div 
      className="p-2 bg-white/20 rounded-xl shadow-lg border border-white/30 backdrop-blur-md relative overflow-hidden"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        animate={{ 
          y: [0, -3, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        <User className="w-8 h-8 text-white stroke-[2.5]" />
      </motion.div>
      
      {/* Decorative circles */}
      <motion.div 
        className="absolute -top-1 -right-1 w-3 h-3 bg-blue-300 rounded-full opacity-50"
        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.div 
        className="absolute -bottom-1 -left-1 w-2 h-2 bg-emerald-300 rounded-full opacity-50"
        animate={{ scale: [1, 2, 1], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
      />
    </motion.div>
  );
}
