export enum BridgeMethod {
  Init = 'Init',
  PublishImage = 'PublishImage',
}

export type RequestParamsMap = {
  [BridgeMethod.Init]: {};
  [BridgeMethod.PublishImage]: { src: string; description: string; tags?: string[] };
}

export interface BridgeEvent<M extends BridgeMethod> {
  requestID: string;
  method: M;
  result: boolean;
}

export type BridgeInitEvent = BridgeEvent<BridgeMethod.Init>

export type BridgePublishImageEvent = BridgeEvent<BridgeMethod.PublishImage>

export type AnyBridgeEvent =
  | BridgeInitEvent
  | BridgePublishImageEvent;

export type BridgeSubscribeHandler = (event: AnyBridgeEvent) => void;
