import { RegisterForm } from "./RegisterForm"
import { Navbar } from "../../../PublicNav/NavBar"
export const Register = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center  py-12 px-4 sm:px-6 lg:px-8 bg-[#0a1128]"
    >
      <Navbar />
      <RegisterForm />
    </div>
  )
}