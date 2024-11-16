import { IfEq, AndEquals } from "./typeEqual";

type MultiplyHelper<X extends number, Y extends number, Fallback extends number> = 
IfEq<X, 0, 0, 
IfEq<Y, 0, 0, 
IfEq<X, 1, Y, 
IfEq<Y, 1, X, 
IfEq<X, 2, 
    IfEq<Y, 2, 4,
    IfEq<Y, 3, 6,
    IfEq<Y, 4, 8,
    IfEq<Y, 5, 10, Fallback
    >>>>,
IfEq<X, 3, 
    IfEq<Y, 2, 6,
    IfEq<Y, 3, 9,
    IfEq<Y, 4, 12,
    IfEq<Y, 5, 15, Fallback
    >>>>,
IfEq<X, 4, 
    IfEq<Y, 2, 8,
    IfEq<Y, 3, 12,
    IfEq<Y, 4, 16,
    IfEq<Y, 5, 20, Fallback
    >>>>,
IfEq<X, 5, 
    IfEq<Y, 2, 10,
    IfEq<Y, 3, 15,
    IfEq<Y, 4, 20,
    IfEq<Y, 5, 25, Fallback
    >>>>,
Fallback
>>>>
>>>>

type MultiplyFallback = number
export type Multiply<X extends number, Y extends number> = IfEq<X, number, number, IfEq<Y, number, number, MultiplyHelper<X, Y, MultiplyFallback>>>