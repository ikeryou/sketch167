import { Func } from '../core/func';
import { Canvas } from '../webgl/canvas';
import { Object3D } from 'three/src/core/Object3D';
import { Param } from '../core/param';
import { Conf } from '../core/conf';
import { Color } from "three/src/math/Color";
import { Item } from './item';
import { Util } from '../libs/util';
import { PlaneGeometry } from "three/src/geometries/PlaneGeometry";


export class Con extends Canvas {

  private _con: Object3D;
  private _item:Array<Item> = []
  private _colors:Array<Color> = []
  private _heightEl:any

  constructor(opt: any) {
    super(opt);

    // this._makeColors()
    this._makeColors()

    this._heightEl = document.querySelector('.js-height')

    this._con = new Object3D()
    this.mainScene.add(this._con)

    this._con.rotation.x = Util.instance.radian(45)
    this._con.rotation.y = Util.instance.radian(-45)

    const geo = new PlaneGeometry(1, 1)
    const num = Conf.instance.ITEM_NUM
    for(let i = 0; i < num; i++) {
      const item = new Item({
          geo:geo,
          col:this._colors,
          id:i,
      })
      this._con.add(item)
      this._item.push(item)
    }

    this._resize()
  }


  protected _update(): void {
    super._update()

    const h = this.renderSize.height

    // スクロールするサイズはこっちで指定
    this.css(this._heightEl, {
      height:(h * Conf.instance.SCROLL_HEIGHT) + 'px'
    })

    this._con.position.y = Func.instance.screenOffsetY() * -1

    if (this.isNowRenderFrame()) {
      this._render()
    }
  }


  private _render(): void {
    this.renderer.setClearColor(Param.instance.main.bgColor.value, 1)
    this.renderer.render(this.mainScene, this.camera)
  }


  public isNowRenderFrame(): boolean {
    return this.isRender
  }


  _resize(isRender: boolean = true): void {
    super._resize();

    const w = Func.instance.sw();
    const h = Func.instance.sh();

    if(Conf.instance.IS_SP || Conf.instance.IS_TAB) {
      if(w == this.renderSize.width && this.renderSize.height * 2 > h) {
        return
      }
    }

    this.renderSize.width = w;
    this.renderSize.height = h;

    this.updateCamera(this.camera, w, h);

    let pixelRatio: number = window.devicePixelRatio || 1;

    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(w, h);
    this.renderer.clear();

    if (isRender) {
      this._render();
    }
  }


  // ------------------------------------
  // 使用カラー作成
  // ------------------------------------
  private _makeColors():void {
    this._colors = []

    const colA = new Color(Util.instance.random(0, 1), Util.instance.random(0, 1), Util.instance.random(0, 1))
    const colB = new Color(1 - colA.r, 1 - colA.g, 1 - colA.b)

    const hslA = { h: 0, s: 0, l: 0 }
    colA.getHSL(hslA)

    const hslB = { h: 0, s: 0, l: 0 }
    colB.getHSL(hslB)

    const r = 0.2
    for(let i = 0; i < 20; i++) {
      const hslA = { h: 0, s: 0, l: 0 }
      colA.getHSL(hslA)
      hslA.s += Util.instance.range(r)
      hslA.l += Util.instance.range(r)

      const hslB = { h: 0, s: 0, l: 0 }
      colB.getHSL(hslB)
      hslB.s += Util.instance.range(r)
      hslB.l += Util.instance.range(r)

      const colC = new Color()
      colC.setHSL(hslA.h, hslA.s, hslA.l)
      this._colors.push(colC)

      const colD = new Color()
      colD.setHSL(hslB.h, hslB.s, hslB.l)
      this._colors.push(colD)
    }
  }
}
