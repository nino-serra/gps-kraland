import { PROVINCE_HEIGHT, PROVINCE_WIDTH } from "./terrain";
import { provinces } from "./provinces";

export const provinceOrigins = provinces.map((province) => ({
  province: province.name,
  originX: province.col * PROVINCE_WIDTH + province.row * (PROVINCE_WIDTH / 2),
  originY: province.row * PROVINCE_HEIGHT,
}));
