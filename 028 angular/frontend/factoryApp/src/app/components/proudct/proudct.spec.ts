import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Proudct } from './proudct';

describe('Proudct', () => {
  let component: Proudct;
  let fixture: ComponentFixture<Proudct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Proudct],
    }).compileComponents();

    fixture = TestBed.createComponent(Proudct);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
