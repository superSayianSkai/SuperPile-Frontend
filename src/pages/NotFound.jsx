import { Link } from "react-router"

const NotFound = () => {
  return (
    <div className="h-[100svh] flex flex-col justify-center items-center gap-2 ">
    <p className="text-[2rem]">Page Not Found</p>
    <Link to="/" className="text-[.8rem] underline cursor-pointer hover:text-gray-500">Go back home</Link> </div>
  )
}

export default NotFound