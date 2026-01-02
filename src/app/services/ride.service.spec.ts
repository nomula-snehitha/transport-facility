import { TestBed } from '@angular/core/testing';
import { RideService } from './ride.service';
import { Ride } from '../models/ride.model';

describe('RideService', () => {
  let service: RideService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RideService);
    service.clearAll();
  });

  it('should add a ride and persist', () => {
    const r = service.addRide({
      creatorEmployeeId: 'EMP1',
      vehicleType: 'Car',
      vehicleNo: 'ABC123',
      vacantSeats: 2,
      timeISO: new Date().toISOString(),
      pickup: 'A',
      destination: 'B'
    });
    expect(r.id).toBeTruthy();
    expect(service.getAll().length).toBe(1);
  });

  it('should prevent same creator from adding two rides', () => {
    service.addRide({
      creatorEmployeeId: 'EMP1',
      vehicleType: 'Car',
      vehicleNo: 'ABC123',
      vacantSeats: 2,
      timeISO: new Date().toISOString(),
      pickup: 'A',
      destination: 'B'
    });
    expect(() => service.addRide({
      creatorEmployeeId: 'EMP1',
      vehicleType: 'Car',
      vehicleNo: 'DEF456',
      vacantSeats: 1,
      timeISO: new Date().toISOString(),
      pickup: 'C',
      destination: 'D'
    })).toThrow();
  });

  it('should book a ride and decrement seats', () => {
    const r = service.addRide({
      creatorEmployeeId: 'EMP1',
      vehicleType: 'Car',
      vehicleNo: 'ABC123',
      vacantSeats: 2,
      timeISO: new Date().toISOString(),
      pickup: 'A',
      destination: 'B'
    });
    service.bookRide(r.id, 'EMP2');
    const found = service.getAll().find(x => x.id === r.id) as Ride;
    expect(found.vacantSeats).toBe(1);
    expect(found.bookings).toContain('EMP2');
  });

  it('should prevent creator booking their own ride', () => {
    const r = service.addRide({
      creatorEmployeeId: 'EMP1',
      vehicleType: 'Car',
      vehicleNo: 'ABC123',
      vacantSeats: 1,
      timeISO: new Date().toISOString(),
      pickup: 'A',
      destination: 'B'
    });
    expect(() => service.bookRide(r.id, 'EMP1')).toThrow();
  });

  it('should prevent double booking by same employee', () => {
    const r = service.addRide({
      creatorEmployeeId: 'EMP1',
      vehicleType: 'Car',
      vehicleNo: 'ABC123',
      vacantSeats: 2,
      timeISO: new Date().toISOString(),
      pickup: 'A',
      destination: 'B'
    });
    service.bookRide(r.id, 'EMP2');
    expect(() => service.bookRide(r.id, 'EMP2')).toThrow();
  });
});
