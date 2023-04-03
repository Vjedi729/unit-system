import {expect, describe, test} from "@jest/globals"
import { BaseSIUnit } from "./baseSIUnit"
import { RelativeUnit } from "./relativeUnit"

describe("Creating Base and Relative Units", () => {

    const relativeUnitScale = 9
    const multipleUnitScale = 11
    const fractionUnitScale = 13
    const fractionOfRelativeUnitScale = relativeUnitScale / fractionUnitScale
    const exampleValues = [10, 1, -27, 0.24, 31892]

    let exampleBaseUnit = new BaseSIUnit("ExampleUnitDimension", {name: "Example Base Unit", abbreviation: "EBU"});
    let exampleRelativeUnit = new RelativeUnit(exampleBaseUnit, relativeUnitScale, {name: "Example Relative Unit", abbreviation: "ERU"})
    let exampleMultipleUnit = RelativeUnit.MultipleOf(exampleBaseUnit, multipleUnitScale, {name: `${multipleUnitScale} Example Base Units`, abbreviation: "EBUM"})
    let exampleFractionalUnit = RelativeUnit.FractionOf(exampleBaseUnit, fractionUnitScale, {name: `1/${fractionUnitScale}th of an Example Base Unit`, abbreviation: "EBUF"})
    let exampleFractionOfRelativeUnit = RelativeUnit.FractionOf(exampleRelativeUnit, fractionUnitScale, {name: `1/${fractionUnitScale}th of an Example Relative Unit`, abbreviation: "ERUF"})

    exampleValues.forEach((x) => {
        describe(`Testing with ${x}`, () => {
            test("Testing conversion between base and relative unit scales by given value", () => {
                expect(exampleBaseUnit.convertTo(x, exampleRelativeUnit)).toBeCloseTo(x / relativeUnitScale)
                expect(exampleRelativeUnit.convertTo(x, exampleBaseUnit)).toBeCloseTo(x * relativeUnitScale)

                expect(exampleBaseUnit.convertTo(x, exampleMultipleUnit)).toBeCloseTo(x / multipleUnitScale)
                expect(exampleMultipleUnit.convertTo(x, exampleBaseUnit)).toBeCloseTo(x * multipleUnitScale)
                
                expect(exampleBaseUnit.convertTo(x, exampleFractionalUnit)).toBeCloseTo(x * fractionUnitScale)
                expect(exampleFractionalUnit.convertTo(x, exampleBaseUnit)).toBeCloseTo(x / fractionUnitScale)

                expect(exampleBaseUnit.convertTo(x, exampleFractionOfRelativeUnit)).toBeCloseTo(x / fractionOfRelativeUnitScale)
                expect(exampleFractionOfRelativeUnit.convertTo(x, exampleBaseUnit)).toBeCloseTo(x * fractionOfRelativeUnitScale)
            })

            // Test conversion to self is reflexive (with an epsilon)
            test("Testing conversion to self is reflexive", () => {
                expect(exampleRelativeUnit.convertTo(x, exampleRelativeUnit)).toBeCloseTo(x)
                expect(exampleMultipleUnit.convertTo(x, exampleMultipleUnit)).toBeCloseTo(x)
                expect(exampleFractionalUnit.convertTo(x, exampleFractionalUnit)).toBeCloseTo(x)
                expect(exampleFractionOfRelativeUnit.convertTo(x, exampleFractionOfRelativeUnit)).toBeCloseTo(x)
            })

            // Test conversions relative unit, multiple unit, fractional unit, and fraction of relative unit
            test("Test conversions between relative unit, multiple unit, fractional unit, and fraction of relative unit", () => {
                // Test conversion between fraction of relative unit and relative unit
                expect(exampleRelativeUnit.convertTo(x, exampleFractionOfRelativeUnit)).toBeCloseTo(x * fractionUnitScale)
                expect(exampleFractionOfRelativeUnit.convertTo(x, exampleRelativeUnit)).toBeCloseTo(x / fractionUnitScale)

                // Multiple scales required
                expect(exampleRelativeUnit.convertTo(x, exampleMultipleUnit)).toBeCloseTo(x * relativeUnitScale / multipleUnitScale)
                expect(exampleMultipleUnit.convertTo(x, exampleRelativeUnit)).toBeCloseTo(x / relativeUnitScale * multipleUnitScale)

                expect(exampleRelativeUnit.convertTo(x, exampleFractionalUnit)).toBeCloseTo(x * relativeUnitScale * fractionUnitScale)
                expect(exampleFractionalUnit.convertTo(x, exampleRelativeUnit)).toBeCloseTo(x / relativeUnitScale / fractionUnitScale)

                expect(exampleMultipleUnit.convertTo(x, exampleFractionalUnit)).toBeCloseTo(x * multipleUnitScale * fractionUnitScale)
                expect(exampleFractionalUnit.convertTo(x, exampleMultipleUnit)).toBeCloseTo(x / multipleUnitScale / fractionUnitScale)

                expect(exampleMultipleUnit.convertTo(x, exampleFractionOfRelativeUnit)).toBeCloseTo(x * multipleUnitScale / fractionOfRelativeUnitScale)
                expect(exampleFractionOfRelativeUnit.convertTo(x, exampleMultipleUnit)).toBeCloseTo(x / multipleUnitScale * fractionOfRelativeUnitScale)

                expect(exampleFractionalUnit.convertTo(x, exampleFractionOfRelativeUnit)).toBeCloseTo(x / fractionUnitScale / fractionOfRelativeUnitScale)
                expect(exampleFractionOfRelativeUnit.convertTo(x, exampleFractionalUnit)).toBeCloseTo(x * fractionUnitScale * fractionOfRelativeUnitScale)
            })
        })
    })
})