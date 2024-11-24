import {test, expect, describe} from '@jest/globals'
import BaseSIUnit from './baseSIUnit';

import { NoneUnit } from "./noneUnit";
import { UnitShape } from './unitShape';

test("None Unit Shape has no dimensions", () => {
    expect(NoneUnit.shape).toEqual(new UnitShape({}))
    expect(Object.entries(NoneUnit.shape.shape)).toEqual([])
})