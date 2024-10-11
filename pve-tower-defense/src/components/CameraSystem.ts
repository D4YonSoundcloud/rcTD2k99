import * as THREE from 'three';

export class CameraSystem {
    private camera: THREE.OrthographicCamera;
    private currentAngle: number = 45; // Start at 45 degrees
    private cameraDistance: number = 50;
    private aspect: number;
    private moveSpeed: number = 0.5;
    private centerPoint: THREE.Vector3;
    private maxDistance: number = 25; // Maximum distance from center

    private zoomLevels: number[] = [10, 15, 20, 25, 30, 35, 40, 45, 50]; // 5 zoom levels
    private currentZoomIndex: number = 2; // Start at middle zoom level

    constructor(aspect: number) {
        this.aspect = aspect;
        this.camera = this.createIsometricCamera();
        this.centerPoint = new THREE.Vector3(0, 0, 0);
        this.updateCameraPosition();
    }

    private createIsometricCamera(): THREE.OrthographicCamera {
        const frustumSize = this.zoomLevels[this.currentZoomIndex];
        const camera = new THREE.OrthographicCamera(
            frustumSize * this.aspect / -2,
            frustumSize * this.aspect / 2,
            frustumSize / 2,
            frustumSize / -2,
            0.1,
            1000
        );
        return camera;
    }

    public getCamera(): THREE.OrthographicCamera {
        return this.camera;
    }

    public rotateCamera(direction: 'left' | 'right'): void {
        this.currentAngle += direction === 'right' ? 90 : -90;
        this.currentAngle = (this.currentAngle + 360) % 360; // Ensure angle is always between 0 and 359
        this.updateCameraPosition();
    }

    public zoomIn(): void {
        if (this.currentZoomIndex > 0) {
            this.currentZoomIndex--;
            this.updateZoom();
        }
    }

    public zoomOut(): void {
        if (this.currentZoomIndex < this.zoomLevels.length - 1) {
            this.currentZoomIndex++;
            this.updateZoom();
        }
    }

    public getCurrentZoomLevel(): number {
        return this.currentZoomIndex;
    }

    public getTotalZoomLevels(): number {
        return this.zoomLevels.length;
    }

    private updateZoom(): void {
        const frustumSize = this.zoomLevels[this.currentZoomIndex];
        this.camera.left = frustumSize * this.aspect / -2;
        this.camera.right = frustumSize * this.aspect / 2;
        this.camera.top = frustumSize / 2;
        this.camera.bottom = frustumSize / -2;
        this.camera.updateProjectionMatrix();
    }

    private updateCameraPosition(): void {
        const angle = THREE.MathUtils.degToRad(this.currentAngle);
        const x = Math.cos(angle) * this.cameraDistance;
        const z = Math.sin(angle) * this.cameraDistance;
        const y = this.cameraDistance;  // Keep Y constant for 45-degree angle

        this.camera.position.set(
            this.centerPoint.x + x,
            this.centerPoint.y + y,
            this.centerPoint.z + z
        );
        this.camera.lookAt(this.centerPoint);

        // Always keep the up vector pointing towards positive Y
        this.camera.up.set(0, 1, 0);

        this.camera.updateProjectionMatrix();
    }

    public moveCamera(direction: 'up' | 'down' | 'left' | 'right'): void {
        const moveDistance = this.moveSpeed;
        const angle = THREE.MathUtils.degToRad(this.currentAngle);

        // Calculate the camera's forward and right vectors
        const forward = new THREE.Vector3(-Math.sin(angle), 0, Math.cos(angle)).normalize();
        const right = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle)).normalize();

        const movement = new THREE.Vector3();
        switch (direction) {
            case 'up':
                movement.add(forward.multiplyScalar(moveDistance));
                break;
            case 'down':
                movement.sub(forward.multiplyScalar(moveDistance));
                break;
            case 'left':
                movement.sub(right.multiplyScalar(moveDistance));
                break;
            case 'right':
                movement.add(right.multiplyScalar(moveDistance));
                break;
        }

        // Move the center point
        this.centerPoint.add(movement);

        // Constrain the center point
        const distanceFromOrigin = this.centerPoint.length();
        if (distanceFromOrigin > this.maxDistance) {
            this.centerPoint.normalize().multiplyScalar(this.maxDistance);
        }

        // Update the camera position based on the new center point
        this.updateCameraPosition();
    }

    public updateAspect(newAspect: number): void {
        this.aspect = newAspect;
        this.updateZoom();
    }
}