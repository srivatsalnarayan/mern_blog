import React from 'react';
import SignupForm from '../components/Forms/SignupForm';
import { useSignUp } from '../hooks/useSignup';

export default function Signup() {
  //Hooks
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  //Hook Datas
  const { signUp, error, isLoading } = useSignUp();

  //Handlers
  /**
   * Save Button 
   */
  const handleSubmit = async () => {
    await signUp(email, password);
  }
  return (
    <div align="center">
      <div className="container">
        <hr />
        <section className="hero is-medium" align="center">
          <SignupForm setEmail={setEmail} setPassword={setPassword} save={handleSubmit} error={error} isLoading={isLoading} />
        </section>
      </div>
    </div>
  )
}
