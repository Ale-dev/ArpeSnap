import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: 'img[default]',
  standalone: true,
  host: {
    '(error)': 'updateUrl()',
    '(load)': 'load()',
    '[src]': 'src',
  },
})
export class ImagePreloadDirective {
  @Input() src!: string;
  @Input() default!: string;
  @HostBinding('class') className!: string;

  updateUrl() {
    this.src = this.default;
  }

  load() {
    URL.revokeObjectURL(this.src);
  }

  constructor() {}
}
