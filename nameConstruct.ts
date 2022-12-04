export interface UnitNameConfig {
    name: string
    abbreviation?: string
    otherNames?: Array<string>
}

export class UnitNameConstruct implements UnitNameConfig {
    name: string
    abbreviation?: string
    otherNames?: Array<string>

    constructor(name: string, abbreviation?: string, otherNames?: Array<string>) {
        this.name = name,
        this.abbreviation = abbreviation,
        this.otherNames = otherNames
    }
} 