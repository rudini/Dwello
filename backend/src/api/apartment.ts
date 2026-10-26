/** An apartment's Belegung, as the backend decides it by the Swiss day (#837, ADR 0005: only types here) */
export type ApartmentStatus = 'occupied' | 'relet' | 'vacant' | 'reserved';
