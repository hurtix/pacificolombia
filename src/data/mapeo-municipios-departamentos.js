// Mapeo correcto de municipios por departamento según la geografía real de Colombia
// Basado en los datos extraídos de WordPress

const MAPEO_MUNICIPIOS_DEPARTAMENTOS = {
  // ANTIOQUIA (ID: 4)
  "Turbo": { departamento_id: 4, departamento_nombre: "Antioquia" },
  
  // CAUCA (ID: 11) 
  "Guapi": { departamento_id: 11, departamento_nombre: "Cauca" },
  "Timbiquí": { departamento_id: 19, departamento_nombre: "Cauca" },
  "Miranda": { departamento_id: 11, departamento_nombre: "Cauca" },
  "Patía": { departamento_id: 11, departamento_nombre: "Cauca" },
  "Piendamó": { departamento_id: 11, departamento_nombre: "Cauca" },
  "Popayán": { departamento_id: 11, departamento_nombre: "Cauca" },
  "Puracé": { departamento_id: 11, departamento_nombre: "Cauca" },
  "Santander de Quilichao": { departamento_id: 11, departamento_nombre: "Cauca" },
  "Silvia": { departamento_id: 11, departamento_nombre: "Cauca" },
  "Suárez": { departamento_id: 11, departamento_nombre: "Cauca" },
  "Timbío": { departamento_id: 11, departamento_nombre: "Cauca" },
  "Inzá": { departamento_id: 11, departamento_nombre: "Cauca" },
  
  // CHOCÓ (ID: 33)
  "Acandí": { departamento_id: 33, departamento_nombre: "Chocó" },
  "Bahía Solano": { departamento_id: 33, departamento_nombre: "Chocó" },
  "Lloró": { departamento_id: 33, departamento_nombre: "Chocó" },
  "Nuquí": { departamento_id: 33, departamento_nombre: "Chocó" },
  "Quibdó": { departamento_id: 33, departamento_nombre: "Chocó" },
  
  // NARIÑO (ID: 39)
  "Barbacoas": { departamento_id: 39, departamento_nombre: "Nariño" },
  "Cumbal": { departamento_id: 39, departamento_nombre: "Nariño" },
  "El Charco": { departamento_id: 39, departamento_nombre: "Nariño" },
  "Ipiales": { departamento_id: 39, departamento_nombre: "Nariño" },
  "La Cruz": { departamento_id: 39, departamento_nombre: "Nariño" },
  "Ricaurte": { departamento_id: 39, departamento_nombre: "Nariño" },
  "San Andrés de Tumaco": { departamento_id: 39, departamento_nombre: "Nariño" },
  "Sandoná": { departamento_id: 39, departamento_nombre: "Nariño" },
  
  // VALLE DEL CAUCA (ID: 50)
  "Buenaventura": { departamento_id: 50, departamento_nombre: "Valle del Cauca" },
  "Cali": { departamento_id: 50, departamento_nombre: "Valle del Cauca" },
  "Calima": { departamento_id: 50, departamento_nombre: "Valle del Cauca" },
  "El Cerrito": { departamento_id: 50, departamento_nombre: "Valle del Cauca" },
  "Ginebra": { departamento_id: 50, departamento_nombre: "Valle del Cauca" },
  "Guadalajara de Buga": { departamento_id: 50, departamento_nombre: "Valle del Cauca" },
  "Jamundí": { departamento_id: 50, departamento_nombre: "Valle del Cauca" },
  "Palmira": { departamento_id: 50, departamento_nombre: "Valle del Cauca" },
  "Sevilla": { departamento_id: 50, departamento_nombre: "Valle del Cauca" },
  "Yotóco": { departamento_id: 50, departamento_nombre: "Valle del Cauca" }
};

export { MAPEO_MUNICIPIOS_DEPARTAMENTOS };