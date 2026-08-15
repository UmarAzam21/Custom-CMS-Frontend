import ResetPassword from '@/components/auth/ResetPassword'
import Image from "next/image";


function ResetPasswordPage() {
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
                Set new password
            </h1>
            <p className="mt-1 text-sm  font-inter text-gray">
                Set your new password according to the instructions.
            </p>
            <ResetPassword />
        </div>
    )
}

export default ResetPasswordPage