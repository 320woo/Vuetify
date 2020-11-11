export declare namespace PolygonUtil {
    export type CGFloat = number;
    export type Double = number;
    type Nullable<T> = T | null;
    export class CGPoint {
        x: CGFloat;
        y: CGFloat;
        constructor(x: CGFloat, y: CGFloat);
        equalTo(point2: CGPoint): boolean;
    }
    export class CGSize {
        width: CGFloat;
        height: CGFloat;
        constructor(width: CGFloat, height: CGFloat);
        equalTo(size2: CGSize): boolean;
    }
    export class CGRect {
        origin: CGPoint;
        size: CGSize;
        readonly x: CGFloat;
        readonly y: CGFloat;
        readonly width: CGFloat;
        readonly height: CGFloat;
        readonly maxX: CGFloat;
        readonly maxY: CGFloat;
        readonly midY: CGFloat;
        constructor(origin: CGPoint, size: CGSize);
    }
    export function degreeToRadian(degree: number): number;
    export function radianToDegree(radian: number): number;
    export abstract class PolygonUtilCoordinateSystem {
        abstract distanceMeter(pt1: CGPoint, pt2: CGPoint): CGFloat;
    }
    export function isSimplePolygon(points: CGPoint[], movingPointIndex: number, useCeilPoint?: boolean): boolean;
    export function intersectionPoint(p1: CGPoint, p2: CGPoint, p3: CGPoint, p4: CGPoint): Nullable<CGPoint>;
    export function jointExcludedIntersectionPoint(p1: CGPoint, p2: CGPoint, p3: CGPoint, p4: CGPoint, useCeilPoint?: boolean): Nullable<CGPoint>;
    export function isParallelLine(p1: CGPoint, p2: CGPoint, p3: CGPoint, p4: CGPoint): boolean;
    export function intersectionLineOnParallelLine(p1: CGPoint, p2: CGPoint, p3: CGPoint, p4: CGPoint): Nullable<CGPoint[]>;
    export function containsPoint(p1: CGPoint, p2: CGPoint, test: CGPoint): boolean;
    export function area(p1: CGPoint, p2: CGPoint, p3: CGPoint, coordSystem: PolygonUtilCoordinateSystem): CGFloat;
    export interface AreaResult {
        area: Double;
        triangles: [CGPoint, CGPoint, CGPoint][];
    }
    export function areaPolygon(points: CGPoint[], coordSystem: PolygonUtilCoordinateSystem): AreaResult;
    export function distancePoint(p1: CGPoint, p2: CGPoint): Double;
    export function distanceGPS(p1: CGPoint, p2: CGPoint): CGFloat;
    export function inpoint(p0: CGPoint, p1: CGPoint, p2: CGPoint): Nullable<CGPoint>;
    export function middleOfLine(p1: CGPoint, p2: CGPoint): CGPoint;
    export function angle(p1: CGPoint, p2: CGPoint, normal?: boolean): CGFloat;
    export function lines(points: CGPoint[]): [CGPoint, CGPoint][];
    export function longLine(points: CGPoint[]): [CGPoint, CGPoint];
    export function boundBox(points: CGPoint[]): CGRect;
    export function containsPointInPolygon(point: CGPoint, polygon: CGPoint[]): boolean;
    export function meterPerPoint(pointDistance: CGFloat, meterDistance: CGFloat): CGFloat;
    export function radiusKmAtLatitude(lat: CGFloat): CGFloat;
    export class PointCoordinateSystem extends PolygonUtilCoordinateSystem {
        mpp: CGFloat;
        constructor(meterPerPoint: CGFloat);
        distanceMeter(pt1: CGPoint, pt2: CGPoint): CGFloat;
        pointFromMeter(fromMeter: CGFloat): CGFloat;
        meterFromPoint(fromPoint: CGFloat): CGFloat;
    }
    export class GPSCoordnateSystem extends PolygonUtilCoordinateSystem {
        distanceMeter(pt1: CGPoint, pt2: CGPoint): CGFloat;
    }
    export {};
}
