import {Concept} from '../../autocomplete/Concept';

export class ServiceQuote {
    id?: number;
    type: number;
    concept_id: number;
    concept: Concept;
    currency_id?: number;
    factor_id?: number;
    quantity?: number;
    rate?: number;
    total_rate?: number;
    cost?: number;
    total_cost?: number;
    margin?: number;
    group_name: string;
    create_group_active: boolean;
    checked_active: boolean;
    color: string;
    constructor() {
        this.type = null;
        this.concept_id = null;
        this.concept = new Concept();
        this.currency_id = 162;
        this.factor_id = 1;
        this.quantity = 1;
        this.rate = 0;
        this.total_rate = 0;
        this.cost = 0;
        this.total_cost = 0;
        this.margin = 0;
        this.group_name = '';
        this.create_group_active = false;
        this.checked_active = false;
        this.color = '';
    }
}