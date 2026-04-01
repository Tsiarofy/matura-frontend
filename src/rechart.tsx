// import {
//   Card,
//   CardTitle,
// } from "@components/ui/card"
// import { InputGroupIcon} from "@components/InputGroup"
// import Step2 from "@components/Rechart"
import Step4 from "@components/Rechart2"
import {Textarea} from "@components/ui/textarea"
import {Button} from"@components/ui/button"
import {data} from "@components/Rechart2"
// import Step2 from "./components/Rechart"
import {useState} from "react"
import {type TypeCharte} from "@components/Rechart2"
import {Card} from "@components/ui/card"

function App() {

  const [newData,setNewData]=useState<TypeCharte[]>(data)
  const [alert,setAlert]=useState<string>()
  const [inputData,setInputData]=useState<TypeCharte>({
    name:"",
    uv:0
  })
  const handleClick=()=>{
  setAlert("")
  if(!(inputData.name&&inputData.uv)){
  setAlert("vous ne devez entrer les données avant de valider")
  }else{
    setNewData(prev=>[...prev,inputData])
    setInputData({
    name:"",
    uv:0
  })
   
  }
  }
  return (
    // 1. Le PARENT gère le centrage sur tout l'écran
    <div className="min-h-screen w-full flex justify-center items-center bg-slate-600 p-4">
      
      {/* 2. La CARD s'adapte selon l'écran */}

      {/* <Card className="w-full bg-white p-6 shadow-xl md:w-100">
          <CardTitle className="text-2xl font-bold mb-6 text-center">
            Login
          </CardTitle>
          
          <div className="space-y-4">
            <InputGroupIcon />
          </div>
      </Card> */}
      <div className="flex flex-col justify-evenly gap-3">
      <div className="self-center shadow-2xl bg-amber-200 h-screen w-full md:h-120 md:w-2xl flex justify-center items-center">
          <Step4 data={newData}/>
          {/* <Step2/> */}
      </div>
      <div>
        <Textarea value={inputData.name} onClick={()=>setAlert("")}
        onChange={({target})=>setInputData({name:target.value,uv:inputData.uv})}
         placeholder="Enter the value of the name"/>
      </div>   
      <div>
        <Textarea value={inputData.uv===0?undefined:inputData.uv} onClick={()=>setAlert("")}
         onChange={({target})=>setInputData({name:inputData.name,uv:Number(target.value)})}
         placeholder="Enter the value of the UV"/>
      </div>  
      <Button className="w-30 self-center md:w-50" onClick={handleClick}>valider</Button>
      </div>
      {
      alert&&<Card className="shadow-2xl text-red-400 bg-white/10 border-2 border-slate-5">{alert}</Card>
      } 
      
    </div>
  )
}

export default App
