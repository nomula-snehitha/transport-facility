import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AddRideComponent } from './components/add-ride/add-ride.component';
import { RideListComponent } from './components/ride-list/ride-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AddRideComponent, RideListComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'transport-facility';
}
