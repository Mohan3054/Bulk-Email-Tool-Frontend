import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { LoginContext } from './ContextProvider/Context';
import { URL } from '../App';
import "./mix.css";
const Dashboard = () => {

    const { logindata, setLoginData } = useContext(LoginContext);

    const [data, setData] = useState(false);
    const [emails, setEmails] = useState("");
    const [subject, setSubject] = useState("");
    const [text, setText] = useState("");


    const history = useNavigate();

    const DashboardValid = async () => {
        let token = localStorage.getItem("usersdatatoken");

        const res = await fetch(`${URL}/validuser`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        });

        const data = await res.json();

        if (data.status == 401 || !data) {
            history("*");
        } else {
            console.log("user verify");
            setLoginData(data)
            history("/dash");
        }
    }
    const sendEmail = async (e) => {
        e.preventDefault();
        let token = localStorage.getItem("usersdatatoken");
        const res = await fetch(`${URL}/bulkemailsend`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                emails,
                subject,
                text,
            })

        });
        const data = await res.json();
        console.log(data);
        // console.log(token);
    }

    useEffect(() => {
        setTimeout(() => {
            DashboardValid();
            setData(true)
        }, 2000)

    }, [])

    return (
        <>
            <div class="container">
                <div class="row">
                    <div class="d-flex justify-content-center">
                        <from>
                            <div class="mb-3 w-30" >
                                <label for="exampleFormControlInput1" class="form-label" >Emails</label>
                                <input type="email" class="form-control" id="exampleFormControlInput1" placeholder="name@example.com"onChange={(e) => setEmails(e.target.value)} />

                            </div>
                            <br />
                            <div class="mb-3 w-30">
                                <label for="exampleFormControlInput1" class="form-label">Subject</label>
                                <input type="text" class="form-control" id="exampleFormControlInput1"onChange={(e) => setSubject(e.target.value)} />
                            </div>
                            <div class="mb-3 w-30">
                                <label for="exampleFormControlTextarea1" class="form-label">Compose Email</label>
                                <textarea type="text" class="form-control" id="exampleFormControlTextarea1" rows="3"onChange={(e) => setText(e.target.value)}></textarea>
                            </div>
                            <button type="submit" onClick={sendEmail} class="btn btn-primary mb-3">Send</button>
                        </from>
            
                    </div>
                </div>
            </div>

        </>

    )
}

export default Dashboard