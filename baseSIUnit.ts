import { UnitNameConfig } from "./nameConstruct"
import Unit from "./unit"
import { UnitShape, UnitBasisType, UnitShapeMap } from "./unitShape"

export class BaseSIUnit<ThisUnitShapeMap extends UnitShapeMap> extends Unit<ThisUnitShapeMap> {

    constructor(shape: UnitShape<ThisUnitShapeMap>, nameConfig: UnitNameConfig){
        super(shape, { isLinear: true, hasAbsoluteZero: true}, nameConfig)
    }

    toBaseSI(quantityInThisUnit: number): number { return quantityInThisUnit }
    fromBaseSI(quantityInBaseSI: number): number { return quantityInBaseSI }
}

export default BaseSIUnit