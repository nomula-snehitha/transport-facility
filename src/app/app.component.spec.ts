import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterTestingModule],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'transport-facility' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('transport-facility');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, transport-facility');
  });

  it('should navigate to /rides on startup when root URL', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledWith(['/rides']);
  });

  it('opens Add modal when Add Ride link clicked', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const addLink = el.querySelector('.main-nav .nav-link[role="button"]') as HTMLElement;
    addLink.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.showAdd).toBeTrue();
    expect(el.querySelector('.add-modal')).toBeTruthy();
  });
});
