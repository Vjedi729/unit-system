import BaseSIUnit from "./baseSIUnit";
import { UnitNameConstruct } from "./nameConstruct";
import { UnitShape } from "./unitShape";

export var NoneUnit = new BaseSIUnit(new UnitShape({}), new UnitNameConstruct("None", ''))
export default NoneUnit