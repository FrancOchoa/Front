export const dataTableOptionsInModal = {
    sDom: 't<"row view-pager"<"col-sm-12"<"text-center"p>>>',
    bLengthChange: false,
    searching: false,
    language: {
        sLengthMenu     : '_MENU_',
        sZeroRecords    : 'No se encontraron resultados',
        sEmptyTable     : 'Ningún dato disponible en esta tabla',
        sInfo           : '_START_-_END_/_TOTAL_',
        sInfoEmpty      : '0-0/0',
        sInfoFiltered   : '(filtrado de un total de _MAX_ registros)',
        sInfoPostFix    : '',
        sSearch         : 'Buscar: ',
        sInfoThousands  : '',
        sLoadingRecords : 'Cargando...',
        oPaginate       : {
            sFirst    : 'Primero',
            sLast     : 'Último',
            sNext     : '<i class="fa fa-fw fa-angle-right"></i>',
            sPrevious : '<i class="fa fa-fw fa-angle-left"></i>',
        },
        oAria : {
            sSortAscending  : ': Activar para ordenar la columna de manera ascendente',
            sSortDescending : ': Activar para ordenar la columna de manera descendente',
        }
    }
}