import React from 'react';
import {
  Platform,
  requireNativeComponent,
  NativeModules,
  UIManager,
  findNodeHandle,
  ViewProps,
  ImageSourcePropType,
  NativeSyntheticEvent
} from 'react-native';
// @ts-ignore
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';
import CallbacksManager from '../utils/CallbacksManager';
import {
  Point,
  ScreenPoint,
  DrivingInfo,
  MasstransitInfo,
  RoutesFoundEvent,
  Vehicles,
  CameraPosition,
  VisibleRegion,
  InitialRegion,
  MapType,
  Animation,
  MapLoaded,
  YandexLogoPosition,
  YandexLogoPadding
} from '../interfaces';
import { processColorProps } from '../utils';

const { yamap: NativeYamapModule } = NativeModules;

export interface YaMapProps extends ViewProps {
  userLocationIcon?: ImageSourcePropType;
  userLocationIconScale?: number;
  showUserPosition?: boolean;
  nightMode?: boolean;
  mapStyle?: string;
  mapType?: MapType;
  onCameraPositionChanged?: (event: NativeSyntheticEvent<CameraPosition>) => void;
  onMapPress?: (event: NativeSyntheticEvent<Point>) => void;
  onMapLongPress?: (event: NativeSyntheticEvent<Point>) => void;
  onMapLoaded?: (event: NativeSyntheticEvent<MapLoaded>) => void;
  userLocationAccuracyFillColor?: string;
  userLocationAccuracyStrokeColor?: string;
  userLocationAccuracyStrokeWidth?: number;
  scrollGesturesEnabled?: boolean;
  zoomGesturesEnabled?: boolean;
  tiltGesturesEnabled?: boolean;
  rotateGesturesEnabled?: boolean;
  fastTapEnabled?: boolean;
  initialRegion?: InitialRegion;
  followUser?: boolean;
  logoPosition?: YandexLogoPosition;
  logoPadding?: YandexLogoPadding;
}

const YaMapNativeComponent = requireNativeComponent<YaMapProps>('YamapView');

export class YaMap extends React.Component<YaMapProps> {
  static defaultProps = {
    showUserPosition: true,
    clusterColor: 'red',
  };

  // @ts-ignore
  map = React.createRef<YaMapNativeComponent>();

  static ALL_MASSTRANSIT_VEHICLES: Vehicles[] = [
    'bus',
    'trolleybus',
    'tramway',
    'minibus',
    'suburban',
    'underground',
    'ferry',
    'cable',
    'funicular',
  ];

  public static init(apiKey: string): Promise<void> {
    return NativeYamapModule.init(apiKey);
  }

  public static setLocale(locale: string): Promise<void> {
    return NativeYamapModule.setLocale(locale);
  }

  public static getLocale(): Promise<string> {
    return NativeYamapModule.getLocale();
  }

  public static resetLocale(): Promise<void> {
    return NativeYamapModule.resetLocale();
  }

  public findRoutes(points: Point[], vehicles: Vehicles[], callback: (event: RoutesFoundEvent<DrivingInfo | MasstransitInfo>) => void) {
    this._findRoutes(points, vehicles, callback);
  }

  public findMasstransitRoutes(points: Point[], callback: (event: RoutesFoundEvent<MasstransitInfo>) => void) {
    this._findRoutes(points, YaMap.ALL_MASSTRANSIT_VEHICLES, callback);
  }

  public findPedestrianRoutes(points: Point[], callback: (event: RoutesFoundEvent<MasstransitInfo>) => void) {
    this._findRoutes(points, [], callback);
  }

  public findDrivingRoutes(points: Point[], callback: (event: RoutesFoundEvent<DrivingInfo>) => void) {
    this._findRoutes(points, ['car'], callback);
  }

  public fitAllMarkers() {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this),
      this.getCommand('fitAllMarkers'),
      []
    );
  }

  public setTrafficVisible(isVisible: boolean) {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this),
      this.getCommand('setTrafficVisible'),
      [isVisible]
    );
  }

  public fitMarkers(points: Point[]) {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this),
      this.getCommand('fitMarkers'),
      [points]
    );
  }

  public setCenter(center: { lon: number, lat: number, zoom?: number }, zoom: number = center.zoom || 10, azimuth: number = 0, tilt: number = 0, duration: number = 0, animation: Animation = Animation.SMOOTH) {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this),
      this.getCommand('setCenter'),
      [center, zoom, azimuth, tilt, duration, animation]
    );
  }

  public setZoom(zoom: number, duration: number = 0, animation: Animation = Animation.SMOOTH) {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this),
      this.getCommand('setZoom'),
      [zoom, duration, animation]
    );
  }

  public getCameraPosition(callback: (position: CameraPosition) => void) {
    const cbId = CallbacksManager.addCallback(callback);
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this),
      this.getCommand('getCameraPosition'),
      [cbId]
    );
  }

  public getVisibleRegion(callback: (VisibleRegion: VisibleRegion) => void) {
    const cbId = CallbacksManager.addCallback(callback);
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this),
      this.getCommand('getVisibleRegion'),
      [cbId]
    );
  }

  public getScreenPoints(points: Point[], callback: (screenPoint: ScreenPoint) => void) {
    const cbId = CallbacksManager.addCallback(callback);
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this),
      this.getCommand('getScreenPoints'),
      [points, cbId]
    );
  }

  public getWorldPoints(points: ScreenPoint[], callback: (point: Point) => void) {
    const cbId = CallbacksManager.addCallback(callback);
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this),
      this.getCommand('getWorldPoints'),
      [points, cbId]
    );
  }

  private _findRoutes(points: Point[], vehicles: Vehicles[], callback: ((event: RoutesFoundEvent<DrivingInfo | MasstransitInfo>) => void) | ((event: RoutesFoundEvent<DrivingInfo>) => void) | ((event: RoutesFoundEvent<MasstransitInfo>) => void)) {
    const cbId = CallbacksManager.addCallback(callback);
    const args = Platform.OS === 'ios' ? [{ points, vehicles, id: cbId }] : [points, vehicles, cbId];

    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this),
      this.getCommand('findRoutes'),
      args
    );
  }

  private getCommand(cmd: string): any {
    return Platform.OS === 'ios' ? UIManager.getViewManagerConfig('YamapView').Commands[cmd] : cmd;
  }

  private processRoute(event: NativeSyntheticEvent<{ id: string } & RoutesFoundEvent<DrivingInfo | MasstransitInfo>>) {
    const { id, ...routes } = event.nativeEvent;
    CallbacksManager.call(id, routes);
  }

  private processCameraPosition(event: NativeSyntheticEvent<{ id: string } & CameraPosition>) {
    const { id, ...point } = event.nativeEvent;
    CallbacksManager.call(id, point);
  }

  private processVisibleRegion(event: NativeSyntheticEvent<{ id: string } & VisibleRegion>) {
    const { id, ...visibleRegion } = event.nativeEvent;
    CallbacksManager.call(id, visibleRegion);
  }

  private processWorldToScreenPointsReceived(event: NativeSyntheticEvent<{ id: string } & ScreenPoint[]>) {
    const { id, ...screenPoints } = event.nativeEvent;
    CallbacksManager.call(id, screenPoints);
  }

  private processScreenToWorldPointsReceived(event: NativeSyntheticEvent<{ id: string } & Point[]>) {
    const { id, ...worldPoints } = event.nativeEvent;
    CallbacksManager.call(id, worldPoints);
  }

  private resolveImageUri(img: ImageSourcePropType) {
    return img ? resolveAssetSource(img).uri : '';
  }

  private getProps() {
    const props = {
      ...this.props,
      onRouteFound: this.processRoute,
      onCameraPositionReceived: this.processCameraPosition,
      onVisibleRegionReceived: this.processVisibleRegion,
      onWorldToScreenPointsReceived: this.processWorldToScreenPointsReceived,
      onScreenToWorldPointsReceived: this.processScreenToWorldPointsReceived,
      userLocationIcon: this.props.userLocationIcon ? this.resolveImageUri(this.props.userLocationIcon) : undefined
    };

    processColorProps(props, 'clusterColor' as keyof YaMapProps);
    processColorProps(props, 'userLocationAccuracyFillColor' as keyof YaMapProps);
    processColorProps(props, 'userLocationAccuracyStrokeColor' as keyof YaMapProps);

    return props;
  }

  render() {
    return (
      <YaMapNativeComponent
        {...this.getProps()}
        ref={this.map}
      />
    );
  }
}
