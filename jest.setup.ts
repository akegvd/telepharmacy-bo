import '@testing-library/jest-dom';

// jsdom does not implement matchMedia; MUI's useMediaQuery (used for
// responsive column counts, e.g. in TaskList) needs it to run in tests.
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
}
