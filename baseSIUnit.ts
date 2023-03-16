import { UnitNameConfig } from "./nameConstruct"
import Unit from "./unit"
import UnitShape, { UnitBasisType, UnitShapeMap } from "./unitShape"

export class BaseSIUnit extends Unit {

    constructor(shape: UnitBasisType | UnitShapeMap | UnitShape, nameConfig: UnitNameConfig){
        super(shape, { isLinear: true, hasAbsoluteZero: true}, nameConfig)
    }

    toBaseSI(quantityInThisUnit: number): number { return quantityInThisUnit }
    fromBaseSI(quantityInBaseSI: number): number { return quantityInBaseSI }
}

export default BaseSIUnit