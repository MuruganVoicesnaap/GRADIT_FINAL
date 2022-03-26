/**
 *
 * @param {string} time ex: 13:55:04 PM
 * @returns {string} return 12hr format ex: 01:55pm
 */

export const getTime = timeString => {
  if (timeString === 'FN' || !timeString) {
    return '';
  }
  const [time, a] = timeString.split(' '); // ['13:55:04' 'PM']
  // h - hour, m - minute, s - sec
  const [h, m] = time.split(':');
  const hour = `${h === '12' || h === '24' ? 12 : parseInt(h, 10) % 12}`;
  const mins = m.length === 1 ? `0${m}` : m;
  return `${hour.toString().length === 1 ? `0${hour}` : hour}:${mins}${
    a ? a.toLowerCase() : h < 12 ? 'am' : 'pm'
  }`;
};
