import { UnitNameConfig } from './nameConstruct'
import Unit from './unit'
import { UnitShape, UnitBasisType, UnitShapeMap} from './unitShape'

export class SimpleUnit<ThisUnitShapeMap extends UnitShapeMap> extends Unit<ThisUnitShapeMap> {
    scaleToBaseSI: number
    oneOverScale: number

    constructor(shape: UnitShape<ThisUnitShapeMap>, scaleToBaseSI: number, nameConfig: UnitNameConfig){
        super(shape, { isLinear: true, hasAbsoluteZero: true }, nameConfig)
        this.scaleToBaseSI = scaleToBaseSI
        this.oneOverScale = 1/scaleToBaseSI
    }

    toBaseSI(x: number) { return this.scaleToBaseSI * x }
    fromBaseSI(x: number) { return this.oneOverScale * x}
}

export default SimpleUnit
