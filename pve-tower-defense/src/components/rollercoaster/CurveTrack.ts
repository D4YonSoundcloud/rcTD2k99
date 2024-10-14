import * as THREE from 'three';
import { TrackPiece, TrackType } from './TrackPiece';
import { TrackGeometry } from './TrackGeometry';

export class CurveTrack extends TrackPiece {
    private radius: number;
    private angle: number;

    constructor(radius: number, angle: number, startPoint: THREE.Vector3) {
        const minAngle = 1; // Minimum angle in degrees
        const adjustedAngle = Math.max(minAngle, angle);
        const length = radius * adjustedAngle * Math.PI / 180;
        super(TrackType.CURVE, length, startPoint);
        this.radius = radius;
        this.angle = adjustedAngle;

        this.mesh = this.createMesh()
    }

    protected createMesh(): THREE.Object3D {
        const geometry = TrackGeometry.createCurvedTrack(this.radius, this.angle);
        const material = new THREE.MeshStandardMaterial({ color: 0x888888 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(this.startPoint);
        return mesh;
    }

    protected calculateEndPoint(): THREE.Vector3 {
        const angleRad = THREE.MathUtils.degToRad(this.angle);
        return new THREE.Vector3(
            this.startPoint.x + this.radius * Math.sin(angleRad),
            this.startPoint.y,
            this.startPoint.z + this.radius * (1 - Math.cos(angleRad))
        );
    }

    public getNextPieceOrientation(): THREE.Quaternion {
        return new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(this.angle));
    }
}