export enum WebsocketMessage {
  GetNetworkState = "getState",
  SetNetworkState = "setState",
  GetModes = "getModes",
  GetGradients = "getGradients",
  RegisterAsUser = "joinUserRoom",
  SetFFTValue = "FFT",
  StateChange = "stateChange",
  LedstripFFT = ".",
  LedstripSetState = "!"
}
