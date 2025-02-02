export function generateArithmeticType<T extends number | string, OutType>(genericTypeName: string, genericOutTypeName: string, funcName: string, func: (x: T, y: T) => OutType, values: T[], specialCases: {value: T, resultWhenThisTypeIsValue(thisTypeName: string, otherTypeName: string): string}[] = [], fallbackType?: string): string {
	const HelperType1 = "X"; 
	const HelperType2 = "Y"; 
	const HelperFallbackTypeName = "Fallback"

	const Type1 = "X";
	const Type2 = "Y";
	
	return `type ${funcName}Helper<${HelperType1} extends ${genericTypeName}, ${HelperType2} extends ${genericTypeName}, ${HelperFallbackTypeName} extends ${genericOutTypeName}> = 
${specialCases.map(x => 
	`IfEq<${HelperType1}, ${x.value}, ${x.resultWhenThisTypeIsValue(HelperType1, HelperType2)},
	IfEq<${HelperType2}, ${x.value}, ${x.resultWhenThisTypeIsValue(HelperType2, HelperType1)},`
).join('\n')}
${values.map(x => `IfEq<${HelperType1}, ${x},
	${values.map(y => `IfEq<${HelperType2}, ${y}, ${func(x, y)},`).join("\n\t")}
	${HelperFallbackTypeName}
	${">".repeat(values.length)},`
).join('\n')}
${HelperFallbackTypeName}
${">".repeat(values.length)}
${">".repeat(specialCases.length*2)};

type ${funcName}Fallback = ${fallbackType || genericOutTypeName};
export type ${funcName}<${Type1} extends ${genericTypeName}, ${Type2} extends ${genericTypeName}> = IfEq<${Type1}, ${genericTypeName}, ${genericOutTypeName}, IfEq<${Type2}, ${genericTypeName}, ${genericOutTypeName}, ${funcName}Helper<${Type1}, ${Type2}, ${funcName}Fallback>>>`
}

import * as fs from "fs";
export function generateArithmeticTypeFile<T extends number | string, OutType>(filePathAndName: string, genericTypeName: string, genericOutTypeName: string, funcName: string, func: (x: T, y: T) => OutType, values: T[], specialCases: {value: T, resultWhenThisTypeIsValue(thisTypeName: string, otherTypeName: string): string}[] = [], fallbackType?: string): void {
	fs.writeFileSync(filePathAndName, "import {IfEq} from './typeEqual'\n"+generateArithmeticType<T, OutType>(genericTypeName, genericOutTypeName, funcName, func, values, specialCases, fallbackType))
}

// generateArithmeticTypeFile<number>("generatedTypeAdd.ts", "number", "number", "Add", (x, y) => x+y, [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5], [{value: 0, resultWhenThisTypeIsValue(_, otherTypeName){return otherTypeName}}])
// generateArithmeticTypeFile<number>("generatedTypeMultiply.ts", "number", "number", "Multiply", (x, y) => x*y, [-5, -4, -3, -2, -1, 2, 3, 4, 5], [{value: 0, resultWhenThisTypeIsValue(){return "0"}}, {value: 1, resultWhenThisTypeIsValue(_, otherTypeName){return otherTypeName}}])
// generateArithmeticTypeFile<number, boolean>("generatedTypeGreaterThan.ts", "number", "boolean", "GreaterThan", (x, y) => x>y, [-5, -4, -3, -2, -1, 2, 3, 4, 5], [])
// generateArithmeticTypeFile<number, boolean>("generatedTypeLessThan.ts", "number", "boolean", "LessThan", (x, y) => x<y, [-5, -4, -3, -2, -1, 2, 3, 4, 5], [])

const AlphabeticalLetters = [
	'"a"', '"b"', '"c"', '"d"', '"e"', '"f"', '"g"', '"h"', '"i"', '"j"', '"k"', '"l"', '"m"', '"n"', '"o"', '"p"', '"q"', '"r"', '"s"', '"t"', '"u"', '"v"', '"w"', '"x"', '"y"', '"z"',
	'"A"', '"B"', '"C"', '"D"', '"E"', '"F"', '"G"', '"H"', '"I"', '"J"', '"K"', '"L"', '"M"', '"N"', '"O"', '"P"', '"Q"', '"R"', '"S"', '"T"', '"U"', '"V"', '"W"', '"X"', '"Y"', 'Z'
]
generateArithmeticTypeFile<string, boolean>(
	"generatedCharAlphabeticallyBefore.ts", "string", "boolean", "CharAlphabeticallyBefore", (x, y) => x>y, AlphabeticalLetters, []
);
generateArithmeticTypeFile<string, boolean>(
	"generatedCharAlphabeticallyAfter.ts", "string", "boolean", "CharAlphabeticallyAfter", (x, y) => x<y, AlphabeticalLetters, []
);