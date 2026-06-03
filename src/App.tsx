import React from 'react'
import ChartsPage from './pages/Charts'

export default function App(){
  return (
    <div style={{fontFamily:'-apple-system,BlinkMacSystemFont,\"PingFang SC\",\"Microsoft YaHei\",sans-serif',padding:20}}>
      <h2>岗位工具箱 — 已集成 图表管理 (ECharts) + Firestore 持久化</h2>
      <p>导航： <a href="/">原始页面(静态)</a> • <a href="#charts">图表管理</a></p>
      <ChartsPage />
    </div>
  )
}
