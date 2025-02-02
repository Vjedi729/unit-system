import { AnyUnitNameConfig, UnitNameConfig } from "./nameConstruct"
import Unit, { MathematicalConfig } from "./unit"
import { UnitShape, UnitBasisType, UnitShapeMap } from "./unitShape"

export type BaseSiUnitMathConfig = MathematicalConfig<true, true>
export class BaseSIUnit<
    ThisUnitShapeMap extends UnitShapeMap, 
    ThisNameConfig extends AnyUnitNameConfig,
> extends Unit<ThisUnitShapeMap, ThisNameConfig, BaseSiUnitMathConfig> {

    constructor(shape: UnitShape<ThisUnitShapeMap>, nameConfig: ThisNameConfig){
        super(shape, { isLinear: true, hasAbsoluteZero: true}, nameConfig)
    }

    toBaseSI(quantityInThisUnit: number): number { return quantityInThisUnit }
    fromBaseSI(quantityInBaseSI: number): number { return quantityInBaseSI }
}

export default BaseSIUnit