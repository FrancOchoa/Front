import {Select} from '../../Select';

export class Tarifa {
    id: number;
    flag: any;
    key: any;
    description: any;
    price: number;
    price_zona_1: number;
    price_zona_2: number;
    price_zona_3: number;
    price_zona_4: number;
    price_zona_5: number;
    select: Select;
    constructor(key: any, description: any = 'MINIMO', flag = '') {
        this.id = 0;
        this.flag = flag;
        this.key = key;
        this.description = description;
        this.price = 0;
        this.price_zona_1 = 0;
        this.price_zona_2 = 0;
        this.price_zona_3 = 0;
        this.price_zona_4 = 0;
        this.price_zona_5 = 0;
        this.select = null;
    }
}