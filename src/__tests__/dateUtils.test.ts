import { describe, it, expect } from 'vitest';
import { formatDate } from '../lib/dateUtils';

describe('formatDate Utility', () => {
    it('should format a valid date string correctly', () => {
        const input = '2026-02-22';
        const output = formatDate(input);
        expect(output).toBe('Feb 22, 2026');
    });

    it('should format a Date object correctly', () => {
        const input = new Date('2026-03-10');
        const output = formatDate(input);
        expect(output).toBe('Mar 10, 2026');
    });

    it('should return an empty string for null or undefined', () => {
        expect(formatDate('')).toBe('');
        // @ts-ignore - testing null/undefined cases
        expect(formatDate(null)).toBe('');
    });

    it('should return "Invalid Date" for an invalid date string', () => {
        // Basic Date constructor behavior: new Date('invalid') results in "Invalid Date" string from Intl.DateTimeFormat
        const output = formatDate('not-a-date');
        expect(output).toBe('Invalid Date');
    });
});
