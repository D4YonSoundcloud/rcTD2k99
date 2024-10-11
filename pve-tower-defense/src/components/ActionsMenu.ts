import { CameraSystem } from './CameraSystem';

export class ActionsMenu {
    private menu: HTMLDivElement;
    private cameraSystem: CameraSystem;
    private isMenuVisible: boolean = false;

    constructor(cameraSystem: CameraSystem) {
        this.cameraSystem = cameraSystem;
        this.menu = this.createMenu();
        this.addEventListeners();
    }

    private createMenu(): HTMLDivElement {
        const menu = document.createElement('div');
        menu.style.position = 'absolute';
        menu.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        menu.style.border = '1px solid #ccc';
        menu.style.borderRadius = '8px';
        menu.style.padding = '10px';
        menu.style.display = 'none';
        menu.style.flexDirection = 'row';
        menu.style.gap = '10px';
        menu.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';

        const rotateLeftBtn = this.createButton('rotate-left', this.createRotateIcon('left'), () => this.cameraSystem.rotateCamera('left'));
        const rotateRightBtn = this.createButton('rotate-right', this.createRotateIcon('right'), () => this.cameraSystem.rotateCamera('right'));
        const zoomInBtn = this.createButton('zoom-in', this.createZoomIcon('in'), () => this.cameraSystem.zoomIn());
        const zoomOutBtn = this.createButton('zoom-out', this.createZoomIcon('out'), () => this.cameraSystem.zoomOut());

        menu.appendChild(rotateLeftBtn);
        menu.appendChild(rotateRightBtn);
        menu.appendChild(zoomInBtn);
        menu.appendChild(zoomOutBtn);

        document.body.appendChild(menu);
        return menu;
    }

    private createButton(id: string, icon: SVGSVGElement, onClick: () => void): HTMLButtonElement {
        const button = document.createElement('button');
        button.id = id;
        button.appendChild(icon);
        button.style.background = 'none';
        button.style.border = 'none';
        button.style.cursor = 'pointer';
        button.style.padding = '5px';
        button.style.borderRadius = '4px';
        button.style.transition = 'background-color 0.3s';
        button.addEventListener('mouseover', () => button.style.backgroundColor = 'rgba(0, 0, 0, 0.1)');
        button.addEventListener('mouseout', () => button.style.backgroundColor = 'transparent');
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent menu from closing when clicking a button
            onClick();
        });
        return button;
    }

    private createRotateIcon(direction: 'left' | 'right'): SVGSVGElement {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '32');
        svg.setAttribute('height', '40');
        svg.setAttribute('viewBox', '0 0 32 40');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('stroke-width', '2');
        svg.setAttribute('stroke-linecap', 'round');
        svg.setAttribute('stroke-linejoin', 'round');

        // Camera body
        const camera = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        camera.setAttribute('d', 'M2 8h28v16H2z');
        svg.appendChild(camera);

        // Camera lens
        const lens = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        lens.setAttribute('cx', '16');
        lens.setAttribute('cy', '16');
        lens.setAttribute('r', '5');
        svg.appendChild(lens);

        // Rotation arrow
        const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        if (direction === 'left') {
            arrow.setAttribute('d', 'M12 34l-4 2 2-4');
            arrow.setAttribute('transform', 'rotate(45 10 35)');
        } else {
            arrow.setAttribute('d', 'M20 34l4 2-2-4');
            arrow.setAttribute('transform', 'rotate(-45 22 35)');
        }
        svg.appendChild(arrow);

        return svg;
    }

    private createZoomIcon(direction: 'in' | 'out'): SVGSVGElement {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '32');
        svg.setAttribute('height', '32');
        svg.setAttribute('viewBox', '0 0 32 32');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('stroke-width', '2');
        svg.setAttribute('stroke-linecap', 'round');
        svg.setAttribute('stroke-linejoin', 'round');

        // Magnifying glass circle
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', '14');
        circle.setAttribute('cy', '14');
        circle.setAttribute('r', '9');
        svg.appendChild(circle);

        // Magnifying glass handle
        const handle = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        handle.setAttribute('x1', '21');
        handle.setAttribute('y1', '21');
        handle.setAttribute('x2', '28');
        handle.setAttribute('y2', '28');
        svg.appendChild(handle);

        // Plus or minus sign
        const sign = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        if (direction === 'in') {
            const vLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            vLine.setAttribute('x1', '14');
            vLine.setAttribute('y1', '10');
            vLine.setAttribute('x2', '14');
            vLine.setAttribute('y2', '18');
            sign.appendChild(vLine);
        }
        const hLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        hLine.setAttribute('x1', '10');
        hLine.setAttribute('y1', '14');
        hLine.setAttribute('x2', '18');
        hLine.setAttribute('y2', '14');
        sign.appendChild(hLine);
        svg.appendChild(sign);

        return svg;
    }

    private addEventListeners(): void {
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showMenu(e.clientX, e.clientY);
        });

        document.addEventListener('click', (e) => {
            if (this.isMenuVisible && !this.menu.contains(e.target as Node)) {
                this.hideMenu();
            }
        });

        // Prevent the menu from closing when clicking inside it
        this.menu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    private showMenu(x: number, y: number): void {
        this.menu.style.display = 'flex';
        const rightEdge = window.innerWidth - this.menu.offsetWidth - 10;
        const bottomEdge = window.innerHeight - this.menu.offsetHeight - 10;
        this.menu.style.left = `${Math.min(x, rightEdge)}px`;
        this.menu.style.top = `${Math.min(y, bottomEdge)}px`;
        this.isMenuVisible = true;
    }

    private hideMenu(): void {
        this.menu.style.display = 'none';
        this.isMenuVisible = false;
    }
}