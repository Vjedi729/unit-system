import { UnitNameConfig } from './nameConstruct'
import Unit from './unit'
import UnitShape, {UnitBasisType, UnitShapeMap} from './unitShape'

export class SimpleUnit extends Unit {
    scaleToBaseSI: number
    oneOverScale: number

    constructor(shape: UnitBasisType | UnitShapeMap | UnitShape, scaleToBaseSI: number, nameConfig: UnitNameConfig){
        super(shape, nameConfig)
        this.scaleToBaseSI = scaleToBaseSI
        this.oneOverScale = 1/scaleToBaseSI
    }

    toBaseSI(x: number) { return this.scaleToBaseSI * x }
    fromBaseSI(x: number) { return this.oneOverScale * x}

    static Relative(relativeTo:SimpleUnit, relativeScale:number, nameConfig: UnitNameConfig): SimpleUnit{
        return new SimpleUnit(
            relativeTo.shape,
            relativeTo.scaleToBaseSI * relativeScale,
            nameConfig
        )
    }
}

export default SimpleUnit
