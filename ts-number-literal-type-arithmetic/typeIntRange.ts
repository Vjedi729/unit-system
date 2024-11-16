export type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>
;

export type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>
// export type IntRangeExclusive<F extends number, T extends number> = Exclude<Enumerate<T> | F, Enumerate<F>>
export type IntRangeInclusive<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>> | T

type T = IntRange<20, 300> // * Includes 20, excludes 300
// type exclusiveT = IntRangeExclusive<20, 300> // * Excludes 20 and 300
type InclusiveT = IntRangeInclusive<20, 300> // * Includes 20 and 300