import * as THREE from 'three';

export class GridSystem {
    private scene: THREE.Scene;
    private gridHelper: THREE.GridHelper;
    private cellSize: number = 1; // 1x1x1 meter cubes
    private gridSize: number = 40; // 40x40 grid

    constructor(scene: THREE.Scene) {
        this.scene = scene;
        this.createGrid();
    }

    private createGrid(): void {
        this.gridHelper = new THREE.GridHelper(this.gridSize, this.gridSize, 0x888888, 0x444444);
        this.gridHelper.position.y = 0;
        this.scene.add(this.gridHelper);
    }

    public getSnappedPosition(position: THREE.Vector3): THREE.Vector3 {
        const x = Math.round(position.x / this.cellSize) * this.cellSize;
        const z = Math.round(position.z / this.cellSize) * this.cellSize;
        const y = Math.round(position.y / 0.5) * 0.5; // Allow 0.5-meter vertical increments
        return new THREE.Vector3(x, y, z);
    }

    public highlightCell(position: THREE.Vector3): void {
        // Implement cell highlighting logic here
        // This could involve creating a temporary mesh or changing the color of grid lines
    }

    public isWithinGrid(position: THREE.Vector3): boolean {
        const halfSize = this.gridSize / 2;
        return (
            position.x >= -halfSize && position.x <= halfSize &&
            position.z >= -halfSize && position.z <= halfSize
        );
    }
}