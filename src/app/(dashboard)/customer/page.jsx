import CustomerClient from './CustomerClient'
export const metadata = {
  title: "Customer",
  description: "Customer",
}

export default function CustomerPage() {
  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="h-full flex flex-col p-3">
        <CustomerClient />
      </div>
    </div>
  )
} 