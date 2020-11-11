//
//  PolygonUtil.swift
//  DronePath
//
//  Created by 이광규 on 15/02/2019.
//  Updated on 18/09/2019.
//  Copyright © 2019 이광규. All rights reserved.
//
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
//  polygonUtil.ts
//  Transcoded by 이광규 on 18/09/2019.
//  Copyright © 2019 이광규. All rights reserved.
//
export var PolygonUtil;
(function (PolygonUtil) {
    var CGPoint = /** @class */ (function () {
        function CGPoint(x, y) {
            this.x = x;
            this.y = y;
        }
        CGPoint.prototype.equalTo = function (point2) {
            return this.x == point2.x && this.y == point2.y;
        };
        return CGPoint;
    }());
    PolygonUtil.CGPoint = CGPoint;
    var CGSize = /** @class */ (function () {
        function CGSize(width, height) {
            this.width = width;
            this.height = height;
        }
        CGSize.prototype.equalTo = function (size2) {
            return this.width == size2.width && this.height == size2.height;
        };
        return CGSize;
    }());
    PolygonUtil.CGSize = CGSize;
    var CGRect = /** @class */ (function () {
        function CGRect(origin, size) {
            this.origin = new CGPoint(0, 0);
            this.size = new CGSize(0, 0);
            this.origin = origin;
            this.size = size;
        }
        Object.defineProperty(CGRect.prototype, "x", {
            get: function () {
                return this.origin.x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CGRect.prototype, "y", {
            get: function () {
                return this.origin.y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CGRect.prototype, "width", {
            get: function () {
                return this.size.width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CGRect.prototype, "height", {
            get: function () {
                return this.size.height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CGRect.prototype, "maxX", {
            get: function () {
                return this.origin.x + this.size.width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CGRect.prototype, "maxY", {
            get: function () {
                return this.origin.y + this.size.height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CGRect.prototype, "midY", {
            get: function () {
                return (this.origin.y + this.maxY) / 2.0;
            },
            enumerable: true,
            configurable: true
        });
        return CGRect;
    }());
    PolygonUtil.CGRect = CGRect;
    // 각도(degree)를 호도(radian)로 변환
    function degreeToRadian(degree) {
        return degree * Math.PI / 180.0;
    }
    PolygonUtil.degreeToRadian = degreeToRadian;
    // 호도를 각도로 변환
    function radianToDegree(radian) {
        return radian * 180.0 / Math.PI;
    }
    PolygonUtil.radianToDegree = radianToDegree;
    var PolygonUtilCoordinateSystem = /** @class */ (function () {
        function PolygonUtilCoordinateSystem() {
        }
        return PolygonUtilCoordinateSystem;
    }());
    PolygonUtil.PolygonUtilCoordinateSystem = PolygonUtilCoordinateSystem;
    function isSimplePolygon(points, movingPointIndex, useCeilPoint) {
        if (useCeilPoint === void 0) { useCeilPoint = false; }
        var count = points.length;
        console.assert(count >= 3);
        console.assert(movingPointIndex < count);
        if (count == 3) {
            // 평행선이 하나라도 있으면 false
            var p1_1 = points[0];
            var p2_1 = points[1];
            var p3_1 = points[2];
            if (isParallelLine(p1_1, p2_1, p1_1, p3_1) ||
                isParallelLine(p1_1, p2_1, p2_1, p3_1) ||
                isParallelLine(p1_1, p3_1, p2_1, p3_1)) {
                return false;
            }
        }
        var left = leftIndex(movingPointIndex, count);
        var right = rightIndex(movingPointIndex, count);
        var p1 = points[left];
        var p2 = points[movingPointIndex];
        var p3 = points[right];
        var next = right;
        while (next != left) {
            var testP1 = points[next];
            var testP2 = points[rightIndex(next, count)];
            if (jointExcludedIntersectionPoint(p1, p2, testP1, testP2, false) != null) {
                return false;
            }
            if (jointExcludedIntersectionPoint(p2, p3, testP1, testP2, false) != null) {
                return false;
            }
            next = rightIndex(next, count);
        }
        // 같은 점이 있으면 complex로 판단
        for (var i = 0; i < count; i++) {
            for (var j = 0; j < count; j++) {
                if (i != j && points[i].equalTo(points[j])) {
                    return false;
                }
            }
        }
        return true;
    }
    PolygonUtil.isSimplePolygon = isSimplePolygon;
    // 두 라인의 교차점(line1: (p1, p2), line2: (p3, p4))
    function intersectionPoint(p1, p2, p3, p4) {
        var d = (p2.x - p1.x) * (p4.y - p3.y) - (p2.y - p1.y) * (p4.x - p3.x);
        if (d == 0) {
            return null; // parallel lines
        }
        var u = ((p3.x - p1.x) * (p4.y - p3.y) - (p3.y - p1.y) * (p4.x - p3.x)) / d;
        var v = ((p3.x - p1.x) * (p2.y - p1.y) - (p3.y - p1.y) * (p2.x - p1.x)) / d;
        if (u < 0.0 || u > 1.0) {
            return null; // intersection point not between p1 and p2
        }
        if (v < 0.0 || v > 1.0) {
            return null; // intersection point not between p3 and p4
        }
        var intersection = new CGPoint(0, 0);
        intersection.x = p1.x + u * (p2.x - p1.x);
        intersection.y = p1.y + u * (p2.y - p1.y);
        return intersection;
    }
    PolygonUtil.intersectionPoint = intersectionPoint;
    // 관절 제외 두 라인의 교차점(line1: (p1, p2), line2: (p3, p4))
    function jointExcludedIntersectionPoint(p1, p2, p3, p4, useCeilPoint) {
        if (useCeilPoint === void 0) { useCeilPoint = false; }
        var intersectionPt = intersectionPoint(p1, p2, p3, p4);
        if (intersectionPt == null) {
            return null;
        }
        if (useCeilPoint) {
            var intersectionCeilPt = ceilPoint(intersectionPt);
            if (intersectionCeilPt.equalTo(ceilPoint(p1)) ||
                intersectionCeilPt.equalTo(ceilPoint(p2)) ||
                intersectionCeilPt.equalTo(ceilPoint(p3)) ||
                intersectionCeilPt.equalTo(ceilPoint(p4))) {
                return null;
            }
            else {
                return intersectionPt;
            }
        }
        else {
            if (intersectionPt.equalTo(p1) ||
                intersectionPt.equalTo(p2) ||
                intersectionPt.equalTo(p3) ||
                intersectionPt.equalTo(p4)) {
                return null;
            }
            else {
                return intersectionPt;
            }
        }
    }
    PolygonUtil.jointExcludedIntersectionPoint = jointExcludedIntersectionPoint;
    // 평행선인가?
    function isParallelLine(p1, p2, p3, p4) {
        var d = (p2.x - p1.x) * (p4.y - p3.y) - (p2.y - p1.y) * (p4.x - p3.x);
        return d == 0;
    }
    PolygonUtil.isParallelLine = isParallelLine;
    // 같은 선상에 있는 직선의 양 끝 교점
    function intersectionLineOnParallelLine(p1, p2, p3, p4) {
        if (!isParallelLine(p1, p2, p3, p4)) {
            return null;
        }
        var pts = [];
        if (containsPoint(p3, p4, p1)) {
            pts.push(p1);
        }
        if (containsPoint(p3, p4, p2)) {
            pts.push(p2);
        }
        if (containsPoint(p1, p2, p3)) {
            pts.push(p3);
        }
        if (containsPoint(p1, p2, p4)) {
            pts.push(p4);
        }
        return pts.length > 0 ? pts : null;
    }
    PolygonUtil.intersectionLineOnParallelLine = intersectionLineOnParallelLine;
    // 선분 위의 점
    function containsPoint(p1, p2, test) {
        // x축이 서로 같거나 y축이 서로 같으면 직선의 방정식에서 분모가 0이 되므로 y=y1, x=x1 공식 사용
        if (p1.x == p2.x) {
            var smallY = Math.min(p1.y, p2.y);
            var bigY = Math.max(p1.y, p2.y);
            return test.x == p1.x && test.y >= smallY && test.y <= bigY;
        }
        else if (p1.y == p2.y) {
            var smallX = Math.min(p1.x, p2.x);
            var bigX = Math.max(p1.x, p2.x);
            return test.y == p1.y && test.x >= smallX && test.x <= bigX;
        }
        else {
            // 두 점에 대한 직선의 방정식에 test 점이 일치하면서 p1~p2 선 사이에 있어야 함
            if (test.y - p1.y == (p2.y - p1.y) / (p2.x - p1.x) * (test.x - p1.x)) {
                var smallX = Math.min(p1.x, p2.x);
                var bigX = Math.max(p1.x, p2.x);
                var smallY = Math.min(p1.y, p2.y);
                var bigY = Math.max(p1.y, p2.y);
                return test.x >= smallX && test.x <= bigX && test.y >= smallY && test.y <= bigY;
            }
            else {
                return false;
            }
        }
    }
    PolygonUtil.containsPoint = containsPoint;
    // 삼각형 넓이 구하기 (Heron's formula)
    function area(p1, p2, p3, coordSystem) {
        var d1 = coordSystem.distanceMeter(p1, p2);
        var d2 = coordSystem.distanceMeter(p2, p3);
        var d3 = coordSystem.distanceMeter(p1, p3);
        var s = (d1 + d2 + d3) / 2.0;
        var S = Math.sqrt(s * (s - d1) * (s - d2) * (s - d3));
        return S;
    }
    PolygonUtil.area = area;
    // // 다각형 넓이 구하기
    function areaPolygon(points, coordSystem) {
        var mpoints = points.map(function (pt) { return pt; });
        var total = 0.0;
        var triangles = [];
        while (mpoints.length >= 3) {
            var cnt = mpoints.length;
            if (cnt == 3) {
                total += area(mpoints[0], mpoints[1], mpoints[2], coordSystem);
                triangles.push([mpoints[0], mpoints[1], mpoints[2]]);
                break;
            }
            // 다른 선에 의해 교차되지 않는 삼각형 추출
            var removed = false;
            var _loop_1 = function (centerIdx) {
                var leftIdx = leftIndex(centerIdx, cnt);
                var rightIdx = rightIndex(centerIdx, cnt);
                var pc = mpoints[centerIdx];
                var pl = mpoints[leftIdx];
                var pr = mpoints[rightIdx];
                var curCrossIdx = rightIdx;
                var intersected = false;
                while (curCrossIdx != leftIdx) {
                    var nextCrossIdx = rightIndex(curCrossIdx, cnt);
                    var p3 = mpoints[curCrossIdx];
                    var p4 = mpoints[nextCrossIdx];
                    // 다각형 내부에 있는 삼각형의 한 변과 다각형 내 다른 변들이 교차되는지 확인
                    if (jointExcludedIntersectionPoint(pl, pr, p3, p4) != null) {
                        intersected = true;
                        break;
                    }
                    curCrossIdx = nextCrossIdx;
                }
                if (intersected) {
                    return "continue";
                }
                else {
                    var inpt = inpoint(pc, pl, pr);
                    if (inpt != null) {
                        // 추출한 삼각형의 내점이 다각형 안에 있다면 그 면적을 합산한다.
                        if (containsPointInPolygon(inpt, points)) {
                            // 이미 합산한 삼각형과 충돌하는지 테스트
                            var inptLine_1 = lines([pc, pl, pr]);
                            triangles.forEach(function (_a) {
                                var p1 = _a[0], p2 = _a[1], p3 = _a[2];
                                var triangleLine = lines([p1, p2, p3]);
                                inptLine_1.forEach(function (_a) {
                                    var ip1 = _a[0], ip2 = _a[1];
                                    triangleLine.forEach(function (_a) {
                                        var tp1 = _a[0], tp2 = _a[1];
                                        if (jointExcludedIntersectionPoint(ip1, ip2, tp1, tp2) != null) {
                                            intersected = true;
                                        }
                                    });
                                });
                            });
                            if (intersected) {
                                return "continue";
                            }
                            // 충돌점이 없으면 면적 합산
                            total += area(pc, pl, pr, coordSystem);
                            mpoints.splice(centerIdx, 1);
                            triangles.push([pc, pl, pr]);
                            removed = true;
                            return "break";
                        }
                        else {
                            return "continue";
                        }
                    }
                    else {
                        return "continue";
                    }
                }
            };
            for (var centerIdx = 0; centerIdx < cnt; centerIdx++) {
                var state_1 = _loop_1(centerIdx);
                if (state_1 === "break")
                    break;
            }
            if (!removed) {
                return { area: 0, triangles: [] };
            }
        }
        return { area: total, triangles: triangles };
    }
    PolygonUtil.areaPolygon = areaPolygon;
    // 두 점의 거리 구하기
    function distancePoint(p1, p2) {
        var xDist = p2.x - p1.x;
        var yDist = p2.y - p1.y;
        // 피타고라스 정리 (c"=a"+b")
        return Math.sqrt(xDist * xDist + yDist * yDist);
    }
    PolygonUtil.distancePoint = distancePoint;
    // 두 GPS 좌표의 거리 구하기 (meter)
    function distanceGPS(p1, p2) {
        return measureGPS(p1.y, p1.x, p2.y, p2.x);
    }
    PolygonUtil.distanceGPS = distanceGPS;
    // 삼각형 내점
    function inpoint(p0, p1, p2) {
        var bisector0 = [p0, middleOfLine(p1, p2)];
        var bisector1 = [p1, middleOfLine(p0, p2)];
        //        let bisector2 = (p2, middleOfLine(p1, p0))
        var intersection = intersectionPoint(bisector0[0], bisector0[1], bisector1[0], bisector1[1]);
        return intersection;
    }
    PolygonUtil.inpoint = inpoint;
    // 점과 점 사이의 중간 점 구하기
    function middleOfLine(p1, p2) {
        return new CGPoint((p1.x + p2.x) / 2.0, (p1.y + p2.y) / 2.0);
    }
    PolygonUtil.middleOfLine = middleOfLine;
    // 점과 점을 잇는 선의 각도 구하기
    function angle(p1, p2, normal) {
        if (normal === void 0) { normal = false; }
        var dy = p2.y - p1.y;
        var dx = p2.x - p1.x;
        var theta = Math.atan2(dy, dx);
        theta = radianToDegree(theta);
        if (normal) {
            if (theta < 0) {
                theta = 360 + theta;
            }
            if (theta <= 90) {
                return theta;
            }
            else if (theta <= 180) {
                theta = 180 - theta;
            }
            else if (theta <= 270) {
                theta = theta - 180;
            }
            else {
                theta = 360 - theta;
            }
        }
        return theta;
    }
    PolygonUtil.angle = angle;
    // 다각형을 선으로 연결할 수 있도록 선의 목록 리턴
    function lines(points) {
        if (points.length < 4) {
            return [];
        }
        var res = [];
        for (var i = 1; i < points.length; i++) {
            res.push([points[i - 1], points[i]]);
        }
        res.push([points[points.length - 1], points[0]]);
        return res;
    }
    PolygonUtil.lines = lines;
    // 가장 긴 선 구하기
    function longLine(points) {
        var linesArr = lines(points);
        var distances = linesArr.map(function (linetuple) { return distancePoint(linetuple[0], linetuple[1]); });
        var maxDistance = distances.reduce(function (prev, curr) { return prev > curr ? prev : curr; }, 0);
        var index = distances.lastIndexOf(maxDistance);
        return linesArr[index];
    }
    PolygonUtil.longLine = longLine;
    // 다각형의 외곽 박스
    function boundBox(points) {
        if (points.length == 0) {
            return new CGRect(new CGPoint(0, 0), new CGSize(0, 0));
        }
        var first = points[0];
        var l = first.x;
        var r = first.x;
        var t = first.y;
        var b = first.y;
        points.forEach(function (pt) {
            if (pt.x < l) {
                l = pt.x;
            }
            if (pt.y < t) {
                t = pt.y;
            }
            if (pt.x > r) {
                r = pt.x;
            }
            if (pt.y > b) {
                b = pt.y;
            }
        });
        return new CGRect(new CGPoint(l, t), new CGSize(r - l, b - t));
    }
    PolygonUtil.boundBox = boundBox;
    function containsPointInPolygon(point, polygon) {
        // ray-casting algorithm based on
        // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
        var x = point.x, y = point.y;
        var inside = false;
        for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            var xi = polygon[i].x, yi = polygon[i].y;
            var xj = polygon[j].x, yj = polygon[j].y;
            var intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) {
                inside = !inside;
            }
        }
        return inside;
    }
    PolygonUtil.containsPointInPolygon = containsPointInPolygon;
    // 주어진 point 거리와 meter 거리로 meterPerPoint 값 구하기
    function meterPerPoint(pointDistance, meterDistance) {
        return meterDistance / pointDistance;
    }
    PolygonUtil.meterPerPoint = meterPerPoint;
    // 위도에 따른 지구 반경 계산
    function radiusKmAtLatitude(lat) {
        var a = 6378137.0;
        var b = 6356752.314; // meter
        var latRad = degreeToRadian(lat);
        var f1 = Math.pow((Math.pow(a, 2) * Math.cos(latRad)), 2);
        var f2 = Math.pow((Math.pow(b, 2) * Math.sin(latRad)), 2);
        var f3 = Math.pow((a * Math.cos(latRad)), 2);
        var f4 = Math.pow((b * Math.sin(latRad)), 2);
        var radius = Math.sqrt((f1 + f2) / (f3 + f4));
        return radius / 1000.0; // return KM
    }
    PolygonUtil.radiusKmAtLatitude = radiusKmAtLatitude;
    // 두 위경도 사이의 거리 구하기
    function measureGPS(lat1, lon1, lat2, lon2) {
        var dLat = degreeToRadian(lat2 - lat1);
        var dLon = degreeToRadian(lon2 - lon1);
        var a = Math.sin(dLat / 2.0) * Math.sin(dLat / 2.0) +
            Math.cos(degreeToRadian(lat1)) * Math.cos(degreeToRadian(lat2)) *
                Math.sin(dLon / 2.0) * Math.sin(dLon / 2.0);
        var c = 2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(1.0 - a));
        // var R = 6371 // Radius of earth in KM
        var R = 6378.137; // Radius of earth in KM
        // var R = radiusKmAtLatitude(dLat/2)
        var d = R * c;
        return d * 1000.0; // meters
    }
    function rightIndex(sourceIndex, indexCount) {
        return (sourceIndex + 1) % indexCount;
    }
    function leftIndex(sourceIndex, indexCount) {
        return ((sourceIndex - 1) + indexCount) % indexCount;
    }
    function ceilPoint(pt) {
        return new CGPoint(Math.ceil(pt.x), Math.ceil(pt.y));
    }
    var PointCoordinateSystem = /** @class */ (function (_super) {
        __extends(PointCoordinateSystem, _super);
        function PointCoordinateSystem(meterPerPoint) {
            var _this = _super.call(this) || this;
            _this.mpp = meterPerPoint; // meter per point (1 Point를 몇 미터로 계산할 건지)
            return _this;
        }
        PointCoordinateSystem.prototype.distanceMeter = function (pt1, pt2) {
            return distancePoint(pt1, pt2) * this.mpp;
        };
        PointCoordinateSystem.prototype.pointFromMeter = function (fromMeter) {
            return fromMeter / this.mpp;
        };
        //    func point(from: CGPoint) -> CGPoint {
        //        return CGPoint(x: from.x / mpp, y: from.y / mpp)
        //    }
        PointCoordinateSystem.prototype.meterFromPoint = function (fromPoint) {
            return fromPoint * this.mpp;
        };
        return PointCoordinateSystem;
    }(PolygonUtilCoordinateSystem));
    PolygonUtil.PointCoordinateSystem = PointCoordinateSystem;
    var GPSCoordnateSystem = /** @class */ (function (_super) {
        __extends(GPSCoordnateSystem, _super);
        function GPSCoordnateSystem() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        GPSCoordnateSystem.prototype.distanceMeter = function (pt1, pt2) {
            return distanceGPS(pt1, pt2);
        };
        return GPSCoordnateSystem;
    }(PolygonUtilCoordinateSystem));
    PolygonUtil.GPSCoordnateSystem = GPSCoordnateSystem;
})(PolygonUtil || (PolygonUtil = {}));
//# sourceMappingURL=polygonUtil.js.map