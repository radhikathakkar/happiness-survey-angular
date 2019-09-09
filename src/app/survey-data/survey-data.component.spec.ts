import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyDataComponent } from './survey-data.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SurveyDataComponent', () => {
  let component: SurveyDataComponent;
  let fixture: ComponentFixture<SurveyDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyDataComponent ],
      imports: [HttpClientTestingModule, MaterialModule, FormsModule, RouterTestingModule, BrowserAnimationsModule, ReactiveFormsModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
