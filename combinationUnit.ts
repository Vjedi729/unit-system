import { AnyUnitNameConfig, UnitNameConfig, UnitNameConstruct } from "./nameConstruct";
import { AnyMathematicalConfig, AnyUnit, MathematicalConfig, Unit } from "./unit";
import { ShapeMapAdd, ShapeMapScale, UnitShape, UnitShapeMap } from "./unitShape";

import { BaseSIUnit } from "./baseSIUnit";

export type UnitPower<ThisUnit extends AnyUnit, Power extends number> = [ThisUnit, Power]
export type AnyUnitPower = UnitPower<AnyUnit, number>
type AnyUnitPowers = Array<AnyUnitPower>

// Sorts by positive powers before negative powers then unit name (in A to Z alphabetical order) then by power (from least to greatest)
const sortResult = {aGreater: 1, bGreater: -1, bothEqual: 0}
function unitPowerSort([unitA, powerA]: AnyUnitPower, [unitB, powerB]: AnyUnitPower) {
    // Positive powers before negative powers
    if ( powerA > 0 && powerB < 0 ) {
        return sortResult.bGreater
    } else if (powerB > 0 && powerA < 0) {
        return sortResult.aGreater
    }

    // By Unit name (A-Z alphabetical order)
    if (unitA.name > unitB.name) {
        return sortResult.aGreater
    } else if (unitA.name < unitB.name) {
        return sortResult.bGreater
    }

    // Standard number sorting function
    return powerA - powerB
}

function createName(unitPowers: AnyUnitPowers): string {
    return unitPowers.map(([unit, power]) => power==1 ? unit.name : `${unit.name}^${power}`).join(" * ")
}

type UnitPowerReducer<ThisShapeMap extends UnitShapeMap, ThisPower extends number, BaseShapeMap extends UnitShapeMap = {}> = ShapeMapAdd<BaseShapeMap, ShapeMapScale<ThisPower, ThisShapeMap>>;

function createUnitShapeHelper<BaseShapeMap extends UnitShapeMap, ThisShapeMap extends UnitShapeMap, ThisPower extends number>(prevShape: UnitShape<BaseShapeMap>, currUnitPower: UnitPower<Unit<ThisShapeMap, AnyUnitNameConfig, AnyMathematicalConfig>, ThisPower>): UnitShape<UnitPowerReducer<ThisShapeMap, ThisPower, BaseShapeMap>> {
    return prevShape.add(currUnitPower[0].shape.multiply(currUnitPower[1]));
}

type UnitPowersShapeMapHelper<Current extends Array<AnyUnitPower>, BaseShapeMap extends UnitShapeMap = {}> = 
    Current extends [UnitPower<Unit<infer CurrentShapeMap, AnyUnitNameConfig, AnyMathematicalConfig>, infer CurrentPower>, ...infer RemainingUnitPowers extends Array<AnyUnitPower>] ?
    UnitPowersShapeMapHelper<RemainingUnitPowers, UnitPowerReducer<CurrentShapeMap, CurrentPower, BaseShapeMap>> :
    BaseShapeMap
    ;
export type UnitPowersShapeMap<ThisUnitPowers extends Array<AnyUnitPower>> = UnitPowersShapeMapHelper<ThisUnitPowers, {}>

const basisA = "A"
const basisB = "B"
const testUnitA = new BaseSIUnit(UnitShape.FromBasisType(basisA), new UnitNameConstruct("A1"));
const testUnitB = new BaseSIUnit(UnitShape.FromBasisType(basisB), new UnitNameConstruct("B1"));
type TestEmptyShapeMap = UnitPowersShapeMap<[]>
type TestOneShapeMap = UnitPowersShapeMap<[[typeof testUnitA, 1]]>
type TestComboShapeMap = UnitPowersShapeMap<[[typeof testUnitA, 1], [typeof testUnitB, 1]]>

function createShape<ThisUnitPowers extends AnyUnitPowers>(unitPowers: AnyUnitPowers): UnitShape<UnitPowersShapeMap<ThisUnitPowers>>
{
    return unitPowers.reduce(
        createUnitShapeHelper,
        new UnitShape({})
    ) as UnitShape<UnitPowersShapeMap<ThisUnitPowers>>;
}

function createAbbreviation(unitPowers: AnyUnitPowers): string | undefined {
    if (unitPowers.every(([unit,]) => unit.abbreviation != undefined)){
        return unitPowers.map(([unit, power]) => power == 1 ? unit.abbreviation : `${unit.abbreviation}^${power}`).join(" ")
    }
    return undefined
}

function createMathConfig(unitPowers: AnyUnitPowers): AnyMathematicalConfig {
    return unitPowers.reduce<AnyMathematicalConfig>(
        (prev:AnyMathematicalConfig, [unit, power]) => ({ 
            isLinear: prev.isLinear && unit.isLinear, 
            hasAbsoluteZero: prev.hasAbsoluteZero && unit.hasAbsoluteZero
        }),
        { isLinear: true, hasAbsoluteZero: true }
    )
}

export class CombinationUnit<ThisUnitPowers extends AnyUnitPowers, ThisNameConfig extends AnyUnitNameConfig> extends Unit<UnitPowersShapeMap<ThisUnitPowers>, AnyUnitNameConfig, AnyMathematicalConfig> {
    static nameRegistry: Record<string, AnyUnitNameConfig> = {}

    unitPowers: AnyUnitPowers
    // override abbreviation: string;

    private static SortUnitPowers(unitPowers: AnyUnitPowers) : AnyUnitPowers {
        return unitPowers.sort(unitPowerSort)
    }

    private static FlattenUnitPowers(unitPowers: AnyUnitPowers) : AnyUnitPowers {
        return unitPowers.reduce<AnyUnitPowers>((list, curr) => {
            return list.concat((curr[0] instanceof CombinationUnit) ? CombinationUnit.FlattenUnitPowers(curr[0].unitPowers) : [curr])
        }, [])
    }

    private static SimplifyUnitPowers(unitPowers: AnyUnitPowers): AnyUnitPowers {
        // Create single list of powers of all contained units
        let flatUnitPowers = CombinationUnit.FlattenUnitPowers(unitPowers)

        // Combine powers of the same unit
        let combinedUnitPowers: Record<string, AnyUnitPower> = {}
        flatUnitPowers.forEach(([unit, power]) => {
            let key = JSON.stringify(unit)
            let [_, prevPower] = combinedUnitPowers[key] || [undefined, 0]
            combinedUnitPowers[key] = [unit, prevPower + power]
        })

        // Remove units with power 0
        let filteredUnitPowers: Record<string, AnyUnitPower> = {}
        Object.entries(combinedUnitPowers).filter(([, [, power]]) => power != 0).forEach(
            ([name, unitPower]) => { filteredUnitPowers[name] = unitPower }
        ) 

        return CombinationUnit.SortUnitPowers(Object.entries(filteredUnitPowers).map(([, entry]) => entry))
    }

    constructor(unitPowers: ThisUnitPowers, nameConfig?: ThisNameConfig){
        const simplifiedUnitPowers = CombinationUnit.SimplifyUnitPowers(unitPowers)
        
        let nameConfigToUse: AnyUnitNameConfig;
        if (nameConfig) {
            // Register name and abbreviation
            let createdName = createName(simplifiedUnitPowers)
            // let registeredName = CombinationUnit.nameRegistry[createdName]
            CombinationUnit.nameRegistry[createdName] = nameConfig
            nameConfigToUse = nameConfig;
        } else {
            let createdName = createName(simplifiedUnitPowers)
            let registeredNameConfig = CombinationUnit.nameRegistry[createdName]
            nameConfigToUse = registeredNameConfig ? registeredNameConfig : new UnitNameConstruct(createdName, createAbbreviation(simplifiedUnitPowers)) // TODO: Create combinatoric otherNames?
        }
        // TODO: Create combinatoric otherNames?

        super(createShape(simplifiedUnitPowers), createMathConfig(simplifiedUnitPowers), nameConfigToUse)
        this.unitPowers = simplifiedUnitPowers  
    }

    toBaseSI(quantityInThisUnit: number): number {
        return this.unitPowers.reduce<number>((result, [unit, power]) => {
            for(let i=0; i<power; i++){ result = unit.toBaseSI(result) }
            for(let i=0; i>power; i--){ result = unit.fromBaseSI(result) }
            return result
        }, quantityInThisUnit)
    }

    fromBaseSI(quantityInBaseSI: number): number {
        return this.unitPowers.reduce<number>((result, [unit, power]) => {
            for(let i=0; i<power; i++){ result = unit.fromBaseSI(result) }
            for(let i=0; i>power; i--){ result = unit.toBaseSI(result) }
            return result
        }, quantityInBaseSI)
    }
}

export default CombinationUnit