import React from 'react'
import TakeControl from './TakeControl'

function ActionPanel({socket}) {
  return (
    <div className='actionPanel'>
        <TakeControl socket={socket}></TakeControl>
    </div>
  )
}

export default ActionPanel