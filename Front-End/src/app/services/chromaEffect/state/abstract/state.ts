import { ChromaEffectService } from '../../chroma-effect.service'
import iro from '@jaames/iro'


export abstract class State {
    protected _context: ChromaEffectService;

    protected update(newState: State): void {
        this._context.state = newState
    }

    set context(newContext: ChromaEffectService) {
        this._context = newContext
    }

    get context(): ChromaEffectService {
        return this._context
    }

    abstract handle(colors: iro.Color[]): void;

    abstract onExit(): void;

    abstract onEntry(): void;

}
