import {
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Output,
} from '@angular/core';

@Directive({
  standalone: true,
  selector: '[fileDragDrop]',
})
export class FileDragDropDirective {
  @Output() private filesChangeEmiter: EventEmitter<File> = new EventEmitter();

  @HostBinding('style.background') private background = '';
  @HostBinding('style.border') private borderStyle = '';
  @HostBinding('style.border-color') private borderColor = '';
  @HostBinding('style.border-radius') private borderRadius = '';

  constructor() {}

  @HostListener('dragover', ['$event']) public onDragOver(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.background = 'lightgray';
    this.borderColor = 'cadetblue';
    this.borderStyle = '3px solid';
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.background = '';
    this.borderColor = '';
    this.borderStyle = '';
  }

  @HostListener('drop', ['$event']) public onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.background = '';
    this.borderColor = '';
    this.borderStyle = '';
    let files = event.dataTransfer?.files[0];
    if (files) {
      this.filesChangeEmiter.emit(files);
    }
  }
}
