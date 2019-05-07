export class Tax {
    id?: number;
    t_c_ref?: number; /* valor TC Ref */
    fob?: number; /* valor FOB */
    flete?: number; /* valor Flete */
    secure?: number; /* valor Seguro */
    cif?: number; /* valor CIF */
    rate_valorem?: number;
    rate_iva?: number;
    rate_perception?: number;
    currency_valorem?: number;
    currency_iva?: number;
    currency_perception?: number;
    total_valorem?: number;
    total_iva?: number;
    total_perception?: number;
    sub_total?: number;
    constructor() {
        this.t_c_ref = 3.25;
        this.rate_valorem = 6;
        this.rate_iva = 18;
        this.rate_perception = 3.5;
        this.currency_valorem = 120; /* ID en soles */
        this.currency_iva = 120; /* ID en soles */
        this.currency_perception = 120; /* ID en soles */
        this.fob = 0.00;
        this.flete = 0.00;
        this.secure = 0.00;
        this.cif = 0.00;
        this.total_valorem = 0.00;
        this.total_iva = 0.00;
        this.total_perception = 0.00;
        this.sub_total = 0.00;
    }
}