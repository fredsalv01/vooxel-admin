const moment = require('moment-timezone');

export const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export function dateFormatValidator(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const date = new Date(value);
  return !isNaN(date.getTime());
}

export function Moment(date: string): string {
  return moment(date).tz('America/Lima').format('YYYY-MM-DD');
}
