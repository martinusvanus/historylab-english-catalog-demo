'use client'

import { useState, useEffect } from 'react';
import Image from "next/image";
import styles from "./page.module.css";
import data from './data/data.json';

export default function Home() {
  const [sortBy, setSortBy] = useState('name');
  const [minPeriod, setMinPeriod] = useState(0);
  const [maxPeriod, setMaxPeriod] = useState(10);

  // Get actual min and max period from the data
  const periods = data.map(item => item.period);
  const realMin = Math.min(...periods);
  const realMax = Math.max(...periods);

  // Initialize sliders on mount
  useEffect(() => {
    setMinPeriod(realMin);
    setMaxPeriod(realMax);
  }, [realMin, realMax]);

  const sortedData = [...data].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } if (sortBy === 'period-a') {
      return a.period - b.period;
    } else if (sortBy === 'period-d') {
      return b.period - a.period;
    }
    return 0;
  });

  // Apply filtering by period
  const filteredData = sortedData.filter(
    item => item.period >= minPeriod && item.period <= maxPeriod
  );

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 style={{marginBottom: '2rem'}}>Catalog demo</h1>

        <label htmlFor="sort" style={{ marginRight: '0.5rem' }}>
          Sort by:
        </label>
        <select
          id="sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ marginBottom: '1.5rem', padding: '0.5rem' }}
        >
          <option value="name">Name (A–Z)</option>
          <option value="period-a">Period (ascending)</option>
          <option value="period-d">Period (descending)</option>
        </select>

        <div style={{ marginBottom: '2rem' }}>
          <label>
            Period range: {minPeriod} – {maxPeriod}
          </label>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <input
              type="range"
              min={realMin}
              max={realMax}
              value={minPeriod}
              onChange={(e) =>
                setMinPeriod(Math.min(Number(e.target.value), maxPeriod))
              }
            />
            <input
              type="range"
              min={realMin}
              max={realMax}
              value={maxPeriod}
              onChange={(e) =>
                setMaxPeriod(Math.max(Number(e.target.value), minPeriod))
              }
            />
          </div>
        </div>        
      </div>

      <div className={styles.cards}>
        {filteredData.map(item => (
          <div key={item.id} className={styles.card}>
            <strong>{item.name}</strong>
            <p>Period: {item.period}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
