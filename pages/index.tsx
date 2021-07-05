import { GetServerSideProps } from 'next'
import React from 'react'
import nookies from 'nookies'
import { LoginForm } from '../components/LoginForm/LoginForm'

export default function Home() {
  return (
    <div>
      <LoginForm />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const { 'supermetrics-auth': sl_token } = nookies.get(ctx)

    if (sl_token) {
      console.log(sl_token)
      console.log('afasfasf')
      return {
        redirect: {
          permanent: false,
          destination: '/posts',
        },
      }
    }
    return {
      props: {},
    }
  } catch (err) {
    console.log(err)
    return {
      props: {},
    }
  }
}
