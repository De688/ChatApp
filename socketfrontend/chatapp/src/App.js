import React,{useEffect,useState} from 'react'
import './App.css'
import { MdFamilyRestroom, MdSend, MdSettingsBluetooth } from "react-icons/md";
import {  AiOutlinePoweroff} from "react-icons/ai";

import io from 'socket.io-client'
import Room from './room/Room.js'
import Scrolltobottom from 'react-scroll-to-bottom'
import moment from 'moment'


const socket = io.connect('http://localhost:5000')

function App() {
    const [bot, setbot] = useState('')
    const [room, setRoom] = useState('')
    const [name, setName] = useState('')
    const [joined, setJoined] = useState(false)
    const [sender, setSender] = useState(false)
    const [sentmessage, setsentmessage] = useState('')
    const [receivedmessage, setreceivedmessage] = useState([])
  
    const sendmessage= async(e)=>{
        e.preventDefault()
        if(sentmessage !== ''){
            const msgdata = {
                message:sentmessage,
                room:room,
                name:name,
                joined:joined,
                id:socket.id,
                time:moment.utc(Date.now()).local().startOf('minutes').fromNow()
            } 
        await socket.emit('msg', msgdata)
        setSender(true)
        setreceivedmessage((list)=>[...list,msgdata])
        }
        setsentmessage('')
    }

    const leavechat=async()=>{
        socket.emit('leavechat', name,room)
        setJoined(false)
    }
    
    useEffect(() => {

     socket.on('msg',(data)=>{
       console.log('hello there')
        setreceivedmessage((list)=>[...list,data])
        setSender(MdFamilyRestroom)
     })
     socket.on('leavemsg', (data)=>{
        setreceivedmessage((list)=>[...list,data])
     })
    },[socket])

    if(joined === false ){
        return(<Room socket={socket} room={room} setRoom={setRoom} name={name} setName={setName} setJoined={setJoined}/>)
    }
   
  return (
    
    <section className='maincontainer'>
        <div className='chatheader'>
           <h2>Live Chat</h2>
            <AiOutlinePoweroff onClick={leavechat} className='officon'/>
        </div>

        <div className='meinchat-area'>
            <Scrolltobottom className='chatarea'>
            {receivedmessage &&
            <div className={sender ? 'singlemsgcontainer':'singlemsgcontainer2'}>
            {/* handle croll to bottom automatically when message is added */}
           
              {receivedmessage.map((msg,i)=>
                  {
                      return<div className={msg.id === socket.id ? 'chatbox2': 'chatbox'} key={i}>
                      <div className={msg.id === socket.id ? 'chat': 'chat2'}>{msg.message}</div>
                      <div className={msg.id === socket.id ? 'chat3': 'chat4'}> {msg.id === socket.id? 'You': msg.name}.{msg.sender? msg.sender:msg.time}</div>
                      
                      </div>
                  }
              )}
             
             </div>}
            
         </Scrolltobottom>
         </div>
            <div className='inputpart'>
                <input className='textplace' value={sentmessage} type='text'  onChange={(e)=>setsentmessage(e.target.value)} placeholder='write message'/>
                <button className='btn primary' type='submit' onClick={sendmessage}><MdSend className='sendicon'/></button>
            </div>
       
    </section>
    
  )
}

export default App
