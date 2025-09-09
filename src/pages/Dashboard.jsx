import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Users,
  MapPin,
  Router,
  DollarSign,
  Globe,
  Star,
  TrendingUp
} from 'lucide-react';

import GlassCard, { ChartCard } from '../components/common/GlassCard';
import { dashboardService } from '../services/dashboard';

// Mock data - replace with real API calls
const mockDashboardData = {
  metrics: {
    activeUsers: { value: 1247, change: 5.2 },
    zones: { value: 12, change: 0 },
    sdtTerminals: { value: 47, change: 2.1 },
    revenue: { value: '৳45.2K', change: 12.8 }
  },
  onlineUsersByInterface: [
    { interface: 'PPPoE', users: 856, percentage: 68.7, gradient: 'from-blue-400 to-cyan-400' },
    { interface: 'DHCP', users: 291, percentage: 23.3, gradient: 'from-emerald-400 to-green-400' },
    { interface: 'Static', users: 100, percentage: 8.0, gradient: 'from-purple-400 to-pink-400' }
  ],
  zones: [
    { id: 1, name: 'Mongla', customers: 450, online: 387, revenue: 225000, performance: 98.5, trend: 'up' },
    { id: 2, name: 'Dhaka North', customers: 820, online: 756, revenue: 410000, performance: 95.2, trend: 'up' },
    { id: 3, name: 'Chittagong', customers: 630, online: 592, revenue: 315000, performance: 97.8, trend: 'down' }
  ]
};

const MetricsGrid = ({ metrics, loading }) => {
  const metricItems = [
    {
      title: "Active Users",
      value: metrics?.activeUsers?.value?.toLocaleString() || '0',
      change: metrics?.activeUsers?.change,
      icon: Users,
      gradient: "from-emerald-400 to-green-400"
    },
    {
      title: "Network Zones",
      value: metrics?.zones?.value?.toString() || '0',
      change: metrics?.zones?.change,
      icon: MapPin,
      gradient: "from-blue-400 to-cyan-400"
    },
    {
      title: "SDT Terminals",
      value: metrics?.sdtTerminals?.value?.toString() || '0',
      change: metrics?.sdtTerminals?.change,
      icon: Router,
      gradient: "from-purple-400 to-pink-400"
    },
    {
      title: "Revenue Today",
      value: metrics?.revenue?.value || '৳0',
      change: metrics?.revenue?.change,
      icon: DollarSign,
      gradient: "from-yellow-400 to-orange-400"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricItems.map((metric, index) => (
        <GlassCard
          key={index}
          title={metric.title}
          value={metric.value}
          change={metric.change}
          icon={metric.icon}
          gradient={metric.gradient}
          loading={loading}
        />
      ))}
    </div>
  );
};

const InterfaceDistribution = ({ data, loading }) => {
  if (loading) {
    return (
      <ChartCard 
        title="Interface Distribution" 
        icon={Globe}
        gradient="from-purple-400 to-pink-400"
      >
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-white/20 light:bg-gray-300 rounded-full"></div>
                  <div className="h-4 bg-white/20 light:bg-gray-300 rounded w-16"></div>
                </div>
                <div className="h-4 bg-white/20 light:bg-gray-300 rounded w-12"></div>
              </div>
              <div className="w-full bg-white/10 light:bg-gray-200 rounded-full h-3"></div>
            </div>
          ))}
        </div>
      </ChartCard>
    );
  }

  return (
    <ChartCard 
      title="Interface Distribution" 
      icon={Globe}
      gradient="from-purple-400 to-pink-400"
    >
      <div className="space-y-6">
        {data?.map((item, index) => (
          <div key={index} className="group/item">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${item.gradient} shadow-lg`}></div>
                <span className="text-white light:text-gray-900 font-semibold">{item.interface}</span>
              </div>
              <div className="text-right">
                <p className="text-white light:text-gray-900 font-bold text-lg">{item.users}</p>
                <p className="text-white/60 light:text-gray-600 text-sm">{item.percentage}%</p>
              </div>
            </div>
            
            <div className="relative">
              <div className="w-full bg-white/10 light:bg-gray-200 rounded-full h-3 backdrop-blur-sm">
                <div 
                  className={`h-3 rounded-full bg-gradient-to-r ${item.gradient} transition-all duration-1000 ease-out shadow-lg`}
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
              <div className={`absolute top-0 left-0 h-3 w-full bg-gradient-to-r ${item.gradient} rounded-full opacity-30 blur-sm transition-opacity group-hover/item:opacity-50`}></div>
            </div>
          </div>
        ))}
      </div>
    </ChartCard>
  );
};

const ZonePerformance = ({ zones, loading }) => {
  if (loading) {
    return (
      <ChartCard 
        title="Zone Performance" 
        icon={Star}
        gradient="from-blue-400 to-cyan-400"
      >
        <div className="space-y-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="backdrop-blur-md bg-white/5 light:bg-gray-100 border border-white/10 light:border-gray-200 p-5 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-white/20 light:bg-gray-300 rounded-full"></div>
                    <div className="h-5 bg-white/20 light:bg-gray-300 rounded w-24"></div>
                  </div>
                  <div className="h-4 bg-white/20 light:bg-gray-300 rounded w-12"></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="h-3 bg-white/20 light:bg-gray-300 rounded w-16"></div>
                    <div className="h-4 bg-white/20 light:bg-gray-300 rounded w-12"></div>
                  </div>
                  <div className="space-y-1">
                    <div className="h-3 bg-white/20 light:bg-gray-300 rounded w-16"></div>
                    <div className="h-4 bg-white/20 light:bg-gray-300 rounded w-16"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ChartCard>
    );
  }

  return (
    <ChartCard 
      title="Zone Performance" 
      icon={Star}
      gradient="from-blue-400 to-cyan-400"
    >
      <div className="space-y-5">
        {zones?.slice(0, 3).map(zone => (
          <div key={zone.id} className="group/zone relative">
            <div className="backdrop-blur-md bg-white/5 light:bg-gray-50 border border-white/10 light:border-gray-200 p-5 rounded-2xl hover:bg-white/10 light:hover:bg-gray-100 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    zone.performance > 95 ? 'bg-green-400' : 'bg-yellow-400'
                  } animate-pulse shadow-lg`}></div>
                  <span className="text-white light:text-gray-900 font-bold text-lg">{zone.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`p-1 rounded-full ${
                    zone.trend === 'up' ? 'bg-green-500/20 light:bg-green-100' : 'bg-red-500/20 light:bg-red-100'
                  }`}>
                    <TrendingUp className={`w-4 h-4 ${
                      zone.trend === 'up' ? 'text-green-400 light:text-green-600' : 'text-red-400 light:text-red-600 rotate-180'
                    }`} />
                  </div>
                  <span className="text-white/70 light:text-gray-600 text-sm">{zone.performance}%</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-white/50 light:text-gray-500 text-xs uppercase tracking-wider">Connectivity</p>
                  <p className="text-white light:text-gray-900 font-semibold">{zone.online}/{zone.customers}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-white/50 light:text-gray-500 text-xs uppercase tracking-wider">Revenue</p>
                  <p className="text-white light:text-gray-900 font-semibold">৳{(zone.revenue/1000).toFixed(0)}K</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ChartCard>
  );
};

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(mockDashboardData);
  
  // In a real app, you'd use React Query for data fetching
  const { isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardService.getDashboardData(),
    refetchInterval: 30000, // Refetch every 30 seconds
    initialData: mockDashboardData
  });

  useEffect(() => {
    // For now, use mock data
    setDashboardData(mockDashboardData);
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-400 text-2xl">⚠</span>
          </div>
          <h3 className="text-xl font-semibold text-white light:text-gray-900 mb-2">
            Failed to load dashboard
          </h3>
          <p className="text-white/60 light:text-gray-600">
            Please check your connection and try again
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 light:from-gray-900 light:via-indigo-800 light:to-purple-800 bg-clip-text text-transparent mb-3">
            System Overview
          </h2>
          <p className="text-white/60 light:text-gray-600 text-lg">
            Real-time network monitoring and analytics dashboard
          </p>
        </div>
        <div className="backdrop-blur-md bg-gradient-to-r from-green-500/20 to-emerald-500/20 light:from-green-500/10 light:to-emerald-500/10 border border-green-400/30 light:border-green-400/20 px-6 py-3 rounded-2xl shadow-xl">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white light:text-green-700 font-semibold">
              All Systems Operational
            </span>
          </div>
        </div>
      </div>
      
      {/* Metrics Grid */}
      <MetricsGrid metrics={dashboardData.metrics} loading={isLoading} />
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <InterfaceDistribution data={dashboardData.onlineUsersByInterface} loading={isLoading} />
        <ZonePerformance zones={dashboardData.zones} loading={isLoading} />
      </div>
    </div>
  );
};

export default Dashboard;

