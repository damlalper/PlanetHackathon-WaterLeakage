// Format number with comma separators
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

// Format date to readable string
export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Calculate percentage
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return (value / total) * 100;
};

// Truncate text
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Generate random color
export const generateRandomColor = (): string => {
  const colors = ['#1565C0', '#42A5F5', '#81C784', '#FFB74D', '#E57373', '#BA68C8'];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Calculate water savings estimate
export const calculateWaterSavings = (leaksDetected: number, avgLeakRate: number = 100): number => {
  // Assuming avg leak rate in liters per day
  return leaksDetected * avgLeakRate * 30; // Monthly savings in liters
};

// Calculate carbon reduction estimate
export const calculateCarbonReduction = (waterSaved: number): number => {
  // Rough estimate: 0.0004 kg CO2 per liter of water
  return waterSaved * 0.0004;
};

export default {
  formatNumber,
  formatDate,
  calculatePercentage,
  truncateText,
  generateRandomColor,
  debounce,
  calculateWaterSavings,
  calculateCarbonReduction,
};
