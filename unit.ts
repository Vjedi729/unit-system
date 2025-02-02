// import { assert } from "console"
import { AnyUnitNameConfig, UnitNameConfig } from "./nameConstruct"
import { UnitShape, UnitBasisType, UnitShapeMap } from "./unitShape"

export interface MathematicalConfig<ThisHasAbsoluteZero extends boolean, ThisIsLinear extends boolean> {
    hasAbsoluteZero: ThisHasAbsoluteZero
    isLinear: ThisIsLinear
}
export type AnyMathematicalConfig = MathematicalConfig<boolean, boolean>;

export abstract class Unit<
    ThisUnitShapeMap extends UnitShapeMap, 
    ThisNameConfig extends AnyUnitNameConfig,
    ThisMathematicalConfig extends AnyMathematicalConfig
> {
    name: ThisNameConfig["name"]
    abbreviation?: ThisNameConfig["abbreviation"]
    names: ThisNameConfig["otherNames"]

    mathConfig: ThisMathematicalConfig 
    public get hasAbsoluteZero() : boolean { return this.mathConfig.hasAbsoluteZero }
    public get isLinear() : boolean { return this.mathConfig.isLinear }

    shape: UnitShape<ThisUnitShapeMap>

    constructor(shape: UnitShape<ThisUnitShapeMap>, mathConfig: ThisMathematicalConfig, nameConfig: ThisNameConfig){
        this.shape = shape // instanceof UnitShape ? shape : new UnitShape(shape)
        
        this.name = nameConfig.name
        this.abbreviation = nameConfig.abbreviation

        this.mathConfig = mathConfig

        let nameSet = new Set([nameConfig.name])
        if (nameConfig.abbreviation) nameSet.add(nameConfig.abbreviation)
        if (nameConfig.otherNames) nameConfig.otherNames.forEach((otherName) => {nameSet.add(otherName)})
        this.names = new Array<string>(...nameSet.values())
    }

    // protected test(valuesToTest: Array<number>, maxPercentError: number = 0.01){
    //     valuesToTest.forEach(x => {assert(this.roundTripError(x) < maxPercentError*x)})
    // }
    
    // roundTripError(valueToTest: number){
    //     let y = this.toBaseSI(this.fromBaseSI(valueToTest))
    //     return Math.abs(y - valueToTest)
    // }

    abstract toBaseSI(quantityInThisUnit: number): number
    abstract fromBaseSI(quantityInBaseSI: number): number

    convertTo(amountInThisUnit:number, toUnit:Unit<ThisUnitShapeMap, AnyUnitNameConfig, AnyMathematicalConfig>): number {
        if (this.shape.equal(toUnit.shape)) { // When `ThisUnitShapeMap` is specifically defined, this will always be true. 
            return toUnit.fromBaseSI(this.toBaseSI(amountInThisUnit))
        } else {
            throw TypeError(`Unit types do not match: ${this.shape} != ${toUnit.shape}`)
        }
    }

    toString(){ return this.abbreviation ? this.abbreviation : this.name }
}

export type AnyUnit = Unit<UnitShapeMap, AnyUnitNameConfig, AnyMathematicalConfig>;

export default Unit