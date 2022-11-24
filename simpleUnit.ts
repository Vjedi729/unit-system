import Unit from './unit'
import UnitShape, {UnitBasisType, UnitShapeMap} from './unitShape'

class SimpleUnit extends Unit {
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
}

export default SimpleUnit
