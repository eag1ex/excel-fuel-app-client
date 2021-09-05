import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationMapItemComponent } from './station-map-item.component';

describe('StationMapItemComponent', () => {
  let component: StationMapItemComponent;
  let fixture: ComponentFixture<StationMapItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StationMapItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationMapItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
