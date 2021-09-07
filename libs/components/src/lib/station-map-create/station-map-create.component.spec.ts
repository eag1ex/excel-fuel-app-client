import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StationMapCreateComponent } from './station-map-create.component';
describe('StationMapCreateComponent', () => {
  let component: StationMapCreateComponent;
  let fixture: ComponentFixture<StationMapCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StationMapCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationMapCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
