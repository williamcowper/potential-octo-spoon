import React, { useEffect, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import { db } from '../firebase'
import { collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot, query, orderBy } from 'firebase/firestore'

type ChartEntry = {
  id?: string
  title: string
  option: any
}

export default function ChartsPage(){
  const [charts, setCharts] = useState<ChartEntry[]>([])
  const [title, setTitle] = useState('示例图表')
  const [jsonText, setJsonText] = useState('')

  useEffect(()=>{
    if(!db)return
    const q = query(collection(db,'charts'), orderBy('createdAt'))
    const unsub = onSnapshot(q, snap=>{
      const arr: ChartEntry[] = []
      snap.forEach(d=>{
        arr.push({id:d.id, title:d.data().title, option:d.data().option})
      })
      setCharts(arr)
    }, err=>{console.error(err)})
    return ()=>unsub()
  },[])

  async function handleAdd(){
    if(!db) {alert('未配置 Firebase，请参考 README 设置 VITE_FIREBASE_* 环境变量');return}
    let option:any
    try{ option = jsonText?JSON.parse(jsonText):{xAxis:{type:'category',data:['A','B','C']},yAxis:{type:'value'},series:[{type:'bar',data:[5,20,36]}] } }
    catch(e){alert('JSON 解析出错');return}
    await addDoc(collection(db,'charts'),{title,option,createdAt:new Date()})
    setTitle('')
    setJsonText('')
  }

  async function handleDelete(id?:string){ if(!id||!db) return; await deleteDoc(doc(db,'charts',id)) }

  async function handleUpdate(id?:string){
    if(!id||!db) return
    const newTitle = prompt('新的图表标题')
    if(!newTitle) return
    await updateDoc(doc(db,'charts',id),{title:newTitle})
  }

  return (
    <div id="charts">
      <h3>图表管理（存储在 Firestore 集合 charts）</h3>
      <div style={{display:'flex',gap:20}}>
        <div style={{flex:1}}>
          <label>标题：<input value={title} onChange={e=>setTitle(e.target.value)} /></label>
          <div style={{marginTop:8}}>
            <label>图表 Option(JSON)：</label>
            <textarea rows={8} style={{width:'100%'}} value={jsonText} onChange={e=>setJsonText(e.target.value)} placeholder='输入 ECharts option 的 JSON，留空使用示例'></textarea>
          </div>
          <button onClick={handleAdd} style={{marginTop:8}}>添加图表</button>
        </div>
        <div style={{width:520}}>
          <h4>已保存图表</h4>
          {charts.map(c=> (
            <div key={c.id} style={{border:'1px solid #eee',padding:8,marginBottom:8}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <strong>{c.title}</strong>
                <div>
                  <button onClick={()=>handleUpdate(c.id)}>编辑标题</button>
                  <button onClick={()=>handleDelete(c.id)} style={{marginLeft:8}}>删除</button>
                </div>
              </div>
              <div style={{height:240}}>
                <ReactECharts option={c.option} style={{height:'100%'}} />
              </div>
            </div>
          ))}
          {charts.length===0 && <div>暂时没有图表，使用左侧表单添加。</div>}
        </div>
      </div>
    </div>
  )
}
