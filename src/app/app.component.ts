import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, RouterLink, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AddRideComponent } from './components/add-ride/add-ride.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, AddRideComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'transport-facility';
  currentUrl = '';

  constructor(private router: Router) {
    this.currentUrl = this.router.url;
  }

  ngOnInit() {
    this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => this.currentUrl = e.urlAfterRedirects);
    const startUrl = this.router.url || '/';
    if (startUrl === '/' || startUrl === '' || startUrl === '/add') {
      this.router.navigate(['/rides']);
    }
  }

  activatedComponent: string | null = null;

  onActivate(component: any) {
    this.activatedComponent = component?.constructor?.name ?? 'unknown';
    console.log('Route activate', this.activatedComponent, component);
  }

  onDeactivate() {
    this.activatedComponent = null;
    console.log('Route deactivate');
  }

  
  showAdd = false;

  openAdd() {
    this.showAdd = true;
  }

  closeAdd() {
    this.showAdd = false;
  }

  onAdded() {
   
    this.showAdd = false;
    console.log('Ride added: closing modal');
  }
}
