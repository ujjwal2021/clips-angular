import { Component, Input, OnDestroy, OnInit, OnChanges } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import IClip from '../../models/clip.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClipService } from '../../services/clip.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css',
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  @Input() activeClip: IClip | null = null;
  inSubmission = false;
  showAlert = false;
  alertMsg = 'Update in progress';
  alertColor = 'blue';

  clipId = new FormControl('', {
    nonNullable: true,
  });

  title = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3)],
    nonNullable: true,
  });

  editForm = new FormGroup({
    title: this.title,
    if: this.clipId,
  });

  constructor(private modal: ModalService, private clipService: ClipService) {}
  ngOnInit(): void {
    this.modal.register('editClip');
  }
  ngOnDestroy(): void {
    this.modal.unregister('editClip');
  }
  ngOnChanges(): void {
    if (!this.activeClip) {
      return;
    }
    this.clipId.setValue(this.activeClip.docId ?? '');
    this.title.setValue(this.activeClip.title ?? '');
  }

  async submit() {
    this.alertColor = 'blue';
    this.alertMsg = 'please wait! updating clip';
    this.showAlert = true;
    this.inSubmission = true;

    try {
      await this.clipService.updateClip(this.clipId.value, this.title.value);
    } catch (error) {
      this.alertColor = 'red';
      this.alertMsg = 'Couldnt upload. try again later';
      this.inSubmission = false;
      return;
    }
    this.inSubmission = false;
    this.alertColor = 'green';
    this.alertMsg = 'Successfully updated clip';
  }
}
