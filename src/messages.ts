import {BackendType} from './backends'
import {Snapshot} from './snapshots'

export enum MessageType {
  InitializeConnector = 'initializeConnector',
  GetSnapshot = 'getSnapshot',
  GetSnapshotResponse = 'getSnapshotResponse',
}

interface InitializeConnectorMessage {
  type: MessageType.InitializeConnector
  data: {
    backendType: BackendType
  }
}

export interface GetSnapshotMessage {
  type: MessageType.GetSnapshot
}

interface GetSnapshotResponseMessage {
  type: MessageType.GetSnapshotResponse
  data: {
    snapshot: Snapshot
  }
}

export type OutgoingMessage =
  | InitializeConnectorMessage
  | GetSnapshotResponseMessage
export type IncomingMessage = GetSnapshotMessage
