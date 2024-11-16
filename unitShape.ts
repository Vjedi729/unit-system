// TODO: Fix dependency loop so VectorLike can be imported
// import { VectorLike } from "../../../vectorLike"

import { Add } from "./ts-number-literal-type-arithmetic/generatedTypeAdd"
import { Multiply } from "./ts-number-literal-type-arithmetic/generatedTypeMultiply"

export type UnitBasisType = "Length" | "Time" | "Mass" | "Temperature" | "ElectricCurrent" | "LuminousIntensity" | "Amount" | string
export type UnitShapeMap = {[key:UnitBasisType]:number}

function UnitTypeShape_Equal(a: UnitShapeMap, b: UnitShapeMap): boolean {
    return (
        Object.keys(a).map((currKey) => a[currKey] == b[currKey]).reduce((prev, curr) => prev && curr, true)
        &&
        Object.keys(b).map((currKey) => a[currKey] == b[currKey]).reduce((prev, curr) => prev && curr, true)
    )
}

export type OLD_ShapeMapAdd<ShapeMapA extends UnitShapeMap, ShapeMapB extends UnitShapeMap> = (
    {[Dim in Exclude<keyof ShapeMapB, keyof ShapeMapA>]: ShapeMapB[Dim]} &
    {[Dim in Exclude<keyof ShapeMapA, keyof ShapeMapB>]: ShapeMapA[Dim]} &
    {[Dim in Extract<keyof ShapeMapB, keyof ShapeMapA>]: Add<ShapeMapA[Dim], ShapeMapB[Dim]>}
)

export type ShapeMapAdd<ShapeMapA extends UnitShapeMap, ShapeMapB extends UnitShapeMap> = {
    [Dim in (keyof ShapeMapA | keyof ShapeMapB)]: (
        Dim extends Exclude<keyof ShapeMapB, keyof ShapeMapA> ? ShapeMapB[Dim] :
        Dim extends Exclude<keyof ShapeMapA, keyof ShapeMapB> ? ShapeMapA[Dim] :
        Dim extends Extract<keyof ShapeMapA, keyof ShapeMapB> ? Add<ShapeMapA[Dim], ShapeMapB[Dim]> :
        0
    )
}

type TestAddType = ShapeMapAdd<{"A": 1, "C": 1}, {"B": 1, "C": 1}>

export type ShapeMapScale<ScaleFactor extends number, ShapeMap extends UnitShapeMap> = { [Dim in keyof ShapeMap]: Multiply<ShapeMap[Dim],ScaleFactor> };

export class UnitShape<ThisShapeMap extends UnitShapeMap> /*implements VectorLike<UnitShape>*/ {
    shape: ThisShapeMap

    static FromShapeMap<ThisShapeMap extends UnitShapeMap>(shape: ThisShapeMap): UnitShape<ThisShapeMap> {
        return new UnitShape(shape)
    }

    static FromBasisType<ThisBasisType extends UnitBasisType>(basisType: ThisBasisType): UnitShape<Record<ThisBasisType, 1>> {
        return UnitShape.FromShapeMap({[basisType]: 1} as Record<ThisBasisType, 1>)
    }

    constructor(unitShape: ThisShapeMap){
        this.shape = unitShape
    }

    equal(other: UnitShape<UnitShapeMap>){ return UnitTypeShape_Equal(this.shape, other.shape) }

    add<OtherShapeMap extends UnitShapeMap>(other: UnitShape<OtherShapeMap>): UnitShape<ShapeMapAdd<ThisShapeMap, OtherShapeMap>> {
        let newShape:UnitShapeMap = {}
        Object.entries(this.shape).forEach(
            ([basisType, power]) => newShape[basisType] = power
        )
        Object.entries(other.shape).forEach(
            ([basisType, power]) => newShape[basisType] = (newShape[basisType] || 0) + power 
        )

        return new UnitShape(newShape as ShapeMapAdd<ThisShapeMap, OtherShapeMap>)
    }

    multiply<ExactNumber extends number>(scalar: ExactNumber): UnitShape<ShapeMapScale<ExactNumber, ThisShapeMap>>
    {
        let newShape = Object.entries(this.shape).reduce((result:UnitShapeMap, [key, power]) => { 
            result[key] = power*scalar; return result }, 
            {}
        )
        
        return new UnitShape(newShape as ShapeMapScale<ExactNumber, ThisShapeMap>)
    }

    toString(): string {
        return Object.entries(this.shape).map(([key, val]) => `${key}${val==1?'':`^${val}`}`).join(' * ')
    }
}

// export default UnitShape