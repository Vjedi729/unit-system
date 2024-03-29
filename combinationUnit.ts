import { UnitNameConfig, UnitNameConstruct } from "./nameConstruct";
import { MathematicalConfig, Unit } from "./unit";
import UnitShape, { UnitShapeMap } from "./unitShape";

type UnitPower = [Unit, number]
type UnitPowers = Array<UnitPower>

// Sorts by positive powers before negative powers then unit name (in A to Z alphabetical order) then by power (from least to greatest)
const sortResult = {aGreater: 1, bGreater: -1, bothEqual: 0}
function unitPowerSort([unitA, powerA]: UnitPower , [unitB, powerB]: UnitPower) {
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

function createName(unitPowers: UnitPowers): string {
    return unitPowers.map(([unit, power]) => power==1 ? unit.name : `${unit.name}^${power}`).join(" * ")
}

function createShape(unitPowers: UnitPowers): UnitShape {
    return unitPowers.reduce<UnitShape>(
        (prev:UnitShape, [unit, power]) => prev.add(unit.shape.multiply(power)),
        new UnitShape({})
    )
}

function createAbbreviation(unitPowers: UnitPowers): string | undefined {
    if (unitPowers.every(([unit,]) => unit.abbreviation != undefined)){
        return unitPowers.map(([unit, power]) => power == 1 ? unit.abbreviation : `${unit.abbreviation}^${power}`).join(" ")
    }
    return undefined
}

function createMathConfig(unitPowers: UnitPowers): MathematicalConfig {
    return unitPowers.reduce<MathematicalConfig>(
        (prev:MathematicalConfig, [unit, power]) => ({ 
            isLinear: prev.isLinear && unit.isLinear, 
            hasAbsoluteZero: prev.hasAbsoluteZero && unit.hasAbsoluteZero
        }),
        { isLinear: true, hasAbsoluteZero: true }
    )
}

export class CombinationUnit extends Unit {
    static nameRegistry: Record<string, UnitNameConfig> = {}

    unitPowers: UnitPowers
    override abbreviation: string;

    private static SortUnitPowers(unitPowers: UnitPowers) : UnitPowers {
        return unitPowers.sort(unitPowerSort)
    }

    private static FlattenUnitPowers(unitPowers: UnitPowers) : UnitPowers {
        return unitPowers.reduce<UnitPowers>((list, curr) => {
            return list.concat((curr[0] instanceof CombinationUnit) ? CombinationUnit.FlattenUnitPowers(curr[0].unitPowers) : [curr])
        }, [])
    }

    private static SimplifyUnitPowers(unitPowers: UnitPowers): UnitPowers {
        // Create single list of powers of all contained units
        let flatUnitPowers = CombinationUnit.FlattenUnitPowers(unitPowers)

        // Combine powers of the same unit
        let combinedUnitPowers: Record<string, UnitPower> = {}
        flatUnitPowers.forEach(([unit, power]) => {
            let key = JSON.stringify(unit)
            let [_, prevPower] = combinedUnitPowers[key] || [undefined, 0]
            combinedUnitPowers[key] = [unit, prevPower + power]
        })

        // Remove units with power 0
        let filteredUnitPowers: Record<string, UnitPower> = {}
        Object.entries(combinedUnitPowers).filter(([, [, power]]) => power != 0).forEach(
            ([name, unitPower]) => { filteredUnitPowers[name] = unitPower }
        ) 

        return CombinationUnit.SortUnitPowers(Object.entries(filteredUnitPowers).map(([, entry]) => entry))
    }

    constructor(unitPowers: UnitPowers, nameConfig?: UnitNameConfig){
        unitPowers = CombinationUnit.SimplifyUnitPowers(unitPowers)
        
        if (nameConfig) {
            // Register name and abbreviation
            let createdName = createName(unitPowers)
            // let registeredName = CombinationUnit.nameRegistry[createdName]
            CombinationUnit.nameRegistry[createdName] = nameConfig
        } else {
            let createdName = createName(unitPowers)
            let registeredNameConfig = CombinationUnit.nameRegistry[createdName]
            nameConfig = registeredNameConfig ? registeredNameConfig : new UnitNameConstruct(createdName, createAbbreviation(unitPowers)) // TODO: Create combinatoric otherNames?
        }
        // TODO: Create combinatoric otherNames?

        super(createShape(unitPowers), createMathConfig(unitPowers), nameConfig)
        this.unitPowers = unitPowers  
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