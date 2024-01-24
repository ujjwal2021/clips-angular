import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ClipService } from '../../services/clip.service';
import IClip from '../../models/clip.model';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.css',
})
export class ManageComponent implements OnInit {
  videoOrder = '1';
  clips: IClip[] = [];

  activeClip: IClip | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clipService: ClipService,
    private modal: ModalService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.videoOrder = params['sort'] === '2' ? params['sort'] : 1;
      ClipService;
    });
    this.clipService.getUserClips().subscribe((docs) => {
      this.clips = [];
      docs.forEach((doc) => {
        this.clips.push({
          docId: doc.id,
          ...doc.data(),
        });
      });
    });
  }
  sort(event: Event) {
    const { value } = event.target as HTMLSelectElement;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: value,
      },
    });
  }

  openModal(event: Event, clip: IClip) {
    event.preventDefault();
    this.modal.toggleModal('editClip');
    console.log('hello');
    this.activeClip = clip;
  }
}
