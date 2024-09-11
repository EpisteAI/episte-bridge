import {
  AnyBridgeEvent,
  BridgeMethod,
  BridgeSubscribeHandler,
  RequestParamsMap,
} from './types';

/**
 * Creates an Episte Bridge API that holds functions for interact with runtime
 * environment.
 */
export const createEpisteBridge = () => {
  const subscribers: BridgeSubscribeHandler[] = [];

  const isApp = Boolean(
    typeof window !== 'undefined' &&
      (window as any).ReactNativeWebView &&
      typeof (window as any).ReactNativeWebView.postMessage === 'function',
  );

  const isWeb = Boolean(
    typeof window !== 'undefined' &&
      !isApp && window.parent !== window,
  );

  const appBridge: { postMessage?: (message: any) => void } | undefined = isApp
    ? (window as any).ReactNativeWebView
    : undefined;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const webBridge: { postMessage?: (message: any) => void } | undefined = isWeb
    ? window.parent
    : undefined;

  /** Sends an event to the runtime env. */
  const send = <M extends BridgeMethod>(
    method: M,
    requestID: number | string,
    params?: RequestParamsMap[M],
  ) => {
    if (appBridge && typeof appBridge.postMessage === 'function') {
      appBridge.postMessage(
        JSON.stringify({
          method,
          requestID,
          params, 
        }),
      );
    }
  };

  /** Adds an event listener. It will be called any time a data is received. */
  const subscribe = (listener: BridgeSubscribeHandler) => {
    subscribers.push(listener);
  };

  /** Removes an event listener which has been subscribed for event listening. */
  const unsubscribe = (listener: BridgeSubscribeHandler) => {
    const index = subscribers.indexOf(listener);
    if (index > -1) {
      subscribers.splice(index, 1);
    }
  };

  const _handleEvent = (event: MessageEvent<string>) => {
    if (!isApp) {
      return;
    }

    let eventData: AnyBridgeEvent | undefined;
    try {
      eventData = JSON.parse(event.data);
    } catch {
      //
    }

    if (!eventData?.requestID) {
      return;
    }

    subscribers.forEach(listener => listener(eventData));
  };

  if (typeof window !== 'undefined' && 'addEventListener' in window) {
    window.addEventListener('message', _handleEvent);
  }

  return {
    send,
    subscribe,
    unsubscribe,
    isApp,
    isWeb,
  };
};
