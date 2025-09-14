import React, { useState } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useMutation } from "@tanstack/react-query";
import { signupUser } from "../services/auth";
import { Link, useNavigate } from "react-router-dom";


export function Signup() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: signupUser,
        onSuccess: (data) => {
            alert(data.message);
            setUsername("");
            setPassword("");
            navigate('/signin');
        },
        onError: (error: any) => {
            alert(error.response?.data?.error || "Signup failed")
        }
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !password) {
            alert("Username and Password required");
            return;
        }
        mutation.mutate({ username, password });
    }

    return (
        <div className=" bg-gray-200 w-screen h-screen flex justify-center items-center">
            <form
                onSubmit={handleSubmit}
                className="bg-white space-y-5 p-6 min-w-52 rounded-xl flex flex-col items-center">
                <div className="font-mono text-2xl">Sign Up for Second Brain</div>
                <div className="max-w-xs">
                    <Input placeholder="Username"
                        value={username}
                        type="text"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <Input placeholder="Password"
                        value={password}
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="text-blue-500 hover:text-blue-600 hover:underline">
                    <Link to="/signin">Already have an account? Signin</Link>
                </div>
                <Button variant={"secondary"} isLoading={mutation.isPending} text="Sign Up" fullWidth size={"medium"} />
            </form>
        </div>
    )
}   