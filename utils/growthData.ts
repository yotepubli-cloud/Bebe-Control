// Simplified WHO Child Growth Standards for Boys (0-5 years)
// Data points: Month, P3, P15, P50, P85, P97

interface GrowthStandard {
    month: number;
    p3: number;
    p15: number;
    p50: number;
    p85: number;
    p97: number;
}

// Weight-for-age (kg)
const WHO_WEIGHT_BOYS: GrowthStandard[] = [
    { month: 0, p3: 2.5, p15: 2.9, p50: 3.3, p85: 3.9, p97: 4.4 },
    { month: 1, p3: 3.4, p15: 3.9, p50: 4.5, p85: 5.1, p97: 5.8 },
    { month: 2, p3: 4.3, p15: 4.9, p50: 5.6, p85: 6.3, p97: 7.1 },
    { month: 3, p3: 5.0, p15: 5.7, p50: 6.4, p85: 7.2, p97: 8.0 },
    { month: 4, p3: 5.6, p15: 6.2, p50: 7.0, p85: 7.9, p97: 8.7 },
    { month: 5, p3: 6.0, p15: 6.7, p50: 7.5, p85: 8.4, p97: 9.3 },
    { month: 6, p3: 6.4, p15: 7.1, p50: 7.9, p85: 8.8, p97: 9.8 },
    { month: 7, p3: 6.7, p15: 7.4, p50: 8.3, p85: 9.2, p97: 10.3 },
    { month: 8, p3: 6.9, p15: 7.7, p50: 8.6, p85: 9.6, p97: 10.7 },
    { month: 9, p3: 7.1, p15: 8.0, p50: 8.9, p85: 9.9, p97: 11.0 },
    { month: 10, p3: 7.4, p15: 8.2, p50: 9.2, p85: 10.2, p97: 11.4 },
    { month: 11, p3: 7.6, p15: 8.4, p50: 9.4, p85: 10.5, p97: 11.7 },
    { month: 12, p3: 7.7, p15: 8.6, p50: 9.6, p85: 10.8, p97: 12.0 },
    { month: 15, p3: 8.3, p15: 9.2, p50: 10.3, p85: 11.5, p97: 12.8 },
    { month: 18, p3: 8.8, p15: 9.8, p50: 10.9, p85: 12.2, p97: 13.7 },
    { month: 24, p3: 9.7, p15: 10.8, p50: 12.2, p85: 13.6, p97: 15.3 },
    { month: 36, p3: 11.3, p15: 12.7, p50: 14.3, p85: 16.2, p97: 18.3 },
    { month: 48, p3: 12.7, p15: 14.4, p50: 16.3, p85: 18.6, p97: 21.2 },
    { month: 60, p3: 14.1, p15: 16.0, p50: 18.3, p85: 21.0, p97: 24.2 },
];

// Length/Height-for-age (cm)
const WHO_HEIGHT_BOYS: GrowthStandard[] = [
    { month: 0, p3: 46.1, p15: 48.0, p50: 49.9, p85: 51.8, p97: 53.7 },
    { month: 1, p3: 50.8, p15: 52.8, p50: 54.7, p85: 56.7, p97: 58.6 },
    { month: 2, p3: 54.4, p15: 56.4, p50: 58.4, p85: 60.4, p97: 62.4 },
    { month: 3, p3: 57.3, p15: 59.4, p50: 61.4, p85: 63.5, p97: 65.5 },
    { month: 4, p3: 59.7, p15: 61.8, p50: 63.9, p85: 66.0, p97: 68.0 },
    { month: 5, p3: 61.7, p15: 63.8, p50: 65.9, p85: 68.0, p97: 70.1 },
    { month: 6, p3: 63.3, p15: 65.5, p50: 67.6, p85: 69.8, p97: 71.9 },
    { month: 7, p3: 64.8, p15: 67.0, p50: 69.2, p85: 71.3, p97: 73.5 },
    { month: 8, p3: 66.2, p15: 68.4, p50: 70.6, p85: 72.8, p97: 75.0 },
    { month: 9, p3: 67.5, p15: 69.7, p50: 72.0, p85: 74.2, p97: 76.5 },
    { month: 10, p3: 68.7, p15: 71.0, p50: 73.3, p85: 75.6, p97: 77.9 },
    { month: 11, p3: 69.9, p15: 72.2, p50: 74.5, p85: 76.9, p97: 79.2 },
    { month: 12, p3: 71.0, p15: 73.4, p50: 75.7, p85: 78.1, p97: 80.5 },
    { month: 15, p3: 74.1, p15: 76.6, p50: 79.1, p85: 81.7, p97: 84.2 },
    { month: 18, p3: 76.9, p15: 79.6, p50: 82.3, p85: 85.0, p97: 87.7 },
    { month: 24, p3: 81.0, p15: 84.1, p50: 87.1, p85: 90.2, p97: 93.2 },
    { month: 36, p3: 88.7, p15: 92.4, p50: 96.1, p85: 99.8, p97: 103.5 },
    { month: 48, p3: 94.9, p15: 99.1, p50: 103.3, p85: 107.5, p97: 111.7 },
    { month: 60, p3: 100.1, p15: 104.7, p50: 109.2, p85: 113.8, p97: 118.4 },
];

export const calculatePercentile = (dob: string, recordDate: string, value: number, type: 'weight' | 'height'): string => {
    const birth = new Date(dob);
    const current = new Date(recordDate);
    
    // Calculate difference in months
    let months = (current.getFullYear() - birth.getFullYear()) * 12;
    months -= birth.getMonth();
    months += current.getMonth();
    
    // Adjust if day of month is earlier
    if (current.getDate() < birth.getDate()) {
        months--;
    }

    // Ensure non-negative
    months = Math.max(0, months);

    const table = type === 'weight' ? WHO_WEIGHT_BOYS : WHO_HEIGHT_BOYS;

    // Find closest month in table
    const standard = table.reduce((prev, curr) => {
        return (Math.abs(curr.month - months) < Math.abs(prev.month - months) ? curr : prev);
    });

    if (!standard) return '-';

    if (value < standard.p3) return '<P3';
    if (value < standard.p15) return 'P3-15';
    if (value < standard.p50) return 'P15-50';
    if (value === standard.p50) return 'P50';
    if (value < standard.p85) return 'P50-85';
    if (value < standard.p97) return 'P85-97';
    return '>P97';
};

export const getPercentileLabel = (p: string) => {
    if (p.includes('50')) return 'P50';
    if (p.includes('85')) return 'P85';
    if (p.includes('97')) return 'P97';
    if (p.includes('15')) return 'P15';
    if (p.includes('3')) return 'P3';
    return p;
};

export const getPercentileColor = (p: string) => {
    if (p === 'P15-50' || p === 'P50-85' || p === 'P50') return 'text-green-500 bg-green-500/10';
    if (p === 'P3-15' || p === 'P85-97') return 'text-yellow-500 bg-yellow-500/10';
    return 'text-red-400 bg-red-500/10';
};