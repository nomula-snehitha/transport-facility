import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RideListComponent } from './ride-list.component';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Ride } from '../../models/ride.model';
import { RideService } from '../../services/ride.service';

describe('RideListComponent', () => {
  let component: RideListComponent;
  let fixture: ComponentFixture<RideListComponent>;
  let rideServiceSpy: jasmine.SpyObj<any>;

  beforeEach(async () => {
    rideServiceSpy = jasmine.createSpyObj('RideService', ['getAvailableRides', 'bookRide']);
    rideServiceSpy.changes$ = of();

    await TestBed.configureTestingModule({
      imports: [FormsModule, RideListComponent],
      providers: [{ provide: RideService, useValue: rideServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(RideListComponent);
    component = fixture.componentInstance;
  });

  it('shows no rides message when service returns empty', () => {
    rideServiceSpy.getAvailableRides.and.returnValue([]);
    rideServiceSpy.changes$ = of();
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.card')?.textContent).toContain('No rides found');
  });

  it('renders ride items when service returns rides', () => {
    const mock: Ride[] = [
      { id: 'r1', creatorEmployeeId: 'E1', vehicleType: 'Car', vehicleNo: 'C1', vacantSeats: 2, timeISO: new Date().toISOString(), pickup: 'A', destination: 'B', bookings: [] }
    ];
    rideServiceSpy.getAvailableRides.and.returnValue(mock);
    rideServiceSpy.changes$ = of();
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('.rides li').length).toBe(1);
    expect(el.querySelector('.rides li')?.textContent).toContain('C1');
  });

  it('calls bookRide on booking and refreshes', () => {
    const mock: Ride[] = [
      { id: 'r1', creatorEmployeeId: 'E1', vehicleType: 'Car', vehicleNo: 'C1', vacantSeats: 2, timeISO: new Date().toISOString(), pickup: 'A', destination: 'B', bookings: [] }
    ];
    rideServiceSpy.getAvailableRides.and.returnValue(mock);
    rideServiceSpy.changes$ = of();
    rideServiceSpy.bookRide.and.returnValue({ ...mock[0], vacantSeats: 1, bookings: ['EMP2'] });

    fixture.detectChanges();
    component.employeeId = 'EMP2';
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const btn = el.querySelector('button') as HTMLButtonElement;
    btn.click();

    expect(rideServiceSpy.bookRide).toHaveBeenCalledWith('r1', 'EMP2');
    expect(component.message).toContain('Booked');
  });

  it('handles book errors gracefully', () => {
    const mock: Ride[] = [
      { id: 'r1', creatorEmployeeId: 'E1', vehicleType: 'Car', vehicleNo: 'C1', vacantSeats: 1, timeISO: new Date().toISOString(), pickup: 'A', destination: 'B', bookings: [] }
    ];
    rideServiceSpy.getAvailableRides.and.returnValue(mock);
    rideServiceSpy.bookRide.and.throwError(new Error('No seats'));

    fixture.detectChanges();
    component.employeeId = 'EMP2';
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const btn = el.querySelector('button') as HTMLButtonElement;
    btn.click();

    expect(component.message).toBe('No seats');
  });
});