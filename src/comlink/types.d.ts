type EventListenerOrEventListenerObject =
  | {
      handleEvent: (data: any) => void
    }
  | ((data: any) => void)
type Transferable = {} // not used
type MessagePort = {} // not used
