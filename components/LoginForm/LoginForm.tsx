import styles from './LoginForm.module.scss'
import { useAuth } from '@hooks/auth'
import { useRef, useState } from 'react'
import { useRouter } from 'next/router'

export function LoginForm() {
  const { signIn } = useAuth()
  const nameInputRef = useRef<HTMLInputElement>(null)
  const emailInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const name = nameInputRef.current.value
      const email = emailInputRef.current.value
      await signIn({ name, email })
      router.push('/posts')
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <section className={styles.authFormContainer}>
      <div className={styles.authForm}>
        <h1>LOGIN</h1>
        <form onSubmit={handleLogin}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            ref={nameInputRef}
            name="name"
            placeholder=""
          ></input>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            ref={emailInputRef}
            name="email"
            placeholder=""
          ></input>
          <button type="submit">GO</button>
        </form>
      </div>
    </section>
  )
}
