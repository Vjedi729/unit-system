import Unit from './unit'
import UnitShape, {UnitBasisType, UnitShapeMap} from './unitShape'

export class SimpleUnit extends Unit {
    scaleToBaseSI: number
    oneOverScale: number

    constructor(name:string, shape: UnitBasisType | UnitShapeMap | UnitShape, scaleToBaseSI: number, abbreviation?: string) 
    {
        super(name, shape, abbreviation)
        this.scaleToBaseSI = scaleToBaseSI
        this.oneOverScale = 1/scaleToBaseSI
    }

    toBaseSI(x: number) { return this.scaleToBaseSI * x }
    fromBaseSI(x: number) { return this.oneOverScale * x}

    static Relative(name:string, relativeTo:SimpleUnit, relativeScale:number, abbreviation?: string): SimpleUnit{
        return new SimpleUnit(
            name,
            relativeTo.shape,
            relativeTo.scaleToBaseSI * relativeScale,
            abbreviation
        )
    }
}

export default SimpleUnit
