import * as THREE from 'three';

export enum TrackType {
    STRAIGHT,
    CURVE,
    SLOPE
}

export abstract class TrackPiece {
    protected mesh: THREE.Object3D;
    protected type: TrackType;
    protected length: number;
    protected startPoint: THREE.Vector3;
    protected endPoint: THREE.Vector3;

    constructor(type: TrackType, length: number, startPoint: THREE.Vector3) {
        this.type = type;
        this.length = length;
        this.startPoint = startPoint;
        this.endPoint = this.calculateEndPoint();
        // The mesh will be created by the derived class constructor
    }

    protected abstract createMesh(): THREE.Object3D;
    protected abstract calculateEndPoint(): THREE.Vector3;

    public getMesh(): THREE.Object3D {
        return this.mesh;
    }

    public getType(): TrackType {
        return this.type;
    }

    public getLength(): number {
        return this.length;
    }

    public getStartPoint(): THREE.Vector3 {
        return this.startPoint.clone();
    }

    public getEndPoint(): THREE.Vector3 {
        return this.endPoint.clone();
    }

    public abstract getNextPieceOrientation(): THREE.Quaternion;
}