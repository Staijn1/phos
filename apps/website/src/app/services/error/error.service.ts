import {Injectable} from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private _errors: Error[] = [];

  public setError(error: Error) {
    this._errors.push(error)
    setTimeout(() => {
      this._errors.shift()
    }, 5000)
  }

  public getErrors(): Error[] {
    return this._errors
  }
}
