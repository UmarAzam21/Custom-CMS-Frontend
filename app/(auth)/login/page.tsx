import LoginForm from '@/components/auth/LoginForm'
import Image from "next/image";

import React from 'react'


function login() {
  return (
    <div>
         <Image
        src="/primary-logo.png"
        alt="Filernow logo"
        width={56}
        height={56}
        className="mb-6"
      />

      <h1 className="text-lg font-semibold font-jakarta text-gray-900">
        Welcome Back Admin !
      </h1>
      <p className="mt-1 text-sm  font-inter text-gray">
        Sign in to access your dashboard &amp; Manage your Account.
      </p>
      <LoginForm />
    </div>
  )
}

export default login