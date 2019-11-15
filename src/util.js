export function today() {
    const date = new Date();
    const year = date.getFullYear().toString();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return {year, month, day};
}

export function dateMMDDYYYY(arg) {
    const {year: y, month: m, day: d} = Object.assign(today(), arg);
    let year = '' + y;
    let month = '' + m;
    let day = '' + d;

    if (day.length === 1) {
        day = '0' + day;
    }

    if (month.length === 1) {
        month = '0' + month;
    }

    return month + '/' + day + '/' + year;
}

export function parseMMDDYYYY(dateStr) {
    let [month, day, year] = dateStr.split('/').map(x => +x);
    month += 1;

    return { year, month, day };
}

const cache = {};

export async function getTZoffset({lon, lat, year, month, day, api_key}) {
    let object = cache[[lon, lat, year, month, day]];
    if (object === undefined) {
        const timestamp = new Date(year, month - 1, day, 0, 0, 0, 0).getTime() / 1000;
        const url = `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lon}&timestamp=${timestamp}&key=${api_key}`;
        const response = await fetch(url);
        const obj = await response.json();
        if (obj.status !== 'OK') {
            console.error(obj);
            throw new Error(obj.errorMessage);
        }
        cache[[lon, lat, year, month, day]] = obj;
        object = obj;
    }
    return (object.dstOffset + object.rawOffset) / 60.0 / 60.0;
}

