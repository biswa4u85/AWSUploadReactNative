
const apiUrl = 'https://j4pmbpsdwd.execute-api.us-east-1.amazonaws.com/prod/api/v1';
// const apiUrl = 'http://localhost:3000/api/v1';
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