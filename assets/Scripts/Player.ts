import { _decorator, Collider, Component, ITriggerEvent, Vec3 } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {
    @property({ tooltip: 'Toc do chay (don vi/giay), huong +Z' })
    public speed = 5;

    private _startPosition = new Vec3();
    private _running = true;
    private _gameOver = false;

    protected onLoad(): void {
        this._startPosition.set(this.node.position);
    }

    protected update(dt: number): void {
        if (!this._running || this._gameOver) {
            return;
        }
        const p = this.node.position;
        this.node.setPosition(p.x, p.y, p.z + this.speed * dt);
    }

    protected onEnable(): void {
        const collider = this.getComponent(Collider);
        if (collider) {
            collider.on('onTriggerEnter', this.onTriggerEnter, this);
        }
    }

    protected onDisable(): void {
        const collider = this.getComponent(Collider);
        if (collider) {
            collider.off('onTriggerEnter', this.onTriggerEnter, this);
        }
    }

    private onTriggerEnter(event: ITriggerEvent): void {
        if (this._gameOver) {
            return;
        }

        const otherName = event.otherCollider.node.name;

        if (otherName === 'Hazard' || otherName === 'SwingArm') {
            this._gameOver = true;
            this._running = false;
            this.node.emit('player-lost');
        } else if (otherName === 'Goal') {
            this._gameOver = true;
            this._running = false;
            this.node.emit('player-won');
        }
    }

    public stop(): void {
        this._running = false;
    }

    public resetPlayer(): void {
        this.node.setPosition(this._startPosition);
        this._running = true;
        this._gameOver = false;
    }
}