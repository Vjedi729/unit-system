import Unit from './unit'
import { UnitNameConfig } from './nameConstruct'
import { UnitShapeMap } from './unitShape'

export class RelativeUnit<ThisUnitShapeMap extends UnitShapeMap> extends Unit<ThisUnitShapeMap> {

    relativeTo: Unit<ThisUnitShapeMap>
    relativeUnitPerThisUnit: number
    
    constructor(relativeTo:Unit<ThisUnitShapeMap>, relativeUnitPerThisUnit:number, nameConfig: UnitNameConfig){
        super(relativeTo.shape, relativeTo.mathConfig, nameConfig)

        this.relativeUnitPerThisUnit = relativeUnitPerThisUnit
        this.relativeTo = relativeTo
    }

    fromBaseSI(quantityInBaseSI: number): number {
        return this.relativeTo.fromBaseSI(quantityInBaseSI)/this.relativeUnitPerThisUnit
    }

    toBaseSI(quantityInThisUnit: number): number {
        return this.relativeTo.toBaseSI(quantityInThisUnit*this.relativeUnitPerThisUnit)
    }

    static MultipleOf<ThisUnitShapeMap extends UnitShapeMap>(relativeTo:Unit<ThisUnitShapeMap>, relativeUnitPerThisUnit:number, nameConfig: UnitNameConfig){
        return new RelativeUnit<ThisUnitShapeMap>(relativeTo, relativeUnitPerThisUnit, nameConfig)
    }

    static FractionOf<ThisUnitShapeMap extends UnitShapeMap>(relativeTo:Unit<ThisUnitShapeMap>, thisUnitPerRelativeUnit: number, nameConfig: UnitNameConfig): RelativeUnit<ThisUnitShapeMap> {
        return new RelativeUnit<ThisUnitShapeMap>(relativeTo, 1/thisUnitPerRelativeUnit, nameConfig)
    }
}