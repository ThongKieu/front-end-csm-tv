import CustomerClient from './CustomerClient'
export const metadata = {
  title: "Customer",
  description: "Customer",
}

export default function CustomerPage() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <CustomerClient />
    </div>
  )
} 