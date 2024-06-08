// export class Utils {
//     static convertValue(e: string): string {
//         // Remove caracteres não numéricos e zeros a esquerda
//         let numericValue = e.replace(/[^\d]/g, '');
//         var removeCaracteres = numericValue.replace(/[,.]/g, '');
//         var value = removeCaracteres.replace(/^0+/, '');

//         // Preenche com zeros à esquerda se necessário
//         var result;
//         if (value.length === 0) {
//             result = "0,00"
//         } else if (value.length === 1) {
//             result = "0,0" + value;
//         } else if (value.length === 2) {
//             result = "0," + value;
//         } else if (value.length < 6) {
//             result = value.slice(0, -2) + "," + value.substr(value.length - 2);
//         } else if (value.length < 8) {
//             let decimal = value.substr(value.length - 2);
//             let hundred = value.substr(value.length - 5);
//             let thousand = value.slice(0, - 5);
//             result = thousand + "." + hundred.slice(0, -2) + "," + decimal;
//         } else {
//             return '';
//         }

//         return result;
//     }
// }