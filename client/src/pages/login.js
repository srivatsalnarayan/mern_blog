import React from 'react'
import LoginForm from '../components/Forms/LoginForm';
import { useLogin } from '../hooks/useLogin';

export default function Login() {

    /**
     * Hooks
     */
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const { login, error, isLoading } = useLogin();

    //Handlers
    /**
     * Save Button 
     */
    const handleSubmit = async () => {
        await login(email, password);
    }

    return (
        <div align="center">
            <div className="container">
                <hr />
                <section className="hero is-medium" align="center">
                    <LoginForm setEmail={setEmail} setPassword={setPassword} save={handleSubmit} error={error} isLoading={isLoading} />
                </section>
            </div>
        </div>
    )
}
