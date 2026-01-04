import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RideService } from '../../services/ride.service';
import { AddRideForm, AddRidePayload } from '../../models/add-ride.model';
import { timeToTodayISO } from '../../utils/time.util';

@Component({
  selector: 'app-add-ride',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-ride.component.html',
  styleUrls: ['./add-ride.component.css']
})
export class AddRideComponent {
  @Output() added = new EventEmitter<void>();

  form = this.fb.group({
    creatorEmployeeId: ['', Validators.required],
    vehicleType: ['Car', Validators.required],
    vehicleNo: ['', Validators.required],
    vacantSeats: [1, [Validators.required, Validators.min(1)]],
    time: ['', Validators.required], // HH:mm
    pickup: ['', Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)],
    destination: ['', Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]
  });

  message = '';

  constructor(private fb: FormBuilder, private rideService: RideService) {
    
  }

  ngOnInit() {
   
  }

  prefill() {
    this.form.setValue({
      creatorEmployeeId: 'DEMO1',
      vehicleType: 'Car',
      vehicleNo: 'DEMO-123',
      vacantSeats: 2,
      time: new Date().toTimeString().slice(0,5),
      pickup: 'Office',
      destination: 'Home'
    });
  }

  submit() {
    if (this.form.invalid) {
      this.message = 'Please fill all required fields.';
      return;
    }

    const v = this.form.value as AddRideForm;

    const timeStr = (v.time ?? '').toString().trim();
    if (!timeStr) {
      this.message = 'Please provide a valid time.';
      return;
    }

    const parts = timeStr.split(':');
    if (parts.length !== 2) {
      this.message = 'Invalid time format. Use HH:mm.';
      return;
    }

    const hh = Number(parts[0]);
    const mm = Number(parts[1]);
    if (Number.isNaN(hh) || Number.isNaN(mm) || hh < 0 || hh > 23 || mm < 0 || mm > 59) {
      this.message = 'Invalid time values.';
      return;
    }

    const payload: AddRidePayload = {
      creatorEmployeeId: v.creatorEmployeeId,
      vehicleType: v.vehicleType as any,
      vehicleNo: v.vehicleNo,
      vacantSeats: Number(v.vacantSeats),
      timeISO: timeToTodayISO(hh, mm),
      pickup: v.pickup,
      destination: v.destination
    };

    try {
      this.rideService.addRide(payload);
      this.message = 'Ride added successfully.';
      this.form.reset({ vehicleType: 'Car', vacantSeats: 1 });
      this.added.emit();
    } catch (e: any) {
      this.message = e?.message || 'Error adding ride.';
     
    }
  }
}
