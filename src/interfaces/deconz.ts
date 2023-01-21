export const DiscoveryURL = 'https://phoscon.de/discover'
export const DefaultUsername = 'delight'
export const DefaultPassword = 'delight'

export const GatewayURITypes = ['api', 'websocket'] as const

export interface GatewayCredentials {
  // TODO Remove id and name
  id: string
  name: string
  apiKey: string
  URIs: GatewayURI[]
}

export interface GatewayURI {
  type: typeof GatewayURITypes[number]
  address: string
}

export interface GatewayData {
  alarmsystems: Record<number, AlarmSystem>
  config: Config | undefined
  groups: Record<number, Group>
  lights: Record<number, Light>
  resourcelinks: Record<number, ResourceLink>
  rules: Record<number, Rule>
  scenes: Record<number, Scene>
  schedules: Record<number, Schedule>
  sensors: Record<number, Sensor>
}

export type AlarmSystem = Record<string, any>

export interface Config {
  // The version of the API used by the device
  apiversion: string
  // The unique identifier of the bridge
  bridgeid: string
  // The version of the datastore used by the device
  datastoreversion: string
  // The name of the device
  devicename: string
  // Indicates if the device is in factory new state
  factorynew: boolean
  // The MAC address of the device
  mac: string
  // The model identifier of the device
  modelid: string
  // The user-defined name of the device
  name: string
  // The identifier of the bridge that this device replaces (if applicable)
  replacesbridgeid: string | null
  // The identifier of the starter kit (if applicable)
  starterkitid: string
  // The version of the software used by the device
  swversion: string
  // Allows for additional properties to be added to the interface in the future
  [key: string]: any
}

export type Group = Record<string, any>
export type Light = Record<string, any>
export type ResourceLink = Record<string, any>
export type Rule = Record<string, any>
export type Scene = Record<string, any>
export type Schedule = Record<string, any>
export type Sensor = Record<string, any>

export interface WebSocketEvent {
  /** The type of the message */
  t: 'event'
  /** The event type of the message:
   *    added - resource has been added;
   *    changed - resource attributes have changed;
   *    deleted - resource has been deleted.
   *    scene-called - a scene has been recalled.
   */
  e: 'added' | 'changed' | 'deleted' | 'scene-called'
  /**
   * The resource type to which the message belongs:
   *   groups - message relates to a group resource;
   *   lights - message relates to a light resource;
   *   scenes - message relates to a scene under a group resource;
   *   sensors - message relates to a sensor resource.
   */
  r: 'groups' | 'lights' | 'scenes' | 'sensors'
  /** The id of the resource to which the message relates, e.g. 5 for /sensors/5.
   * Not for scene-called events.
   */
  id?: string
  /**
   * The uniqueid of the resource to which the message relates, e.g. 00:0d:6f:00:10:65:8a:6e-01-1000.
   * Only for light and sensor resources.
   */
  uniqueid?: string
  /**
   * The group id of the resource to which the message relates.
   */
  gid?: string
  /**
   * The scene id of the resource to which the message relates.
   */
  scid?: string
  /**
   * Depending on the websocketnotifyall setting: a map containing all or only the changed config attributes of a sensor resource.
   * Only for changed events.
   */
  config?: Record<string, any>
  /**
   * The (new) name of a resource.
   * Only for changed events.
   */
  name?: string
  /**
   * Not documented, list of updated attributes
   */
  attr?: Record<string, any>
  /**
   * Depending on the websocketnotifyall setting: a map containing all or only the changed state attributes of a group, light, or sensor resource.
   * Only for changed events.
   */
  state?: Record<string, any>
  /**
   * The full group resource.
   * Only for added events of a group resource.
   */
  group?: Record<string, any>
  /**
   * The full light resource.
   * Only for added events of a light resource.
   */
  light?: Record<string, any>
  /**
   * The full sensor resource.
   * Only for added events of a sensor resource.
   */
  sensor?: Record<string, any>
}
