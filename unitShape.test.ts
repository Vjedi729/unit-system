import {test, expect, describe} from '@jest/globals'
import { UnitShape } from './unitShape'

const emptyShape = new UnitShape();

test("Default UnitShape is empty", () => {
    expect(Object.entries(emptyShape.shape)).toEqual([])
    expect(emptyShape.toString()).toEqual("")
})

const strBaseShapes = ['A', 'D', 'C']
const baseShapes: UnitShape[] = strBaseShapes.map((str) => new UnitShape(str));

describe("UnitShape functions", () => {
    test("UnitShape add()", () => {
        strBaseShapes.forEach((name1, index1) => {
            let shape1: UnitShape = baseShapes[index1];

            strBaseShapes.forEach((name2, index2) => {
                let shape2: UnitShape = baseShapes[index2];

                let sumShape = shape1.add(shape2)
                if (name1 == name2) {
                    expect(sumShape.shape).toEqual({[name1]: 2})
                } else {
                    expect(sumShape.shape).toEqual({[name1]: 1, [name2]: 1})
                }
            })
        })
    })
    test("UnitShape multiply()", () => {
        const scaleFactors = [10, -1, 0.5, 1, 4];

        baseShapes.forEach((shape) => {
            scaleFactors.forEach((scaleFactor) => {
                let multShape = shape.multiply(scaleFactor)
                Object.entries(multShape.shape).forEach(([key, power]) => {
                    expect(power).toEqual(shape.shape[key] * scaleFactor)
                })
            })
        })

    })

    describe("UnitShape toString()", () => {
        test("Empty UnitShape gives empty string", () => {
            expect(emptyShape.toString()).toEqual("")
        })
        
        test("Power =1 UnitShape does not list power", () => {
            let unitShape = new UnitShape({A: 1, B: 1, C:1, D:1})
            const numberChars: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
            numberChars.forEach((numberChar) => {
                expect(unitShape.toString()).not.toContain(numberChar)
            })
        })
        test("Power >1 UnitShape lists power", () => {
            let unitShape = new UnitShape({A: 10, B: 2, C:8, D:13})
            Object.values(unitShape.shape).forEach((num) => {
                if (num != 1) expect(unitShape.toString()).toContain(num.toString())
            })
        })
        test("Power <1 UnitShape list power", () => {
            let unitShape = new UnitShape({A: 1, B: -1, C:-15, D:1})
            Object.values(unitShape.shape).forEach((num) => {
                if (num != 1) expect(unitShape.toString()).toContain(num.toString())
            })
        })
    })
})