import { useState, useMemo } from 'react';

function JourneyTable({ journeys }) {
  const [sortBy, setSortBy] = useState('startDate');
  const [sortDir, setSortDir] = useState('desc');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const pageSize = 25;

  const filtered = useMemo(() => {
    let sorted = [...journeys];

    if (search) {
      const q = search.toLowerCase();
      sorted = sorted.filter(j =>
        j.startAddress.toLowerCase().includes(q) ||
        j.endAddress.toLowerCase().includes(q) ||
        j.category.toLowerCase().includes(q)
      );
    }

    sorted.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [journeys, sortBy, sortDir, search]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);

  const handleSort = (col) => {
    if (sortBy === col) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(col);
      setSortDir('asc');
    }
    setPage(0);
  };

  const SortIcon = ({ col }) => {
    if (sortBy !== col) return <span className="sort-icon">↕</span>;
    return <span className="sort-icon">{sortDir === 'asc' ? '↑' : '↓'}</span>;
  };

  const columns = [
    { key: 'startDate', label: 'Date' },
    { key: 'distance', label: 'Dist (mi)' },
    { key: 'consumption', label: 'kWh' },
    { key: 'efficiency', label: 'Wh/mi' },
    { key: 'duration', label: 'Min' },
    { key: 'socStart', label: 'SOC%' },
    { key: 'category', label: 'Category' },
  ];

  return (
    <div className="table-container">
      <div className="table-controls">
        <input
          type="text"
          placeholder="Search addresses or categories..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          className="search-input"
        />
        <span className="result-count">{filtered.length} trips</span>
      </div>

      <div className="table-scroll">
        <table className="journey-table">
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.key} onClick={() => handleSort(col.key)}>
                  {col.label} <SortIcon col={col.key} />
                </th>
              ))}
              <th>From</th>
              <th>To</th>
            </tr>
          </thead>
          <tbody>
            {paged.map(trip => (
              <tr key={trip.id}>
                <td>{trip.startDate.toLocaleDateString()}</td>
                <td>{trip.distance.toFixed(1)}</td>
                <td>{trip.consumption.toFixed(2)}</td>
                <td>{trip.efficiency.toFixed(0)}</td>
                <td>{Math.round(trip.duration)}</td>
                <td>
                  <span className={`soc-badge soc-${trip.socEnd < 20 ? 'low' : trip.socEnd < 40 ? 'med' : 'high'}`}>
                    {trip.socStart}% → {trip.socEnd}%
                  </span>
                </td>
                <td><span className="category-badge">{trip.category}</span></td>
                <td className="address-cell">{trip.startAddress.split(',')[0]}</td>
                <td className="address-cell">{trip.endAddress.split(',')[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 0} onClick={() => setPage(p => p - 1)}>← Prev</button>
          <span>Page {page + 1} of {totalPages}</span>
          <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      )}
    </div>
  );
}

export default JourneyTable;
