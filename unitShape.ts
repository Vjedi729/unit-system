// TODO: Fix dependency loop so VectorLike can be imported
// import { VectorLike } from "../../../vectorLike"

export type UnitBasisType = "Length" | "Time" | "Mass" | "Temperature" | "ElectricCurrent" | "LuminousIntensity" | "Amount" | string
export type UnitShapeMap = {[key:UnitBasisType]:number}

function IsUnitBasisType(x:UnitBasisType | UnitShapeMap):boolean { return typeof(x) == "string"}

function ToUnitTypeShape(unitType: UnitBasisType | UnitShapeMap): UnitShapeMap{
    return IsUnitBasisType(unitType) ? {unitType: 1} : (unitType as UnitShapeMap)
}

function UnitTypeShape_Equal(a: UnitShapeMap, b: UnitShapeMap): boolean {
    return (
        Object.keys(a).map((currKey) => a[currKey] == b[currKey]).reduce((prev, curr) => prev && curr, true)
        &&
        Object.keys(b).map((currKey) => a[currKey] == b[currKey]).reduce((prev, curr) => prev && curr, true)
    )
}

export class UnitShape /*implements VectorLike<UnitShape>*/ {
    shape: UnitShapeMap

    constructor(unitType?: UnitBasisType | UnitShapeMap | UnitShape){
        this.shape = unitType==undefined ? {} : (typeof(unitType) == "string") ? {unitType: 1} : ((unitType instanceof UnitShape) ? unitType.shape : unitType)
    }

    equal(other: UnitShape){ return UnitTypeShape_Equal(this.shape, other.shape) }

    add(other: UnitShape): UnitShape {
        let newShape:UnitShapeMap = {}
        Object.entries(this.shape).forEach(
            ([basistype, power]) => newShape[basistype] = power
        )
        Object.entries(other.shape).forEach(
            ([basistype, power]) => newShape[basistype] = (newShape[basistype] || 0) + power 
        )

        return new UnitShape(newShape)
    }

    multiply(scalar: number): UnitShape {
        let newShape = Object.entries(this.shape).reduce((result:UnitShapeMap, [key, power]) => { 
            result[key] = power*scalar; return result }, 
            {}
        )
        
        return new UnitShape(newShape)
    }

    toString():string {
        return Object.entries(this.shape).map(([key, val]) => `${key}${val==1?'':`^${val}`}`).join(' * ')
    }
}

export default UnitShape