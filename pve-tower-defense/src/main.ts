import './style.css'
import * as THREE from 'three'

console.log('PvE Tower Defense Game initialized')

class Game {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private cube: THREE.Mesh;

    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.cube = this.createCube();

        this.init();
    }

    private init(): void {
        this.camera.position.z = 5;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.scene.add(this.cube);

        window.addEventListener('resize', () => this.onWindowResize(), false);

        this.animate();
    }

    private createCube(): THREE.Mesh {
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        return new THREE.Mesh(geometry, material);
    }

    private onWindowResize(): void {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    private animate(): void {
        requestAnimationFrame(() => this.animate());

        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the game
const game = new Game();