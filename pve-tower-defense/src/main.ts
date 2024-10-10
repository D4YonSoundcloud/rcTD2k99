import './style.css';
import * as THREE from 'three';
import { CameraSystem } from './components/CameraSystem';

class Game {
    private scene: THREE.Scene;
    private cameraSystem: CameraSystem;
    private renderer: THREE.WebGLRenderer;
    private objects: THREE.Object3D[] = [];

    constructor() {
        this.scene = new THREE.Scene();
        this.cameraSystem = new CameraSystem(window.innerWidth / window.innerHeight);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });

        this.init();
    }

    private init(): void {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x87CEEB); // Sky blue background
        document.body.appendChild(this.renderer.domElement);

        this.createDemoScene();
        this.addLighting();
        this.createRotationButtons();

        window.addEventListener('resize', () => this.onWindowResize(), false);
        document.addEventListener('keydown', (event) => this.onKeyDown(event));
        document.addEventListener('mousemove', (event) => this.onMouseMove(event));

        this.animate();
    }

    private createDemoScene(): void {
        // Create ground plane
        const groundGeometry = new THREE.PlaneGeometry(40, 40);
        const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x7CFC00 }); // Lawn green
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        this.scene.add(ground);

        // Create grid
        const gridHelper = new THREE.GridHelper(40, 40);
        this.scene.add(gridHelper);

        // Create buildings
        for (let i = 0; i < 20; i++) {
            const building = this.createBuilding();
            building.position.set(
                Math.random() * 36 - 18,
                building.scale.y / 2,
                Math.random() * 36 - 18
            );
            this.scene.add(building);
            this.objects.push(building);
        }

        // Create trees
        for (let i = 0; i < 50; i++) {
            const tree = this.createTree();
            tree.position.set(
                Math.random() * 38 - 19,
                0,
                Math.random() * 38 - 19
            );
            this.scene.add(tree);
            this.objects.push(tree);
        }
    }

    private createBuilding(): THREE.Mesh {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff });
        const building = new THREE.Mesh(geometry, material);
        building.scale.set(
            0.5 + Math.random() * 1.5,
            0.5 + Math.random() * 3,
            0.5 + Math.random() * 1.5
        );
        return building;
    }

    private createTree(): THREE.Group {
        const trunk = new THREE.Mesh(
            new THREE.CylinderGeometry(0.1, 0.1, 0.5),
            new THREE.MeshStandardMaterial({ color: 0x8B4513 })
        );
        trunk.position.y = 0.25;

        const leaves = new THREE.Mesh(
            new THREE.ConeGeometry(0.5, 1, 8),
            new THREE.MeshStandardMaterial({ color: 0x228B22 })
        );
        leaves.position.y = 1;

        const tree = new THREE.Group();
        tree.add(trunk);
        tree.add(leaves);
        return tree;
    }

    private addLighting(): void {
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
        directionalLight.position.set(5, 10, 7.5);
        this.scene.add(directionalLight);

        const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.5);
        this.scene.add(hemisphereLight);
    }

    private createRotationButtons(): void {
        const rotateLeftBtn = document.createElement('button');
        rotateLeftBtn.textContent = 'Rotate Left';
        rotateLeftBtn.style.position = 'absolute';
        rotateLeftBtn.style.left = '10px';
        rotateLeftBtn.style.top = '10px';
        rotateLeftBtn.addEventListener('click', () => this.cameraSystem.rotateCamera('left'));
        document.body.appendChild(rotateLeftBtn);

        const rotateRightBtn = document.createElement('button');
        rotateRightBtn.textContent = 'Rotate Right';
        rotateRightBtn.style.position = 'absolute';
        rotateRightBtn.style.right = '10px';
        rotateRightBtn.style.top = '10px';
        rotateRightBtn.addEventListener('click', () => this.cameraSystem.rotateCamera('right'));
        document.body.appendChild(rotateRightBtn);
    }

    private onWindowResize(): void {
        const aspect = window.innerWidth / window.innerHeight;
        this.cameraSystem.updateAspect(aspect);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    private onKeyDown(event: KeyboardEvent): void {
        switch (event.key) {
            case 'ArrowUp':
                this.cameraSystem.moveCamera('up');
                break;
            case 'ArrowDown':
                this.cameraSystem.moveCamera('down');
                break;
            case 'ArrowLeft':
                this.cameraSystem.moveCamera('left');
                break;
            case 'ArrowRight':
                this.cameraSystem.moveCamera('right');
                break;
        }
    }

    private onMouseMove(event: MouseEvent): void {
        this.cameraSystem.handleEdgeScrolling(
            event.clientX,
            event.clientY,
            window.innerWidth,
            window.innerHeight
        );
    }

    private animate(): void {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.cameraSystem.getCamera());
    }
}

// Initialize the game
const game = new Game();