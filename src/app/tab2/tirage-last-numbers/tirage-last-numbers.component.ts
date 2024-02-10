import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  computed,
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
export class TirageLastNumbersComponent {
  @Select(TirageState.getTirageNumbers)
  tirageNumbers$!: Observable<number[]>;

  private tirageNumbersSignal: Signal<number[] | undefined> = toSignal(
    this.tirageNumbers$
  );

  lastTirageNumber = computed(() => this.tirageNumbersSignal()?.slice(-7));
}
