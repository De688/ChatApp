import React from 'react'
import './Room.css'


function Room({room,setRoom,name,setName,setJoined,socket}) {
    
    const joined_room =async()=>{
            if(room !== '' && name !== ''){
               await socket.emit('join_room', room)
            }
            setJoined(true)
    }
  return (
    <section className='roommaincontainer'>
                <h1 className='roomheader'>Chat Room</h1>

        <div className='roomcontainer'>
            <input className='roominput' type='text' value={name} onChange={(e)=>setName(e.target.value)} placeholder="enter name" />
            <input className='roominput' type='number' value={room} onChange={(e)=>setRoom(e.target.value)} placeholder="enter room" />
            <button disabled={!room && !name} className='roombtn' type='submit' onClick={joined_room}>Join room</button>
        </div>
    </section>
  )
}

export default Room