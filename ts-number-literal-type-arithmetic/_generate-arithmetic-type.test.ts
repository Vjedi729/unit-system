import { describe, expect, test } from "@jest/globals"
import { generateArithmeticType } from "./_generate-arithmetic-type"

test("Generate Add Type", () => {
	const generatedCode = generateArithmeticType<number, number>("number", "number", "Add", (x, y) => x+y, [1, 2, 3, 4], [{value: 0, resultWhenThisTypeIsValue(thisTypeName, otherTypeName){ return otherTypeName}}]) 
	expect(generatedCode).toEqual(`type AddHelper<X extends number, Y extends number, Fallback extends number> = 
IfEq<X, 0, Y,
	IfEq<Y, 0, X,
IfEq<X, 1,
	IfEq<Y, 1, 2,
	IfEq<Y, 2, 3,
	IfEq<Y, 3, 4,
	IfEq<Y, 4, 5,
	Fallback
	>>>>,
IfEq<X, 2,
	IfEq<Y, 1, 3,
	IfEq<Y, 2, 4,
	IfEq<Y, 3, 5,
	IfEq<Y, 4, 6,
	Fallback
	>>>>,
IfEq<X, 3,
	IfEq<Y, 1, 4,
	IfEq<Y, 2, 5,
	IfEq<Y, 3, 6,
	IfEq<Y, 4, 7,
	Fallback
	>>>>,
IfEq<X, 4,
	IfEq<Y, 1, 5,
	IfEq<Y, 2, 6,
	IfEq<Y, 3, 7,
	IfEq<Y, 4, 8,
	Fallback
	>>>>,
Fallback
>>>>
>>;

type AddFallback = number;
export type Add<X extends number, Y extends number> = IfEq<X, number, number, IfEq<Y, number, number, AddHelper<X, Y, AddFallback>>>`)
})

test("Generate Multiply Type", () => {
	const generatedCode = generateArithmeticType<number, number>("number", "number", "Multiply", (x, y) => x*y, [2, 3, 4, 5], [{value: 0, resultWhenThisTypeIsValue: ()=>"0"}, {value: 1, resultWhenThisTypeIsValue: (thisTypeName, otherTypeName)=>otherTypeName}])
	const expectedCode = `type MultiplyHelper<X extends number, Y extends number, Fallback extends number> = 
IfEq<X, 0, 0,
	IfEq<Y, 0, 0,
IfEq<X, 1, Y,
	IfEq<Y, 1, X,
IfEq<X, 2,
	IfEq<Y, 2, 4,
	IfEq<Y, 3, 6,
	IfEq<Y, 4, 8,
	IfEq<Y, 5, 10,
	Fallback
	>>>>,
IfEq<X, 3,
	IfEq<Y, 2, 6,
	IfEq<Y, 3, 9,
	IfEq<Y, 4, 12,
	IfEq<Y, 5, 15,
	Fallback
	>>>>,
IfEq<X, 4,
	IfEq<Y, 2, 8,
	IfEq<Y, 3, 12,
	IfEq<Y, 4, 16,
	IfEq<Y, 5, 20,
	Fallback
	>>>>,
IfEq<X, 5,
	IfEq<Y, 2, 10,
	IfEq<Y, 3, 15,
	IfEq<Y, 4, 20,
	IfEq<Y, 5, 25,
	Fallback
	>>>>,
Fallback
>>>>
>>>>;

type MultiplyFallback = number;
export type Multiply<X extends number, Y extends number> = IfEq<X, number, number, IfEq<Y, number, number, MultiplyHelper<X, Y, MultiplyFallback>>>`

	expect(generatedCode).toEqual(expectedCode);
})