import Unit from "./unit"

class BaseSIUnit extends Unit {
    toBaseSI(quantityInThisUnit: number): number { return quantityInThisUnit }
    fromBaseSI(quantityInBaseSI: number): number { return quantityInBaseSI }
}

export default BaseSIUnit