export const schemes = {
  required: (data) => !!data ? true : Promise.reject({ messageSchema: 'Field is been required'}),
};


export const schemaBuilder = (...func) => async (data) => {
    const resultFuncValidators = func.reduce((acc, f) => {
        const validatorRes = acc.status === 'on' && f(acc.result);
        if(acc.status === 'on' && validatorRes === true) {
            return { ...acc, result: validatorRes };
        } else if(acc.status === 'on') {
            return { status: 'off', result: validatorRes};
        } else {
            return acc;
        }
    }, { result: data, status: 'on'});
    return resultFuncValidators.result;
};

export const validator = async (schema: Record<string, any> , body: Record<string, any>) => {
    const entriesObj = Object.entries(body);
    const schemaKeys = Object.keys(schema);
    let res: boolean | Promise<{ message: string, status: number}> = true;

    for (let keySchemaIndex = 0; keySchemaIndex < schemaKeys.length; keySchemaIndex++) {
        if(!(schemaKeys[keySchemaIndex] in body)) {
            res = Promise.reject({ message: `Field ${schemaKeys[keySchemaIndex]} is not exist in body`, status: 400})
            return res;
        }
    }

    for (let i = 0; i < entriesObj.length; i++) {
        const [key, value] = entriesObj[i];
        if (!(key in schema)) {
            //res = Promise.reject({ message: `${key} Field not found`, status: 400});
            //return res;
        } else {
            try {
                res = await schema[key](value);
                return res;
            } catch (err) {
                if ('messageSchema' in err) {
                    res = Promise.reject({message: `${key} ${err.messageSchema}`, status: 400});
                } else {
                    res = Promise.reject({message: 'Server validation error', status: 500})
                }

                return res;
            }
        }
    }
    return res;
};