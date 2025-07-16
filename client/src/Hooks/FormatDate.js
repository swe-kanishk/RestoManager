export default function formatDate(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0'); // Months start from 0
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}