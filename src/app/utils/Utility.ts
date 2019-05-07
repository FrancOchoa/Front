export class Utility {
    public static convertModelToFormData(model: any, form: FormData = null, namespace = ''): FormData {
        const formData = form || new FormData();
        let formKey;

        for (const propertyName in model) {
            /*if (!model.hasOwnProperty(propertyName) || !model[propertyName]) {
                continue;
            }*/

            formKey = namespace ? `${namespace}[${propertyName}]` : propertyName;

            if (model[propertyName] instanceof Date) {
                formData.append(formKey, model[propertyName].toISOString());
            } else if (model[propertyName] instanceof Array) {
                model[propertyName].forEach((element, index) => {
                    const tempFormKey = `${formKey}[${index}]`;
                    this.convertModelToFormData(element, formData, tempFormKey);
                });
            } else if (typeof model[propertyName] === 'object' && !(model[propertyName] instanceof File)) {
                this.convertModelToFormData(model[propertyName], formData, formKey);
            } else {
                formData.append(formKey, model[propertyName].toString());
            }
        }
        return formData;
    }
}