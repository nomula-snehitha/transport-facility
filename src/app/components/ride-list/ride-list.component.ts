import { Component, OnInit } from '@angular/core';
import { RideService } from '../../services/ride.service';
import { Ride, VehicleType } from '../../models/ride.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ride-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ride-list.component.html',
  styleUrls: ['./ride-list.component.css']
})
export class RideListComponent implements OnInit {
  rides: Ride[] = [];
  filter: VehicleType | 'All' = 'All';
  employeeId = '';
  message = '';

  constructor(private rideService: RideService) {}

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    const type = this.filter === 'All' ? undefined : this.filter;
    this.rides = this.rideService.getAvailableRides(new Date(), type as VehicleType | undefined);
  }

  book(rideId: string) {
    this.message = '';
    if (!this.employeeId) { this.message = 'Please enter your Employee ID.'; return; }
    try {
      this.rideService.bookRide(rideId, this.employeeId);
      this.message = 'Booked successfully.';
      this.employeeId = '';
      this.refresh();
    } catch (e: any) {
      this.message = e.message || 'Could not book ride.';
    }
  }
}
