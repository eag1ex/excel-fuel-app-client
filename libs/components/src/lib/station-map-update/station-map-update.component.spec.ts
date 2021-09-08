import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationMapUpdateComponent } from './station-map-update.component';

describe('StationMapUpdateComponent', () => {
  let component: StationMapUpdateComponent;
  let fixture: ComponentFixture<StationMapUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StationMapUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationMapUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
