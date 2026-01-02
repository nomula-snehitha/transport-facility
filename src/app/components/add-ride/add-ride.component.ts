import { Component } from '@angular/core';
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
  form = this.fb.group({
    creatorEmployeeId: ['', Validators.required],
    vehicleType: ['Car', Validators.required],
    vehicleNo: ['', Validators.required],
    vacantSeats: [1, [Validators.required, Validators.min(1)]],
    time: ['', Validators.required], // HH:mm
    pickup: ['', Validators.required],
    destination: ['', Validators.required]
  });

  message = '';

  constructor(private fb: FormBuilder, private rideService: RideService) {}

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
    } catch (e: any) {
      this.message = e?.message || 'Error adding ride.';
      console.error('Add ride error', e);
    }
  }
}
