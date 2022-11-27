import Unit from './unit'
import UnitShape, {UnitBasisType, UnitShapeMap} from './unitShape'

export class RelativeUnit extends Unit {

    relativeTo: Unit
    relativeUnitPerThisUnit: number
    
    constructor(name:string, relativeTo:Unit, relativeUnitPerThisUnit:number, abbreviation?: string){
        super(name, relativeTo.shape, abbreviation)

        this.relativeUnitPerThisUnit = relativeUnitPerThisUnit
        this.relativeTo = relativeTo
    }

    fromBaseSI(quantityInBaseSI: number): number {
        return this.relativeTo.fromBaseSI(quantityInBaseSI)/this.relativeUnitPerThisUnit
    }

    toBaseSI(quantityInThisUnit: number): number {
        return this.relativeTo.toBaseSI(quantityInThisUnit*this.relativeUnitPerThisUnit)
    }

    static MultipleOf(name:string, relativeTo:Unit, relativeUnitPerThisUnit:number, abbreviation?: string){
        return new RelativeUnit(name, relativeTo, relativeUnitPerThisUnit, abbreviation)
    }

    static FractionOf(name: string, relativeTo:Unit, thisUnitPerRelativeUnit: number, abbreviation?: string): RelativeUnit{
        return new RelativeUnit(name, relativeTo, 1/thisUnitPerRelativeUnit, abbreviation)
    }
}