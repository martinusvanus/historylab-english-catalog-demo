'use client'

import { useState, useEffect } from 'react';
import Image from "next/image";
import styles from "./page.module.css";
import data from './data/data.json';

export default function Home() {
  const [sortBy, setSortBy] = useState('name');
  const [minPeriod, setMinPeriod] = useState(0);
  const [maxPeriod, setMaxPeriod] = useState(10);
  const [selectedMedium, setSelectedMedium] = useState('all');
  const [selectedPeriodName, setSelectedPeriodName] = useState('all');
  const [onlyLowDifficulty, setOnlyLowDifficulty] = useState(false);

  // Get actual min and max period from the data
  const periods = data.map(item => item.period);
  const mediums = Array.from(new Set(data.map(item => item.medium)));
  const periodNames = Array.from(new Set(data.map(item => item["period-name"])));
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

  // Filter by period and medium
  const filteredData = sortedData.filter(item =>
    item.period >= minPeriod &&
    item.period <= maxPeriod &&
    (selectedMedium === 'all' || item.medium === selectedMedium) && (selectedPeriodName === 'all' || item["period-name"] === selectedPeriodName) && (!onlyLowDifficulty || item.difficulty === 'low')
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

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="medium">Filter by medium: </label>
          <select
            id="medium"
            value={selectedMedium}
            onChange={(e) => setSelectedMedium(e.target.value)}
            style={{ marginLeft: '0.5rem', padding: '0.5rem' }}
          >
            <option value="all">All</option>
            {mediums.map((medium) => (
              <option key={medium} value={medium}>
                {medium}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="period-name">Filter by period name: </label>
          <select
            id="period-name"
            value={selectedPeriodName}
            onChange={(e) => setSelectedPeriodName(e.target.value)}
            style={{ marginLeft: '0.5rem', padding: '0.5rem' }}
          >
            <option value="all">All</option>
            {periodNames.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>
            <input
              type="checkbox"
              checked={onlyLowDifficulty}
              onChange={(e) => setOnlyLowDifficulty(e.target.checked)}
              style={{ marginRight: '0.5rem' }}
            />
            Low difficulty only
          </label>
        </div>

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
            <div>
              <p>Year: {item.period}</p>
              <p>Period: {item["period-name"]}</p>
              <p>Main medium: {item.medium}</p>
              <p>Difficulty: {item.difficulty}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
