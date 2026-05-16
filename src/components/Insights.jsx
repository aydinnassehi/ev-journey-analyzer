import { Lightbulb, TrendingUp, TrendingDown, Award, Zap, DollarSign } from 'lucide-react';

function Insights({ analysis, journeys }) {
  const insights = generateInsights(analysis, journeys);

  return (
    <div className="insights-container">
      <h3 className="insights-title">
        <Lightbulb size={24} />
        Key Insights
      </h3>
      <div className="insights-grid">
        {insights.map((insight, i) => (
          <div key={i} className="insight-card" style={{ borderLeftColor: insight.color }}>
            <div className="insight-icon" style={{ color: insight.color }}>
              {insight.icon}
            </div>
            <div className="insight-text">
              <h4>{insight.title}</h4>
              <p>{insight.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function generateInsights(analysis, journeys) {
  const insights = [];

  // Trip frequency insight
  const tripsPerWeek = (analysis.tripCount / (analysis.daysSpan / 7)).toFixed(1);
  insights.push({
    icon: <TrendingUp size={20} />,
    title: 'Driving Frequency',
    description: `You average ${tripsPerWeek} trips per week. That's about ${Math.round(analysis.tripCount / (analysis.daysSpan / 30))} trips per month across ${analysis.daysSpan} days of tracked driving.`,
    color: '#3b82f6',
  });

  // Efficiency insight
  const efficiencyLabel = analysis.avgEfficiency < 350 ? 'excellent' :
    analysis.avgEfficiency < 400 ? 'good' :
    analysis.avgEfficiency < 450 ? 'average' : 'could be improved';
  insights.push({
    icon: <Zap size={20} />,
    title: 'Energy Efficiency',
    description: `Your average efficiency is ${analysis.avgEfficiency} Wh/mi, which is ${efficiencyLabel}. The BMW i3 typically achieves 300-400 Wh/mi depending on conditions.`,
    color: '#10b981',
  });

  // Cost savings insight
  insights.push({
    icon: <DollarSign size={20} />,
    title: 'Money Saved',
    description: `You spent ~£${analysis.electricityCost.toFixed(0)} on electricity vs ~£${analysis.petrolEquivalent.toFixed(0)} for a petrol car — saving approximately £${analysis.savings.toFixed(0)} during this period!`,
    color: '#f59e0b',
  });

  // CO2 insight
  const treesEquivalent = Math.round(analysis.co2SavedKg / 20); // ~20kg CO2 absorbed per tree per year
  insights.push({
    icon: <Award size={20} />,
    title: 'Environmental Impact',
    description: `You saved ~${analysis.co2SavedKg.toLocaleString()} kg of CO₂ compared to a petrol car. That's equivalent to planting ${treesEquivalent} trees or taking a petrol car off the road for ${Math.round(analysis.co2SavedKg / 4.6)} days.`,
    color: '#22c55e',
  });

  // Peak driving time
  const peakHour = analysis.hourlyStats.reduce((max, h) => h.count > max.count ? h : max);
  insights.push({
    icon: <TrendingUp size={20} />,
    title: 'Peak Driving Hour',
    description: `Your most common departure time is ${peakHour.hour}:00, with ${peakHour.count} trips starting around that hour. ${peakHour.hour >= 6 && peakHour.hour <= 9 ? 'Early morning commuter!' : peakHour.hour >= 16 && peakHour.hour <= 19 ? 'Afternoon/evening driver!' : 'Flexible schedule!'}`,
    color: '#8b5cf6',
  });

  // SOC insight
  insights.push({
    icon: <TrendingDown size={20} />,
    title: 'Battery Habits',
    description: `You typically start trips at ${analysis.socStats.avgStart}% SOC and end at ${analysis.socStats.avgEnd}%, using about ${analysis.socStats.avgDelta}% per trip. Your lowest recorded SOC was ${analysis.socStats.minEnd}% — ${analysis.socStats.minEnd < 20 ? 'Watch out for range anxiety!' : 'Good battery management!'}`,
    color: '#ec4899',
  });

  // Location diversity
  const uniqueStartLocations = new Set(journeys.map(j => j.startAddress.split(',')[0].trim())).size;
  insights.push({
    icon: <TrendingUp size={20} />,
    title: 'Location Diversity',
    description: `You've driven from ${uniqueStartLocations} unique starting locations. ${uniqueStartLocations > 10 ? 'You explore a wide area!' : 'Mostly driving from familiar places.'}`,
    color: '#06b6d4',
  });

  // Speed insight
  insights.push({
    icon: <TrendingUp size={20} />,
    title: 'Driving Style',
    description: `Your average trip speed is ${analysis.avgSpeed} mph with a max of ${analysis.maxSpeed} mph. ${analysis.avgSpeed < 35 ? 'Mostly urban driving!' : analysis.avgSpeed < 55 ? 'Mix of urban and highway.' : 'Significant highway driving.'}`,
    color: '#f97316',
  });

  return insights;
}

export default Insights;
