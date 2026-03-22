export enum MicrophoneEvents {
  DataAvailable = 'dataavailable',
  Error = 'error',
  Pause = 'pause',
  Resume = 'resume',
  Start = 'start',
  Stop = 'stop',
}

export enum MicrophoneState {
  NotRequested = 'notRequested',
  Open = 'open',
  Paused = 'paused',
  Error = 'error',
}
