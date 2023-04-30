import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core'

@Component({
  selector: 'app-home',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements AfterViewInit {
  @ViewChild('neonTextElement') neonTextElement!: ElementRef<HTMLElement>;

  ngAfterViewInit(): void {
    this.neonText(this.neonTextElement.nativeElement);
  }

  neonText(target: HTMLElement) {
    const flickerLetter = (letter: any) => `<span style="animation: text-flicker-in-glow ${Math.random() * 4}s linear both ">${letter}</span>`
    const colorLetter = (letter: any) => `<span style="color: hsla(${Math.random() * 360}, 100%, 80%, 1);">${letter}</span>`;

    const flickerAndColorText = (text: string) =>
      text
        .split('')
        .map(flickerLetter)
        .map(colorLetter)
        .join('');

    target.innerHTML = flickerAndColorText(target.textContent as string);
  }
}
