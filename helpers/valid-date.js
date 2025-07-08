function validDate(dataString) {
    const regexData = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!regexData.test(dataString)) return false

    const [, diaStr, mesStr, anoStr] = dataString.match(regexData)
    const dia = parseInt(diaStr, 10)
    const mes = parseInt(mesStr, 10)
    const ano = parseInt(anoStr, 10)

    const data = new Date(ano, mes - 1, dia)
    return (
        data.getFullYear() === ano &&
        data.getMonth() === mes - 1 &&
        data.getDate() === dia
    )
}

module.exports = { validDate }
