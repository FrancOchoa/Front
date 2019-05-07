import Swal from "sweetalert2";

export class Loadding {
    public static show(title = 'Cargando...'): void {
        if (!Swal.isVisible()) {
            Swal.fire({
                title: title,
                allowOutsideClick: false,
                onBeforeOpen: () => {
                    Swal.showLoading();
                }
            });
        }
    }

    public static showCreate() {
        return this.show('Guardando, espere...');
    }

    public static showUpdate() {
        return this.show('Actualizando, espere...');
    }

    public static showDelete(callback, text = 'Una vez eliminado, no podrá recuperar la información!') {
        Swal.fire({
            title: '¿Estas seguro de eliminar?',
            text: text,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.value) {
                Swal.fire({
                    title: 'Eliminando, espere...',
                    allowOutsideClick: false,
                    onBeforeOpen: () => {
                        Swal.showLoading();
                    }
                });
                callback();
            }
        });
    }

    public static showSearch() {
        return this.show('Buscando, espere...');
    }

    public static close() {
        if (Swal.isVisible())
            Swal.close();
    }

    public static showInInput(element) {
        element.classList.remove('hide');
        element.classList.add('show');
    }
    public static hideInInput(element) {
        element.classList.remove('show');
        element.classList.add('hide');
    }
}

export class Info {
    public static show(html = '') {
        Swal.fire({
            title: 'Detalle del evento',
            type: 'info',
            html: html
        });
    }
}

export class ErrorAlert {
    public static show(message = 'Something went wrong!') {
        Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: message,
        });
    }
}

export class ConfirmAlert {
    public static show(callback, title = '¿Estas seguro de eliminar?', text = 'Una vez eliminado, no podrá recuperar la información!') {
        Swal.fire({
            title: title,
            text: text,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.value) {
                Swal.fire({
                    title: 'Procesando, espere...',
                    allowOutsideClick: false,
                    onBeforeOpen: () => {
                        Swal.showLoading();
                    }
                });
                callback();
            }
        });
    }
}

export class AlertWithOptions {
    public static show(callback, title = '', options) {
        Swal.fire({
            title: title,
            input: 'radio',
            inputOptions: options,
            inputValidator: function(result) {
                console.log(result);
                if (!result) {
                    return 'Necesitas seleccionar algo!';
                }
            },
            inputClass: 'flex-column align-items-start',
            type: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            showLoaderOnConfirm: true,
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            callback(result.value);
        });
    }
}