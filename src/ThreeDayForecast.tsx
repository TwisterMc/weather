import React, { useEffect, useState } from 'react';
import { getWeatherIcon, getConditionText } from './locationUtils';
import './ThreeDayForecast.css';

interface ThreeDayForecastProps {
  latitude: number;
  longitude: number;
}

interface ForecastDay {
  date: string;
  maxF: number | null;
  minF: number | null;
  maxC: string | null;
  minC: string | null;
  code: number;
}

export default function ThreeDayForecast({ latitude, longitude }: ThreeDayForecastProps) {
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!latitude || !longitude) return;
    setLoading(true);
    setError(null);
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weather_code&temperature_unit=fahrenheit&timezone=America%2FChicago`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch forecast');
        return res.json();
      })
      .then(data => {
        if (!data.daily || !data.daily.temperature_2m_max || !data.daily.temperature_2m_min || !data.daily.weather_code) {
          setForecast([]);
          setLoading(false);
          return;
        }
        // Only show today and next 3 days (never previous days)
        const today = new Date();
        const allDays: ForecastDay[] = data.daily.time.map((date: string, i: number) => {
          const maxF = data.daily.temperature_2m_max[i];
          const minF = data.daily.temperature_2m_min[i];
          return {
            date,
            maxF: typeof maxF === 'number' ? maxF : null,
            minF: typeof minF === 'number' ? minF : null,
            maxC: typeof maxF === 'number' ? ((maxF - 32) * 5 / 9).toFixed(1) : null,
            minC: typeof minF === 'number' ? ((minF - 32) * 5 / 9).toFixed(1) : null,
            code: data.daily.weather_code[i],
          };
        });
        // Filter out any days before today
        const filtered = allDays.filter(day => {
          const d = new Date(day.date);
          d.setHours(0,0,0,0);
          today.setHours(0,0,0,0);
          return d >= today;
        });
        setForecast(filtered.slice(0, 4));
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, [latitude, longitude]);

  function getDayLabel(dateStr: string, idx: number): string {
    const today = new Date();
    const date = new Date(dateStr);
    if (
      today.getFullYear() === date.getFullYear() &&
      today.getMonth() === date.getMonth() &&
      today.getDate() === date.getDate()
    ) {
      return 'Today';
    }
    return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  }

  return (
    <div className="three-day-forecast">
      {loading && <div style={{ color: '#888' }}>Loading forecast...</div>}
      {error && <div style={{ color: '#e74c3c' }}>Error: {error}</div>}
      {!loading && !error && (
        <div className="three-day-forecast__row">
          {forecast.map((day, idx) => (
            <div
              key={day.date}
              className={`three-day-forecast__card`}
            >
              <div className={`three-day-forecast__date${idx === 0 ? ' three-day-forecast__date--today' : ''}`}>{getDayLabel(day.date, idx)}</div>
              <div className="three-day-forecast__icon">{getWeatherIcon(day.code)}</div>
              <div className="three-day-forecast__condition">{getConditionText(day.code)}</div>
              {(day.maxF !== null && day.minF !== null) ? (
                <div className="three-day-forecast__temps">
                  <span><span style={{ fontWeight: 700 }}>{Math.round(day.maxF)}°F</span> / <span style={{ fontWeight: 500 }}>{Math.round(day.minF)}°F</span></span>
                  <span className="three-day-forecast__temps-c"><span style={{ fontWeight: 700 }}>{day.maxC}°C</span> / <span style={{ fontWeight: 500 }}>{day.minC}°C</span></span>
                </div>
              ) : (
                <div className="three-day-forecast__na">N/A</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}