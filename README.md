# Episte Bridge

## Usage

```typescript
import {bridge, BridgeMethod} from '@episte-ai/episte-bridge';

function generateID() {
  return Date.now() + '_' + Math.random();
}

// Sends event to app/web
const requestID = generateID();
bridge.send(BridgeMethod.Init, requestID);

// Subscribes to event, sended by app/web
bridge.subscribe((e) => console.log(e));
```
