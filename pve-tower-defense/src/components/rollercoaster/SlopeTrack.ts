import * as THREE from 'three';
import { TrackPiece, TrackType } from './TrackPiece';
import { TrackGeometry } from './TrackGeometry';

export class SlopeTrack extends TrackPiece {
    private angle: number;

    constructor(length: number, angle: number, startPoint: THREE.Vector3) {
        super(TrackType.SLOPE, length, startPoint);

        // Ensure angle is a number and clamp it between -45 and 45 degrees
        this.angle = isNaN(angle) ? 0 : THREE.MathUtils.clamp(angle, -45, 45);

        console.log(`SlopeTrack created: length = ${length}, angle = ${this.angle}, startPoint = (${startPoint.x}, ${startPoint.y}, ${startPoint.z})`);

        // Create the mesh immediately in the constructor
        this.mesh = this.createMesh();
    }

    protected createMesh(): THREE.Object3D {
        console.log(`Creating mesh for SlopeTrack: length = ${this.length}, angle = ${this.angle}`);
        const geometry = TrackGeometry.createSlopeTrack(this.length, this.angle);
        const material = new THREE.MeshStandardMaterial({ color: 0x888888 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(this.startPoint);
        console.log(`Mesh created and positioned at (${mesh.position.x}, ${mesh.position.y}, ${mesh.position.z})`);
        return mesh;
    }

    protected calculateEndPoint(): THREE.Vector3 {
        const angleRad = THREE.MathUtils.degToRad(this.angle);
        const heightChange = this.length * Math.sin(angleRad);
        const horizontalChange = this.length * Math.cos(angleRad);
        return new THREE.Vector3(
            this.startPoint.x + horizontalChange,
            this.startPoint.y + heightChange,
            this.startPoint.z
        );
    }

    public getNextPieceOrientation(): THREE.Quaternion {
        return new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), THREE.MathUtils.degToRad(-this.angle));
    }

    public getAngle(): number {
        return this.angle;
    }
}