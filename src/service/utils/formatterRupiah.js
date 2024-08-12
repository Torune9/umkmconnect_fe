const formatPriceToIDR = (price) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    }).format(price)
}
const formatRupiah = (value) => {
    if (!value) return '';
    const numberString = value.replace(/\D/g, '');
    const formatted = new Intl.NumberFormat('id-ID').format(numberString);
    return formatted;
};

const convertToNumber = (str) => {
    if (!str) return null; // Return 0 for empty strings
    const cleanedStr = str.replace(/\./g, '');
    const number = parseInt(cleanedStr, 10);
    return isNaN(number) ? 0 : number; // Ensure no NaN value
};



export default {formatPriceToIDR,formatRupiah,convertToNumber}