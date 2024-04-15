import { Directive, ElementRef, Renderer2, ViewChild } from '@angular/core';

@Directive({
  selector: '[appHideHeader]',
  standalone: true,
})
export class HideHeaderDirective {
  @ViewChild('header') header!: any;

  constructor(public element: ElementRef, public renderer: Renderer2) {}

  // in my case i'm using ionViewWillEnter
  ionViewWillEnter() {
    this.renderer.setStyle(this.header['el'], 'webkitTransition', 'top 700ms');
  }

  onContentScroll(event: { detail: { scrollTop: number } }) {
    if (event.detail.scrollTop >= 50) {
      this.renderer.setStyle(this.header['el'], 'top', '-76px');
    } else {
      this.renderer.setStyle(this.header['el'], 'top', '20px');
    }
  }
}
