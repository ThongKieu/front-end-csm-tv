import CustomerClient from './CustomerClient'
export const metadata = {
  title: "Customer",
  description: "Customer",
}

export default function CustomerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="flex flex-col p-3 h-full">
        <CustomerClient />
      </div>
    </div>
  )
} 