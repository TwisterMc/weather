import React from 'react';
import './WeatherCard.css';

export interface WeatherCardProps {
  title: string;
  iconUrl: string | null;
  condition: string;
  temperature: number | string | null;
  feelsLike: number | string | null;
  wind: number | string | null;
  precipitation: number | string | null;
  loading: boolean;
  error: string | null;
  unitSymbol: string;
  windLabel: string;
  windUnit: string;
  precipitationLabel: string;
}

export default function WeatherCard({
  title,
  iconUrl,
  condition,
  temperature,
  feelsLike,
  wind,
  precipitation,
  loading,
  error,
  unitSymbol,
  windLabel,
  windUnit,
  precipitationLabel
}: WeatherCardProps) {
  return (
    <header className="weather-card">
      <div className="weather-card__current-label">Current</div>
      <h2 className="weather-card__title">{title}</h2>
      {loading && (
        <div className="weather-card__loading-anim">
          <div className="weather-card__spinner">
            <div className="weather-card__dot"></div>
            <div className="weather-card__dot"></div>
            <div className="weather-card__dot"></div>
          </div>
          <p className="weather-card__loading">Loading...</p>
        </div>
      )}
      {!loading && error && <p className="weather-card__error">Error: {error}</p>}
      {!loading && temperature !== null && !error && (
        <>
          <div className="weather-card__icon-block">
            <span className="weather-card__icon">{iconUrl}</span>
            <span className="weather-card__condition">{condition}</span>
          </div>
          <div className="weather-card__details">
            <span className="weather-card__temp">{temperature}{unitSymbol}</span>
            <span><strong>Feels Like:</strong> <span className="weather-card__highlight">{feelsLike !== null ? feelsLike + unitSymbol : 'N/A'}</span></span>
            <span><strong>{windLabel}:</strong> <span className="weather-card__highlight">{wind !== null ? wind + ' ' + windUnit : 'N/A'}</span></span>
            <span><strong>{precipitationLabel}:</strong> <span className="weather-card__highlight">{precipitation !== null ? precipitation + '%' : 'N/A'}</span></span>
          </div>
        </>
      )}
    </header>
  );
}
