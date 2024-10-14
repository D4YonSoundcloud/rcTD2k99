import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export class TrackGeometry {
    private static readonly TRACK_WIDTH: number = 1;
    private static readonly TRACK_HEIGHT: number = 0.2;
    private static readonly RAIL_RADIUS: number = 0.05;

    public static createStraightTrack(length: number): THREE.BufferGeometry {
        const baseGeometry = new THREE.BoxGeometry(length, TrackGeometry.TRACK_HEIGHT, TrackGeometry.TRACK_WIDTH);
        const railGeometry = new THREE.CylinderGeometry(TrackGeometry.RAIL_RADIUS, TrackGeometry.RAIL_RADIUS, length, 8);
        railGeometry.rotateZ(Math.PI / 2);

        const railOffset = (TrackGeometry.TRACK_WIDTH / 2) - TrackGeometry.RAIL_RADIUS;
        const leftRail = railGeometry.clone().translate(0, TrackGeometry.TRACK_HEIGHT / 2, railOffset);
        const rightRail = railGeometry.clone().translate(0, TrackGeometry.TRACK_HEIGHT / 2, -railOffset);

        const tieGeometry = new THREE.BoxGeometry(0.1, 0.1, TrackGeometry.TRACK_WIDTH);
        const tiesGeometries: THREE.BufferGeometry[] = [];

        for (let i = 0; i < length; i++) {
            const tieInstance = tieGeometry.clone().translate(i - length / 2 + 0.5, TrackGeometry.TRACK_HEIGHT / 2, 0);
            tiesGeometries.push(tieInstance);
        }

        const geometriesToMerge = [
            baseGeometry,
            leftRail,
            rightRail,
            ...tiesGeometries
        ];

        const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometriesToMerge);

        return mergedGeometry;
    }

    public static createCurvedTrack(radius: number, angle: number): THREE.BufferGeometry {
        const curveSegments = Math.max(1, Math.ceil(angle / 5)); // Ensure at least one segment
        const curve = new THREE.EllipseCurve(
            0, 0,
            radius, radius,
            0, THREE.MathUtils.degToRad(angle),
            false,
            0
        );

        const points = curve.getPoints(curveSegments);
        const geometries: THREE.BufferGeometry[] = [];

        for (let i = 0; i < points.length - 1; i++) {
            const start = points[i];
            const end = points[i + 1];
            const segment = this.createTrackSegment(start, end);
            geometries.push(segment);
        }

        // If we only have one point (for very small angles), create a minimal track segment
        if (geometries.length === 0) {
            const minimalSegment = this.createTrackSegment(new THREE.Vector2(0, 0), new THREE.Vector2(0.01, 0));
            geometries.push(minimalSegment);
        }

        return BufferGeometryUtils.mergeGeometries(geometries);
    }

    public static createSlopeTrack(length: number, angle: number): THREE.BufferGeometry {
        console.log(`Creating slope track: length = ${length}, angle = ${angle}`);

        const angleRad = THREE.MathUtils.degToRad(angle);
        const height = length * Math.sin(angleRad);
        const baseLength = length * Math.cos(angleRad);

        console.log(`Calculated values: angleRad = ${angleRad}, height = ${height}, baseLength = ${baseLength}`);

        // Create base geometry
        const baseGeometry = new THREE.BoxGeometry(baseLength, TrackGeometry.TRACK_HEIGHT, TrackGeometry.TRACK_WIDTH);
        baseGeometry.rotateZ(-angleRad);
        console.log('Base geometry created and rotated');

        // Create rail geometries
        const railGeometry = new THREE.CylinderGeometry(TrackGeometry.RAIL_RADIUS, TrackGeometry.RAIL_RADIUS, length, 8);
        railGeometry.rotateX(Math.PI / 2);
        railGeometry.rotateZ(-angleRad);
        console.log('Rail geometry created and rotated');

        const railOffset = (TrackGeometry.TRACK_WIDTH / 2) - TrackGeometry.RAIL_RADIUS;
        const leftRail = railGeometry.clone().translate(0, TrackGeometry.TRACK_HEIGHT / 2, railOffset);
        const rightRail = railGeometry.clone().translate(0, TrackGeometry.TRACK_HEIGHT / 2, -railOffset);
        console.log('Left and right rails created');

        // Create ties
        const tieGeometry = new THREE.BoxGeometry(TrackGeometry.TRACK_HEIGHT, TrackGeometry.TRACK_HEIGHT, TrackGeometry.TRACK_WIDTH);
        const tiesGeometries: THREE.BufferGeometry[] = [];

        const tieCount = Math.max(2, Math.floor(length));
        console.log(`Creating ${tieCount} ties`);

        for (let i = 0; i < tieCount; i++) {
            const t = i / (tieCount - 1);
            const tiePosition = new THREE.Vector3(
                (t - 0.5) * baseLength,
                (t - 0.5) * height,
                0
            );
            console.log(`Tie ${i} position:`, tiePosition);

            const tieInstance = tieGeometry.clone().translate(tiePosition.x, tiePosition.y, 0);
            tieInstance.rotateZ(-angleRad);
            tiesGeometries.push(tieInstance);
        }

        // Merge all geometries
        const geometriesToMerge = [
            baseGeometry,
            leftRail,
            rightRail,
            ...tiesGeometries
        ];

        console.log(`Merging ${geometriesToMerge.length} geometries`);
        const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometriesToMerge);

        if (!mergedGeometry) {
            console.error('Failed to merge geometries');
            return new THREE.BufferGeometry(); // Return an empty geometry as fallback
        }

        // Check for NaN values in the merged geometry
        const positions = mergedGeometry.getAttribute('position').array;
        for (let i = 0; i < positions.length; i++) {
            if (isNaN(positions[i])) {
                console.error(`NaN value found in merged geometry at index ${i}`);
            }
        }

        // Ensure the merged geometry has a valid bounding sphere
        mergedGeometry.computeBoundingSphere();

        if (!mergedGeometry.boundingSphere || isNaN(mergedGeometry.boundingSphere.radius)) {
            console.error('Invalid bounding sphere after computation');
        } else {
            console.log(`Bounding sphere computed: center = (${mergedGeometry.boundingSphere.center.x}, ${mergedGeometry.boundingSphere.center.y}, ${mergedGeometry.boundingSphere.center.z}), radius = ${mergedGeometry.boundingSphere.radius}`);
        }

        return mergedGeometry;
    }

    private static createTrackSegment(start: THREE.Vector2, end: THREE.Vector2): THREE.BufferGeometry {
        const segmentLength = start.distanceTo(end);
        const segmentAngle = Math.atan2(end.y - start.y, end.x - start.x);

        const baseGeometry = new THREE.BoxGeometry(segmentLength, TrackGeometry.TRACK_HEIGHT, TrackGeometry.TRACK_WIDTH);
        baseGeometry.rotateZ(segmentAngle);

        const railGeometry = new THREE.CylinderGeometry(TrackGeometry.RAIL_RADIUS, TrackGeometry.RAIL_RADIUS, segmentLength, 8);
        railGeometry.rotateZ(Math.PI / 2);
        railGeometry.rotateY(segmentAngle);

        const railOffset = (TrackGeometry.TRACK_WIDTH / 2) - TrackGeometry.RAIL_RADIUS;
        const leftRail = railGeometry.clone().translate(0, TrackGeometry.TRACK_HEIGHT / 2, railOffset);
        const rightRail = railGeometry.clone().translate(0, TrackGeometry.TRACK_HEIGHT / 2, -railOffset);

        const tieGeometry = new THREE.BoxGeometry(0.1, 0.1, TrackGeometry.TRACK_WIDTH);
        const tieInstance = tieGeometry.clone()
            .translate(0, TrackGeometry.TRACK_HEIGHT / 2, 0)
            .rotateZ(segmentAngle);

        const geometriesToMerge = [
            baseGeometry,
            leftRail,
            rightRail,
            tieInstance
        ];

        const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometriesToMerge);
        mergedGeometry.translate(start.x, start.y, 0);

        return mergedGeometry;
    }
}