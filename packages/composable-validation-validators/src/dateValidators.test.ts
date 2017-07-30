import {
  dateInFuture,
  timeStampBefore,
  timeStampInFuture, dateOnOrBeforeToday, validDateRange, dateInPast, dateSameOrBefore, timeStampInPast,
  datesOnOrBeforeToday, maxLengthInDays, maxLengthInMonths,
} from './dateValidators';
import * as moment from 'moment';
import { today, tomorrow, yesterday } from '../models/DateStamp';

describe('dateValidators', () => {
  describe('timeStampInFuture', () => {
    it('returns error for invalid date', () => {
      const invalidDate = moment({ year: 2015 }).toISOString();
      const result = timeStampInFuture(invalidDate);
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns no error when date is valid', () => {
      const validDate = moment().add(1, 'days').toISOString();
      const result = timeStampInFuture(validDate);
      expect(result.length).toEqual(0);
    });
  });

  describe('dateInFuture', () => {
    it('returns no error for today', () => {
      const todayDate = today('UTC');
      const result = dateInFuture('UTC')(todayDate);
      expect(result.length).toEqual(0);
    });

    it('returns no error for tomorrow', () => {
      const tomorrowDate = tomorrow('UTC');
      const result = dateInFuture('UTC')(tomorrowDate);
      expect(result.length).toEqual(0);
    });

    it('returns an error for a date before today', () => {
      const date = '2017-02-06';
      const result = dateInFuture('UTC')(date);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('timeStampInPast', () => {
    it('returns error for invalid date', () => {
      const invalidDate = moment().add(1, 'days').toISOString();
      const result = timeStampInPast('UTC')(invalidDate);
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns no error when date is valid', () => {
      const validDate = moment({ year: 2015 }).toISOString();
      const result = timeStampInPast('UTC')(validDate);
      expect(result.length).toEqual(0);
    });
  });

  describe('dateInPast', () => {
    it('returns an error for today', () => {
      const todayDate = today('UTC');
      const result = dateInPast('UTC')(todayDate);
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns an error for tomorrow', () => {
      const tomorrowDate = tomorrow('UTC');
      const result = dateInPast('UTC')(tomorrowDate);
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns no error for a date before today', () => {
      const date = '2017-02-06';
      const result = dateInPast('UTC')(date);
      expect(result.length).toEqual(0);
    });
  });

  describe('dateOnOrBeforeToday', () => {
    it('returns no error for today', () => {
      const todayDate = today('UTC');
      const result = dateOnOrBeforeToday('UTC')(todayDate);
      expect(result.length).toEqual(0);
    });

    it('returns an error for tomorrow', () => {
      const tomorrowDate = tomorrow('UTC');
      const result = dateOnOrBeforeToday('UTC')(tomorrowDate);
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns no error for a date before today', () => {
      const date = '2017-02-06';
      const result = dateOnOrBeforeToday('UTC')(date);
      expect(result.length).toEqual(0);
    });
  });

  describe('timeStampBefore', () => {
    it('returns error if date beyond latest', () => {
      const latestDate = moment({ date: 1, month: 0, year: 2015 }).toISOString();
      const invalidDate = moment({ date: 2, month: 0, year: 2015 }).toISOString();

      const result = timeStampBefore(latestDate)(invalidDate);

      expect(result.length).toBeGreaterThan(0);
    });

    it('returns error if date on latest', () => {
      const latestDate = moment({ date: 1, month: 0, year: 2015, hours: 2, minutes: 30 }).toISOString();
      const invalid = moment({ date: 1, month: 0, year: 2015, hours: 2, minutes: 29 }).toISOString();

      const result = timeStampBefore(latestDate)(invalid);

      expect(result.length).toEqual(1);
    });

    it('returns no error if date before latest', () => {
      const latestDate = moment({date: 2, month: 0, year: 2015 }).toISOString();
      const validDate = moment({date: 1, month: 0, year: 2015 }).toISOString();

      const result = timeStampBefore(latestDate)(validDate);

      expect(result.length).toEqual(0);
    });
  });

  describe('dateSameOrBefore', () => {
    it('returns error if date beyond max date', () => {
      const maxDate = '2016-01-02';
      const invalidDate = '2016-02-03';
      const result = dateSameOrBefore(maxDate, 'UTC')(invalidDate);

      expect(result.length).toBeGreaterThan(0);
    });

    it('returns no error if date is max date', () => {
      const maxDate = '2016-01-02';
      const result = dateSameOrBefore(maxDate, 'UTC')(maxDate);

      expect(result.length).toBe(0);
    });

    it('returns no error if date before max date', () => {
      const maxDate = '2016-01-02';
      const validDate = '2015-02-03';

      const result = dateSameOrBefore(maxDate, 'UTC')(validDate);

      expect(result.length).toEqual(0);
    });
  });

  describe('validDateRange', () => {
    it('returns an error when from date is invalid', () => {
      const dateRange = {
        from: '2016-13-14T01:01',
        to: moment().toISOString(),
      };
      const result = validDateRange(dateRange);
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns an error when to date is invalid', () => {
      const dateRange = {
        from: moment().toISOString(),
        to: '2016-13-14T01:01',
      };
      const result = validDateRange(dateRange);
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns an error when to date is before the from date', () => {
      const dateRange = {
        from: moment('2016-01-02').toISOString(),
        to: moment('2016-01-01').toISOString(),
      };
      const result = validDateRange(dateRange);
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns no error when dates are valid and from is before to', () => {
      const dateRange = {
        from: moment('2016-01-01').toISOString(),
        to: moment('2016-01-02').toISOString(),
      };
      const result = validDateRange(dateRange);
      expect(result.length).toBe(0);
    });
  });

  describe('datesOnOrBeforeToday', () => {
    it('returns no error when date range is from today to today', () => {
      const dateRangeFromTodayToToday = { from: today('UTC'), to: today('UTC') };
      const result = datesOnOrBeforeToday('UTC')(dateRangeFromTodayToToday);
      expect(result.length).toEqual(0);
    });

    it('returns an error when date range is from tomorrow', () => {
      const dateRangeFromTomorrowToToday = { from: tomorrow('UTC'), to: today('UTC') };
      const result = datesOnOrBeforeToday('UTC')(dateRangeFromTomorrowToToday);
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns an error when date range is to tomorrow', () => {
      const dateRangeFromTodayToTomorrow = { from: today('UTC'), to: tomorrow('UTC') };
      const result = datesOnOrBeforeToday('UTC')(dateRangeFromTodayToTomorrow);
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns no error when date range is in the past', () => {
      const dateRangeInPast = { from: moment('2016-01-01').toISOString(), to: yesterday('UTC') };
      const result = datesOnOrBeforeToday('UTC')(dateRangeInPast);
      expect(result.length).toEqual(0);
    });
  });

  describe('maxLengthInDays', () => {
    it('returns an error when date range length is longer than the max length', () => {
      const dateRange = { from: '2016-01-01', to: '2016-01-04' };
      const result = maxLengthInDays(2, 'UTC')(dateRange);
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns no error when date range length is equal to the max length', () => {
      const dateRange = { from: '2016-01-01', to: '2016-01-04' };
      const result = maxLengthInDays(3, 'UTC')(dateRange);
      expect(result.length).toEqual(0);
    });

    it('returns no error when date range length is less than the max length', () => {
      const dateRange = { from: '2016-01-01', to: '2016-01-02' };
      const result = maxLengthInDays(3, 'UTC')(dateRange);
      expect(result.length).toEqual(0);
    });
  });

  describe('maxLengthInMonths', () => {
    it('returns an error when date range length is longer than the max length', () => {
      const dateRange = { from: '2016-01-01', to: '2016-02-04' };
      const result = maxLengthInMonths(1, 'UTC')(dateRange);
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns no error when date range length is equal to the max length', () => {
      const dateRange = { from: '2016-01-01', to: '2016-02-01' };
      const result = maxLengthInMonths(1, 'UTC')(dateRange);
      expect(result.length).toEqual(0);
    });

    it('returns no error when date range length is less than the max length', () => {
      const dateRange = { from: '2016-01-01', to: '2016-01-02' };
      const result = maxLengthInMonths(1, 'UTC')(dateRange);
      expect(result.length).toEqual(0);
    });
  });
});
