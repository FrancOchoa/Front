export class Case {
    id?: number;
    quote_id?: number;
    package_id?: string;
    quantity?: number;
    long?: number;
    height?: number;
    width?: number;
    weight?: number;
    volume?: number;
    cbm?: number;
    constructor() {
        this.quote_id = null;
        this.package_id = '';
        this.quantity = 1;
        this.long = null;
        this.height = null;
        this.width = null;
        this.weight = 0;
        this.volume = 0;
        this.cbm = 0;
    }
}
