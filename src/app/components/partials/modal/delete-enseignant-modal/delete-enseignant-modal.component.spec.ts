import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteEnseignantModalComponent } from './delete-enseignant-modal.component';

describe('DeleteEnseignantModalComponent', () => {
  let component: DeleteEnseignantModalComponent;
  let fixture: ComponentFixture<DeleteEnseignantModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteEnseignantModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteEnseignantModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
