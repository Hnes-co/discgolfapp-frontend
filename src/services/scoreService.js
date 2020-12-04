import axios from 'axios'
const baseUrl = 'https://agile-headland-07227.herokuapp.com/api/results'  // Backend on internetissä herokun kautta

const getAll = () => { // funktio ratatulosten hakemista varten
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => { // funktio uuden ratatuloksen lähettämiseen
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}



export default { getAll, create }