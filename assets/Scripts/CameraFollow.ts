import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraFollow')
export class CameraFollow extends Component {
    @property(Node)
    public target: Node;

    @property
    public smoothSpeed: number = 5;

    @property
    public offset: Vec3 = new Vec3(0, 4.5, -7);

    @property
    public autoLookAt = true;

    @property
    public lookAhead  = 6;

    @property
    public _lookTarget = new Vec3();

    private desiredPosition = new Vec3();

    protected lateUpdate(deltaTime: number): void {
        if (!this.target) {
            return;
        }

        Vec3.add(this.desiredPosition, this.target.worldPosition, this.offset);

        const current = this.node.worldPosition;
        const t = Math.min(1, this.smoothSpeed * deltaTime);
        Vec3.lerp(this.desiredPosition, current, this.desiredPosition, t);
        this.node.setWorldPosition(this.desiredPosition);

        if (this.autoLookAt) {
            Vec3.add(this._lookTarget, this.target.worldPosition, new Vec3(0, 0, this.lookAhead));
            this.node.lookAt(this._lookTarget);
        }
    }
}


