import { expect, describe, test } from "@jest/globals";
import { BaseSIUnit } from "./baseSIUnit";
import { AnyUnitPower, CombinationUnit } from "./combinationUnit"
import { NoneUnit } from "./noneUnit"
import { AnyUnit, Unit } from './unit'
import SimpleUnit from "./simpleUnit";
import { UnitShape, UnitShapeMap } from "./unitShape";
import { AnyUnitNameConfig, UnitNameConstruct } from "./nameConstruct";

function getPower(name: string): number {
    let i = name.indexOf('^')
    return Number.parseInt(name.slice(i+1));
}

function combinatoricUnits(a: Readonly<Record<string, AnyUnit>>, b?: Readonly<Record<string, AnyUnit>>): Record<string, CombinationUnit<AnyUnitPower[], AnyUnitNameConfig>> {
    let comboUnits: Record<string, CombinationUnit<AnyUnitPower[], AnyUnitNameConfig>> = {};
    Object.entries(a).forEach(([shape1, unit1]) => {
        Object.entries(b ? b : a).forEach(([shape2, unit2]) => {
            comboUnits[`${shape1}${shape2}`] = new CombinationUnit([[unit1, 1], [unit2, 1]])
            comboUnits[`${shape1}over${shape2}`] = new CombinationUnit([[unit1, 1], [unit2, -1]])
        })
    });

    return comboUnits
}

const nameSplitter = " * "
const abbrSplitter = " "

describe("Creating Base and Combination Units", () => {

    const exampleUnitShapes: ['A', 'D', 'B'] = ['A', 'D', 'B']
    
    const  exampleBaseUnits = exampleUnitShapes.reduce(
        (map: Record<string, BaseSIUnit<UnitShapeMap, AnyUnitNameConfig>>, shape: string, index:number) => {
            map[shape] = new BaseSIUnit(
                UnitShape.FromBasisType(shape), 
                new UnitNameConstruct(`Example Base ${shape} Unit`, (index == 0 ? `EB${shape}U`: undefined))
            )
            return map;
        }, 
        {}
    );

    const exampleComboUnits: Record<string, CombinationUnit<AnyUnitPower[], AnyUnitNameConfig>> = combinatoricUnits(exampleBaseUnits);

    describe("Combination Units auto-generate abbreviations iff all components have abbreviations", () => {
        Object.values(exampleComboUnits).forEach((comboUnit: CombinationUnit<AnyUnitPower[], AnyUnitNameConfig>) => {
            test(`with ${comboUnit.name}`, () => {
                if(comboUnit.unitPowers.every(([unit, power]) => unit.abbreviation != undefined)) {
                    expect(comboUnit.abbreviation).toBeDefined()
                } else {
                    expect(comboUnit.abbreviation).toBeUndefined()
                }
            })
        })
    })

    describe("Combination Units never contain 0 powered units", () => {
        Object.entries(exampleComboUnits).forEach(([, comboUnit]) => {
            test(`with ${comboUnit.name}`, () => {
                if (comboUnit.unitPowers.length == 0) {
                    expect(comboUnit.shape).toEqual(NoneUnit.shape)
                } else {
                    comboUnit.unitPowers.forEach(([, power]) => { expect(power).not.toEqual(0) })
                }
            })
        });
    })

    describe("Unit power list is always flat", () => {
        // Create multi-level combo units
        let exampleComboOfComboUnits: Record<string, CombinationUnit<AnyUnitPower[], AnyUnitNameConfig>> = combinatoricUnits(exampleComboUnits);

        // Check that UnitPowers are flattened
        Object.values(exampleComboOfComboUnits).forEach((comboOfComboUnit) => {
            test(`with ${comboOfComboUnit.name}`, () => {
                comboOfComboUnit.unitPowers.forEach(([unit, power]) => {
                    expect(unit instanceof CombinationUnit).toBeFalsy()
                })
            })
        })
    })

    // FIXME: Currently tests for stricter 'expected order', rather than only 'consistent order' (which would be correct)
    describe("Name order is 'consistent'", () => {
        [1, -1 /* Unit Power Sign */].forEach((sign) => {
            describe((sign > 0) ? "Positive" : "Negative" + " powers are individually ordered alphabetically", () => {
                Object.values(exampleComboUnits).forEach((comboUnit) => {
                    test(`with ${comboUnit.name}`, () => {
                        let filterFunc = (power: number) => power*sign > 0
                        
                        let namesWithCurrentSign = comboUnit.name.split(nameSplitter).filter((name:string) => filterFunc(getPower(name)))
                        expect(namesWithCurrentSign).toEqual(namesWithCurrentSign.sort())
                        
                        // Don't actually expect this to be true
                        // let abbrWithCurrentSign = comboUnit.abbreviation.split(abbrSplitter).filter((name:string) => filterFunc(getPower(name)))
                        // expect(abbrWithCurrentSign).toEqual(abbrWithCurrentSign.sort())
                        
                        let unitPowersWithCurrentSign = comboUnit.unitPowers.filter(([_, power]) => filterFunc(power))
                        expect(unitPowersWithCurrentSign).toEqual(unitPowersWithCurrentSign.sort(([aUnit, aPower], [bUnit, bPower]) => aUnit.name.localeCompare(bUnit.name)))
                    })
                })
            })
        });

        describe("Positive powers are ordered before negative power", () => {
            Object.values(exampleComboUnits).forEach((comboUnit) =>{
                test(`with ${comboUnit.name}`, () => {
                    let namesWithPowers = comboUnit.name.split(nameSplitter)
                    let indexOfFirstNegativePoweredName = namesWithPowers.findIndex((nameWithPower) => getPower(nameWithPower) < 0)
                    if (indexOfFirstNegativePoweredName >= 0) {
                        namesWithPowers.slice(indexOfFirstNegativePoweredName).forEach((nameWithPowers) => {
                            expect(getPower(nameWithPowers)).toBeLessThan(0)
                        })
                    }
                    
                    let indexOfFirstNegativePowerdUnitPower = comboUnit.unitPowers.findIndex((_, power) => power < 0)
                    if (indexOfFirstNegativePowerdUnitPower >= 0) {
                        comboUnit.unitPowers.slice(indexOfFirstNegativePowerdUnitPower).forEach(([unit, power]) => {
                            expect(power).toBeLessThan(0)
                        })
                    }
                })  
            })
        });

        // Testing order of two units with the same names:
        describe("Testing order of two units with the same names is by power", () => {

            let duplicateExampleBaseUnits: Record<string, BaseSIUnit<UnitShapeMap, AnyUnitNameConfig>> = {};
            Object.entries(exampleBaseUnits).forEach( ([shape, unit]) => {
                duplicateExampleBaseUnits[shape] = new BaseSIUnit(UnitShape.FromBasisType(`${shape}2`), {name: unit.name, abbreviation: unit.abbreviation, otherNames: [`Duplicate of ${unit.name}`]})
            });
            
            let combinationOfDuplicateUnits: Record<string, CombinationUnit<AnyUnitPower[], AnyUnitNameConfig>> = {};
            exampleUnitShapes.forEach((shape) => {
                combinationOfDuplicateUnits[shape] = new CombinationUnit(([[exampleBaseUnits[shape], 1], [duplicateExampleBaseUnits[shape], 2]]))
            });

            Object.values(combinationOfDuplicateUnits).forEach((comboDupUnit) => {
                test(`with ${combinationOfDuplicateUnits.name}`, () => {
                    expect(comboDupUnit.unitPowers[0][1]).toBeLessThanOrEqual(comboDupUnit.unitPowers[1][1])
                })
            })
        })
    })

    describe('Custom Names and abbreviations are remembered', () => {
        const [unit1, power1] = [exampleBaseUnits[exampleUnitShapes[0]], 3]
        const [unit2, power2] = [exampleBaseUnits[exampleUnitShapes[1]], 5]
        const customName: string = "Custom Name"

        let customNamedComboUnit = new CombinationUnit(
            [[unit1, power1], [unit2, power2]], 
            { name: customName }
        );

        let autoNamedComboUnit = new CombinationUnit([[unit1, power1], [unit2, power2]])

        expect(customNamedComboUnit.name).toEqual(customName)
        expect(autoNamedComboUnit.name).toEqual(customName)
        expect(autoNamedComboUnit.name).toEqual(customNamedComboUnit.name)

        // TODO: Test custom abbreviations
    })

    describe("Units conversions produce correct values", () => {

        const exampleScaleFactors = [3, 12, -0.166666, 1000]
        const shapeToScaleFactor: Record<(typeof exampleUnitShapes)[number], number> = exampleUnitShapes.reduce((map: Partial<Record<(typeof exampleUnitShapes)[number], number>>, shape, idx) => {
            map[shape] = exampleScaleFactors[idx]
            return map;
        }, {}) as Record<(typeof exampleUnitShapes)[number], number>

        const exampleRelativeUnits: Record<string, SimpleUnit<UnitShapeMap, AnyUnitNameConfig>> = exampleUnitShapes.reduce(
            (map: Partial<Record<(typeof exampleUnitShapes)[number], SimpleUnit<UnitShapeMap, AnyUnitNameConfig>>>, shape) => { 
                let scaleFactor = shapeToScaleFactor[shape]
                map[shape] = new SimpleUnit(UnitShape.FromBasisType(shape), scaleFactor, new UnitNameConstruct(`[${scaleFactor}${shape}]`)); 
                return map; 
            },
            {}
        )

        const exampleRelativeComboUnits: Record<string, CombinationUnit<AnyUnitPower[], AnyUnitNameConfig>> = combinatoricUnits(exampleRelativeUnits);

        const valuesToConvert = [1, 5, 10, -3, 12.513]
        valuesToConvert.forEach((valueToConvert) => {
            describe(`Testing with ${valueToConvert}`, () => {
                test("Unit conversions between squared units", () => {
                    exampleUnitShapes.forEach((shape) => {
                        let squareKey = `${shape}${shape}`;

                        let relUnit = exampleRelativeComboUnits[squareKey]
                        let baseUnit = exampleComboUnits[squareKey]
                        let scaleFactorSquared = shapeToScaleFactor[shape]**2

                        expect(relUnit.convertTo(valueToConvert, baseUnit)).toBeCloseTo(valueToConvert * scaleFactorSquared)
                        expect(baseUnit.convertTo(valueToConvert, relUnit)).toBeCloseTo(valueToConvert / scaleFactorSquared)
                    })
                })

                test('Unit conversions fail iff they have different shapes', () => {
                    expect(() => exampleComboUnits.AA.convertTo(valueToConvert, exampleComboUnits.BB)).toThrow(TypeError)
                    expect(() => exampleComboUnits.AA.convertTo(valueToConvert, exampleRelativeComboUnits.AA)).not.toThrow(TypeError)
                })

                test('Unit Conversions to self are reflexive', () => {

                    let comboUnits = Object.values(exampleComboUnits).concat(Object.values(exampleRelativeComboUnits));

                    comboUnits.forEach((unit: CombinationUnit<AnyUnitPower[], AnyUnitNameConfig>) => {
                        expect(unit.convertTo(valueToConvert, unit)).toBeCloseTo(valueToConvert)
                    })

                })
            })
        })
    })

})