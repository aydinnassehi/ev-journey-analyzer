import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

function Charts({ analysis, fullView }) {
  const { dailyStats, monthlyStats, hourlyStats, weekdayStats, efficiencyByMonth, categories } = analysis;

  return (
    <div className={`charts-grid ${fullView ? 'full-view' : ''}`}>
      {/* Daily Distance Chart */}
      <div className="chart-card">
        <h3>Daily Distance</h3>
        <ResponsiveContainer width="100%" height={fullView ? 300 : 220}>
          <AreaChart data={dailyStats}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="date" tick={{ fill: '#999', fontSize: 11 }} tickFormatter={(v) => {
              const d = new Date(v);
              return `${d.getMonth()+1}/${d.getDate()}`;
            }} />
            <YAxis tick={{ fill: '#999', fontSize: 11 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #333', color: '#fff' }}
              labelStyle={{ color: '#999' }}
            />
            <Area type="monotone" dataKey="distance" stroke="#3b82f6" fill="#3b82f630" name="Distance (mi)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Overview */}
      <div className="chart-card">
        <h3>Monthly Overview</h3>
        <ResponsiveContainer width="100%" height={fullView ? 300 : 220}>
          <BarChart data={monthlyStats}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="label" tick={{ fill: '#999', fontSize: 11 }} />
            <YAxis tick={{ fill: '#999', fontSize: 11 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #333', color: '#fff' }}
            />
            <Bar dataKey="distance" fill="#10b981" name="Distance (mi)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="count" fill="#3b82f6" name="Trips" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Hourly Distribution */}
      <div className="chart-card">
        <h3>Hour of Departure</h3>
        <ResponsiveContainer width="100%" height={fullView ? 300 : 220}>
          <BarChart data={hourlyStats}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="hour" tick={{ fill: '#999', fontSize: 11 }} />
            <YAxis tick={{ fill: '#999', fontSize: 11 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #333', color: '#fff' }}
            />
            <Bar dataKey="count" fill="#f59e0b" name="Trips" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Weekday Distribution */}
      <div className="chart-card">
        <h3>Day of Week</h3>
        <ResponsiveContainer width="100%" height={fullView ? 300 : 220}>
          <BarChart data={weekdayStats}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="name" tick={{ fill: '#999', fontSize: 11 }} />
            <YAxis tick={{ fill: '#999', fontSize: 11 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #333', color: '#fff' }}
            />
            <Bar dataKey="count" fill="#8b5cf6" name="Trips" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Efficiency Trend */}
      <div className="chart-card">
        <h3>Efficiency Trend (Wh/mi)</h3>
        <ResponsiveContainer width="100%" height={fullView ? 300 : 220}>
          <LineChart data={efficiencyByMonth}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="label" tick={{ fill: '#999', fontSize: 11 }} />
            <YAxis tick={{ fill: '#999', fontSize: 11 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #333', color: '#fff' }}
            />
            <Line type="monotone" dataKey="efficiency" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Category Pie */}
      <div className="chart-card">
        <h3>Trip Categories</h3>
        <ResponsiveContainer width="100%" height={fullView ? 300 : 220}>
          <PieChart>
            <Pie
              data={Object.entries(categories).map(([name, value]) => ({ name, value }))}
              cx="50%"
              cy="50%"
              innerRadius={fullView ? 60 : 45}
              outerRadius={fullView ? 80 : 65}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {Object.keys(categories).map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #333', color: '#fff' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Charts;
