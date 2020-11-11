import { Matrix } from 'transformation-matrix';
import { PolygonUtil } from './polygonUtil';
declare type CGFloat = PolygonUtil.CGFloat;
declare type CGPoint = PolygonUtil.CGPoint;
declare type CGSize = PolygonUtil.CGSize;
declare type Nullable<T> = T | null;
export interface ShootSize {
    side: CGFloat;
    front: CGFloat;
}
export declare class ShootInformation {
    shootSize: ShootSize;
    distancePerPixel: CGFloat;
    nextShootDistance: ShootSize;
    shootInterval: CGFloat;
    availableMaxFlightSpeed: CGFloat;
}
export declare class WayPointInfo {
    point: CGPoint;
    head: CGFloat;
    isCameraOn: boolean;
}
export declare class DronePath {
    FOV: CGFloat;
    cameraResolution: CGSize;
    minShutterSpeed: CGFloat;
    maxFlightSpeed: CGFloat;
    maxAscentSpeed: CGFloat;
    maxDescentSpeed: CGFloat;
    vertices: CGPoint[];
    flightAltitude: CGFloat;
    frontOverlap: CGFloat;
    sideOverlap: CGFloat;
    flightSpeed: CGFloat;
    flightAngle: CGFloat;
    autoFlightAngle: boolean;
    coordSystem: PolygonUtil.PolygonUtilCoordinateSystem;
    lastShootInfo: Nullable<ShootInformation>;
    recommendedFlightAngle(deep?: boolean): CGFloat;
    make(): WayPointInfo[];
    calcShootInfo(altitude?: CGFloat): ShootInformation;
    altitudeByDistance(distancePerPoint: CGFloat): CGFloat;
    calcMaxFlightSpeed(shutterSpeed?: CGFloat): CGFloat;
    area(): CGFloat;
    shootBoundSize(): CGSize;
    flightDistance(wayPoints: WayPointInfo[], homePoint?: CGPoint): CGFloat;
    countShoot(wpis: WayPointInfo[], byDistance: boolean, shootInfo: ShootInformation): number;
    lines(): [CGPoint, CGPoint][];
    applyToCGPoint(matrix: Matrix, point: PolygonUtil.CGPoint): PolygonUtil.CGPoint;
}
export {};
