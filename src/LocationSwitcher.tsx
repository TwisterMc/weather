import React from 'react';
import './LocationSwitcher.css';

type LocationSwitcherProps = {
  city: string;
  state: string;
  zip: string;
  locError: string;
  isFetchingLocation: boolean;
  setCity: (city: string) => void;
  setState: (state: string) => void;
  setZip: (zip: string) => void;
  setLocError: (error: string) => void;
  setIsFetchingLocation: (fetching: boolean) => void;
  setUsedMyLocation: (used: boolean) => void;
  getLatLonFromLocation: (params: { city: string; state: string; zip: string }) => Promise<{ lat: number; lon: number }>;
  setLatitude: (lat: number) => void;
  setLongitude: (lon: number) => void;
  show: boolean;
  onClose?: () => void;
};

export default function LocationSwitcher({
  city, state, zip, locError, isFetchingLocation,
  setCity, setState, setZip, setLocError, setIsFetchingLocation, setUsedMyLocation,
  getLatLonFromLocation, setLatitude, setLongitude, show, onClose
}: LocationSwitcherProps) {
  if (!show) return null;
  return (
    <form
      id="location-switcher-form"
      onSubmit={async e => {
        e.preventDefault();
        setLocError('');
        setIsFetchingLocation(true);
        setUsedMyLocation(false);
        try {
          const result = await getLatLonFromLocation({ city, state, zip });
          setLatitude(result.lat);
          setLongitude(result.lon);
        } catch (err) {
          setLocError(err instanceof Error ? err.message : String(err));
        } finally {
          setIsFetchingLocation(false);
        }
      }}
      className="location-form"
      style={{ marginBottom: 32 }}
    >
      <div className="location-form-fields">
        <button
          type="button"
          className="location_switcher__btn location_switcher__btn__my-location"
          onClick={async () => {
            if (navigator.geolocation) {
              setIsFetchingLocation(true);
              setUsedMyLocation(true);
              navigator.geolocation.getCurrentPosition(
                (pos) => {
                  setLatitude(pos.coords.latitude);
                  setLongitude(pos.coords.longitude);
                  setIsFetchingLocation(false);
                  onClose && onClose();
                },
                (err) => {
                  setLocError('Could not get your location');
                  setIsFetchingLocation(false);
                }
              );
            } else {
              setLocError('Geolocation not supported');
            }
          }}
          aria-label="Use My Location"
        >
          <svg className="location-switcher__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" aria-hidden="true" focusable="false"><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>
          <span className="location-switcher__btn-label">Use My Location</span>
        </button>
        <div className="location-switcher__or-sub">or</div>
        <div className="location-switcher__inputs-group">
          <input
            id="city-input"
            type="text"
            value={city}
            onChange={e => setCity(e.target.value)}
            placeholder="City"
            className={`location-switcher__input${locError ? ' input-error' : ''}`}
            aria-label="City"
            autoComplete="address-level2"
          />
          <input
            id="state-input"
            type="text"
            value={state}
            onChange={e => setState(e.target.value)}
            placeholder="State"
            className={`location-switcher__input${locError ? ' input-error' : ''}`}
            aria-label="State"
            autoComplete="address-level1"
          />
          <span className="location-switcher__or-sub">or</span>
          <input
            id="zip-input"
            type="text"
            value={zip}
            onChange={e => setZip(e.target.value)}
            placeholder="Zip"
            className={`location-switcher__input${locError ? ' input-error' : ''}`}
            aria-label="Zip"
            autoComplete="postal-code"
          />
        </div>
        <button type="submit" className='location_switcher__btn location-switcher__submit-btn'>Change</button>
      </div>
      {locError && <span className="location-error" role="alert">{locError}</span>}
    </form>
  );
}
