'use client'

import { useState, useEffect } from 'react';
import { Range } from 'react-range';
import Image from "next/image";
import styles from "./page.module.css";
import data from './data/data.json';

const STEP = 1;

export default function Home() {
  const [sortBy, setSortBy] = useState('name');
  const [selected4CHT, setSelected4CHT] = useState('all');
  const [selectedMedium, setSelectedMedium] = useState('all');
  const [selectedPeriodName, setSelectedPeriodName] = useState('all');
  const [onlyLowDifficulty, setOnlyLowDifficulty] = useState(false);

  const periods = data.map(item => item.period);
  const realMin = Math.min(...periods);
  const realMax = Math.max(...periods);
  const [periodRange, setPeriodRange] = useState([realMin, realMax]);

  const CHTs = Array.from(new Set(data.map(item => item["4cht"])));
  const mediums = Array.from(new Set(data.map(item => item.medium)));
  const periodNames = Array.from(new Set(data.map(item => item["period-name"])));

  const sortedData = [...data].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'period') return a.period - b.period;
    return 0;
  });

  // Filter by period and medium
  const filteredData = sortedData.filter(item =>
    item.period >= periodRange[0] &&
    item.period <= periodRange[1] &&
    (selected4CHT === 'all' || item["4cht"] === selected4CHT) && (selectedMedium === 'all' || item.medium === selectedMedium) && (selectedPeriodName === 'all' || item["period-name"] === selectedPeriodName) && (!onlyLowDifficulty || item.difficulty === 'low')
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
          <label htmlFor="4CHT">Filter by 4CHT: </label>
          <select
            id="4CHT"
            value={selected4CHT}
            onChange={(e) => setSelected4CHT(e.target.value)}
            style={{ marginLeft: '0.5rem', padding: '0.5rem' }}
          >
            <option value="all">All</option>
            {CHTs.map((medium) => (
              <option key={medium} value={medium}>
                {medium}
              </option>
            ))}
          </select>
        </div>

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
          <label>Period range: {periodRange[0]} – {periodRange[1]}</label>
          <Range
            step={STEP}
            min={realMin}
            max={realMax}
            values={periodRange}
            onChange={(values) => setPeriodRange(values)}
            renderTrack={({ props, children }) => {
              const { key, ...restProps } = props;
              return (
                <div
                  key={key}
                  {...restProps}
                  style={{
                    ...restProps.style,
                    height: '6px',
                    background: '#ddd',
                    margin: '1rem 0',
                    borderRadius: '4px'
                  }}
                >
                  {children}
                </div>
              );
            }}
            renderThumb={({ props, index }) => {
              const { key, ...restProps } = props;
              return (
                <div
                  key={key}
                  {...restProps}
                  style={{
                    ...restProps.style,
                    height: '25px',
                    width: '25px',
                    backgroundColor: '#976463',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 2px black',
                  }}
                >
                  <div style={{ color: 'white', fontSize: '10px' }}>{periodRange[index]}</div>
                </div>
              );
            }}
          />
        </div>      
      </div>

      <div className={styles.cards}>
        {filteredData.map(item => (
          <div key={item.id} className={styles.card}>
            <strong>{item.name}</strong>
            <div>
              <p>Year: {item.period}</p>
              <p>4CHT: {item["4cht"]}</p>
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
