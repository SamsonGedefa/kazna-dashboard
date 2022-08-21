import React, { useCallback, useState, useRef } from "react";
import { useRouter } from "next/router";
import styles from "./Login.module.css";
import axios from "axios";

interface InputData {
  emailRef: string;
  passwordRef: string;
  usernameRef: string;
  nameRef: string;
}

export default function SignUp() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const usernameRef = useRef();
  const nameRef = useRef();

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const onSubmit = useCallback(async (e) => {
    e.preventDefault();

    const data = JSON.stringify({
      email: emailRef.current.value,
      name: nameRef.current.value,
      password: passwordRef.current.value,
      username: usernameRef.current.value,
    });

    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      setIsLoading(true);
      const response = await axios.post("/api/auth/signup", data, axiosConfig);
      router.push("/");
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.root}>
      <div className={styles.main}>
        <h1>Sign Up</h1>
        <form onSubmit={onSubmit}>
          <div className={styles.control}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" required ref={emailRef} />
          </div>
          <div className={styles.control}>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" required ref={passwordRef} />
          </div>
          <div className={styles.control}>
            <label htmlFor="username">Pick your Username</label>
            <input type="text" id="username" required ref={usernameRef} />
          </div>
          <div className={styles.control}>
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" required ref={nameRef} />
          </div>
          <div className={styles.actions}>
            <button>Create Account</button>
          </div>
        </form>
      </div>
    </div>
  );
}
