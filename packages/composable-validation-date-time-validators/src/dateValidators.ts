import { ValueValidator } from '../validate'
import * as moment from 'moment-timezone'
import {
  DateRange,
  DateStamp,
  dateToStartOfDayMoment,
  startOfTodayMoment,
} from '../models/DateStamp'

export type TimeStamp = string

export const currentTimeStamp = moment.tz

export const timeStampInFuture: ValueValidator<TimeStamp> = (timestamp: TimeStamp) =>
    moment(timestamp).isSameOrBefore(moment()) ? ['Please enter a time in the future'] : []

export const dateInFuture = (timeZone: string): ValueValidator<DateStamp> => (date: DateStamp) =>
  dateToStartOfDayMoment(date, timeZone).isBefore(startOfTodayMoment(timeZone))
    ? ['Please enter a date in the future']
    : []

export const timeStampInPast = (timeZone: string): ValueValidator<DateStamp> => (timestamp: TimeStamp) =>
  moment(timestamp).isAfter(currentTimeStamp(timeZone)) ? ['Please enter a time in the past'] : []

export const dateInPast = (timeZone: string): ValueValidator<DateStamp> => (date: DateStamp) =>
  dateToStartOfDayMoment(date, timeZone).isSameOrAfter(startOfTodayMoment(timeZone)) ?
    ['Please enter a date in the past'] : []

export const dateOnOrBeforeToday = (timeZone: string): ValueValidator<DateStamp> => (date: DateStamp) =>
  dateToStartOfDayMoment(date, timeZone).isAfter(startOfTodayMoment(timeZone)) ?
    ['Please enter a date in the past'] : []

export const timeStampBefore = (maxTimestamp: TimeStamp): ValueValidator<TimeStamp> => {
  const maxDateTime = moment(maxTimestamp).startOf('day')
  return (timestamp: TimeStamp) =>
    moment(timestamp).isSameOrAfter(maxDateTime) ?
      [`Please enter a date before ${maxDateTime.format('Do MMMM YYYY')}`] :
      []
}

export const dateSameOrBefore = (maxDate: DateStamp, timeZone: string): ValueValidator<TimeStamp> => {
  const momentMaxDate = dateToStartOfDayMoment(maxDate, timeZone)
  return (date: DateStamp) =>
    dateToStartOfDayMoment(date, timeZone).isAfter(momentMaxDate) ?
      [`Please enter a date on or before ${momentMaxDate.format('Do MMMM YYYY')}`] :
      []
}

export const validTimeStamp: ValueValidator<TimeStamp> = (timeStamp) =>
  !moment(timeStamp).isValid() ? ['Please enter a valid date'] : []

export const validDateRange: ValueValidator<DateRange> = (dateRange) => {
  const validateFromBeforeTo = () =>
    moment(dateRange.to).isBefore(moment(dateRange.from)) ?
      ['Please enter a from date that is earlier than the to date'] :
      []
  return [ ...validTimeStamp(dateRange.from), ...validTimeStamp(dateRange.to), ...validateFromBeforeTo()]
}

export const datesOnOrBeforeToday = (timeZone: string): ValueValidator<DateRange> => (dateRange: DateRange) => ([
  ...dateOnOrBeforeToday(timeZone)(dateRange.from),
  ...dateOnOrBeforeToday(timeZone)(dateRange.to),
])

export const maxLengthInDays = (days: number, timeZone: string): ValueValidator<DateRange> =>
  (dateRange: DateRange) => {
  const maxDateAllowed = dateToStartOfDayMoment(dateRange.from, timeZone).add(days, 'days')
  return dateToStartOfDayMoment(dateRange.to, timeZone).isAfter(maxDateAllowed) ?
    [`Please enter a date range of ${days} days or less`] :
    []
}

export const maxLengthInMonths = (maxMonths: number, timeZone: string): ValueValidator<DateRange> =>
  ({ from, to }) => {
    const earliestAllowed = moment.tz(to, timeZone).subtract(1, 'months')
    return moment.tz(from, timeZone).isBefore(earliestAllowed) ?
      [`Please select dates that are less than ${maxMonths} month${maxMonths === 1 ? '' : 's'} apart`] :
      []
}
