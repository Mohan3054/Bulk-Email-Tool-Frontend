import React, { useContext, useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
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

    const [inpval, setInpval] = useState({
        emails: "",
        subject: "",
        text: ""
    });

    const setVal = (e) => {
        // console.log(e.target.value);
        const { name, value } = e.target;

        setInpval(() => {
            return {
                ...inpval,
                [name]: value
            }
        })
    };


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
        const { emails,subject,text} = inpval;
        let token = localStorage.getItem("usersdatatoken");
         if (emails === "") {
            toast.error("email is required!", {
                position: "top-center"
            });
        } else if (!emails.includes("@")) {
            toast.warning("includes @ in your email!", {
                position: "top-center"
            });
        } else if (subject === "") {
            toast.warning("subject is required!", {
                position: "top-center"
            });
        } else if (text === "") {
            toast.warning("compose your mail", {
                position: "top-center"
            });
        } else {
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
            if (res.status === 201) {
                toast.success("Your Email Send Successfully done 😃!", {
                    position: "top-center"
                });
                setInpval({ ...inpval,emails: "",subject: "",text: ""});
            }if (res.status === 401) {
                toast.error("email not send", {
                    position: "top-center"
                });
                
            }
        }
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
                                <input type="email" class="form-control" id="exampleFormControlInput1" value={inpval.emails} onChange={setVal} name="emails" placeholder='Enter Your Email Address' onClick={(e) => setEmails(e.target.value)} />

                            </div>
                            <br />
                            <div class="mb-3 w-30">
                                <label for="exampleFormControlInput1" class="form-label">Subject</label>
                                <input type="text" class="form-control" id="exampleFormControlInput1" value={inpval.subject} onChange={setVal} name="subject" onClick={(e) => setSubject(e.target.value)} />
                            </div>
                            <div class="mb-3 w-30">
                                <label for="exampleFormControlTextarea1" class="form-label">Compose Email</label>
                                <textarea type="text" class="form-control" id="exampleFormControlTextarea1" value={inpval.text} onChange={setVal}name="text" rows="3" onClick={(e) => setText(e.target.value)}></textarea>
                            </div>
                            <button type="submit" onClick={sendEmail} class="btn btn-primary mb-3">Send</button>
                            <br/><br/><br/><br/><br/><p><b>Note:</b>One Email To Another Email Put On The Comma (  <b>,</b>  )</p>
                        </from>
                        <ToastContainer />
                    </div>
                </div>
            </div>

        </>

    )
}

export default Dashboard