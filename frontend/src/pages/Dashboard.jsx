import { Appbar } from "../components/Appbar"
import { Balance } from "../components/Balance"
import { Users } from "../components/Users"
import { useState,useEffect } from "react"
import axios from "axios"

export const Dashboard = () => {
    const [balance, setBalance] = useState(0);
    const fetchBal = async()=>{
        const response = await axios.get("http://localhost:3000/api/v1/account/balance", {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
        console.log(response)
        setBalance(response.data.balance)
    }
        useEffect(() => {
            try {
                fetchBal();
            } catch (error) {
                console.log(error)
            }
            
        }, []);
    return (<div>
        <Appbar />
        <div className="m-8">
            <Balance value={balance} />
            
            
            <Users />
        </div>
    </div>)
}
export default Dashboard