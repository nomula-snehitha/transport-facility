import { VehicleType } from './ride.model';
import { Ride } from './ride.model';

export interface AddRideForm {
  creatorEmployeeId: string;
  vehicleType: VehicleType;
  vehicleNo: string;
  vacantSeats: number | string;
  time: string; // HH:mm
  pickup: string;
  destination: string;
}

export type AddRidePayload = Omit<Ride, 'id' | 'bookings'>;
