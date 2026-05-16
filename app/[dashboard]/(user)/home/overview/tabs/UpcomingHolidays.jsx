"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PartyPopper, Sparkles } from 'lucide-react';

function UpcomingHolidays() {
    const [holidays, setHolidays] = useState([]);

    return (
        <div className="flex flex-col h-full bg-transparent p-10">
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    className="w-24 h-24 rounded-[32px] bg-white dark:bg-slate-800 shadow-2xl shadow-brand-primary/10 flex items-center justify-center mb-8 relative group"
                >
                    <PartyPopper size={40} className="text-brand-primary opacity-20 group-hover:scale-110 transition-transform duration-500" />
                    <motion.div 
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -top-2 -right-2 text-brand-primary"
                    >
                        <Sparkles size={20} />
                    </motion.div>
                </motion.div>
                <h4 className="text-2xl font-black tracking-tight" style={{ color: "var(--text-primary)" }}>No Upcoming Holidays</h4>
                <p className="text-[15px] font-medium opacity-40 mt-3 max-w-[320px] leading-relaxed">
                    The calendar is clear for now. We'll update this space when the next festive season approaches!
                </p>
                
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-10 px-8 py-3 rounded-2xl bg-brand-primary/5 text-brand-primary text-[12px] font-black uppercase tracking-widest hover:bg-brand-primary/10 transition-all"
                >
                    Full Calendar View
                </motion.button>
            </div>
        </div>
    );
}

export default UpcomingHolidays;