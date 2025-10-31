import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function StatsOverview() {
  const stats = useQuery(api.analytics.getOverallStats);

  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Predictions",
      value: stats.totalPredictions,
      icon: "🎯",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Accuracy Rate",
      value: `${stats.accuracy}%`,
      icon: "📊",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "ROI",
      value: `${stats.roi > 0 ? '+' : ''}${stats.roi}%`,
      icon: "💰",
      color: stats.roi > 0 ? "text-green-600" : "text-red-600",
      bgColor: stats.roi > 0 ? "bg-green-50" : "bg-red-50",
    },
    {
      title: "Total Return",
      value: `GH₵${stats.totalReturn}`,
      icon: "💵",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <div key={index} className={`${stat.bgColor} rounded-xl p-6 border`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
            <span className="text-2xl">{stat.icon}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
