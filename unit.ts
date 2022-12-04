// import { assert } from "console"
import { UnitNameConfig } from "./nameConstruct"
import UnitShape, { UnitBasisType, UnitShapeMap } from "./unitShape"

export abstract class Unit {
    name: string
    abbreviation?: string
    names: Array<string>
    shape: UnitShape

    constructor(shape: UnitBasisType | UnitShapeMap | UnitShape, nameConfig: UnitNameConfig){
        this.shape = shape instanceof UnitShape ? shape : new UnitShape(shape)
        
        this.name = nameConfig.name
        this.abbreviation = nameConfig.abbreviation
        
        let nameSet = new Set([nameConfig.name])
        if (nameConfig.abbreviation) nameSet.add(nameConfig.abbreviation)
        if (nameConfig.otherNames) nameConfig.otherNames.forEach((otherName) => {nameSet.add(otherName)})
        this.names = new Array<string>(...nameSet.values())
    }

    // protected test(valuesToTest: Array<number>, maxPercentError: number = 0.01){
    //     valuesToTest.forEach(x => {assert(this.roundTripError(x) < maxPercentError*x)})
    // }
    
    roundTripError(valueToTest: number){
        let y = this.toBaseSI(this.fromBaseSI(valueToTest))
        return Math.abs(y - valueToTest)
    }

    abstract toBaseSI(quantityInThisUnit: number): number
    abstract fromBaseSI(quantityInBaseSI: number): number

    convertTo(amountInThisUnit:number, toUnit:Unit): number {
        if (this.shape.equal(toUnit.shape)) {
            return toUnit.fromBaseSI(this.toBaseSI(amountInThisUnit))
        } else {
            throw TypeError(`Unit types do not match: ${this.shape} != ${toUnit.shape}`)
        }
    }

    toString(){ return this.abbreviation ? this.abbreviation : this.name }
}

export default Unit