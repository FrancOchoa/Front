import {Select} from '../../Select';

export class AlmacenTerminal {
    id: number;
    terminal_id: number;
    via_id: number;
    city_id: number;
    type_storage: string;
    regimen: string;
    currency_id: number;
    concept: string;
    value: number;
    factor_id: number;
    observations: string;
    date: Date;
    terminal: Select;
    city: Select;
    constructor() {
        this.id = 0;
        this.terminal_id = 0;
        this.via_id = 1;
        this.city_id = null;
        this.type_storage = 'DEPOSITO TEMPORAL';
        this.regimen = 'IMPORTACIÓN';
        this.concept = null;
        this.currency_id = 162;
        this.value = 0;
        this.factor_id = 1;
        this.observations = null;
        this.date = null;
        this.terminal = new Select();
        this.city = new Select();
    }
}