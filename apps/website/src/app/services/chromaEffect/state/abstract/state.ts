import { ChromaEffectService } from '../../chroma-effect.service';
import iro from '@jaames/iro';


export abstract class State {
  protected _context!: ChromaEffectService;

  get context(): ChromaEffectService {
    return this._context;
  }

  set context(newContext: ChromaEffectService) {
    this._context = newContext;
  }

  abstract handle(colors: iro.Color[]): void;

  abstract onExit(): void;

  abstract onEntry(): void;

  protected update(newState: State): void {
    this._context.state = newState;
  }

}
