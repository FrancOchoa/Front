import {Tarifa} from './Tarifa';
import {Recargo} from './Recargo';
import {Select} from '../../Select';
import {Port} from '../quote/Port';

export class TransporteTerrestre {
    id: number;
    provider_id: number;
    product_type_id: string;
    currency_id: number;
    date_start: Date;
    date_end: Date;
    observations: string;
    service: string;

    tarifas: Array<Tarifa>;
    recargos: Array<Recargo>;
    provider: Select;

    origin: Port;
    destination: Port;
    zonas: any;
    constructor() {
        this.id = 0;
        this.provider = new Select();
        this.provider_id = 0;
        this.product_type_id = '';
        this.currency_id = 162;
        this.date_start = null;
        this.date_end = null;
        this.observations = null;
        this.service = 'consolidado';
        this.tarifas = [];
        this.recargos = [];

        this.origin = new Port();
        this.destination = new Port();

        this.zonas = [
            {
                name: 'ZONA 1',
                description: 'CALLAO, LA PUNTA, BELLAVISTA, LA PERLA, CARMEN DE LA LEGUA, REYNOSO, SAN MIGUEL.',
                edit: false
            },
            {
                name: 'ZONA 2',
                description: `BREÑA, CERCADO DE LIMA, COMAS, SAN MARTIN DE PORRAS, RIMAC, LOS OLIVOS, INDEPENDENCIA, EL AGUSTINO, LA VICTORIA, PUEBLO LIBRE, JESUS MARIA, LINCE, SAN LUIS, MAGDALENA DEL MAR.`,
                edit: false
            },
            {
                name: 'ZONA 3',
                description: `SAN ISIDRO, SAN BORJA, MIRAFLORES, SURQUILLO, BARRANCO, SURCO, VITARTE, SANTA CLARA, SANTA ANITA, SAN JUAN DE LURIGANCHO, CARABAYLLO.`,
                edit: false
            },
            {
                name: 'ZONA 4',
                description: 'CHORRILLOS, VILLA EL SALVADOR, VILLA MARIA DEL TRIUNFO, SAN JUAN DE MIRAFLORES, LA MOLINA, ANCON, HUACHIPA.',
                edit: false
            }
        ];
    }
}