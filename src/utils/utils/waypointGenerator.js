//
//  DronePath.swift
//  DronePath
//
//  Created by 이광규 on 29/01/2019.
//  Updated on 18/09/2019.
//  Copyright © 2019 이광규. All rights reserved.
//
//  waypointGenerator.ts
//  Transcoded by 이광규 on 18/09/2019.
//  Copyright © 2019 이광규. All rights reserved.
//
import { rotate, translate, applyToPoint, transform } from 'transformation-matrix';
import { PolygonUtil } from './polygonUtil';
var ShootInformation = /** @class */ (function () {
    function ShootInformation() {
        // shootSize: 지정 높이에서 촬영될 영역 (side * front)
        this.shootSize = { side: 0, front: 0 };
        // distancePerPixel: 픽셀 정밀도 (픽셀 당 거리)
        this.distancePerPixel = 0;
        // nextShootDistance: 중첩도에 따른 다음 샷까지 이동 거리 (이 거리만큼 이동 후 촬영할 수 있도록 계산됨)
        this.nextShootDistance = { side: 0, front: 0 };
        // shootInterval: 촬영 주기 (타이머로 촬영시 최대 속도에 맞는 이상적인 촬영 주기; second)
        this.shootInterval = 0;
        // availableMaxFlightSpeed: 촬영 가능한 최고 비행 속도 (m/s)
        this.availableMaxFlightSpeed = 0;
    }
    return ShootInformation;
}());
export { ShootInformation };
var WayPointInfo = /** @class */ (function () {
    function WayPointInfo() {
        // way point 지점
        this.point = new PolygonUtil.CGPoint(0, 0);
        // head radian (미구현)
        this.head = 0;
        // 구간 시작, 종료 지점
        this.isCameraOn = true;
    }
    return WayPointInfo;
}());
export { WayPointInfo };
var DronePath = /** @class */ (function () {
    function DronePath() {
        // aircraft 사양
        this.FOV = 73.7;
        this.cameraResolution = new PolygonUtil.CGSize(4864, 3648);
        this.minShutterSpeed = 2.0; // second
        this.maxFlightSpeed = 13.8; // (m/s, 2~15)
        this.maxAscentSpeed = 5.0; // 최대 상승 속도 (m/s)
        this.maxDescentSpeed = 3.0; // 최대 하강 속도 (m/s)
        // way point 계산을 위한 입력 데이터
        this.vertices = []; // 다각형 (screen location; Point)
        this.flightAltitude = 30.0; // meter
        this.frontOverlap = 0.75; // 헤드 방향 중복도 (0~1)
        this.sideOverlap = 0.75; // 사이드 방향 중복도 (0~1)
        this.flightSpeed = 5.0; // meter per second
        this.flightAngle = 0.0; // 스크린 상의 비행 각도
        this.autoFlightAngle = true; // 비행 각도 자동 설정
        this.coordSystem = new PolygonUtil.PointCoordinateSystem(1.0);
        this.lastShootInfo = null; // 현재 설정으로 계산한 기본 촬영 정보
    }
    // 좋은 각도 찾기 (deep == true이면 0~359도까지 모두 찾아봄, false이면 다각형을 이루고 있는 선들의 각도만 테스트)
    DronePath.prototype.recommendedFlightAngle = function (deep) {
        var _this = this;
        if (deep === void 0) { deep = false; }
        var soArea = this.calcShootInfo().nextShootDistance;
        var reports = [];
        var angles = [];
        var lines = PolygonUtil.lines(this.vertices);
        if (deep) {
            // angles = new Array<number>(360).fill(0).map((v, i) => i)
            angles = Array.apply(null, Array(360)).map(function (v, i) { return i; });
        }
        else {
            angles = lines.map(function (line) { return PolygonUtil.angle(line[0], line[1], false); });
        }
        var box = PolygonUtil.boundBox(this.vertices);
        var boxCenter = new PolygonUtil.CGPoint(box.width / 2.0, box.height / 2.0);
        var _loop_1 = function (angle) {
            var rotateRad = PolygonUtil.degreeToRadian(-angle);
            var at = transform(translate(box.origin.x + boxCenter.x, box.origin.y + boxCenter.y), rotate(rotateRad), translate(-box.origin.x - boxCenter.x, -box.origin.y - boxCenter.y));
            var rotatedVertices = this_1.vertices.map(function (pt) { return _this.applyToCGPoint(at, pt); });
            var rotatedLines = PolygonUtil.lines(rotatedVertices);
            var pbox = PolygonUtil.boundBox(rotatedVertices);
            var pbox_heightMeter = this_1.coordSystem.distanceMeter(new PolygonUtil.CGPoint(pbox.origin.x, pbox.origin.y), new PolygonUtil.CGPoint(pbox.origin.x, pbox.maxY));
            var soAreaSidePt = (pbox.height * soArea.side) / pbox_heightMeter;
            var hlineCount = Math.floor(pbox.height / soAreaSidePt);
            var remainder = pbox.height - (hlineCount * soAreaSidePt);
            var startYOffset = pbox.origin.y + (remainder / 2.0);
            var report = { angle: angle, wpsCount: 0, intersectCount: 0, movingIntersectCount: 0 };
            var prevOffset = null;
            // 시작점
            var yOffset = startYOffset + soAreaSidePt / 2.0;
            // 진행 방향
            var xDir = 1.0;
            var _loop_2 = function () {
                // yOffset 선상의 라인을 긋고 그 라인과 접하는 정점들을 구한다.
                var intersectXs = [];
                var p3 = new PolygonUtil.CGPoint(pbox.origin.x, yOffset);
                var p4 = new PolygonUtil.CGPoint(pbox.maxX, yOffset);
                rotatedLines.forEach(function (_a) {
                    var p1 = _a[0], p2 = _a[1];
                    var pt, pts;
                    if ((pt = PolygonUtil.intersectionPoint(p1, p2, p3, p4)) != null) {
                        intersectXs.push(pt.x);
                    }
                    else if ((pts = PolygonUtil.intersectionLineOnParallelLine(p1, p2, p3, p4)) != null) {
                        intersectXs = intersectXs.concat(pts.map(function (v) { return v.x; }));
                    }
                });
                if (intersectXs.length == 0) {
                    console.log('intersection length is zero.');
                    return "break";
                }
                if (xDir > 0) {
                    intersectXs.sort(function (a, b) { return a - b; });
                }
                else {
                    intersectXs.sort(function (a, b) { return b - a; });
                }
                report.wpsCount += intersectXs.length;
                if (intersectXs.length > 2) {
                    report.intersectCount += intersectXs.length;
                }
                // 이전 방향 변경점이 있으면 새로 촬영 시작하는 점과 연결되는 선과 모든 선을 비교하여 충돌하는 곳이 몇 개인지 확인
                if (prevOffset != null) {
                    var p3_1 = prevOffset;
                    var p4_1 = new PolygonUtil.CGPoint(intersectXs[0], yOffset);
                    rotatedLines.forEach(function (_a) {
                        var p1 = _a[0], p2 = _a[1];
                        if (PolygonUtil.jointExcludedIntersectionPoint(p1, p2, p3_1, p4_1) != null) {
                            // report.intersectCount += 1
                            report.movingIntersectCount += 1;
                        }
                    });
                }
                // 방향 변경점 저장
                prevOffset = new PolygonUtil.CGPoint(intersectXs[intersectXs.length - 1], yOffset);
                xDir *= -1.0;
                yOffset += soAreaSidePt;
            };
            while (yOffset <= pbox.maxY) {
                var state_1 = _loop_2();
                if (state_1 === "break")
                    break;
            }
            reports.push(report);
        };
        var this_1 = this;
        for (var _i = 0, angles_1 = angles; _i < angles_1.length; _i++) {
            var angle = angles_1[_i];
            _loop_1(angle);
        }
        reports.sort(function (a, b) {
            return (a.intersectCount - b.intersectCount) || (a.wpsCount - b.wpsCount) || (a.movingIntersectCount - b.movingIntersectCount);
            // if (a.intersectCount == b.intersectCount) {
            //   if (a.wpsCount == b.wpsCount) {
            //     return a.movingIntersectCount - b.movingIntersectCount
            //   }
            //   else {
            //     return a.wpsCount - b.wpsCount
            //   }
            // }
            // else {
            //   return a.intersectCount - b.intersectCount
            // }
        });
        // for (const report of reports) {
        //   console.log(`angle: ${report.angle}, wps: ${report.wpsCount}, intxs: ${report.intersectCount}, movintxs: ${report.movingIntersectCount}`)
        // }
        if (deep) {
            var first_1 = reports[0];
            // 가장 좋았던 결과와 동일한 intersects 수, wps 수를 추출
            var candidates = reports.filter(function (report) { return report.intersectCount == first_1.intersectCount && report.wpsCount == first_1.wpsCount && report.movingIntersectCount == first_1.movingIntersectCount; });
            // 다각형을 이루는 선들의 각
            var lineAngles_1 = lines.map(function (line) { return PolygonUtil.angle(line[0], line[1], false); });
            // 후보 중 다각형을 이루는 선들의 각과 가장 가까운 각도를 찾음
            return candidates.map(function (candidate) {
                return lineAngles_1
                    .map(function (v) { return [candidate.angle, v - candidate.angle]; })
                    .sort(function (a, b) { return Math.abs(a[1]) - Math.abs(b[1]); })[0];
            })
                .sort(function (a, b) { return Math.abs(a[1]) - Math.abs(b[1]); })[0][0];
        }
        else {
            return reports[0].angle;
        }
    };
    // waypoint 만들기
    DronePath.prototype.make = function () {
        var _this = this;
        this.lastShootInfo = this.calcShootInfo();
        var soArea = this.lastShootInfo.nextShootDistance;
        // 추천 각도로 물체 회전
        if (this.autoFlightAngle) {
            this.flightAngle = this.recommendedFlightAngle();
        }
        var angle = this.flightAngle;
        var rotateRad = PolygonUtil.degreeToRadian(-angle);
        var box = PolygonUtil.boundBox(this.vertices);
        var boxCenter = new PolygonUtil.CGPoint(box.width / 2.0, box.height / 2.0);
        var at = transform(translate(box.origin.x + boxCenter.x, box.origin.y + boxCenter.y), rotate(rotateRad), translate(-box.origin.x - boxCenter.x, -box.origin.y - boxCenter.y));
        var rat = transform(translate(box.origin.x + boxCenter.x, box.origin.y + boxCenter.y), rotate(-rotateRad), translate(-box.origin.x - boxCenter.x, -box.origin.y - boxCenter.y));
        var rotatedVertices = this.vertices.map(function (pt) { return _this.applyToCGPoint(at, pt); });
        var rotatedLines = PolygonUtil.lines(rotatedVertices);
        // console.log(`angle: ${angle}, rotateRad: ${rotateRad}`)
        // console.log('rotatedVertices:')
        // for (const v of rotatedVertices) {
        //   console.log(`${v.y}, ${v.x}`)
        // }
        var pbox = PolygonUtil.boundBox(rotatedVertices);
        var pbox_heightMeter = this.coordSystem.distanceMeter(new PolygonUtil.CGPoint(pbox.origin.x, pbox.origin.y), new PolygonUtil.CGPoint(pbox.origin.x, pbox.maxY));
        var soAreaSidePt = (pbox.height * soArea.side) / pbox_heightMeter;
        var hlineCount = Math.floor(pbox.height / soAreaSidePt);
        var remainder = pbox.height - (hlineCount * soAreaSidePt);
        var startYOffset = pbox.origin.y + (remainder / 2.0);
        var wpis = [];
        // 시작점
        var yOffset = startYOffset + soAreaSidePt / 2.0;
        // 진행 방향
        var xDir = 1.0;
        var _loop_3 = function () {
            // yOffset 선상의 라인을 긋고 그 라인과 접하는 정점들을 구한다.
            var intersectXs = [];
            var p3 = new PolygonUtil.CGPoint(pbox.origin.x, yOffset);
            var p4 = new PolygonUtil.CGPoint(pbox.maxX, yOffset);
            rotatedLines.forEach(function (_a) {
                var p1 = _a[0], p2 = _a[1];
                var pt, pts;
                if ((pt = PolygonUtil.intersectionPoint(p1, p2, p3, p4)) != null) {
                    intersectXs.push(pt.x);
                }
                else if ((pts = PolygonUtil.intersectionLineOnParallelLine(p1, p2, p3, p4)) != null) {
                    intersectXs = intersectXs.concat(pts.map(function (v) { return v.x; }));
                }
            });
            if (intersectXs.length == 0) {
                console.log('intersection length is zero.');
                return "break";
            }
            // todo: 교차선이 여러개인 경우 어쩌지? 일단 피해 가지 않는다.
            if (xDir > 0) {
                intersectXs.sort(function (a, b) { return a - b; });
            }
            else {
                intersectXs.sort(function (a, b) { return b - a; });
            }
            var cameraOn = true;
            wpis = wpis.concat(intersectXs.map(function (x) {
                var wpi = new WayPointInfo();
                wpi.point = new PolygonUtil.CGPoint(x, yOffset);
                wpi.isCameraOn = cameraOn;
                cameraOn = !cameraOn;
                return wpi;
            }));
            xDir *= -1.0;
            yOffset += soAreaSidePt;
        };
        while (yOffset <= pbox.maxY) {
            var state_2 = _loop_3();
            if (state_2 === "break")
                break;
        }
        wpis.forEach(function (wpi) {
            wpi.point = _this.applyToCGPoint(rat, wpi.point);
        });
        return wpis;
    };
    // 높이에 따른 촬영 영역 구하기
    DronePath.prototype.calcShootInfo = function (altitude) {
        var si = new ShootInformation();
        si.shootSize.side = 2.0 * Math.tan(PolygonUtil.degreeToRadian(this.FOV / 2.0)) * (altitude || this.flightAltitude);
        si.shootSize.front = si.shootSize.side * (this.cameraResolution.height / this.cameraResolution.width);
        // 픽셀 정밀도 (meter per pixel)
        si.distancePerPixel = si.shootSize.side / this.cameraResolution.width;
        // 중첩도에 따른 다음 샷까지 이동 거리 (width: 드론 진행 방향 좌우 길이, height: 드론 진행 방향 앞뒤 길이)
        si.nextShootDistance.side = si.shootSize.side * (1.0 - this.sideOverlap);
        si.nextShootDistance.front = si.shootSize.front * (1.0 - this.frontOverlap);
        // 필요한 셔터 스피드 계산하기 (flightSpeed, flightAltitude, frontOverlap에 따른)
        // 속도가 minFlightSpeed보다 작을 경우 flightSpeed 값을 maxFlightSpeed() 결과로 바꿔야 한다.
        si.shootInterval = si.nextShootDistance.front / this.flightSpeed;
        // 최고 속도 계산 (최저 셔터스피드에서의)
        si.availableMaxFlightSpeed = Math.min(si.nextShootDistance.front / this.minShutterSpeed, this.maxFlightSpeed);
        return si;
    };
    // 거리 정밀도에 따른 촬영 높이 구하기
    DronePath.prototype.altitudeByDistance = function (distancePerPoint) {
        var alt = this.cameraResolution.width * distancePerPoint / (2.0 * Math.tan(PolygonUtil.degreeToRadian(this.FOV / 2.0)));
        return alt;
    };
    // 최고 속도 계산 (지정 셔터스피드에서의)
    DronePath.prototype.calcMaxFlightSpeed = function (shutterSpeed) {
        var nextShootInterval = this.calcShootInfo().nextShootDistance;
        var speed = nextShootInterval.front / (shutterSpeed || this.minShutterSpeed);
        return Math.min(speed, this.maxFlightSpeed);
    };
    // 다각형 면적 구하기
    DronePath.prototype.area = function () {
        return PolygonUtil.areaPolygon(this.vertices, this.coordSystem).area;
    };
    // 촬영 바운드 구하기
    DronePath.prototype.shootBoundSize = function () {
        var _this = this;
        var fang = -this.flightAngle;
        var box = PolygonUtil.boundBox(this.vertices);
        var boxCenter = new PolygonUtil.CGPoint(box.width / 2.0, box.height / 2.0);
        // console.log('boxCenter: ', box, boxCenter)
        var at = transform(translate(box.origin.x + boxCenter.x, box.origin.y + boxCenter.y), rotate(PolygonUtil.degreeToRadian(fang)), translate(-box.origin.x - boxCenter.x, -box.origin.y - boxCenter.y));
        var rotatedVertices = this.vertices.map(function (vertex) { return _this.applyToCGPoint(at, vertex); });
        var pbox = PolygonUtil.boundBox(rotatedVertices);
        // console.log('pbox: ', pbox)
        var widthMeter = this.coordSystem.distanceMeter(new PolygonUtil.CGPoint(pbox.origin.x, pbox.midY), new PolygonUtil.CGPoint(pbox.maxX, pbox.midY));
        var heightMeter = this.coordSystem.distanceMeter(new PolygonUtil.CGPoint(pbox.origin.x, pbox.origin.y), new PolygonUtil.CGPoint(pbox.origin.x, pbox.maxY));
        return new PolygonUtil.CGSize(widthMeter, heightMeter);
    };
    // 비행 거리 계산
    DronePath.prototype.flightDistance = function (wayPoints, homePoint) {
        var _this = this;
        var lines = [];
        for (var i = 1; i < wayPoints.length; i++) {
            lines.push([wayPoints[i - 1].point, wayPoints[i].point]);
        }
        var accDistance = lines.reduce(function (acc, line) {
            return acc + _this.coordSystem.distanceMeter(line[0], line[1]);
        }, 0);
        // todo: homePoint 거리 추가
        return accDistance;
    };
    // 거리나 타이머에 의해 찍히는 사진의 예상 개수 구하기
    DronePath.prototype.countShoot = function (wpis, byDistance, shootInfo) {
        var _this = this;
        var prevCameraOn = false;
        var prevPoint = new PolygonUtil.CGPoint(0, 0);
        var lines = [];
        wpis.forEach(function (wpi) {
            if (prevCameraOn) {
                // 촬영 중이었다면 (on -> on/off)
                lines.push([prevPoint, wpi.point]);
            }
            prevCameraOn = wpi.isCameraOn;
            prevPoint = wpi.point;
        });
        if (byDistance) {
            return lines.reduce(function (count, line) {
                var lineMeter = _this.coordSystem.distanceMeter(line[0], line[1]);
                return count + Number(Math.ceil(lineMeter / shootInfo.nextShootDistance.front));
            }, 0);
        }
        else {
            // todo: 가속도와 전체 거리 계산
            return 0;
        }
    };
    DronePath.prototype.lines = function () {
        return PolygonUtil.lines(this.vertices);
    };
    DronePath.prototype.applyToCGPoint = function (matrix, point) {
        var pt = applyToPoint(matrix, point);
        return new PolygonUtil.CGPoint(pt.x, pt.y);
    };
    return DronePath;
}());
export { DronePath };
// }
//# sourceMappingURL=waypointGenerator.js.map