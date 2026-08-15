import ForgotForm from '@/components/auth/ForgotForm'
import Image from "next/image";


function ForgotPage() {
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
                Forgot Password
            </h1>
            <p className="mt-1 text-sm  font-inter text-gray">
                Enter the email address associated with your account and we will send you a link to reset your password.
            </p>
            <ForgotForm />
        </div>
    )
}

export default ForgotPage