
const apiUrl = 'https://j4pmbpsdwd.execute-api.us-east-1.amazonaws.com/prod/api/v1';
// const apiUrl = 'http://localhost:3000/api/v1';
export const uploadFile = (urls, params) => {
    return new Promise(async (resolve, reject) => {
        const options = {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        };
        options.headers['Content-Type'] = `${params.type}`;
        options.body = params;
        fetch(urls, options)
            .then((response) => {
                response
                    .json()
                    .then((body) => {
                        resolve({ statusCode: response.status, body });
                        console.log("body return = " + JSON.stringify(response));
                    })
                    .catch((error) => {
                        reject(error);
                        console.log("UPLAOD ERR1 = " + error);
                    });
            })
            .catch((error) => {
                reject(error);
                console.log("UPLAOD ERR2 = " + error);
            });
    });
}
export const addFile = (params) => {
    return new Promise(async (resolve, reject) => {
        try {
            let uploadFileUrl = await getData(`file?containerName=${'images'}&name=${params.fileName}`)
            if (uploadFileUrl.statusCode === 200) {
                let urls = uploadFileUrl.body;
                uploadFile(urls.signed_url, params);
                resolve(urls);
            } else {
                console.log(JSON.stringify(uploadFileUrl));
                reject('Can not connect to server.');
            }
        } catch (error) {
            reject(error);
        }
    });
}
export const getData = (url) => {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        };
        fetch(`${apiUrl}/${url}`, options)
            .then((response) => {
                response
                    .json()
                    .then((body) => {
                        resolve({ statusCode: response.status, body });
                    })
                    .catch((error) => {
                        reject(error);
                    });

            })
            .catch((error) => {
                reject(error);
            });
    });
}
export const addData = (url, params) => {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params)
        };
        fetch(`${apiUrl}/${url}`, options)
            .then((response) => {
                response
                    .json()
                    .then((body) => {
                        resolve({ statusCode: response.status, body });
                    })
                    .catch((error) => {
                        reject(error);
                    });

            })
            .catch((error) => {
                reject(error);
            });
    });
}
export const deleteData = (url) => {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        };
        fetch(`${apiUrl}/${url}`, options)
            .then((response) => {
                response
                    .json()
                    .then((body) => {
                        resolve({ statusCode: response.status, body });
                    })
                    .catch((error) => {
                        reject(error);
                    });
            })
            .catch((error) => {
                reject(error);
            });
    });
}