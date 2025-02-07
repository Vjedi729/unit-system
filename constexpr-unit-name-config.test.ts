import { expect, describe, test } from "@jest/globals";

// ! ********************************************* !
// ! This test "fails" if the code has type errors !
// ! ********************************************* ! 

// * Based on code in @goggles/unit-system-si-units

import BaseSIUnit from "./baseSIUnit";
import { AnyAbbreviation, AnyName, AnyOtherNames, UnitNameConfig, UnitNameConstruct } from "./nameConstruct";
import { UnitShape, UnitShapeMap } from "./unitShape";
import Unit, { AnyMathematicalConfig, AnyUnit } from "./unit";
import CombinationUnit from "./combinationUnit";
import { RelativeUnit } from "./relativeUnit";
import CustomUnit from "./customUnit";

// # Set up "basis" units
type SiBasisUnitsList = [
	BaseSIUnit<{"Length": 1}, UnitNameConfig<"meter", "m", undefined>>,
	BaseSIUnit<{"Time": 1}, UnitNameConfig<"second", "s", undefined>>,
	BaseSIUnit<{"Temperature": 1}, UnitNameConfig<"kelvin", "K", undefined>>,
	BaseSIUnit<{"Mass": 1}, UnitNameConfig<"kilogram", "kg", undefined>>,
	BaseSIUnit<{"ElectricCurrent": 1}, UnitNameConfig<"ampere", "A", undefined>>,
	BaseSIUnit<{"LuminousIntensity": 1}, UnitNameConfig<"candela", "cd", undefined>>,
	BaseSIUnit<{}, UnitNameConfig<"", "", undefined>>, // * Means "one"
];
export var siBasisUnits: SiBasisUnitsList = [
	new BaseSIUnit(UnitShape.FromBasisType("Length"),            new UnitNameConstruct('meter', 	'm'  )),
	new BaseSIUnit(UnitShape.FromBasisType("Time"),              new UnitNameConstruct('second', 	's'  )),
	new BaseSIUnit(UnitShape.FromBasisType("Temperature"),       new UnitNameConstruct('kelvin', 	'K'  )),
	new BaseSIUnit(UnitShape.FromBasisType("Mass"),              new UnitNameConstruct('kilogram', 	'kg' )),
	new BaseSIUnit(UnitShape.FromBasisType("ElectricCurrent"),   new UnitNameConstruct('ampere', 	'A'  )),
	new BaseSIUnit(UnitShape.FromBasisType("LuminousIntensity"), new UnitNameConstruct('candela', 	'cd' )),
	new BaseSIUnit(UnitShape.FromShapeMap({}),                   new UnitNameConstruct('', 			'')), // * "One"
]

export type AbbreviationOfUnit<ThisUnit extends AnyUnit> = 
    ThisUnit extends Unit<UnitShapeMap, UnitNameConfig<AnyName, infer CurrAbbr extends AnyAbbreviation, AnyOtherNames>, AnyMathematicalConfig> ? 
        CurrAbbr : 
        AnyAbbreviation
    ; 

type AbbreviationOfMeters = AbbreviationOfUnit<SiBasisUnitsList[0]>;

export type AbbreviationsOfUnits<Units extends AnyUnit[], Entries extends [AnyAbbreviation, AnyUnit][] = []> = 
    Units extends [infer CurrUnit extends AnyUnit, ...infer RemainingUnits extends AnyUnit[]] ? 
        AbbreviationsOfUnits<RemainingUnits, [[AbbreviationOfUnit<CurrUnit>, CurrUnit], ...Entries]> :
        Entries
    ;

type AbbreviationsOfSiBasisUnits = AbbreviationsOfUnits<[SiBasisUnitsList[0]]>
// type AbbreviationsOfSiBasisUnits

export type UnitByAbbreviation<Units extends AnyUnit[], Accumulator extends {[key: string]: AnyUnit} = {}> = 
    Units extends [infer CurrUnit extends AnyUnit, ...infer RemainingUnits extends AnyUnit[]] ? 
        (AbbreviationOfUnit<CurrUnit> extends string ?
            UnitByAbbreviation<RemainingUnits, {
                [Abbr in AbbreviationOfUnit<CurrUnit> | keyof Accumulator]: (
                Abbr extends keyof Accumulator ? Accumulator[Abbr] : CurrUnit
            )}> :
            UnitByAbbreviation<RemainingUnits, Accumulator>
        ) : 
        Accumulator
    ;

let u: UnitByAbbreviation<SiBasisUnitsList> = siBasisUnits.reduce<Record<string, AnyUnit>>((map, curr) => {
    if (curr.abbreviation != undefined) map[curr.abbreviation] = curr 
    return map
}, {}) as UnitByAbbreviation<SiBasisUnitsList>
export const siBasisUnitsByAbbreviation = u;


// # Use basis units to create combinations
// * This relies on the type being correctly defined above.
const k2cOffset: 273.15 = 273.15 // kelvinToCelsiusOffset

const mol = new RelativeUnit(u[''], 6.02214076 * 10^23, new UnitNameConstruct("mole", "mol"));
const celsius = new CustomUnit(u.K.shape, (degC) => degC - k2cOffset, (kelvin) => kelvin + k2cOffset, { hasAbsoluteZero: false, isLinear: true }, new UnitNameConstruct("degree Celsius",	"°C" ));

type U = UnitByAbbreviation<SiBasisUnitsList>;
export type SiDerivedUnitList = [
    typeof mol,
    typeof celsius,
    CombinationUnit<[[U['s'], -1]                                            ], UnitNameConfig<"hertz",     "Hz",  AnyOtherNames>>,
    CombinationUnit<[                                                        ], UnitNameConfig<"radian",	"rad", AnyOtherNames>>,
    CombinationUnit<[                                                        ], UnitNameConfig<"steradian",	"sr",  AnyOtherNames>>,
    CombinationUnit<[[U["kg"],  1], [U["m"],  1], [U["s"], -2]               ], UnitNameConfig<"newton",	"N",   AnyOtherNames>>,
    CombinationUnit<[[U["kg"],  1], [U["m"], -1], [U["s"], -2]               ], UnitNameConfig<"pascal",	"Pa",  AnyOtherNames>>,
    CombinationUnit<[[U["kg"],  1], [U["m"],  2], [U["s"], -2],              ], UnitNameConfig<"joule",	    "J",   AnyOtherNames>>,
    CombinationUnit<[[U["kg"],  1], [U["m"],  2], [U["s"], -3]               ], UnitNameConfig<"watt",	    "W",   AnyOtherNames>>,
    CombinationUnit<[[U["s"],   1], [U["A"],  1],                            ], UnitNameConfig<"coulomb",	"C",   AnyOtherNames>>,
    CombinationUnit<[[U["kg"],  1], [U["m"],  2], [U["s"], -3], [U["A"], -1] ], UnitNameConfig<"volt",	    "V",   AnyOtherNames>>,
    CombinationUnit<[[U["kg"], -1], [U["m"], -2], [U["s"],  4], [U["A"],  2] ], UnitNameConfig<"farad",	    "F",   AnyOtherNames>>,
    CombinationUnit<[[U["kg"],  1], [U["m"],  2], [U["s"], -3], [U["A"], -2] ], UnitNameConfig<"ohm",	    "Ω",   AnyOtherNames>>,
    CombinationUnit<[[U["kg"], -1], [U["m"], -2], [U["s"],  3], [U["A"],  2] ], UnitNameConfig<"siemens",	"S",   AnyOtherNames>>,
    CombinationUnit<[[U["kg"],  1], [U["m"],  2], [U["s"], -2], [U["A"], -1] ], UnitNameConfig<"weber",	    "Wb",  AnyOtherNames>>,
    CombinationUnit<[[U["kg"],  1], [U["s"], -2], [U["A"], -1]               ], UnitNameConfig<"tesla",	    "T",   AnyOtherNames>>,
    CombinationUnit<[[U["kg"],  1], [U["m"],  2], [U["s"], -2], [U["A"], -2] ], UnitNameConfig<"henry",	    "H",   AnyOtherNames>>,
    CombinationUnit<[[U["cd"],  1],                                          ], UnitNameConfig<"lumen",	    "lm",  AnyOtherNames>>,
    CombinationUnit<[[U["cd"],  1], [U["m"], -2],                            ], UnitNameConfig<"lux",	    "lx",  AnyOtherNames>>,
    CombinationUnit<[[U["s"],  -1],                                          ], UnitNameConfig<"becquerel",	"Bq",  AnyOtherNames>>,
    CombinationUnit<[[U["m"],   2], [U["s"], -2],                            ], UnitNameConfig<"gray",	    "Gy",  AnyOtherNames>>,
    CombinationUnit<[[U["m"],   2], [U["s"], -2],                            ], UnitNameConfig<"sievert",	"Sv",  AnyOtherNames>>,
    CombinationUnit<[[U["s"],  -1], [typeof mol,  1],                        ], UnitNameConfig<"katal",	    "kat", AnyOtherNames>>,
];

export var siDerivedUnits: SiDerivedUnitList = [
    mol,
    celsius,
    new CombinationUnit([[u.s, -1]                                   ],             new UnitNameConstruct("hertz",          "Hz" )),
    new CombinationUnit([                                            ],             new UnitNameConstruct("radian", 	    "rad")),
    new CombinationUnit([                                            ],             new UnitNameConstruct("steradian", 	    "sr" )),
    new CombinationUnit([[u.kg,  1], [u.m,  1], [u.s, -2]            ],             new UnitNameConstruct("newton", 	    "N"  )),
    new CombinationUnit([[u.kg,  1], [u.m, -1], [u.s, -2]            ],             new UnitNameConstruct("pascal", 	    "Pa" )),
    new CombinationUnit([[u.kg,  1], [u.m,  2], [u.s, -2],           ],             new UnitNameConstruct("joule", 	        "J"  )),
    new CombinationUnit([[u.kg,  1], [u.m,  2], [u.s, -3]            ],             new UnitNameConstruct("watt", 	        "W"  )),
    new CombinationUnit([[u.s,   1], [u.A,  1],                      ],             new UnitNameConstruct("coulomb", 	    "C"  )),
    new CombinationUnit([[u.kg,  1], [u.m,  2], [u.s, -3], [u.A, -1] ],             new UnitNameConstruct("volt", 	        "V"  )),
    new CombinationUnit([[u.kg, -1], [u.m, -2], [u.s,  4], [u.A,  2] ],             new UnitNameConstruct("farad", 	        "F"  )),
    new CombinationUnit([[u.kg,  1], [u.m,  2], [u.s, -3], [u.A, -2] ],             new UnitNameConstruct("ohm", 	        "Ω"  )),
    new CombinationUnit([[u.kg, -1], [u.m, -2], [u.s,  3], [u.A,  2] ],             new UnitNameConstruct("siemens", 	    "S"  )),
    new CombinationUnit([[u.kg,  1], [u.m,  2], [u.s, -2], [u.A, -1] ],             new UnitNameConstruct("weber", 	        "Wb" )),
    new CombinationUnit([[u.kg,  1], [u.s, -2], [u.A, -1]            ],             new UnitNameConstruct("tesla", 	        "T"  )),
    new CombinationUnit([[u.kg,  1], [u.m,  2], [u.s, -2], [u.A, -2] ],             new UnitNameConstruct("henry", 	        "H"  )),
    new CombinationUnit([[u.cd,  1],                                 ],             new UnitNameConstruct("lumen", 	        "lm" )),
    new CombinationUnit([[u.cd,  1], [u.m, -2],                      ],             new UnitNameConstruct("lux", 	        "lx" )),
    new CombinationUnit([[u.s,  -1],                                 ],             new UnitNameConstruct("becquerel", 	    "Bq" )),
    new CombinationUnit([[u.m,   2], [u.s, -2],                      ],             new UnitNameConstruct("gray", 	        "Gy" )),
    new CombinationUnit([[u.m,   2], [u.s, -2],                      ],             new UnitNameConstruct("sievert", 	    "Sv" )),
    new CombinationUnit([[u.s,  -1], [mol,  1],                      ],             new UnitNameConstruct("katal", 	        "kat")),
];