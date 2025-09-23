import { useMutation } from "@tanstack/react-query"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { signinUser } from "../services/auth"
import React, { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"


function Signin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        usernameRef.current?.focus()
    }, [])

    const mutation = useMutation({
        mutationFn: signinUser,
        onSuccess: (data) => {
            // alert(data.message);
            toast.success(data.message);
            const jwt = data.token;
            localStorage.setItem("token", jwt);
            setUsername("");
            setPassword("");
            navigate('/dashboard');
        },
        onError: (error: any) => {
            // alert(error.response?.data?.error || "Signin failed");
            toast.error(error.response?.data?.error || "Signin failed");
        }
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !password) {
            return
        }
        mutation.mutate({ username, password });
    }


    return (
        <div className=" bg-gray-200 w-screen h-screen flex justify-center items-center">
            <form
                onSubmit={handleSubmit}
                className="bg-white space-y-5 p-6 min-w-52 rounded-xl flex flex-col items-center">
                <div className="font-mono text-2xl">Welcome back!! Sign In </div>
                <div className="max-w-xs">
                    <Input ref={usernameRef} placeholder="Username" value={username} type="text" onChange={(e) => setUsername(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                passwordRef.current?.focus();
                            }
                        }}
                    />
                    <Input ref={passwordRef} placeholder="Password" value={password} type="password" onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="text-blue-500 hover:text-blue-600 hover:underline">
                    <Link to="/signup">Don't have an account? Signup</Link>
                </div>
                <Button isLoading={mutation.isPending} variant={"secondary"} text="Sign In" fullWidth size={"medium"} />
            </form>
        </div>
    )
}

export default Signin
