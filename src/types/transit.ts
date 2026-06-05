export type TransportMode = 'bus' | 'train' | 'taxi';

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type Stop = {
  id: string;
  name: string;
  coordinates: Coordinates;
  mode: 'bus' | 'train';
};

export type Line = {
  id: string;
  name: string;
  number: string;
  mode: 'bus' | 'train';
  stopIds: string[];
  basePrice: number;
};

export type Departure = {
  id: string;
  lineId: string;
  stopId: string;
  time: Date;
  destination: string;
  price: number;
};

export type RouteStep = {
  id: string;
  type: 'walk' | 'board' | 'transfer' | 'ride';
  description: string;
  durationMinutes: number;
  mode?: TransportMode;
  lineNumber?: string;
};

export type RouteOption = {
  id: string;
  modes: TransportMode[];
  totalTimeMinutes: number;
  price: number;
  eta: Date;
  steps: RouteStep[];
  polyline: Coordinates[];
  isFastest?: boolean;
  label: string;
};

export type Destination = {
  id: string;
  name: string;
  coordinates: Coordinates;
  subtitle?: string;
};

export type TaxiVehicle = {
  id: string;
  name: string;
  multiplier: number;
};

export type Taxi = {
  id: string;
  coordinates: Coordinates;
  heading: number;
};

export type TaxiDriver = {
  name: string;
  carModel: string;
  plateNumber: string;
  rating: number;
};

export type TicketStatus = 'active' | 'used' | 'expired';

export type Ticket = {
  id: string;
  mode: 'bus' | 'train';
  from: string;
  to: string;
  timestamp: Date;
  price: number;
  status: TicketStatus;
  qrCodeData: string;
  lineNumber?: string;
  validUntil: Date;
};

export type WalletTransactionType = 'topup' | 'ticket' | 'taxi';

export type WalletTransaction = {
  id: string;
  type: WalletTransactionType;
  amount: number;
  timestamp: Date;
  description: string;
};

export type User = {
  name: string;
  email: string;
};

export type ModeFilter = 'all' | TransportMode;

export type TaxiBookingStatus = 'idle' | 'searching' | 'assigned' | 'cancelled';
