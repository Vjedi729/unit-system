import Unit from './unit'
import { UnitNameConfig } from './nameConstruct'

export class RelativeUnit extends Unit {

    relativeTo: Unit
    relativeUnitPerThisUnit: number
    
    constructor(relativeTo:Unit, relativeUnitPerThisUnit:number, nameConfig: UnitNameConfig){
        super(relativeTo.shape, nameConfig)

        this.relativeUnitPerThisUnit = relativeUnitPerThisUnit
        this.relativeTo = relativeTo
    }

    fromBaseSI(quantityInBaseSI: number): number {
        return this.relativeTo.fromBaseSI(quantityInBaseSI)/this.relativeUnitPerThisUnit
    }

    toBaseSI(quantityInThisUnit: number): number {
        return this.relativeTo.toBaseSI(quantityInThisUnit*this.relativeUnitPerThisUnit)
    }

    static MultipleOf(relativeTo:Unit, relativeUnitPerThisUnit:number, nameConfig: UnitNameConfig){
        return new RelativeUnit(relativeTo, relativeUnitPerThisUnit, nameConfig)
    }

    static FractionOf(relativeTo:Unit, thisUnitPerRelativeUnit: number, nameConfig: UnitNameConfig): RelativeUnit{
        return new RelativeUnit(relativeTo, 1/thisUnitPerRelativeUnit, nameConfig)
    }
}