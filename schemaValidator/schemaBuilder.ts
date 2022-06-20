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