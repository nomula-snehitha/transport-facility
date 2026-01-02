import { timeToTodayISO } from './time.util';

describe('timeToTodayISO', () => {
  it('returns an ISO string with today and provided hh/mm', () => {
    const iso = timeToTodayISO(9, 30);
    const d = new Date(iso);

    const now = new Date();
    expect(d.getFullYear()).toBe(now.getFullYear());
    expect(d.getMonth()).toBe(now.getMonth());
    expect(d.getDate()).toBe(now.getDate());
    expect(d.getHours()).toBe(9);
    expect(d.getMinutes()).toBe(30);
  });
});
