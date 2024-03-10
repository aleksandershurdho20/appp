const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsText(file); 
    });
  };
  
  export const handleFileRead = async (file) => {
    try {
      const content = await readFileContent(file);
      const coordinates = parseExcelContent(content);
      return coordinates
    } catch (error) {
      console.error('Error reading file:', error);
    }
  };
  
  const parseExcelContent = (content) => {
    const lines = content.split(/\r\n|\n/);
    const coordinates = [];
  
    lines.forEach((line) => {
      const columns = line.split(',');
      if (columns.length >= 2) {
        const latitude = parseFloat(columns[2].trim());
        const longitude = parseFloat(columns[3].trim());
  
        if (!isNaN(latitude) && !isNaN(longitude)) {
          coordinates.push({ latitude, longitude });
        }
      }
    });
  
    return coordinates;
  };