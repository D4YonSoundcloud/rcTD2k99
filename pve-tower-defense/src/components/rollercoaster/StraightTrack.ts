import * as THREE from 'three';
import { TrackPiece, TrackType } from './TrackPiece';
import { TrackGeometry } from './TrackGeometry';

export class StraightTrack extends TrackPiece {
    constructor(length: number, startPoint: THREE.Vector3) {
        super(TrackType.STRAIGHT, length, startPoint);

        this.mesh = this.createMesh();
    }

    protected createMesh(): THREE.Object3D {
        const geometry = TrackGeometry.createStraightTrack(this.length);
        const material = new THREE.MeshStandardMaterial({ color: 0x888888 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(this.startPoint);
        return mesh;
    }

    protected calculateEndPoint(): THREE.Vector3 {
        return new THREE.Vector3(
            this.startPoint.x + this.length,
            this.startPoint.y,
            this.startPoint.z
        );
    }

    public getNextPieceOrientation(): THREE.Quaternion {
        return new THREE.Quaternion(); // No rotation for straight pieces
    }
}