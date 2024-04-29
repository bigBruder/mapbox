import axios from 'axios';

function parseCSV(csvText) {
    const rows = csvText.split(/\r?\n/); 
    const data = [];
    for (let i = 4; i < rows.length; i++) {
        const rowData = rows[i].split(','); 
        if (!rowData[0] || !rowData[1] || !rowData[2] || !rowData[4]) continue;
        const rowObject = {
          name: rowData[0],
          longitude: Number(rowData[2]),
          latitude: Number(+rowData[1]),
          iconUrl: rowData[3].replace(/"/g, ''),
        };
        data.push(rowObject);
    }
    return data;
  }

export const getPoints = async () => {
    const {data} = await axios.get(process.env.EXPO_PUBLIC_SHEET_POINTS_LINK);
    console.log('parseCSV(data) =>', parseCSV(data));
    return parseCSV(data);
};