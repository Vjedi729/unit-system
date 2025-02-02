import { AnyUnitNameConfig, UnitNameConfig } from "./nameConstruct";
import Unit, { AnyMathematicalConfig, MathematicalConfig } from "./unit";
import { UnitShape, UnitBasisType, UnitShapeMap } from "./unitShape";

export class CustomUnit<
    ThisUnitShapeMap extends UnitShapeMap,
    ThisNameConfig extends AnyUnitNameConfig,
    ThisMathConfig extends AnyMathematicalConfig
> extends Unit<ThisUnitShapeMap, ThisNameConfig, ThisMathConfig> {
    toBaseSIFunction: (numInThisUnit: number) => number
    fromBaseSIFunction: (numInBaseSI: number) => number


    constructor(
        shape: UnitShape<ThisUnitShapeMap>,
        toBaseSIFunction: (numInThisUnit: number) => number, 
        fromBaseSIFunction: (numInBaseSI: number) => number, 
        mathConfig: ThisMathConfig,
        nameConfig: ThisNameConfig,
    ){
        super(shape, mathConfig, nameConfig)
        this.toBaseSIFunction = toBaseSIFunction
        this.fromBaseSIFunction = fromBaseSIFunction
    }

    toBaseSI(quantityInThisUnit: number): number {
        return this.toBaseSIFunction(quantityInThisUnit)
    }

    fromBaseSI(quantityInBaseSI: number): number {
        return this.fromBaseSIFunction(quantityInBaseSI)
    }
}

export default CustomUnit