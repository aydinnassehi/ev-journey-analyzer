import { Gauge, MapPin, Clock, Leaf } from 'lucide-react';

function SummaryCards({ analysis }) {
  const cards = [
    {
      icon: <Gauge size={24} />,
      label: 'Total Trips',
      value: analysis.tripCount.toLocaleString(),
      sub: `over ${analysis.daysSpan} days`,
      color: '#3b82f6',
    },
    {
      icon: <MapPin size={24} />,
      label: 'Total Distance',
      value: `${analysis.totalDistance.toLocaleString()} mi`,
      sub: `${analysis.avgTripDistance} mi avg/trip`,
      color: '#10b981',
    },
    {
      icon: <Clock size={24} />,
      label: 'Energy Used',
      value: `${analysis.totalEnergy.toLocaleString()} kWh`,
      sub: `${analysis.avgEfficiency} Wh/mi avg`,
      color: '#f59e0b',
    },
    {
      icon: <Leaf size={24} />,
      label: 'CO₂ Saved',
      value: `${analysis.co2SavedKg.toLocaleString()} kg`,
      sub: 'vs petrol car',
      color: '#22c55e',
    },
  ];

  return (
    <div className="summary-grid">
      {cards.map((card, i) => (
        <div key={i} className="summary-card" style={{ borderTopColor: card.color }}>
          <div className="card-icon" style={{ backgroundColor: card.color + '20', color: card.color }}>
            {card.icon}
          </div>
          <div className="card-content">
            <span className="card-label">{card.label}</span>
            <span className="card-value">{card.value}</span>
            <span className="card-sub">{card.sub}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SummaryCards;
