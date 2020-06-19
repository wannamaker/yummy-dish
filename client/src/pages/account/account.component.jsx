import React, { useState, useContext, useEffect } from 'react';
import { createUser } from '../../services/users'
import { useHistory } from 'react-router-dom';


 

const Account = () => {

  

  const [input, setInput] = useState({
    email: '',
    password: ''
  });

  const [newInput, setNewInput] = useState({
    fullName: '',
    signupEmail: '',
    signupPassword: ''
  });

  const [signup, setSignup] = useState(false)
  
   const handleChange = (e) => {
     const { name, value } = e.target
     setInput({ ...input, [name]: value })
   }
  
   const handleNewChange = (e) => {
    const { name, value } = e.target
     setNewInput({ ...newInput, [name]: value })
 }

    
  
  
  
  const handleSignup =  () => {
    setSignup(!signup)
  }


  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(newInput)
      const user = await createUser({ fullName: newInput.fullName, email: newInput.signupEmail, password: newInput.signupPassword })
    
    } catch (error) {
      console.log(error)
    }
  }
 
  const handleSubmit = (e) => {

 }
 
  

  return (
    
    <div>
          <button onClick={handleSignup}>Signup</button>

      {signup &&  
      
      <form onSubmit={handleSignupSubmit}>
        <input name="fullName" placeholder="Your name" type="text" value={input.fullName} onChange={handleNewChange} />
        <input name="signupEmail" placeholder="email" type="text" value={input.signupEmail} onChange={handleNewChange} />
        <input name="signupPassword" placeholder="password" type="password" value={input.signupPassword} onChange={handleNewChange} />
        <button>Login</button>
      </form>
   
    }
        
        <form onSubmit={handleSubmit}>
          <input name="email" placeholder="email" type="text" value={input.email} onChange={handleChange}/>
          <input name="password" placeholder="password" type="password" value={input.password} onChange={handleChange}/>
          <button>Login</button>
        </form>
      </div>
    )
  }


export default Account