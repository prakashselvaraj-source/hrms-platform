"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Milestone, Target } from 'lucide-react';

function CareerHistory() {
    const [history, setHistory] = useState([]);

    return (
        <div className="flex flex-col h-full bg-transparent p-10">
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-24 h-24 rounded-[32px] bg-white dark:bg-slate-800 shadow-2xl shadow-brand-primary/10 flex items-center justify-center mb-8 group"
                >
                    <Milestone size={40} className="text-brand-primary opacity-20 group-hover:rotate-12 transition-transform duration-500" />
                </motion.div>
                <h4 className="text-2xl font-black tracking-tight" style={{ color: "var(--text-primary)" }}>Your Journey Awaits</h4>
                <p className="text-[15px] font-medium opacity-40 mt-3 max-w-[320px] leading-relaxed">
                    This is where your professional milestones will be recorded. Every promotion and role change tells a story of growth.
                </p>
                
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-10 px-8 py-3 rounded-2xl bg-brand-primary/5 text-brand-primary text-[12px] font-black uppercase tracking-widest hover:bg-brand-primary/10 transition-all flex items-center gap-2"
                >
                    <Target size={14} />
                    View Growth Roadmap
                </motion.button>
            </div>
        </div>
    );
}

export default CareerHistory;