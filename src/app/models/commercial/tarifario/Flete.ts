import {Tarifa} from './Tarifa';
import {Recargo} from './Recargo';
import {Select} from '../../Select';

export class Flete {
    id: number;
    agent_id: number;
    transport_id: number;
    product_type_id: string;
    currency_id: number;
    tt_dias: number;
    route_or_service: string;
    frequency: string;
    date_start: Date;
    date_end: Date;
    conditions: string;
    observations: string;
    tarifas: Array<Tarifa>;
    recargos: Array<Recargo>;
    agent: Select;
    transport: Select;
    fs: number;
    sc: number;
    min_fs: number;
    min_sc: number;
    constructor() {
        this.id = 0;
        this.agent = new Select();
        this.agent_id = 0;
        this.transport = new Select();
        this.transport_id = 0;
        this.product_type_id = '';
        this.currency_id = 162;
        this.tt_dias = 0;
        this.route_or_service = null;
        this.frequency = '';
        this.conditions = '';
        this.date_start = null;
        this.date_end = null;
        this.tarifas = [];
        this.recargos = [];
        this.observations = null;
        this.fs = 0;
        this.sc = 0;
        this.min_fs = 0;
        this.min_sc = 0;
    }
}