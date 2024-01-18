import { Injectable } from '@angular/core';

interface IModal {
  id: string;
  visible: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modals: IModal[] = [];
  constructor() {}

  register(id: string) {
    this.modals.push({
      id,
      visible: false,
    });
  }

  unregister(id: string) {
    this.modals = this.modals.filter((item) => item.id != id);
  }

  isModalOpen(id: string): boolean {
    return !!this.modals.find((item) => item.id === id)?.visible;
  }
  toggleModal(id: string) {
    let modal = this.modals.find((item) => item.id === id);
    if (modal) {
      modal.visible = !modal.visible;
    }
  }
}
