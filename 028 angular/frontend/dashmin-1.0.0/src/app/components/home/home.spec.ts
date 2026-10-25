import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Home } from './home';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the four dashboard stats', () => {
    const stats = fixture.nativeElement.querySelectorAll('.row .bg-light.rounded') as NodeListOf<Element>;
    expect(stats.length).toBeGreaterThanOrEqual(4);
  });
});
