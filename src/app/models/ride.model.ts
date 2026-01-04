export type VehicleType = 'Bike' | 'Car';

export interface Ride {
  id: string;
  creatorEmployeeId: string;
  vehicleType: VehicleType;
  vehicleNo: string;
  vacantSeats: number;
  timeISO: string; 
  pickup: string;
  destination: string;
  bookings: string[];
}
