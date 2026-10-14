import { _decorator, Component, input, Input } from 'cc';
import { Hazard } from './Hazard';
import { UI } from './UI';

const { ccclass, property } = _decorator;

enum FreezeState {
    Ready,
    Freezing,
    Cooldown,
}

@ccclass('TimeFreeze')
export class TimeFreeze extends Component {
    @property(Hazard)
    public hazard: Hazard | null = null;

    @property(UI)
    public ui: UI | null = null;

    @property
    public freezeDuration = 1.0;

    @property
    public cooldownDuration = 1.0;

    private state: FreezeState = FreezeState.Ready;
    private freezeTimer = 0;
    private cooldownTimer = 0;
    private holding = false;

    protected onEnable(): void {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        input.on(Input.EventType.MOUSE_DOWN, this.onTouchStart, this);
        input.on(Input.EventType.MOUSE_UP, this.onTouchEnd, this);
    }

    protected onDisable(): void {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.off(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        input.off(Input.EventType.MOUSE_DOWN, this.onTouchStart, this);
        input.off(Input.EventType.MOUSE_UP, this.onTouchEnd, this);

        this.stopFreeze();
    }

    protected update(deltaTime: number): void {
        if (this.state === FreezeState.Freezing) {
            this.freezeTimer += deltaTime;

            const progress = Math.max(0, 1 - this.freezeTimer / this.freezeDuration);
            this.ui?.updateFreezeProgress(progress);

            if (this.freezeTimer >= this.freezeDuration) {
                this.stopFreeze();
            }
        } else if (this.state === FreezeState.Cooldown) {
            this.cooldownTimer += deltaTime;

            const progress = Math.min(1, this.cooldownTimer / this.cooldownDuration);
            this.ui?.updateFreezeProgress(progress);

            if (this.cooldownTimer >= this.cooldownDuration) {
                this.state = FreezeState.Ready;
                this.ui?.updateFreezeProgress(1);
            }
        }
    }

    private onTouchStart(): void {
        if (this.holding || this.state !== FreezeState.Ready || !this.hazard) {
            return;
        }

        this.holding = true;
        this.state = FreezeState.Freezing;
        this.freezeTimer = 0;
        this.hazard.setFrozen(true);
    }

    private onTouchEnd(): void {
        this.holding = false;

        if (this.state === FreezeState.Freezing) {
            this.stopFreeze();
        }
    }

    private stopFreeze(): void {
        if (this.state !== FreezeState.Freezing) {
            return;
        }

        this.hazard?.setFrozen(false);
        this.freezeTimer = 0;
        this.cooldownTimer = 0;
        this.state = FreezeState.Cooldown;
    }

    public resetFreeze(): void {
        this.holding = false;
        this.freezeTimer = 0;
        this.cooldownTimer = 0;
        this.state = FreezeState.Ready;

        this.hazard?.setFrozen(false);
        this.ui?.updateFreezeProgress(1);
    }
}