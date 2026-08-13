import { getLocalStorageItem, setLocalStorageItem } from './localStorage';

describe('localStorage utils', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('returns the fallback when the key is not set', () => {
    expect(getLocalStorageItem('missing-key', 'fallback')).toBe('fallback');
  });

  it('round-trips a stored value', () => {
    setLocalStorageItem('key', { view: 'grid' });

    expect(getLocalStorageItem('key', { view: 'table' })).toEqual({ view: 'grid' });
  });

  it('returns the fallback when the stored value is not valid JSON', () => {
    window.localStorage.setItem('key', 'not-json');

    expect(getLocalStorageItem('key', 'fallback')).toBe('fallback');
  });
});
