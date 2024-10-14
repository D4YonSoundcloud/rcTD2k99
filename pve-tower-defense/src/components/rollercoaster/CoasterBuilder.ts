import * as THREE from 'three';
import { GridSystem } from './GridSystem';
import { TrackPiece, TrackType } from './TrackPiece';
import { StraightTrack } from './StraightTrack';
import { CurveTrack } from './CurveTrack';
import { SlopeTrack } from './SlopeTrack';

export class CoasterBuilder {
    private scene: THREE.Scene;
    private gridSystem: GridSystem;
    private trackPieces: TrackPiece[] = [];
    private currentPiecePreview: THREE.Object3D | null = null;

    constructor(scene: THREE.Scene) {
        this.scene = scene;
        this.gridSystem = new GridSystem(scene);
    }

    public startBuilding(startPosition: THREE.Vector3): void {
        // Implement logic to start building from the given position
    }

    public previewTrackPiece(type: TrackType, length: number, angle: number, position: THREE.Vector3): void {
        console.log(`Previewing track piece: type = ${TrackType[type]}, length = ${length}, angle = ${angle}, position = (${position.x}, ${position.y}, ${position.z})`);

        if (isNaN(length) || length <= 0) {
            console.error('Invalid length for track piece');
            return;
        }

        if (this.currentPiecePreview) {
            this.scene.remove(this.currentPiecePreview);
        }

        const snappedPosition = this.gridSystem.getSnappedPosition(position);
        let trackPiece: TrackPiece;

        switch (type) {
            case TrackType.STRAIGHT:
                trackPiece = new StraightTrack(length, snappedPosition);
                break;
            case TrackType.CURVE:
                trackPiece = new CurveTrack(length, angle, snappedPosition);
                break;
            case TrackType.SLOPE:
                trackPiece = new SlopeTrack(length, angle, snappedPosition);
                break;
            default:
                console.error('Unknown track type');
                return;
        }

        this.currentPiecePreview = trackPiece.getMesh();
        const previewMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.5 });
        this.currentPiecePreview.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.material = previewMaterial;
            }
        });

        this.scene.add(this.currentPiecePreview);
    }

    public placeTrackPiece(type: TrackType, length: number, angle: number, position: THREE.Vector3): void {
        console.log(`Placing track piece: type = ${TrackType[type]}, length = ${length}, angle = ${angle}, position = (${position.x}, ${position.y}, ${position.z})`);

        if (isNaN(length) || length <= 0) {
            console.error('Invalid length for track piece');
            return;
        }

        const snappedPosition = this.gridSystem.getSnappedPosition(position);
        let trackPiece: TrackPiece;

        switch (type) {
            case TrackType.STRAIGHT:
                trackPiece = new StraightTrack(length, snappedPosition);
                break;
            case TrackType.CURVE:
                trackPiece = new CurveTrack(length, angle, snappedPosition);
                break;
            case TrackType.SLOPE:
                trackPiece = new SlopeTrack(length, angle, snappedPosition);
                break;
            default:
                console.error('Unknown track type');
                return;
        }

        this.trackPieces.push(trackPiece);
        this.scene.add(trackPiece.getMesh());

        if (this.currentPiecePreview) {
            this.scene.remove(this.currentPiecePreview);
            this.currentPiecePreview = null;
        }
    }

    public removeLastTrackPiece(): void {
        // Implement logic to remove the last placed track piece
    }

    public isValidPlacement(position: THREE.Vector3): boolean {
        // Implement logic to check if a track piece can be placed at the given position
        return this.gridSystem.isWithinGrid(position);
    }

    public getTrackPieces(): TrackPiece[] {
        return this.trackPieces;
    }

    // Implement other methods for modifying the coaster (e.g., changing elevation, banking)
}