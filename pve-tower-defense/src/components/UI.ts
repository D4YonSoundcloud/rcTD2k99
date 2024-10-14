import { TrackType } from './rollercoaster/TrackPiece';

export class UI {
    private container: HTMLDivElement;
    private selectedTrackType: TrackType = TrackType.STRAIGHT;
    private trackLength: number = 4;
    private trackAngle: number = 30;

    constructor() {
        this.container = document.createElement('div');
        this.container.id = 'coaster-ui';
        this.createUI();
        document.body.appendChild(this.container);
    }

    private createUI(): void {
        const trackTypes = Object.values(TrackType).filter(value => typeof value === 'number');
        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'track-type-buttons';

        trackTypes.forEach(type => {
            const button = document.createElement('button');
            button.textContent = TrackType[type as number];
            button.addEventListener('click', () => this.setTrackType(type as TrackType));
            buttonContainer.appendChild(button);
        });

        const lengthInput = document.createElement('input');
        lengthInput.type = 'number';
        lengthInput.value = this.trackLength.toString();
        lengthInput.addEventListener('change', (e) => this.trackLength = Number((e.target as HTMLInputElement).value));

        const angleInput = document.createElement('input');
        angleInput.type = 'number';
        angleInput.value = this.trackAngle.toString();
        angleInput.addEventListener('change', (e) => this.trackAngle = Number((e.target as HTMLInputElement).value));

        this.container.appendChild(buttonContainer);
        this.container.appendChild(lengthInput);
        this.container.appendChild(angleInput);

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            #coaster-ui {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background-color: rgba(0, 0, 0, 0.7);
                padding: 10px;
                border-radius: 5px;
            }
            #track-type-buttons {
                display: flex;
                gap: 10px;
                margin-bottom: 10px;
            }
            #track-type-buttons button {
                padding: 5px 10px;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 3px;
                cursor: pointer;
            }
            #track-type-buttons button:hover {
                background-color: #45a049;
            }
            input {
                margin: 5px;
                padding: 5px;
            }
        `;
        document.head.appendChild(style);
    }

    private setTrackType(type: TrackType): void {
        this.selectedTrackType = type;
        console.log(`Selected track type: ${TrackType[type]}`);
    }

    public getSelectedTrackType(): TrackType {
        return this.selectedTrackType;
    }

    public getTrackLength(): number {
        return this.trackLength;
    }

    public getTrackAngle(): number {
        return this.trackAngle;
    }
}