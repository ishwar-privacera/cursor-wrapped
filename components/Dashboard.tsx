import React from 'react';
import { UsageStats } from '../types';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { Download, RefreshCcw, DollarSign, Activity, Zap, Server } from 'lucide-react';

interface DashboardProps {
  stats: UsageStats;
  onReset: () => void;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

const Card: React.FC<{ title: string; children: React.ReactNode; className?: string; delay?: number }> = ({ title, children, className = "", delay = 0 }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className={`glass-panel rounded-2xl p-6 flex flex-col ${className}`}
  >
    <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-4">{title}</h3>
    <div className="flex-1 min-h-0">
      {children}
    </div>
  </motion.div>
);

const StatItem: React.FC<{ label: string; value: string | number; icon: React.ReactNode; color: string }> = ({ label, value, icon, color }) => (
  <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
    <div className={`p-3 rounded-lg ${color} bg-opacity-20`}>
      {React.cloneElement(icon as React.ReactElement, { className: `w-6 h-6 ${color.replace('bg-', 'text-')}` })}
    </div>
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ stats, onReset }) => {
  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 pt-12 overflow-y-auto">
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto mb-12 flex justify-between items-end"
      >
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Usage <span className="gradient-text">Overview</span>
          </h1>
          <p className="text-gray-400">Deep dive into your AI statistics.</p>
        </div>
        <button 
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all text-sm"
        >
          <RefreshCcw size={16} /> Upload New
        </button>
      </motion.div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <StatItem 
            label="Total Cost" 
            value={`$${stats.totalCost.toFixed(2)}`} 
            icon={<DollarSign />} 
            color="bg-green-500" 
          />
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <StatItem 
            label="Total Requests" 
            value={stats.totalRequests} 
            icon={<Activity />} 
            color="bg-blue-500" 
          />
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <StatItem 
            label="Total Tokens" 
            value={`${(stats.totalTokens / 1000000).toFixed(2)}M`} 
            icon={<Zap />} 
            color="bg-yellow-500" 
          />
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <StatItem 
            label="Top Model" 
            value={stats.mostUsedModel.name} 
            icon={<Server />} 
            color="bg-purple-500" 
          />
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 auto-rows-[400px]">
        {/* Usage Over Time */}
        <Card title="Activity Timeline" className="lg:col-span-2" delay={0.5}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.usageOverTime}>
              <defs>
                <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#666" fontSize={12} tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, {month:'short', day:'numeric'})} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="cost" stroke="#8884d8" fillOpacity={1} fill="url(#colorCost)" name="Cost ($)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Cost by Model */}
        <Card title="Cost Distribution by Model" delay={0.6}>
           <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats.costByModel}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {stats.costByModel.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                 contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                 itemStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 flex flex-col gap-2 overflow-y-auto max-h-[150px] pr-2 custom-scrollbar">
            {stats.costByModel.map((entry, index) => (
              <div key={index} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-gray-300 truncate max-w-[150px]">{entry.name}</span>
                </div>
                <span className="font-mono">${entry.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

       <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
         {/* Token Distribution */}
         <Card title="Token Usage by Model" className="h-[400px]" delay={0.7}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={stats.tokenDistribution.slice(0, 8)}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                <XAxis type="number" stroke="#666" fontSize={12} tickFormatter={(val) => `${(val/1000000).toFixed(1)}M`} />
                <YAxis dataKey="name" type="category" width={150} stroke="#999" fontSize={11} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="value" fill="#82ca9d" radius={[0, 4, 4, 0]} name="Tokens" />
              </BarChart>
            </ResponsiveContainer>
         </Card>

         {/* Fun Stats */}
         <Card title="Summary Insights" className="h-[400px]" delay={0.8}>
           <div className="grid grid-cols-1 gap-4 h-full">
             <div className="bg-white/5 p-4 rounded-xl flex flex-col justify-center">
               <h4 className="text-gray-400 text-sm mb-1">Dominant Usage Type</h4>
               <p className="text-2xl font-bold text-indigo-400">{stats.topKind.name}</p>
               <p className="text-xs text-gray-500 mt-1">{stats.topKind.count} requests</p>
             </div>
             <div className="bg-white/5 p-4 rounded-xl flex flex-col justify-center">
               <h4 className="text-gray-400 text-sm mb-1">Avg. Cost per Request</h4>
               <p className="text-2xl font-bold text-orange-400">${stats.averageCostPerRequest}</p>
             </div>
             <div className="bg-white/5 p-4 rounded-xl flex flex-col justify-center relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <Download size={48} />
               </div>
               <h4 className="text-gray-400 text-sm mb-1">Most Productive Day</h4>
               <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-lime-400">
                 {stats.mostProductiveDay}
               </p>
             </div>
           </div>
         </Card>
       </div>

    </div>
  );
};