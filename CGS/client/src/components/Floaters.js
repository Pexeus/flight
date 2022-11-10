import React from 'react'
import Map3d from "./Map3d"

function Floaters({socket}) {
  return (
    <div className='floaterContainer'>
        <Map3d socket={socket}/>
    </div>
  )
}

export default Floaters