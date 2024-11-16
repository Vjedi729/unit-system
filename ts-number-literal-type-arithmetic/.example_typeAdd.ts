import { IfEq, AndEquals } from "./typeEqual";

// * Only works up to 5
// TODO: Generate code for up to arbitrary numbers
type AddHelper<X extends number, Y extends number, Fallback extends number> = IfEq<X, 0, Y, IfEq<Y, 0, X, 
IfEq<X, 1, 
	IfEq<Y, 1, 2, 
	IfEq<Y, 2, 3, 
	IfEq<Y, 3, 4, 
	IfEq<Y, 4, 5, Fallback>
	>>>,
IfEq<X, 2, 
	IfEq<Y, 1, 3,
	IfEq<Y, 2, 4,
	IfEq<Y, 3, 5, Fallback>
	>>,
IfEq<X, 3,
	IfEq<Y, 1, 4,
	IfEq<Y, 2, 5, Fallback>
	>,
IfEq<X, 4,
	IfEq<Y, 1, 5, Fallback>,
Fallback
>>>
>>>;

// # Intended definition:
type AddFallback = number;
export type Add<X extends number, Y extends number> = IfEq<X, number, number, IfEq<Y, number, number, AddHelper<X, Y, AddFallback>>>

// # Test
let x: Add<1, 2>; // 3
let y: Add<4, 1>; // 5
let z: Add<3, 3>; // number ( > 5 )