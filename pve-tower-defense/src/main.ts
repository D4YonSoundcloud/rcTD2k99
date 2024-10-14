import './style.css';
import * as THREE from 'three';
import { CameraSystem } from './components/CameraSystem';
import { ActionsMenu } from './components/ActionsMenu';
import { CoasterBuilder } from './components/rollercoaster/CoasterBuilder';
import { TrackType } from './components/rollercoaster/TrackPiece';
import { UI } from './components/UI';

class Game {
    private scene: THREE.Scene;
    private cameraSystem: CameraSystem;
    private renderer: THREE.WebGLRenderer;
    private objects: THREE.Object3D[] = [];
    private actionsMenu: ActionsMenu;
    private coasterBuilder: CoasterBuilder;
    private raycaster: THREE.Raycaster;
    private mouse: THREE.Vector2;
    private buildMode: boolean = false;
    private ui: UI;

    constructor() {
        this.scene = new THREE.Scene();
        this.cameraSystem = new CameraSystem(window.innerWidth / window.innerHeight);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.actionsMenu = new ActionsMenu(this.cameraSystem);
        this.coasterBuilder = new CoasterBuilder(this.scene);
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.ui = new UI();

        this.init();
    }

    private init(): void {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x87CEEB); // Sky blue background
        document.body.appendChild(this.renderer.domElement);

        this.createDemoScene();
        this.addLighting();

        window.addEventListener('resize', () => this.onWindowResize(), false);
        document.addEventListener('keydown', (event) => this.onKeyDown(event));
        document.addEventListener('mousemove', (event) => this.onMouseMove(event));
        document.addEventListener('click', (event) => this.onClick(event));
        document.addEventListener('wheel', (event) => this.onWheel(event), { passive: false });

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

    private onWindowResize(): void {
        const aspect = window.innerWidth / window.innerHeight;
        this.cameraSystem.updateAspect(aspect);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    private onWheel(event: WheelEvent): void {
        event.preventDefault(); // Prevent page scrolling

        const delta = Math.sign(event.deltaY);
        const currentZoom = this.cameraSystem.getCurrentZoomLevel();
        const totalZoomLevels = this.cameraSystem.getTotalZoomLevels();

        if (delta > 0 && currentZoom < totalZoomLevels - 1) {
            this.cameraSystem.zoomOut();
        } else if (delta < 0 && currentZoom > 0) {
            this.cameraSystem.zoomIn();
        }
    }

    private onMouseMove(event: MouseEvent): void {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        if (this.buildMode) {
            this.updateTrackPreview();
        }
    }

    private onClick(event: MouseEvent): void {
        if (this.buildMode) {
            this.raycaster.setFromCamera(this.mouse, this.cameraSystem.getCamera());
            const intersects = this.raycaster.intersectObjects(this.scene.children, true);

            if (intersects.length > 0) {
                const intersectionPoint = intersects[0].point;
                console.log('Placing track at:', intersectionPoint);
                const selectedTrackType = this.ui.getSelectedTrackType();
                const trackLength = this.ui.getTrackLength();
                const trackAngle = this.ui.getTrackAngle();
                this.coasterBuilder.placeTrackPiece(selectedTrackType, trackLength, trackAngle, intersectionPoint);
            }
        }
    }

    private updateTrackPreview(): void {
        this.raycaster.setFromCamera(this.mouse, this.cameraSystem.getCamera());
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);

        if (intersects.length > 0) {
            const intersectionPoint = intersects[0].point;
            console.log('Intersection point:', intersectionPoint);
            const selectedTrackType = this.ui.getSelectedTrackType();
            const trackLength = this.ui.getTrackLength();
            const trackAngle = this.ui.getTrackAngle();
            this.coasterBuilder.previewTrackPiece(selectedTrackType, trackLength, trackAngle, intersectionPoint);
        } else {
            console.log('No intersection found');
        }
    }

    private placeTrackPiece(): void {
        this.raycaster.setFromCamera(this.mouse, this.cameraSystem.getCamera());
        const intersects = this.raycaster.intersectObjects(this.scene.children);

        if (intersects.length > 0) {
            const intersectionPoint = intersects[0].point;
            if (this.coasterBuilder.isValidPlacement(intersectionPoint)) {
                const selectedTrackType = this.ui.getSelectedTrackType();
                this.coasterBuilder.placeTrackPiece(selectedTrackType, 4, intersectionPoint);
            } else {
                console.log("Invalid placement position");
            }
        }
    }

    private onKeyDown(event: KeyboardEvent): void {
        switch (event.key) {
            case 'ArrowUp':
                this.cameraSystem.moveCamera('left');
                break;
            case 'ArrowDown':
                this.cameraSystem.moveCamera('right');
                break;
            case 'ArrowLeft':
                this.cameraSystem.moveCamera('up');
                break;
            case 'ArrowRight':
                this.cameraSystem.moveCamera('down');
                break;
            case 'b':
                this.toggleBuildMode();
                break;
        }
    }

    private toggleBuildMode(): void {
        this.buildMode = !this.buildMode;
        console.log(`Build mode ${this.buildMode ? 'enabled' : 'disabled'}`);
    }

    private animate(): void {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.cameraSystem.getCamera());
    }
}

// Initialize the game
const game = new Game();