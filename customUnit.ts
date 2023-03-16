import { UnitNameConfig } from "./nameConstruct";
import Unit, { MathematicalConfig } from "./unit";
import UnitShape, { UnitBasisType, UnitShapeMap } from "./unitShape";

export class CustomUnit extends Unit {
    toBaseSIFunction: (numInThisUnit: number) => number
    fromBaseSIFunction: (numInBaseSI: number) => number


    constructor(
        shape: UnitBasisType | UnitShapeMap | UnitShape,
        toBaseSIFunction: (numInThisUnit: number) => number, 
        fromBaseSIFunction: (numInBaseSI: number) => number, 
        mathConfig: MathematicalConfig,
        nameConfig: UnitNameConfig,
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