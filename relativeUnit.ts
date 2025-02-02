import Unit, { AnyMathematicalConfig } from './unit'
import { AnyUnitNameConfig, UnitNameConfig } from './nameConstruct'
import { UnitShapeMap } from './unitShape'

export class RelativeUnit<
    ThisUnitShapeMap extends UnitShapeMap, 
    ThisNameConfig extends AnyUnitNameConfig,
    ThisMathConfig extends AnyMathematicalConfig
> extends Unit<ThisUnitShapeMap, ThisNameConfig, ThisMathConfig> {

    relativeTo: Unit<ThisUnitShapeMap, AnyUnitNameConfig, ThisMathConfig>
    relativeUnitPerThisUnit: number
    
    constructor(relativeTo:Unit<ThisUnitShapeMap, AnyUnitNameConfig, ThisMathConfig>, relativeUnitPerThisUnit:number, nameConfig: ThisNameConfig){
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

    static MultipleOf<
        ThisUnitShapeMap extends UnitShapeMap, 
        ThisNameConfig extends AnyUnitNameConfig,
        ThisMathConfig extends AnyMathematicalConfig
    >(relativeTo:Unit<ThisUnitShapeMap, AnyUnitNameConfig, ThisMathConfig>, relativeUnitPerThisUnit:number, nameConfig: ThisNameConfig) {
        return new RelativeUnit<ThisUnitShapeMap, ThisNameConfig, ThisMathConfig>(relativeTo, relativeUnitPerThisUnit, nameConfig)
    }

    static FractionOf<
        ThisUnitShapeMap extends UnitShapeMap, 
        ThisNameConfig extends AnyUnitNameConfig,
        ThisMathConfig extends AnyMathematicalConfig
    >(relativeTo:Unit<ThisUnitShapeMap, AnyUnitNameConfig, ThisMathConfig>, thisUnitPerRelativeUnit: number, nameConfig: ThisNameConfig) {
        return new RelativeUnit<ThisUnitShapeMap, ThisNameConfig, ThisMathConfig>(relativeTo, 1/thisUnitPerRelativeUnit, nameConfig)
    }
}