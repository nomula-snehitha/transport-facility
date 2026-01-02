import { Injectable } from '@angular/core';
import { Ride, VehicleType } from '../models/ride.model';

const STORAGE_KEY = 'rides_v1';

@Injectable({ providedIn: 'root' })
export class RideService {
  private rides: Ride[] = [];

  constructor() {
    this.rides = this.read();
  }

  private read(): Ride[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  }

  private write() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.rides));
  }

  private generateId() {
    return Math.random().toString(36).slice(2, 9);
  }

  addRide(payload: Omit<Ride, 'id' | 'bookings'>) {
    // Employee ID uniqueness for creator across rides
    if (this.rides.some(r => r.creatorEmployeeId === payload.creatorEmployeeId)) {
      throw new Error('Employee ID already used to add a ride');
    }
    const ride: Ride = {
      ...payload as Ride,
      id: this.generateId(),
      bookings: []
    };
    this.rides.push(ride);
    this.write();
    return ride;
  }

  getAll(): Ride[] {
    return [...this.rides];
  }

  getAvailableRides(now: Date = new Date(), vehicleType?: VehicleType): Ride[] {
    const todayStr = now.toISOString().slice(0, 10);
    return this.rides.filter(r => {
      if (!r.timeISO.startsWith(todayStr)) return false;
      const diffMin = Math.abs((new Date(r.timeISO).getTime() - now.getTime()) / 60000);
      if (diffMin > 60) return false;
      if (r.vacantSeats <= 0) return false;
      if (vehicleType && r.vehicleType !== vehicleType) return false;
      return true;
    });
  }

  bookRide(rideId: string, employeeId: string) {
    const ride = this.rides.find(r => r.id === rideId);
    if (!ride) throw new Error('Ride not found');
    if (ride.creatorEmployeeId === employeeId) throw new Error('Creator cannot book own ride');
    if (ride.bookings.includes(employeeId)) throw new Error('Already booked');
    if (ride.vacantSeats <= 0) throw new Error('No seats');
    ride.vacantSeats -= 1;
    ride.bookings.push(employeeId);
    this.write();
    return ride;
  }

  clearAll() {
    this.rides = [];
    this.write();
  }
}
