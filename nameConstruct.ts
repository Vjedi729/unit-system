export interface UnitNameConfig<
    ThisName extends string, 
    ThisAbbreviation extends (string | undefined),
    ThisOtherNames extends (string[] | undefined)
> {
    name: ThisName
    abbreviation?: ThisAbbreviation
    otherNames?: ThisOtherNames
}

export type AnyUnitNameConfig = UnitNameConfig<string, string | undefined, string[] | undefined>

export class UnitNameConstruct<
    ThisName extends string = string, 
    ThisAbbreviation extends (string | undefined) = (string | undefined), 
    ThisOtherNames extends (string[] | undefined) = (string[] | undefined)
> implements UnitNameConfig<ThisName, ThisAbbreviation, ThisOtherNames> {
    name: ThisName
    abbreviation?: ThisAbbreviation
    otherNames?: ThisOtherNames

    constructor(name: ThisName, abbreviation?: ThisAbbreviation, otherNames?: ThisOtherNames) {
        this.name = name,
        this.abbreviation = abbreviation,
        this.otherNames = otherNames
    }
} 