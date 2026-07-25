import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./component/Navbar/navbar";
import AppRoutes from './Routes/AppRoutes';

export default function App() {
  return (
    <>
      <Toaster position="top-center" />
      <BrowserRouter>
        <Navbar />
        <AppRoutes />
      </BrowserRouter>
    </>
  );
}
