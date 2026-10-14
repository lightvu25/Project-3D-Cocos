import { _decorator, Component, Node, Vec3 } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('Hazard')
export class Hazard extends Component {
    @property({ type: Vec3, tooltip: 'Huong chuyen dong, vector don vi' })
    public moveAxis = new Vec3(1, 0, 0);

    @property({ tooltip: 'Bien do dao dong +-range quanh vi tri ban dau' })
    public moveRange = 2.5;

    @property({ tooltip: 'Van toc (don vi/giay)' })
    public moveSpeed = 3;

    @property({ type: Vec3, tooltip: 'Kich thuoc hitbox (khong dung neu collision bang collider)' })
    public hitboxSize = new Vec3(1, 2, 1);

    private _frozen = false;
    private _center = new Vec3();
    private _offset = 0;
    private _direction = 1;

    protected onLoad(): void {
        this._center.set(this.node.position);
    }

    protected update(dt: number): void {
        if (!this._frozen) {
            this._offset += this._direction * this.moveSpeed * dt;

            if (this._offset > this.moveRange) {
                this._offset = this.moveRange;
                this._direction = -1;
            } else if (this._offset < -this.moveRange) {
                this._offset = -this.moveRange;
                this._direction = 1;
            }
        }

        const x = this._center.x + this.moveAxis.x * this._offset;
        const y = this._center.y + this.moveAxis.y * this._offset;
        const z = this._center.z + this.moveAxis.z * this._offset;
        this.node.setPosition(x, y, z);
    }

    public setFrozen(value: boolean): void {
        this._frozen = value;
    }

    public isFrozen(): boolean {
        return this._frozen;
    }

    public resetHazard(): void {
        this._frozen = false;
        this._offset = 0;
        this._direction = 1;
        this.node.setPosition(this._center);
    }
}