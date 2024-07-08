export function isValidEmail(input:string) {
    return String(input)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        );
}

export function isValidPassword(input:string) {
    return String(input)
        .match(
            /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
        );
}

