import BaseSIUnit from "./baseSIUnit";
import UnitShape from "./unitShape";

export var NoneUnit = new BaseSIUnit(new UnitShape({}), {name: "None", abbreviation: ''})
export default NoneUnit