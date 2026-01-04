import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddRideComponent } from './add-ride.component';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { RideService } from '../../services/ride.service';

describe('AddRideComponent', () => {
  let component: AddRideComponent;
  let fixture: ComponentFixture<AddRideComponent>;
  let rideServiceSpy: jasmine.SpyObj<RideService>;

  beforeEach(async () => {
    rideServiceSpy = jasmine.createSpyObj('RideService', ['addRide']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, AddRideComponent],
      providers: [{ provide: RideService, useValue: rideServiceSpy }]
    }).compileComponents();


    rideServiceSpy.changes$ = of();

    fixture = TestBed.createComponent(AddRideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('calls rideService.addRide with correct payload when form is valid and emits added', () => {
    component.form.setValue({
      creatorEmployeeId: 'EMP1',
      vehicleType: 'Car',
      vehicleNo: 'ABC123',
      vacantSeats: 2,
      time: '09:30',
      pickup: 'A',
      destination: 'B'
    });

    let emitted = false;
    component.added.subscribe(() => emitted = true);

    component.submit();

    expect(rideServiceSpy.addRide).toHaveBeenCalledTimes(1);
    const arg = rideServiceSpy.addRide.calls.mostRecent().args[0];
    expect(arg.creatorEmployeeId).toBe('EMP1');
    expect(arg.vehicleNo).toBe('ABC123');
    expect(arg.vacantSeats).toBe(2);
    expect(arg.pickup).toBe('A');
    expect(arg.destination).toBe('B');
    expect(arg.timeISO).toBeDefined();
    expect(emitted).toBeTrue();
  });
});
