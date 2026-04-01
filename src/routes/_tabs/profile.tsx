import {createFileRoute} from "@tanstack/react-router";

export const Route = createFileRoute('/_tabs/profile')({
  component: Profile, // 2. On lui donne le composant à afficher
})

export default function Profile(){
    return (
     <div className="w-full h-100 flex justify-center items-center bg-slate-800 self-center">
        <h1 className="text-3xl font-bold">Profile</h1>
     </div>
    )
}