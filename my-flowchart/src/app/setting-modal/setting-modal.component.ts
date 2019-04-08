import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-setting-modal',
  templateUrl: './setting-modal.component.html'
})
export class SettingModalComponent implements OnInit {
  @Input() type: Number;

  settingForm: FormGroup;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.settingForm = this.fb.group({
      param1: [null],
      param2: [null],
      param3: [null],
      param4: [null],
      param5: [null],
    });
  }

  submit() {
    return this.settingForm.value;
  }

}
