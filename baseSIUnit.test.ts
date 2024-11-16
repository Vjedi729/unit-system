import { describe, expect, test } from "@jest/globals"
import { BaseSIUnit } from "./baseSIUnit"
import { UnitShape } from "./unitShape";

// Create a base unit
describe("Base SI Units", () => {
    let exampleBaseUnit = new BaseSIUnit(UnitShape.FromBasisType("ExampleUnitDimension"), {name: "Example Base Unit", abbreviation: "EBU"});
    let exampleBaseUnit2 = new BaseSIUnit(UnitShape.FromBasisType("ExampleSecondUnitDimension"), {name: "Example 2 Base Unit", abbreviation: "E2"});
    
    // List of examples, but should work with any "valid" number (possibly not inf/-inf/NaN)
    [10, 0, -2, 100, 27, Infinity].forEach((x) => {
        describe(`Testing with ${x}`, () => {
            test(`Testing conversion to and from base unit are reflexive`, () => {
                expect(exampleBaseUnit.toBaseSI(x)).toEqual(x)
                expect(exampleBaseUnit.fromBaseSI(x)).toEqual(x)
            })
            
            test(`Testing conversion to self is reflexive`, () => {   
                expect(exampleBaseUnit.convertTo(x, exampleBaseUnit)).toEqual(x)
            })
            
            test("Testing conversion between incompatible units ", () => {
                // * Test that units with different shapes fail to convert
                // expect(() => exampleBaseUnit.convertTo(x, exampleBaseUnit2)).toThrow(TypeError)
            })
        })
    });

    describe('Testing toString()', () => {

        test("With Abbreviation", () => {
            expect(exampleBaseUnit.toString()).toEqual("EBU")
        })

        let noAbbrName = "Example No Abbreviation Base Unit"
        let exampleNoAbbr = new BaseSIUnit(UnitShape.FromBasisType("ExampleUnitDimension3"), {name: noAbbrName});
        test("Without Abbreviation", () => {
            expect(exampleNoAbbr.toString()).toEqual(noAbbrName)
        })

    })
    
})
