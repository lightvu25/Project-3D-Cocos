import { _decorator, Button, Component } from 'cc';
import { Player } from './Player';
import { Hazard } from './Hazard';
import { TimeFreeze } from './TimeFreeze';
import { UI } from './UI';

const { ccclass, property } = _decorator;

enum GameState {
    Playing,
    Won,
    Lost,
}

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Player)
    public player: Player | null = null;

    @property(Hazard)
    public hazard: Hazard | null = null;

    @property(TimeFreeze)
    public timeFreeze: TimeFreeze | null = null;

    @property(UI)
    public ui: UI | null = null;

    private state: GameState = GameState.Playing;

    protected onLoad(): void {
        if (this.player) {
            this.player.node.on('player-won', this.onPlayerWon, this);
            this.player.node.on('player-lost', this.onPlayerLost, this);
        }

        if (this.ui && this.ui.retryButton) {
            this.ui.retryButton.on(Button.EventType.CLICK, this.retry, this);
        }
    }

    protected onDestroy(): void {
        if (this.player) {
            this.player.node.off('player-won', this.onPlayerWon, this);
            this.player.node.off('player-lost', this.onPlayerLost, this);
        }

        if (this.ui && this.ui.retryButton) {
            this.ui.retryButton.off(Button.EventType.CLICK, this.retry, this);
        }
    }

    private onPlayerWon(): void {
        if (this.state !== GameState.Playing) {
            return;
        }
        this.state = GameState.Won;
        this.stopGameplay();
        this.ui?.showWon();
    }

    private onPlayerLost(): void {
        if (this.state !== GameState.Playing) {
            return;
        }
        this.state = GameState.Lost;
        this.stopGameplay();
        this.ui?.showLost();
    }

    private stopGameplay(): void {
        this.player?.stop();
        if (this.timeFreeze) {
            this.timeFreeze.resetFreeze();
            this.timeFreeze.enabled = false;
        }
        this.hazard?.setFrozen(true);
    }

    public retry(): void {
        this.state = GameState.Playing;

        this.hazard?.resetHazard();
        if (this.timeFreeze) {
            this.timeFreeze.enabled = true;
            this.timeFreeze.resetFreeze();
        }
        this.player?.resetPlayer();
        this.ui?.showPlaying();
    }

    public isPlaying(): boolean {
        return this.state === GameState.Playing;
    }
}