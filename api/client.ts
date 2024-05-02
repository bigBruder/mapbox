import axios from 'axios';

function parseCSV(csvText: string) {
    const rows = csvText.split(/\r?\n/); 
    const data = [];
    for (let i = 6; i < rows.length; i++) {
        const rowData = rows[i].split(','); 
        if (!rowData[0] || !rowData[1] || !rowData[2] || !rowData[4] || !rowData[6] || !rowData[7] || !rowData[8] || !rowData[9]) continue;
        const rowObject = {
          name: rowData[0],
          longitude: Number(rowData[2]),
          latitude: Number(+rowData[1]),
          iconUrl: rowData[3].replace(/"/g, ''),
          type: rowData[6],
          placeName: rowData[7],
          address: rowData[8],
          description: rowData[9],
        };
        data.push(rowObject);
    }
    return data;
  }

export const getPoints = async () => {
    const {data} = await axios.get(process.env.EXPO_PUBLIC_SHEET_POINTS_LINK || "");
    return parseCSV(data);
};