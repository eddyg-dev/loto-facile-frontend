import { CommonModule } from '@angular/common';
import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { TirageState } from 'src/app/store/tirage/tirage.state';

@Component({
  selector: 'app-tirage-last-numbers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tirage-last-numbers.component.html',
  styleUrl: './tirage-last-numbers.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TirageLastNumbersComponent implements AfterViewChecked {
  @Select(TirageState.getTirageNumbers)
  tirageNumbers$!: Observable<number[]>;

  public tirageNumbersSignal: Signal<number[] | undefined> = toSignal(
    this.tirageNumbers$
  );

  constructor(private elementRef: ElementRef) {}

  ngAfterViewChecked() {
    this.scrollToRight();
  }

  private scrollToRight(): void {
    try {
      const element = this.elementRef.nativeElement;
      element.scrollLeft = element.scrollWidth;
    } catch (err) {
      console.error('Erreur lors du défilement:', err);
    }
  }
}
