export interface ICrud {
    search(params: any);
    save(data: any);
    edit(id: number);
    update(id: number, params: any);
    delete(id: number);
}