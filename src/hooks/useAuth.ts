import {type RoleUtilisateur} from "@matura/shared"
import {authStore} from "@/stores/authStore"
// import {useNavigate} from "@tanstack/react-router"


export const useAuth=(roles:RoleUtilisateur[])=>{
// const navigate=useNavigate()
const user=authStore((state)=>state.utilisateur);

if(user?.role){
    if(roles.includes(user.role)){
    return false;
    }else{
    return true;
}
}
}