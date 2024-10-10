import * as THREE from 'three';

export class CameraSystem {
    private camera: THREE.OrthographicCamera;
    private currentAngle: number = 45; // Start at 45 degrees
    private cameraDistance: number = 50;
    private aspect: number;
    private moveSpeed: number = 0.5;

    constructor(aspect: number) {
        this.aspect = aspect;
        this.camera = this.createIsometricCamera();
        this.updateCameraPosition();
    }

    private createIsometricCamera(): THREE.OrthographicCamera {
        const frustumSize = 20;
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

    private updateCameraPosition(): void {
        const angle = THREE.MathUtils.degToRad(this.currentAngle);
        const x = Math.cos(angle) * this.cameraDistance;
        const z = Math.sin(angle) * this.cameraDistance;
        const y = this.cameraDistance;  // Keep Y constant for 45-degree angle

        this.camera.position.set(x, y, z);
        this.camera.lookAt(0, 0, 0);

        // Always keep the up vector pointing towards positive Y
        this.camera.up.set(0, 1, 0);

        this.camera.updateProjectionMatrix();
    }

    public moveCamera(direction: 'up' | 'down' | 'left' | 'right'): void {
        const moveDistance = this.moveSpeed;
        const angle = THREE.MathUtils.degToRad(this.currentAngle);
        const cosAngle = Math.cos(angle);
        const sinAngle = Math.sin(angle);

        switch (direction) {
            case 'up':
                this.camera.position.x -= sinAngle * moveDistance;
                this.camera.position.z += cosAngle * moveDistance;
                break;
            case 'down':
                this.camera.position.x += sinAngle * moveDistance;
                this.camera.position.z -= cosAngle * moveDistance;
                break;
            case 'left':
                this.camera.position.x -= cosAngle * moveDistance;
                this.camera.position.z -= sinAngle * moveDistance;
                break;
            case 'right':
                this.camera.position.x += cosAngle * moveDistance;
                this.camera.position.z += sinAngle * moveDistance;
                break;
        }
    }

    public updateAspect(newAspect: number): void {
        this.aspect = newAspect;
        const frustumSize = 20;
        this.camera.left = frustumSize * this.aspect / -2;
        this.camera.right = frustumSize * this.aspect / 2;
        this.camera.top = frustumSize / 2;
        this.camera.bottom = frustumSize / -2;
        this.camera.updateProjectionMatrix();
    }

    public handleEdgeScrolling(mouseX: number, mouseY: number, screenWidth: number, screenHeight: number): void {
        const edgeThreshold = 20; // pixels from edge to trigger scrolling

        if (mouseX < edgeThreshold) {
            this.moveCamera('left');
        } else if (mouseX > screenWidth - edgeThreshold) {
            this.moveCamera('right');
        }

        if (mouseY < edgeThreshold) {
            this.moveCamera('up');
        } else if (mouseY > screenHeight - edgeThreshold) {
            this.moveCamera('down');
        }
    }
}