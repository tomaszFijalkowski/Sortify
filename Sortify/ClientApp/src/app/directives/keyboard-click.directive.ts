import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appKeyboardClick]',
})
export class KeyboardClickDirective {
  @HostListener('keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    const keysToListen = [' ', 'Enter'];

    if (keysToListen.includes(event.key)) {
      event.preventDefault();
      (event.target as HTMLElement).click();
    }
  }
}
