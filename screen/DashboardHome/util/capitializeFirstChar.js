export default function capitializeFirstChar(str = '') {
  return (str || '')
    .split(' ')
    .map(a => {
      return `${(a.charAt(0) || '').toUpperCase()}${a.slice(1)}`;
    })
    .join(' ');
}
