import { _decorator, Component, Label, Node, ProgressBar } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UI')
export class UI extends Component {

    @property(ProgressBar)
    public freezeBar: ProgressBar | null = null;

    @property(Label)
    public resultLabel: Label | null = null;

    @property(Node)
    public retryButton: Node | null = null;

    onLoad() {
        this.showPlaying();
    }

    public showPlaying() {
        if (this.freezeBar) {
            this.freezeBar.progress = 1;
            this.freezeBar.node.active = true;
        }

        if (this.resultLabel) {
            this.resultLabel.string = '';
            this.resultLabel.node.active = false;
        }

        if (this.retryButton) {
            this.retryButton.active = false;
        }
    }

    public updateFreezeProgress(progress: number) {
        if (this.freezeBar) {
            this.freezeBar.progress =
                Math.max(0, Math.min(1, progress));
        }
    }

    public showWon() {
        this.showResult('YOU WIN!');
    }

    public showLost() {
        this.showResult('YOU LOSE!');
    }

    private showResult(message: string) {
        if (this.resultLabel) {
            this.resultLabel.string = message;
            this.resultLabel.node.active = true;
        }

        if (this.freezeBar) {
            this.freezeBar.node.active = false;
        }

        if (this.retryButton) {
            this.retryButton.active = true;
        }
    }
}