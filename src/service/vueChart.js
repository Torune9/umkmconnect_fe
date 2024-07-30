import { Chart, registerables } from 'chart.js'

const regChart = ()=> Chart.register(...registerables)

export default regChart