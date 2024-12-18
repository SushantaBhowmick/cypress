import TaskHeader from '@/components/tasks/task-header'
import React from 'react'

interface LayoutProps{
    children:React.ReactNode,
    params:any
}

const layout:React.FC<LayoutProps> = ({children,params}) => {
    
  return (
    <div>
        <TaskHeader params={params} />
      {children}
    </div>
  )
}

export default layout
