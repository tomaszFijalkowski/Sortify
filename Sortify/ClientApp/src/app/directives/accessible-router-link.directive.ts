import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[routerLink]',
})
export class AccessibleRouterLinkDirective {
  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    const keysToListen = [' ', 'Enter'];

    if (keysToListen.includes(event.key)) {
      event.preventDefault();
      (event.target as HTMLElement).click();
    }
  }
}
