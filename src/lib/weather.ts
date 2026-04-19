import type { WeatherData } from '@/lib/destination-types';
import type { GeoCoordinates } from '@/lib/destination-types';

// ─── WMO Weather Code → emoji + label ────────────────────────────────────────
// https://open-meteo.com/en/docs/weather_api

function wmoToIcon(code: number): { emoji: string; label: string } {
  if (code === 0)              return { emoji: '☀️', label: 'Clear sky' };
  if (code === 1)              return { emoji: '🌤️', label: 'Mainly clear' };
  if (code === 2)              return { emoji: '⛅', label: 'Partly cloudy' };
  if (code === 3)              return { emoji: '☁️', label: 'Overcast' };
  if ([45, 48].includes(code)) return { emoji: '🌫️', label: 'Fog' };
  if ([51, 53, 55].includes(code)) return { emoji: '🌦️', label: 'Drizzle' };
  if ([61, 63, 65].includes(code)) return { emoji: '🌧️', label: 'Rain' };
  if ([71, 73, 75].includes(code)) return { emoji: '❄️', label: 'Snow' };
  if ([80, 81, 82].includes(code)) return { emoji: '🌦️', label: 'Rain showers' };
  if ([95, 96, 99].includes(code)) return { emoji: '⛈️', label: 'Thunderstorm' };
  return { emoji: '🌡️', label: 'Unknown' };
}

/**
 * Fetch current weather + 7-day forecast from Open-Meteo.
 * Completely free, no API key required.
 * https://open-meteo.com/
 */
export async function fetchOpenMeteoWeather(
  coords: GeoCoordinates
): Promise<WeatherData | null> {
  try {
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${coords.lat}` +
      `&longitude=${coords.lng}` +
      `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,apparent_temperature` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
      `&forecast_days=7` +
      `&timezone=auto` +
      `&wind_speed_unit=ms`;

    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;

    const data = await res.json();
    const current = data.current;
    const daily = data.daily;

    const currentIcon = wmoToIcon(current.weather_code);

    const forecast = (daily.time as string[]).map((date: string, i: number) => ({
      date,
      temp_min: daily.temperature_2m_min[i],
      temp_max: daily.temperature_2m_max[i],
      description: wmoToIcon(daily.weather_code[i]).label,
      icon: wmoToIcon(daily.weather_code[i]).emoji,
    }));

    return {
      current: {
        temp: current.temperature_2m,
        feels_like: current.apparent_temperature,
        description: currentIcon.label,
        icon: currentIcon.emoji,
        humidity: current.relative_humidity_2m,
        wind_speed: current.wind_speed_10m,
      },
      forecast,
    };
  } catch (err) {
    console.error('[fetchOpenMeteoWeather]', err);
    return null;
  }
}
