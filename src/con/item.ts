import vs from '../glsl/simple.vert';
import fs from '../glsl/item.frag';
import { MyObject3D } from "../webgl/myObject3D";
import { Util } from "../libs/util";
import { Mesh } from 'three/src/objects/Mesh';
import { DoubleSide } from 'three/src/constants';
import { Func } from "../core/func";
import { Vector3 } from "three/src/math/Vector3";
import { ShaderMaterial } from 'three/src/materials/ShaderMaterial';
import { Color } from 'three/src/math/Color';
import { Object3D } from "three/src/core/Object3D";
import { Conf } from "../core/conf";
import { Scroller } from "../core/scroller";

export class Item extends MyObject3D {

  private _id:number
  private _mesh:Array<Object3D> = []

  public itemSize:Vector3 = new Vector3()

  constructor(opt:any = {}) {
    super()

    this._id = opt.id

    const geo = opt.geo


    let num = 6
    for(let i = 0; i < num; i++) {
      const m = new Mesh(
        geo,
        new ShaderMaterial({
          vertexShader:vs,
          fragmentShader:fs,
          transparent:true,
          side:DoubleSide,
          uniforms:{
            alpha:{value:1},
            color:{value:new Color(opt.col[((i + this._id) % opt.col.length)])},
          }
        })
      )
      this.add(m)
      this._mesh.push(m)
    }

    this.visible = true
  }


  // ---------------------------------
  // 更新
  // ---------------------------------
  protected _update():void {
    super._update()

    const sw = Func.instance.sw()
    const sh = Func.instance.sh()
    const baseSize = Func.instance.val(sw, sw * 0.5)
    const s = Scroller.instance.val.y

    let sr = s / (sh * Util.instance.map(this._id, 2, Conf.instance.SCROLL_HEIGHT, 0, Conf.instance.ITEM_NUM - 1) - sh * 1)
    sr = Util.instance.clamp(sr, 0, 1)
    let rate = sr

    const minY = -sh * 0.25
    this.position.y = this._id == 0 ? minY : Util.instance.mix(sh * 1.5, minY, rate)

    // 基本サイズ
    this.itemSize.x = baseSize * Util.instance.map(this._id, 0.5, 0.1, 0, Conf.instance.ITEM_NUM - 1)
    this.itemSize.y = this.itemSize.x

    const bs = this.itemSize.x
    const d = this.itemSize.x * 0.5

    this._mesh[0].scale.set(bs, bs, 1)
    this._mesh[0].quaternion.setFromAxisAngle(new Vector3(1,0,0), Util.instance.radian(90));
    this._mesh[0].position.y = d
    this._mesh[0].visible = false

    this._mesh[1].scale.set(bs, bs, 1)
    this._mesh[1].quaternion.setFromAxisAngle(new Vector3(0,1,0), Util.instance.radian(-90))
    this._mesh[1].position.x = d

    this._mesh[2].scale.set(bs, bs, 1)
    this._mesh[2].quaternion.setFromAxisAngle(new Vector3(1,0,0), Util.instance.radian(-90))
    this._mesh[2].position.y = -d

    this._mesh[3].scale.set(bs, bs, 1)
    this._mesh[3].quaternion.setFromAxisAngle(new Vector3(0,1,0), Util.instance.radian(90));
    this._mesh[3].position.x = -d

    this._mesh[4].scale.set(bs, bs, 1)
    this._mesh[4].quaternion.setFromAxisAngle(new Vector3(0,0,0), Util.instance.radian(0));
    this._mesh[4].position.z = -d

    this._mesh[5].scale.set(bs, bs, 1)
    this._mesh[5].quaternion.setFromAxisAngle(new Vector3(1,0,0), Util.instance.radian(180));
    this._mesh[5].position.z = d
  }
}