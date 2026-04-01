import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_tabs/')({
  component: RouteComponent,
})

function RouteComponent() {
  return  <div className="w-full h-screen flex justify-center items-center bg-amber">
           <h1 className="text-3xl font-bold">Hello "/_tabs/"!</h1>
          </div>
}
