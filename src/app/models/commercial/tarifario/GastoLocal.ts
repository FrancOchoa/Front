import {Select} from '../../Select';

export class GastoLocal {
    id: number;
    via_id: number;
    concept: string;
    agent_id: number;
    currency_id: number;
    value: number;
    factor_id: number;
    observations: string;
    date: Date;
    provider: Select;
    constructor() {
        this.id = 0;
        this.via_id = 1;
        this.concept = null;
        this.agent_id = 0;
        this.currency_id = 162;
        this.value = 0;
        this.factor_id = 1;
        this.observations = null;
        this.date = null;
        this.provider = new Select();
    }
}