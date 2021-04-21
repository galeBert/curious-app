module.exports.validateRegisterInput = (
    username,
    email,
    password,
    gender,
    birthday,
    mobileNumber,
) => {
    const errors = {};
    if(username.trim() === ''){
        errors.username = 'username tidak boleh kosong';
    }
    if(gender.trim() === ''){
        errors.username = 'gender tidak boleh kosong';
    }
    if(birthday.trim() === ''){
        errors.username = 'birthday tidak boleh kosong';
    }
    if(mobileNumber.trim() === ''){
        errors.username = 'nomor telefon tidak boleh kosong';
    }
    if(email.trim() === ''){
        errors.email = 'email tidak boleh kosong';
    } else {
        const regEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if(!email.match(regEx)) {
            errors.email = "format email tidak valid"
        }
    }
    if(password === '') {
        errors.password = "password tidak boleh kosong"
    } 

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}

module.exports.validateLoginInput = (username, password) => {
    const errors = {};
    if(username.trim() === ''){
        errors.username = "username tidak boleh kosong"
    }
    if (password === ''){
        errors.password = "password tidak boleh kosong"
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}