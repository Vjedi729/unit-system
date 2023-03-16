import { describe, expect, test } from "@jest/globals"
import { BaseSIUnit } from "./index"

describe("Creating Base Units", () => {
    let baseUnit = new BaseSIUnit("ExampleUnitDimension", {name: "Example Base Unit", abbreviation: "EBU"});

    [10, 0, -2, 100, 27].forEach((x) => {
        test(`Testing with ${x}`, () => {
            expect(baseUnit.toBaseSI(x)).toEqual(x)
            expect(baseUnit.fromBaseSI(x)).toEqual(x)
            expect(baseUnit.convertTo(x, baseUnit)).toEqual(x)
        })
    })
})

