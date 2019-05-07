import {Select} from '../../Select';

export class Aduana {
    id: number;
    city_id: number;
    agent_id: number;
    via_id: number;
    factor_id: number;
    currency_id: number;
    concept: string;
    regimen: string;
    value: number;
    observations: string;
    date: Date;
    agent: Select;
    city: Select;
    constructor() {
        this.id = 0;
        this.city_id = 0;
        this.via_id = 1;
        this.regimen = 'IMPORTACIÓN';
        this.concept = null;
        this.agent_id = 0;
        this.currency_id = 162;
        this.value = 0;
        this.factor_id = 1;
        this.observations = null;
        this.date = null;
        this.agent = new Select();
        this.city = new Select();
    }
}