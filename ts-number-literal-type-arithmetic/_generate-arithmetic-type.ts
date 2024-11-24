export function generateArithmeticType<T extends number | string>(genericTypeName: string, funcName: string, func: (x: T, y: T) => T, values: T[], specialCases: {value: T, resultWhenThisTypeIsValue(thisTypeName: string, otherTypeName: string): string}[] = [], fallbackType?: string): string {
	const HelperType1 = "X"; 
	const HelperType2 = "Y"; 
	const HelperFallbackTypeName = "Fallback"

	const Type1 = "X";
	const Type2 = "Y";
	
	return `type ${funcName}Helper<${HelperType1} extends ${genericTypeName}, ${HelperType2} extends ${genericTypeName}, ${HelperFallbackTypeName} extends ${genericTypeName}> = 
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

type ${funcName}Fallback = ${fallbackType || genericTypeName};
export type ${funcName}<${Type1} extends ${genericTypeName}, ${Type2} extends ${genericTypeName}> = IfEq<${Type1}, ${genericTypeName}, ${genericTypeName}, IfEq<${Type2}, ${genericTypeName}, ${genericTypeName}, ${funcName}Helper<${Type1}, ${Type2}, ${funcName}Fallback>>>`
}

import * as fs from "fs";
export function generateArithmeticTypeFile<T extends number | string>(filePathAndName: string, genericTypeName: string, funcName: string, func: (x: T, y: T) => T, values: T[], specialCases: {value: T, resultWhenThisTypeIsValue(thisTypeName: string, otherTypeName: string): string}[] = [], fallbackType?: string): void {
	fs.writeFileSync(filePathAndName, "import {IfEq} from './typeEqual'\n"+generateArithmeticType(genericTypeName, funcName, func, values, specialCases, fallbackType))
}

// generateArithmeticTypeFile<number>("generatedTypeAdd.ts", "number", "Add", (x, y) => x+y, [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5], [{value: 0, resultWhenThisTypeIsValue(_, otherTypeName){return otherTypeName}}])
// generateArithmeticTypeFile<number>("generatedTypeMultiply.ts", "number", "Multiply", (x, y) => x*y, [-5, -4, -3, -2, -1, 2, 3, 4, 5], [{value: 0, resultWhenThisTypeIsValue(){return "0"}}, {value: 1, resultWhenThisTypeIsValue(_, otherTypeName){return otherTypeName}}])