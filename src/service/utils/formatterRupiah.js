const formatPriceToIDR = (price) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    }).format(price)
}
const formatRupiah = (value)=> {
    const numberString = value.replace(/\D/g, '');
    const formatted = new Intl.NumberFormat('id-ID').format(numberString);
    return formatted;
};
const convertToNumber = (str)=> {
    const cleanedStr = str.replace(/\./g, '');
    const number = parseInt(cleanedStr, 10);

    return number;
}


export default {formatPriceToIDR,formatRupiah,convertToNumber}