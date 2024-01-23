export const decodeParams = (search) => {

    const queryParams = new URLSearchParams(search);
    const authCode = queryParams.get('code');
    const stateParam = queryParams.get('state');
    let npmsocketid, type, port;

    if (stateParam) {
        const decodedState = decodeURIComponent(stateParam);
        const stateObj = JSON.parse(decodedState);
        npmsocketid = stateObj.npmsocket;
        type = stateObj.type;
        port = stateObj.port;
    }

    return { authCode, npmsocketid, type, port };

};