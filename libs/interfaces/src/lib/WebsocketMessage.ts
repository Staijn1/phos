export enum WebsocketMessage {
  GetState = "getState",
  SetState = "setState",
  GetModes = "getModes",
  GetGradients = "getGradients",
  RegisterAsUser = "joinUserRoom",
  SetFFTValue = "FFT",
  StateChange = "stateChange",
  SubmitState = "submitState",
  LedstripFFT = ".",
  LedstripSetState = "!"
}
