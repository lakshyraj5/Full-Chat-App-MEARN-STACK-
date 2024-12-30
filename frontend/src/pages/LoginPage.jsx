import { useState } from "react"


const LoginPage = () => {
  const [showPassword,setShowPassword]= useState(false);
  const [formData , setFormData] = useState({
    email:"",
    password:"",
  })
  const {login,isLoggingIn} = useAuthStore(); 

  return (
    <div>LoginPage</div>
  )
}

export default LoginPage


